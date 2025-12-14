import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaFolder, FaFileAlt, FaBookmark, FaUserFriends } from "react-icons/fa";
// Use posts from Redux store as single source-of-truth
import { getUserById, getCurrentUserId } from "../services/userService";
import { getPublicFoldersByUserId } from "../data/publicFilesData";
import {
  ProfileHeader,
  ProfilePosts,
  PublicFiles,
} from "../components/Profile";
import PageLoader from "./Fallbacks/PageLoader";
import { useAppSelector } from "../store/hooks";
import { selectRelationshipStatus } from "../store/slices/friendsSlice";

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"posts" | "files">("posts");
  const [isLoading, setIsLoading] = useState(true);
  const profileData = useAppSelector((state) => state.profile);

  // Get current user ID
  const currentUserId = getCurrentUserId();

  // Check if viewing own profile
  const isOwnProfile = !userId || userId === currentUserId;

  // Get actual user ID (default to current user ID)
  const actualUserId = userId || currentUserId;

  // Get user data - use Redux state for own profile, userData for others
  const userData = isOwnProfile ? profileData : getUserById(actualUserId);

  // Determine relationship status between current user and the profile being viewed
  const relationship = useAppSelector((state) =>
    selectRelationshipStatus(state, currentUserId, actualUserId)
  );

  // Get user's posts from Redux (so newly created posts appear)
  const allPosts = useAppSelector((state) => state.posts.posts);
  const userPosts = allPosts.filter((p) => p.userId === actualUserId);

  // Get user's public folders
  const userPublicFolders = getPublicFoldersByUserId(actualUserId);

  useEffect(() => {
    // Set loading to false after component mounts
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [
    userData,
    userId,
    actualUserId,
    isOwnProfile,
    currentUserId,
    userPosts.length,
    userPublicFolders.length,
  ]);

  // If user not found, show error
  if (!userData) {
    return (
      <>
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
      </>
    );
  }

  const handleEditProfile = () => {
    navigate("/profile/edit");
  };

  const handleViewDetails = () => {
    if (isOwnProfile) {
      navigate("/profile/details");
    } else {
      navigate(`/profile/${actualUserId}/details`);
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <ProfileHeader
        userData={userData}
        isOwnProfile={isOwnProfile}
        actualUserId={actualUserId}
        relationship={relationship}
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

          {/* Only show Public Files tab if viewing someone else's profile or if current user has public folders */}
          {(!isOwnProfile || userPublicFolders.length > 0) && (
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
          )}

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
                name: userData?.name || "User",
                username: userData?.username || "username",
                avatar: userData?.avatar || "https://via.placeholder.com/40",
              }}
            />
          </div>
        )}

        {activeTab === "files" && (
          <div className="space-y-3">
            <PublicFiles
              publicFolders={userPublicFolders}
              userName={userData.name}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
