import React, { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import app from "../firebase";

const auth = getAuth(app);

const SuperAdminDashboard = () => {
  const [regions, setRegions] = useState([]);
  const [users, setUsers] = useState([]);
  const [ngos, setNgos] = useState([]);

  const [showUsers, setShowUsers] = useState(false);
  const [showNGOs, setShowNGOs] = useState(false);

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingNGOs, setLoadingNGOs] = useState(false);

  const [showCreateNGO, setShowCreateNGO] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    localLanguage: "",
    region: "",
    stateProvince: "",
    country: "",
    firebaseUid: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch regions
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          setError("Please login first.");
          return;
        }

        const token = await currentUser.getIdToken();

        const response = await fetch("http://localhost:5000/api/regions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch regions");
        }

        setRegions(data);
      } catch (error) {
        console.error("Error fetching regions:", error);
        setError(error.message);
      }
    };

    fetchRegions();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleViewUsers = async () => {
    try {
      setError("");
      setLoadingUsers(true);
      setShowUsers(true);
      setShowNGOs(false);

      const currentUser = auth.currentUser;

      if (!currentUser) {
        setError("Please login first.");
        return;
      }

      const token = await currentUser.getIdToken();

      const response = await fetch("http://localhost:5000/api/users", {
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
      console.error("Error fetching users:", error);
      setError(error.message);
    } finally {
      setLoadingUsers(false);
    }
  };
  const handleViewNGOs = async () => {
    try {
      setError("");
      setLoadingNGOs(true);
      setShowNGOs(true);
      setShowUsers(false);

      const currentUser = auth.currentUser;

      if (!currentUser) {
        setError("Please login first.");
        return;
      }

      const token = await currentUser.getIdToken();

      const response = await fetch("http://localhost:5000/api/ngos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch NGOs");
      }

      setNgos(data);
    } catch (error) {
      console.error("Error fetching NGOs:", error);
      setError(error.message);
    } finally {
      setLoadingNGOs(false);
    }
  };
  // Handle region selection
  const handleRegionChange = (e) => {
    const selectedRegionName = e.target.value;

    const selectedRegion = regions.find(
      (region) => region.region === selectedRegionName,
    );

    if (!selectedRegion) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      region: selectedRegion.region,
      stateProvince: selectedRegion.stateProvince,
      country: selectedRegion.country,
    }));
  };
  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
      setError("Failed to logout. Please try again.");
    }
  };
  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      localLanguage: "",
      region: "",
      stateProvince: "",
      country: "",
      firebaseUid: "",
    });

    setMessage("");
    setError("");
  };

  // Create NGO
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        setError("Please login first.");
        return;
      }

      const token = await currentUser.getIdToken();

      const response = await fetch("http://localhost:5000/api/ngos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create NGO");
      }

      console.log("Created NGO:", data);

      setMessage(
        "NGO onboarded successfully and assigned to the selected region.",
      );

      resetForm();
    } catch (error) {
      console.error("Error creating NGO:", error);
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between rounded-xl bg-white p-8 shadow">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Super Admin Dashboard
            </h1>

            <p className="mt-2 text-slate-600">
              Onboard NGOs and assign them to their responsible region.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>
        <div className="mt-6 flex flex-wrap gap-4">
          <button
            onClick={() => {
              setShowCreateNGO(true);
              setShowUsers(false);
              setShowNGOs(false);
            }}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            + Create NGO
          </button>

          <button
            onClick={handleViewUsers}
            className="rounded-lg bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700"
          >
            View All Users
          </button>

          <button
            onClick={handleViewNGOs}
            className="rounded-lg bg-slate-700 px-6 py-3 font-medium text-white hover:bg-slate-800"
          >
            View All NGOs
          </button>
        </div>
        {/* NGO Form */}
        {showCreateNGO && (
          <div className="mt-6 rounded-xl bg-white p-8 shadow">
            <h2 className="text-2xl font-semibold text-slate-800">
              Onboard NGO
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Enter the NGO details and select the region it will serve.
            </p>

            {/* Success message */}
            {message && (
              <div className="mt-6 rounded-lg bg-green-100 p-4 text-green-700">
                {message}
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="mt-6 rounded-lg bg-red-100 p-4 text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {/* NGO Name */}
              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  NGO Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter NGO name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-3"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter NGO email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-3"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  placeholder="Enter NGO phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-3"
                  required
                />
              </div>

              {/* Local Language */}
              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  Local Language
                </label>

                <select
                  name="localLanguage"
                  value={formData.localLanguage}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-3"
                  required
                >
                  <option value="">Select Local Language</option>

                  <option value="Tamil">Tamil</option>
                  <option value="Malayalam">Malayalam</option>
                  <option value="Kannada">Kannada</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Nepali">Nepali</option>
                  <option value="English">English</option>
                </select>
              </div>

              {/* Region */}
              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  Assigned Region
                </label>

                <select
                  name="region"
                  value={formData.region}
                  onChange={handleRegionChange}
                  className="w-full rounded-lg border px-4 py-3"
                  required
                >
                  <option value="">Select Region</option>

                  {regions.map((region) => (
                    <option key={region._id} value={region.region}>
                      {region.region}, {region.stateProvince}, {region.country}
                    </option>
                  ))}
                </select>
              </div>

              {/* State */}
              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  State / Province
                </label>

                <input
                  type="text"
                  value={formData.stateProvince}
                  readOnly
                  className="w-full rounded-lg border bg-slate-100 px-4 py-3"
                />
              </div>

              {/* Country */}
              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  Country
                </label>

                <input
                  type="text"
                  value={formData.country}
                  readOnly
                  className="w-full rounded-lg border bg-slate-100 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  Firebase UID
                </label>

                <input
                  type="text"
                  name="firebaseUid"
                  placeholder="Enter Firebase UID"
                  value={formData.firebaseUid}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-3"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
                >
                  Onboard NGO
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 rounded-lg border border-slate-300 px-4 py-3 font-medium text-slate-700 hover:bg-slate-100"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        )}

        {showUsers && (
          <div className="mt-6 rounded-xl bg-white p-8 shadow">
            <h2 className="text-2xl font-semibold text-slate-800">All Users</h2>

            {loadingUsers ? (
              <p className="mt-4">Loading users...</p>
            ) : (
              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b bg-slate-100 text-left">
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Age</th>
                      <th className="px-4 py-3">Gender</th>
                      <th className="px-4 py-3">Phone</th>
                      <th className="px-4 py-3">Region</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="border-b">
                        <td className="px-4 py-3">{user.name}</td>

                        <td className="px-4 py-3">{user.email}</td>

                        <td className="px-4 py-3">{user.age}</td>

                        <td className="px-4 py-3">{user.gender}</td>

                        <td className="px-4 py-3">{user.phone}</td>

                        <td className="px-4 py-3">
                          {user.region}, {user.stateProvince}
                        </td>

                        <td className="px-4 py-3">{user.accountStatus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {showNGOs && (
          <div className="mt-6 rounded-xl bg-white p-8 shadow">
            <h2 className="text-2xl font-semibold text-slate-800">All NGOs</h2>

            {loadingNGOs ? (
              <p className="mt-4">Loading NGOs...</p>
            ) : (
              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b bg-slate-100 text-left">
                      <th className="px-4 py-3">NGO Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Phone</th>
                      <th className="px-4 py-3">Local Language</th>
                      <th className="px-4 py-3">Region ID</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {ngos.map((ngo) => (
                      <tr key={ngo._id} className="border-b">
                        <td className="px-4 py-3">{ngo.name}</td>

                        <td className="px-4 py-3">{ngo.email}</td>

                        <td className="px-4 py-3">{ngo.phone}</td>

                        <td className="px-4 py-3">{ngo.localLanguage}</td>

                        <td className="px-4 py-3">{ngo.regionId}</td>

                        <td className="px-4 py-3">{ngo.accountStatus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
