import React from "react";
import FriendCard from "../shared/friends/FriendCard";
import { getUserById } from "../../services/userService";
import { useAppSelector } from "../../store/hooks";
import { selectUserById } from "../../store/slices/profileSlice";
import { selectPendingRequestsForUser } from "../../store/slices/friendsSlice";
import type { RootState } from "../../store/store";

const FriendRequests: React.FC = () => {
  const currentUser = useAppSelector((s) => selectUserById(s, s.profile.id));

  // Get pending requests from Redux friends slice
  // requesterIds = [userId1, userId2, ...] - যারা currentUser কে friend request পাঠিয়েছে
  const requesterIds = useAppSelector((s: RootState) =>
    selectPendingRequestsForUser(s, currentUser?.id || "")
  );

  if (!currentUser) {
    return <div>User not found</div>;
  }

  // Get pending friend requests data from requesterIds
  // friendRequests = [{userData}, {userData}, ...]
  const friendRequests = requesterIds
    .map((requestId) => {
      const requester = getUserById(requestId);
      if (!requester) return null;

      console.log(requester);
      return {
        ...requester,
      };
    })
    .filter((friend) => friend !== null);

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
