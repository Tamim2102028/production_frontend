import React from "react";
import { useAppSelector } from "../../store/hooks";
import { selectFilteredPosts } from "../../store/slices/search/searchSlice";
import HomePostCard from "../Home/HomePostCard";

interface PostsResultsProps {
  isVisible: boolean;
}

const PostsResults: React.FC<PostsResultsProps> = ({ isVisible }) => {
  const filteredPosts = useAppSelector(selectFilteredPosts);

  if (!isVisible) return null;
  if (filteredPosts.length === 0) return null;

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-gray-900">
        Posts ({filteredPosts.length})
      </h2>
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <HomePostCard key={post.postId} post={post} />
        ))}
      </div>
    </div>
  );
};

export default PostsResults;
