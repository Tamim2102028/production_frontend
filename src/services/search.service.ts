import api from "../lib/axios";

// Types for API responses
export interface SearchResponse {
  success: boolean;
  data: {
    results: {
      users?: User[];
      posts?: Post[];
      groups?: Group[];
      institutions?: Institution[];
      departments?: Department[];
      comments?: Comment[];
    };
    counts: {
      users: number;
      posts: number;
      groups: number;
      institutions: number;
      departments: number;
      comments: number;
      total: number;
    };
    pagination: {
      currentPage: number;
      hasMore: boolean;
      hasPrevious: boolean;
      totalPages?: number;
    };
    query: string;
    searchTime: number;
  };
  message: string;
}

export interface User {
  _id: string;
  fullName: string;
  userName: string;
  avatar: string;
  userType: string;
  bio?: string;
  connectionsCount: number;
  followersCount: number;
  institution?: string;
  academicInfo?: {
    department: string;
  };
}

export interface Post {
  _id: string;
  content: string;
  type: string;
  attachments?: { name: string; url: string }[];
  tags?: string[];
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  author: {
    _id: string;
    fullName: string;
    userName: string;
    avatar: string;
  };
}

export interface Group {
  _id: string;
  name: string;
  description?: string;
  avatar?: string;
  type: string;
  privacy: string;
  membersCount: number;
  postsCount: number;
  institution?: string;
}

export interface Institution {
  _id: string;
  name: string;
  code: string;
  type: string;
  category: string;
  location: string;
  logo?: string;
  website?: string;
  postsCount: number;
}

export interface Department {
  _id: string;
  name: string;
  code: string;
  description?: string;
  establishedYear?: number;
  postsCount: number;
  institution: {
    _id: string;
    name: string;
    code: string;
  };
}

export interface Comment {
  _id: string;
  content: string;
  createdAt: string;
  likesCount: number;
  author: {
    _id: string;
    fullName: string;
    userName: string;
    avatar: string;
  };
  post: {
    _id: string;
    content: string;
    author: string;
  };
}

// Search API functions
export const searchService = {
  // Global search across all categories
  async globalSearch(
    query: string,
    type: string = "all",
    page: number = 1,
    limit: number = 20
  ): Promise<SearchResponse> {
    const response = await api.get("/search/global", {
      params: { q: query, type, page, limit },
    });
    return response.data;
  },

  // Category-specific searches
  async searchUsers(
    query: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    success: boolean;
    data: {
      users: User[];
      totalCount: number;
      hasMore: boolean;
      searchTime: number;
      query: string;
    };
  }> {
    const response = await api.get("/search/users", {
      params: { q: query, page, limit },
    });
    return response.data;
  },

  async searchPosts(
    query: string,
    page: number = 1,
    limit: number = 15
  ): Promise<{
    success: boolean;
    data: {
      posts: Post[];
      totalCount: number;
      hasMore: boolean;
      searchTime: number;
      query: string;
    };
  }> {
    const response = await api.get("/search/posts", {
      params: { q: query, page, limit },
    });
    return response.data;
  },

  async searchGroups(
    query: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    success: boolean;
    data: {
      groups: Group[];
      totalCount: number;
      hasMore: boolean;
      searchTime: number;
      query: string;
    };
  }> {
    const response = await api.get("/search/groups", {
      params: { q: query, page, limit },
    });
    return response.data;
  },

  async searchInstitutions(
    query: string,
    page: number = 1,
    limit: number = 15
  ): Promise<{
    success: boolean;
    data: {
      institutions: Institution[];
      totalCount: number;
      hasMore: boolean;
      searchTime: number;
      query: string;
    };
  }> {
    const response = await api.get("/search/institutions", {
      params: { q: query, page, limit },
    });
    return response.data;
  },

  async searchDepartments(
    query: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    success: boolean;
    data: {
      departments: Department[];
      totalCount: number;
      hasMore: boolean;
      searchTime: number;
      query: string;
    };
  }> {
    const response = await api.get("/search/departments", {
      params: { q: query, page, limit },
    });
    return response.data;
  },

  async searchComments(
    query: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    success: boolean;
    data: {
      comments: Comment[];
      totalCount: number;
      hasMore: boolean;
      searchTime: number;
      query: string;
    };
  }> {
    const response = await api.get("/search/comments", {
      params: { q: query, page, limit },
    });
    return response.data;
  },

  // Search suggestions
  async getSearchSuggestions(query: string): Promise<{
    success: boolean;
    data: Array<{ type: string; text: string; subtitle?: string }>;
  }> {
    const response = await api.get("/search/suggestions", {
      params: { q: query },
    });
    return response.data;
  },
};

export default searchService;
