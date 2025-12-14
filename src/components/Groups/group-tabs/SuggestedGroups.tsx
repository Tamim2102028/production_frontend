import React from "react";
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

interface SuggestedGroupsProps {
  groups?: Group[];
}

const SuggestedGroups: React.FC<SuggestedGroupsProps> = ({ groups = [] }) => {
  return (
    <div>
      <h2 className="mb-3 text-xl font-semibold text-gray-900">
        Suggested Groups ({groups.length})
      </h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} showJoinButton={true} />
        ))}
      </div>
    </div>
  );
};

export default SuggestedGroups;
