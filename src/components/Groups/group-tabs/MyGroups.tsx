import GroupCard from "../utils/GroupCard";
import { useAppSelector } from "../../../store/hooks";
import { getMemberCount } from "../../../data/group-data/groupMembers";

const MyGroups = () => {
  const joined = useAppSelector((s) => s.profile.joinedGroup || []);

  const allGroups = useAppSelector((s) => s.groups.groups || []);

  const groups = joined
    .map((gid) => allGroups.find((g) => g.id === gid))
    .filter(Boolean)
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
        My Groups ({groups.length})
      </h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} showJoinButton={false} />
        ))}
      </div>
    </div>
  );
};

export default MyGroups;
