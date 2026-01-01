import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import {
  FaUserShield,
  FaUserMinus,
  FaUserPlus,
  FaCrown,
  FaBan,
} from "react-icons/fa";
import { useQueryClient } from "@tanstack/react-query";
import {
  MessageButton,
  UnfriendButton,
  AcceptButton,
  RejectButton,
  AddFriendButton,
  CancelRequestButton,
  UnblockButton,
} from "../shared/friends/FriendActions";
import confirm from "../../utils/sweetAlert";
import { GROUP_ROLES } from "../../constants";
import type { GroupMemberItem } from "../../types";
import {
  useAcceptFriendRequest,
  useCancelFriendRequest,
  useRejectFriendRequest,
  useSendFriendRequest,
  useUnfriendUser,
  useUnblockUser,
} from "../../hooks/useFriendship";
import {
  usePromoteToModerator,
  usePromoteToAdmin,
  useDemoteToModerator,
  useDemoteToMember,
  useTransferOwnership,
  useBanMember,
} from "../../hooks/useGroup";

interface MemberCardProps {
  member: GroupMemberItem;
  currentUserRole: (typeof GROUP_ROLES)[keyof typeof GROUP_ROLES] | null;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, currentUserRole }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { slug } = useParams<{ slug: string }>();
  const { user, meta } = member;

  const [showMenu, setShowMenu] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Helper to invalidate group members after friendship action
  const invalidateGroupMembers = () => {
    if (slug) {
      queryClient.invalidateQueries({ queryKey: ["groupMembers", slug] });
    }
  };

  // Friendship mutations
  const { mutate: acceptRequest } = useAcceptFriendRequest();
  const { mutate: rejectRequest } = useRejectFriendRequest();
  const { mutate: sendRequest } = useSendFriendRequest();
  const { mutate: cancelRequest } = useCancelFriendRequest();
  const { mutate: unfriend } = useUnfriendUser();
  const { mutate: unblock } = useUnblockUser();

  // Role management mutations
  const { mutate: promoteToModerator } = usePromoteToModerator();
  const { mutate: promoteToAdmin } = usePromoteToAdmin();
  const { mutate: demoteToModerator } = useDemoteToModerator();
  const { mutate: demoteToMember } = useDemoteToMember();
  const { mutate: transferOwnership } = useTransferOwnership();
  const { mutate: banMember } = useBanMember();

  // Role hierarchy for permission checks
  const roleHierarchy = {
    [GROUP_ROLES.OWNER]: 4,
    [GROUP_ROLES.ADMIN]: 3,
    [GROUP_ROLES.MODERATOR]: 2,
    [GROUP_ROLES.MEMBER]: 1,
  };

  const currentUserLevel = currentUserRole ? roleHierarchy[currentUserRole] : 0;
  const targetUserLevel = roleHierarchy[meta.role];

  // Check if 3-dot menu should show
  const canShowMenu =
    !meta.isSelf &&
    currentUserLevel > targetUserLevel &&
    currentUserLevel >= roleHierarchy[GROUP_ROLES.MODERATOR];

  // Friendship action handlers
  const handleMessage = () => {
    navigate("/messages");
  };

  const handleAccept = () => {
    acceptRequest(
      { requesterId: user._id },
      { onSuccess: invalidateGroupMembers }
    );
  };

  const handleDecline = () => {
    rejectRequest(
      { requesterId: user._id },
      { onSuccess: invalidateGroupMembers }
    );
  };

  const handleAddFriend = () => {
    sendRequest({ userId: user._id }, { onSuccess: invalidateGroupMembers });
  };

  const handleCancelRequest = () => {
    cancelRequest(
      { recipientId: user._id },
      { onSuccess: invalidateGroupMembers }
    );
  };

  const handleUnfriend = async () => {
    const ok = await confirm({
      title: "Are you sure?",
      text: "You will remove this friend.",
      confirmButtonText: "Yes, unfriend",
      icon: "warning",
    });
    if (ok) {
      unfriend({ friendId: user._id }, { onSuccess: invalidateGroupMembers });
    }
  };

  const handleUnblock = () => {
    unblock({ userId: user._id }, { onSuccess: invalidateGroupMembers });
  };

  // Role management handlers
  const handleTransferOwnership = async () => {
    setShowMenu(false);
    const ok = await confirm({
      title: "Transfer Ownership?",
      text: `${user.fullName} will become the owner and you will become an admin.`,
      confirmButtonText: "Yes, transfer",
      icon: "warning",
    });
    if (ok && slug) {
      transferOwnership({ slug, userId: user._id });
    }
  };

  const handlePromoteToAdmin = () => {
    setShowMenu(false);
    if (slug) promoteToAdmin({ slug, userId: user._id });
  };

  const handlePromoteToModerator = () => {
    setShowMenu(false);
    if (slug) promoteToModerator({ slug, userId: user._id });
  };

  const handleDemoteToModerator = () => {
    setShowMenu(false);
    if (slug) demoteToModerator({ slug, userId: user._id });
  };

  const handleDemoteToMember = () => {
    setShowMenu(false);
    if (slug) demoteToMember({ slug, userId: user._id });
  };

  const handleBan = async () => {
    setShowMenu(false);
    const ok = await confirm({
      title: "Ban Member?",
      text: `${user.fullName} will be banned from this group.`,
      confirmButtonText: "Yes, ban",
      icon: "warning",
    });
    if (ok && slug) {
      banMember({ slug, userId: user._id });
    }
  };

  // Render friendship action buttons
  const renderActions = () => {
    if (meta.isSelf) return null;
    if (meta.isBlockedByThem) return null;

    if (meta.isBlockedByMe) {
      return <UnblockButton onClick={handleUnblock} />;
    }

    if (meta.isFriend) {
      return (
        <div className="flex items-center space-x-2">
          <MessageButton onClick={handleMessage} />
          <UnfriendButton onClick={handleUnfriend} />
        </div>
      );
    }

    if (meta.hasPendingRequest) {
      return (
        <div className="flex space-x-2">
          <AcceptButton onClick={handleAccept} />
          <RejectButton onClick={handleDecline} />
        </div>
      );
    }

    if (meta.isSentRequest) {
      return <CancelRequestButton onClick={handleCancelRequest} />;
    }

    return <AddFriendButton onClick={handleAddFriend} />;
  };

  // Get role badge
  const getRoleBadge = () => {
    if (meta.role === GROUP_ROLES.OWNER) {
      return (
        <span className="ml-2 rounded bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
          Owner
        </span>
      );
    }
    if (meta.role === GROUP_ROLES.ADMIN) {
      return (
        <span className="ml-2 rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
          Admin
        </span>
      );
    }
    if (meta.role === GROUP_ROLES.MODERATOR) {
      return (
        <span className="ml-2 rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
          Moderator
        </span>
      );
    }
    return null;
  };

  const institutionName = user.institution?.name || "No Institution";

  return (
    <div
      className={`flex items-center space-x-3 rounded-lg border p-2 shadow-sm ${
        meta.isSelf ? "border-blue-200 bg-blue-50" : "border-gray-300 bg-white"
      }`}
    >
      <NavLink to={`/profile/${user.userName}`}>
        <img
          src={user.avatar}
          alt={user.fullName}
          className="h-10 w-10 rounded-full object-cover transition-opacity hover:opacity-80"
        />
      </NavLink>
      <div className="flex-1">
        <h3 className="flex items-center">
          <NavLink
            to={`/profile/${user.userName}`}
            className="font-medium text-gray-800 transition-colors hover:text-blue-600 hover:underline"
          >
            {user.fullName}
          </NavLink>
          {getRoleBadge()}
        </h3>
        <p className="text-sm font-medium text-gray-500">{institutionName}</p>
      </div>
      <div className="flex items-center gap-2">
        {renderActions()}

        {/* 3-dot dropdown menu */}
        {canShowMenu && (
          <div className="relative" ref={menuRef}>
            <button
              ref={buttonRef}
              onClick={() => {
                if (!showMenu && buttonRef.current) {
                  const rect = buttonRef.current.getBoundingClientRect();
                  const spaceBelow = window.innerHeight - rect.bottom;
                  setOpenUpward(spaceBelow < 250); // 250px approximate menu height
                }
                setShowMenu(!showMenu);
              }}
              className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-200"
              title="More actions"
            >
              <BsThreeDots className="h-5 w-5" />
            </button>

            {showMenu && (
              <div
                className={`absolute right-0 z-50 w-56 rounded-lg border border-gray-200 bg-white shadow-lg ${
                  openUpward ? "bottom-full mb-1" : "top-full mt-1"
                }`}
              >
                <div className="py-1">
                  {/* Owner-only actions */}
                  {currentUserRole === GROUP_ROLES.OWNER && (
                    <>
                      {/* Transfer Ownership (only to Admin) */}
                      {meta.role === GROUP_ROLES.ADMIN && (
                        <button
                          onClick={handleTransferOwnership}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                        >
                          <FaCrown className="h-4 w-4 flex-shrink-0 text-yellow-500" />
                          <span className="font-medium">
                            Transfer Ownership
                          </span>
                        </button>
                      )}

                      {/* Admin actions */}
                      {meta.role === GROUP_ROLES.ADMIN && (
                        <button
                          onClick={handleDemoteToModerator}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                        >
                          <FaUserMinus className="h-4 w-4 flex-shrink-0" />
                          <span className="font-medium">
                            Demote to Moderator
                          </span>
                        </button>
                      )}

                      {/* Moderator actions */}
                      {meta.role === GROUP_ROLES.MODERATOR && (
                        <>
                          <button
                            onClick={handlePromoteToAdmin}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                          >
                            <FaUserShield className="h-4 w-4 flex-shrink-0 text-blue-500" />
                            <span className="font-medium">
                              Promote to Admin
                            </span>
                          </button>
                          <button
                            onClick={handleDemoteToMember}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                          >
                            <FaUserMinus className="h-4 w-4 flex-shrink-0" />
                            <span className="font-medium">
                              Demote to Member
                            </span>
                          </button>
                        </>
                      )}

                      {/* Member actions */}
                      {meta.role === GROUP_ROLES.MEMBER && (
                        <button
                          onClick={handlePromoteToModerator}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                        >
                          <FaUserPlus className="h-4 w-4 flex-shrink-0 text-green-500" />
                          <span className="font-medium">
                            Promote to Moderator
                          </span>
                        </button>
                      )}
                    </>
                  )}

                  {/* Ban action - available to Owner, Admin, Moderator for lower roles */}
                  <button
                    onClick={handleBan}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-gray-50"
                  >
                    <FaBan className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium">Ban from Group</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberCard;
