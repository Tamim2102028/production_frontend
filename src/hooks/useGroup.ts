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
import type {
  ApiError,
  GroupDetailsResponse,
  GroupMembersResponse,
} from "../types";

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

  return useMutation({
    mutationFn: (slug: string) => groupService.leaveGroup(slug),
    onSuccess: () => {
      toast.success("You have left the group");

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["myGroups"] });
      queryClient.invalidateQueries({ queryKey: ["group"] });
      queryClient.invalidateQueries({ queryKey: ["suggestedGroups"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message || "Failed to leave group";
      toast.error(message);
    },
  });
};

export const useJoinGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => groupService.joinGroup(slug),
    onSuccess: () => {
      toast.success("Request sent / Joined successfully!");
      queryClient.invalidateQueries({ queryKey: ["group"] });
      queryClient.invalidateQueries({ queryKey: ["suggestedGroups"] });
      queryClient.invalidateQueries({ queryKey: ["myGroups"] });
      queryClient.invalidateQueries({ queryKey: ["invitedGroups"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message || "Failed to join group";
      toast.error(message);
    },
  });
};

export const useCancelJoinRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => groupService.cancelJoinRequest(slug),
    onSuccess: () => {
      toast.success("Join request cancelled");
      queryClient.invalidateQueries({ queryKey: ["group"] });
      queryClient.invalidateQueries({ queryKey: ["sentGroupRequests"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message =
        error?.response?.data?.message || "Failed to cancel request";
      toast.error(message);
    },
  });
};

export const useDeleteGroup = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (slug: string) => groupService.deleteGroup(slug),
    onSuccess: () => {
      toast.success("Group deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["myGroups"] });
      navigate("/groups");
    },
    onError: (error: AxiosError<ApiError>) => {
      const message =
        error?.response?.data?.message || "Failed to delete group";
      toast.error(message);
    },
  });
};

export const useInviteMembers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      slug,
      targetUserIds,
    }: {
      slug: string;
      targetUserIds: string[];
    }) => groupService.inviteMembers(slug, targetUserIds),
    onSuccess: () => {
      toast.success("Invitations sent successfully");
      queryClient.invalidateQueries({ queryKey: ["groupMembers"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message =
        error?.response?.data?.message || "Failed to send invitations";
      toast.error(message);
    },
  });
};

export const useRemoveGroupMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, userId }: { slug: string; userId: string }) =>
      groupService.removeMember(slug, userId),
    onSuccess: () => {
      toast.success("Member removed successfully");
      queryClient.invalidateQueries({ queryKey: ["groupMembers"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message =
        error?.response?.data?.message || "Failed to remove member";
      toast.error(message);
    },
  });
};

export const useAssignGroupAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, userId }: { slug: string; userId: string }) =>
      groupService.assignAdmin(slug, userId),
    onSuccess: () => {
      toast.success("Admin assigned successfully");
      queryClient.invalidateQueries({ queryKey: ["groupMembers"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message =
        error?.response?.data?.message || "Failed to assign admin";
      toast.error(message);
    },
  });
};

export const useRevokeGroupAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, userId }: { slug: string; userId: string }) =>
      groupService.revokeAdmin(slug, userId),
    onSuccess: () => {
      toast.success("Admin access revoked");
      queryClient.invalidateQueries({ queryKey: ["groupMembers"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message =
        error?.response?.data?.message || "Failed to revoke admin";
      toast.error(message);
    },
  });
};

export const useGroupMembers = (slug: string, limit = 10) => {
  return useInfiniteQuery<GroupMembersResponse>({
    queryKey: ["groupMembers", slug],
    queryFn: ({ pageParam = 1 }) =>
      groupService.getGroupMembers(slug, pageParam as number, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
};
