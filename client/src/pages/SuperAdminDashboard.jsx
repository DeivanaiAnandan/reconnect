import React, { useEffect, useState, useRef } from "react";
import { getAuth, signOut } from "firebase/auth";
import app from "../firebase";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
const auth = getAuth(app);

const SuperAdminDashboard = () => {
  const usersSectionRef = useRef(null);
  const ngosSectionRef = useRef(null);
  const assistanceSectionRef = useRef(null);
  const createNgoSectionRef = useRef(null);

  const [regions, setRegions] = useState([]);
  const [users, setUsers] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [assistanceRequests, setAssistanceRequests] = useState([]);

  const [showUsers, setShowUsers] = useState(false);
  const [showNGOs, setShowNGOs] = useState(false);
  const [showRequests, setShowRequests] = useState(false);

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingNGOs, setLoadingNGOs] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);

  const [showCreateNGO, setShowCreateNGO] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [deleteNGO, setDeleteNGO] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    localLanguage: "",
    region: "",
    stateProvince: "",
    country: "",
  });

  const totalUsers = users.length;
  const totalNGOs = ngos.length;
  const totalRequests = assistanceRequests.length;

  const pendingRequests = assistanceRequests.filter(
    (request) => request.status === "Pending",
  ).length;

  const inProgressRequests = assistanceRequests.filter(
    (request) => request.status === "In Progress",
  ).length;

  const resolvedRequests = assistanceRequests.filter(
    (request) => request.status === "Resolved",
  ).length;
  //Status Chart
  const requestStatusData = [
    {
      name: "Pending",
      value: pendingRequests,
    },
    {
      name: "In Progress",
      value: inProgressRequests,
    },
    {
      name: "Resolved",
      value: resolvedRequests,
    },
  ];
  //AssistanceRequest Chart
  const assistanceTypeCounts = {};

  assistanceRequests.forEach((request) => {
    request.assistanceType.forEach((type) => {
      assistanceTypeCounts[type] = (assistanceTypeCounts[type] || 0) + 1;
    });
  });

  const assistanceTypeData = Object.entries(assistanceTypeCounts).map(
    ([name, value]) => ({
      name,
      value,
    }),
  );
  //Region Chart
  const regionCounts = {};

  assistanceRequests.forEach((request) => {
    const regionName = request.regionId?.region;

    if (regionName) {
      regionCounts[regionName] = (regionCounts[regionName] || 0) + 1;
    }
  });

  const requestsByRegionData = Object.entries(regionCounts).map(
    ([name, value]) => ({
      name,
      value,
    }),
  );
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
  // Dashboard data while login
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setError("");

        const currentUser = auth.currentUser;

        if (!currentUser) {
          setError("Please login first.");
          return;
        }

        const token = await currentUser.getIdToken();

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [usersResponse, ngosResponse, requestsResponse] =
          await Promise.all([
            fetch("http://localhost:5000/api/users", {
              headers,
            }),

            fetch("http://localhost:5000/api/ngos", {
              headers,
            }),

            fetch("http://localhost:5000/api/assistance-requests", {
              headers,
            }),
          ]);

        const usersData = await usersResponse.json();
        const ngosData = await ngosResponse.json();
        const requestsData = await requestsResponse.json();

        if (!usersResponse.ok) {
          throw new Error(usersData.message || "Failed to fetch users");
        }

        if (!ngosResponse.ok) {
          throw new Error(ngosData.message || "Failed to fetch NGOs");
        }

        if (!requestsResponse.ok) {
          throw new Error(
            requestsData.message || "Failed to fetch assistance requests",
          );
        }

        setUsers(usersData);
        setNgos(ngosData);
        setAssistanceRequests(requestsData.requests);

        console.log("Dashboard users:", usersData);
        console.log("Dashboard NGOs:", ngosData);
        console.log("Dashboard assistance requests:", requestsData.requests);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError(error.message);
      }
    };

    fetchDashboardData();
  }, []);
  //Fetch Users
  // useEffect(() => {
  //   if (activeSection === "users" && showUsers && usersSectionRef.current) {
  //     usersSectionRef.current.scrollIntoView({
  //       behavior: "smooth",
  //       block: "start",
  //     });
  //   }
  // }, [activeSection, showUsers]);
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
      setShowRequests(false);
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
      setShowRequests(false);

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
  const handleViewRequests = async () => {
    try {
      setError("");
      setLoadingRequests(true);
      setShowRequests(true);
      setShowUsers(false);
      setShowNGOs(false);
      setShowCreateNGO(false);

      const currentUser = auth.currentUser;
      console.log("currentuser:", currentUser);

      if (!currentUser) {
        setError("Please login first.");
        return;
      }

      const token = await currentUser.getIdToken();

      const response = await fetch(
        "http://localhost:5000/api/assistance-requests",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch assistance requests");
      }

      setAssistanceRequests(data.requests);
    } catch (error) {
      console.error("Error fetching assistance requests:", error);
      setError(error.message);
    } finally {
      setLoadingRequests(false);
    }
  };
  const handleStatusChange = async (requestId, newStatus) => {
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error("User is not authenticated");
      }

      const token = await currentUser.getIdToken();

      const response = await fetch(
        `http://localhost:5000/api/assistance-requests/${requestId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update assistance request status",
        );
      }

      console.log("Status updated successfully:", data);

      // Update the request in the frontend
      setAssistanceRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === requestId
            ? { ...request, status: newStatus }
            : request,
        ),
      );
    } catch (error) {
      console.error("Error updating assistance request status:", error);
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

      setToast("NGO onboarded successfully.");
      resetForm();

      setShowCreateNGO(false);
      setActiveSection("dashboard");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      setTimeout(() => {
        setToast("");
      }, 3000);
    } catch (error) {
      console.error("Error creating NGO:", error);
      setError(error.message);
    }
  };
  const handleNGOStatusChange = async (ngo) => {
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error("User is not authenticated");
      }

      const token = await currentUser.getIdToken();

      const action = ngo.accountStatus === "active" ? "deactivate" : "activate";

      const response = await fetch(
        `http://localhost:5000/api/ngos/${ngo._id}/${action}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update NGO status");
      }

      console.log(data.message);

      // Refresh NGO list
      await handleViewNGOs();
    } catch (error) {
      console.error("NGO status update error:", error);
    }
  };
  const handleDeleteNGO = async (ngo) => {
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error("User is not authenticated");
      }

      const token = await currentUser.getIdToken();

      const response = await fetch(
        `http://localhost:5000/api/ngos/${ngo._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete NGO");
      }

      setToast("NGO deleted successfully.");

      await handleViewNGOs();

      setTimeout(() => {
        setToast("");
      }, 3000);
    } catch (error) {
      console.error("NGO delete error:", error);
    }
  };
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col bg-slate-900 text-white md:flex">
          {/* Logo */}
          <div className="border-b border-slate-800 px-6 py-6">
            <p className="text-lg font-bold tracking-wide">RECONNECT</p>

            <p className="mt-1 text-xs text-slate-400">Super Admin Portal</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-200">
              Management
            </p>

            <div className="mt-3 space-y-1">
              {/* Dashboard */}
              <button
                onClick={() => {
                  setActiveSection("dashboard");
                  setShowUsers(false);
                  setShowNGOs(false);
                  setShowRequests(false);
                  setShowCreateNGO(false);

                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium transition ${
                  activeSection === "dashboard"
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span>▦</span>
                Dashboard
              </button>

              {/* Users */}

              <button
                onClick={() => {
                  setActiveSection("users");
                  handleViewUsers();

                  setTimeout(() => {
                    usersSectionRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }, 300);
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium transition ${
                  activeSection === "users"
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span>👥</span>
                Users
              </button>

              {/* NGOs */}
              <button
                onClick={() => {
                  setActiveSection("ngos");
                  handleViewNGOs();

                  setTimeout(() => {
                    ngosSectionRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }, 300);
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium transition ${
                  activeSection === "ngos"
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span>🏢</span>
                NGOs
              </button>

              {/* Assistance Requests */}
              <button
                onClick={() => {
                  setActiveSection("requests");
                  handleViewRequests();

                  setTimeout(() => {
                    assistanceSectionRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }, 300);
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium transition ${
                  activeSection === "requests"
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span>📋</span>
                Assistance Requests
              </button>

              {/* Create NGO */}

              <button
                onClick={() => {
                  setActiveSection("createNGO");

                  setShowCreateNGO(true);
                  setShowUsers(false);
                  setShowNGOs(false);
                  setShowRequests(false);

                  setTimeout(() => {
                    createNgoSectionRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }, 300);
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium transition ${
                  activeSection === "createNGO"
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span>＋</span>
                Create NGO
              </button>
            </div>
          </nav>

          {/* Logout */}
          <div className="border-t border-slate-800 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <span>↪</span>
              Logout
            </button>
          </div>
        </aside>
        {/* Hamburger Menu */}
        {sidebarOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />

            {/* Mobile Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-900 text-white shadow-xl md:hidden">
              {/* Logo + Close */}
              <div className="flex items-center justify-between border-b border-slate-800 px-6 py-6">
                <div>
                  <p className="text-lg font-bold tracking-wide">RECONNECT</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Super Admin Portal
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="text-2xl text-slate-300 hover:text-white"
                  aria-label="Close menu"
                >
                  ×
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6">
                <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-200">
                  Management
                </p>

                <div className="mt-3 space-y-1">
                  <button
                    onClick={() => {
                      setActiveSection("dashboard");
                      setShowUsers(false);
                      setShowNGOs(false);
                      setShowRequests(false);
                      setShowCreateNGO(false);
                      setSidebarOpen(false);

                      window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      });
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium transition ${
                      activeSection === "dashboard"
                        ? "bg-blue-600 text-white"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <span>▦</span>
                    Dashboard
                  </button>

                  <button
                    onClick={() => {
                      setActiveSection("users");
                      handleViewUsers();
                      setSidebarOpen(false);

                      setTimeout(() => {
                        usersSectionRef.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }, 300);
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium transition ${
                      activeSection === "users"
                        ? "bg-blue-600 text-white"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <span>👥</span>
                    Users
                  </button>

                  <button
                    onClick={() => {
                      setActiveSection("ngos");
                      handleViewNGOs();
                      setSidebarOpen(false);

                      setTimeout(() => {
                        ngosSectionRef.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }, 300);
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium transition ${
                      activeSection === "ngos"
                        ? "bg-blue-600 text-white"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <span>🏢</span>
                    NGOs
                  </button>

                  <button
                    onClick={() => {
                      setActiveSection("requests");
                      handleViewRequests();
                      setSidebarOpen(false);

                      setTimeout(() => {
                        assistanceSectionRef.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }, 300);
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium transition ${
                      activeSection === "requests"
                        ? "bg-blue-600 text-white"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <span>📋</span>
                    Assistance Requests
                  </button>

                  <button
                    onClick={() => {
                      setActiveSection("createNGO");
                      setShowCreateNGO(true);
                      setShowUsers(false);
                      setShowNGOs(false);
                      setShowRequests(false);
                      setSidebarOpen(false);

                      setTimeout(() => {
                        createNgoSectionRef.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }, 300);
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium transition ${
                      activeSection === "createNGO"
                        ? "bg-blue-600 text-white"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <span>＋</span>
                    Create NGO
                  </button>
                </div>
              </nav>

              {/* Logout */}
              <div className="border-t border-slate-800 p-4">
                <button
                  onClick={() => {
                    setSidebarOpen(false);
                    handleLogout();
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  <span>↪</span>
                  Logout
                </button>
              </div>
            </aside>
          </>
        )}
        {/* Main Content */}
        <main className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto max-w-7xl">
            {toast && (
              <div className="fixed right-6 top-6 z-50 flex items-center gap-3 rounded-xl border border-emerald-300 bg-emerald-50 px-5 py-4 shadow-xl">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-lg font-bold text-white shadow-sm">
                  ✓
                </div>

                <p className="text-sm font-semibold text-emerald-800">
                  {toast}
                </p>
              </div>
            )}
            {/* Dashboard Header */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
                <div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSidebarOpen(true)}
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 md:hidden"
                      aria-label="Open menu"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                    </button>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                      {/* your existing SVG */}
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 13h2v8H3v-8zm8-8h2v16h-2V5zm8 4h2v12h-2V9z"
                        />
                      </svg>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        ReConnect
                      </p>

                      <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                        Super Admin Portal
                      </h1>
                    </div>
                  </div>

                  <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500">
                    Monitor community support, manage partner NGOs and oversee
                    assistance requests from one place.
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 12H9m0 0l3-3m-3 3l3 3"
                    />
                  </svg>
                  Logout
                </button>
              </div>
            </div>

            {/* Overview */}
            <div className="mt-8">
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
                    Overview
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    Community Support
                  </h2>
                </div>

                <p className="hidden text-sm text-slate-400 md:block">
                  Live data from ReConnect
                </p>
              </div>

              {/* KPI Cards */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {/* Users */}
                {/* <div className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Community Users
                      </p>

                      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                        {totalUsers}
                      </p>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                      👥
                    </div>
                  </div>

                  <div className="mt-3 border-t border-slate-100 pt-3">
                    <p className="text-xs text-slate-400">
                      Registered community members
                    </p>
                  </div>
                </div> */}
                {/* Users */}
                <div className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Community Users
                      </p>

                      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                        {totalUsers}
                      </p>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                      👥
                    </div>
                  </div>

                  <div className="mt-3 border-t border-slate-100 pt-3">
                    <p className="text-xs text-slate-400">
                      Registered community members
                    </p>
                  </div>
                </div>

                {/* NGOs */}
                <div className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Partner NGOs
                      </p>

                      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                        {totalNGOs}
                      </p>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                      🏢
                    </div>
                  </div>

                  <div className="mt-3 border-t border-slate-100 pt-3">
                    <p className="text-xs text-slate-400">
                      Organizations supporting communities
                    </p>
                  </div>
                </div>

                {/* Total Requests */}
                <div className="group rounded-xl border border-emerald-200 bg-emerald-50/40 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-emerald-700">
                        Assistance Requests
                      </p>

                      <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
                        {totalRequests}
                      </p>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                      📋
                    </div>
                  </div>

                  <div className="mt-3 border-t border-emerald-100 pt-3">
                    <p className="text-xs text-emerald-700/70">
                      Total support requests received
                    </p>
                  </div>
                </div>

                {/* Pending */}
                <div className="group rounded-xl border border-amber-200 bg-amber-50/40 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-amber-700">
                        Pending
                      </p>

                      <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
                        {pendingRequests}
                      </p>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                      🕐
                    </div>
                  </div>

                  <div className="mt-3 border-t border-amber-100 pt-3">
                    <p className="text-xs text-amber-700/70">
                      Requests awaiting action
                    </p>
                  </div>
                </div>

                {/* In Progress */}
                <div className="group rounded-xl border border-blue-200 bg-blue-50/40 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700">
                        In Progress
                      </p>

                      <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
                        {inProgressRequests}
                      </p>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                      ↗
                    </div>
                  </div>

                  <div className="mt-3 border-t border-blue-100 pt-3">
                    <p className="text-xs text-blue-700/70">
                      Requests currently being handled
                    </p>
                  </div>
                </div>

                {/* Resolved */}
                <div className="group rounded-xl border border-emerald-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Resolved
                      </p>

                      <p className="mt-3 text-4xl font-bold tracking-tight text-emerald-600">
                        {resolvedRequests}
                      </p>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      ✓
                    </div>
                  </div>

                  <div className="mt-3 border-t border-slate-100 pt-3">
                    <p className="text-xs text-slate-400">
                      Successfully completed requests
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Request Analytics */}
            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {/* Request Status Chart */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
                    Request Analytics
                  </p>

                  <h2 className="mt-1 text-base font-bold text-slate-900">
                    Requests by Status
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Current distribution of assistance requests.
                  </p>
                </div>

                <div className="mt-3 h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={requestStatusData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={62}
                        innerRadius={38}
                        paddingAngle={3}
                        label
                      >
                        {requestStatusData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              index === 0
                                ? "#f59e0b"
                                : index === 1
                                  ? "#3b82f6"
                                  : "#10b981"
                            }
                          />
                        ))}
                      </Pie>

                      <Tooltip />

                      <Legend
                        verticalAlign="bottom"
                        height={24}
                        wrapperStyle={{ fontSize: "11px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Assistance Required Chart */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
                    Request Analytics
                  </p>

                  <h2 className="mt-1 text-base font-bold text-slate-900">
                    Assistance Required
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Requests grouped by assistance type.
                  </p>
                </div>

                <div className="mt-3 h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={assistanceTypeData}
                      layout="vertical"
                      margin={{
                        top: 5,
                        right: 10,
                        left: 5,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />

                      <XAxis type="number" tick={{ fontSize: 11 }} />

                      <YAxis
                        type="category"
                        dataKey="name"
                        width={90}
                        tick={{ fontSize: 10 }}
                      />

                      <Tooltip />

                      <Bar
                        dataKey="value"
                        name="Requests"
                        fill="#3b82f6"
                        radius={[0, 6, 6, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Request Region Chart */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
                    Request Analytics
                  </p>

                  <h2 className="mt-1 text-base font-bold text-slate-900">
                    Requests by Region
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Requests received from each region.
                  </p>
                </div>

                <div className="mt-3 h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={requestsByRegionData}
                      layout="vertical"
                      margin={{
                        top: 5,
                        right: 10,
                        left: 5,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />

                      <XAxis type="number" tick={{ fontSize: 11 }} />

                      <YAxis
                        type="category"
                        dataKey="name"
                        width={90}
                        tick={{ fontSize: 10 }}
                      />

                      <Tooltip />

                      <Bar
                        dataKey="value"
                        name="Requests"
                        fill="#3b82f6"
                        radius={[0, 6, 6, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* NGO Form */}
            <div ref={createNgoSectionRef}>
              {showCreateNGO && (
                <div className="mt-6 overflow-hidden rounded-2xl bg-slate-900 shadow-xl">
                  {/* Header */}
                  <div className="relative overflow-hidden px-8 py-8">
                    {/* Decorative background pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[40px] border-blue-500" />
                      <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full border-[50px] border-blue-400" />
                    </div>

                    <div className="relative">
                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl shadow-lg">
                          🏢
                        </div>

                        <div>
                          <h2 className="text-2xl font-bold text-white">
                            Onboard NGO
                          </h2>

                          <p className="mt-1 text-sm text-slate-400">
                            Register an NGO and assign the region it will serve.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form area */}
                  <div className="bg-slate-50 p-8">
                    {/* Success message */}
                    {message && (
                      <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
                        {message}
                      </div>
                    )}

                    {/* Error message */}
                    {error && (
                      <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* NGO Name */}
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          NGO Name
                        </label>

                        <input
                          type="text"
                          name="name"
                          placeholder="Enter NGO name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          required
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Email
                        </label>

                        <input
                          type="email"
                          name="email"
                          placeholder="Enter NGO email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          required
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Phone
                        </label>

                        <input
                          type="text"
                          name="phone"
                          placeholder="Enter NGO phone number"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          required
                        />
                      </div>

                      {/* Local Language */}
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Local Language
                        </label>

                        <select
                          name="localLanguage"
                          value={formData.localLanguage}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Assigned Region
                        </label>

                        <select
                          name="region"
                          value={formData.region}
                          onChange={handleRegionChange}
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          required
                        >
                          <option value="">Select Region</option>

                          {regions.map((region) => (
                            <option key={region._id} value={region.region}>
                              {region.region}, {region.stateProvince},{" "}
                              {region.country}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* State */}
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          State / Province
                        </label>

                        <input
                          type="text"
                          value={formData.stateProvince}
                          readOnly
                          className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-600"
                        />
                      </div>

                      {/* Country */}
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Country
                        </label>

                        <input
                          type="text"
                          value={formData.country}
                          readOnly
                          className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-600"
                        />
                      </div>

                      {/* Firebase UID */}
                      {/* <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Firebase UID
                        </label>

                        <input
                          type="text"
                          name="firebaseUid"
                          placeholder="Enter Firebase UID"
                          value={formData.firebaseUid}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          required
                        />
                      </div> */}

                      {/* Buttons */}
                      <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                        <button
                          type="submit"
                          className="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg"
                        >
                          ✓ Onboard NGO
                        </button>

                        <button
                          type="button"
                          onClick={resetForm}
                          className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                          Reset
                        </button>
                      </div>
                    </form>

                    {/* Back to Dashboard */}
                    <div className="mt-8 flex justify-end border-t border-slate-200 pt-6">
                      <button
                        onClick={() => {
                          setActiveSection("dashboard");
                          setShowUsers(false);
                          setShowNGOs(false);
                          setShowRequests(false);
                          setShowCreateNGO(false);
                          window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                          });
                        }}
                        className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                      >
                        ↑ Back to Dashboard
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Users Section */}
            <div ref={usersSectionRef}>
              {showUsers && (
                <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-xl">
                  {/* Section Header */}
                  <div className="border-b border-slate-200 bg-slate-50 px-8 py-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                          👥
                        </div>

                        <div>
                          <h2 className="text-2xl font-bold text-slate-800">
                            All Users
                          </h2>

                          <p className="mt-1 text-sm text-slate-500">
                            View and monitor all registered users across
                            regions.
                          </p>
                        </div>
                      </div>

                      {/* User Count */}
                      <div className="rounded-xl bg-blue-600 px-4 py-2 text-center text-white shadow-sm">
                        <p className="text-xs font-medium uppercase tracking-wide text-blue-100">
                          Total Users
                        </p>

                        <p className="text-xl font-bold">{users.length}</p>
                      </div>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="p-8">
                    {loadingUsers ? (
                      <div className="flex items-center justify-center py-12">
                        <p className="text-sm font-medium text-slate-500">
                          Loading users...
                        </p>
                      </div>
                    ) : users.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center">
                        <div className="text-4xl">👥</div>

                        <p className="mt-3 font-semibold text-slate-700">
                          No users found
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          There are currently no registered users.
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-xl border border-slate-200">
                        <table className="min-w-full">
                          <thead>
                            <tr className="bg-slate-100 text-left">
                              <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Name
                              </th>

                              <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Email
                              </th>

                              <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Age
                              </th>

                              <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Gender
                              </th>

                              <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Phone
                              </th>

                              <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Region
                              </th>

                              <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Status
                              </th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-slate-200 bg-white">
                            {users.map((user) => (
                              <tr
                                key={user._id}
                                className="transition hover:bg-blue-50/50"
                              >
                                <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-800">
                                  {user.name}
                                </td>

                                <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                                  {user.email}
                                </td>

                                <td className="px-5 py-4 text-sm text-slate-600">
                                  {user.age}
                                </td>

                                <td className="px-5 py-4 text-sm text-slate-600">
                                  {user.gender}
                                </td>

                                <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                                  {user.phone}
                                </td>

                                <td className="px-5 py-4 text-sm text-slate-600">
                                  <div className="font-medium text-slate-700">
                                    {user.region}
                                  </div>

                                  <div className="text-xs text-slate-400">
                                    {user.stateProvince}
                                  </div>
                                </td>

                                {/* Status Badge */}
                                <td className="px-5 py-4">
                                  <span
                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                      user.accountStatus === "active"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                                  >
                                    {user.accountStatus}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Back to Dashboard */}
                    <div className="mt-6 flex justify-end border-t border-slate-200 pt-6">
                      <button
                        onClick={() => {
                          setActiveSection("dashboard");
                          setShowUsers(false);
                          setShowNGOs(false);
                          setShowRequests(false);
                          setShowCreateNGO(false);
                          window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                          });
                        }}
                        className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                      >
                        ↑ Back to Dashboard
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* NGOs Section */}
            <div ref={ngosSectionRef}>
              {showNGOs && (
                <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-xl">
                  {/* Section Header */}
                  <div className="border-b border-slate-200 bg-slate-50 px-8 py-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                          🏢
                        </div>

                        <div>
                          <h2 className="text-2xl font-bold text-slate-800">
                            All NGOs
                          </h2>

                          <p className="mt-1 text-sm text-slate-500">
                            View and monitor all registered NGOs and their
                            assigned regions.
                          </p>
                        </div>
                      </div>

                      {/* NGO Count */}
                      <div className="rounded-xl bg-blue-600 px-4 py-2 text-center text-white shadow-sm">
                        <p className="text-xs font-medium uppercase tracking-wide text-blue-100">
                          Total NGOs
                        </p>

                        <p className="text-xl font-bold">{ngos.length}</p>
                      </div>
                    </div>
                  </div>

                  {/* Table Area */}
                  <div className="p-8">
                    {loadingNGOs ? (
                      <div className="flex items-center justify-center py-12">
                        <p className="text-sm font-medium text-slate-500">
                          Loading NGOs...
                        </p>
                      </div>
                    ) : ngos.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center">
                        <div className="text-4xl">🏢</div>

                        <p className="mt-3 font-semibold text-slate-700">
                          No NGOs found
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          There are currently no registered NGOs.
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-xl border border-slate-200">
                        <table className="min-w-full">
                          <thead>
                            <tr className="bg-slate-100 text-left">
                              <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                NGO Name
                              </th>

                              <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Email
                              </th>

                              {/* <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Phone
                              </th> */}

                              <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Local Language
                              </th>

                              <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Region
                              </th>

                              <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Status
                              </th>

                              {/* Actions */}
                              <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Actions
                              </th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-slate-200 bg-white">
                            {ngos.map((ngo) => (
                              <tr
                                key={ngo._id}
                                className="transition hover:bg-blue-50/50"
                              >
                                {/* NGO Name */}
                                <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-800">
                                  {ngo.name}
                                </td>

                                {/* Email */}
                                <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                                  {ngo.email}
                                </td>

                                {/* Phone */}
                                {/* <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                                  {ngo.phone}
                                </td> */}

                                {/* Local Language */}
                                <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                                  {ngo.localLanguage}
                                </td>

                                {/* Region */}
                                <td className="px-5 py-4">
                                  <div className="font-medium text-slate-700">
                                    {ngo.regionId?.region || "N/A"}
                                  </div>

                                  <div className="text-xs text-slate-400">
                                    {ngo.regionId?.stateProvince || ""}
                                  </div>
                                </td>

                                {/* Status */}
                                <td className="px-5 py-4">
                                  <span
                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                      ngo.accountStatus === "active"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                                  >
                                    {ngo.accountStatus}
                                  </span>
                                </td>

                                {/* Actions */}
                                <td className="px-5 py-4">
                                  <div className="flex items-center gap-2">
                                    {ngo.accountStatus === "active" ? (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleNGOStatusChange(ngo)
                                        }
                                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                                      >
                                        Deactivate
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleNGOStatusChange(ngo)
                                        }
                                        className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                                      >
                                        Activate
                                      </button>
                                    )}

                                    <button
                                      type="button"
                                      onClick={() => setDeleteNGO(ngo)}
                                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Back to Dashboard */}
                    <div className="mt-6 flex justify-end border-t border-slate-200 pt-6">
                      <button
                        onClick={() => {
                          setActiveSection("dashboard");
                          setShowUsers(false);
                          setShowNGOs(false);
                          setShowRequests(false);
                          setShowCreateNGO(false);
                          window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                          });
                        }}
                        className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                      >
                        ↑ Back to Dashboard
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Assistance Requests Section */}
            <div ref={assistanceSectionRef}>
              {showRequests && (
                <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-xl">
                  {/* Section Header */}
                  <div className="border-b border-slate-200 bg-slate-50 px-8 py-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                          📋
                        </div>

                        <div>
                          <h2 className="text-2xl font-bold text-slate-800">
                            Assistance Requests
                          </h2>

                          <p className="mt-1 text-sm text-slate-500">
                            View and manage assistance requests submitted by
                            community users.
                          </p>
                        </div>
                      </div>

                      {/* Request Count */}
                      <div className="rounded-xl bg-blue-600 px-4 py-2 text-center text-white shadow-sm">
                        <p className="text-xs font-medium uppercase tracking-wide text-blue-100">
                          Total Requests
                        </p>

                        <p className="text-xl font-bold">
                          {assistanceRequests.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Request Content */}
                  <div className="p-8">
                    {loadingRequests ? (
                      <div className="flex items-center justify-center py-12">
                        <p className="text-sm font-medium text-slate-500">
                          Loading assistance requests...
                        </p>
                      </div>
                    ) : assistanceRequests.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center">
                        <div className="text-4xl">📋</div>

                        <p className="mt-3 font-semibold text-slate-700">
                          No assistance requests found
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          There are currently no requests submitted by community
                          users.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        {assistanceRequests.map((request) => (
                          <div
                            key={request._id}
                            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md"
                          >
                            {/* Top Row */}
                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                              {/* User */}
                              <div className="flex items-start gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                                  {request.userId?.name
                                    ? request.userId.name
                                        .charAt(0)
                                        .toUpperCase()
                                    : "?"}
                                </div>

                                <div>
                                  <h3 className="text-lg font-bold text-slate-800">
                                    {request.userId?.name || "Unknown User"}
                                  </h3>

                                  <p className="mt-1 text-sm text-slate-500">
                                    {request.userId?.phone || "No phone number"}
                                  </p>
                                </div>
                              </div>

                              {/* Status */}
                              {/* Status */}
                              <div className="flex flex-col items-start gap-2">
                                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                  Status
                                </label>

                                <select
                                  value={request.status}
                                  onChange={(e) =>
                                    handleStatusChange(
                                      request._id,
                                      e.target.value,
                                    )
                                  }
                                  className={`rounded-lg border px-3 py-2 text-sm font-semibold outline-none transition focus:ring-2 focus:ring-blue-100 ${
                                    request.status === "Resolved"
                                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                      : request.status === "In Progress"
                                        ? "border-blue-200 bg-blue-50 text-blue-700"
                                        : "border-amber-200 bg-amber-50 text-amber-700"
                                  }`}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="In Progress">
                                    In Progress
                                  </option>
                                  <option value="Resolved">Resolved</option>
                                </select>
                              </div>
                            </div>

                            {/* Divider */}
                            <div className="my-5 border-t border-slate-100" />

                            {/* Request Information */}
                            <div className="grid gap-6 md:grid-cols-2">
                              {/* Assistance Type */}
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                  Assistance Required
                                </p>

                                <div className="mt-3 flex flex-wrap gap-2">
                                  {request.assistanceType?.map((type) => (
                                    <span
                                      key={type}
                                      className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700"
                                    >
                                      {type}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Region */}
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                  Region
                                </p>

                                <p className="mt-2 font-medium text-slate-700">
                                  {request.regionId?.region || "N/A"}
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                  {request.regionId?.stateProvince},{" "}
                                  {request.regionId?.country}
                                </p>
                              </div>

                              {/* Submitted Date */}
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                  Submitted
                                </p>

                                <p className="mt-2 font-medium text-slate-700">
                                  {new Date(
                                    request.createdAt,
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>

                            {/* Description */}
                            {request.description && (
                              <div className="mt-6 rounded-xl bg-slate-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                  Description
                                </p>

                                <p className="mt-2 text-sm leading-6 text-slate-700">
                                  {request.description}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Back to Dashboard */}
                    <div className="mt-8 flex justify-end border-t border-slate-200 pt-6">
                      <button
                        onClick={() => {
                          setActiveSection("dashboard");
                          setShowUsers(false);
                          setShowNGOs(false);
                          setShowRequests(false);
                          setShowCreateNGO(false);
                          window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                          });
                        }}
                        className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                      >
                        ↑ Back to Dashboard
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      {deleteNGO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-800">
              Delete NGO?
            </h2>

            <p className="mt-3 text-sm text-slate-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-800">
                {deleteNGO.name}
              </span>
              ?
            </p>

            <p className="mt-2 text-xs text-red-600">
              This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteNGO(null)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={async () => {
                  await handleDeleteNGO(deleteNGO);
                  setDeleteNGO(null);
                }}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
