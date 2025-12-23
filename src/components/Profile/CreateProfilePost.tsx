import React, { useState } from "react";
import {
  FaImage,
  FaPaperPlane,
  FaGlobe,
  FaUserFriends,
  FaLock,
  FaBuilding,
  FaPoll,
  FaVideo,
} from "react-icons/fa";
import type { IconType } from "react-icons";
import { DEFAULT_AVATAR_MD } from "../../constants/images";
import { POST_VISIBILITY } from "../../constants/post";
import { useUser } from "../../hooks/useAuth";
import { useCreateProfilePost } from "../../hooks/usePost";
import type { CreateProfilePostProps } from "../../types/post.types";

const CreateProfilePost: React.FC<CreateProfilePostProps> = ({ currentUserId }) => {
  const { user } = useUser();
  const createPostMutation = useCreateProfilePost();

  const [postContent, setPostContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [privacy, setPrivacy] = useState<
    (typeof POST_VISIBILITY)[keyof typeof POST_VISIBILITY]
  >(POST_VISIBILITY.PUBLIC);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!postContent.trim()) return;
    if (!currentUserId) return;

    createPostMutation.mutate(
      {
        content: postContent.trim(),
        visibility: privacy,
        targetId: currentUserId,
      },
      {
        onSuccess: () => {
          setPostContent("");
          setIsExpanded(false);
        },
      }
    );
  };

  const privacyOptions: Array<{
    value: (typeof POST_VISIBILITY)[keyof typeof POST_VISIBILITY];
    label: string;
    Icon: IconType;
  }> = [
    {
      value: POST_VISIBILITY.PUBLIC,
      label: "Public",
      Icon: FaGlobe,
    },
    {
      value: POST_VISIBILITY.INTERNAL,
      label: "Internal",
      Icon: FaBuilding,
    },
    {
      value: POST_VISIBILITY.CONNECTIONS,
      label: "Connections",
      Icon: FaUserFriends,
    },
    {
      value: POST_VISIBILITY.ONLY_ME,
      label: "Only me",
      Icon: FaLock,
    },
  ];

  const isPending = createPostMutation.isPending;

  return (
    <div className="rounded-lg border border-gray-400 bg-white p-4 shadow">
      <form onSubmit={handleSubmit}>
        {/* User Avatar and Input */}
        <div className="flex space-x-3">
          <img
            src={user?.avatar || DEFAULT_AVATAR_MD}
            alt={user?.fullName || "Your avatar"}
            className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"
          />
          <div className="flex-1">
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              placeholder={`What's on your mind, ${user?.fullName?.split(" ")[0]}?`}
              className="w-full resize-none rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows={isExpanded ? 4 : 1}
            />
          </div>
        </div>

        {/* Expanded Options */}
        {isExpanded && (
          <div className="mt-4">
            {/* Media & Privacy Options */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-4">
                {/* Image Upload - Placeholder */}
                <button
                  type="button"
                  onClick={() => alert("Photo upload coming soon!")}
                  className="flex items-center space-x-2 rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-gray-100"
                >
                  <FaImage className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Photo</span>
                </button>

                {/* Video (Placeholder) */}
                <button
                  type="button"
                  className="flex items-center space-x-2 rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-gray-100"
                  onClick={() => alert("Video upload coming soon!")}
                >
                  <FaVideo className="h-5 w-5 text-red-500" />
                  <span className="text-sm font-medium">Video</span>
                </button>

                {/* Poll (Placeholder) */}
                <button
                  type="button"
                  className="flex items-center space-x-2 rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-gray-100"
                  onClick={() => alert("Poll creation coming soon!")}
                >
                  <FaPoll className="h-5 w-5 text-orange-500" />
                  <span className="text-sm font-medium">Poll</span>
                </button>
              </div>

              {/* Privacy Selector */}
              <div className="flex items-center space-x-2">
                {privacyOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPrivacy(opt.value)}
                    aria-pressed={privacy === opt.value}
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
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setPostContent("");
                  setIsExpanded(false);
                }}
                className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:border-red-200 hover:bg-red-50"
              >
                <span>Cancel</span>
              </button>

              <button
                type="submit"
                disabled={!postContent.trim() || isPending}
                className="flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span>{isPending ? "Posting..." : "Post"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Simple Post Button (when not expanded) */}
        {!isExpanded && postContent && (
          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              <FaPaperPlane className="h-4 w-4" />
              <span>{isPending ? "Posting..." : "Post"}</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateProfilePost;
