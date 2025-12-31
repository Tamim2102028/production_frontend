import React, { useState, useCallback } from "react";
import SearchHeader from "../components/Search/SearchHeader";
import SearchBar from "../components/Search/SearchBar";
import SearchFilters from "../components/Search/SearchFilters";
import UsersResults from "../components/Search/UsersResults";
import PostsResults from "../components/Search/PostsResults";
import GroupsResults from "../components/Search/GroupsResults";
import InstitutionsResults from "../components/Search/InstitutionsResults";
import DepartmentsResults from "../components/Search/DepartmentsResults";
import CommentsResults from "../components/Search/CommentsResults";
import {
  searchService,
  type SearchResponse,
  type User,
  type Post,
  type Group,
  type Institution,
  type Department,
  type Comment,
} from "../services/search.service";

// Types for search results
interface SearchResults {
  users: User[];
  posts: Post[];
  groups: Group[];
  institutions: Institution[];
  departments: Department[];
  comments: Comment[];
}

interface SearchCounts {
  users: number;
  posts: number;
  groups: number;
  institutions: number;
  departments: number;
  comments: number;
  total: number;
}

type SearchFilter =
  | "all"
  | "users"
  | "posts"
  | "groups"
  | "institutions"
  | "departments"
  | "comments";

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<SearchFilter>("all");
  const [searchResults, setSearchResults] = useState<SearchResults>({
    users: [],
    posts: [],
    groups: [],
    institutions: [],
    departments: [],
    comments: [],
  });
  const [resultCounts, setResultCounts] = useState<SearchCounts>({
    users: 0,
    posts: 0,
    groups: 0,
    institutions: 0,
    departments: 0,
    comments: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTime, setSearchTime] = useState<number>(0);

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeout: ReturnType<typeof setTimeout>;
      return (query: string, filter: SearchFilter) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          if (query.trim().length >= 2) {
            performSearch(query, filter);
          } else {
            clearResults();
          }
        }, 300);
      };
    })(),
    []
  );

  // Clear search results
  const clearResults = () => {
    setSearchResults({
      users: [],
      posts: [],
      groups: [],
      institutions: [],
      departments: [],
      comments: [],
    });
    setResultCounts({
      users: 0,
      posts: 0,
      groups: 0,
      institutions: 0,
      departments: 0,
      comments: 0,
      total: 0,
    });
    setSearchTime(0);
    setError(null);
  };

  // Perform search API call
  const performSearch = async (query: string, filter: SearchFilter) => {
    setLoading(true);
    setError(null);

    try {
      if (filter === "all") {
        // Global search
        const response: SearchResponse = await searchService.globalSearch(
          query,
          "all",
          1,
          20
        );

        if (response.success) {
          setSearchResults({
            users: response.data.results.users || [],
            posts: response.data.results.posts || [],
            groups: response.data.results.groups || [],
            institutions: response.data.results.institutions || [],
            departments: response.data.results.departments || [],
            comments: response.data.results.comments || [],
          });
          setResultCounts(response.data.counts);
          setSearchTime(response.data.searchTime);
        } else {
          throw new Error("Search failed");
        }
      } else {
        // Category-specific search
        const categoryResults: {
          users?: User[];
          posts?: Post[];
          groups?: Group[];
          institutions?: Institution[];
          departments?: Department[];
          comments?: Comment[];
        } = {};

        const categoryCounts: SearchCounts = {
          users: 0,
          posts: 0,
          groups: 0,
          institutions: 0,
          departments: 0,
          comments: 0,
          total: 0,
        };

        switch (filter) {
          case "users": {
            const usersResponse = await searchService.searchUsers(query);
            if (usersResponse.success) {
              categoryResults.users = usersResponse.data.users;
              categoryCounts.users = usersResponse.data.totalCount;
              categoryCounts.total = usersResponse.data.totalCount;
              setSearchTime(usersResponse.data.searchTime);
            }
            break;
          }

          case "posts": {
            const postsResponse = await searchService.searchPosts(query);
            if (postsResponse.success) {
              categoryResults.posts = postsResponse.data.posts;
              categoryCounts.posts = postsResponse.data.totalCount;
              categoryCounts.total = postsResponse.data.totalCount;
              setSearchTime(postsResponse.data.searchTime);
            }
            break;
          }

          case "groups": {
            const groupsResponse = await searchService.searchGroups(query);
            if (groupsResponse.success) {
              categoryResults.groups = groupsResponse.data.groups;
              categoryCounts.groups = groupsResponse.data.totalCount;
              categoryCounts.total = groupsResponse.data.totalCount;
              setSearchTime(groupsResponse.data.searchTime);
            }
            break;
          }

          case "institutions": {
            const institutionsResponse =
              await searchService.searchInstitutions(query);
            if (institutionsResponse.success) {
              categoryResults.institutions =
                institutionsResponse.data.institutions;
              categoryCounts.institutions =
                institutionsResponse.data.totalCount;
              categoryCounts.total = institutionsResponse.data.totalCount;
              setSearchTime(institutionsResponse.data.searchTime);
            }
            break;
          }

          case "departments": {
            const departmentsResponse =
              await searchService.searchDepartments(query);
            if (departmentsResponse.success) {
              categoryResults.departments =
                departmentsResponse.data.departments;
              categoryCounts.departments = departmentsResponse.data.totalCount;
              categoryCounts.total = departmentsResponse.data.totalCount;
              setSearchTime(departmentsResponse.data.searchTime);
            }
            break;
          }

          case "comments": {
            const commentsResponse = await searchService.searchComments(query);
            if (commentsResponse.success) {
              categoryResults.comments = commentsResponse.data.comments;
              categoryCounts.comments = commentsResponse.data.totalCount;
              categoryCounts.total = commentsResponse.data.totalCount;
              setSearchTime(commentsResponse.data.searchTime);
            }
            break;
          }
        }

        setSearchResults({
          users: categoryResults.users || [],
          posts: categoryResults.posts || [],
          groups: categoryResults.groups || [],
          institutions: categoryResults.institutions || [],
          departments: categoryResults.departments || [],
          comments: categoryResults.comments || [],
        });
        setResultCounts(categoryCounts);
      }
    } catch (err: unknown) {
      console.error("Search error:", err);

      // Handle different types of errors
      const error = err as {
        response?: { status?: number; data?: { message?: string } };
        code?: string;
      };
      if (error.response?.status === 401) {
        setError("Please log in to search. Redirecting to login...");
        // Optionally redirect to login after a delay
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else if (error.response?.status === 400) {
        setError(
          error.response.data?.message ||
            "Invalid search query. Please try again."
        );
      } else if ((error.response?.status ?? 0) >= 500) {
        setError("Server error. Please try again later.");
      } else if (error.code === "ECONNABORTED") {
        setError("Search timeout. Please try again.");
      } else {
        setError("Search failed. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle search query change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    debouncedSearch(query, activeFilter);
  };

  // Handle filter change
  const handleFilterChange = (filter: string) => {
    const newFilter = filter as SearchFilter;
    setActiveFilter(newFilter);

    // Re-search with new filter if there's a query
    if (searchQuery.trim().length >= 2) {
      debouncedSearch(searchQuery, newFilter);
    }
  };

  const hasResults = resultCounts.total > 0;
  const showResults = searchQuery.trim().length >= 2;

  return (
    <>
      <SearchHeader />

      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      <SearchFilters
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        resultCounts={resultCounts}
      />

      {/* Search Performance Info */}
      {showResults && !loading && hasResults && (
        <div className="mb-4 text-sm text-gray-600">
          Found {resultCounts.total} results in {searchTime}ms
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={() => {
              setError(null);
              if (searchQuery.trim().length >= 2) {
                performSearch(searchQuery, activeFilter);
              }
            }}
            className="mt-2 text-sm text-red-600 underline hover:text-red-800"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State - When no search query */}
      {!showResults && (
        <div className="mt-16 text-center">
          <div className="mb-4 text-7xl">🔍</div>
          <h3 className="mb-2 text-2xl font-semibold text-gray-900">
            Search SocialHub
          </h3>
          <p className="text-gray-600">
            Start typing to search for users, posts, groups, institutions,
            departments, and comments
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Minimum 2 characters required
          </div>
        </div>
      )}

      {/* Search Results */}
      {showResults && (
        <div className="space-y-6">
          <UsersResults
            isVisible={activeFilter === "all" || activeFilter === "users"}
            users={searchResults.users}
            loading={loading}
            searchQuery={searchQuery}
          />

          <PostsResults
            isVisible={activeFilter === "all" || activeFilter === "posts"}
            posts={searchResults.posts}
            loading={loading}
            searchQuery={searchQuery}
          />

          <GroupsResults
            isVisible={activeFilter === "all" || activeFilter === "groups"}
            groups={searchResults.groups}
            loading={loading}
            searchQuery={searchQuery}
          />

          <InstitutionsResults
            isVisible={
              activeFilter === "all" || activeFilter === "institutions"
            }
            institutions={searchResults.institutions}
            loading={loading}
          />

          <DepartmentsResults
            isVisible={activeFilter === "all" || activeFilter === "departments"}
            departments={searchResults.departments}
            loading={loading}
          />

          <CommentsResults
            isVisible={activeFilter === "all" || activeFilter === "comments"}
            comments={searchResults.comments}
            loading={loading}
            searchQuery={searchQuery}
          />
        </div>
      )}

      {/* No Results */}
      {showResults && !loading && !hasResults && !error && (
        <div className="mt-12 text-center">
          <div className="mb-4 text-6xl">🔍</div>
          <h3 className="mb-2 text-xl font-semibold text-gray-900">
            No results found for "{searchQuery}"
          </h3>
          <p className="text-gray-600">
            Try searching with different keywords or check your spelling
          </p>
          <div className="mt-4 space-y-2 text-sm text-gray-500">
            <p>Search tips:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>Try different keywords</li>
              <li>Check spelling</li>
              <li>Use more general terms</li>
              <li>Try searching in specific categories</li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Search;
