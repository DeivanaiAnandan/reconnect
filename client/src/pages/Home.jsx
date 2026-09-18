import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-lg font-bold text-white shadow-sm">
              R
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                ReConnect
              </h1>

              <p className="text-xs text-slate-500">
                Community Support Platform
              </p>
            </div>
          </div>
          {/* Disaster Management Helpline */}
          <a
            href="tel:1078"
            className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
          >
            Disaster Management Helpline: 1078
          </a>
          <Button
            onClick={() => navigate("/login")}
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Sign in
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <section className="mx-auto flex min-h-[calc(100vh-137px)] max-w-7xl items-center px-6 py-16">
          <div className="grid w-full items-center gap-16 lg:grid-cols-2">
            {/* Left Content */}
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-blue-600" />
                Community Support Platform
              </div>

              <h2 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Reconnecting people with the support they need.
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                ReConnect helps displaced communities connect with
                organizations, resources, and support available in their region.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={() => navigate("/login")}
                  className="rounded-lg bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Get Started
                </Button>

                <Button
                  onClick={() => navigate("/login")}
                  variant="outline"
                  className="rounded-lg border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Sign in
                </Button>
              </div>

              {/* Small trust points */}
              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600">✓</span>
                  Region-based support
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-emerald-600">✓</span>
                  Verified organizations
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-emerald-600">✓</span>
                  Secure access
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="hidden justify-center lg:flex">
              <div className="relative flex h-[430px] w-[430px] items-center justify-center rounded-[2rem] bg-slate-100">
                {/* Background circles */}
                <div className="absolute h-80 w-80 rounded-full bg-blue-50" />

                <div className="absolute h-64 w-64 rounded-full border border-blue-100" />

                {/* Main card */}
                <div className="relative w-72 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-xl text-white">
                      🤝
                    </div>

                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Connected
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-slate-900">
                    Support starts here
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Connect with organizations and resources available in your
                    region.
                  </p>

                  {/* Simple information rows */}
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                      <span className="text-sm text-slate-500">Community</span>

                      <span className="text-sm font-semibold text-slate-800">
                        Connected
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                      <span className="text-sm text-slate-500">Assistance</span>

                      <span className="text-sm font-semibold text-blue-600">
                        Available
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <p className="text-center text-sm text-slate-500">
          ReConnect — Community Support Platform
        </p>
      </footer>
    </div>
  );
};

export default Home;

// import { useLanguage } from "../context/LanguageContext";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";

// const Home = () => {
//   const { language, changeLanguage, supportedLanguages, t } = useLanguage();
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-800">
//       {/* Navigation */}
//       <nav className="border-b border-slate-200 bg-white">
//         <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
//           <div className="flex items-center gap-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-lg font-bold text-white shadow-sm">
//               R
//             </div>

//             <div>
//               <h1 className="text-xl font-bold tracking-tight text-slate-900">
//                 ReConnect
//               </h1>
//               <p className="text-xs text-slate-500">
//                 {t("home.communitySupport")}
//               </p>
//             </div>
//           </div>

//           <select
//             value={language}
//             onChange={(e) => changeLanguage(e.target.value)}
//             className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-medium text-white outline-none transition hover:bg-slate-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
//           >
//             {Object.entries(supportedLanguages).map(([code, name]) => (
//               <option key={code} value={code}>
//                 {name}
//               </option>
//             ))}
//           </select>

//           <Button
//             onClick={() => navigate("/login")}
//             className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
//           >
//             {t("home.signIn")}
//           </Button>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <main>
//         <section className="mx-auto flex min-h-[calc(100vh-137px)] max-w-7xl items-center px-6 py-16">
//           <div className="grid w-full items-center gap-16 lg:grid-cols-2">
//             {/* Left Content */}
//             <div className="max-w-2xl">
//               <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
//                 <span className="h-2 w-2 rounded-full bg-blue-600" />
//                 {t("home.communitySupport")}
//               </div>

//               <h2 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
//                 {t("home.heading")}
//               </h2>

//               <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
//                 {t("home.description")}
//               </p>

//               <div className="mt-8 flex flex-col gap-3 sm:flex-row">
//                 <Button
//                   onClick={() => navigate("/login")}
//                   className="rounded-lg bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                 >
//                   {t("home.getStarted")}
//                 </Button>

//                 <Button
//                   onClick={() => navigate("/login")}
//                   variant="outline"
//                   className="rounded-lg border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
//                 >
//                   {t("home.signIn")}
//                 </Button>
//               </div>

//               {/* Small trust points */}
//               <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
//                 <div className="flex items-center gap-2">
//                   <span className="text-emerald-600">✓</span>
//                   {t("home.regionSupport")}
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <span className="text-emerald-600">✓</span>
//                   {t("home.verifiedOrganizations")}
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <span className="text-emerald-600">✓</span>
//                   {t("home.secureAccess")}
//                 </div>
//               </div>
//             </div>

//             {/* Right Visual */}
//             <div className="hidden justify-center lg:flex">
//               <div className="relative flex h-[430px] w-[430px] items-center justify-center rounded-[2rem] bg-slate-100">
//                 {/* Background circles */}
//                 <div className="absolute h-80 w-80 rounded-full bg-blue-50" />
//                 <div className="absolute h-64 w-64 rounded-full border border-blue-100" />

//                 {/* Main card */}
//                 <div className="relative w-72 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
//                   <div className="flex items-center justify-between">
//                     <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-xl text-white">
//                       🤝
//                     </div>

//                     <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
//                       {t("home.connected")}
//                     </span>
//                   </div>

//                   <h3 className="mt-6 text-xl font-bold text-slate-900">
//                     {t("home.supportStartsHere")}
//                   </h3>

//                   <p className="mt-2 text-sm leading-6 text-slate-500">
//                     {t("home.connectResources")}
//                   </p>

//                   {/* Simple information rows */}
//                   <div className="mt-6 space-y-3">
//                     <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
//                       <span className="text-sm text-slate-500">
//                         {t("home.community")}
//                       </span>

//                       <span className="text-sm font-semibold text-slate-800">
//                         {t("home.connected")}
//                       </span>
//                     </div>

//                     <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
//                       <span className="text-sm text-slate-500">
//                         {t("home.assistance")}
//                       </span>

//                       <span className="text-sm font-semibold text-blue-600">
//                         {t("home.available")}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//       </main>

//       {/* Footer */}
//       <footer className="border-t border-slate-200 bg-white py-6">
//         <p className="text-center text-sm text-slate-500">{t("home.footer")}</p>
//       </footer>
//     </div>
//   );
// };

// export default Home;
