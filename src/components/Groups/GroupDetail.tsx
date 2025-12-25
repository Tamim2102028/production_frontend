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
} from "react-icons/fa";
import GroupPostList from "./GroupPostList";
import { BsPostcard } from "react-icons/bs";
import { confirm, showSuccess } from "../../utils/sweetAlert";
import GroupMembersTab from "./group-tabs/GroupMembersTab";

// TODO: Replace with API data
interface Group {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  profileImage?: string;
  privacy?: string;
  memberCount?: number;
}

const GroupDetail: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();

  // TODO: Replace with API call to get group data
  const group: Group | undefined = groupId
    ? {
        id: groupId,
        name: "Sample Group",
        description: "Sample group description",
        coverImage: undefined,
        profileImage: undefined,
        privacy: "public",
        memberCount: 0,
      }
    : undefined;

  // TODO: Replace with API data
  const isRequested = false;
  const isMember = false;
  const memberCount = group?.memberCount || 0;
  const groupOwner = undefined;
  const groupAdmins: string[] = [];

  const [activeTab, setActiveTab] = useState<
    "posts" | "pinned" | "members" | "media" | "about"
  >("posts");
  const [showMenu, setShowMenu] = useState(false);

  const handleJoin = () => {
    if (!groupId) return;
    // TODO: Replace with API call
    console.log("Join group:", groupId);
  };

  const handleCancel = () => {
    if (!groupId) return;
    // TODO: Replace with API call
    console.log("Cancel join request:", groupId);
  };

  // TODO: Replace with actual current user data
  const currentUser = { id: "current-user-id", name: "Current User" };

  // Group member management handlers - TODO: Replace with API calls
  const handleMakeAdmin = (userId: string) => {
    if (!groupId) return;
    console.log("Make admin:", userId);
  };

  const handleRemoveAdmin = (userId: string) => {
    if (!groupId) return;
    console.log("Remove admin:", userId);
  };

  const handleRemoveMember = async (userId: string) => {
    if (!groupId) return;

    if (
      await confirm({
        title: "Are you sure?",
        text: "This member will be removed from the group.",
        confirmButtonText: "Yes, remove member!",
      })
    ) {
      // TODO: Replace with API call
      console.log("Remove member:", userId);
      showSuccess({
        title: "Removed!",
        text: "Member has been removed from the group.",
      });
    }
  };

  // cancel handler removed (not used in this layout)

  // If the group wasn't found, show a small placeholder and back button.
  if (!group) {
    return (
      <div className="space-y-4 rounded-lg bg-white p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            aria-label="Back"
            title="Back"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg text-gray-700 shadow-md transition-colors hover:bg-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <FaArrowLeft />
          </button>
          <h2 className="text-lg font-medium text-gray-900">Group not found</h2>
        </div>
        <p className="text-sm text-gray-600">
          The group you requested does not exist.
        </p>
      </div>
    );
  }

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
                  {group.profileImage ? (
                    <img
                      src={group.profileImage}
                      alt={group.name}
                      className="h-32 w-32 rounded-2xl object-cover shadow-xl"
                    />
                  ) : (
                    <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-4xl font-bold text-white shadow-xl">
                      {group.name
                        ? group.name
                            .split(" ")
                            .slice(0, 2)
                            .map((n) => n[0])
                            .join("")
                        : "G"}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">
                        {group.name}
                      </h1>
                      <p className="mt-1 text-gray-600">
                        Public Group · {memberCount} members
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
                            {isMember && (
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
                                    dispatch(leaveGroup(group.id));
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
                      (group.privacy === "closed" ? (
                        <div className="rounded-lg bg-gray-100 px-6 py-2.5 font-semibold text-gray-700">
                          Closed
                        </div>
                      ) : (
                        <button
                          onClick={async () => {
                            if (
                              await confirm({
                                title: "Are you sure?",
                                text: "You will leave this group and will need to join again.",
                                confirmButtonText: "Yes, leave group!",
                              })
                            ) {
                              dispatch(leaveGroup(group.id));
                            }
                          }}
                          className="rounded-lg bg-gray-200 px-6 py-2.5 font-semibold text-gray-700 transition hover:bg-gray-300"
                        >
                          Joined
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

                {/* Use existing GroupPostList for posts */}
                <GroupPostList groupId={group.id} mode={"posts"} />
              </div>
            )}

            {activeTab === "pinned" && (
              <GroupPostList groupId={group.id} mode={"pinned"} />
            )}

            {activeTab === "members" && (
              <GroupMembersTab
                groupId={group.id}
                users={usersData}
                currentUserId={currentUser?.id}
                currentUser={currentUser}
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
                <div>
                  <h3 className="mb-3 font-bold text-gray-900">Creator</h3>
                  {(() => {
                    const owner = usersData.find((u) => u.id === groupOwner);
                    if (!owner)
                      return (
                        <p className="text-sm text-gray-500">Owner not found</p>
                      );

                    return (
                      <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                        <img
                          src={owner.avatar}
                          alt={owner.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {owner.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {/* username hidden */}
                          </p>
                        </div>
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                          Owner
                        </span>
                      </div>
                    );
                  })()}
                </div>

                {/* Admins Section */}
                {groupAdmins && groupAdmins.length > 0 && (
                  <div>
                    <h3 className="mb-3 font-bold text-gray-900">
                      Admins ({groupAdmins.length})
                    </h3>
                    <div className="space-y-2">
                      {groupAdmins.map((adminId) => {
                        const admin = usersData.find((u) => u.id === adminId);
                        if (!admin) return null;

                        const isOwner = adminId === groupOwner;

                        return (
                          <div
                            key={adminId}
                            onClick={() => navigate(`/profile/${adminId}`)}
                            className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                          >
                            <img
                              src={admin.avatar}
                              alt={admin.name}
                              className="h-12 w-12 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">
                                {admin.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {/* username hidden */}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {isOwner && (
                                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                                  Owner
                                </span>
                              )}
                              <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                                Admin
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Group Stats */}
                <div>
                  <h3 className="mb-3 font-bold text-gray-900">Group Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <p className="text-2xl font-bold text-gray-900">
                        {memberCount}
                      </p>
                      <p className="text-sm text-gray-600">Members</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <p className="text-2xl font-bold text-gray-900">
                        {group.postCount || 0}
                      </p>
                      <p className="text-sm text-gray-600">Posts</p>
                    </div>
                  </div>
                </div>

                {/* Created Date */}
                <div>
                  <h3 className="mb-2 font-bold text-gray-900">Created</h3>
                  <p className="text-gray-700">
                    {new Date(group.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
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
