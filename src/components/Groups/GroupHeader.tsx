import React, { useState } from "react";
import {
  FaEllipsisH,
  FaCog,
  FaLink,
  FaUserSlash,
  FaCheck,
  FaBell,
  FaShareAlt,
  FaTrash,
} from "react-icons/fa";
import { toast } from "sonner";
import { confirm } from "../../utils/sweetAlert";
import type { Group, GroupMeta } from "../../types";
import { GROUP_MEMBERSHIP_STATUS, GROUP_PRIVACY } from "../../constants";
import {
  useCancelJoinRequest,
  useJoinGroup,
  useLeaveGroup,
  useDeleteGroup,
} from "../../hooks/useGroup";

interface GroupHeaderProps {
  group: Group;
  meta: GroupMeta;
}

const GroupHeader: React.FC<GroupHeaderProps> = ({ group, meta }) => {
  const [showMenu, setShowMenu] = useState(false);

  const { mutate: joinGroup, isPending: isJoining } = useJoinGroup();
  const { mutate: leaveGroup, isPending: isLeaving } = useLeaveGroup();
  const { mutate: deleteGroup, isPending: isDeleting } = useDeleteGroup();
  const { mutate: cancelJoinRequest, isPending: isCancelling } =
    useCancelJoinRequest();

  const handleJoin = () => {
    joinGroup(group._id);
  };

  const handleLeave = async () => {
    setShowMenu(false);
    if (
      await confirm({
        title: "Leave Group?",
        text: "Are you sure you want to leave this group?",
        confirmButtonText: "Yes, leave",
      })
    ) {
      if (group?._id) {
        leaveGroup(group._id);
      }
    }
  };

  const handleDelete = async () => {
    setShowMenu(false);
    if (
      await confirm({
        title: "Delete Group?",
        text: "Are you sure you want to delete this group? This action cannot be undone.",
        confirmButtonText: "Yes, delete",
        confirmButtonColor: "#d33",
        isDanger: true,
      })
    ) {
      if (group?._id) {
        deleteGroup(group._id);
      }
    }
  };

  const handleCancelJoin = () => {
    cancelJoinRequest(group._id);
  };

  const handleCopyLink = async () => {
    const slugOrId = group.slug || group._id;
    const url = `${window.location.origin}/groups/${slugOrId}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Group link copied to clipboard");
    } catch (error) {
      toast.error(`Failed to copy link: ${error}`);
    }
    setShowMenu(false);
  };

  const { isAdmin, isOwner, status } = meta;

  return (
    <div className="relative">
      {group.coverImage ? (
        <img
          src={group.coverImage}
          alt={group.name}
          className="h-64 w-full object-cover"
        />
      ) : (
        <div className="h-64 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
      )}

      <div className="mx-auto max-w-5xl px-4">
        <div className="relative -mt-20">
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <div className="flex flex-col items-start gap-6 md:flex-row">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <img
                  src={group.avatar}
                  alt={group.name}
                  className="h-32 w-32 rounded-2xl object-cover shadow-xl"
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {group.name}
                    </h1>
                    <p className="mt-1 text-gray-600">
                      {group.privacy === GROUP_PRIVACY.PUBLIC
                        ? "Public Group"
                        : group.privacy === GROUP_PRIVACY.CLOSED
                          ? "Closed Group"
                          : "Private Group"}
                      {" - "}
                      {!group.membersCount || group.membersCount === 1
                        ? "Member"
                        : "Members"}{" "}
                      ({group.membersCount?.toLocaleString() || 0}){" - "}
                      {!group.postsCount || group.postsCount === 1
                        ? "Post"
                        : "Posts"}{" "}
                      ({group.postsCount?.toLocaleString() || 0})
                    </p>
                  </div>

                  {/* 3-dot menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShowMenu(!showMenu)}
                      className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-200"
                      title="More actions"
                    >
                      <FaEllipsisH className="h-4 w-4" />
                    </button>

                    {showMenu && (
                      <div className="absolute top-full right-0 z-50 mt-1 w-56 rounded-lg border border-gray-200 bg-white shadow-lg">
                        <div className="py-1">
                          {isAdmin && isOwner && (
                            <button className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50">
                              <FaCog className="h-4 w-4 flex-shrink-0" />
                              <span className="font-medium">
                                Group Settings
                              </span>
                            </button>
                          )}
                          <button
                            onClick={handleCopyLink}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                          >
                            <FaLink className="h-4 w-4 flex-shrink-0" />
                            <span className="font-medium">Copy Group Link</span>
                          </button>

                          {status === GROUP_MEMBERSHIP_STATUS.JOINED &&
                            !isOwner && (
                              <button
                                onClick={handleLeave}
                                disabled={isLeaving}
                                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <FaUserSlash className="h-4 w-4 flex-shrink-0" />
                                <span className="font-medium">
                                  {isLeaving ? "Leaving..." : "Leave Group"}
                                </span>
                              </button>
                            )}

                          {isOwner && (
                            <button
                              onClick={handleDelete}
                              disabled={isDeleting}
                              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <FaTrash className="h-4 w-4 flex-shrink-0" />
                              <span className="font-medium">
                                {isDeleting ? "Deleting..." : "Delete Group"}
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <p className="mt-4 text-gray-700">{group.description}</p>

                {/* Action Buttons */}
                <div className="mt-6 flex flex-wrap gap-3">
                  {!status && (
                    <button
                      onClick={handleJoin}
                      disabled={isJoining}
                      className="rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isJoining ? "Joining..." : "Join Group"}
                    </button>
                  )}

                  {status === GROUP_MEMBERSHIP_STATUS.PENDING && (
                    <button
                      onClick={handleCancelJoin}
                      disabled={isCancelling}
                      className="rounded-lg bg-red-600 px-6 py-2.5 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isCancelling ? "Cancelling..." : "Cancel Request"}
                    </button>
                  )}

                  {status === GROUP_MEMBERSHIP_STATUS.JOINED && (
                    <div className="flex items-center gap-2 rounded-lg bg-gray-200 px-6 py-2.5 font-semibold text-gray-700">
                      <FaCheck /> Joined
                    </div>
                  )}

                  <button className="flex cursor-pointer items-center gap-2 rounded-lg bg-blue-200 px-6 py-2.5 font-semibold text-gray-700 hover:bg-blue-300">
                    <FaBell className="h-4 w-4" />
                    Notifications
                  </button>

                  <button className="flex cursor-pointer items-center gap-2 rounded-lg bg-blue-200 px-6 py-2.5 font-semibold text-gray-700 hover:bg-blue-300">
                    <FaShareAlt className="h-4 w-4" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupHeader;
