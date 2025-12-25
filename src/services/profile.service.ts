import api from "../lib/axios";
import type { ApiResponse, User } from "../types/user.types";
import type {
  UpdateGeneralData,
  UpdateAcademicData,
} from "../types/profile.types";

/**
 * ====================================
 * PROFILE API SERVICE
 * ====================================
 *
 * Profile related সব API calls এখানে।
 *
 * APIs:
 * - getProfile: GET /users/p/:username → যেকোনো user এর profile + friendshipStatus
 * - updateGeneral: PATCH /users/update-general → Name, Bio, Phone, etc.
 * - updateAcademic: PATCH /users/update-academic → Session, Section, Rank, etc.
 * - updateAvatar: PATCH /users/avatar → Avatar image upload
 * - updateCoverImage: PATCH /users/cover-image → Cover image upload
 * - changePassword: POST /users/change-password → Password change
 */

export const profileApi = {
  /**
   * Get user profile by username
   *
   * @param username - User's unique username
   * @returns User profile with profile_relation_status
   *
   * profile_relation_status:
   * - SELF: নিজের প্রোফাইল
   * - FRIEND: বন্ধু
   * - REQUEST_SENT: আমি request পাঠিয়েছি
   * - REQUEST_RECEIVED: সে request পাঠিয়েছে
   * - BLOCKED: ব্লক করা
   * - NOT_FRIENDS: কোনো relation নেই
   */
  getProfile: async (username: string): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>(`/users/p/${username}`);
    return response.data;
  },

  /**
   * Get user details by username (Lightweight)
   *
   * @param username - User's unique username
   * @returns User object without calculated stats/relations
   */
  getProfileDetails: async (username: string): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>(`/users/details/${username}`);
    return response.data;
  },

  /**
   * Update general profile info
   *
   * @param data - { fullName?, bio?, phoneNumber?, gender?, socialLinks?, skills?, interests? }
   * @returns Updated user object
   */
  updateGeneral: async (
    data: UpdateGeneralData
  ): Promise<ApiResponse<User>> => {
    const response = await api.patch<ApiResponse<User>>(
      "/users/update-general",
      data
    );
    return response.data;
  },

  /**
   * Update academic info
   *
   * @param data - Student: { session?, section?, currentSemester? }
   *               Teacher: { rank?, officeHours? }
   * @returns Updated user object
   */
  updateAcademic: async (
    data: UpdateAcademicData
  ): Promise<ApiResponse<User>> => {
    const response = await api.patch<ApiResponse<User>>(
      "/users/update-academic",
      data
    );
    return response.data;
  },

  /**
   * Update avatar image
   *
   * @param formData - FormData with 'avatar' file
   * @returns Updated user with new avatar URL
   */
  updateAvatar: async (formData: FormData): Promise<ApiResponse<User>> => {
    const response = await api.patch<ApiResponse<User>>(
      "/users/avatar",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  /**
   * Update cover image
   *
   * @param formData - FormData with 'coverImage' file
   * @returns Updated user with new cover image URL
   */
  updateCoverImage: async (formData: FormData): Promise<ApiResponse<User>> => {
    const response = await api.patch<ApiResponse<User>>(
      "/users/cover-image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  /**
   * Change password
   *
   * @param data - { oldPassword, newPassword }
   * @returns Success message
   */
  changePassword: async (data: {
    oldPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<null>> => {
    const response = await api.post<ApiResponse<null>>(
      "/users/change-password",
      data
    );
    return response.data;
  },
};

export default profileApi;
