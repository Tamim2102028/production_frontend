import { POST_TARGET_MODELS } from "../constants";
import api from "../lib/axios";
import type { CommentsResponse, AddCommentResponse } from "../types";

export const commentService = {
  // Get comments for a post
  getPostComments: async (
    postId: string,
    context: string = POST_TARGET_MODELS.USER,
    page = 1,
    limit = 10
  ) => {
    let routeSegment = "profile";
    if (context === POST_TARGET_MODELS.GROUP) routeSegment = "groups";
    else if (context === POST_TARGET_MODELS.DEPARTMENT) routeSegment = "depts";
    else if (context === POST_TARGET_MODELS.INSTITUTION)
      routeSegment = "institutions";

    const response = await api.get<CommentsResponse>(
      `/${routeSegment}/posts/${postId}/comments`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  // Add a comment to a post
  addComment: async (
    postId: string,
    content: string,
    context: string = POST_TARGET_MODELS.USER
  ) => {
    let routeSegment = "profile";
    if (context === POST_TARGET_MODELS.GROUP) routeSegment = "groups";
    else if (context === POST_TARGET_MODELS.DEPARTMENT) routeSegment = "depts";
    else if (context === POST_TARGET_MODELS.INSTITUTION)
      routeSegment = "institutions";

    const response = await api.post<AddCommentResponse>(
      `/${routeSegment}/posts/${postId}/comments`,
      {
        content,
      }
    );
    return response.data;
  },

  // Delete a comment
  deleteComment: async (
    commentId: string,
    context: string = POST_TARGET_MODELS.USER
  ) => {
    let routeSegment = "profile";
    if (context === POST_TARGET_MODELS.GROUP) routeSegment = "groups";
    else if (context === POST_TARGET_MODELS.DEPARTMENT) routeSegment = "depts";
    else if (context === POST_TARGET_MODELS.INSTITUTION)
      routeSegment = "institutions";

    const response = await api.delete(`/${routeSegment}/comments/${commentId}`);
    return response.data;
  },

  // Update a comment
  updateComment: async (
    commentId: string,
    content: string,
    context: string = POST_TARGET_MODELS.USER
  ) => {
    let routeSegment = "profile";
    if (context === POST_TARGET_MODELS.GROUP) routeSegment = "groups";
    else if (context === POST_TARGET_MODELS.DEPARTMENT) routeSegment = "depts";
    else if (context === POST_TARGET_MODELS.INSTITUTION)
      routeSegment = "institutions";

    const response = await api.patch(`/${routeSegment}/comments/${commentId}`, {
      content,
    });
    return response.data;
  },

  // Toggle like comment
  toggleLikeComment: async (
    commentId: string,
    context: string = POST_TARGET_MODELS.USER
  ) => {
    let routeSegment = "profile";
    if (context === POST_TARGET_MODELS.GROUP) routeSegment = "groups";
    else if (context === POST_TARGET_MODELS.DEPARTMENT) routeSegment = "depts";
    else if (context === POST_TARGET_MODELS.INSTITUTION)
      routeSegment = "institutions";

    const response = await api.post(
      `/${routeSegment}/comments/${commentId}/like`
    );
    return response.data;
  },
};
