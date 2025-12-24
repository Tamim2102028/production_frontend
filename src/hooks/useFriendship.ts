import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { friendshipApi } from "../services/friendship.service";
import type { ApiError } from "../types/user.types";
import type { AxiosError } from "axios";

/**
 * ====================================
 * FRIENDSHIP HOOKS
 * ====================================
 */

// 1. Send Friend Request
export const useSendFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => friendshipApi.sendRequest(userId),
    onSuccess: () => {
      toast.success("Friend request sent!");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(
        error.response?.data?.message || "Failed to send friend request"
      );
    },
  });
};

// 2. Accept Friend Request
export const useAcceptFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requesterId: string) =>
      friendshipApi.acceptRequest(requesterId),
    onSuccess: () => {
      toast.success("Friend request accepted!");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(
        error.response?.data?.message || "Failed to accept friend request"
      );
    },
  });
};

// 3. Reject Friend Request
export const useRejectFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requesterId: string) =>
      friendshipApi.rejectRequest(requesterId),
    onSuccess: () => {
      toast.info("Friend request rejected");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(
        error.response?.data?.message || "Failed to reject friend request"
      );
    },
  });
};

// 4. Cancel Sent Request
export const useCancelFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recipientId: string) =>
      friendshipApi.cancelRequest(recipientId),
    onSuccess: () => {
      toast.info("Friend request cancelled");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(
        error.response?.data?.message || "Failed to cancel friend request"
      );
    },
  });
};

// 5. Unfriend User
export const useUnfriendUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (friendId: string) => friendshipApi.unfriend(friendId),
    onSuccess: () => {
      toast.info("Unfriended successfully");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.message || "Failed to unfriend user");
    },
  });
};

// 6. Get Friends List
export const useFriendsList = () => {
  return useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      const response = await friendshipApi.getFriendsList();
      return response.data;
    },
  });
};

// 7. Get Received Requests
export const useReceivedRequests = () => {
  return useQuery({
    queryKey: ["friendRequests"],
    queryFn: async () => {
      const response = await friendshipApi.getReceivedRequests();
      return response.data;
    },
  });
};
