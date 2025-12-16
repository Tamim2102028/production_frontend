import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaFolder, FaFileAlt, FaBookmark, FaUserFriends } from "react-icons/fa";
import {
  ProfileHeader,
  ProfilePosts,
  PublicFiles,
} from "../components/Profile";
import PageLoader from "./Fallbacks/PageLoader";
import { DEFAULT_AVATAR_MD } from "../constants/images";
import { PROFILE_RELATION_STATUS } from "../constants";
import { useUser } from "../hooks/useAuth";
import { useProfile } from "../hooks/useProfile";
import type { FriendshipStatus } from "../types/profile.types";

// TODO: Define proper types when Posts API is connected
interface Post {
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
  privacy: string;
  tags?: string[];
}

interface PublicFileItem {
  fileId: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  downloads: number;
  views: number;
}

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"posts" | "files">("posts");

  // Get current user from useUser hook
  const { user: currentUser } = useUser();

  // Determine which username to fetch
  // If no param, use current user's username (own profile)
  const profileUsername = username || currentUser?.userName;

  // Check if viewing own profile
  const isOwnProfile = !username || username === currentUser?.userName;

  // Fetch profile data using TanStack Query
  const { data: profileData, isLoading, error } = useProfile(profileUsername);

  // profileData IS the user with friendshipStatus (flat structure from Backend)
  const userData = profileData;
  const friendshipStatus: FriendshipStatus =
    (profileData?.friendshipStatus as FriendshipStatus) ||
    PROFILE_RELATION_STATUS.NONE;

  // TODO: Fetch user's posts from API
  const userPosts: Post[] = [];

  // TODO: Fetch user's public folders from API
  const userPublicFolders: PublicFileItem[] = [];

  // Loading state
  if (isLoading) {
    return <PageLoader />;
  }

  // Error or user not found
  if (error || !userData) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">User Not Found</h2>
        <p className="mt-2 text-gray-600">
          The user you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Go Home
        </button>
      </div>
    );
  }

  const handleEditProfile = () => {
    navigate("/profile/edit");
  };

  const handleViewDetails = () => {
    if (isOwnProfile) {
      navigate("/profile/details");
    } else {
      navigate(`/profile/${userData.userName}/details`);
    }
  };

  return (
    <>
      <ProfileHeader
        userData={userData}
        isOwnProfile={isOwnProfile}
        friendshipStatus={friendshipStatus}
        onEditProfile={handleEditProfile}
        onViewDetails={handleViewDetails}
      />

      {/* Navigation Tabs */}
      <div className="rounded-t-lg border-b border-gray-200 bg-white">
        <nav className="flex justify-evenly" aria-label="Profile sections">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex items-center border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
              activeTab === "posts"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:border-black hover:text-black"
            }`}
          >
            <FaFileAlt className="mr-2 inline h-4 w-4" />
            <span>Posts</span> ({userPosts.length})
          </button>

          {/* Public Files tab - always visible */}
          <button
            onClick={() => setActiveTab("files")}
            className={`flex items-center border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
              activeTab === "files"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:border-black hover:text-black"
            }`}
          >
            <FaFolder className="mr-2 inline h-4 w-4" />
            <span>Public Files</span> ({userPublicFolders.length})
          </button>

          {/* Friends button moved from main nav into profile tabs (navigates to friends page) */}
          {isOwnProfile && (
            <button
              onClick={() => navigate("/friends")}
              className={`flex items-center px-1 py-4 text-sm font-medium text-gray-500 transition-colors hover:text-black`}
            >
              <FaUserFriends className="mr-2 inline h-4 w-4" />
              <span>Friends</span>
            </button>
          )}

          {/* Only show Saved button for own profile */}
          {isOwnProfile && (
            <button
              onClick={() => navigate("/profile/saved")}
              className={`flex items-center px-1 py-4 text-sm font-medium text-gray-500 transition-colors hover:text-black`}
            >
              <FaBookmark className="mr-2 inline h-4 w-4" />
              <span>Saved</span>
            </button>
          )}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "posts" && (
          <div className="space-y-3">
            <ProfilePosts
              posts={userPosts}
              isOwnProfile={isOwnProfile}
              userData={{
                name: userData.fullName,
                username: userData.userName,
                avatar: userData.avatar || DEFAULT_AVATAR_MD,
              }}
            />
          </div>
        )}

        {activeTab === "files" && (
          <div className="space-y-3">
            <PublicFiles
              publicFolders={userPublicFolders}
              userName={userData.fullName}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
