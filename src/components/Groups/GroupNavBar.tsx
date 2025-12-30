import React from "react";
import { NavLink, useParams } from "react-router-dom";
import { FaUsers, FaImage, FaInfoCircle, FaThumbtack } from "react-icons/fa";
import { BsPostcard } from "react-icons/bs";

const GroupNavBar: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const baseUrl = `/groups/${slug}`;

  const tabs = [
    { path: baseUrl, label: "Posts", icon: BsPostcard, end: true },
    {
      path: `${baseUrl}/pinned`,
      label: "Pinned",
      icon: FaThumbtack,
      end: true,
    },
    { path: `${baseUrl}/members`, label: "Members", icon: FaUsers, end: true },
    { path: `${baseUrl}/media`, label: "Media", icon: FaImage, end: true },
    { path: `${baseUrl}/about`, label: "About", icon: FaInfoCircle, end: true },
  ] as const;

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="flex justify-between gap-1 px-3">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.end}
            className={({ isActive }) =>
              `flex items-center gap-2 border-b-2 px-6 py-4 font-semibold transition-colors ${
                isActive
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`
            }
          >
            <tab.icon className="h-5 w-5" />
            {tab.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default GroupNavBar;
