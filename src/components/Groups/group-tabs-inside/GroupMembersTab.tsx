import React from "react";
import { useGroupMembers } from "../../../hooks/useGroup";
import FriendCard from "../../shared/friends/FriendCard";
import FriendCardSkeleton from "../../shared/skeletons/FriendCardSkeleton";
import { showActionMenu } from "../../../utils/customModals";
import { toast } from "sonner";
import { PROFILE_RELATION_STATUS } from "../../../constants";
import type { FriendUser } from "../../../types";

interface GroupMembersTabProps {
  groupId: string;
  isOwner?: boolean;
  isAdmin?: boolean;
}

const GroupMembersTab: React.FC<GroupMembersTabProps> = ({
  groupId,
  isOwner: isCurrentUserOwner,
  isAdmin: isCurrentUserAdmin,
}) => {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGroupMembers(groupId);

  const members = data?.pages.flatMap((page) => page.data.members) || [];

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <FriendCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load members.
      </div>
    );
  }

  const handleMemberMenu = (
    userId: string,
    userName?: string,
    isTargetAdmin?: boolean
  ) => {
    // Determine what actions are available based on current user role and target user role
    const actions = [];

    // Owner can do everything
    if (isCurrentUserOwner) {
      if (isTargetAdmin) {
        actions.push({
          label: "Dismiss as Admin",
          onClick: () => console.log("Dismiss Admin", userId),
        });
      } else {
        actions.push({
          label: "Make Admin",
          onClick: () => console.log("Make Admin", userId),
        });
      }
      actions.push({
        label: "Remove from Group",
        onClick: () => console.log("Remove Member", userId),
        variant: "danger" as const,
      });
    }
    // Admin can remove members (but not other admins or owner)
    else if (isCurrentUserAdmin && !isTargetAdmin) {
      actions.push({
        label: "Remove from Group",
        onClick: () => console.log("Remove Member", userId),
        variant: "danger" as const,
      });
    }

    if (actions.length > 0) {
      showActionMenu(`Manage ${userName}`, actions);
    } else {
      toast.info("No actions available for this member");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">
        Members ({members.length})
      </h2>

      {members.length > 0 ? (
        <div className="space-y-3">
          {members.map((item) => {
            const { member, meta } = item;

            // Map GroupMember to FriendUser
            const friendUser: FriendUser = {
              _id: member.user._id,
              userName: member.user.username,
              fullName: member.user.name,
              avatar: member.user.avatar || "",
              institution: null,
              department: null,
              userType: "Student",
              friendshipStatus: meta.isFriend
                ? PROFILE_RELATION_STATUS.FRIEND
                : meta.isSentRequest
                  ? PROFILE_RELATION_STATUS.REQUEST_SENT
                  : meta.hasPendingRequest
                    ? PROFILE_RELATION_STATUS.REQUEST_RECEIVED
                    : PROFILE_RELATION_STATUS.NOT_FRIENDS,
            };

            // Determine card type for buttons
            let type: "friend" | "request" | "suggestion" | "sent" =
              "suggestion";
            if (meta.isFriend) type = "friend";
            else if (meta.hasPendingRequest) type = "request";
            else if (meta.isSentRequest) type = "sent";

            // Determine target member roles
            const isTargetOwner =
              member.role === "owner" || member.role === "creator";
            const isTargetAdmin = member.role === "admin";

            return (
              <FriendCard
                key={member._id}
                friend={friendUser}
                type={type}
                isOwner={isTargetOwner}
                isAdmin={isTargetAdmin}
                canShowMenu={isCurrentUserOwner || isCurrentUserAdmin}
                handleMemberMenu={handleMemberMenu}
              />
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center text-gray-500">
          No members found in this group.
        </div>
      )}

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="w-full rounded-lg bg-gray-100 py-3 font-medium text-gray-600 transition-colors hover:bg-gray-200 disabled:opacity-50"
        >
          {isFetchingNextPage ? "Loading more members..." : "Load More Members"}
        </button>
      )}
    </div>
  );
};

export default GroupMembersTab;
