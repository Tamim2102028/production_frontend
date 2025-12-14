import React from "react";
import FriendCard from "../shared/friends/FriendCard";

// TODO: Replace with API data
interface SentRequest {
  id: string;
  name: string;
  avatar?: string;
  [key: string]: unknown;
}

interface SentRequestsProps {
  requests?: SentRequest[];
}

const SentRequests: React.FC<SentRequestsProps> = ({ requests = [] }) => {
  const sentRequests = requests;

  return (
    <div className="space-y-3">
      {sentRequests.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">
            No sent requests
          </h3>
          <p className="mt-2 text-gray-600">
            You haven't sent any friend requests yet.
          </p>
        </div>
      ) : (
        sentRequests.map((request) => (
          <FriendCard key={request.id} friend={request} type="sent" />
        ))
      )}
    </div>
  );
};

export default SentRequests;
