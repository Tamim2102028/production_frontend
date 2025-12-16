import React from "react";
import ProfilePostCard from "./ProfilePostCard";
import { useProfilePosts } from "../../hooks/usePost";
import PageLoader from "../../pages/Fallbacks/PageLoader";

interface ProfilePostsProps {
  username: string;
  isOwnProfile: boolean;
}

const ProfilePosts: React.FC<ProfilePostsProps> = ({
  username,
  isOwnProfile,
}) => {
  const { data: postsData, isLoading } = useProfilePosts(username);
  const posts = postsData?.posts || [];

  if (isLoading) {
    return <PageLoader />;
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
