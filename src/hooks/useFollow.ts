import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { followApi } from "../services/follow.service";
import type { ApiError } from "../types";
import type { AxiosError } from "axios";
import { FOLLOW_TARGET_MODELS } from "../constants";

export const useToggleFollow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      targetId,
      targetModel = FOLLOW_TARGET_MODELS.USER,
    }: {
      targetId: string;
      targetModel?: (typeof FOLLOW_TARGET_MODELS)[keyof typeof FOLLOW_TARGET_MODELS];
    }) => followApi.toggleFollow(targetId, targetModel),
    onSuccess: (data) => {
      const isFollowing = data.data.isFollowing;
      toast.success(
        isFollowing ? "Followed successfully" : "Unfollowed successfully"
      );
      queryClient.invalidateQueries({ queryKey: ["profile_header"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.message || "Failed to follow user");
    },
  });
};
