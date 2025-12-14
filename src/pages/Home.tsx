import React, { useState, useEffect } from "react";
import { useAppSelector } from "../store/hooks";
import {
  selectFriendsForUser,
  selectSentRequestsByUser,
} from "../store/slices/friendsSlice";
import { HomePostCard, CreatePost, LoadingSkeleton } from "../components/Home";
import DailyXPClaim from "../components/Gaming/Dashboard/DailyXPClaim";

const Home: React.FC = () => {
  const { posts, loading } = useAppSelector((state) => state.posts);
  const { lastClaimDate } = useAppSelector((state) => state.tournament);
  const currentUser = useAppSelector((state) => state.profile);

  // Determine which users' posts should appear in the personal Home feed:
  // - friends
  // - users to whom current user has sent a pending friend request
  // - include own posts as well
  const friends = useAppSelector((state) =>
    selectFriendsForUser(state, currentUser?.id || "")
  );
  const sentRequests = useAppSelector((state) =>
    selectSentRequestsByUser(state, currentUser?.id || "")
  );
  const allowedUserIds = new Set<string>([...(friends || []), ...(sentRequests || []), currentUser?.id]);
  const [canClaim, setCanClaim] = useState(false);

  // Check if user can claim today
  useEffect(() => {
    const today = new Date().toDateString();
    const lastClaim = lastClaimDate
      ? new Date(lastClaimDate).toDateString()
      : null;

    // Can claim if never claimed OR last claim was not today
    setCanClaim(!lastClaim || lastClaim !== today);
  }, [lastClaimDate]);

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
      {/* Daily XP Claim - Only show if can claim today */}
      {canClaim && <DailyXPClaim />}

      {/* Create Post Section */}
      <CreatePost />

      {/* Feed Header */}
      <h2 className="text-xl font-semibold text-gray-900">Latest Posts</h2>

      {/* Posts List (filtered to friends & sent requests) */}
      <div className="space-y-5">
        {posts
          .filter((post) => allowedUserIds.has(post.userId))
          .sort((a, b) =>
            // sort by createdAt descending (newest first)
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((post) => (
            <HomePostCard key={post.postId} post={post} />
          ))}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center">
        <button className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50">
          Load more posts
        </button>
      </div>
    </>
  );
};

export default Home;
