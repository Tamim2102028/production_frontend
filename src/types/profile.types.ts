// Profile Types - For Profile Feature

import { PROFILE_RELATION_STATUS } from "../constants";
import type { User, Gender, SocialLinks } from "./user.types";

// ====================================
// FRIENDSHIP STATUS (from Backend constants)
// ====================================

/**
 * Profile relation status between currentUser and profile owner
 *
 * - SELF: নিজের প্রোফাইল → Edit Profile button
 * - FRIENDS: বন্ধু → Message / Unfriend buttons
 * - REQUEST_SENT: আমি পাঠিয়েছি → Cancel Request button
 * - REQUEST_RECEIVED: সে পাঠিয়েছে → Accept/Reject buttons
 * - BLOCKED: আমি ব্লক করেছি → Unblock button
 * - NONE: কোনো সম্পর্ক নেই → Add Friend button
 */
export type FriendshipStatus =
  (typeof PROFILE_RELATION_STATUS)[keyof typeof PROFILE_RELATION_STATUS];

// ====================================
// API RESPONSE TYPES
// ====================================

/**
 * GET /users/p/:username response
 * Backend returns user fields + friendshipStatus in flat structure
 * { ...user, friendshipStatus: "SELF" | "FRIENDS" | ... }
 */
export interface ProfileResponse extends User {
  friendshipStatus: FriendshipStatus;
}

// ====================================
// UPDATE PROFILE DATA TYPES
// ====================================

/**
 * PATCH /users/update-general request body
 * Only include fields that are being updated
 */
export interface UpdateGeneralData {
  fullName?: string;
  bio?: string;
  phoneNumber?: string;
  gender?: Gender;
  religion?: string;
  socialLinks?: SocialLinks;
  skills?: string[];
  interests?: string[];
}

/**
 * PATCH /users/update-academic request body
 * Student fields
 */
export interface UpdateStudentAcademicData {
  institution?: string; // ObjectId - only for non-verified users
  department?: string; // ObjectId - only for non-verified users
  session?: string;
  currentSemester?: number;
  section?: string;
  studentId?: string;
}

/**
 * PATCH /users/update-academic request body
 * Teacher fields
 */
export interface UpdateTeacherAcademicData {
  institution?: string; // ObjectId - only for non-verified users
  department?: string; // ObjectId - only for non-verified users
  teacherId?: string;
  rank?: string;
  officeHours?: {
    day: string;
    timeRange: string;
    room: string;
  }[];
}

// Combined academic update type
export type UpdateAcademicData =
  | UpdateStudentAcademicData
  | UpdateTeacherAcademicData;
