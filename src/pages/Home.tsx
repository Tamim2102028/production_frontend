import React from "react";
import { HomePostCard, LoadingSkeleton } from "../components/Home";
import type { Post } from "../types/post.types";

const Home: React.FC = () => {
  // TODO: Replace with API call to fetch posts
  const posts: Post[] = [];
  const loading = false;

  // const handleCreatePost = (data: CreatePostData) => {
  //   createPost(
  //     {
  //       content: data.content,
  //       visibility: data.visibility,
  //       targetModel: data.targetModel,
  //       targetId: data.targetId,
  //       attachments: data.attachments,
  //     },
  //     {
  //       onSuccess: () => {},
  //     }
  //   );
  // };

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

      {/* Create Post Section - Shared Component */}
      {/*user?._id && (
        <CreatePost
          key={isCreatingPost ? "submitting" : "idle"} // Simple hack: re-mount or re-render? No, this might cause focus loss.
          // Better: Use a dedicated key state that increments on success.
          // But for now, let's stick to just passing props.
          targetModel={POST_TARGET_MODELS.USER}
          targetId={user._id}
          placeholder={`What's on your mind, ${user.fullName.split(" ")[0]}?`}
          showPoll={true}
          onSubmit={handleCreatePost}
          isPending={isCreatingPost}
        />
      )*/}

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
            <HomePostCard key={post._id} post={post} />
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
