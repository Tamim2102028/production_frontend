import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { friendshipApi } from "../services/friendship.service";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import type { ApiError } from "../types/user.types";

// ====================================
// Friendship Actions Hooks
// ====================================

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
      queryClient.invalidateQueries({ queryKey: ["sentRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friendSuggestions"] });
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
      queryClient.invalidateQueries({ queryKey: ["sentRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friendSuggestions"] });
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
      queryClient.invalidateQueries({ queryKey: ["sentRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friendSuggestions"] });
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
      queryClient.invalidateQueries({ queryKey: ["sentRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friendSuggestions"] });
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
      queryClient.invalidateQueries({ queryKey: ["sentRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friendSuggestions"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.message || "Failed to unfriend user");
    },
  });
};

// 6. Block User
export const useBlockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => friendshipApi.block(userId),
    onSuccess: () => {
      toast.success("User blocked successfully");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["sentRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friendSuggestions"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.message || "Failed to block user");
    },
  });
};

// 7. Unblock User
export const useUnblockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => friendshipApi.unblock(userId),
    onSuccess: () => {
      toast.success("User unblocked successfully");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["sentRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friendSuggestions"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.message || "Failed to unblock user");
    },
  });
};

// ====================================
// Friend Page Hooks
// ====================================

// 8. Get Friends List Hook
export const useFriendsList = () => {
  return useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      const response = await friendshipApi.getFriendsList();
      return response.data;
    },
  });
};

// 9. Get Received Requests Hook
export const useReceivedRequests = () => {
  return useQuery({
    queryKey: ["friendRequests"],
    queryFn: async () => {
      const response = await friendshipApi.getReceivedRequests();
      return response.data;
    },
  });
};

// 10. Get Sent Requests Hook
export const useSentRequests = () => {
  return useQuery({
    queryKey: ["sentRequests"],
    queryFn: async () => {
      const response = await friendshipApi.getSentRequests();
      return response.data;
    },
  });
};

// 11. Get Suggestions Hook
export const useFriendSuggestions = () => {
  return useQuery({
    queryKey: ["friendSuggestions"],
    queryFn: async () => {
      const response = await friendshipApi.getSuggestions();
      return response.data;
    },
  });
};
