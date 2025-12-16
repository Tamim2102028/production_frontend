// User Types - Based on Backend Response
// Constants are in src/constants/*.ts (same as Backend)

import {
  USER_TYPES,
  GENDERS,
  RELIGIONS,
  TEACHER_RANKS,
  ACCOUNT_STATUS,
  FRIEND_REQUEST_POLICY,
  CONNECTION_VISIBILITY,
} from "../constants";

// ====================================
// ENUMS & CONSTANTS (derived from constants)
// ====================================

// App users - শুধু Student ও Teacher
// (ADMIN/OWNER/MODERATOR হলো internal management roles, app এ show হবে না)
export type UserType = (typeof USER_TYPES)["STUDENT" | "TEACHER"];
export type AccountStatus =
  (typeof ACCOUNT_STATUS)[keyof typeof ACCOUNT_STATUS];
export type Gender = (typeof GENDERS)[keyof typeof GENDERS];
export type Religion = (typeof RELIGIONS)[keyof typeof RELIGIONS];
export type TeacherRank = (typeof TEACHER_RANKS)[keyof typeof TEACHER_RANKS];

// Privacy Settings Enums
export type FriendRequestPolicy =
  (typeof FRIEND_REQUEST_POLICY)[keyof typeof FRIEND_REQUEST_POLICY];
export type ConnectionVisibility =
  (typeof CONNECTION_VISIBILITY)[keyof typeof CONNECTION_VISIBILITY];

// ====================================
// DEPARTMENT & INSTITUTION
// ====================================

export interface Department {
  _id: string;
  name: string;
  code: string;
}

export interface Institution {
  _id: string;
  name: string;
  logo: string;
}

// ====================================
// ACADEMIC INFO (Student vs Teacher)
// ====================================

// Common fields for both
interface BaseAcademicInfo {
  department?: string | Department;
}

// Student-specific fields
export interface StudentAcademicInfo extends BaseAcademicInfo {
  studentId?: string;
  session?: string;
  currentSemester?: number;
  section?: string;
  isCr?: boolean;
}

// Teacher-specific fields
export interface TeacherAcademicInfo extends BaseAcademicInfo {
  teacherId?: string;
  rank?: TeacherRank;
  officeHours?: {
    day: string;
    timeRange: string;
    room: string;
  }[];
}

// Combined type (based on userType)
export type AcademicInfo = StudentAcademicInfo & TeacherAcademicInfo;

// ====================================
// SOCIAL & PRIVACY
// ====================================

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  website?: string;
  facebook?: string;
}

export interface PrivacySettings {
  friendRequestPolicy: FriendRequestPolicy;
  connectionVisibility: ConnectionVisibility;
}

// ====================================
// USER MODEL
// ====================================

export interface User {
  _id: string;

  // Identity
  fullName: string;
  email: string;
  userName: string;
  phoneNumber?: string;

  // Profile
  avatar: string;
  coverImage?: string;
  bio?: string;
  gender?: Gender;
  religion?: Religion;

  // Social
  socialLinks?: SocialLinks;
  skills?: string[];
  interests?: string[];

  // Stats
  stats?: {
    postsCount: number;
    friendsCount: number;
    followersCount: number;
    followingCount: number;
    publicFilesCount: number;
  };

  // Friendship
  friendshipStatus?: string;

  // Institutional
  userType: UserType;
  institution?: string | Institution;
  institutionType?: string;
  academicInfo?: AcademicInfo;

  // Status & Settings
  accountStatus: AccountStatus;
  privacySettings?: PrivacySettings;
  isStudentEmail: boolean;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// Auth State
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isCheckingAuth: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface ApiError {
  statusCode: number;
  data: null;
  message: string;
  success: false;
  errors: string[];
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Login Types
export interface LoginCredentials {
  email?: string;
  userName?: string;
  password: string;
}

// Register Types
export interface RegisterData {
  fullName: string;
  email: string;
  userName: string;
  password: string;
  userType: UserType;
  avatar?: File;
  coverImage?: File;
}
