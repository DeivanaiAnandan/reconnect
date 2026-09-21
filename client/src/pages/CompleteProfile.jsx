import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";
import app from "../firebase";
import { signOut } from "firebase/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const auth = getAuth(app);

const CompleteProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isEditMode = location.state?.mode === "edit";

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
    regionId: "",
    region: "",
    stateProvince: "",
    country: "",
    skills: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = auth.currentUser;
        // const currentUser = null;

        if (!currentUser) {
          console.warn("No Firebase user found.");
          setError("Please login first.");
          return;
        }
        // throw new Error("TEST: Firebase ID token failed");
        let token;

        try {
          token = await currentUser.getIdToken();
        } catch (error) {
          console.error("Step 1 ERROR: Unable to get Firebase token:", error);

          throw new Error(
            "Unable to authenticate your account. Please try again.",
          );
        }

        if (isEditMode) {
          console.log("Edit mode: loading existing profile");

          let profileResponse;

          try {
            profileResponse = await fetch(
              `${import.meta.env.VITE_API_URL}/api/users/me`,
              // `https://wrong-server-example-12345.com/api/users/me`,

              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );
          } catch (error) {
            console.error("Step 2 ERROR: Profile API request failed:", error);

            throw new Error(
              "Unable to connect to the server while loading your profile.",
            );
          }

          let profileData;

          try {
              // TEST: Force invalid JSON error
              // throw new SyntaxError("TEST: Invalid profile JSON");
            profileData = await profileResponse.json();
          } catch (error) {
            console.error("Step 3 ERROR: Invalid profile JSON:", error);

            throw new Error(
              "The server returned invalid profile data. Please try again later.",
            );
          }

          console.log("Existing profile:", profileData);

          if (!profileResponse.ok) {
            throw new Error(profileData.message || "Failed to fetch profile");
          }

          setProfile(profileData.profile);

          setFormData({
            name: profileData.profile.name || "",
            email: profileData.profile.email || "",
            age: profileData.profile.age || "",
            gender: profileData.profile.gender || "",
            phone: profileData.profile.phone || "",
            localLanguage: profileData.profile.localLanguage || "",
            regionId:
              profileData.profile.regionId?._id ||
              profileData.profile.regionId ||
              "",
            region: profileData.profile.region || "",
            stateProvince: profileData.profile.stateProvince || "",
            country: profileData.profile.country || "",
            skills: profileData.profile.skills || [],
          });
        } else {
          console.log("New user mode");

          if (!firebaseUid || !googleEmail) {
            setError("User information is missing. Please login again.");
            return;
          }

          setProfile({
            name: googleName || "",
            email: googleEmail || "",
          });

          setFormData((prev) => ({
            ...prev,
            name: googleName || "",
            email: googleEmail || "",
          }));
        }

        let regionResponse;

        try {
          // throw new SyntaxError("TEST: Invalid profile JSON");
          regionResponse = await fetch(
            `${import.meta.env.VITE_API_URL}/api/regions`,
            // `https://wrong-server-example-12345.com/api/users/me`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
        } catch (error) {
          console.error("Step 4 ERROR: Regions API request failed:", error);

          throw new Error(
            "Unable to connect to the server while loading regions.",
          );
        }

        let regionData;

        try {
          // TEST: Force invalid regions JSON error
          // throw new SyntaxError("TEST: Invalid regions JSON");
          regionData = await regionResponse.json();
        } catch (error) {
          console.error("Step 5 ERROR: Invalid regions JSON:", error);

          throw new Error(
            "The server returned invalid region data. Please try again later.",
          );
        }

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
  }, [firebaseUid, googleName, googleEmail, isEditMode]);

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
      regionId: selectedRegion._id,
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

      let token;

      try {
        // TEST: Force Firebase token failure
        // throw new Error("TEST: Firebase token could not be obtained");

        token = await currentUser.getIdToken();
      } catch (error) {
        console.error("Step 6 ERROR: Unable to get Firebase token:", error);

        throw new Error(
          "Unable to authenticate your account. Please try again.",
        );
      }
      let response;

      try {
        if (isEditMode) {
          console.log("Updating existing user");

          response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/users/me`,
            // `https://wrong-server-example-12345.com/api/users/me`,
            {
              method: "PUT",
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
            },
          );
        } else {
          console.log("Creating new user");

          response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/users`,
            // `https://wrong-server-example-12345.com/api/users`,
            {
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
            },
          );
        }
      } catch (error) {
        console.error("Step 7 ERROR: Profile API request failed:", error);

        throw new Error(
          "Unable to connect to the server. Please check your connection and try again.",
        );
      }

      let data;

      try {
        // TEST: Force invalid JSON error
        // throw new SyntaxError("TEST: Invalid profile JSON");

        data = await response.json();
      } catch (error) {
        console.error("Step 8 ERROR: Invalid profile JSON:", error);

        throw new Error(
          "The server returned invalid profile data. Please try again later.",
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            (isEditMode
              ? "Failed to update profile"
              : "Failed to create profile"),
        );
      }

      console.log(isEditMode ? "Profile updated:" : "User created:", data);

      if (isEditMode) {
        navigate("/user-dashboard");
      } else {
        navigate("/assistance-request");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };
  const handleExit = async () => {
    if (isEditMode) {
      navigate("/user-dashboard");
      return;
    }

    const confirmExit = window.confirm(
      "Exit profile setup?\n\nYour profile information has not been completed. Are you sure you want to exit?",
    );

    if (!confirmExit) {
      return;
    }

    try {
      // throw new Error("TEST: Edit failed");
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Exit logout error:", error);
      setError("Unable to logout. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
        <Card className="w-full max-w-3xl border-slate-200 shadow-sm">
          <CardContent className="flex min-h-56 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

              <p className="text-sm font-medium text-slate-500">
                Loading your profile...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
        <Card className="w-full max-w-3xl border-red-200 shadow-sm">
          <CardContent className="p-6">
            <div className="rounded-xl border border-red-200 bg-red-50 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
                  !
                </div>

                <div>
                  <p className="font-semibold text-red-800">
                    Unable to load your profile
                  </p>

                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-sm font-bold text-white">
                ↗
              </div>

              <div>
                <p className="text-lg font-bold tracking-tight text-white">
                  RECONNECT
                </p>

                <p className="text-xs text-slate-400">
                  Community Support Platform
                </p>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            className="border-slate-600 bg-transparent font-semibold text-white hover:border-slate-400 hover:bg-white/10 hover:text-white"
            onClick={async () => {
              try {
                // console.log("TEST: Logout button clicked");
                // throw new Error("TEST: Logout failed");
                await signOut(auth);
                navigate("/");
              } catch (error) {
                console.error("Logout error:", error);
                setError("Unable to logout. Please try again.");
              }
            }}
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Main */}
      <main className="px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-4xl">
          <Card className="overflow-hidden border-slate-200 bg-white shadow-md">
            {/* Page Header */}
            <CardHeader className="border-b border-slate-200 bg-white px-6 py-7 sm:px-8">
              <div className="flex items-start gap-4">
                <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-lg text-white sm:flex">
                  {isEditMode ? "✎" : "✓"}
                </div>

                <div>
                  <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    {isEditMode ? "Edit Your Profile" : "Complete Your Profile"}
                  </CardTitle>

                  <CardDescription className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    Please provide your details so ReConnect can connect you
                    with the appropriate community support.
                  </CardDescription>
                  <Button type="button" variant="outline" onClick={handleExit}>
                    {isEditMode ? "Cancel" : "Exit"}
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-6 py-7 sm:px-8 sm:py-9">
              <form onSubmit={handleSubmit} className="space-y-9">
                {/* Personal Information */}
                <section>
                  <div className="mb-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700">
                        1
                      </div>

                      <h2 className="text-base font-bold text-slate-900">
                        Personal Information
                      </h2>
                    </div>

                    <p className="mt-2 text-sm text-slate-500 sm:ml-11">
                      Basic information about you.
                    </p>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    {/* Name */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Name
                      </label>

                      <input
                        type="text"
                        value={profile?.name || formData.name || ""}
                        readOnly
                        className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500 outline-none"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Email
                      </label>

                      <input
                        type="email"
                        value={profile?.email || formData.email || ""}
                        readOnly
                        className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500 outline-none"
                      />
                    </div>

                    {/* Age */}
                    <div>
                      <label
                        htmlFor="age"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Age
                      </label>

                      <input
                        id="age"
                        type="number"
                        name="age"
                        min="0"
                        value={formData.age}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label
                        htmlFor="gender"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Gender
                      </label>

                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Phone */}
                    <div>
                      <label
                        htmlFor="phone"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Phone
                      </label>

                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    {/* Local Language */}
                    <div>
                      <label
                        htmlFor="localLanguage"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Local Language
                      </label>

                      <input
                        id="localLanguage"
                        type="text"
                        name="localLanguage"
                        value={formData.localLanguage}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Tamil"
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>
                </section>

                {/* Location */}
                <section className="border-t border-slate-200 pt-9">
                  <div className="mb-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700">
                        2
                      </div>

                      <h2 className="text-base font-bold text-slate-900">
                        Location
                      </h2>
                    </div>

                    <p className="mt-2 text-sm text-slate-500 sm:ml-11">
                      Select your current region. State and country will be
                      filled automatically.
                    </p>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    {/* Region */}
                    <div className="md:col-span-2">
                      <label
                        htmlFor="region"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Region
                      </label>

                      <select
                        id="region"
                        name="region"
                        value={formData.region}
                        onChange={handleRegionChange}
                        required
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="">Select region</option>

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
                      <label
                        htmlFor="stateProvince"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        State / Province
                      </label>

                      <input
                        id="stateProvince"
                        type="text"
                        name="stateProvince"
                        value={formData.stateProvince}
                        readOnly
                        className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500 outline-none"
                      />
                    </div>

                    {/* Country */}
                    <div>
                      <label
                        htmlFor="country"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Country
                      </label>

                      <input
                        id="country"
                        type="text"
                        name="country"
                        value={formData.country}
                        readOnly
                        className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500 outline-none"
                      />
                    </div>
                  </div>
                </section>

                {/* Skills */}
                <section className="border-t border-slate-200 pt-9">
                  <div className="mb-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700">
                        3
                      </div>

                      <h2 className="text-base font-bold text-slate-900">
                        Skills
                      </h2>
                    </div>

                    <p className="mt-2 text-sm text-slate-500 sm:ml-11">
                      Select the skills you currently have.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="skills"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Your Skills
                    </label>

                    <select
                      id="skills"
                      multiple
                      value={formData.skills}
                      onChange={handleSkillsChange}
                      className="min-h-40 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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

                    <p className="mt-2 text-xs text-slate-500">
                      Hold Ctrl (Windows) or Command (Mac) to select multiple
                      skills.
                    </p>
                  </div>
                </section>

                {/* Error */}
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-sm font-medium text-red-700">{error}</p>
                  </div>
                )}

                {/* Submit */}
                <div className="border-t border-slate-200 pt-7">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-xl bg-slate-900 py-6 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting
                      ? "Saving Profile..."
                      : isEditMode
                        ? "Save Changes"
                        : "Complete Profile"}
                  </Button>

                  <p className="mt-3 text-center text-xs text-slate-400">
                    Your information helps ReConnect connect you with relevant
                    community support.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          <p className="mt-5 text-center text-xs text-slate-400">
            ReConnect · Community Support Platform
          </p>
        </div>
      </main>
    </div>
  );
};

export default CompleteProfile;
