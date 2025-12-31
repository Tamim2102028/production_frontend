import React from "react";
// import HomePostCard from "../Home/HomePostCard";

// TODO: Replace with API data
interface Post {
  postId: string;
  [key: string]: unknown;
}

interface HashtagsResultsProps {
  isVisible: boolean;
  posts?: Post[];
}

const HashtagsResults: React.FC<HashtagsResultsProps> = ({
  isVisible,
  posts = [],
}) => {
  const filteredPosts = posts;

  if (!isVisible) return null;
  if (filteredPosts.length === 0) return null;

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-gray-900">
        Hashtags ({filteredPosts.length})
      </h2>
      <div className="space-y-4">
        {/* {filteredPosts.map((post) => (
          <HomePostCard key={post.postId} post={post} />
        ))} */}
      </div>
    </div>
  );
};

export default HashtagsResults;
