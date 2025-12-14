import React from "react";
import { useAppSelector } from "../../store/hooks";
import { selectFilteredGroups } from "../../store/slices/search/searchSlice";
import { getMemberCount } from "../../data/group-data/groupMembers";
import GroupCard from "../Groups/utils/GroupCard";

interface GroupsResultsProps {
  isVisible: boolean;
}

const GroupsResults: React.FC<GroupsResultsProps> = ({ isVisible }) => {
  const filteredGroups = useAppSelector(selectFilteredGroups);

  if (!isVisible) return null;
  if (filteredGroups.length === 0) return null;

  // Map groups to GroupCard format
  const groups = filteredGroups.map((group) => ({
    id: group.id,
    name: group.name,
    description: group.description,
    coverImage: group.coverImage,
    profileImage: group.profileImage,
    memberCount: getMemberCount(group.id),
    privacy: group.privacy,
  }));

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
