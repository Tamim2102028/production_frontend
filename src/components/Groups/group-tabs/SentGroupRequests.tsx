import React from "react";
import { FaPaperPlane } from "react-icons/fa";
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
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-12 text-center">
          <div className="mb-4 rounded-full bg-white p-4 shadow-sm">
            <FaPaperPlane className="h-8 w-8 text-yellow-500" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No Sent Requests
          </h3>
          <p className="text-sm font-medium text-gray-500">
            You haven't sent any group requests yet. <br />
            Check back later!
          </p>
        </div>
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
