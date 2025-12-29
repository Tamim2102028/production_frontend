import api from "../lib/axios";
import type {
  User,
  ApiResponse,
  UpdateGeneralData,
  UpdateAcademicData,
  ProfileHeaderData,
} from "../types";

export const profileService = {
  // Get Profile by Username
  getProfile: async (
    username: string
  ): Promise<ApiResponse<ProfileHeaderData>> => {
    const response = await api.get<ApiResponse<ProfileHeaderData>>(
      `/users/p/${username}`
    );
    return response.data;
  },

  // Get Profile Details by Username
  getProfileDetails: async (username: string): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>(
      `/users/details/${username}`
    );
    return response.data;
  },

  // Update General Info
  updateGeneral: async (
    data: UpdateGeneralData
  ): Promise<ApiResponse<User>> => {
    const response = await api.patch<ApiResponse<User>>(
      "/users/update-general",
      data
    );
    return response.data;
  },

  // Update Academic Info
  updateAcademic: async (
    data: UpdateAcademicData
  ): Promise<ApiResponse<User>> => {
    const response = await api.patch<ApiResponse<User>>(
      "/users/update-academic",
      data
    );
    return response.data;
  },

  // Update Avatar Image
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

  // Update Cover Image
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

  // Change Password
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

  // Get Profile Posts
  getProfilePosts: async (username: string, page: number) => {
    const response = await api.get(`/profile/${username}/posts`, {
      params: { page, limit: 10 },
    });
    return response.data;
  },
};

export default profileService;
