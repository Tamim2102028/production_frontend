import React, { useState, useEffect } from "react";
import SearchHeader from "../components/Search/SearchHeader";
import SearchBar from "../components/Search/SearchBar";
import SearchFilters from "../components/Search/SearchFilters";
import PeopleResults from "../components/Search/PeopleResults";
import PostsResults from "../components/Search/PostsResults";
import HashtagsResults from "../components/Search/HashtagsResults";
import GroupsResults from "../components/Search/GroupsResults";
import useSearch from "../hooks/useSearch";
import InstitutionsResults from "../components/Search/InstitutionsResults";
import DepartmentsResults from "../components/Search/DepartmentsResults";
import CommentsResults from "../components/Search/CommentsResults";

const Search: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // useSearch hook returns 'results' which corresponds to GlobalSearchResponse
  const {
    query: searchQuery,
    setQuery: setSearchQuery,
    results, // Direct use
    loading,
    search,
  } = useSearch();

  // Trigger search when query or filter changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim()) {
        // Filter IDs in SearchFilters.tsx match backend 'type' strings
        search(searchQuery, activeFilter);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, activeFilter, search]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  // Check if we have any actual data in the arrays
  const hasResults =
    results &&
    ((results.results.users?.length || 0) > 0 ||
      (results.results.posts?.length || 0) > 0 ||
      (results.results.groups?.length || 0) > 0 ||
      (results.results.hashtags?.length || 0) > 0 ||
      (results.results.institutions?.length || 0) > 0 ||
      (results.results.departments?.length || 0) > 0 ||
      (results.results.comments?.length || 0) > 0);

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
        resultCounts={results?.counts}
      />

      {/* Empty State - When no search query */}
      {!searchQuery.trim() && (
        <div className="mt-16 text-center">
          <div className="mb-4 text-7xl">🔍</div>
          <h3 className="mb-2 text-2xl font-semibold text-gray-900">
            Search SocialHub
          </h3>
          <p className="text-gray-600">
            Start typing to search for people, posts, groups, and more
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="mt-12 text-center">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !border-0 !p-0 !whitespace-nowrap ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      )}

      {/* Search Results */}
      {!loading && searchQuery.trim() && (
        <div className="space-y-5">
          <PeopleResults
            isVisible={activeFilter === "all" || activeFilter === "users"}
            people={results?.results.users || []}
          />
          <PostsResults
            isVisible={activeFilter === "all" || activeFilter === "posts"}
            posts={results?.results.posts || []}
          />
          <GroupsResults
            isVisible={activeFilter === "all" || activeFilter === "groups"}
            groups={results?.results.groups || []}
          />
          <HashtagsResults
            isVisible={activeFilter === "all" || activeFilter === "hashtags"}
            hashtags={results?.results.hashtags || []}
          />
          <InstitutionsResults
            isVisible={
              activeFilter === "all" || activeFilter === "institutions"
            }
            institutions={results?.results.institutions || []}
          />
          <DepartmentsResults
            isVisible={activeFilter === "all" || activeFilter === "departments"}
            departments={results?.results.departments || []}
          />
          <CommentsResults
            isVisible={activeFilter === "all" || activeFilter === "comments"}
            comments={results?.results.comments || []}
          />
        </div>
      )}

      {/* No Results */}
      {!loading && searchQuery.trim() && results && !hasResults && (
        <div className="mt-12 text-center">
          <div className="mb-4 text-6xl">🔍</div>
          <h3 className="mb-2 text-xl font-semibold text-gray-900">
            No results found
          </h3>
          <p className="text-gray-600">
            Try searching with different keywords or check your spelling
          </p>
        </div>
      )}
    </>
  );
};

export default Search;
