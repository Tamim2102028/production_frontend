import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEdit,
  FaUniversity,
  FaInfoCircle,
  FaGraduationCap,
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
} from "../../hooks/useFriendship";
import { useToggleFollow } from "../../hooks/useFollow";
import {
  FOLLOW_TARGET_MODELS,
  PROFILE_RELATION_STATUS,
  USER_TYPES,
} from "../../constants";
import type { User, Institution, Department } from "../../types/user.types";
import type { FriendshipStatus } from "../../types/profile.types";

type Props = {
  userData: User;
  isOwnProfile: boolean;
};

const ProfileHeader: React.FC<Props> = ({ userData, isOwnProfile }) => {
  // এই userData যার profile visit করতেছি তার
  const navigate = useNavigate();

  // Hooks for friendship actions
  const sendFriendRequest = useSendFriendRequest();
  const acceptFriendRequest = useAcceptFriendRequest();
  const rejectFriendRequest = useRejectFriendRequest();
  const cancelFriendRequest = useCancelFriendRequest();
  const unfriendUser = useUnfriendUser();

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

  // Render action buttons based on friendshipStatus
  const renderActionButtons = () => {
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
          View Details
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
    <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm">
      <div className="flex items-start space-x-5">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <img
            src={userData.avatar}
            alt={userData.fullName}
            className="h-32 w-32 rounded-full border-4 border-white shadow-lg"
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
