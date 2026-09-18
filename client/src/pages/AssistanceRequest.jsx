import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
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

const AssistanceRequest = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    assistanceType: [],
    description: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const assistanceOptions = [
    "Food",
    "Shelter",
    "Medical",
    "Education",
    "Employment",
    "Financial Assistance",
    "Other",
  ];

  const handleAssistanceChange = (e) => {
    const { value, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      assistanceType: checked
        ? [...prev.assistanceType, value]
        : prev.assistanceType.filter((type) => type !== value),
    }));
  };

  const handleDescriptionChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      description: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (formData.assistanceType.length === 0) {
      setError("Please select at least one type of assistance.");
      return;
    }

    try {
      setLoading(true);

      const currentUser = auth.currentUser;

      if (!currentUser) {
        setError("Please login first.");
        return;
      }

      const token = await currentUser.getIdToken();

      console.log("Assistance request:", formData);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/assistance-requests`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      console.log("Assistance request response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit assistance request");
      }

      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting assistance request:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
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

          <div className="rounded-full border border-slate-700 bg-slate-800 px-4 py-1.5 text-xs font-semibold text-slate-300">
            Assistance Request
          </div>
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
                  +
                </div>

                <div>
                  <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Assistance Request
                  </CardTitle>

                  <CardDescription className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    Tell us what kind of support you need so we can connect you
                    with appropriate community services.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-6 py-7 sm:px-8 sm:py-9">
              {submitted ? (
                /* Success */
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-7 sm:p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-lg font-bold text-emerald-700">
                      ✓
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-emerald-800">
                        Request submitted successfully!
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-emerald-700">
                        Your assistance request has been received and is
                        currently pending review.
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => navigate("/user-dashboard")}
                    className="mt-7 bg-slate-900 px-6 font-semibold text-white shadow-sm hover:bg-slate-800"
                  >
                    Back to Dashboard
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-9">
                  {/* Error */}
                  {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-100 text-sm font-bold text-red-600">
                          !
                        </div>

                        <p className="pt-1 text-sm font-medium text-red-700">
                          {error}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Assistance Type */}
                  <section>
                    <div className="mb-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700">
                          1
                        </div>

                        <h2 className="text-base font-bold text-slate-900">
                          Type of Assistance
                        </h2>
                      </div>

                      <p className="mt-2 text-sm text-slate-500 sm:ml-11">
                        Select all types of support you currently need.
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {assistanceOptions.map((option) => {
                        const isSelected =
                          formData.assistanceType.includes(option);

                        return (
                          <label
                            key={option}
                            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                              isSelected
                                ? "border-blue-500 bg-blue-50"
                                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            <input
                              type="checkbox"
                              value={option}
                              checked={isSelected}
                              onChange={handleAssistanceChange}
                              className="h-4 w-4 accent-blue-600"
                            />

                            <span
                              className={`text-sm font-semibold ${
                                isSelected ? "text-blue-800" : "text-slate-700"
                              }`}
                            >
                              {option}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </section>

                  {/* Description */}
                  <section className="border-t border-slate-200 pt-9">
                    <div className="mb-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700">
                          2
                        </div>

                        <h2 className="text-base font-bold text-slate-900">
                          Describe Your Need
                        </h2>
                      </div>

                      <p className="mt-2 text-sm text-slate-500 sm:ml-11">
                        Provide some details about the assistance you need.
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="description"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Description
                      </label>

                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleDescriptionChange}
                        required
                        rows="6"
                        placeholder="Please describe the assistance you need..."
                        className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />

                      <p className="mt-2 text-xs text-slate-400">
                        Please provide enough detail to help the support team
                        understand your situation.
                      </p>
                    </div>
                  </section>

                  {/* Submit */}
                  <div className="border-t border-slate-200 pt-7">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-xl bg-slate-900 py-6 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading
                        ? "Submitting Request..."
                        : "Submit Assistance Request"}
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => navigate("/user-dashboard")}
                      className="mt-2 w-full text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                    >
                      ← Back to Dashboard
                    </Button>
                  </div>
                </form>
              )}
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

export default AssistanceRequest;
