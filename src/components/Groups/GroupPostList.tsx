import React, { useMemo } from "react";
import GroupPostCardSimple from "./GroupPostCard";

// TODO: Replace with API data
interface GroupPost {
  postId: string;
  content: string;
  createdBy: string;
  createdAt: string;
  isPinned?: boolean;
  [key: string]: unknown;
}

type Mode = "posts" | "pinned";

type Props = {
  groupId: string;
  mode?: Mode;
  posts?: GroupPost[];
};

const GroupPostList: React.FC<Props> = ({
  groupId,
  mode = "posts",
  posts = [],
}) => {
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
