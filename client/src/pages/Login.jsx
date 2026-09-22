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
      // throw new Error("TEST LOGIN ERROR");
      setError("");

      const provider = new GoogleAuthProvider();

      // throw new Error("TEST: Google Sign-In failed");
      // Step 1: Login with Google
      let result;
      try {
        result = await signInWithPopup(auth, provider);
        console.log("Firebase UID:", result.user.uid);
        console.log("Email:", result.user.email);
      } catch (error) {
        console.error("Step 1 ERROR: Google Sign-In failed:", error);
        throw new Error("Unable to sign in with Google. Please try again.");
      }

      // Step 2: Get Firebase ID token
      let token;
      try {
        // throw new Error("TEST: Firebase token could not be obtained");
        token = await result.user.getIdToken();
      } catch (error) {
        console.error("Step 2 ERROR: Unable to get Firebase token:", error);
        throw new Error(
          "Unable to authenticate your account. Please try again.",
        );
      }

      // console.log("Firebase ID Token:", token);
      console.log("Calling /api/users/me...");
      // Step 3: Send token to backend
      let response;
      try {
        response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Step 3 ERROR: API request failed:", error);

        throw new Error(
          "Unable to connect to the server. Please check your connection and try again.",
        );
      }

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
      // --------------------------------------------------
      // STEP 5: Handle HTTP errors
      // --------------------------------------------------
      if (!response.ok) {
        console.error(
          "Step 5 ERROR: Backend returned:",
          response.status,
          response.statusText,
        );

        if (response.status === 401) {
          throw new Error(
            "Your session could not be verified. Please sign in again.",
          );
        }

        if (response.status === 403) {
          throw new Error(
            "You do not have permission to access this application.",
          );
        }

        if (response.status >= 500) {
          throw new Error(
            "The server is currently unavailable. Please try again later.",
          );
        }

        throw new Error("Unable to retrieve your profile. Please try again.");
      }
      // Step 6: Read backend response for existing user
      // --------------------------------------------------
      // STEP 7: Parse JSON
      // --------------------------------------------------
      let data;

      try {
        data = await response.json();
        // data.role = "testing";
        console.log("Step 7 SUCCESS: Backend response:", data);
      } catch (error) {
        console.error("Step 7 ERROR: Invalid JSON response:", error);

        throw new Error(
          "The server returned invalid data. Please try again later.",
        );
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
        console.error("Unknown role received:", data.role);

        throw new Error(
          "Unable to identify your account. Please contact the administrator.",
        );
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

          {/* <div className="hidden rounded-full border border-slate-700 bg-slate-800 px-4 py-1.5 text-xs font-semibold text-slate-300 sm:block">
            Secure Sign In
          </div> */}
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
