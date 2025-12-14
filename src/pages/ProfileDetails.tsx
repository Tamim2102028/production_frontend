import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaUniversity,
  FaBriefcase,
} from "react-icons/fa";
import { getUserById, getCurrentUserId } from "../services/userService";
import PageLoader from "./Fallbacks/PageLoader";
import type { UserData } from "../data/profile-data/userData";

type UserInfo = UserData | null;

const ProfileDetails: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Get current user ID
  const currentUserId = getCurrentUserId();

  // Check if viewing own profile
  const isOwnProfile = !userId || userId === currentUserId;

  // Get actual user ID (default to current user ID)
  const actualUserId = userId || currentUserId;

  // Get user data - always fetch from UserData service
  const userData: UserInfo = isOwnProfile
    ? getUserById(currentUserId)
    : getUserById(actualUserId);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [userData, userId, actualUserId, isOwnProfile, currentUserId]);

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
            onClick={() => navigate(-1)}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </>
    );
  }

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="rounded-lg border border-gray-300 p-2 text-gray-600 transition-colors hover:bg-gray-100"
        >
          <FaArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
      </div>

      {/* Profile Card */}
      <div className="rounded-lg border border-gray-300 bg-white p-8 shadow-sm">
        {/* Profile Header */}
        <div className="mb-8 flex items-start gap-6 border-b border-gray-200 pb-8">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <img
              src={userData.avatar}
              alt={userData.name}
              className="h-40 w-40 rounded-full border-4 border-blue-100 shadow-lg"
            />
          </div>

          {/* Basic Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {userData.name}
              </h2>
              <p className="flex items-center gap-2 text-lg text-gray-600">
                <FaUniversity className="h-4 w-4" />
                {userData.educationLevel === "UNIVERSITY" ? (
                  <span className="font-medium text-gray-800">
                    {userData.university?.name} -{" "}
                    {userData.university?.department}
                  </span>
                ) : (
                  <span className="font-medium text-gray-800">
                    {userData.college?.name}
                  </span>
                )}
              </p>
            </div>

            <div>
              <p className="text-gray-700">{userData.bio}</p>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Section 1: Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Contact Information
            </h3>

            {userData.email && (
              <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
                <FaEnvelope className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Email</p>
                  <p className="text-gray-900">{userData.email}</p>
                </div>
              </div>
            )}

            {userData.phone && (
              <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
                <FaPhone className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Phone</p>
                  <p className="text-gray-900">{userData.phone}</p>
                </div>
              </div>
            )}

            {userData.gender && (
              <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
                <FaUser className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Gender</p>
                  <p className="text-gray-900 capitalize">{userData.gender}</p>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Education Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Education Information
            </h3>

            {userData.educationLevel === "UNIVERSITY" && userData.university ? (
              <>
                <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
                  <FaUniversity className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      University
                    </p>
                    <p className="text-gray-900">{userData.university.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
                  <FaBriefcase className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Department
                    </p>
                    <p className="text-gray-900">
                      {userData.university.department}
                    </p>
                  </div>
                </div>

                {userData.university.section && (
                  <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
                    <FaUser className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Section
                      </p>
                      <p className="text-gray-900">
                        {userData.university.section}
                        {userData.university.subsection &&
                          `-${userData.university.subsection}`}
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : userData.educationLevel === "COLLEGE" && userData.college ? (
              <>
                <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
                  <FaUniversity className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">College</p>
                    <p className="text-gray-900">{userData.college.name}</p>
                  </div>
                </div>

                {userData.college.department && (
                  <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
                    <FaBriefcase className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Department
                      </p>
                      <p className="text-gray-900">
                        {userData.college.department}
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-600">
                No education information available
              </p>
            )}
          </div>

          {/* Section 3: Account Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Account Information
            </h3>

            <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
              <FaUser className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">User Type</p>
                <p className="text-gray-900 capitalize">
                  {Array.isArray(userData.userType)
                    ? userData.userType.join(", ")
                    : userData.userType}
                </p>
              </div>
            </div>

            {userData.id && (
              <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
                <FaUser className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">User ID</p>
                  <p className="text-sm break-all text-gray-900">
                    {userData.id}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileDetails;
