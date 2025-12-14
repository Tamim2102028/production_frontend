import React from "react";
import FriendCard from "../../shared/friends/FriendCard";
import { type UserData } from "../../../data/profile-data/userData";
import { showError } from "../../../utils/sweetAlert";
import { showMemberMenu } from "../../../utils/customModals";
import { useAppSelector } from "../../../store/hooks";
import type { RootState } from "../../../store/store";
import {
  getMembersForGroup,
  getGroupOwner,
  getGroupAdmins,
  isOwner as checkIsOwner,
  isAdmin as checkIsAdmin,
  getMemberCount,
} from "../../../data/group-data/groupMembers";

interface Props {
  groupId: string;
  users: UserData[];
  currentUserId?: string;
  currentUser?: { id: string } | null;
  // admin and member management callbacks (optional)
  onRemoveMember?: (id: string) => void;
  onMakeAdmin?: (id: string) => void;
  onRemoveAdmin?: (id: string) => void;
}

const GroupMembersTab: React.FC<Props> = ({
  groupId,
  users,
  currentUser,
  onRemoveMember,
  onMakeAdmin,
  onRemoveAdmin,
}) => {
  // Get all friendship data from Redux at component level
  const allFriendships = useAppSelector(
    (s: RootState) => s.friends.friendships
  );
  const allFriendRequests = useAppSelector(
    (s: RootState) => s.friends.friendRequests
  );

  // Use the new groupMembers data for membership information
  const members = getMembersForGroup(groupId);
  const owner = getGroupOwner(groupId);
  const admins = getGroupAdmins(groupId);
  const memberCount = getMemberCount(groupId);

  const handleMemberMenu = async (
    userId: string,
    userName?: string,
    isAdmin?: boolean
  ) => {
    const isOwner = !!currentUser && !!owner && currentUser.id === owner;

    // Only owner can manage admin status
    const showAdminBtn = isOwner;

    // Determine who can remove this member:
    // - Owner can remove anyone (except themselves, but that's already filtered)
    // - Regular admin can only remove non-admin members
    const isCurrentUserAdmin =
      !!currentUser &&
      (admins.includes(currentUser.id) || currentUser.id === owner);
    const canRemove = isOwner || (isCurrentUserAdmin && !isAdmin);

    await showMemberMenu(userName ?? "Member", {
      onRemove: canRemove
        ? () => {
            if (onRemoveMember) onRemoveMember(userId);
          }
        : undefined,
      onMakeAdmin:
        showAdminBtn && !isAdmin
          ? () => {
              if (!currentUser || currentUser.id !== owner) {
                showError({
                  title: "Not allowed",
                  text: "Only the group owner can change admin status.",
                });
                return;
              }
              if (onMakeAdmin) onMakeAdmin(userId);
            }
          : undefined,
      onRemoveAdmin:
        showAdminBtn && isAdmin
          ? () => {
              if (!currentUser || currentUser.id !== owner) {
                showError({
                  title: "Not allowed",
                  text: "Only the group owner can change admin status.",
                });
                return;
              }
              if (onRemoveAdmin) onRemoveAdmin(userId);
            }
          : undefined,
    });
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900">
        Members ({memberCount})
      </h2>
      <div className="mt-3 space-y-2.5">
        {members && members.length > 0
          ? members.map((memberId) => {
              const user = users.find((u) => u.id === memberId);
              if (!user) return null;

              // Check friendship status from Redux data
              const isFriend = currentUser
                ? allFriendships.some(
                    (f) =>
                      (f.user1Id === currentUser.id && f.user2Id === user.id) ||
                      (f.user1Id === user.id && f.user2Id === currentUser.id)
                  )
                : false;
              const hasPending = currentUser
                ? allFriendRequests.some(
                    (req) =>
                      req.status === "pending" &&
                      req.senderId === user.id &&
                      req.receiverId === currentUser.id
                  )
                : false;
              const hasSent = currentUser
                ? allFriendRequests.some(
                    (req) =>
                      req.status === "pending" &&
                      req.senderId === currentUser.id &&
                      req.receiverId === user.id
                  )
                : false;

              let type: Parameters<typeof FriendCard>[0]["type"] = "search";
              const isCurrent = currentUser && memberId === currentUser.id;
              if (isCurrent) type = "search";
              else if (isFriend) type = "friend";
              else if (hasPending) type = "request";
              else if (hasSent) type = "sent";
              else type = "suggestion";

              // Use helper functions to check roles
              const isAdmin = checkIsAdmin(user.id, groupId);
              const isOwner = checkIsOwner(user.id, groupId);

              const isCurrentUserOwner =
                !!currentUser && !!owner && currentUser.id === owner;
              const isCurrentUserAdmin =
                !!currentUser &&
                (admins.includes(currentUser.id) || currentUser.id === owner);

              // Show menu if:
              // - Current user is owner/admin AND
              // - Target user is not the owner (owner can't be removed) AND
              // - Target user is not the current user themselves (can't manage yourself)
              const canShowMenu =
                (isCurrentUserOwner || isCurrentUserAdmin) &&
                user.id !== owner &&
                user.id !== currentUser?.id;

              return (
                <FriendCard
                  key={user.id}
                  isOwner={isOwner}
                  isAdmin={isAdmin}
                  friend={user}
                  type={type}
                  canShowMenu={canShowMenu}
                  handleMemberMenu={handleMemberMenu}
                />
              );
            })
          : null}
      </div>
    </div>
  );
};

export default GroupMembersTab;
