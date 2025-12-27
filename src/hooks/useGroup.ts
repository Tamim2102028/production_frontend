import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { groupService } from "../services/group.service";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import type { ApiError, GroupDetailsResponse } from "../types";

export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: groupService.createGroup,
    onSuccess: (data) => {
      toast.success("Group created successfully!");
      queryClient.invalidateQueries({ queryKey: ["myGroups"] });

      const groupSlug = data.data.group?.slug;
      if (groupSlug) {
        navigate(`/groups/${groupSlug}`);
      } else {
        // Fallback if slug is missing
        navigate("/groups");
      }
    },
    onError: (error: AxiosError<ApiError>) => {
      const message =
        error?.response?.data?.message || "Failed to create group";
      toast.error(message);
    },
  });
};

export const useGroupDetails = (slug: string) => {
  return useQuery<GroupDetailsResponse>({
    queryKey: ["group", slug],
    queryFn: () => groupService.getGroupDetails(slug),
    staleTime: 1000 * 60 * 10, // 10 minutes
    enabled: !!slug,
    retry: 1,
  });
};

export const useMyGroups = (limit = 10) => {
  return useInfiniteQuery({
    queryKey: ["myGroups", "infinite"],
    queryFn: ({ pageParam = 1 }) => groupService.getMyGroups(pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useUniversityGroups = (limit = 10) => {
  return useInfiniteQuery({
    queryKey: ["universityGroups", "infinite"],
    queryFn: ({ pageParam = 1 }) =>
      groupService.getUniversityGroups(pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useCareerGroups = (limit = 10) => {
  return useInfiniteQuery({
    queryKey: ["careerGroups", "infinite"],
    queryFn: ({ pageParam = 1 }) =>
      groupService.getCareerGroups(pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useSuggestedGroups = (limit = 10) => {
  return useInfiniteQuery({
    queryKey: ["suggestedGroups", "infinite"],
    queryFn: ({ pageParam = 1 }) =>
      groupService.getSuggestedGroups(pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useSentGroupRequests = (limit = 10) => {
  return useInfiniteQuery({
    queryKey: ["sentGroupRequests", "infinite"],
    queryFn: ({ pageParam = 1 }) =>
      groupService.getSentRequests(pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useInvitedGroups = (limit = 10) => {
  return useInfiniteQuery({
    queryKey: ["invitedGroups", "infinite"],
    queryFn: ({ pageParam = 1 }) =>
      groupService.getInvitedGroups(pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useLeaveGroup = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (groupId: string) => groupService.leaveGroup(groupId),
    onSuccess: () => {
      toast.success("You have left the group");

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["myGroups"] });
      queryClient.invalidateQueries({ queryKey: ["group"] });
      queryClient.invalidateQueries({ queryKey: ["suggestedGroups"] });

      // Navigate to groups list or stay?
      // If we are on the group detail page, we might want to stay or go to list.
      // Usually if you leave a private group you can't see it anymore.
      // For now, let's not force navigation, let the component handle it or user decide.
      // But commonly, redirecting to /groups is safe.
      navigate("/groups");
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message || "Failed to leave group";
      toast.error(message);
    },
  });
};
