import React from "react";
import FriendCard from "../shared/friends/FriendCard";
import { getUserById } from "../../services/userService";
import { useAppSelector } from "../../store/hooks";
import { selectUserById } from "../../store/slices/profileSlice";
import { selectSentRequestsByUser } from "../../store/slices/friendsSlice";
import type { RootState } from "../../store/store";

const SentRequests: React.FC = () => {
  const currentUser = useAppSelector((s) => selectUserById(s, s.profile.id));

  // Get sent requests from Redux friends slice
  const receiverIds = useAppSelector((s: RootState) =>
    selectSentRequestsByUser(s, currentUser?.id || "")
  );

  if (!currentUser) {
    return <div>User not found</div>;
  }

  // Get sent requests data from receiverIds
  const sentRequests = receiverIds
    .map((requestId) => {
      const requestedUser = getUserById(requestId);
      if (!requestedUser) return null;

      return {
        ...requestedUser,
      };
    })
    .filter((request) => request !== null);

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
