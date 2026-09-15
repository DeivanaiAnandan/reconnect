import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AssistanceRequest = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    assistanceType: "",
    description: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Assistance request:", formData);

      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting assistance request:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold text-slate-800">
          Assistance Request
        </h1>

        <p className="mt-2 text-slate-600">
          Tell us what kind of support you need.
        </p>

        {submitted ? (
          <div className="mt-8 rounded-lg bg-green-100 p-6 text-green-700">
            <h2 className="text-xl font-semibold">
              Request submitted successfully!
            </h2>

            <p className="mt-2">Your assistance request has been received.</p>

            <button
              onClick={() => navigate("/user-dashboard")}
              className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Assistance Type */}
            <div>
              <label className="mb-2 block font-medium text-slate-700">
                Type of Assistance
              </label>

              <select
                name="assistanceType"
                value={formData.assistanceType}
                onChange={handleChange}
                required
                className="w-full rounded-lg border px-4 py-3"
              >
                <option value="">Select assistance type</option>

                <option value="Food">Food</option>
                <option value="Shelter">Shelter</option>
                <option value="Medical">Medical</option>
                <option value="Education">Education</option>
                <option value="Employment">Employment</option>
                <option value="Financial">Financial Assistance</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block font-medium text-slate-700">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="5"
                placeholder="Please describe the assistance you need..."
                className="w-full rounded-lg border px-4 py-3"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700"
            >
              Submit Assistance Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AssistanceRequest;
