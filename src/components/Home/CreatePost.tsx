import React, { useState, useRef, useEffect } from "react";
import {
  FaImage,
  FaPaperPlane,
  FaGlobe,
  FaUserFriends,
  FaLock,
  FaTimes,
} from "react-icons/fa";
import type { IconType } from "react-icons";
import { DEFAULT_AVATAR_MD } from "../../constants/images";

// TODO: Define PostData type when API is connected
interface PostData {
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  comments: number;
  likedBy: string[];
  sharesBy: string[];
  images?: string[];
  status: string;
  privacy: "public" | "friends" | "private";
  tags: string[];
}

const CreatePost: React.FC = () => {
  // Local state instead of Redux
  const [postContent, setPostContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  // TODO: Get current user from auth context/API
  const currentUser = {
    id: "",
    name: "Current User",
    avatar: DEFAULT_AVATAR_MD,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (postContent.trim()) {
      // TODO: Call API to create post
      const now = new Date().toISOString();
      const newPost: PostData = {
        postId: `p${Date.now()}`,
        userId: currentUser.id,
        content: postContent.trim(),
        createdAt: now,
        updatedAt: now,
        comments: 0,
        likedBy: [],
        sharesBy: [],
        images: selectedImages.map((s) => s.dataUrl ?? s.url),
        status: "active",
        privacy: privacy as "public" | "friends" | "private",
        tags: [],
      };

      console.log("TODO: Submit post to API", newPost);

      // Clear form after submission
      setPostContent("");
      setIsExpanded(false);
      // revoke object URLs used for preview
      selectedImages.forEach((s) => {
        try {
          URL.revokeObjectURL(s.url);
        } catch {
          // ignore
        }
      });
      setSelectedImages([]);
    }
  };

  const [privacy, setPrivacy] = useState<string>("public");
  const [selectedImages, setSelectedImages] = useState<
    Array<{ file: File; url: string; dataUrl?: string }>
  >([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      // revoke object URLs on unmount
      selectedImages.forEach((s) => URL.revokeObjectURL(s.url));
    };
  }, [selectedImages]);

  return (
    <div className="rounded-lg border border-gray-400 bg-white p-4 shadow">
      <form onSubmit={handleSubmit}>
        {/* User Avatar and Input */}
        <div className="flex space-x-3">
          <img
            src={currentUser.avatar || DEFAULT_AVATAR_MD}
            alt={currentUser.name || "Your avatar"}
            className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"
          />
          <div className="flex-1">
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              placeholder="What's on your mind?"
              className="w-full resize-none rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows={isExpanded ? 4 : 1}
            />
          </div>
        </div>

        {/* Expanded Options */}
        {isExpanded && (
          <div className="mt-4">
            {/* Media Options */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (!files) return;
                    const arr = Array.from(files).slice(0, 4); // limit to 4
                    // revoke previous urls
                    selectedImages.forEach((s) => URL.revokeObjectURL(s.url));
                    const mapped = arr.map((file) => ({
                      file,
                      url: URL.createObjectURL(file),
                    }));
                    setSelectedImages(mapped);
                    // asynchronously read files to data URLs for stable post images
                    mapped.forEach((item) => {
                      const reader = new FileReader();
                      reader.onload = () => {
                        const dataUrl = String(reader.result || "");
                        setSelectedImages((prev) =>
                          prev.map((p) =>
                            p.file === item.file ? { ...p, dataUrl } : p
                          )
                        );
                      };
                      reader.readAsDataURL(item.file);
                    });
                    // reset input so same file can be selected again
                    e.currentTarget.value = "";
                  }}
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2 rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-gray-100"
                >
                  <FaImage className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Photo</span>
                </button>
              </div>

              {/* Privacy Selector - button group with icons (mapped) */}
              <div className="flex items-center space-x-2">
                {(
                  [
                    { value: "public", label: "Public", Icon: FaGlobe },
                    { value: "friends", label: "Friends", Icon: FaUserFriends },
                    { value: "private", label: "Only me", Icon: FaLock },
                  ] as Array<{ value: string; label: string; Icon: IconType }>
                ).map((opt) => (
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

            {/* Image previews */}
            {selectedImages.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedImages.map((s, idx) => (
                  <div
                    key={s.url}
                    className="relative h-20 w-20 overflow-hidden rounded border"
                  >
                    <img
                      src={s.url}
                      alt={`preview-${idx}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        // remove this image
                        URL.revokeObjectURL(s.url);
                        setSelectedImages((prev) =>
                          prev.filter((p) => p.url !== s.url)
                        );
                      }}
                      className="absolute top-1 right-1 rounded-full bg-white/80 p-1 text-red-600 hover:bg-white"
                      aria-label="Remove image"
                    >
                      <FaTimes className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  // clear content and any selected images
                  setPostContent("");
                  setIsExpanded(false);
                  selectedImages.forEach((s) => URL.revokeObjectURL(s.url));
                  setSelectedImages([]);
                }}
                className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:border-red-200 hover:bg-red-50"
              >
                <span>Cancel</span>
              </button>

              <button
                type="submit"
                disabled={!postContent.trim()}
                className="flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span>Post</span>
              </button>
            </div>
          </div>
        )}

        {/* Simple Post Button (when not expanded) */}
        {!isExpanded && postContent && (
          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              className="flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
            >
              <FaPaperPlane className="h-4 w-4" />
              <span>Post</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreatePost;
