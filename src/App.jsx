import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
// import './App.css'
import "./styles.css";
import {
  BrowserRouter,
  Route,
  Router,
  Routes,
  useLocation,
} from "react-router-dom";
import HomeScreen from "./components/home/Home";
import Login from "./components/auth/login/Login";
import Register from "./components/auth/register/Register";
import Sidebar from "./components/sidebar/Sidebar";
import Ambulance from "./components/ambulance/Ambulance";
import KantongDarah from "./components/kantongDarah/KantongDarah";
import TabungOksigen from "./components/tabungOksigen/TabungOksigen";
import SuperAdmin from "./superadmin/SuperAdmin";

const AppContent = () => {
  const location = useLocation();

  const getCurrentTab = () => {
    const path = location.pathname;
    switch (path) {
      case "/":
        return "home";
      case "/ambulance":
        return "ambulance";
      case "/kantong-darah":
        return "kantong-darah";
      case "/tabung-oksigen":
        return "tabung-oksigen";
      default:
        return "home";
    }
  };

  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";
  const isSuperAdminPage = location.pathname === "/superadmin";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="flex">
        {!isLoginPage && !isRegisterPage && !isSuperAdminPage && <Sidebar activeTab={getCurrentTab()} />}
        <div className={`flex-1 ${isLoginPage || isRegisterPage || isSuperAdminPage ? "" : "p-8"}`}>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/ambulance" element={<Ambulance />} />
            <Route path="/kantong-darah" element={<KantongDarah />} />
            <Route path="/tabung-oksigen" element={<TabungOksigen />} />
            <Route path="/superadmin" element={<SuperAdmin />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
