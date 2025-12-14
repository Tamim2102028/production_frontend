import React from "react";
import ProfilePostCard from "./ProfilePostCard";
import { DEFAULT_AVATAR_MD } from "../../constants/images";

// TODO: Replace with API types
type PostData = {
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  likedBy: string[];
  comments: number;
  sharesBy: string[];
  images?: string[];
  tags?: string[];
};

interface ProfilePostsProps {
  posts: PostData[];
  isOwnProfile: boolean;
  userData?: {
    name: string;
    username: string;
    avatar: string;
  }; // User data for author info
}

const ProfilePosts: React.FC<ProfilePostsProps> = ({
  posts,
  isOwnProfile,
  userData,
}) => {
  return (
    <>
      {/* Posts Header */}
      <div className="mb-5 flex items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          {isOwnProfile ? "Your Posts" : "Posts"}
        </h2>
      </div>

      {/* Posts List */}
      {posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <ProfilePostCard
              key={post.postId}
              post={{
                id: post.postId,
                content: post.content,
                author: {
                  id: post.userId,
                  name: userData?.name || "User Name",
                  username: userData?.username || "username",
                  avatar: userData?.avatar || DEFAULT_AVATAR_MD,
                },
                timestamp: post.createdAt,
                likes: post.likedBy.length,
                comments: post.comments,
                shares: post.sharesBy.length,
                isLiked: post.likedBy.includes("1"), // Current user ID
                images: post.images || [],
                tags: post.tags || [],
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
