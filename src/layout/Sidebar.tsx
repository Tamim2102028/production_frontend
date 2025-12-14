import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaUser,
  FaCog,
  FaBell,
  FaVideo,
  FaLayerGroup,
  FaFolder,
  FaStore,
  FaChalkboardTeacher,
  FaSchool,
  FaEllipsisH,
  FaBriefcase,
} from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import { prefetchRoute } from "../routes/prefetch";

const Sidebar: React.FC = () => {
  const location = useLocation();

  const navigationItems = [
    {
      icon: FaLayerGroup,
      label: "Groups",
      path: "/groups",
      active: location.pathname === "/groups",
    },
    {
      icon: FaSchool,
      label: "ClassRoom",
      path: "/classroom",
      active: location.pathname === "/classroom",
    },
    {
      icon: FaBell,
      label: "Notifications",
      path: "/notifications",
      active: location.pathname === "/notifications",
      badge: 5,
    },
    {
      icon: FaFolder,
      label: "Files & Archive",
      path: "/files",
      active: location.pathname === "/files",
    },
    {
      icon: BsStars,
      label: "Study Helper AI",
      path: "/study-helper",
      active: location.pathname === "/study-helper",
    },
    {
      icon: FaBriefcase,
      label: "Career Hub",
      path: "/career-hub",
      active: location.pathname === "/career-hub",
    },
    {
      icon: FaStore,
      label: "Student Store",
      path: "/store",
      active: location.pathname === "/store",
    },
    {
      icon: FaChalkboardTeacher,
      label: "Tuition",
      path: "/tuition",
      active: location.pathname === "/tuition",
    },
    {
      icon: FaVideo,
      label: "Videos",
      path: "/videos",
      active: location.pathname === "/videos",
    },
    {
      icon: FaUser,
      label: "Profile",
      path: "/profile",
      active: location.pathname === "/profile",
    },
    {
      icon: FaEllipsisH,
      label: "More",
      path: "/more",
      active: location.pathname === "/more",
    },
    {
      icon: FaCog,
      label: "Settings",
      path: "/settings",
      active: location.pathname === "/settings",
    },
  ];

  return (
    <div className="flex h-full flex-col space-y-1 p-3">
      {/* Logo/Brand */}
      <NavLink
        to="/"
        className="flex items-center gap-3 border-b border-gray-300 px-2 pb-3"
      >
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-purple-500 shadow-md">
          <img
            src="/your-avatar.jpg"
            alt="Profile"
            className="h-full w-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";
            }}
          />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-gray-900">SocialHub</span>
          <span className="text-sm text-gray-500">Your Network</span>
        </div>
      </NavLink>

      {/* Navigation Menu */}
      <div className="hide-scrollbar flex-1 overflow-y-auto">
        <nav className="space-y-1">
          {navigationItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              onMouseEnter={() => prefetchRoute(item.path)}
              className={`flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-all duration-200 ${
                item.active
                  ? "text-blue-600"
                  : "text-gray-700 hover:bg-blue-100 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center">
                <item.icon
                  className={`mr-3 h-5 w-5 transition-colors ${
                    item.active
                      ? "text-blue-600"
                      : "text-gray-500 group-hover:text-gray-900"
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
