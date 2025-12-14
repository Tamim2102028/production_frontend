import React from "react";
import FriendCard from "../shared/friends/FriendCard";
import { getUserById } from "../../services/userService";
import { useAppSelector } from "../../store/hooks";
import { selectUserById } from "../../store/slices/profileSlice";
import { selectFriendsForUser } from "../../store/slices/friendsSlice";
import type { RootState } from "../../store/store";

const FriendsList: React.FC = () => {
  const currentUser = useAppSelector((s) => selectUserById(s, s.profile.id));

  // Get friends from Redux friends slice
  const friendIds = useAppSelector((s: RootState) =>
    selectFriendsForUser(s, currentUser?.id || "")
  );

  if (!currentUser) {
    return <div>User not found</div>;
  }

  // friends = [{userData}, {userData}, ...]
  const friends = friendIds
    .map((friendId) => {
      const friend = getUserById(friendId);
      if (!friend) return null;
      return {
        ...friend,
      };
    })
    .filter((friend) => friend !== null);

  if (friends.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">No friends yet</h3>
        <p className="mt-2 text-gray-600">
          You don't have any friends added. Add some friends to connect with
          them.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {friends.map((friend) => (
        <FriendCard key={friend.id} friend={friend} type="friend" />
      ))}
    </div>
  );
};

export default FriendsList;
