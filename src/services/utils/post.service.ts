import { POST_TARGET_MODELS } from "../../constants";
import api from "../../lib/axios";
import type { CreatePostRequest } from "../../types";

export const postService = {
  // Create Post
  createPost: async (reqData: CreatePostRequest) => {
    const response = await api.post("/posts", reqData);
    return response.data;
  },

  // Like / Unlike Post
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

  // Toggle Pin (Pin/Unpin Post)
  togglePin: async (postId: string, targetModel: string) => {
    let url = "";
    switch (targetModel) {
      case POST_TARGET_MODELS.USER:
        url = `/profile/posts/${postId}/pin`;
        break;
      case POST_TARGET_MODELS.GROUP:
        url = `/groups/posts/${postId}/pin`;
        break;
      case POST_TARGET_MODELS.DEPARTMENT:
        url = `/depts/posts/${postId}/pin`;
        break;
      case POST_TARGET_MODELS.INSTITUTION:
        url = `/institutions/posts/${postId}/pin`;
        break;
      case POST_TARGET_MODELS.CR_CORNER:
        url = `/cr-corner/posts/${postId}/pin`;
        break;
      case POST_TARGET_MODELS.ROOM:
        url = `/events/posts/${postId}/pin`;
        break;
      case POST_TARGET_MODELS.PAGE:
        url = `/events/posts/${postId}/pin`;
        break;
      default:
        throw new Error("Invalid target model for pinning");
    }

    const response = await api.post(url);
    return response.data;
  },
};
