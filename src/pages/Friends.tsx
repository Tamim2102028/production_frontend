import React, { useState, useMemo } from "react";
import {
  FriendsHeader,
  FriendsTabs,
  FriendsList,
  FriendRequests,
  FriendSuggestions,
  SentRequests,
} from "../components/Friends";
import FriendCard from "../components/shared/friends/FriendCard";

// TODO: Define types when API is connected
interface UserData {
  id: string;
  name: string;
  username: string;
  avatar: string;
  university?: { name: string };
  college?: { name: string };
}

const Friends: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "all" | "requests" | "suggestions" | "sent"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  // TODO: Get current user ID from auth context/API
  const currentUserId = "1";

  // TODO: Fetch from API
  const usersData: UserData[] = [];
  const friendIds: string[] = [];
  const pendingRequestIds: string[] = [];
  const sentRequestIds: string[] = [];

  // Tab-specific search results filtering
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const searchTerm = searchQuery.toLowerCase();

    // Filter users based on search term first
    const filteredUsers = usersData.filter((user) => {
      if (user.id === currentUserId) return false;

      return (
        user.name.toLowerCase().includes(searchTerm) ||
        user.username.toLowerCase().includes(searchTerm) ||
        (user.university?.name || user.college?.name || "")
          .toLowerCase()
          .includes(searchTerm)
      );
    });

    // Then filter based on active tab
    switch (activeTab) {
      case "all":
        return filteredUsers.filter((user) => friendIds.includes(user.id));

      case "requests":
        return filteredUsers.filter((user) =>
          pendingRequestIds.includes(user.id)
        );

      case "suggestions":
        return filteredUsers.filter(
          (user) =>
            !friendIds.includes(user.id) &&
            !pendingRequestIds.includes(user.id) &&
            !sentRequestIds.includes(user.id)
        );

      case "sent":
        return filteredUsers.filter((user) => sentRequestIds.includes(user.id));

      default:
        return filteredUsers;
    }
  }, [
    searchQuery,
    activeTab,
    currentUserId,
    friendIds,
    pendingRequestIds,
    sentRequestIds,
    usersData,
  ]);

  const renderSearchResults = () => {
    if (searchResults.length === 0) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">
            No results found
          </h3>
          <p className="mt-2 text-gray-600">
            No users found for "{searchQuery}"
          </p>
        </div>
      );
    } else {
      return (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Search Results ({searchResults.length})
          </h2>
          <div className="grid gap-3">
            {searchResults.map((user) => (
              <FriendCard
                key={user.id}
                id={user.id}
                name={user.name}
                avatar={user.avatar}
                university={
                  user.university?.name || user.college?.name || "No University"
                }
                type={
                  activeTab === "all"
                    ? "friend"
                    : activeTab === "requests"
                      ? "request"
                      : activeTab === "sent"
                        ? "sent"
                        : "suggestion"
                }
              />
            ))}
          </div>
        </div>
      );
    }
  };

  const renderContent = () => {
    // Normal tab content with search overlay
    switch (activeTab) {
      case "all":
        return searchQuery.trim() ? renderSearchResults() : <FriendsList />;
      case "requests":
        return searchQuery.trim() ? renderSearchResults() : <FriendRequests />;
      case "suggestions":
        return searchQuery.trim() ? (
          renderSearchResults()
        ) : (
          <FriendSuggestions />
        );
      case "sent":
        return searchQuery.trim() ? renderSearchResults() : <SentRequests />;
      default:
        return searchQuery.trim() ? renderSearchResults() : <FriendsList />;
    }
  };

  return (
    <>
      <FriendsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <FriendsTabs activeTab={activeTab} onTabChange={setActiveTab} />
      {/*  */}
      {renderContent()}
    </>
  );
};

export default Friends;
