import React from "react";
import FriendCard from "../shared/friends/FriendCard";
import { usersData } from "../../data/profile-data/userData";
import { useAppSelector } from "../../store/hooks";
import { selectUserById } from "../../store/slices/profileSlice";
import {
  selectFriendsForUser,
  selectPendingRequestsForUser,
  selectSentRequestsByUser,
} from "../../store/slices/friendsSlice";
import type { RootState } from "../../store/store";

const FriendSuggestions: React.FC = () => {
  const currentUser = useAppSelector((s) => selectUserById(s, s.profile.id));

  // Get friend data from Redux friends slice
  const friendIds = useAppSelector((s: RootState) =>
    selectFriendsForUser(s, currentUser?.id || "")
  );
  const pendingRequestIds = useAppSelector((s: RootState) =>
    selectPendingRequestsForUser(s, currentUser?.id || "")
  );
  const sentRequestIds = useAppSelector((s: RootState) =>
    selectSentRequestsByUser(s, currentUser?.id || "")
  );

  if (!currentUser) {
    return <div>User not found</div>;
  }

  // Get friend suggestions - users who are not current user, not friends, and not in pending requests
  // friendSuggestions = [{userData}, {userData}, ...]
  const friendSuggestions = usersData
    .filter(
      (user) =>
        user.id !== currentUser.id && // Not current user
        !friendIds.includes(user.id) && // Not already a friend
        !pendingRequestIds.includes(user.id) && // Not in pending requests
        !sentRequestIds.includes(user.id) // Not in sent requests
    )
    .map((user) => {
      return {
        ...user,
      };
    });

  return (
    <div className="space-y-3">
      {friendSuggestions.map((suggestion) => (
        <FriendCard key={suggestion.id} friend={suggestion} type="suggestion" />
      ))}
    </div>
  );
};

export default FriendSuggestions;
