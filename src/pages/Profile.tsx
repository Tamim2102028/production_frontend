import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ProfileHeader,
  ProfilePosts,
  PublicFiles,
  ProfileTabs,
  CreateProfilePost,
} from "../components/Profile";
import PageLoader from "./Fallbacks/PageLoader";
import { useUser } from "../hooks/useAuth";
import { useProfileHeader } from "../hooks/useProfile";

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"posts" | "files">("posts");

  // Get current user from useUser hook
  const { user: currentUser } = useUser();

  // Determine which username to fetch
  const profileUsername = username || currentUser?.userName;

  // Check if viewing own profile
  const isOwnProfile = !username || username === currentUser?.userName;

  // Fetch profile header data using TanStack Query
  const {
    data: userData,
    isLoading,
    error,
  } = useProfileHeader(profileUsername);

  if (isLoading) {
    return <PageLoader />;
  }

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

  return (
    <>
      <ProfileHeader userData={userData} isOwnProfile={isOwnProfile} />

      <ProfileTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOwnProfile={isOwnProfile}
        userData={userData}
      />

      {/* Tab Content */}
      <div>
        {activeTab === "posts" && (
          <div className="space-y-3">
            {/* Create Post Section (Only for Own Profile) */}
            {isOwnProfile && currentUser?._id && (
              <div className="mb-4">
                <CreateProfilePost targetId={currentUser._id} />
              </div>
            )}
            <ProfilePosts
              username={userData.userName}
              isOwnProfile={isOwnProfile}
            />
          </div>
        )}

        {activeTab === "files" && (
          <div className="space-y-3">
            <PublicFiles
              username={userData.userName}
              isOwnProfile={isOwnProfile}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
