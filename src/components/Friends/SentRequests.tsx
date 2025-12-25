import React from "react";
import { FaPaperPlane } from "react-icons/fa";
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
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-12 text-center">
          <div className="mb-4 rounded-full bg-white p-4 shadow-sm">
            <FaPaperPlane className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No Sent Requests
          </h3>
          <p className="text-sm font-medium text-gray-500">
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
