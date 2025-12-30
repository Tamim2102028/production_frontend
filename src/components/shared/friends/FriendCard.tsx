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
import { BsThreeDots } from "react-icons/bs";
import confirm from "../../../utils/sweetAlert";
import type { FriendUser } from "../../../types";
import {
  useAcceptFriendRequest,
  useCancelFriendRequest,
  useRejectFriendRequest,
  useSendFriendRequest,
  useUnfriendUser,
} from "../hooks/common/useFriendship";

interface FriendCardProps {
  friend: FriendUser;
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
  const navigate = useNavigate();
  // Mutations
  const { mutate: acceptRequest } = useAcceptFriendRequest();
  const { mutate: rejectRequest } = useRejectFriendRequest();
  const { mutate: sendRequest } = useSendFriendRequest();
  const { mutate: cancelRequest } = useCancelFriendRequest();
  const { mutate: unfriend } = useUnfriendUser();

  const handleMessage = (id: string) => {
    // TODO: Replace with API call to set selected conversation
    console.log("Message user:", id);
    navigate("/messages");
  };

  // Handle friend actions
  const handleAccept = (senderId: string) => {
    acceptRequest(senderId);
  };

  // Handle decline action
  const handleDecline = (senderId: string) => {
    rejectRequest(senderId);
  };

  // Handle add friend action
  const handleAddFriend = (receiverId: string) => {
    sendRequest(receiverId);
  };

  // Handle cancel request action
  const handleCancelRequest = (receiverId: string) => {
    cancelRequest(receiverId);
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
      unfriend(friendId);
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

  // Handle Institution Name safely
  const institutionName = friend.institution
    ? friend.institution.name + roleLabel
    : "No Institution" + roleLabel;

  const renderActions = () => {
    if (type === "friend") {
      return (
        <div className="flex items-center space-x-2">
          <MessageButton onClick={() => handleMessage(friend._id)} />
          <UnfriendButton onClick={() => handleUnfriend(friend._id)} />
        </div>
      );
    } else if (type === "request") {
      return (
        <div className="flex space-x-2">
          <AcceptButton onClick={() => handleAccept(friend._id)} />
          <RejectButton onClick={() => handleDecline(friend._id)} />
        </div>
      );
    } else if (type === "suggestion") {
      return <AddFriendButton onClick={() => handleAddFriend(friend._id)} />;
    } else if (type === "sent") {
      return (
        <div className="flex">
          <CancelRequestButton
            onClick={() => handleCancelRequest(friend._id)}
          />
        </div>
      );
    } else if (type === "search") {
      return null;
    } else {
      return null;
    }
  };

  return (
    <div className="flex items-center space-x-3 rounded-lg border border-gray-300 bg-white p-2 shadow-sm">
      <NavLink to={`/profile/${friend.userName}`}>
        <img
          src={friend.avatar}
          alt={friend.fullName}
          className="h-10 w-10 rounded-full object-cover transition-opacity hover:opacity-80"
        />
      </NavLink>
      <div className="flex-1">
        <h3>
          <NavLink
            to={`/profile/${friend.userName}`}
            className="font-medium text-gray-800 transition-colors hover:text-blue-600 hover:underline"
          >
            {friend.fullName}
          </NavLink>
        </h3>
        <p className="text-sm font-medium text-gray-500">{institutionName}</p>
      </div>
      <div className="flex items-center gap-2">
        {renderActions()}
        {canShowMenu && (
          <button
            onClick={() =>
              handleMemberMenu?.(friend._id, friend.fullName, isAdmin)
            }
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
