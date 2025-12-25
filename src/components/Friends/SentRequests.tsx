import React from "react";
import { FaPaperPlane } from "react-icons/fa";
import FriendCard from "../shared/friends/FriendCard";
import FriendCardSkeleton from "../shared/skeletons/FriendCardSkeleton";
import { useSentRequests } from "../../hooks/useFriendship";
import { toast } from "sonner";

const SentRequests: React.FC = () => {
  const { data, isLoading, error } = useSentRequests();

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
    toast.error("Failed to fetch sent requests. Please try again.");
    return (
      <div className="p-8 text-center text-red-500">
        Failed to fetch sent requests. Please try again.
        <p>Error: {error.message}</p>
      </div>
    );
  }

  const requests = data?.users || [];

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        Sent Requests ({data?.pagination?.totalDocs || 0})
      </h2>
      <div className="space-y-3">
        {requests.length === 0 ? (
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
          requests.map((request) => (
            <FriendCard key={request._id} friend={request} type="sent" />
          ))
        )}
      </div>
    </div>
  );
};

export default SentRequests;
