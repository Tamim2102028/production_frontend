import React from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaUniversity, FaInfoCircle } from "react-icons/fa";
import { useAppDispatch } from "../../store/hooks";
import {
  sendFriendRequest,
  cancelFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriendship,
} from "../../store/slices/friendsSlice";
import { setSelectedConversation } from "../../store/slices/messagesSlice";
import {
  MessageButton,
  UnfriendButton,
  AcceptButton,
  RejectButton,
  AddFriendButton,
  CancelRequestButton,
} from "../shared/friends/FriendActions";
import type { UserData } from "../../data/profile-data/userData";
import { getCurrentUserId } from "../../services/userService";
import confirm from "../../utils/sweetAlert";

type Props = {
  userData: UserData;
  isOwnProfile: boolean;
  actualUserId: string;
  relationship: string;
  onEditProfile: () => void;
  onViewDetails: () => void;
};

const ProfileHeader: React.FC<Props> = ({
  userData,
  isOwnProfile,
  actualUserId,
  relationship,
  onEditProfile,
  onViewDetails,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUserId = getCurrentUserId();

  const handleMessage = (actualUserId: string) => {
    dispatch(setSelectedConversation(actualUserId));
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

  return (
    <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm">
      <div className="flex items-start space-x-5">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <img
            src={userData.avatar}
            alt={userData.name}
            className="h-32 w-32 rounded-full border-4 border-white shadow-lg"
          />
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <div>
            <h1 className="mb-1 text-3xl leading-tight font-bold text-gray-900">
              {userData.name}
            </h1>

            <p className="flex items-center gap-2 text-sm text-gray-600 md:text-lg">
              <FaUniversity className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-gray-800">
                {userData.educationLevel === "UNIVERSITY" ? (
                  <>
                    {userData.university?.name} -{" "}
                    {userData.university?.department}
                    {userData.userType?.includes("student") &&
                      userData.university?.section && (
                        <span className="text-gray-600">
                          {" "}
                          (Section: {userData.university?.section}
                          {userData.university?.subsection &&
                            `-${userData.university?.subsection}`}
                          )
                        </span>
                      )}
                  </>
                ) : (
                  <>
                    {userData.college?.name}
                    {userData.college?.department &&
                      ` - ${userData.college.department}`}
                  </>
                )}
              </span>
            </p>

            <p className="mt-3 max-w-prose text-base leading-relaxed text-gray-700">
              {userData.bio}
            </p>
          </div>

          {/* Action Buttons */}
          {isOwnProfile ? (
            <div className="pt-4">
              <div className="flex gap-3">
                <button
                  onClick={onEditProfile}
                  className="flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
                >
                  <FaEdit className="h-4 w-4" />
                  Edit Profile
                </button>

                <button
                  onClick={onViewDetails}
                  className="flex items-center gap-2 rounded-md bg-gray-600 px-6 py-2 text-white transition-colors hover:bg-gray-700"
                >
                  <FaInfoCircle className="h-4 w-4" />
                  Details
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 pt-4">
              {relationship === "friends" && (
                <div className="flex items-center space-x-2">
                  <MessageButton onClick={() => handleMessage(actualUserId)} />
                  <UnfriendButton
                    onClick={() => handleUnfriend(actualUserId)}
                  />
                </div>
              )}

              {relationship === "pending_sent" && (
                <CancelRequestButton
                  onClick={() => handleCancelRequest(actualUserId)}
                />
              )}

              {relationship === "pending_received" && (
                <div className="flex items-center gap-2">
                  <AcceptButton onClick={() => handleAccept(actualUserId)} />
                  <RejectButton onClick={() => handleDecline(actualUserId)} />
                </div>
              )}

              {relationship === "none" && (
                <AddFriendButton
                  onClick={() => handleAddFriend(actualUserId)}
                />
              )}

              <button
                onClick={onViewDetails}
                className="flex items-center gap-2 rounded-md bg-gray-600 px-6 py-2 text-white transition-colors hover:bg-gray-700"
              >
                <FaInfoCircle className="h-4 w-4" />
                View Details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
