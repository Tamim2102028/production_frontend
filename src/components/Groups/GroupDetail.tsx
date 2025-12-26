import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaUsers,
  FaBell,
  FaShareAlt,
  FaEllipsisH,
  FaImage,
  FaInfoCircle,
  FaThumbtack,
  FaUserSlash,
  FaFlag,
  FaCog,
  FaLink,
  FaCheck,
} from "react-icons/fa";
import GroupPostList from "./GroupPostList";
import { BsPostcard } from "react-icons/bs";
import { confirm, showSuccess } from "../../utils/sweetAlert";
import GroupMembersTab from "./group-tabs/GroupMembersTab";
import { useGroupDetails } from "../../hooks/useGroup";
import GroupAccessDenied from "./utils/GroupAccessDenied";
import { GROUP_PRIVACY, GROUP_MEMBERSHIP_STATUS } from "../../constants/group";
import { useUser } from "../../hooks/useAuth";

const GroupDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useUser();

  const { data: groupData, isLoading, error } = useGroupDetails(slug!);
  const group = groupData?.data?.group;
  // TODO: Add membership status to groupData response or fetch separately
  // For now assuming we have a way to know if user is member
  // const isMember = group?.membershipStatus === GROUP_MEMBERSHIP_STATUS.JOINED;
  // const isPrivateOrClosed = group?.privacy === GROUP_PRIVACY.PRIVATE || group?.privacy === GROUP_PRIVACY.CLOSED;

  const [activeTab, setActiveTab] = useState<
    "posts" | "pinned" | "members" | "media" | "about"
  >("posts");
  const [showMenu, setShowMenu] = useState(false);

  // TODO: Implement Join/Leave logic with API
  const handleJoin = () => {
    console.log("Join group:", group?._id);
  };

  const handleCancel = () => {
    console.log("Cancel join request:", group?._id);
  };

  const handleMakeAdmin = (userId: string) => {
    console.log("Make admin:", userId);
  };

  const handleRemoveAdmin = (userId: string) => {
    console.log("Remove admin:", userId);
  };

  const handleRemoveMember = async (userId: string) => {
    if (
      await confirm({
        title: "Are you sure?",
        text: "This member will be removed from the group.",
        confirmButtonText: "Yes, remove member!",
      })
    ) {
      console.log("Remove member:", userId);
      showSuccess({
        title: "Removed!",
        text: "Member has been removed from the group.",
      });
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  // Error State or Not Found
  if (error || !group) {
    return (
      <div className="space-y-4 rounded-lg bg-white p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg text-gray-700 shadow-md transition-colors hover:bg-gray-300"
          >
            <FaArrowLeft />
          </button>
          <h2 className="text-lg font-medium text-gray-900">Group not found</h2>
        </div>
        <p className="text-sm text-gray-600">
          The group you requested does not exist or you don't have permission to
          view it.
        </p>
      </div>
    );
  }

  // Access Control Check
  // Logic: If group is (Private OR Closed) AND User is NOT a member/owner/admin
  // Then show Access Denied screen

  // Assuming 'status' field in group object tells us if user is joined
  // If status is undefined or NOT_JOINED or PENDING or INVITED, they are not a full member
  const isMember =
    group.status === GROUP_MEMBERSHIP_STATUS.JOINED ||
    group.status === GROUP_MEMBERSHIP_STATUS.BANNED ||
    currentUser?._id === group.owner ||
    currentUser?._id === group.creator;

  const isRestricted =
    (group.privacy === GROUP_PRIVACY.PRIVATE ||
      group.privacy === GROUP_PRIVACY.CLOSED) &&
    !isMember;

  if (isRestricted) {
    return (
      <GroupAccessDenied groupName={group.name} privacyType={group.privacy} />
    );
  }

  // Derived Access Rights
  const isRequested = group.status === GROUP_MEMBERSHIP_STATUS.PENDING;
  const isOwner =
    group.creator === currentUser?._id || group.owner === currentUser?._id;
  const isAdmin = group.isAdmin || isOwner;

  return (
    <div className="space-y-5 overflow-hidden">
      {/* Cover */}
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
                        {group.privacy === "PUBLIC"
                          ? "Public Group"
                          : "Private Group"}{" "}
                        · {group.membersCount || 0} members
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
                            {isAdmin && (
                              <button className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50">
                                <FaCog className="h-4 w-4 flex-shrink-0" />
                                <span className="font-medium">
                                  Group Settings
                                </span>
                              </button>
                            )}
                            <button className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50">
                              <FaLink className="h-4 w-4 flex-shrink-0" />
                              <span className="font-medium">
                                Copy Group Link
                              </span>
                            </button>
                            {isMember && (
                              <button
                                onClick={async () => {
                                  setShowMenu(false);
                                  if (
                                    await confirm({
                                      title: "Leave Group?",
                                      text: "Are you sure you want to leave this group?",
                                      confirmButtonText: "Yes, leave",
                                    })
                                  ) {
                                    // dispatch(leaveGroup(group.id));
                                  }
                                }}
                                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-gray-50"
                              >
                                <FaUserSlash className="h-4 w-4 flex-shrink-0" />
                                <span className="font-medium">Leave Group</span>
                              </button>
                            )}
                            {!isMember && (
                              <button className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-gray-50">
                                <FaFlag className="h-4 w-4 flex-shrink-0" />
                                <span className="font-medium">
                                  Report Group
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
                    {!isMember &&
                      !isRequested &&
                      group.privacy !== "closed" && (
                        <button
                          onClick={handleJoin}
                          className="rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white transition hover:bg-blue-700"
                        >
                          Join Group
                        </button>
                      )}

                    {isRequested && !isMember && (
                      <button
                        onClick={handleCancel}
                        className="rounded-lg bg-red-600 px-6 py-2.5 font-semibold text-white transition hover:bg-red-700"
                      >
                        Cancel Request
                      </button>
                    )}

                    {isMember &&
                      (group.privacy === "CLOSED" ? (
                        <div className="rounded-lg bg-gray-100 px-6 py-2.5 font-semibold text-gray-700">
                          Closed
                        </div>
                      ) : (
                        <button className="flex items-center gap-2 rounded-lg bg-gray-200 px-6 py-2.5 font-semibold text-gray-700 transition hover:bg-gray-300">
                          <FaCheck /> Joined
                        </button>
                      ))}

                    <button className="flex items-center gap-2 rounded-lg bg-gray-200 px-6 py-2.5 font-semibold text-gray-700 hover:bg-gray-300">
                      <FaBell className="h-4 w-4" />
                      Notifications
                    </button>

                    <button className="flex items-center gap-2 rounded-lg bg-gray-200 px-6 py-2.5 font-semibold text-gray-700 hover:bg-gray-300">
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

      {/* Tabs and content */}
      <div className="mx-auto max-w-5xl">
        <div className="rounded-xl bg-white shadow">
          {/* Tabs  */}
          <div className="border-b border-gray-200 bg-white">
            <div className="flex justify-between gap-1 px-3">
              {(
                [
                  { id: "posts", label: "Posts", icon: BsPostcard },
                  { id: "pinned", label: "Pinned Posts", icon: FaThumbtack },
                  { id: "members", label: "Members", icon: FaUsers },
                  { id: "media", label: "Media", icon: FaImage },
                  { id: "about", label: "About", icon: FaInfoCircle },
                ] as Array<{
                  id: "posts" | "pinned" | "members" | "media" | "about";
                  label: string;
                  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
                }>
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 border-b-2 px-6 py-4 font-semibold transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="p-5">
            {activeTab === "posts" && (
              <div className="space-y-4">
                {isMember && (
                  <div className="mb-6 rounded-xl bg-gray-50 p-4">
                    <input
                      type="text"
                      placeholder="Share something with the group..."
                      className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                )}

                <GroupPostList groupId={group._id} mode={"posts"} />
              </div>
            )}

            {activeTab === "pinned" && (
              <GroupPostList groupId={group._id} mode={"pinned"} />
            )}

            {activeTab === "members" && (
              <GroupMembersTab
                groupId={group._id}
                users={[]} // TODO: Pass real members
                currentUserId={currentUser?._id}
                onMakeAdmin={handleMakeAdmin}
                onRemoveAdmin={handleRemoveAdmin}
                onRemoveMember={handleRemoveMember}
              />
            )}

            {activeTab === "media" && (
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-xl bg-gradient-to-br from-purple-400 to-pink-400"
                  />
                ))}
              </div>
            )}

            {activeTab === "about" && (
              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 font-bold text-gray-900">Description</h3>
                  <p className="text-gray-700">{group.description}</p>
                </div>

                <div>
                  <h3 className="mb-2 font-bold text-gray-900">Privacy</h3>
                  <p className="text-gray-700">
                    {group.privacy === "public"
                      ? "Public - Anyone can see posts and members"
                      : group.privacy === "private"
                        ? "Private - Only members can see posts"
                        : "Closed - Invitation only"}
                  </p>
                </div>

                {/* Creator/Owner Section */}
                {/* TODO: Fetch Owner Details */}

                {/* Group Stats */}
                <div>
                  <h3 className="mb-3 font-bold text-gray-900">Group Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <p className="text-2xl font-bold text-gray-900">
                        {group.membersCount || 0}
                      </p>
                      <p className="text-sm text-gray-600">Members</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <p className="text-2xl font-bold text-gray-900">
                        {group.postsCount || 0}
                      </p>
                      <p className="text-sm text-gray-600">Posts</p>
                    </div>
                  </div>
                </div>

                {/* Created Date */}
                <div>
                  <h3 className="mb-2 font-bold text-gray-900">Created</h3>
                  <p className="text-gray-700">
                    {new Date(group.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetail;
