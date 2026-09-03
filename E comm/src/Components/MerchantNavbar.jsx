import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiPackage,
  FiClock,
  FiTruck,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

const MerchantNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("profile");

    navigate("/login");
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/merchant/dashboard",
      icon: FiGrid,
    },
    {
      name: "Products",
      path: "/merchant/products",
      icon: FiPackage,
    },
    {
      name: "Orders",
      path: "/merchant/orders",
      icon: FiPackage,
    },
    {
      name: "Pending",
      path: "/merchant/pending",
      icon: FiClock,
    },
    {
      name: "Deliveries",
      path: "/merchant/deliveries",
      icon: FiTruck,
    },
    {
      name: "Profile",
      path: "/merchant/profile",
      icon: FiUser,
    },
  ];

  return (
    <nav className="w-full bg-[#0b0b0f] border-b border-gray-800 px-8 py-4 flex items-center justify-between">

      {/* LOGO */}
      <div
        onClick={() => navigate("/merchant/dashboard")}
        className="flex items-center gap-3 cursor-pointer"
      >
        <div className="w-9 h-9 border border-gray-700 flex items-center justify-center">
          <span className="text-white text-xl font-bold">
            V
          </span>
        </div>

        <div>
          <h1 className="text-white tracking-[0.35em] font-light">
            VASTRA
          </h1>

          <p className="text-[9px] text-gray-500 tracking-[0.25em] uppercase">
            Merchant Panel
          </p>
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="flex items-center gap-2">

        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition ${
                  isActive
                    ? "bg-white text-black"
                    : "text-gray-400 hover:text-white hover:bg-gray-900"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </NavLink>
          );
        })}

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="ml-3 flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
        >
          <FiLogOut className="w-4 h-4" />
          Logout
        </button>

      </div>
    </nav>
  );
};

export default MerchantNavbar;