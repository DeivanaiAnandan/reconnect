// import React from "react";

// import Home from "./pages/Home.jsx";
// import Login from "./pages/Login.jsx";

// function App() {
//   return (
//     <>
//       <Home />
//       <Login />
//     </>
//   );
// }

// export default App;
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { LanguageProvider } from "./context/LanguageContext";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";

import UserDashboard from "./pages/UserDashboard.jsx";
import NGODashboard from "./pages/NGODashboard.jsx";
import SuperAdminDashboard from "./pages/SuperAdminDashboard.jsx";
import AssistanceRequest from "./pages/AssistanceRequest.jsx";
import CompleteProfile from "./pages/CompleteProfile.jsx";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/user-dashboard" element={<UserDashboard />} />

        <Route path="/ngo-dashboard" element={<NGODashboard />} />

        <Route path="/superadmin-dashboard" element={<SuperAdminDashboard />} />

        <Route path="/assistance-request" element={<AssistanceRequest />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
