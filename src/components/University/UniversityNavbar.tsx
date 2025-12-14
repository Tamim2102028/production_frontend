import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaBuilding,
  FaCalendarAlt,
  FaClipboardList,
  FaClock,
  FaBullhorn,
  FaFolder,
  FaTag,
  FaEllipsisH,
} from "react-icons/fa";

const navItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: FaBuilding,
    path: "/university/dashboard",
  },
  {
    id: "events",
    label: "Events",
    icon: FaCalendarAlt,
    path: "/university/events",
  },
  {
    id: "noticeboard",
    label: "Notice Board",
    icon: FaClipboardList,
    path: "/university/noticeboard",
  },
  {
    id: "academictimeline",
    label: "Academic Timeline",
    icon: FaClock,
    path: "/university/academictimeline",
  },
  {
    id: "crcorner",
    label: "CR Corner",
    icon: FaBullhorn,
    path: "/university/crcorner",
  },
  {
    id: "teacherscorner",
    label: "Teachers' Corner",
    icon: FaFolder,
    path: "/university/teacherscorner",
  },
  {
    id: "marketplace",
    label: "Marketplace",
    icon: FaTag,
    path: "/university/marketplace",
  },
  { id: "more", label: "More", icon: FaEllipsisH, path: "/university/more" },
];

const UniversityNavbar: React.FC = () => {
  return (
    <div className="grid grid-cols-4 gap-2 rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center rounded-lg p-3 transition-all ` +
              (isActive
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-blue-50")
            }
          >
            <Icon className="mb-1 h-5 w-5" />
            <span className="text-center text-xs font-medium">
              {item.label}
            </span>
          </NavLink>
        );
      })}
    </div>
  );
};

export default UniversityNavbar;
