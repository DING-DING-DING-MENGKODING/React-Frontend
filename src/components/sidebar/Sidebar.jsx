import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Car,
  Plus,
  BarChart3,
  Shield,
  FileText,
  Users,
  Camera,
  Droplet,
  Wind,
} from "lucide-react";

const Sidebar = ({ activeTab }) => {
  const navigate = useNavigate();
  const menuItems = [
    { id: "home", label: "Dashboard", icon: BarChart3, path: "/" },
    { id: "ambulance", label: "Ambulance", icon: Car, path: "/ambulance" },
    {
      id: "kantong-darah",
      label: "Kantong Darah",
      icon: Droplet,
      path: "/kantong-darah",
    },
    {
      id: "tabung-oksigen",
      label: "Tabung Oksigen",
      icon: Wind,
      path: "/tabung-oksigen",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("loginExpiredAt");
    navigate("/login");
  };

  return (
    <div className="w-64 bg-white shadow-xl h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center mb-18">
          <div className="flex items-center space-x-2">
            <div className="w-50 h-full relative">
              <img
                src="/assets/sadar.png"
                alt="Triangle Logo"
                className="w-full h-full"
              />
            </div>
            {/* <span className="text-white text-xl font-bold">SADAR</span> */}
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                activeTab === item.id
                  ? "bg-red-600 from-blue-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <button
          onClick={handleLogout}
          className="w-full mt-2 flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-all shadow"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
