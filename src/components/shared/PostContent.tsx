import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import type { PostContentProps } from "../../types/post.types";

const PostContent: React.FC<PostContentProps> = ({
  content,
  isEditing,
  isUpdating,
  onUpdate,
  onCancel,
}) => {
  const [editContent, setEditContent] = useState(content);
  const [isExpanded, setIsExpanded] = useState(false);
  const editTextAreaRef = useRef<HTMLTextAreaElement>(null);

  // Reset editContent when entering edit mode or when content changes
  useEffect(() => {
    setEditContent(content);
  }, [isEditing, content]);

  // Focus on textarea when editing starts
  useEffect(() => {
    if (isEditing && editTextAreaRef.current) {
      editTextAreaRef.current.focus();
      // Move cursor to end
      const length = editTextAreaRef.current.value.length;
      editTextAreaRef.current.setSelectionRange(length, length);
    }
  }, [isEditing]);

  const handleSave = () => {
    if (!editContent.trim()) {
      toast.error("Content cannot be empty");
      return;
    }

    if (editContent.length > 5000) {
      toast.error("Post cannot exceed 5000 characters");
      return;
    }

    // If content hasn't changed, just cancel
    if (editContent.trim() === content) {
      onCancel();
      return;
    }

    onUpdate(editContent);
  };

  const isLongContent = content.length > 300 || content.split("\n").length > 5;

  if (isEditing) {
    return (
      <div className="space-y-3">
        <div className="relative">
          <textarea
            ref={editTextAreaRef}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full resize-none rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Write something..."
            rows={4}
            maxLength={5000}
            disabled={isUpdating}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onCancel}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
              disabled={isUpdating}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!editContent.trim() || isUpdating}
              className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {isUpdating ? "Saving..." : "Save"}
            </button>
          </div>
          <div className="text-xs font-medium text-gray-500">
            {editContent.length}/5000
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`whitespace-pre-wrap text-gray-900 ${
          !isExpanded ? "line-clamp-5" : ""
        }`}
      >
        {content}
      </div>
      {isLongContent && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-1 cursor-pointer text-sm font-medium text-blue-500 hover:text-blue-700 hover:underline"
        >
          {isExpanded ? "See less" : "See more"}
        </button>
      )}
    </>
  );
};

export default PostContent;
