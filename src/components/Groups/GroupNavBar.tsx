import React from "react";
import { NavLink, useParams } from "react-router-dom";
import {
  FaUsers,
  FaImage,
  FaThumbtack,
  FaHandshake,
  FaInfoCircle,
} from "react-icons/fa";
import { BsPostcard } from "react-icons/bs";
import { useGroupUnreadCounts } from "../../hooks/useGroup";

const GroupNavBar: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const baseUrl = `/groups/${slug}`;

  // Fetch unread counts
  const { data: unreadData } = useGroupUnreadCounts();
  const unreadPinnedCount = unreadData?.data?.meta?.unreadPinnedCount || 0;
  const unreadMarketplaceCount =
    unreadData?.data?.meta?.unreadMarketplaceCount || 0;

  const tabs = [
    { path: baseUrl, label: "Posts", icon: BsPostcard, end: true, badge: 0 },
    {
      path: `${baseUrl}/pinned`,
      label: "Pinned",
      icon: FaThumbtack,
      end: true,
      badge: unreadPinnedCount,
      badgeColor: "bg-blue-500",
    },
    {
      path: `${baseUrl}/marketplace`,
      label: "Buy & Sell",
      icon: FaHandshake,
      end: true,
      badge: unreadMarketplaceCount,
      badgeColor: "bg-green-500",
    },
    {
      path: `${baseUrl}/members`,
      label: "Members",
      icon: FaUsers,
      end: true,
      badge: 0,
    },
    {
      path: `${baseUrl}/media`,
      label: "Media",
      icon: FaImage,
      end: true,
      badge: 0,
    },
    {
      path: `${baseUrl}/about`,
      label: "About",
      icon: FaInfoCircle,
      end: true,
      badge: 0,
    },
  ];

  return (
    <div className="scrollbar-hide overflow-x-auto border-b border-gray-200 bg-white">
      <div className="flex min-w-max gap-1 px-3">
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
            {tab.badge > 0 && (
              <span
                className={`ml-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold text-white ${tab.badgeColor}`}
              >
                {tab.badge > 99 ? "99+" : tab.badge}
              </span>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default GroupNavBar;
