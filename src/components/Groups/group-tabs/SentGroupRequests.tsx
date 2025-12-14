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

interface SentGroupRequestsProps {
  groups?: Group[];
}

const SentGroupRequests: React.FC<SentGroupRequestsProps> = ({
  groups = [],
}) => {
  const requestGroups = groups;

  return (
    <div>
      <h2 className="mb-3 text-xl font-semibold text-gray-900">
        Sent Requests ({requestGroups.length})
      </h2>
      {requestGroups.length === 0 && (
        <p className="mb-4 text-sm text-gray-600">
          You have no pending group requests (closed groups are not listed).
        </p>
      )}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {requestGroups.map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            showJoinButton={false}
            showCancelButton={true}
          />
        ))}
      </div>
    </div>
  );
};

export default SentGroupRequests;
