import React from "react";
import GroupPostCard from "./../GroupPostCard";
import { useGroupPinnedPosts } from "../../../hooks/useGroup";
import PostSkeleton from "../../shared/skeletons/PostSkeleton";

interface GroupPinnedPostsProps {
  groupId: string;
}

const GroupPinnedPosts: React.FC<GroupPinnedPostsProps> = ({ groupId }) => {
  const { data: pinnedData, isLoading } = useGroupPinnedPosts(groupId);
  const posts = pinnedData?.data.posts || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <PostSkeleton />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow">
        <p className="text-gray-500">No pinned posts to show.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((item) => (
        <GroupPostCard key={item.post._id} post={item.post} meta={item.meta} />
      ))}
    </div>
  );
};

export default GroupPinnedPosts;
