import { POST_LIMIT, POST_TARGET_MODELS } from "../constants";
import api from "../lib/axios";
import type {
  CreatePostRequest,
  FeedResponse,
  ProfilePostsResponse,
} from "../types";

export const postService = {
  // Get News Feed
  getNewsFeed: async (params: {
    page: number;
    limit: number;
    type?: string;
  }) => {
    const response = await api.get<FeedResponse>("/posts/feed", { params });
    return response.data;
  },

  // Create Post
  createPost: async (reqData: CreatePostRequest) => {
    let url = "/profile/post"; // Default to User Profile
    const { postOnModel, postOnId } = reqData;

    switch (postOnModel) {
      case POST_TARGET_MODELS.USER:
        url = "/profile/post";
        break;
      case POST_TARGET_MODELS.GROUP:
        url = `/groups/${postOnId}/post`;
        break;
      case POST_TARGET_MODELS.DEPARTMENT:
        url = `/depts/${postOnId}/post`;
        break;
      case POST_TARGET_MODELS.INSTITUTION:
        url = `/institutions/${postOnId}/post`;
        break;
      case POST_TARGET_MODELS.CR_CORNER:
        url = `/cr-corner/post`;
        break;
    }

    const response = await api.post(url, reqData);
    return response.data;
  },

  // Like Post
  togglePostLike: async (
    postId: string,
    targetModel: string = POST_TARGET_MODELS.USER
  ) => {
    let routeSegment = "profile";
    if (targetModel === POST_TARGET_MODELS.GROUP) routeSegment = "groups";
    else if (targetModel === POST_TARGET_MODELS.DEPARTMENT)
      routeSegment = "depts";
    else if (targetModel === POST_TARGET_MODELS.INSTITUTION)
      routeSegment = "institutions";

    const { data } = await api.post(`/${routeSegment}/posts/${postId}/like`);
    return data;
  },

  // Get Profile Posts
  getProfilePosts: async (username: string, page: number) => {
    const response = await api.get<ProfilePostsResponse>(
      `/profile/${username}/posts`,
      { params: { page, limit: POST_LIMIT } }
    );
    return response.data;
  },

  // Delete Post
  deletePost: async (
    postId: string,
    targetModel: string = POST_TARGET_MODELS.USER
  ) => {
    let routeSegment = "profile";
    if (targetModel === POST_TARGET_MODELS.GROUP) routeSegment = "groups";
    else if (targetModel === POST_TARGET_MODELS.DEPARTMENT)
      routeSegment = "depts";
    else if (targetModel === POST_TARGET_MODELS.INSTITUTION)
      routeSegment = "institutions";

    const response = await api.delete(`/${routeSegment}/posts/${postId}`);
    return response.data;
  },

  // Update Post
  updatePost: async (
    postId: string,
    data: { content: string; tags?: string[]; visibility?: string },
    targetModel: string = POST_TARGET_MODELS.USER
  ) => {
    let routeSegment = "profile";
    if (targetModel === POST_TARGET_MODELS.GROUP) routeSegment = "groups";
    else if (targetModel === POST_TARGET_MODELS.DEPARTMENT)
      routeSegment = "depts";
    else if (targetModel === POST_TARGET_MODELS.INSTITUTION)
      routeSegment = "institutions";

    const response = await api.patch(`/${routeSegment}/posts/${postId}`, data);
    return response.data;
  },

  // Toggle Read Status
  toggleReadStatus: async (
    postId: string,
    targetModel: string = POST_TARGET_MODELS.USER
  ) => {
    let routeSegment = "profile";
    if (targetModel === POST_TARGET_MODELS.GROUP) routeSegment = "groups";
    else if (targetModel === POST_TARGET_MODELS.DEPARTMENT)
      routeSegment = "depts";
    else if (targetModel === POST_TARGET_MODELS.INSTITUTION)
      routeSegment = "institutions";

    const response = await api.post(`/${routeSegment}/posts/${postId}/read`);
    return response.data;
  },

  // Toggle Bookmark (Save Post)
  toggleBookmark: async (postId: string) => {
    const response = await api.post(`/posts/${postId}/toggle-bookmark`);
    return response.data;
  },

  // Toggle Pin (groups only)
  togglePin: async (postId: string, targetModel: string) => {
    let routeSegment = "";
    if (targetModel === POST_TARGET_MODELS.USER) {
      routeSegment = "profile";
    } else if (targetModel === POST_TARGET_MODELS.GROUP)
      routeSegment = "groups";
    else if (targetModel === POST_TARGET_MODELS.DEPARTMENT)
      routeSegment = "depts";
    else if (targetModel === POST_TARGET_MODELS.INSTITUTION)
      routeSegment = "institutions";

    const response = await api.post(`/${routeSegment}/posts/${postId}/pin`);
    return response.data;
  },
};
