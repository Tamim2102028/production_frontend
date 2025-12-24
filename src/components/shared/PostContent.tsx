import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaGlobe, FaUserFriends, FaLock, FaBuilding } from "react-icons/fa";
import type { IconType } from "react-icons";
import { POST_VISIBILITY } from "../../constants/post";
import type { PostContentProps } from "../../types/post.types";

const editPostSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Post content is required")
    .max(5000, "Post cannot exceed 5000 characters"),
  tags: z.string().optional(),
  visibility: z.enum([
    POST_VISIBILITY.PUBLIC,
    POST_VISIBILITY.INTERNAL,
    POST_VISIBILITY.CONNECTIONS,
    POST_VISIBILITY.ONLY_ME,
  ]),
});

type EditPostFormData = z.infer<typeof editPostSchema>;

const PostContent: React.FC<PostContentProps> = ({
  content,
  tags = [],
  visibility,
  isEditing,
  isUpdating,
  onUpdate,
  onCancel,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    setFocus,
    formState: { isValid },
  } = useForm<EditPostFormData>({
    resolver: zodResolver(editPostSchema),
    defaultValues: {
      content,
      tags: tags.join(", "),
      visibility: visibility,
    },
  });

  const privacy = watch("visibility");
  const editContent = watch("content");

  // Reset form when entering edit mode
  useEffect(() => {
    if (isEditing) {
      reset({
        content,
        tags: tags.join(", "),
        visibility: visibility,
      });
      // Auto focus on content
      setTimeout(() => {
        setFocus("content");
      }, 0);
    }
  }, [isEditing, content, tags, visibility, reset, setFocus]);

  const onSubmit = (data: EditPostFormData) => {
    // Process tags
    const processedTags = data.tags
      ? data.tags
          .split(/[\s,]+/)
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      : [];

    // Check if anything changed
    const tagsChanged = JSON.stringify(processedTags) !== JSON.stringify(tags);
    const contentChanged = data.content !== content;
    const visibilityChanged = data.visibility !== visibility;

    if (!tagsChanged && !contentChanged && !visibilityChanged) {
      onCancel();
      return;
    }

    onUpdate({
      content: data.content,
      tags: processedTags,
      visibility: data.visibility,
    });
  };

  const privacyOptions: Array<{
    value: (typeof POST_VISIBILITY)[keyof typeof POST_VISIBILITY];
    label: string;
    Icon: IconType;
    show: boolean;
  }> = [
    {
      value: POST_VISIBILITY.PUBLIC,
      label: "Public",
      Icon: FaGlobe,
      show: true,
    },
    {
      value: POST_VISIBILITY.INTERNAL,
      label: "Internal",
      Icon: FaBuilding,
      show: false,
    },
    {
      value: POST_VISIBILITY.CONNECTIONS,
      label: "Connections",
      Icon: FaUserFriends,
      show: true,
    },
    {
      value: POST_VISIBILITY.ONLY_ME,
      label: "Only me",
      Icon: FaLock,
      show: true,
    },
  ];

  const isLongContent = content.length > 300 || content.split("\n").length > 5;

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* Content Textarea */}
        <div className="relative">
          <textarea
            {...register("content")}
            className="w-full resize-none rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Write something..."
            rows={4}
            maxLength={5000}
            disabled={isUpdating}
          />
          <div className="absolute right-3 bottom-3 text-xs text-gray-400">
            {editContent?.length || 0}/5000
          </div>
        </div>

        {/* Tags Input */}
        <input
          type="text"
          {...register("tags")}
          placeholder="Add tags (separated by space or comma)"
          className="w-full rounded-lg border border-gray-300 p-2 text-sm font-medium focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
          disabled={isUpdating}
        />

        {/* Privacy Options */}
        <div className="flex flex-wrap items-center gap-2">
          {privacyOptions
            .filter((opt) => opt.show)
            .map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() =>
                  setValue("visibility", opt.value, {
                    shouldValidate: true,
                  })
                }
                disabled={isUpdating}
                className={`flex items-center gap-2 rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                  privacy === opt.value
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <opt.Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{opt.label}</span>
              </button>
            ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
            disabled={isUpdating}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isValid || isUpdating}
            className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {isUpdating ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
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
