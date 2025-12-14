import React from "react";
import GroupCard from "../utils/GroupCard";
import { useAppSelector } from "../../../store/hooks";
import { getMemberCount } from "../../../data/group-data/groupMembers";

const pick = ["g21", "g22", "g23"];

const CareerGroups: React.FC = () => {
  const joined = useAppSelector((s) => s.profile.joinedGroup || []);
  const sent = useAppSelector((s) => s.profile.sentRequestGroup || []);

  const allGroups = useAppSelector((s) => s.groups.groups || []);

  // collect IDs from explicit picks and from groups that have type === 'jobs'
  const ids = new Set<string>();
  pick.forEach((id) => ids.add(id));
  allGroups.forEach((g) => {
    if (g?.type === "jobs") ids.add(g.id);
  });

  const groups = Array.from(ids)
    .map((id) => allGroups.find((g) => g.id === id))
    .filter(Boolean)
    .filter((g) => g!.privacy !== "closed")
    .filter((g) => {
      const joinedSet = new Set(joined || []);
      const sentSet = new Set(sent || []);
      return !joinedSet.has(g!.id) && !sentSet.has(g!.id);
    })
    .map((g) => ({
      id: g!.id,
      name: g!.name,
      description: g!.description,
      coverImage: g!.coverImage,
      memberCount: getMemberCount(g!.id),
      privacy: g!.privacy,
    }));

  return (
    <div>
      <h2 className="mb-3 text-xl font-semibold text-gray-900">
        Career & Job Groups ({groups.length})
      </h2>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} showJoinButton={true} />
        ))}
      </div>
    </div>
  );
};

export default CareerGroups;
