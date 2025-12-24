import React from "react";
import { useNavigate } from "react-router-dom";
import { formatPostDateTime } from "../../utils/dateUtils";
import { confirmDelete } from "../../utils/sweetAlert";
import { DEFAULT_AVATAR_SM } from "../../constants/images";
import SeparatorDot from "./SeparatorDot";
import type { Comment } from "../../types/comment.types";

interface CommentItemProps {
  comment: Comment;
  postOwnerId: string;
  currentUserId?: string;
  onLikeComment?: (commentId: string) => void;
  onDeleteComment?: (commentId: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  postOwnerId,
  currentUserId = "",
  onLikeComment,
  onDeleteComment,
}) => {
  const navigate = useNavigate();

  // Check if current user can delete this comment
  const canDelete =
    currentUserId === comment.author._id || currentUserId === postOwnerId;

  const isLiked = comment.isLiked;
  const likesCount = comment.stats.likes;

  const handleProfileClick = () => {
    navigate(`/profile/${comment.author.userName}`);
  };

  const handleDelete = async () => {
    const result = await confirmDelete("this comment");

    if (result) {
      onDeleteComment?.(comment._id);
    }
  };

  return (
    <div className="flex gap-3 py-1">
      {/* Avatar */}
      <div
        className="h-8 w-8 flex-shrink-0 cursor-pointer overflow-hidden rounded-full"
        onClick={handleProfileClick}
      >
        <img
          src={comment.author.avatar || DEFAULT_AVATAR_SM}
          alt={comment.author.fullName}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="rounded-lg bg-gray-100 px-3 py-2">
          <div className="flex items-center gap-2">
            <span
              className="cursor-pointer text-sm font-semibold text-gray-900 hover:underline"
              onClick={handleProfileClick}
            >
              {comment.author.fullName}
            </span>
            {/* Post time */}
            <span className="text-xs text-gray-500">
              {formatPostDateTime(comment.createdAt)}
            </span>
            {comment.isEdited && (
              <>
                <SeparatorDot />
                <span className="text-xs text-gray-400 italic">Edited</span>
              </>
            )}
          </div>
          <p className="text-sm text-gray-800">{comment.content}</p>
        </div>

        <div className="mt-1 ml-1 flex items-center gap-4 text-xs font-semibold text-gray-500">
          <button
            onClick={() => onLikeComment?.(comment._id)}
            className={`transition-colors hover:text-blue-600 ${
              isLiked ? "text-blue-600" : ""
            }`}
          >
            Like{likesCount > 0 ? ` (${likesCount})` : ""}
          </button>
          {canDelete && (
            <button
              onClick={handleDelete}
              className="transition-colors hover:text-red-600"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
