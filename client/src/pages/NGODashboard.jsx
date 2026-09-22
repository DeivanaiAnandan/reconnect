import React, { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import app from "../firebase";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const auth = getAuth(app);

const NGODashboard = () => {
  const [ngo, setNgo] = useState(null);
  const [users, setUsers] = useState([]);
  const [assistanceRequests, setAssistanceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNGOData = async () => {
      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          setError("Please login first.");
          setLoading(false);
          return;
        }

        const token = await currentUser.getIdToken();

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // Fetch logged-in NGO profile
        const ngoResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/ngos/me`,
          {
            headers,
          },
        );

        if (!ngoResponse.ok) {
          let errorMessage = `Request failed with status ${ngoResponse.status}`;

          const contentType = ngoResponse.headers.get("content-type");

          if (contentType?.includes("application/json")) {
            const errorData = await ngoResponse.json();
            errorMessage = errorData.message || errorMessage;
          }

          throw new Error(errorMessage);
        }

        const ngoData = await ngoResponse.json();

        setNgo(ngoData);

        // Fetch users in NGO's assigned region
        const usersResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/ngos/users`,
          {
            headers,
          },
        );

        if (!usersResponse.ok) {
          let errorMessage = `Request failed with status ${usersResponse.status}`;

          const contentType = usersResponse.headers.get("content-type");

          if (contentType?.includes("application/json")) {
            const errorData = await usersResponse.json();
            errorMessage = errorData.message || errorMessage;
          }

          throw new Error(errorMessage);
        }

        const usersData = await usersResponse.json();

        setUsers(usersData);

        // Fetch assistance requests in NGO's assigned region
        const requestsResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/ngos/assistance-requests`,
          {
            headers,
          },
        );

        if (!requestsResponse.ok) {
          let errorMessage = `Request failed with status ${requestsResponse.status}`;

          const contentType = requestsResponse.headers.get("content-type");

          if (contentType?.includes("application/json")) {
            const errorData = await requestsResponse.json();
            errorMessage = errorData.message || errorMessage;
          }

          throw new Error(errorMessage);
        }

        const requestsData = await requestsResponse.json();

        setAssistanceRequests(requestsData);
      } catch (error) {
        console.error("Error fetching NGO data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNGOData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
      setError("Failed to logout. Please try again.");
    }
  };

  const pendingRequests = assistanceRequests.filter(
    (request) => request.status === "Pending",
  ).length;

  const inProgressRequests = assistanceRequests.filter(
    (request) => request.status === "In Progress",
  ).length;

  const resolvedRequests = assistanceRequests.filter(
    (request) => request.status === "Resolved",
  ).length;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-xl text-white">
            R
          </div>
          <p className="mt-4 text-sm font-medium text-slate-600">
            Loading NGO portal...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <Card className="w-full max-w-md border-red-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-xl">
              !
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900">
              Something went wrong
            </h2>

            <p className="mt-2 text-sm text-red-600">{error}</p>

            <Button
              onClick={() => window.location.reload()}
              className="mt-6 bg-slate-900 hover:bg-slate-800"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* =========================================================
          HEADER
      ========================================================= */}
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-900 shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg font-bold text-slate-900">
              R
            </div>

            <div>
              <p className="text-lg font-bold tracking-tight text-white">
                ReConnect
              </p>

              <p className="text-xs text-slate-400">
                NGO Community Support Portal
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-slate-600 bg-transparent text-slate-200 hover:bg-slate-800 hover:text-white"
          >
            Logout
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* =========================================================
            WELCOME SECTION
        ========================================================= */}
        <section className="mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-blue-700">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                NGO Portal
              </div>

              <h1 className="text-xl font-bold tracking-tight sm:text-3xl text-slate-900">
                {ngo?.name || "Community Support"}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                View community users and assistance requests from your assigned
                region.
              </p>
            </div>

            {ngo?.regionId && (
              <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Assigned Region
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {ngo.regionId.region}
                </p>

                <p className="text-sm text-slate-500">
                  {ngo.regionId.stateProvince}, {ngo.regionId.country}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* =========================================================
            SUMMARY CARDS
        ========================================================= */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* Users */}
          <Card className="border-slate-200 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Community Users
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {users.length}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-lg">
                  👥
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-500">
                Users in your region
              </p>
            </CardContent>
          </Card>

          {/* Total */}
          <Card className="border-slate-200 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Total Requests
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {assistanceRequests.length}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-lg">
                  📋
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-500">Assistance requests</p>
            </CardContent>
          </Card>

          {/* Pending */}
          <Card className="border-slate-200 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Pending
                  </p>

                  <p className="mt-2 text-3xl font-bold text-amber-600">
                    {pendingRequests}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-lg">
                  ⏳
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-500">Awaiting resolution</p>
            </CardContent>
          </Card>

          {/* In Progress */}
          <Card className="border-slate-200 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    In Progress
                  </p>

                  <p className="mt-2 text-3xl font-bold text-blue-600">
                    {inProgressRequests}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-lg">
                  🔄
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-500">
                Currently being handled
              </p>
            </CardContent>
          </Card>

          {/* Resolved */}
          <Card className="border-slate-200 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Resolved
                  </p>

                  <p className="mt-2 text-3xl font-bold text-emerald-600">
                    {resolvedRequests}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-lg">
                  ✓
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-500">Completed requests</p>
            </CardContent>
          </Card>
        </section>

        {/* =========================================================
            COMMUNITY USERS
        ========================================================= */}
        <Card className="mt-8 overflow-hidden border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-200 bg-white px-6 py-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">
                  Community Users
                </CardTitle>

                <p className="mt-1 text-sm text-slate-500">
                  Users belonging to your assigned region.
                </p>
              </div>

              <div className="w-fit rounded-lg bg-blue-50 px-3 py-2 text-center">
                <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
                  Users
                </p>

                <p className="text-lg font-bold text-blue-700">
                  {users.length}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {users.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-xl">
                  👥
                </div>

                <p className="mt-4 font-semibold text-slate-700">
                  No users found
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  There are currently no registered users in this region.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px]">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-left">
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Name
                      </th>

                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Age
                      </th>

                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Gender
                      </th>

                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Phone
                      </th>

                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Region
                      </th>

                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Skills
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user._id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                              {user.name
                                ? user.name.charAt(0).toUpperCase()
                                : "?"}
                            </div>

                            <span className="font-semibold text-slate-900">
                              {user.name}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-600">
                          {user.age}
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-600">
                          {user.gender}
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-600">
                          {user.phone}
                        </td>

                        <td className="px-4 py-4">
                          <p className="text-sm font-medium text-slate-700">
                            {user.region}
                          </p>

                          <p className="text-xs text-slate-400">
                            {user.stateProvince}
                          </p>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {user.skills?.length ? user.skills.join(", ") : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* =========================================================
            ASSISTANCE REQUESTS
        ========================================================= */}
        <Card className="mt-8 overflow-hidden border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-200 bg-white px-6 py-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">
                  Assistance Requests
                </CardTitle>

                <p className="mt-1 text-sm text-slate-500">
                  Requests submitted by users in your assigned region.
                </p>
              </div>

              <div className="w-fit rounded-lg bg-blue-50 px-3 py-2 text-center">
                <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
                  Requests
                </p>

                <p className="text-lg font-bold text-blue-700">
                  {assistanceRequests.length}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {assistanceRequests.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 px-6 py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-xl">
                  📋
                </div>

                <p className="mt-4 font-semibold text-slate-700">
                  No assistance requests
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  No assistance requests have been submitted in this region.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {assistanceRequests.map((request) => (
                  <div
                    key={request._id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-md"
                  >
                    {/* Request Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                          {request.userId?.name
                            ? request.userId.name.charAt(0).toUpperCase()
                            : "U"}
                        </div>

                        <div>
                          <p className="font-bold text-slate-900">
                            {request.userId?.name || "User"}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {request.userId?.phone || "Phone not available"}
                          </p>
                        </div>
                      </div>

                      {/* Read-only Status */}
                      <div
                        className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${
                          request.status === "Resolved"
                            ? "bg-emerald-100 text-emerald-700"
                            : request.status === "In Progress"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {request.status}
                      </div>
                    </div>

                    <div className="my-5 border-t border-slate-100" />

                    {/* Assistance Types */}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Assistance Required
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {request.assistanceType?.map((type) => (
                          <span
                            key={type}
                            className="rounded-lg bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 ring-1 ring-slate-200"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    {request.description && (
                      <div className="mt-5 rounded-xl bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Description
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          {request.description}
                        </p>
                      </div>
                    )}

                    {/* Request Information */}
                    <div className="mt-5 grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Region
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-700">
                          {request.regionId?.region || "Not available"}
                        </p>

                        <p className="text-xs text-slate-500">
                          {request.regionId?.stateProvince || ""}
                          {request.regionId?.country
                            ? `, ${request.regionId.country}`
                            : ""}
                        </p>
                      </div>

                      <div className="sm:text-right">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Submitted
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-700">
                          {request.createdAt
                            ? new Date(request.createdAt).toLocaleDateString()
                            : "Not available"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <footer className="mt-12 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6 text-center">
          <p className="text-sm font-medium text-slate-600">ReConnect</p>

          <p className="mt-1 text-xs text-slate-400">
            Displaced Community Support Platform
          </p>
        </div>
      </footer>
    </div>
  );
};

export default NGODashboard;
