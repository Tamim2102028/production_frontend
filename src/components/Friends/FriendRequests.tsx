import React from "react";
import { FaUserPlus } from "react-icons/fa";
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
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-12 text-center">
          <div className="mb-4 rounded-full bg-white p-4 shadow-sm">
            <FaUserPlus className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No Friend Requests
          </h3>
          <p className="text-sm font-medium text-gray-500">
            You have no pending friend requests at the moment.
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
