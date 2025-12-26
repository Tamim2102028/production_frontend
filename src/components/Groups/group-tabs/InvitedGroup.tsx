import React from "react";
import { FaEnvelope } from "react-icons/fa";
import GroupCard from "../utils/GroupCard";

// TODO: Replace with API data
interface Group {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  memberCount?: number;
  privacy?: string;
}

interface InvitedGroupProps {
  groups?: Group[];
}

const InvitedGroup: React.FC<InvitedGroupProps> = ({ groups = [] }) => {
  const invitedGroups = groups;

  return (
    <div>
      <h2 className="mb-3 text-xl font-semibold text-gray-900">
        Invited Groups ({invitedGroups.length})
      </h2>
      {invitedGroups.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-12 text-center">
          <div className="mb-4 rounded-full bg-white p-4 shadow-sm">
            <FaEnvelope className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No Group Invitations
          </h3>
          <p className="text-sm font-medium text-gray-500">
            You haven't been invited to any groups yet. <br />
            Check back later!
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {invitedGroups.map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            showJoinButton={true}
            showCancelButton={false}
          />
        ))}
      </div>
    </div>
  );
};

export default InvitedGroup;
