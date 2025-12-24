import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { followApi } from "../services/follow.service";
import type { ApiError } from "../types/user.types";
import type { AxiosError } from "axios";

export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => followApi.followUser(userId),
    onSuccess: () => {
      toast.success("Followed successfully");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.message || "Failed to follow user");
    },
  });
};

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => followApi.unfollowUser(userId),
    onSuccess: () => {
      toast.info("Unfollowed successfully");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.message || "Failed to unfollow user");
    },
  });
};
