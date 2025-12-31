import React from "react";
import { type Group } from "../../services/search.service";

interface GroupsResultsProps {
  isVisible: boolean;
  groups?: Group[];
  loading?: boolean;
  searchQuery?: string;
}

const GroupsResults: React.FC<GroupsResultsProps> = ({
  isVisible,
  groups = [],
  loading = false,
  searchQuery = "",
}) => {
  if (!isVisible) return null;

  if (loading) {
    return (
      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-900">Groups</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-gray-300"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-gray-300"></div>
                  <div className="h-3 w-1/2 rounded bg-gray-300"></div>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                <div className="h-3 w-full rounded bg-gray-300"></div>
                <div className="h-3 w-2/3 rounded bg-gray-300"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (groups.length === 0) return null;

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(
      `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
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

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-gray-900">
        Groups ({groups.length})
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <div
            key={group._id}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            {/* Group Header */}
            <div className="mb-3 flex items-start space-x-3">
              <img
                src={group.avatar || "/default-group.png"}
                alt={group.name}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold text-gray-900">
                  {highlightText(group.name, searchQuery)}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span className="capitalize">{group.type}</span>
                  <span>•</span>
                  <span className="capitalize">{group.privacy}</span>
                </div>
              </div>
            </div>

            {/* Group Description */}
            {group.description && (
              <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                {highlightText(group.description, searchQuery)}
              </p>
            )}

            {/* Group Institution */}
            {group.institution && (
              <div className="mb-3 text-sm text-gray-500">
                <span className="font-medium">Institution:</span>{" "}
                {group.institution}
              </div>
            )}

            {/* Group Stats */}
            <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                  <span>{group.membersCount} members</span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>{group.postsCount} posts</span>
                </div>
              </div>
            </div>

            {/* Group Privacy Badge */}
            <div className="mb-3">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  group.privacy === "public"
                    ? "bg-green-100 text-green-800"
                    : group.privacy === "private"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {group.privacy === "public" && (
                  <svg
                    className="mr-1 h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                {group.privacy === "private" && (
                  <svg
                    className="mr-1 h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                )}
                {group.privacy.charAt(0).toUpperCase() + group.privacy.slice(1)}{" "}
                Group
              </span>
            </div>

            {/* Action Button */}
            <button className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none">
              {group.privacy === "public" ? "Join Group" : "Request to Join"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupsResults;
