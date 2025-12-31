import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { friendService } from "../services/friendship.service";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import type { ApiError } from "../types";

// ====================================
// Friendship Actions Hooks
// ====================================

// 1. Send Friend Request
export const useSendFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) =>
      friendService.sendRequest(userId),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["profileHeader"] });
      queryClient.invalidateQueries({ queryKey: ["sentRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friendSuggestions"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

// 2. Accept Friend Request
export const useAcceptFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requesterId }: { requesterId: string }) =>
      friendService.acceptRequest(requesterId),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["profileHeader"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

// 3. Reject Friend Request
export const useRejectFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requesterId }: { requesterId: string }) =>
      friendService.rejectRequest(requesterId),
    onSuccess: (response) => {
      toast.info(response.message);
      queryClient.invalidateQueries({ queryKey: ["profileHeader"] });
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friendSuggestions"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

// 4. Cancel Sent Request
export const useCancelFriendRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ recipientId }: { recipientId: string }) =>
      friendService.cancelRequest(recipientId),
    onSuccess: (response) => {
      toast.info(response.message);
      queryClient.invalidateQueries({ queryKey: ["profileHeader"] });
      queryClient.invalidateQueries({ queryKey: ["sentRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friendSuggestions"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

// 5. Unfriend User
export const useUnfriendUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ friendId }: { friendId: string }) =>
      friendService.unfriend(friendId),
    onSuccess: (response) => {
      toast.info(response.message);
      queryClient.invalidateQueries({ queryKey: ["profileHeader"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["friendSuggestions"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

// 6. Block User
export const useBlockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) => friendService.block(userId),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["profileHeader"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["sentRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friendSuggestions"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

// 7. Unblock User
export const useUnblockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) =>
      friendService.unblock(userId),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["profileHeader"] });
      queryClient.invalidateQueries({ queryKey: ["friendSuggestions"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

// ====================================
// Friend Page Hooks
// ====================================

// 8. Get Friends List Hook
export const useFriendsList = () => {
  return useInfiniteQuery({
    queryKey: ["friends"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await friendService.getFriendsList(pageParam);
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });
};

// 9. Get Received Requests Hook
export const useReceivedRequests = () => {
  return useInfiniteQuery({
    queryKey: ["friendRequests"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await friendService.getReceivedRequests(pageParam);
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });
};

// 10. Get Sent Requests Hook
export const useSentRequests = () => {
  return useInfiniteQuery({
    queryKey: ["sentRequests"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await friendService.getSentRequests(pageParam);
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });
};

// 11. Get Suggestions Hook
export const useFriendSuggestions = () => {
  return useInfiniteQuery({
    queryKey: ["friendSuggestions"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await friendService.getSuggestions(pageParam);
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });
};
