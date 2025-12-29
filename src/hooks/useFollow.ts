import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { followService } from "../services/utils/follow.service";
import type { ApiError } from "../types";
import type { AxiosError } from "axios";
import { FOLLOW_TARGET_MODELS } from "../constants";

export const useToggleFollow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      targetId,
      targetModel,
    }: {
      targetId: string;
      targetModel: (typeof FOLLOW_TARGET_MODELS)[keyof typeof FOLLOW_TARGET_MODELS];
    }) => followService.toggleFollow(targetId, targetModel),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["profile_header"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message || "Error from useToggleFollow");
    },
  });
};
