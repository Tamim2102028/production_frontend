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

interface MyGroupsProps {
  groups?: Group[];
}

const MyGroups: React.FC<MyGroupsProps> = ({ groups = [] }) => {
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
