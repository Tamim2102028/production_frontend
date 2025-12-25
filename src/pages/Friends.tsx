import React, { useState } from "react";
import {
  FriendsHeader,
  FriendsTabs,
  FriendsList,
  FriendRequests,
  FriendSuggestions,
  SentRequests,
} from "../components/Friends";

const Friends: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "all" | "requests" | "suggestions" | "sent"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  const renderContent = () => {
    switch (activeTab) {
      case "all":
        return <FriendsList />;
      case "requests":
        return <FriendRequests />;
      case "suggestions":
        return <FriendSuggestions />;
      case "sent":
        return <SentRequests />;
      default:
        return <FriendsList />;
    }
  };

  return (
    <>
      <FriendsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <FriendsTabs activeTab={activeTab} onTabChange={setActiveTab} />
      {renderContent()}
    </>
  );
};

export default Friends;
