import React, { useState } from "react";
import { toast } from "sonner";
import {
  FaHeart,
  FaShare,
  FaEllipsisH,
  FaRegHeart,
  FaRegComment,
  FaBookmark,
  FaRegBookmark,
  FaEdit,
  FaTrash,
  FaFlag,
  FaLink,
} from "react-icons/fa";
import { formatPostDate, formatPostClock } from "../../utils/dateUtils";
import SeparatorDot from "../shared/SeparatorDot";
import CommentItem, { type CommentData } from "../shared/CommentItem";
import { DEFAULT_AVATAR_SM, DEFAULT_AVATAR_MD } from "../../constants/images";
import type { Attachment, Post } from "../../types/post.types";
import { useUser } from "../../hooks/useAuth";
import { useToggleLikePost } from "../../hooks/usePost";
import { ATTACHMENT_TYPES } from "../../constants";

interface ProfilePostCardProps {
  post: Post;
  isOwnProfile: boolean;
}

const ProfilePostCard: React.FC<ProfilePostCardProps> = ({ post }) => {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [displayedCommentsCount, setDisplayedCommentsCount] = useState(15);
  // TODO: Replace with API data
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [commentText, setCommentText] = useState("");

  // Get current logged-in user
  const { user: currentUser } = useUser();
  const isOwnPost = post.author._id === currentUser?._id;

  // TODO: Replace with API data for comments
  const postComments: CommentData[] = [];

  // আমাদের বানানো হুক কল করলাম
  const { mutate: likeMutate } = useToggleLikePost();
  const handleLike = () => {
    // শুধু আইডি পাস করে দিলেই হবে, বাকি সব হুক সামলাবে
    likeMutate(post._id);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? "Post removed from saved" : "Post saved");
    setShowMenu(false);
  };

  const handleCopyLink = async () => {
    try {
      const link = `${window.location.origin}/post/${post._id}`;
      await navigator.clipboard.writeText(link);
      toast.success("Post link copied to clipboard");
      setShowMenu(false);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const images = post.attachments.filter(
    (attachment: Attachment) => attachment.type === ATTACHMENT_TYPES.IMAGE
  );

  return (
    <div className="rounded-lg border border-gray-400 bg-white shadow">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <img
            src={post.author.avatar || DEFAULT_AVATAR_MD}
            alt={post.author.fullName}
            className="h-10 w-10 rounded-full bg-gray-300"
          />
          <div>
            <h3 className="font-semibold text-gray-900">
              {post.author.fullName}
            </h3>
            <p className="flex items-center gap-2 text-sm text-gray-500">
              <span>{formatPostDate(post.createdAt)}</span>
              <SeparatorDot ariaHidden />
              <span>{formatPostClock(post.createdAt)}</span>
            </p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-200"
            title="More actions"
          >
            <FaEllipsisH className="h-4 w-4" />
          </button>

          {showMenu && (
            <div className="absolute top-full right-0 z-50 mt-1 w-56 rounded-lg border border-gray-200 bg-white shadow-lg">
              <div className="py-1">
                <button
                  onClick={handleBookmark}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-gray-50 ${isBookmarked ? "text-blue-600" : "text-gray-700"}`}
                >
                  {isBookmarked ? (
                    <>
                      <FaBookmark className="h-4 w-4 flex-shrink-0" />
                      <span className="font-medium">Remove from saved</span>
                    </>
                  ) : (
                    <>
                      <FaRegBookmark className="h-4 w-4 flex-shrink-0" />
                      <span className="font-medium">Save post</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleCopyLink}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <FaLink className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium">Copy link</span>
                </button>

                {isOwnPost ? (
                  <>
                    {/* edit button */}
                    <button
                      onClick={() => setShowMenu(false)}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <FaEdit className="h-4 w-4 flex-shrink-0" />
                      <span className="font-medium">Edit post</span>
                    </button>
                    {/* delete button */}
                    <button
                      onClick={() => setShowMenu(false)}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-gray-50"
                    >
                      <FaTrash className="h-4 w-4 flex-shrink-0" />
                      <span className="font-medium">Delete post</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-gray-50">
                      <FaFlag className="h-4 w-4 flex-shrink-0" />
                      <span className="font-medium">Report post</span>
                    </button>
                  </>
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
      {images && images.length > 0 && (
        <div className="px-4 pb-3">
          {images.length === 1 ? (
            <img
              src={images[0].url}
              alt="Post content"
              className="h-auto max-h-96 w-full rounded-lg object-cover"
            />
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {images.slice(0, 4).map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image.url}
                    alt={`Post content ${index + 1}`}
                    className="h-48 w-full rounded-lg object-cover"
                  />
                  {index === 3 && images.length > 4 && (
                    <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center rounded-lg bg-black">
                      <span className="text-lg font-semibold text-white">
                        +{images.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="border-t border-gray-100 px-4 py-2">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-3">
            <span>{post.stats.likes || 0} likes</span>
            <SeparatorDot />
            <span>{post.stats.comments || 0} comments</span>
            <SeparatorDot />
            <span>{post.stats.shares || 0} shares</span>
          </div>
        </div>
      </div>

      {/* like/comment/share - Buttons */}
      <div className="border-t border-gray-100 px-4 py-3">
        <div className="grid grid-cols-3 gap-2">
          {/* like button */}
          <button
            onClick={handleLike}
            className={`flex items-center justify-center space-x-2 rounded-lg px-3 py-2 transition-colors ${
              post.context?.isLiked
                ? "bg-red-50 text-red-600 hover:bg-red-100"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {post.context?.isLiked ? (
              <FaHeart size={18} />
            ) : (
              <FaRegHeart size={18} />
            )}
            <span className="text-sm font-medium">Like</span>
          </button>

          {/* comment button */}
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

          {/* share button */}
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
                src={currentUser?.avatar || DEFAULT_AVATAR_SM}
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
                    console.log("Add comment:", commentText.trim());
                    setCommentText("");
                  }
                }}
              />
              <button
                onClick={() => {
                  if (commentText.trim()) {
                    // TODO: Call API to add comment
                    console.log("Add comment:", commentText.trim());
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

export default ProfilePostCard;
