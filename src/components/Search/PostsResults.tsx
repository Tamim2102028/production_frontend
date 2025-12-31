import React from "react";
import { type Post } from "../../services/search.service";

interface PostsResultsProps {
  isVisible: boolean;
  posts?: Post[];
  loading?: boolean;
  searchQuery?: string;
}

const PostsResults: React.FC<PostsResultsProps> = ({
  isVisible,
  posts = [],
  loading = false,
  searchQuery = "",
}) => {
  if (!isVisible) return null;

  if (loading) {
    return (
      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-900">Posts</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="flex items-start space-x-3">
                <div className="h-10 w-10 rounded-full bg-gray-300"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/4 rounded bg-gray-300"></div>
                  <div className="h-4 w-full rounded bg-gray-300"></div>
                  <div className="h-4 w-3/4 rounded bg-gray-300"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (posts.length === 0) return null;

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(
      `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
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

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-gray-900">
        Posts ({posts.length})
      </h2>
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post._id}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            {/* Post Header */}
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={post.author.avatar || "/default-avatar.png"}
                  alt={post.author.fullName}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {post.author.fullName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    @{post.author.userName} • {formatDate(post.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                  {post.type}
                </span>
              </div>
            </div>

            {/* Post Content */}
            <div className="mb-3">
              <p className="leading-relaxed text-gray-800">
                {highlightText(post.content, searchQuery)}
              </p>
            </div>

            {/* Post Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Post Attachments */}
            {post.attachments && post.attachments.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                  <span>{post.attachments.length} attachment(s)</span>
                </div>
              </div>
            )}

            {/* Post Stats */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span>{post.likesCount}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span>{post.commentsCount}</span>
                </div>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                View Post
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostsResults;
