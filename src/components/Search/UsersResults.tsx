import React from "react";
import { FaUser, FaUniversity, FaUserPlus, FaUserCheck } from "react-icons/fa";

interface User {
  _id: string;
  fullName: string;
  userName: string;
  avatar: string;
  userType: string;
  bio?: string;
  connectionsCount: number;
  followersCount: number;
  institution?: string;
  academicInfo?: {
    department: string;
  };
}

interface UsersResultsProps {
  isVisible: boolean;
  users: User[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  searchQuery?: string;
}

const UsersResults: React.FC<UsersResultsProps> = ({
  isVisible,
  users,
  loading = false,
  onLoadMore,
  hasMore = false,
  searchQuery = "",
}) => {
  if (!isVisible) return null;

  // Helper function to highlight search terms
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="rounded bg-yellow-200 px-1">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Users</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-4 rounded-lg border p-4">
                <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                  <div className="h-3 w-1/2 rounded bg-gray-200"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="py-8 text-center">
        <FaUser className="mx-auto mb-4 h-12 w-12 text-gray-400" />
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          No users found
        </h3>
        <p className="text-gray-600">Try searching with different keywords</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Users ({users.length})
      </h3>

      <div className="space-y-3">
        {users.map((user) => (
          <div
            key={user._id}
            className="flex cursor-pointer items-center space-x-4 rounded-lg border border-gray-200 p-4 transition-all hover:border-blue-300 hover:shadow-md"
          >
            {/* User Avatar */}
            <div className="flex-shrink-0">
              <img
                src={user.avatar}
                alt={user.fullName}
                className="h-12 w-12 rounded-full object-cover"
              />
            </div>

            {/* User Info */}
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center space-x-2">
                <h4 className="text-lg font-semibold text-gray-900">
                  {highlightText(user.fullName, searchQuery)}
                </h4>
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                  {user.userType}
                </span>
              </div>

              <p className="mb-1 text-sm text-gray-600">
                @{highlightText(user.userName, searchQuery)}
              </p>

              {user.bio && (
                <p className="mb-2 line-clamp-2 text-sm text-gray-600">
                  {user.bio}
                </p>
              )}

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                {user.institution && (
                  <div className="flex items-center space-x-1">
                    <FaUniversity className="h-3 w-3" />
                    <span>{user.institution}</span>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <span>{user.connectionsCount} connections</span>
                  <span>{user.followersCount} followers</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex-shrink-0">
              <div className="flex space-x-2">
                <button className="flex items-center space-x-1 rounded-lg bg-blue-500 px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-600">
                  <FaUserPlus className="h-3 w-3" />
                  <span>Connect</span>
                </button>
                <button className="flex items-center space-x-1 rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-200">
                  <span>View Profile</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="pt-4 text-center">
          <button
            onClick={onLoadMore}
            className="rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600"
          >
            Load More Users
          </button>
        </div>
      )}
    </div>
  );
};

export default UsersResults;
