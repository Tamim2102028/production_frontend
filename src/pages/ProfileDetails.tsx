import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { IconType } from "react-icons";
import {
  FaArrowLeft,
  FaUser,
  FaGraduationCap,
  FaBriefcase,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGlobe,
  FaLinkedin,
  FaGithub,
  FaFacebook,
  FaVenusMars,
  FaPray,
} from "react-icons/fa";
import { useUser } from "../hooks/useAuth";
import { useProfileHeader } from "../hooks/useProfile";
import PageLoader from "./Fallbacks/PageLoader";
import { USER_TYPES } from "../constants";
import type { Institution, Department } from "../types/user.types";

const ProfileDetails: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useUser();

  // Determine which username to fetch
  const profileUsername = username || currentUser?.userName;

  // Fetch profile data
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
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">User Not Found</h2>
          <p className="mt-2 text-gray-600">
            The user details you're looking for aren't available.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <FaArrowLeft /> Go Back
          </button>
        </div>
      </div>
    );
  }

  // Helpers for safe data access
  const getInstitutionName = (): string => {
    if (!userData.institution) return "";
    if (typeof userData.institution === "string") return userData.institution;
    return (userData.institution as Institution).name;
  };

  const getDepartmentName = (): string => {
    if (!userData.academicInfo?.department) return "";
    if (typeof userData.academicInfo.department === "string")
      return userData.academicInfo.department;
    return (userData.academicInfo.department as Department).name;
  };

  const InfoSection = ({
    title,
    icon: Icon,
    children,
  }: {
    title: string;
    icon: IconType;
    children: React.ReactNode;
  }) => (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3 border-b border-gray-100 pb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );

  const InfoItem = ({
    label,
    value,
    icon: ItemIcon,
    link,
  }: {
    label: string;
    value?: string | null;
    icon?: IconType;
    link?: string;
  }) => {
    if (!value) return null;

    return (
      <div className="flex items-start gap-3">
        {ItemIcon && <ItemIcon className="mt-1 h-4 w-4 text-gray-400" />}
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base text-blue-600 hover:underline"
            >
              {value}
            </a>
          ) : (
            <p className="text-base text-gray-900">{value}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header / Nav */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
          >
            <FaArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Full Profile</h1>
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-4xl px-4">
        {/* Basic Identity Card */}
        <div className="mb-6 flex flex-col items-center rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm md:flex-row md:text-left">
          <img
            src={userData.avatar}
            alt={userData.fullName}
            className="h-32 w-32 rounded-full border-4 border-white shadow-lg ring-2 ring-gray-100"
          />
          <div className="mt-4 md:mt-0 md:ml-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {userData.fullName}
            </h1>
            <p className="text-lg text-gray-600">@{userData.userName}</p>
            {userData.bio && (
              <p className="mt-3 max-w-xl text-gray-700">{userData.bio}</p>
            )}
            <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
              {userData.userType === USER_TYPES.STUDENT ? (
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                  Student
                </span>
              ) : (
                <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
                  Teacher
                </span>
              )}
              {userData.isStudentEmail && (
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                  Verified Student
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Academic Information */}
          <InfoSection title="Academic Info" icon={FaGraduationCap}>
            <InfoItem
              label="Institution"
              value={getInstitutionName()}
              icon={FaBriefcase}
            />
            <InfoItem
              label="Department"
              value={getDepartmentName()}
              icon={FaGraduationCap}
            />

            {userData.userType === USER_TYPES.STUDENT && (
              <>
                <InfoItem
                  label="Session"
                  value={userData.academicInfo?.session}
                />
                <InfoItem
                  label="Current Semester"
                  value={userData.academicInfo?.currentSemester?.toString()}
                />
                <InfoItem
                  label="Section"
                  value={userData.academicInfo?.section}
                />
                <InfoItem
                  label="Student ID"
                  value={userData.academicInfo?.studentId}
                />
              </>
            )}

            {userData.userType === USER_TYPES.TEACHER && (
              <>
                <InfoItem
                  label="Rank / Designation"
                  value={userData.academicInfo?.rank}
                />
                <InfoItem
                  label="Teacher ID"
                  value={userData.academicInfo?.teacherId}
                />
              </>
            )}
          </InfoSection>

          {/* Contact & Personal Info */}
          <div className="space-y-6">
            <InfoSection title="Contact Info" icon={FaEnvelope}>
              <InfoItem
                label="Email"
                value={userData.email}
                icon={FaEnvelope}
                link={`mailto:${userData.email}`}
              />
              <InfoItem
                label="Phone"
                value={userData.phoneNumber}
                icon={FaPhone}
                link={
                  userData.phoneNumber
                    ? `tel:${userData.phoneNumber}`
                    : undefined
                }
              />

              {/* Social Links */}
              <div className="mt-4 border-t border-gray-100 pt-4">
                <p className="mb-3 text-sm font-medium text-gray-500">
                  Social Profiles
                </p>
                <div className="flex flex-wrap gap-4">
                  {userData.socialLinks?.linkedin && (
                    <a
                      href={userData.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 hover:text-blue-800"
                    >
                      <FaLinkedin className="h-6 w-6" />
                    </a>
                  )}
                  {userData.socialLinks?.github && (
                    <a
                      href={userData.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-800 hover:text-black"
                    >
                      <FaGithub className="h-6 w-6" />
                    </a>
                  )}
                  {userData.socialLinks?.facebook && (
                    <a
                      href={userData.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <FaFacebook className="h-6 w-6" />
                    </a>
                  )}
                  {userData.socialLinks?.website && (
                    <a
                      href={userData.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <FaGlobe className="h-6 w-6" />
                    </a>
                  )}
                  {!userData.socialLinks?.linkedin &&
                    !userData.socialLinks?.github &&
                    !userData.socialLinks?.facebook &&
                    !userData.socialLinks?.website && (
                      <p className="text-sm text-gray-400 italic">
                        No social links added
                      </p>
                    )}
                </div>
              </div>
            </InfoSection>

            <InfoSection title="Personal Details" icon={FaUser}>
              <InfoItem
                label="Gender"
                value={userData.gender}
                icon={FaVenusMars}
              />
              <InfoItem
                label="Religion"
                value={userData.religion}
                icon={FaPray}
              />
              {/* Add more personal fields if available in backend response */}
            </InfoSection>
          </div>
        </div>

        {/* Skills & Interests */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <InfoSection title="Skills" icon={FaBriefcase}>
            {userData.skills && userData.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {userData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 italic">No skills added yet</p>
            )}
          </InfoSection>

          <InfoSection title="Interests" icon={FaMapMarkerAlt}>
            {userData.interests && userData.interests.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {userData.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="rounded-md bg-blue-50 px-3 py-1 text-sm text-blue-700"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 italic">No interests added yet</p>
            )}
          </InfoSection>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
