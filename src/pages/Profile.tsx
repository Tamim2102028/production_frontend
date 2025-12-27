import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  ProfileHeader,
  ProfilePosts,
  PublicFiles,
  ProfileTabs,
  CreateProfilePost,
  ProfileNotFound,
} from "../components/Profile";
import { useUser } from "../hooks/useAuth";
import { useProfileHeader } from "../hooks/useProfile";
import ProfileHeaderSkeleton from "../components/shared/skeletons/ProfileHeaderSkeleton";

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [activeTab, setActiveTab] = useState<"posts" | "files">("posts");

  const { user: currentUser } = useUser();
  // If no username is provided, default to current user's username
  const profileUsername = username || currentUser?.userName;
  // Check if viewing own profile
  const isOwnProfile = username === currentUser?.userName;

  const {
    data: userData,
    isLoading,
    error,
  } = useProfileHeader(profileUsername);

  if (isLoading) {
    return <ProfileHeaderSkeleton />;
  }

  if (error || !userData) {
    return <ProfileNotFound />;
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
                <CreateProfilePost currentUserId={currentUser._id} />
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
