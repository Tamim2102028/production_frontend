import React, { useMemo } from "react";
import type { GroupPost } from "../../data/group-data/groupPostsData";
import { useAppSelector } from "../../store/hooks";
import { selectGroupPosts } from "../../store/slices/groupSlice";
import GroupPostCardSimple from "./GroupPostCard";

type Mode = "posts" | "pinned";

type Props = {
  groupId: string;
  mode?: Mode;
};

const GroupPostList: React.FC<Props> = ({ groupId, mode = "posts" }) => {
  const posts: GroupPost[] = useAppSelector((s) => selectGroupPosts(s, groupId));
  const pinned: GroupPost[] = useMemo(
    () => posts.filter((p) => p.isPinned),
    [posts]
  );

  if (mode === "pinned") {
    if (!pinned || pinned.length === 0) {
      return (
        <div className="rounded-md border border-gray-200 bg-white p-6 text-center shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">No posts yet</h3>
          <p className="mt-2 text-gray-600">
            There are no pinned posts in this group.
          </p>
        </div>
      );
    }
    return (
      <div className="space-y-3">
        {pinned.map((p) => (
          <GroupPostCardSimple key={p.postId} post={p} />
        ))}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="rounded-md border border-gray-200 bg-white p-6 text-center shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">No posts yet</h3>
        <p className="mt-2 text-gray-600">There are no posts in this group.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {posts.map((p) => (
        <GroupPostCardSimple key={p.postId} post={p} />
      ))}
    </div>
  );
};

export default GroupPostList;
