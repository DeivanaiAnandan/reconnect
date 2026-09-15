import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";
import app from "../firebase";

const auth = getAuth(app);

const CompleteProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check whether this page is opened for editing an existing user
  const isEditMode = location.state?.mode === "edit";

  // Data passed from Login.jsx for a new Google user
  const firebaseUid = location.state?.firebaseUid;
  const googleName = location.state?.name;
  const googleEmail = location.state?.email;

  console.log("CompleteProfile location.state:", location.state);
  console.log("CompleteProfile isEditMode:", isEditMode);

  const [profile, setProfile] = useState(null);
  const [regions, setRegions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    phone: "",
    localLanguage: "",
    region: "",
    stateProvince: "",
    country: "",
    skills: [],
  });

  // Load regions for the registration form
  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          setError("Please login first.");
          return;
        }

        const token = await currentUser.getIdToken();

        // Edit mode → get existing profile from backend
        if (isEditMode) {
          console.log("Edit mode: loading existing profile");

          const profileResponse = await fetch(
            "http://localhost:5000/api/users/me",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          const profileData = await profileResponse.json();

          console.log("Existing profile:", profileData);

          if (!profileResponse.ok) {
            throw new Error(profileData.message || "Failed to fetch profile");
          }

          setProfile(profileData.profile);

          setFormData({
            age: profileData.profile.age || "",
            gender: profileData.profile.gender || "",
            phone: profileData.profile.phone || "",
            localLanguage: profileData.profile.localLanguage || "",
            region: profileData.profile.region || "",
            stateProvince: profileData.profile.stateProvince || "",
            country: profileData.profile.country || "",
            skills: profileData.profile.skills || [],
          });
        }

        // New user → require information from Login.jsx
        else {
          console.log("New user mode");

          if (!firebaseUid || !googleEmail) {
            setError("User information is missing. Please login again.");
            return;
          }

          setProfile({
            name: googleName,
            email: googleEmail,
          });
        }

        if (!currentUser) {
          setError("Please login first.");
          return;
        }

        // const token = await currentUser.getIdToken();

        // Get regions
        const regionResponse = await fetch(
          "http://localhost:5000/api/regions",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const regionData = await regionResponse.json();

        if (!regionResponse.ok) {
          throw new Error(regionData.message || "Failed to fetch regions");
        }

        setRegions(regionData);
      } catch (error) {
        console.error("Error loading registration data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [firebaseUid, googleName, googleEmail]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  const handleSkillsChange = (e) => {
    const selectedSkills = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );

    setFormData((prev) => ({
      ...prev,
      skills: selectedSkills,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setError("");

    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        setError("Please login first.");
        return;
      }

      const token = await currentUser.getIdToken();

      let response;

      if (isEditMode) {
        // ----------------------------------------------
        // EDIT MODE → UPDATE EXISTING USER
        // ----------------------------------------------

        console.log("Updating existing user");

        response = await fetch("http://localhost:5000/api/users/me", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: profile?.name,
            age: formData.age,
            gender: formData.gender,
            phone: formData.phone,
            localLanguage: formData.localLanguage,
            region: formData.region,
            stateProvince: formData.stateProvince,
            country: formData.country,
            email: profile?.email,
            skills: formData.skills,
          }),
        });
      } else {
        // ----------------------------------------------
        // NEW USER → CREATE USER
        // ----------------------------------------------

        console.log("Creating new user");

        response = await fetch("http://localhost:5000/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: googleName,
            age: formData.age,
            gender: formData.gender,
            phone: formData.phone,
            localLanguage: formData.localLanguage,
            region: formData.region,
            stateProvince: formData.stateProvince,
            country: formData.country,
            email: googleEmail,
            skills: formData.skills,
            firebaseUid: firebaseUid,
          }),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create profile");
      }

      console.log(isEditMode ? "Profile updated:" : "User created:", data);

      if (isEditMode) {
        navigate("/user-dashboard");
      } else {
        navigate("/assistance-request");
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-10">
        <p>Loading registration form...</p>
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

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold text-slate-800">
          Complete Your Profile
        </h1>

        <p className="mt-2 text-slate-600">
          Please provide your details to continue.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Name from Google */}
          <div>
            <label className="mb-2 block font-medium">Name</label>

            <input
              type="text"
              value={profile?.name || ""}
              readOnly
              className="w-full rounded-lg border bg-slate-100 px-4 py-3"
            />
          </div>

          {/* Email from Google */}
          <div>
            <label className="mb-2 block font-medium">Email</label>

            <input
              type="email"
              value={profile?.email || ""}
              readOnly
              className="w-full rounded-lg border bg-slate-100 px-4 py-3"
            />
          </div>

          {/* Age */}
          <div>
            <label className="mb-2 block font-medium">Age</label>

            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="mb-2 block font-medium">Gender</label>

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-4 py-3"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Phone */}
          <div>
            <label className="mb-2 block font-medium">Phone</label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          {/* Local Language */}
          <div>
            <label className="mb-2 block font-medium">Local Language</label>

            <input
              type="text"
              name="localLanguage"
              value={formData.localLanguage}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          {/* Region */}
          <div>
            <label className="mb-2 block font-medium">Region</label>

            <select
              name="region"
              value={formData.region}
              onChange={handleRegionChange}
              required
              className="w-full rounded-lg border px-4 py-3"
            >
              <option value="">Select region</option>

              {regions.map((region) => (
                <option key={region._id} value={region.region}>
                  {region.region}, {region.stateProvince}, {region.country}
                </option>
              ))}
            </select>
          </div>

          {/* State */}
          <div>
            <label className="mb-2 block font-medium">State / Province</label>

            <input
              type="text"
              name="stateProvince"
              value={formData.stateProvince}
              readOnly
              className="w-full rounded-lg border bg-slate-100 px-4 py-3"
            />
          </div>

          {/* Country */}
          <div>
            <label className="mb-2 block font-medium">Country</label>

            <input
              type="text"
              name="country"
              value={formData.country}
              readOnly
              className="w-full rounded-lg border bg-slate-100 px-4 py-3"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="mb-2 block font-medium">Skills</label>

            <select
              multiple
              value={formData.skills}
              onChange={handleSkillsChange}
              className="w-full rounded-lg border px-4 py-3"
            >
              <option value="Tailoring">Tailoring</option>
              <option value="Cooking">Cooking</option>
              <option value="Driving">Driving</option>
              <option value="Teaching">Teaching</option>
              <option value="Farming">Farming</option>
              <option value="Computer Skills">Computer Skills</option>
              <option value="Construction">Construction</option>
              <option value="Other">Other</option>
            </select>

            <p className="mt-1 text-sm text-slate-500">
              Hold Ctrl to select multiple skills.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
