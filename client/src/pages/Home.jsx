import React from "react";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="min-h-screen bg-slate-50">
        <h1 className="pt-10 text-center text-5xl font-bold text-slate-800">
          ReConnect
        </h1>

        <p className="mt-10 text-center text-4xl text-slate-600">
          Displaced Community Support Platform
        </p>

        <p className="mt-10 text-center text-3xl text-green-600">
          Connecting people with the support they need.
        </p>

        <div className="mt-10 text-center">
          <button
            onClick={() => navigate("/login")}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            Continue to login
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
