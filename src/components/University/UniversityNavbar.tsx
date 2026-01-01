import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const navItems = [
  { id: "dashboard", label: "Dashboard", path: "/university", end: true },
  { id: "events", label: "Events", path: "/university/events" },
  { id: "noticeboard", label: "Notice Board", path: "/university/noticeboard" },
  {
    id: "academictimeline",
    label: "Academic Timeline",
    path: "/university/academictimeline",
  },
  { id: "more", label: "More", path: "/university/more" },
];

const UniversityNavbar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="border-b border-gray-200 bg-white">
      <nav className="flex justify-between overflow-x-auto px-5">
        {navItems.map((item) => {
          // Dashboard should also be active for /university/dashboard
          const isActive = item.end
            ? location.pathname === item.path ||
              location.pathname === "/university/dashboard"
            : location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={`border-b-2 py-3 text-sm font-medium whitespace-nowrap transition ${
                isActive
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default UniversityNavbar;
