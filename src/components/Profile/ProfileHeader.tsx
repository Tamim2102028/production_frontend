import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEdit,
  FaUniversity,
  FaInfoCircle,
  FaGraduationCap,
  FaEllipsisV,
  FaLink,
  FaBan,
} from "react-icons/fa";
import {
  MessageButton,
  UnfriendButton,
  AcceptButton,
  RejectButton,
  AddFriendButton,
  CancelRequestButton,
} from "../shared/friends/FriendActions";
import confirm from "../../utils/sweetAlert";
import {
  useSendFriendRequest,
  useAcceptFriendRequest,
  useRejectFriendRequest,
  useCancelFriendRequest,
  useUnfriendUser,
  useBlockUser,
  useUnblockUser,
} from "../../hooks/useFriendship";
import { useToggleFollow } from "../../hooks/useFollow";
import {
  FOLLOW_TARGET_MODELS,
  PROFILE_RELATION_STATUS,
  USER_TYPES,
} from "../../constants";
import type { User, Institution, Department } from "../../types/user.types";
import type { FriendshipStatus } from "../../types/profile.types";
import { toast } from "sonner";

type Props = {
  userData: User;
  isOwnProfile: boolean;
};

const ProfileHeader: React.FC<Props> = ({ userData, isOwnProfile }) => {
  // এই userData যার profile visit করতেছি তার
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  // Hooks for friendship actions
  const sendFriendRequest = useSendFriendRequest();
  const acceptFriendRequest = useAcceptFriendRequest();
  const rejectFriendRequest = useRejectFriendRequest();
  const cancelFriendRequest = useCancelFriendRequest();
  const unfriendUser = useUnfriendUser();
  const blockUser = useBlockUser();
  const unblockUser = useUnblockUser();

  // Hook for follow actions
  const toggleFollow = useToggleFollow();

  // Calculate friendshipStatus from userData
  const friendshipStatus: FriendshipStatus =
    (userData?.profile_relation_status as FriendshipStatus) ||
    PROFILE_RELATION_STATUS.NOT_FRIENDS;

  const isFollowing = userData?.isFollowing || false;

  // Helper to get institution name
  const getInstitutionName = (): string => {
    return (userData.institution as Institution)?.name || "";
  };

  // Helper to get department name
  const getDepartmentName = (): string => {
    return (userData.academicInfo?.department as Department)?.name || "";
  };

  const handleMessage = (userId: string) => {
    // TODO: Replace with API call to set selected conversation
    console.log("Message user:", userId);
    navigate("/messages");
  };

  // Handle friend actions
  const handleAccept = (senderId: string) => {
    acceptFriendRequest.mutate(senderId);
  };

  const handleDecline = (senderId: string) => {
    rejectFriendRequest.mutate(senderId);
  };

  const handleAddFriend = (receiverId: string) => {
    sendFriendRequest.mutate(receiverId);
  };

  const handleCancelRequest = (receiverId: string) => {
    cancelFriendRequest.mutate(receiverId);
  };

  const handleUnfriend = async (friendId: string) => {
    const ok = await confirm({
      title: "Are you sure?",
      text: "You will remove this friend.",
      confirmButtonText: "Yes, unfriend",
      icon: "warning",
    });

    if (ok) {
      unfriendUser.mutate(friendId);
    }
  };

  // Handle follow actions
  const handleToggleFollow = (targetId: string) => {
    toggleFollow.mutate({ targetId, targetModel: FOLLOW_TARGET_MODELS.USER });
  };

  const handleCopyLink = () => {
    const profileUrl = window.location.href;
    navigator.clipboard.writeText(profileUrl);
    toast.success("Profile link copied to clipboard!");
    setShowMenu(false);
  };

  const handleBlock = async () => {
    const ok = await confirm({
      title: "Block User?",
      text: "All existing relationships (friendship, follows) will be removed. You won't see each other's updates.",
      confirmButtonText: "Yes, block",
      icon: "warning",
    });

    if (ok) {
      blockUser.mutate(userData._id);
      setShowMenu(false);
    }
  };

  const handleUnblock = async () => {
    const ok = await confirm({
      title: "Unblock User?",
      text: "You will be able to send friend requests or follow this user again.",
      confirmButtonText: "Yes, unblock",
      icon: "question",
    });

    if (ok) {
      unblockUser.mutate(userData._id);
    }
  };

  // Render action buttons based on friendshipStatus
  const renderActionButtons = () => {
    // 1. BLOCKED BY ME
    if (userData.isBlockedByMe) {
      return (
        <div className="flex items-center gap-3">
          <span className="rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-600">
            You blocked this user
          </span>
          <button
            onClick={handleUnblock}
            className="rounded-md bg-gray-100 px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
          >
            Unblock
          </button>
        </div>
      );
    }

    // 2. BLOCKED BY TARGET
    if (userData.isBlockedByTarget) {
      return (
        <span className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-500">
          {userData.fullName} blocked you
        </span>
      );
    }

    if (friendshipStatus === PROFILE_RELATION_STATUS.SELF || isOwnProfile) {
      return (
        <>
          {/* edit and details buttons */}
          <div className="flex gap-3">
            {/* edit button */}
            <Link
              to="/profile/edit"
              className="flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
            >
              <FaEdit className="h-4 w-4" />
              Edit Profile
            </Link>
            {/* details button */}
            <Link
              to="/profile/details"
              className="flex items-center gap-2 rounded-md bg-gray-600 px-6 py-2 text-white transition-colors hover:bg-gray-700"
            >
              <FaInfoCircle className="h-4 w-4" />
              Details
            </Link>
          </div>
        </>
      );
    }

    // Other user's profile
    return (
      <div className="flex items-center gap-3">
        {/* FRIEND - Message & Unfriend */}
        {friendshipStatus === PROFILE_RELATION_STATUS.FRIEND && (
          <>
            <MessageButton onClick={() => handleMessage(userData._id)} />
            <UnfriendButton onClick={() => handleUnfriend(userData._id)} />
          </>
        )}

        {/* REQUEST_SENT - Cancel Request */}
        {friendshipStatus === PROFILE_RELATION_STATUS.REQUEST_SENT && (
          <CancelRequestButton
            onClick={() => handleCancelRequest(userData._id)}
          />
        )}

        {/* REQUEST_RECEIVED - Accept/Reject */}
        {friendshipStatus === PROFILE_RELATION_STATUS.REQUEST_RECEIVED && (
          <>
            <AcceptButton onClick={() => handleAccept(userData._id)} />
            <RejectButton onClick={() => handleDecline(userData._id)} />
          </>
        )}

        {/* NOT_FRIENDS - Add Friend */}
        {friendshipStatus === PROFILE_RELATION_STATUS.NOT_FRIENDS && (
          <AddFriendButton onClick={() => handleAddFriend(userData._id)} />
        )}

        {/* BLOCKED - Show blocked message */}
        {friendshipStatus === PROFILE_RELATION_STATUS.BLOCKED && (
          <span className="rounded-md bg-red-100 px-4 py-2 text-red-600">
            User Blocked
          </span>
        )}

        {/* View Details button for all */}
        <Link
          to={`/profile/${userData.userName}/details`}
          className="flex items-center gap-2 rounded-md bg-gray-600 px-6 py-2 text-white transition-colors hover:bg-gray-700"
        >
          <FaInfoCircle className="h-4 w-4" />
          Details
        </Link>

        {/* Follow/Unfollow Button */}
        <button
          onClick={() => handleToggleFollow(userData._id)}
          className={`flex items-center gap-2 rounded-md px-6 py-2 transition-colors ${
            isFollowing
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      </div>
    );
  };

  return (
    <div className="relative rounded-lg border border-gray-300 bg-white p-5 shadow-sm">
      {/* 3-Dot Menu */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 focus:outline-none"
        >
          <FaEllipsisV className="h-5 w-5" />
        </button>

        {showMenu && (
          <>
            {/* Backdrop to close menu */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowMenu(false)}
            ></div>

            {/* Dropdown content */}
            <div className="absolute top-full right-0 z-50 mt-1 w-56 rounded-lg border border-gray-200 bg-white shadow-lg">
              <div className="py-1">
                <button
                  onClick={handleCopyLink}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <FaLink className="h-4 w-4 flex-shrink-0 text-gray-400" />
                  <span className="font-medium">Copy profile link</span>
                </button>
                {!isOwnProfile &&
                  !userData.isBlockedByMe &&
                  !userData.isBlockedByTarget && (
                    <button
                      onClick={handleBlock}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-gray-50"
                    >
                      <FaBan className="h-4 w-4 flex-shrink-0" />
                      <span className="font-medium">Block user</span>
                    </button>
                  )}
                {userData.isBlockedByMe && (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      handleUnblock();
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <FaBan className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium">Unblock user</span>
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex items-start space-x-5">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <img
            src={userData.avatar}
            alt={userData.fullName}
            className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg"
          />
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <div>
            <h1 className="mb-1 text-3xl leading-tight font-bold text-gray-900">
              {userData.fullName}
            </h1>

            {/* Institution & Department */}
            {getInstitutionName() || getDepartmentName() ? (
              <div className="mt-1 space-y-1">
                <p className="flex items-center gap-2 text-sm text-gray-600 md:text-base">
                  <FaUniversity className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-gray-800">
                    {getInstitutionName() || "Institution not set"}
                  </span>
                </p>
                <p className="flex items-center gap-2 text-sm text-gray-600 md:text-base">
                  <FaGraduationCap className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-gray-800">
                    {getDepartmentName() || "Department not set"}
                    {userData.userType === USER_TYPES.STUDENT &&
                      userData.academicInfo?.section && (
                        <span className="text-gray-600">
                          {" "}
                          (Section: {userData.academicInfo.section})
                        </span>
                      )}
                  </span>
                </p>
              </div>
            ) : (
              <p className="flex items-center gap-2 text-sm text-gray-400 italic md:text-lg">
                <FaUniversity className="h-4 w-4 text-gray-400" />
                <span>No institution added yet</span>
              </p>
            )}

            {/* Bio */}
            {userData.bio ? (
              <p className="mt-3 max-w-prose text-base leading-relaxed text-gray-700">
                {userData.bio}
              </p>
            ) : (
              <p className="mt-3 max-w-prose text-base leading-relaxed text-gray-400 italic">
                {isOwnProfile
                  ? "Add a bio to tell people about yourself..."
                  : "No bio added yet"}
              </p>
            )}

            {/* Stats */}
            <div className="mt-2 flex gap-4 text-sm text-gray-500">
              <span>
                <strong className="text-gray-900">
                  {userData.stats?.friendsCount || 0}
                </strong>{" "}
                Friends
              </span>
              <span>
                <strong className="text-gray-900">
                  {userData.stats?.followersCount || 0}
                </strong>{" "}
                Followers
              </span>
              <span>
                <strong className="text-gray-900">
                  {userData.stats?.followingCount || 0}
                </strong>{" "}
                Following
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4">{renderActionButtons()}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
