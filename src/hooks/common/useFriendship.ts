import { useMutation, useQueryClient } from "@tanstack/react-query";
import { friendService } from "../../services/friendship.service";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import type { ApiError } from "../../types";

// Helper to invalidate all friendship-related queries
const invalidateAllFriendshipQueries = (
  queryClient: ReturnType<typeof useQueryClient>
) => {
  // Profile related
  queryClient.invalidateQueries({ queryKey: ["profileHeader"] });

  // Friend page related
  queryClient.invalidateQueries({ queryKey: ["friends"] });
  queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
  queryClient.invalidateQueries({ queryKey: ["sentRequests"] });
  queryClient.invalidateQueries({ queryKey: ["friendSuggestions"] });

  // Group members - all groups (marks stale, fetches only when active)
  queryClient.invalidateQueries({ queryKey: ["groupMembers"] });
};

// 1. Send Friend Request
export const useSendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) =>
      friendService.sendRequest(userId),
    onSuccess: (response) => {
      toast.success(response.message);
      invalidateAllFriendshipQueries(queryClient);
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

// 2. Accept Friend Request
export const useAcceptRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requesterId }: { requesterId: string }) =>
      friendService.acceptRequest(requesterId),
    onSuccess: (response) => {
      toast.success(response.message);
      invalidateAllFriendshipQueries(queryClient);
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

// 3. Reject Friend Request
export const useRejectRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requesterId }: { requesterId: string }) =>
      friendService.rejectRequest(requesterId),
    onSuccess: (response) => {
      toast.info(response.message);
      invalidateAllFriendshipQueries(queryClient);
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

// 4. Cancel Sent Request
export const useCancelRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ recipientId }: { recipientId: string }) =>
      friendService.cancelRequest(recipientId),
    onSuccess: (response) => {
      toast.info(response.message);
      invalidateAllFriendshipQueries(queryClient);
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

// 5. Unfriend User
export const useUnfriend = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ friendId }: { friendId: string }) =>
      friendService.unfriend(friendId),
    onSuccess: (response) => {
      toast.info(response.message);
      invalidateAllFriendshipQueries(queryClient);
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

// 6. Block User
export const useBlock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) => friendService.block(userId),
    onSuccess: (response) => {
      toast.success(response.message);
      invalidateAllFriendshipQueries(queryClient);
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

// 7. Unblock User
export const useUnblock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) =>
      friendService.unblock(userId),
    onSuccess: (response) => {
      toast.success(response.message);
      invalidateAllFriendshipQueries(queryClient);
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};
