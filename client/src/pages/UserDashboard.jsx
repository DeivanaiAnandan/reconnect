import React, { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import app from "../firebase";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

const auth = getAuth(app);

const UserDashboard = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [assistanceRequests, setAssistanceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          setError("Please login first.");
          setLoading(false);
          return;
        }

        const token = await currentUser.getIdToken();

        // Fetch profile
        const profileResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const profileData = await profileResponse.json();

        if (!profileResponse.ok) {
          throw new Error(profileData.message || "Failed to fetch profile");
        }

        setProfile(profileData.profile);

        // Fetch assistance requests
        const requestResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/assistance-requests/my`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const requestData = await requestResponse.json();

        if (!requestResponse.ok) {
          throw new Error(
            requestData.message || "Failed to fetch assistance requests",
          );
        }

        setAssistanceRequests(requestData.requests || []);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleEditProfile = () => {
    navigate("/complete-profile", {
      state: {
        mode: "edit",
      },
    });
  };

  const handleDeactivateAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate your account?",
    );

    if (!confirmed) return;

    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        setError("Please login first.");
        return;
      }

      const token = await currentUser.getIdToken();

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/me/deactivate`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to deactivate account");
      }

      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error deactivating account:", error);
      setError(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      setError("Failed to logout. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

          <p className="text-sm font-medium text-slate-500">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <Card className="w-full max-w-md border-red-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold text-slate-900">
              Something went wrong
            </h2>

            <p className="mt-3 text-sm text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-7">
        {/* Header */}
        <Card className="overflow-hidden border-0 bg-white shadow-md">
          <CardContent className="p-0">
            <div className="bg-slate-900 px-6 py-7 sm:px-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-lg text-white">
                      ↗
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        ReConnect
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-300">
                        Community Support Portal
                      </p>
                    </div>
                  </div>

                  <h1 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Welcome, {profile?.name}
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                    Manage your profile and track your support requests from one
                    place.
                  </p>
                </div>

                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="border-slate-600 bg-transparent font-semibold text-white hover:border-slate-400 hover:bg-white/10 hover:text-white"
                >
                  Logout
                </Button>
              </div>
            </div>

            {/* Summary */}
            <div className="grid divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              <div className="px-6 py-5 sm:px-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Location
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  {profile?.region}
                </p>
              </div>

              <div className="px-6 py-5 sm:px-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Requests
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  {assistanceRequests.length}{" "}
                  {assistanceRequests.length === 1 ? "Request" : "Requests"}
                </p>
              </div>

              <div className="px-6 py-5 sm:px-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Account
                </p>

                <p className="mt-1 font-semibold text-emerald-600">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* My Profile */}
        <Card className="border-slate-200 shadow-sm transition-shadow hover:shadow-md">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
              My Profile
            </CardTitle>

            <CardDescription>
              Your personal information registered with ReConnect.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["Name", profile?.name],
                ["Email", profile?.email],
                ["Age", profile?.age],
                ["Gender", profile?.gender],
                ["Phone", profile?.phone],
                ["Local Language", profile?.localLanguage],
                ["Region", profile?.region],
                ["State / Province", profile?.stateProvince],
                ["Country", profile?.country],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-slate-100"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {label}
                  </p>

                  <p className="mt-2 font-semibold text-slate-800">
                    {value || "—"}
                  </p>
                </div>
              ))}

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2 lg:col-span-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Skills
                </p>

                <p className="mt-2 font-semibold text-slate-800">
                  {profile?.skills?.join(", ") || "No skills added"}
                </p>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={handleEditProfile}
                className="bg-slate-900 font-semibold text-white shadow-sm hover:bg-slate-800"
              >
                Edit Profile
              </Button>

              <Button
                onClick={handleDeactivateAccount}
                variant="destructive"
                className="font-semibold"
              >
                Deactivate Account
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* My Assistance Requests */}
        <Card className="border-slate-200 shadow-sm transition-shadow hover:shadow-md">
          <CardHeader className="border-b border-slate-100">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
                  My Assistance Requests
                </CardTitle>

                <CardDescription className="mt-1">
                  Track the support requests you have submitted.
                </CardDescription>
              </div>

              <Button
                onClick={() => navigate("/assistance-request")}
                className="bg-slate-900 font-semibold text-white shadow-sm hover:bg-slate-800"
              >
                + Request Assistance
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6 sm:p-8">
            {/* No requests */}
            {assistanceRequests.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-xl text-white">
                  +
                </div>

                <h3 className="mt-4 text-xl font-bold text-slate-900">
                  No assistance requests yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  If you need support, you can submit an assistance request to
                  connect with available support services.
                </p>

                <Button
                  onClick={() => navigate("/assistance-request")}
                  className="mt-6 bg-slate-900 px-7 font-semibold text-white shadow-sm hover:bg-slate-800"
                >
                  Request Assistance
                </Button>
              </div>
            ) : (
              <div className="space-y-5">
                {assistanceRequests.map((request, index) => {
                  const isResolved = request.status === "Resolved";
                  const isPending = request.status === "Pending";

                  return (
                    <div
                      key={request._id}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md"
                    >
                      {/* Request Header */}
                      <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Request #{index + 1}
                          </p>

                          <h3 className="mt-2 text-lg font-bold text-slate-900">
                            {request.assistanceType?.join(", ")}
                          </h3>
                        </div>

                        <span
                          className={`w-fit rounded-full px-4 py-1.5 text-xs font-bold ${
                            isResolved
                              ? "bg-emerald-100 text-emerald-700"
                              : isPending
                                ? "bg-amber-100 text-amber-700"
                                : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {request.status}
                        </span>
                      </div>

                      {/* Request Details */}
                      <div className="p-5 sm:p-6">
                        <div className="grid gap-5 sm:grid-cols-2">
                          <div className="sm:col-span-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                              Description
                            </p>

                            <p className="mt-2 leading-6 text-slate-700">
                              {request.description ||
                                "No description provided."}
                            </p>
                          </div>

                          {request.regionId && (
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Region
                              </p>

                              <p className="mt-2 font-semibold text-slate-800">
                                {request.regionId.region},{" "}
                                {request.regionId.stateProvince}
                              </p>
                            </div>
                          )}

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                              Submitted
                            </p>

                            <p className="mt-2 font-semibold text-slate-800">
                              {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Resolved information */}
                        {isResolved && (
                          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                            <p className="font-bold text-emerald-800">
                              This assistance request has been resolved.
                            </p>

                            <p className="mt-1 text-sm text-emerald-700">
                              You can submit another request whenever you need
                              additional assistance.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Bottom action */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
                  <p className="font-semibold text-slate-800">
                    Need additional assistance?
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    You can submit another assistance request whenever you need
                    support.
                  </p>

                  <Button
                    onClick={() => navigate("/assistance-request")}
                    className="mt-4 bg-slate-900 font-semibold text-white shadow-sm hover:bg-slate-800"
                  >
                    + Submit Assistance Request
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
