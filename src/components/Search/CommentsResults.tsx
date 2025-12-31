import React from "react";
import {
  FaComments,
  FaUser,
  FaHeart,
  FaClock,
  FaExternalLinkAlt,
} from "react-icons/fa";

interface Comment {
  _id: string;
  content: string;
  createdAt: string;
  likesCount: number;
  author: {
    _id: string;
    fullName: string;
    userName: string;
    avatar: string;
  };
  post: {
    _id: string;
    content: string;
    author: string;
  };
}

interface CommentsResultsProps {
  isVisible: boolean;
  comments: Comment[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  searchQuery?: string;
}

const CommentsResults: React.FC<CommentsResultsProps> = ({
  isVisible,
  comments,
  loading = false,
  onLoadMore,
  hasMore = false,
  searchQuery = "",
}) => {
  if (!isVisible) return null;

  // Helper function to highlight search terms
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="rounded bg-yellow-200 px-1">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="rounded-lg border p-4">
                <div className="mb-3 flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                  <div className="h-4 w-24 rounded bg-gray-200"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-gray-200"></div>
                  <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="py-8 text-center">
        <FaComments className="mx-auto mb-4 h-12 w-12 text-gray-400" />
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          No comments found
        </h3>
        <p className="text-gray-600">Try searching with different keywords</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Comments ({comments.length})
      </h3>

      <div className="space-y-3">
        {comments.map((comment) => (
          <div
            key={comment._id}
            className="rounded-lg border border-gray-200 p-4 transition-all hover:border-blue-300 hover:shadow-md"
          >
            {/* Comment Header */}
            <div className="mb-3 flex items-center space-x-3">
              <img
                src={comment.author.avatar}
                alt={comment.author.fullName}
                className="h-8 w-8 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="truncate font-medium text-gray-900">
                    {comment.author.fullName}
                  </span>
                  <span className="text-sm text-gray-500">
                    @{comment.author.userName}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <FaClock className="h-3 w-3" />
                  <span>{formatDate(comment.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Comment Content */}
            <div className="mb-3">
              <p className="leading-relaxed text-gray-800">
                {highlightText(comment.content, searchQuery)}
              </p>
            </div>

            {/* Post Context */}
            <div className="mb-3 rounded-lg bg-gray-50 p-3">
              <div className="flex items-start space-x-2">
                <FaExternalLinkAlt className="mt-1 h-3 w-3 flex-shrink-0 text-gray-400" />
                <div className="min-w-0 flex-1">
                  <p className="mb-1 text-sm text-gray-600">Commented on:</p>
                  <p className="line-clamp-2 text-sm text-gray-800">
                    {comment.post.content}
                  </p>
                </div>
              </div>
            </div>

            {/* Comment Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {comment.likesCount > 0 && (
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <FaHeart className="h-3 w-3 text-red-500" />
                    <span>{comment.likesCount}</span>
                  </div>
                )}
              </div>

              <button
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
                onClick={() => {
                  // Navigate to post with comment highlighted
                  console.log("Navigate to post:", comment.post._id);
                }}
              >
                View in Post
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="pt-4 text-center">
          <button
            onClick={onLoadMore}
            className="rounded-lg bg-purple-500 px-6 py-2 text-white transition-colors hover:bg-purple-600"
          >
            Load More Comments
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentsResults;
