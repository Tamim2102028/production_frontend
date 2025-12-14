import React from "react";

interface FriendsTabsProps {
  activeTab: "all" | "requests" | "suggestions" | "sent";
  onTabChange: (tab: "all" | "requests" | "suggestions" | "sent") => void;
}

const FriendsTabs: React.FC<FriendsTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const handleTabClick = (tab: "all" | "requests" | "suggestions" | "sent") => {
    onTabChange(tab);
  };

  const tabs = [
    { id: "all", label: "All Friends" },
    { id: "requests", label: "Friend Requests" },
    { id: "suggestions", label: "Suggestions" },
    { id: "sent", label: "Sent Requests" },
  ] as const;

  return (
    <div className="flex space-x-1 rounded-lg bg-gray-100">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default FriendsTabs;
