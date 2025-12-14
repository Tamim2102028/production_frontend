import React from "react";
import FriendCard from "../shared/friends/FriendCard";

// TODO: Replace with API data
interface FriendRequest {
  id: string;
  name: string;
  avatar?: string;
  [key: string]: unknown;
}

interface FriendRequestsProps {
  requests?: FriendRequest[];
}

const FriendRequests: React.FC<FriendRequestsProps> = ({ requests = [] }) => {
  const friendRequests = requests;

  return (
    <div>
      {friendRequests.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">
            No friend requests
          </h3>
          <p className="mt-2 text-gray-600">
            You don't have any pending friend requests.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {friendRequests.map((request) => (
            <FriendCard key={request.id} friend={request} type="request" />
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendRequests;
