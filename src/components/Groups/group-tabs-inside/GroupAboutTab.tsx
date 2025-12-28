import React from "react";
import type { Group } from "../../../types";

const GroupAboutTab: React.FC<{ group: Group }> = ({ group }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 font-bold text-gray-900">Description</h3>
        <p className="text-gray-700">
          {group.description || "No description provided"}
        </p>
      </div>

      <div>
        <h3 className="mb-2 font-bold text-gray-900">Privacy</h3>
        <p className="text-gray-700">
          {group.privacy === "public"
            ? "Public - Anyone can see posts and members"
            : group.privacy === "private"
              ? "Private - Only members can see posts"
              : "Closed - Invitation only"}
        </p>
      </div>

      {/* Group Stats */}
      <div>
        <h3 className="mb-3 font-bold text-gray-900">Group Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-2xl font-bold text-gray-900">
              {group.membersCount || 0}
            </p>
            <p className="text-sm text-gray-600">Members</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-2xl font-bold text-gray-900">
              {group.postsCount || 0}
            </p>
            <p className="text-sm text-gray-600">Posts</p>
          </div>
        </div>
      </div>

      {/* Created Date */}
      <div>
        <h3 className="mb-2 font-bold text-gray-900">Created</h3>
        <p className="text-gray-700">
          {group.createdAt
            ? new Date(group.createdAt).toLocaleDateString()
            : "N/A"}
        </p>
      </div>
    </div>
  );
};

export default GroupAboutTab;
