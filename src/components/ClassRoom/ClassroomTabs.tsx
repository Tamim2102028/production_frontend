import React from "react";
import { NavLink } from "react-router-dom";
import { FaChalkboard, FaEllipsisH } from "react-icons/fa";

const tabs = [
  { id: "classroom", label: "Rooms", to: "/classroom", icon: FaChalkboard },
  { id: "more", label: "More", to: "/classroom/more", icon: FaEllipsisH },
];

const ClassroomTabs: React.FC = () => {
  return (
    <div className="rounded-md border border-gray-200 bg-white p-2 shadow-sm">
      <nav className="flex justify-evenly overflow-x-auto">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <NavLink
              key={t.id}
              to={t.to}
              end={t.id === "classroom"}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none ${
                  isActive
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              <span className="hidden md:inline">{t.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default ClassroomTabs;
