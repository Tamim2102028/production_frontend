import React from "react";
import ProfilePostCard from "./ProfilePostCard";
import { DEFAULT_AVATAR_MD } from "../../constants/images";
import { useProfilePosts } from "../../hooks/usePost";

interface ProfilePostsProps {
  username: string;
  isOwnProfile: boolean;
}

const ProfilePosts: React.FC<ProfilePostsProps> = ({
  username,
  isOwnProfile,
}) => {
  // Fetch posts inside this component
  const { data: postsData, isLoading } = useProfilePosts(username);
  const posts = postsData?.posts || [];

  // Show loading state
  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow">
        <p className="text-gray-500">Loading posts...</p>
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
              post={{
                id: post._id,
                content: post.content,
                author: {
                  id: post.author._id,
                  name: post.author.fullName,
                  username: post.author.userName,
                  avatar: post.author.avatar || DEFAULT_AVATAR_MD,
                },
                timestamp: post.createdAt,
                likes: post.likesCount,
                comments: post.commentsCount,
                shares: 0, // Backend doesn't send shares yet
                isLiked: post.isLiked || false,
                images: post.images || post.attachments || [],
                tags: [], // Backend doesn't send tags yet
              }}
              isOwnProfile={isOwnProfile}
            />
          ))}
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
