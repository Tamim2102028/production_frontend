import React from "react";
import ProfilePostCard from "./ProfilePostCard";
import { useProfilePosts } from "../../hooks/usePost";
import PostSkeleton from "../shared/skeletons/PostSkeleton";
import type { ProfilePostsProps } from "../../types/post.types";
import type { AxiosError } from "axios";
import type { ApiError } from "../../types/user.types";

const ProfilePosts: React.FC<ProfilePostsProps> = ({
  username,
  isOwnProfile,
}) => {
  const { data: postsData, isLoading, error } = useProfilePosts(username);

  const posts = postsData?.posts || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    const axiosError = error as AxiosError<ApiError>;
    const errorMessage =
      axiosError.response?.data?.message ||
      error.message ||
      "Could not load posts";

    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-12 text-center shadow">
        <p className="font-medium text-red-600">{errorMessage}</p>
      </div>
    );
  }

  return (
    <>
      {/* Posts List */}
      {posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <ProfilePostCard
              key={post._id}
              post={post}
              isOwnProfile={isOwnProfile}
            />
          ))}
          {/* TODO: Implement 'Load More' button for pagination */}
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow">
          <p className="text-gray-500">
            {isOwnProfile
              ? "You haven't posted anything yet."
              : "No posts to show."}
          </p>
        </div>
      )}
    </>
  );
};

export default ProfilePosts;
