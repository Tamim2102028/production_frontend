import { useInfiniteQuery } from "@tanstack/react-query";
import { friendService } from "../services/friendship.service";
import {
  useSendRequest,
  useAcceptRequest,
  useRejectRequest,
  useCancelRequest,
  useUnfriend,
  useBlock,
  useUnblock,
} from "./common/useFriendship";

// ====================================
// Friendship Actions Hooks (using common hooks)
// ====================================

// 1. Send Friend Request
export const useSendFriendRequest = () => {
  return useSendRequest();
};

// 2. Accept Friend Request
export const useAcceptFriendRequest = () => {
  return useAcceptRequest();
};

// 3. Reject Friend Request
export const useRejectFriendRequest = () => {
  return useRejectRequest();
};

// 4. Cancel Sent Request
export const useCancelFriendRequest = () => {
  return useCancelRequest();
};

// 5. Unfriend User
export const useUnfriendUser = () => {
  return useUnfriend();
};

// 6. Block User
export const useBlockUser = () => {
  return useBlock();
};

// 7. Unblock User
export const useUnblockUser = () => {
  return useUnblock();
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
