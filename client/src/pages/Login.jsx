import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
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

const Login = () => {
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const loginWithGoogle = async () => {
    try {
      setError("");

      const provider = new GoogleAuthProvider();

      // Step 1: Login with Google

      const result = await signInWithPopup(auth, provider);

      console.log("Step 1 SUCCESS: Google Sign-In completed");
      console.log("Firebase UID:", result.user.uid);
      console.log("Email:", result.user.email);

      // Step 2: Get Firebase ID token
      console.log("Step 2: Getting Firebase ID token...");

      const token = await result.user.getIdToken();

      console.log("Step 2 SUCCESS: Firebase ID token obtained");

      // Step 3: Send token to backend
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/users/me`;

      console.log("Step 3: Calling backend...");
      console.log("API URL:", apiUrl);

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Step 4: Check response
      console.log("Step 4: Backend response received");
      console.log("Response status:", response.status);
      console.log(
        "Response content-type:",
        response.headers.get("content-type"),
      );

      // Step 5: New Firebase user
      if (response.status === 404) {
        console.log("Step 5: No MongoDB profile found - treating as new user");

        navigate("/complete-profile", {
          state: {
            firebaseUid: result.user.uid,
            name: result.user.displayName,
            email: result.user.email,
          },
        });

        return;
      }

      // Step 6: Check whether response is JSON
      const contentType = response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        const responseText = await response.text();

        console.error(
          "Step 6 ERROR: Expected JSON but received:",
          responseText,
        );

        throw new Error(
          "Unable to connect to the server. Please try again later.",
        );
      }

      // Step 7: Read JSON response
      const data = await response.json();

      console.log("Step 7: Backend response:", data);

      // Step 8: Handle backend errors
      if (!response.ok) {
        console.error("Step 8 ERROR: Backend returned an error:", data);

        throw new Error(data.message || "Unable to get your profile.");
      }

      // Step 9: Existing user
      console.log("Step 9: Existing ReConnect user:", data);

      // Step 10: Navigate based on role
      if (data.role === "user") {
        console.log("Logged in as User");

        if (data.profileComplete) {
          console.log("Profile complete → User Dashboard");
          navigate("/user-dashboard");
        } else {
          console.log("Profile incomplete → Complete Profile");
          navigate("/complete-profile");
        }
      } else if (data.role === "ngo") {
        console.log("Logged in as NGO");
        navigate("/ngo-dashboard");
      } else if (data.role === "superadmin") {
        console.log("Logged in as Super Admin");
        navigate("/superadmin-dashboard");
      } else {
        console.error("Unknown user role:", data.role);

        throw new Error("Unable to identify your account role.");
      }

      console.log("========== GOOGLE LOGIN SUCCESS ==========");
    } catch (error) {
      console.error("========== GOOGLE LOGIN FAILED ==========");
      console.error("Error object:", error);
      console.error("Error message:", error?.message);

      setError(
        "Unable to complete login. Please try again. If the problem continues, contact the administrator.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Header */}
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

          <div className="hidden rounded-full border border-slate-700 bg-slate-800 px-4 py-1.5 text-xs font-semibold text-slate-300 sm:block">
            Secure Sign In
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex min-h-[calc(100vh-81px)] items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          <Card className="overflow-hidden border-slate-200 bg-white shadow-md">
            {/* Login Header */}
            <CardHeader className="px-6 pb-6 pt-8 text-center sm:px-8 sm:pt-9">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-xl text-white">
                →
              </div>

              <CardTitle className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Welcome to ReConnect
              </CardTitle>

              <CardDescription className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Connect with the support and organizations available in your
                community.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 px-6 pb-8 sm:px-8">
              {/* Google Sign In */}
              <div>
                <Button
                  onClick={loginWithGoogle}
                  className="h-12 w-full rounded-xl bg-slate-900 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                >
                  <span className="mr-2 text-base">G</span>
                  Continue with Google
                </Button>

                <p className="mt-3 text-center text-xs text-slate-400">
                  Sign in securely using your Google account.
                </p>
              </div>
              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-600">
                      !
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-red-800">
                        Sign-in unsuccessful
                      </p>

                      <p className="mt-1 text-sm leading-5 text-red-700">
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {/* NGO Information */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-sm text-white">
                    🏢
                  </div>

                  <div>
                    <p className="font-semibold text-slate-800">
                      Are you an NGO without an account?
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Please contact the Super Admin to get your organization
                      onboarded.
                    </p>
                  </div>
                </div>
              </div>

              {/* Back */}
              <div className="border-t border-slate-100 pt-5 text-center">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/")}
                  className="text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                >
                  ← Back to Home
                </Button>
              </div>
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

export default Login;
