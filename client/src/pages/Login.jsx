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

      // Step 4: Read backend response
      console.log("Response status:", response.status);

      // Step 5: New user
      if (response.status === 404) {
        console.log("New Firebase user - no MongoDB profile found");

        navigate("/complete-profile", {
          state: {
            firebaseUid: result.user.uid,
            name: result.user.displayName,
            email: result.user.email,
          },
        });

        return;
      }

      // Step 6: Read backend response for existing user
      const data = await response.json();

      console.log("Backend response:", data);

      // Step 7: Handle other backend errors
      if (!response.ok) {
        throw new Error(data.message || "Failed to get user profile");
      }

      // Step 8: Existing user
      console.log("Existing ReConnect user:", data);

      // Step 9: Navigate based on role
      if (data.role === "user") {
        console.log("Logged in as User");

        if (data.profileComplete) {
          navigate("/user-dashboard");
        } else {
          navigate("/complete-profile");
        }
      } else if (data.role === "ngo") {
        navigate("/ngo-dashboard");
      } else if (data.role === "superadmin") {
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
              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-100 text-sm font-bold text-red-600">
                      !
                    </div>

                    <p className="pt-1 text-sm font-medium leading-5 text-red-700">
                      {error}
                    </p>
                  </div>
                </div>
              )}

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
