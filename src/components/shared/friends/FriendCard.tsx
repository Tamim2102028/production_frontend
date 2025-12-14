import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  MessageButton,
  UnfriendButton,
  AcceptButton,
  RejectButton,
  AddFriendButton,
  CancelRequestButton,
} from "./FriendActions";
import type { UserData } from "../../../data/profile-data/userData";
import { BsThreeDots } from "react-icons/bs";
import { useAppDispatch } from "../../../store/hooks";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  rejectFriendRequest,
  removeFriendship,
  sendFriendRequest,
} from "../../../store/slices/friendsSlice";
import confirm from "../../../utils/sweetAlert";
import { getCurrentUserId } from "../../../services/userService";
import { setSelectedConversation } from "../../../store/slices/messagesSlice";

interface FriendCardProps {
  friend: UserData;
  type: "friend" | "request" | "suggestion" | "sent";
  isOwner?: boolean;
  isAdmin?: boolean;
  canShowMenu?: boolean;
  handleMemberMenu?: (
    userId: string,
    userName?: string,
    isAdmin?: boolean
  ) => void;
}

const FriendCard: React.FC<FriendCardProps> = ({
  friend,
  type,
  isOwner,
  isAdmin,
  canShowMenu,
  handleMemberMenu,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUserId = getCurrentUserId();

  const handleMessage = (id: string) => {
    dispatch(setSelectedConversation(id));
    navigate("/messages");
  };

  // Handle friend actions
  const handleAccept = (senderId: string) => {
    dispatch(acceptFriendRequest({ senderId, receiverId: currentUserId }));
  };

  // Handle decline action
  const handleDecline = (senderId: string) => {
    dispatch(rejectFriendRequest({ senderId, receiverId: currentUserId }));
  };

  // Handle add friend action
  const handleAddFriend = (receiverId: string) => {
    dispatch(sendFriendRequest({ senderId: currentUserId, receiverId }));
  };

  // Handle cancel request action
  const handleCancelRequest = (receiverId: string) => {
    dispatch(cancelFriendRequest({ senderId: currentUserId, receiverId }));
  };

  // Handle unfriend action
  const handleUnfriend = async (friendId: string) => {
    const ok = await confirm({
      title: "Are you sure?",
      text: "You will remove this friend.",
      confirmButtonText: "Yes, unfriend",
      icon: "warning",
    });

    if (ok) {
      dispatch(removeFriendship({ user1Id: currentUserId, user2Id: friendId }));
    }
  };

  let roleLabel = "";
  if (isOwner && isAdmin) {
    roleLabel = " • Owner • Admin";
  } else if (isOwner) {
    roleLabel = " • Owner";
  } else if (isAdmin) {
    roleLabel = " • Admin";
  }

  const institutionName =
    friend.educationLevel === "UNIVERSITY"
      ? friend.university?.name + roleLabel
      : friend.college?.name + roleLabel;

  const renderActions = () => {
    if (type === "friend") {
      return (
        <div className="flex items-center space-x-2">
          <MessageButton onClick={() => handleMessage(friend.id)} />
          <UnfriendButton onClick={() => handleUnfriend(friend.id)} />
        </div>
      );
    } else if (type === "request") {
      return (
        <div className="flex space-x-2">
          <AcceptButton onClick={() => handleAccept(friend.id)} />
          <RejectButton onClick={() => handleDecline(friend.id)} />
        </div>
      );
    } else if (type === "suggestion") {
      return <AddFriendButton onClick={() => handleAddFriend(friend.id)} />;
    } else if (type === "sent") {
      return (
        <div className="flex">
          <CancelRequestButton onClick={() => handleCancelRequest(friend.id)} />
        </div>
      );
    } else if (type === "search") {
      return null;
    } else {
      return null;
    }
  };

  return (
    <div className="flex items-center space-x-3 rounded-lg border border-gray-300 bg-white p-3 shadow-sm">
      <img
        src={friend.avatar}
        alt={friend.name}
        className="h-12 w-12 rounded-full object-cover"
      />
      <div className="flex-1">
        <h3>
          <NavLink
            to={`/profile/${friend.id}`}
            className="font-semibold text-gray-900 transition-colors hover:text-blue-600 hover:underline"
          >
            {friend.name}
          </NavLink>
        </h3>
        {institutionName && (
          <p className="text-sm text-gray-500">{institutionName}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {renderActions()}
        {canShowMenu && (
          <button
            onClick={() => handleMemberMenu?.(friend.id, friend.name, isAdmin)}
            className="p-1 text-gray-500 hover:text-gray-800"
            aria-label="Member menu"
          >
            <BsThreeDots className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default FriendCard;
