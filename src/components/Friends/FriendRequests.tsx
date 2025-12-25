import React from "react";
import { FaUserPlus } from "react-icons/fa";
import FriendCard from "../shared/friends/FriendCard";
import FriendCardSkeleton from "../shared/skeletons/FriendCardSkeleton";
import { useReceivedRequests } from "../../hooks/useFriendship";
import { toast } from "sonner";

const FriendRequests: React.FC = () => {
  const { data, isLoading, error } = useReceivedRequests();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <FriendCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    toast.error("Failed to fetch friend requests. Please try again.");
    return (
      <div className="p-8 text-center text-red-500">
        Failed to fetch friend requests. Please try again.
        <p>Error: {error.message}</p>
      </div>
    );
  }

  const requests = data?.users || [];

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        Friend Requests ({data?.pagination?.totalDocs || 0})
      </h2>
      {requests.length === 0 ? (
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
          {requests.map((request) => (
            <FriendCard key={request._id} friend={request} type="request" />
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendRequests;
