import React from "react";
import { NavLink } from "react-router-dom";
import { FaUniversity, FaSearch, FaEnvelope, FaHome } from "react-icons/fa";
import { useAppSelector } from "../store/hooks";
import { IoExtensionPuzzleOutline } from "react-icons/io5";

const Navbar: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return null; // Don't show navbar if not authenticated
  }

  const navItems = [
    { to: "/", icon: FaHome, label: "Home" },
    { to: "/gaming", icon: IoExtensionPuzzleOutline, label: "Gaming" },
    { to: "/university", icon: FaUniversity, label: "University" },
    { to: "/search", icon: FaSearch, label: "Search" },
    { to: "/messages", icon: FaEnvelope, label: "Messages", badge: 2 },
  ];

  return (
    <nav className="sticky top-0 z-50 flex h-12 w-full items-center justify-evenly border-b border-gray-200 bg-white shadow-sm">
      {/* 4 buttons with map */}
      {navItems.map(({ to, icon: Icon, label, badge }) => (
        <div key={to} className="group relative">
          <NavLink
            to={to}
            className={({ isActive }) =>
              `flex items-center space-x-2 rounded-lg p-2 transition-colors ${isActive ? "text-blue-600" : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"}`
            }
          >
            <Icon className="h-5 w-5" />
            <span className="hidden text-sm font-medium md:block">{label}</span>
            {badge && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {badge}
              </span>
            )}
          </NavLink>
        </div>
      ))}
    </nav>
  );
};

export default Navbar;
