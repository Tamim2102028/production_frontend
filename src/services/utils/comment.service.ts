import { COMMENT_LIMIT, POST_TARGET_MODELS } from "../../constants";
import api from "../../lib/axios";
import type { CommentsResponse, AddCommentResponse } from "../../types";

export const commentService = {
  // Get comments for a post
  getPostComments: async (
    postId: string,
    targetModel: string,
    page: number = 1
  ) => {
    let routeSegment = "profile";
    if (targetModel === POST_TARGET_MODELS.GROUP) routeSegment = "groups";
    else if (targetModel === POST_TARGET_MODELS.DEPARTMENT)
      routeSegment = "depts";
    else if (targetModel === POST_TARGET_MODELS.INSTITUTION)
      routeSegment = "institutions";

    const response = await api.get<CommentsResponse>(
      `/${routeSegment}/posts/${postId}/comments`,
      {
        params: { page, limit: COMMENT_LIMIT },
      }
    );
    return response.data;
  },

  // Add a comment to a post
  addComment: async (postId: string, content: string, targetModel: string) => {
    let routeSegment = "profile";
    if (targetModel === POST_TARGET_MODELS.GROUP) routeSegment = "groups";
    else if (targetModel === POST_TARGET_MODELS.DEPARTMENT)
      routeSegment = "depts";
    else if (targetModel === POST_TARGET_MODELS.INSTITUTION)
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
  deleteComment: async (commentId: string, targetModel: string) => {
    let routeSegment = "profile";
    if (targetModel === POST_TARGET_MODELS.GROUP) routeSegment = "groups";
    else if (targetModel === POST_TARGET_MODELS.DEPARTMENT)
      routeSegment = "depts";
    else if (targetModel === POST_TARGET_MODELS.INSTITUTION)
      routeSegment = "institutions";

    const response = await api.delete(`/${routeSegment}/comments/${commentId}`);
    return response.data;
  },

  // Update a comment
  updateComment: async (
    commentId: string,
    content: string,
    targetModel: string
  ) => {
    let routeSegment = "profile";
    if (targetModel === POST_TARGET_MODELS.GROUP) routeSegment = "groups";
    else if (targetModel === POST_TARGET_MODELS.DEPARTMENT)
      routeSegment = "depts";
    else if (targetModel === POST_TARGET_MODELS.INSTITUTION)
      routeSegment = "institutions";

    const response = await api.patch(`/${routeSegment}/comments/${commentId}`, {
      content,
    });
    return response.data;
  },

  // Toggle like comment
  toggleLikeComment: async (commentId: string, targetModel: string) => {
    let routeSegment = "profile";
    if (targetModel === POST_TARGET_MODELS.GROUP) routeSegment = "groups";
    else if (targetModel === POST_TARGET_MODELS.DEPARTMENT)
      routeSegment = "depts";
    else if (targetModel === POST_TARGET_MODELS.INSTITUTION)
      routeSegment = "institutions";

    const response = await api.post(
      `/${routeSegment}/comments/${commentId}/like`
    );
    return response.data;
  },
};
