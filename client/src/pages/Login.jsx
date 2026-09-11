import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import app from "../firebase";

const auth = getAuth(app);

const Login = () => {
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const loginWithGoogle = async () => {
    try {
      setError("");

      const provider = new GoogleAuthProvider();

      // Step 1: Login with Google
      const result = await signInWithPopup(auth, provider);

      console.log("Firebase UID:", result.user.uid);
      console.log("Email:", result.user.email);

      // Step 2: Get Firebase ID token
      const token = await result.user.getIdToken();

      console.log("Firebase ID Token:", token);

      // Step 3: Send token to backend
      const response = await fetch("http://localhost:5000/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("Backend profile:", data);

      // Step 4: Handle backend error
      if (!response.ok) {
        throw new Error(data.message || "Failed to get user profile");
      }

      // Step 5: Navigate based on role
      if (data.role === "user") {
        console.log("Logged in as User");

        if (data.profileComplete) {
          navigate("/user-dashboard");
        } else {
          navigate("/complete-profile");
        }
      } else if (data.role === "ngo") {
        console.log("Logged in as NGO");
        navigate("/ngo-dashboard");
      } else if (data.role === "superadmin") {
        console.log("Logged in as Super Admin");
        navigate("/superadmin-dashboard");
      } else {
        throw new Error("Unknown user role");
      }
    } catch (error) {
      console.error("Google login error:", error);
      setError(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
      <div className="w-full max-w-md rounded-2xl border border-blue-100 bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-3xl font-bold text-blue-700">
          ReConnect Login
        </h1>

        <p className="mb-6 text-center text-slate-500">
          Sign in to access your ReConnect account
        </p>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-red-600">{error}</p>
        )}

        <button
          onClick={loginWithGoogle}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          Continue with Google
        </button>

        <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-center">
          <p className="font-semibold text-green-700">
            Are you an NGO without an account?
          </p>

          <p className="mt-2 text-sm text-green-700">
            Please contact the Super Admin to get your organization onboarded.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
