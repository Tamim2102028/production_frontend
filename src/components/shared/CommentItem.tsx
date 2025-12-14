import React from "react";
import { useNavigate } from "react-router-dom";
import { formatPostDate, formatPostClock } from "../../utils/dateUtils";
import SeparatorDot from "./SeparatorDot";
import { confirmDelete, showSuccess } from "../../utils/sweetAlert";
import { DEFAULT_AVATAR_SM, DEFAULT_AVATAR_XS } from "../../constants/images";

// TODO: Replace with API data
interface UserData {
  id: string;
  name: string;
  avatar?: string;
}

export interface ReplyData {
  replyId: string;
  userId: string;
  content: string;
  createdAt: string;
  likedBy?: string[];
}

export interface CommentData {
  commentId: string;
  userId: string;
  content: string;
  createdAt: string;
  likedBy?: string[];
  replies?: ReplyData[];
}

interface CommentItemProps {
  comment: CommentData;
  postOwnerId: string;
  currentUserId?: string;
  commentUser?: UserData | null;
  onLikeComment?: (commentId: string) => void;
  onDeleteComment?: (commentId: string) => void;
  onAddReply?: (commentId: string, content: string) => void;
  onLikeReply?: (replyId: string) => void;
  onDeleteReply?: (replyId: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  postOwnerId,
  currentUserId = "",
  commentUser,
  onLikeComment,
  onDeleteComment,
  onAddReply,
  onLikeReply,
  onDeleteReply,
}) => {
  const navigate = useNavigate();

  // Check if current user can delete this comment
  const canDelete =
    currentUserId === comment.userId || currentUserId === postOwnerId;

  const isLiked =
    !!currentUserId &&
    !!comment.likedBy &&
    comment.likedBy.includes(currentUserId);
  const likesCount = comment.likedBy ? comment.likedBy.length : 0;

  // TODO: Replace with actual current user from API/context
  const currentUser = { id: currentUserId, name: "Current User", avatar: "" };

  const handleProfileClick = () => {
    navigate(`/profile/${comment.userId}`);
  };

  const handleDelete = async () => {
    const result = await confirmDelete("this comment");

    if (result) {
      // TODO: Replace with API call
      onDeleteComment?.(comment.commentId);
      await showSuccess({
        title: "Deleted!",
        text: "Comment deleted successfully",
      });
    }
  };

  // Reply UI state
  const [showReplyInput, setShowReplyInput] = React.useState(false);
  const [showReplies, setShowReplies] = React.useState(false);
  const [replyText, setReplyText] = React.useState("");

  const replyTextareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  // Get replies from comment data
  const replies = comment.replies || [];

  const handleSendReply = () => {
    const text = replyText.trim();
    if (!text) return;
    // TODO: Replace with API call
    onAddReply?.(comment.commentId, text);
    // Keep the input open after sending; clear text and ensure replies list is visible
    setReplyText("");
    setShowReplies(true);
    // keep focus in the textarea so user can continue typing
    setTimeout(() => replyTextareaRef.current?.focus(), 0);
  };

  const handleDeleteReply = async (replyId: string) => {
    const result = await confirmDelete("this reply");
    if (result) {
      onDeleteReply?.(replyId);
      await showSuccess({
        title: "Deleted!",
        text: "Reply deleted successfully",
      });
    }
  };

  return (
    <div className="flex space-x-3">
      <img
        src={
          commentUser?.avatar ||
          "https://api.dicebear.com/9.x/bottts/svg?seed=Tamim"
        }
        alt={commentUser?.name || "User"}
        className="h-8 w-8 cursor-pointer rounded-full bg-gray-300 object-cover transition-all hover:ring-2 hover:ring-blue-300"
        onClick={handleProfileClick}
      />

      <div className="flex-1">
        <div className="rounded-lg bg-gray-100 px-3 py-2">
          <span
            className="cursor-pointer text-sm font-semibold text-gray-900 transition-colors hover:text-blue-600 hover:underline"
            onClick={handleProfileClick}
          >
            {commentUser?.name || "User"}
          </span>

          <p className="text-sm text-gray-700">{comment.content}</p>
        </div>

        {/* Date / Time and action buttons immediately under the comment */}
        <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500">
          <span>{formatPostDate(comment.createdAt)}</span>
          <SeparatorDot />
          <span>{formatPostClock(comment.createdAt)}</span>
          <SeparatorDot />

          <button
            onClick={() => onLikeComment?.(comment.commentId)}
            className={`cursor-pointer hover:underline ${isLiked ? "font-medium text-green-700" : "text-gray-600"}`}
          >
            Like{likesCount > 0 ? ` · ${likesCount}` : ""}
          </button>

          <SeparatorDot />

          <button
            onClick={() => {
              setShowReplyInput((s) => !s);
              setShowReplies((s) => !s);
            }}
            className="cursor-pointer text-gray-600 hover:underline"
          >
            {`Reply${replies.length > 0 ? ` · ${replies.length}` : ""}`}
          </button>

          {canDelete && (
            <>
              <SeparatorDot />
              <button
                onClick={handleDelete}
                className="cursor-pointer font-medium text-red-600 hover:underline"
              >
                Delete
              </button>
            </>
          )}
        </div>

        {/* Reply input (appears under the buttons) */}
        {showReplyInput && (
          <div className="mt-2 pl-10">
            <div className="flex items-start space-x-3">
              <img
                src={currentUser.avatar || DEFAULT_AVATAR_SM}
                alt={currentUser.name || "You"}
                className="h-8 w-8 rounded-full bg-gray-300 object-cover"
              />
              <div className="flex-1">
                <textarea
                  autoFocus
                  ref={replyTextareaRef}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={2}
                  className="w-full rounded border border-gray-200 p-2 text-sm"
                  placeholder="Write a reply..."
                />
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={handleSendReply}
                    className="rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white"
                  >
                    Reply
                  </button>
                  <button
                    onClick={() => setShowReplyInput(false)}
                    className="rounded border border-gray-300 px-3 py-1 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Replies list (after the comment controls) */}
        {showReplies && replies.length > 0 && (
          <div className="mt-2 space-y-2 pl-10">
            {replies.map((r) => {
              const isReplyLiked =
                !!currentUserId &&
                !!r.likedBy &&
                r.likedBy.includes(currentUserId);
              const replyLikesCount = r.likedBy ? r.likedBy.length : 0;
              const canDeleteReply =
                currentUserId === r.userId || currentUserId === postOwnerId;
              return (
                <div
                  key={r.replyId}
                  className="flex items-start space-x-2 text-sm"
                >
                  <img
                    src={DEFAULT_AVATAR_XS}
                    alt={"User"}
                    className="h-6 w-6 rounded-full bg-gray-200 object-cover"
                  />
                  <div className="rounded-lg bg-gray-50 px-2 py-1">
                    <div className="font-semibold text-gray-900">User</div>
                    <div className="text-gray-700">{r.content}</div>
                    <div className="mt-1 flex items-center space-x-2 text-xs text-gray-400">
                      <span>{formatPostDate(r.createdAt)}</span>
                      <SeparatorDot />
                      <span>{formatPostClock(r.createdAt)}</span>

                      <SeparatorDot />

                      <button
                        onClick={() => onLikeReply?.(r.replyId)}
                        className={`cursor-pointer hover:underline ${isReplyLiked ? "font-medium text-green-700" : "text-gray-600"}`}
                      >
                        Like{replyLikesCount > 0 ? ` · ${replyLikesCount}` : ""}
                      </button>

                      {canDeleteReply && (
                        <>
                          <SeparatorDot />
                          <button
                            onClick={() => handleDeleteReply(r.replyId)}
                            className="cursor-pointer font-medium text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
