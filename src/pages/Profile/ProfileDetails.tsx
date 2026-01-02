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
  FaGlobe,
  FaLinkedin,
  FaGithub,
  FaFacebook,
  FaVenusMars,
  FaPray,
  FaIdCard,
  FaCalendarAlt,
  FaLayerGroup,
  FaUsers,
  FaClock,
  FaHeart,
  FaLightbulb,
  FaBuilding,
  FaStar,
  FaShieldAlt,
  FaUserCog,
} from "react-icons/fa";
import { useUser } from "../../hooks/useAuth";
import { useProfileDetails } from "../../hooks/useProfile";
import PageLoader from "../Fallbacks/PageLoader";
import { USER_TYPES } from "../../constants";
import type { Institution, Department } from "../../types";

const ProfileDetails: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useUser();

  const profileUsername = username || currentUser?.userName;

  const { data, isLoading, error } = useProfileDetails(profileUsername);

  const userData = data?.user;

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

  // Helper functions
  const getInstitutionName = (): string => {
    if (!userData.institution) return "";
    if (typeof userData.institution === "string") return userData.institution;
    return (userData.institution as Institution).name || "";
  };

  const getDepartmentName = (): string => {
    if (!userData.academicInfo?.department) return "";
    if (typeof userData.academicInfo.department === "string")
      return userData.academicInfo.department;
    return (userData.academicInfo.department as Department).name || "";
  };

  const formatDate = (date?: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Row component
  const InfoRow = ({
    label,
    value,
    icon: Icon,
    link,
  }: {
    label: string;
    value?: string | number | boolean | null;
    icon: IconType;
    link?: string;
  }) => {
    let displayValue = "";
    if (typeof value === "boolean") {
      displayValue = value ? "Yes" : "No";
    } else if (value !== null && value !== undefined) {
      displayValue = value.toString().trim();
    }
    const hasValue = displayValue.length > 0;

    return (
      <div className="flex items-center justify-between border-b border-gray-100 py-3 last:border-0">
        <div className="flex items-center gap-3 text-gray-500">
          <Icon className="h-4 w-4" />
          <span className="text-sm">{label}</span>
        </div>
        {hasValue ? (
          link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="max-w-[200px] truncate text-sm font-medium text-blue-600 hover:underline"
            >
              {displayValue}
            </a>
          ) : (
            <span className="text-sm font-medium text-gray-900">
              {displayValue}
            </span>
          )
        ) : (
          <span className="text-sm text-gray-400 italic">Not added</span>
        )}
      </div>
    );
  };

  // Section header
  const SectionHeader = ({
    title,
    icon: Icon,
  }: {
    title: string;
    icon: IconType;
  }) => (
    <div className="mb-1 flex items-center gap-2 px-1 pt-4 pb-2">
      <Icon className="h-4 w-4 text-blue-600" />
      <h3 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">
        {title}
      </h3>
    </div>
  );

  const isStudent = userData.userType === USER_TYPES.STUDENT;
  const isTeacher = userData.userType === USER_TYPES.TEACHER;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-2xl items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
          >
            <FaArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              {userData.fullName}
            </h1>
            <p className="text-xs text-gray-500">Profile Details</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-4 max-w-2xl px-4">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="p-4">
            {/* === IDENTITY === */}
            <SectionHeader title="Identity" icon={FaUser} />
            <div className="rounded-lg bg-gray-50 px-4">
              <InfoRow
                label="Full Name"
                value={userData.fullName}
                icon={FaUser}
              />
              <InfoRow
                label="Username"
                value={userData.userName ? `@${userData.userName}` : ""}
                icon={FaIdCard}
              />
              <InfoRow
                label="Email"
                value={userData.email}
                icon={FaEnvelope}
                link={userData.email ? `mailto:${userData.email}` : undefined}
              />
              <InfoRow
                label="Phone Number"
                value={userData.phoneNumber}
                icon={FaPhone}
                link={
                  userData.phoneNumber
                    ? `tel:${userData.phoneNumber}`
                    : undefined
                }
              />
            </div>

            {/* === PROFILE === */}
            <SectionHeader title="Profile" icon={FaUserCog} />
            <div className="rounded-lg bg-gray-50 px-4">
              <InfoRow label="Bio" value={userData.bio} icon={FaUser} />
              <InfoRow
                label="Gender"
                value={userData.gender}
                icon={FaVenusMars}
              />
              <InfoRow
                label="Religion"
                value={userData.religion}
                icon={FaPray}
              />
            </div>

            {/* === SOCIAL LINKS === */}
            <SectionHeader title="Social Links" icon={FaGlobe} />
            <div className="rounded-lg bg-gray-50 px-4">
              <InfoRow
                label="LinkedIn"
                value={userData.socialLinks?.linkedin}
                icon={FaLinkedin}
                link={userData.socialLinks?.linkedin}
              />
              <InfoRow
                label="GitHub"
                value={userData.socialLinks?.github}
                icon={FaGithub}
                link={userData.socialLinks?.github}
              />
              <InfoRow
                label="Facebook"
                value={userData.socialLinks?.facebook}
                icon={FaFacebook}
                link={userData.socialLinks?.facebook}
              />
              <InfoRow
                label="Website"
                value={userData.socialLinks?.website}
                icon={FaGlobe}
                link={userData.socialLinks?.website}
              />
            </div>

            {/* === SKILLS === */}
            <SectionHeader title="Skills" icon={FaLightbulb} />
            <div className="rounded-lg bg-gray-50 p-4">
              {userData.skills && userData.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {userData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-gray-400 italic">
                  Not added
                </p>
              )}
            </div>

            {/* === INTERESTS === */}
            <SectionHeader title="Interests" icon={FaHeart} />
            <div className="rounded-lg bg-gray-50 p-4">
              {userData.interests && userData.interests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {userData.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-700"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-gray-400 italic">
                  Not added
                </p>
              )}
            </div>

            {/* === INSTITUTION === */}
            <SectionHeader title="Institution" icon={FaBuilding} />
            <div className="rounded-lg bg-gray-50 px-4">
              <InfoRow
                label="User Type"
                value={userData.userType}
                icon={FaUser}
              />
              <InfoRow
                label="Institution"
                value={getInstitutionName()}
                icon={FaBuilding}
              />
              <InfoRow
                label="Institution Type"
                value={userData.institutionType}
                icon={FaLayerGroup}
              />
            </div>

            {/* === ACADEMIC INFO === */}
            <SectionHeader
              title="Academic Information"
              icon={FaGraduationCap}
            />
            <div className="rounded-lg bg-gray-50 px-4">
              <InfoRow
                label="Department"
                value={getDepartmentName()}
                icon={FaGraduationCap}
              />

              {/* Student specific fields */}
              {isStudent && (
                <>
                  <InfoRow
                    label="Student ID"
                    value={userData.academicInfo?.studentId}
                    icon={FaIdCard}
                  />
                  <InfoRow
                    label="Session"
                    value={userData.academicInfo?.session}
                    icon={FaCalendarAlt}
                  />
                  <InfoRow
                    label="Current Semester"
                    value={userData.academicInfo?.currentSemester}
                    icon={FaLayerGroup}
                  />
                  <InfoRow
                    label="Section"
                    value={userData.academicInfo?.section}
                    icon={FaUsers}
                  />
                  <InfoRow
                    label="Is CR"
                    value={userData.academicInfo?.isCr}
                    icon={FaStar}
                  />
                </>
              )}

              {/* Teacher specific fields */}
              {isTeacher && (
                <>
                  <InfoRow
                    label="Teacher ID"
                    value={userData.academicInfo?.teacherId}
                    icon={FaIdCard}
                  />
                  <InfoRow
                    label="Rank"
                    value={userData.academicInfo?.rank}
                    icon={FaBriefcase}
                  />
                </>
              )}
            </div>

            {/* === OFFICE HOURS (Teacher only) === */}
            {isTeacher && (
              <>
                <SectionHeader title="Office Hours" icon={FaClock} />
                <div className="rounded-lg bg-gray-50 p-4">
                  {userData.academicInfo?.officeHours &&
                  userData.academicInfo.officeHours.length > 0 ? (
                    <div className="space-y-2">
                      {userData.academicInfo.officeHours.map((oh, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 rounded-lg bg-white p-2 text-sm"
                        >
                          <FaClock className="h-4 w-4 text-gray-400" />
                          <span className="font-medium text-gray-700">
                            {oh.day}
                          </span>
                          <span className="text-gray-500">{oh.timeRange}</span>
                          {oh.room && (
                            <span className="text-gray-400">
                              • Room: {oh.room}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-sm text-gray-400 italic">
                      Not added
                    </p>
                  )}
                </div>
              </>
            )}

            {/* === ACCOUNT STATUS === */}
            <SectionHeader title="Account Status" icon={FaShieldAlt} />
            <div className="rounded-lg bg-gray-50 px-4">
              <InfoRow
                label="Account Status"
                value={userData.accountStatus}
                icon={FaShieldAlt}
              />
              <InfoRow
                label="Verified Student Email"
                value={userData.isStudentEmail}
                icon={FaStar}
              />
              <InfoRow
                label="Member Since"
                value={formatDate(userData.createdAt)}
                icon={FaCalendarAlt}
              />
              <InfoRow
                label="Last Updated"
                value={formatDate(userData.updatedAt)}
                icon={FaClock}
              />
            </div>

            {/* === PRIVACY SETTINGS === */}
            <SectionHeader title="Privacy Settings" icon={FaUserCog} />
            <div className="rounded-lg bg-gray-50 px-4">
              <InfoRow
                label="Friend Request Policy"
                value={userData.privacySettings?.friendRequestPolicy}
                icon={FaUsers}
              />
              <InfoRow
                label="Connection Visibility"
                value={userData.privacySettings?.connectionVisibility}
                icon={FaShieldAlt}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
