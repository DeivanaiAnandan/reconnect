import React, { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import app from "../firebase";

const auth = getAuth(app);

const NGODashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          setError("Please login first.");
          return;
        }

        const token = await currentUser.getIdToken();

        const response = await fetch("http://localhost:5000/api/ngos/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch users");
        }

        setUsers(data);
      } catch (error) {
        console.error("Error fetching NGO users:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <p className="p-10">Loading beneficiaries...</p>;
  }

  if (error) {
    return <p className="p-10 text-red-600">{error}</p>;
  }
  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
      setError("Failed to logout. Please try again.");
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">NGO Dashboard</h1>

          <p className="mt-2 text-slate-600">
            Beneficiaries in your assigned region
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-lg bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <div className="mt-8 overflow-x-auto rounded-lg bg-white shadow">
        <table className="min-w-full">
          <thead>
            <tr className="border-b bg-slate-100 text-left">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Age</th>
              <th className="px-6 py-4">Gender</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Region</th>
              <th className="px-6 py-4">Skills</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b">
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.age}</td>
                <td className="px-6 py-4">{user.gender}</td>
                <td className="px-6 py-4">{user.phone}</td>
                <td className="px-6 py-4">
                  {user.region}, {user.stateProvince}
                </td>
                <td className="px-6 py-4">{user.skills?.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NGODashboard;
