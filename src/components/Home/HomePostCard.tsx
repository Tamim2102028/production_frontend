import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "../../utils/sweetAlert";
import {
  FaHeart,
  FaShare,
  FaEllipsisH,
  FaRegHeart,
  FaRegComment,
  FaRegBookmark,
  FaLink,
  FaFlag,
  FaEdit,
  FaTrash,
  FaBuilding,
  FaLock,
  FaUserFriends,
  FaGlobe,
} from "react-icons/fa";

import { formatPostDate, formatPostClock } from "../../utils/dateUtils";
import SeparatorDot from "../shared/SeparatorDot";
import CommentItem from "../shared/CommentItem";
import { DEFAULT_AVATAR_MD, DEFAULT_AVATAR_SM } from "../../constants/images";
import { POST_VISIBILITY } from "../../constants";
import type { Post } from "../../types/post.types";

// TODO: Import Comment type from shared types when API is connected
interface Comment {
  commentId: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
}

interface HomePostCardProps {
  post: Post;
}

const HomePostCard: React.FC<HomePostCardProps> = ({ post }) => {
  const navigate = useNavigate();
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [imageError, setImageError] = useState(false);
  const [displayedCommentsCount, setDisplayedCommentsCount] = useState(15); // Initially show 15 comments
  const [showMenu, setShowMenu] = useState(false);
  const [isLiked, setIsLiked] = useState(post.context?.isLiked || false);

  // TODO: Get current user from auth context/API
  const currentUser = {
    id: "",
    name: "Current User",
    avatar: DEFAULT_AVATAR_SM,
  };

  // TODO: Fetch comments from API
  const postComments: Comment[] = [];

  const handleLike = () => {
    // TODO: Call API to toggle like
    console.log("TODO: Toggle like for post", post._id);
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    // TODO: Call API to toggle bookmark
    console.log("TODO: Toggle bookmark for post", post._id);
  };

  const handleProfileClick = () => {
    navigate(`/profile/${post.author._id}`);
  };

  const handleToggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="rounded-lg border border-gray-400 bg-white shadow">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <img
            src={
              imageError
                ? DEFAULT_AVATAR_MD
                : post.author.avatar || DEFAULT_AVATAR_MD
            }
            alt={post.author.fullName || "User"}
            className="h-10 w-10 cursor-pointer rounded-full bg-gray-300 transition-all hover:ring-2 hover:ring-blue-300"
            onClick={handleProfileClick}
            onError={() => setImageError(true)}
          />
          <div>
            <h3
              className="cursor-pointer font-semibold text-gray-900 transition-colors hover:text-blue-600 hover:underline"
              onClick={handleProfileClick}
            >
              {post.author.fullName || "User"}
            </h3>
            <p className="flex items-center gap-2 text-sm text-gray-500">
              <span>{formatPostDate(post.createdAt)}</span>
              <SeparatorDot ariaHidden />
              <span>{formatPostClock(post.createdAt)}</span>
              <SeparatorDot ariaHidden />
              {post.visibility === POST_VISIBILITY.PUBLIC && (
                <FaGlobe className="h-3 w-3" title="Public" />
              )}
              {post.visibility === POST_VISIBILITY.CONNECTIONS && (
                <FaUserFriends className="h-3 w-3" title="Friends" />
              )}
              {post.visibility === POST_VISIBILITY.ONLY_ME && (
                <FaLock className="h-3 w-3" title="Only Me" />
              )}
              {post.visibility === POST_VISIBILITY.INTERNAL && (
                <FaBuilding className="h-3 w-3" title="Internal" />
              )}
            </p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={handleToggleMenu}
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-200"
            title="More actions"
          >
            <FaEllipsisH className="h-4 w-4" />
          </button>

          {showMenu && (
            <div className="absolute top-full right-0 z-50 mt-1 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
              <div className="py-1">
                <button
                  onClick={handleBookmark}
                  className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <FaRegBookmark className="h-4 w-4" />
                  <span className="font-medium">Save post</span>
                </button>
                <button
                  onClick={async () => {
                    const link = `${window.location.origin}/post/${post._id}`;
                    try {
                      await navigator.clipboard.writeText(link);
                      showSuccess({
                        title: "Copied!",
                        text: "Post link copied to clipboard",
                      });
                      setShowMenu(false);
                    } catch {
                      showError({
                        title: "Copy failed",
                        text: "Could not copy link",
                      });
                    }
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <FaLink className="h-4 w-4" />
                  <span className="font-medium">Copy link</span>
                </button>
                {/* Show Edit/Delete when this is the current user's post */}
                {post.author._id === currentUser.id ? (
                  <>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        // TODO: Implement edit action with API
                        console.log("TODO: Edit post", post._id);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <FaEdit className="h-4 w-4" />
                      <span className="font-medium">Edit post</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        // TODO: Implement delete action with API
                        console.log("TODO: Delete post", post._id);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-gray-50"
                    >
                      <FaTrash className="h-4 w-4" />
                      <span className="font-medium">Delete post</span>
                    </button>
                  </>
                ) : null}
                {/* Report only for others' posts */}
                {post.author._id !== currentUser.id && (
                  <button className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-gray-50">
                    <FaFlag className="h-4 w-4" />
                    <span className="font-medium">Report post</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="whitespace-pre-wrap text-gray-900">{post.content}</p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block cursor-pointer rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Post Images */}
      {post.images && post.images.length > 0 && (
        <div className="px-4 pb-3">
          {post.images.length === 1 ? (
            <img
              src={post.images[0]}
              alt="Post content"
              className="h-auto max-h-96 w-full rounded-lg object-cover"
            />
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {post.images.slice(0, 4).map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Post content ${index + 1}`}
                    className="h-48 w-full rounded-lg object-cover"
                  />
                  {index === 3 && post.images && post.images.length > 4 && (
                    <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center rounded-lg bg-black">
                      <span className="text-lg font-semibold text-white">
                        +{post.images!.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Post Stats */}
      <div className="border-t border-gray-100 px-4 py-2">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-3">
            <span>{post.stats?.likes || 0} likes</span>
            <SeparatorDot />
            <span>{post.stats?.comments || 0} comments</span>
            <SeparatorDot />
            <span>{post.stats?.shares || 0} shares</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-gray-100 px-4 py-3">
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={handleLike}
            className={`flex items-center justify-center space-x-2 rounded-lg px-3 py-2 transition-colors ${
              isLiked
                ? "bg-red-50 text-red-600 hover:bg-red-100"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {isLiked ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
            <span className="text-sm font-medium">Like</span>
          </button>

          <button
            onClick={() => setShowCommentBox(!showCommentBox)}
            className={`flex items-center justify-center space-x-2 rounded-lg px-3 py-2 transition-colors ${
              showCommentBox
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FaRegComment size={18} />
            <span className="text-sm font-medium">Comment</span>
          </button>

          <button className="flex items-center justify-center space-x-2 rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-gray-100">
            <FaShare size={18} />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>
      </div>

      {/* Comments Section & Input - Show only when comment button is clicked */}
      {showCommentBox && (
        <div className="border-t border-gray-100">
          {/* Comments List - Scrollable */}
          {postComments.length > 0 && (
            <div className="px-2.5 py-3">
              <div className="max-h-[400px] space-y-3 overflow-y-auto">
                {/* Display limited comments based on displayedCommentsCount - Newest first */}
                {[...postComments]
                  .reverse()
                  .slice(0, displayedCommentsCount)
                  .map((comment) => (
                    <CommentItem
                      key={comment.commentId}
                      comment={comment}
                      postOwnerId={post.author._id}
                    />
                  ))}

                {/* Show More Comments Button - Inside scrollable area */}
                {postComments.length > displayedCommentsCount && (
                  <div className="flex justify-center pt-2">
                    <button
                      onClick={() =>
                        setDisplayedCommentsCount((prev) => prev + 15)
                      }
                      className="rounded-lg px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
                    >
                      Show more comments (
                      {postComments.length - displayedCommentsCount} remaining)
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Create Comment Input */}
          <div className="border-t border-gray-100 px-4 pb-4">
            <div className="mt-3 flex items-center space-x-3">
              <img
                src={currentUser.avatar || DEFAULT_AVATAR_SM}
                alt="Your avatar"
                className="h-8 w-8 rounded-full bg-gray-300 object-cover"
              />
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 rounded-full border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && commentText.trim()) {
                    // TODO: Call API to add comment
                    console.log(
                      "TODO: Add comment to post",
                      post._id,
                      commentText.trim()
                    );
                    setCommentText("");
                  }
                }}
              />
              <button
                onClick={() => {
                  if (commentText.trim()) {
                    // TODO: Call API to add comment
                    console.log(
                      "TODO: Add comment to post",
                      post._id,
                      commentText.trim()
                    );
                    setCommentText("");
                  }
                }}
                disabled={!commentText.trim()}
                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePostCard;
