import GroupCard from "../utils/GroupCard";
import { useAppSelector } from "../../../store/hooks";
import { resolveGroupsByIds } from "../../../data/group-data/groupResolver";
import { getMemberCount } from "../../../data/group-data/groupMembers";

const UniversityGroups = () => {
  const user = useAppSelector((s) => s.profile);

  // Use the user's preJoinedGroup array to show only those groups in the University tab.
  // Support both pre-created ids (pg...) and normal group ids (g...)
  const preJoinedIds: string[] = user?.preJoinedGroup || [];

  // Use the resolver to translate ids => groups. When the backend uses a
  // single collection with uniform ids you only need to update
  // `groupResolver.findGroupById` to look into that collection.
  const preJoinedGroups = resolveGroupsByIds(preJoinedIds);

  const groups = preJoinedGroups.map((g) => ({
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
        University Groups ({groups.length})
      </h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} showJoinButton={false} />
        ))}
      </div>
    </div>
  );
};

export default UniversityGroups;
