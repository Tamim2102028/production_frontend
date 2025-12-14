import React from "react";
import GroupCard from "../utils/GroupCard";
// profile data is read from Redux via useAppSelector
import { useAppSelector } from "../../../store/hooks";
import { getMemberCount } from "../../../data/group-data/groupMembers";

const SuggestedGroups: React.FC = () => {
  const joined = useAppSelector((s) => s.profile.joinedGroup || []);
  const preJoined = useAppSelector((s) => s.profile.preJoinedGroup || []);
  const sent = useAppSelector((s) => s.profile.sentRequestGroup || []);

  const allGroups = useAppSelector((s) => s.groups.groups || []);

  // Exclude groups the user already joined, was pre-joined into, or has sent a request to
  const exclude = new Set<string>([
    ...(joined || []),
    ...(preJoined || []),
    ...(sent || []),
  ]);

  const groups = allGroups
    .filter((g) => !exclude.has(g.id))
    .map((g) => ({
      id: g.id,
      name: g.name,
      description: g.description,
      coverImage: g.coverImage,
      memberCount: getMemberCount(g.id),
      privacy: g.privacy,
    }));

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
