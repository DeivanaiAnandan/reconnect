import React, { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import app from "../firebase";

const auth = getAuth(app);

const UserDashboard = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          setError("Please login first.");
          return;
        }

        const token = await currentUser.getIdToken();

        const response = await fetch("http://localhost:5000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch profile");
        }

        setProfile(data.profile);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-10">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-10">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }
  const handleEditProfile = () => {
    navigate("/complete-profile");
  };

  const handleDeactivateAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate your account?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        setError("Please login first.");
        return;
      }

      const token = await currentUser.getIdToken();

      const response = await fetch(
        "http://localhost:5000/api/users/me/deactivate",
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

      console.log("Account deactivated:", data);

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
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between rounded-xl bg-white p-8 shadow">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Welcome, {profile?.name}
            </h1>

            <p className="mt-2 text-slate-600">ReConnect User Dashboard</p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <div className="mt-6 rounded-xl bg-white p-8 shadow">
          <h2 className="text-xl font-semibold text-slate-800">My Profile</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500">Name</p>
              <p className="font-medium">{profile?.name}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Email</p>
              <p className="font-medium">{profile?.email}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Age</p>
              <p className="font-medium">{profile?.age}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Gender</p>
              <p className="font-medium">{profile?.gender}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Phone</p>
              <p className="font-medium">{profile?.phone}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Local Language</p>
              <p className="font-medium">{profile?.localLanguage}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Region</p>
              <p className="font-medium">
                {profile?.region}, {profile?.stateProvince}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Country</p>
              <p className="font-medium">{profile?.country}</p>
            </div>

            <div className="md:col-span-2">
              <p className="text-sm text-slate-500">Skills</p>
              <p className="font-medium">{profile?.skills?.join(", ")}</p>
            </div>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <button
            onClick={handleEditProfile}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            Edit Profile
          </button>

          <button
            onClick={handleDeactivateAccount}
            className="rounded-lg bg-red-600 px-6 py-3 font-medium text-white hover:bg-red-700"
          >
            Deactivate My Account
          </button>
        </div>
        <div className="mt-6">
          <button
            onClick={() => navigate("/assistance-request")}
            className="w-full rounded-lg bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700"
          >
            Request Assistance
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
