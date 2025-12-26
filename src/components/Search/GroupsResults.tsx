import React from "react";
import GroupCard from "../Groups/utils/GroupCard";

// TODO: Replace with API data
interface Group {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  profileImage?: string;
  membersCount?: number;
  privacy?: string;
}

interface GroupsResultsProps {
  isVisible: boolean;
  groups?: Group[];
}

const GroupsResults: React.FC<GroupsResultsProps> = ({
  isVisible,
  groups = [],
}) => {
  if (!isVisible) return null;
  if (groups.length === 0) return null;

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-gray-900">
        Groups ({groups.length})
      </h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            showJoinButton={true}
            showCancelButton={true}
          />
        ))}
      </div>
    </div>
  );
};

export default GroupsResults;
