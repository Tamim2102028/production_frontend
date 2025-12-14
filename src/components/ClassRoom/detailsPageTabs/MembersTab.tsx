import React from "react";
import FriendCard from "../../shared/friends/FriendCard";
import { type UserData } from "../../../data/profile-data/userData";
import { showError } from "../../../utils/sweetAlert";
import { showMemberMenu } from "../../../utils/customModals";
import { useAppSelector } from "../../../store/hooks";
import type { RootState } from "../../../store/store";
import { getCurrentUserId, getUserById } from "../../../services/userService";

interface Props {
  roomId: string; // Changed: Now we take roomId instead of members array
  users: UserData[];
  // admin and member management callbacks (optional)
  onRemoveMember?: (id: string) => void;
  onMakeAdmin?: (id: string) => void;
  onRemoveAdmin?: (id: string) => void;
  // No longer need creatorId and admins props - will get from Redux
}

const MembersTab: React.FC<Props> = ({
  roomId,
  users,
  onRemoveMember,
  onMakeAdmin,
  onRemoveAdmin,
}) => {
  const currentUserId = getCurrentUserId();
  const currentUser = getUserById(currentUserId);

  // Get all friendship data from Redux at component level
  const allFriendships = useAppSelector(
    (s: RootState) => s.friends.friendships
  );
  const allFriendRequests = useAppSelector(
    (s: RootState) => s.friends.friendRequests
  );

  // Get room members from Redux
  const roomMembers = useAppSelector((s: RootState) =>
    s.classRoom.members.filter((m) => m.roomId === roomId)
  );

  // Extract creator and admins from room members
  const creator = roomMembers.find((m) => m.role === "creator");
  const creatorId = creator?.userId;
  const admins = roomMembers
    .filter((m) => m.role === "admin" || m.role === "creator")
    .map((m) => m.userId);

  const handleMemberMenu = async (
    userId: string,
    userName?: string,
    isAdmin?: boolean
  ) => {
    const isCreator =
      !!currentUser && !!creatorId && currentUser.id === creatorId;

    // Only creator can manage admin status
    const showAdminBtn = isCreator;

    // Determine who can remove this member:
    // - Creator can remove anyone (except themselves, but that's already filtered)
    // - Regular admin can only remove non-admin members
    const isCurrentUserAdmin =
      !!currentUser && !!admins && admins.includes(currentUser.id);
    const canRemove = isCreator || (isCurrentUserAdmin && !isAdmin);

    await showMemberMenu(userName ?? "Member", {
      onRemove: canRemove
        ? () => {
            if (onRemoveMember) onRemoveMember(userId);
          }
        : undefined,
      onMakeAdmin:
        showAdminBtn && !isAdmin
          ? () => {
              if (!currentUser || currentUser.id !== creatorId) {
                showError({
                  title: "Not allowed",
                  text: "Only the room creator can change admin status.",
                });
                return;
              }
              if (onMakeAdmin) onMakeAdmin(userId);
            }
          : undefined,
      onRemoveAdmin:
        showAdminBtn && isAdmin
          ? () => {
              if (!currentUser || currentUser.id !== creatorId) {
                showError({
                  title: "Not allowed",
                  text: "Only the room creator can change admin status.",
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
        Members ({roomMembers?.length || 0})
      </h2>
      <div className="mt-3 space-y-2.5">
        {roomMembers && roomMembers.length > 0
          ? roomMembers.map((membership) => {
              const user = users.find((u) => u.id === membership.userId);
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
              const isCurrent =
                currentUser && membership.userId === currentUser.id;
              if (isCurrent) type = "search";
              else if (isFriend) type = "friend";
              else if (hasPending) type = "request";
              else if (hasSent) type = "sent";
              else type = "suggestion";

              const isAdmin = !!admins && admins.includes(user.id);
              const isOwner = !!creatorId && user.id === creatorId;

              const isCurrentUserCreator =
                !!currentUser && !!creatorId && currentUser.id === creatorId;
              const isCurrentUserAdmin =
                !!currentUser && !!admins && admins.includes(currentUser.id);

              // Show menu if:
              // - Current user is creator/admin AND
              // - Target user is not the creator (creator can't be removed) AND
              // - Target user is not the current user themselves (can't manage yourself)
              const canShowMenu =
                (isCurrentUserCreator || isCurrentUserAdmin) &&
                user.id !== creatorId &&
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

export default MembersTab;
