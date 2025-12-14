import React from "react";
import FriendCard from "../shared/friends/FriendCard";

// TODO: Replace with API data
interface Friend {
  id: string;
  name: string;
  avatar?: string;
  [key: string]: unknown;
}

interface FriendsListProps {
  friends?: Friend[];
}

const FriendsList: React.FC<FriendsListProps> = ({ friends = [] }) => {
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
