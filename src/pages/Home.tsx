import React from "react";
import { HomePostCard, CreatePost, LoadingSkeleton } from "../components/Home";

// TODO: Define Post type when API is connected
interface Post {
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  comments: number;
  likedBy: string[];
  sharesBy: string[];
  images?: string[];
  status: string;
  privacy: string;
  tags?: string[];
}

const Home: React.FC = () => {
  // TODO: Replace with API call to fetch posts
  const posts: Post[] = [];
  const loading = false;

  // TODO: Fetch current user from auth context/API
  // TODO: Fetch friends list from API for filtering

  if (loading) {
    return (
      <>
        {/* Loading skeleton */}
        <LoadingSkeleton />
      </>
    );
  }

  return (
    <>
      {/* TODO: Add DailyXPClaim component when gaming features are connected */}

      {/* Create Post Section */}
      <CreatePost />

      {/* Feed Header */}
      <h2 className="text-xl font-semibold text-gray-900">Latest Posts</h2>

      {/* Posts List */}
      {/* TODO: Filter posts by friends/allowed users when API is connected */}
      <div className="space-y-5">
        {posts
          .sort(
            (a, b) =>
              // sort by createdAt descending (newest first)
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((post) => (
            <HomePostCard key={post.postId} post={post} />
          ))}
      </div>

      {/* Load More Button */}
      {/* TODO: Implement pagination with API */}
      <div className="flex justify-center">
        <button
          onClick={() => console.log("TODO: Load more posts from API")}
          className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50"
        >
          Load more posts
        </button>
      </div>
    </>
  );
};

export default Home;
