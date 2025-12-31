import React from "react";
// import HomePostCard from "../Home/HomePostCard";

// TODO: Replace with API data
interface Post {
  postId: string;
  [key: string]: unknown;
}

interface PostsResultsProps {
  isVisible: boolean;
  posts?: Post[];
}

const PostsResults: React.FC<PostsResultsProps> = ({
  isVisible,
  posts = [],
}) => {
  const filteredPosts = posts;

  if (!isVisible) return null;
  if (filteredPosts.length === 0) return null;

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-gray-900">
        Posts ({filteredPosts.length})
      </h2>
      <div className="space-y-4">
        {/* {filteredPosts.map((post) => (
          <HomePostCard key={post.postId} post={post} />
        ))} */}
      </div>
    </div>
  );
};

export default PostsResults;
