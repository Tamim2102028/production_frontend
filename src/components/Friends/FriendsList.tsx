import React from "react";
import { FaUserFriends } from "react-icons/fa";
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
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-12 text-center">
        <div className="mb-4 rounded-full bg-white p-4 shadow-sm">
          <FaUserFriends className="h-8 w-8 text-blue-500" />
        </div>
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          No Friends Yet
        </h3>
        <p className="text-sm font-medium text-gray-500">
          Start connecting with people from your university.
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
