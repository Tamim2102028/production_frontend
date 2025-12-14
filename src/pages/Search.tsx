import React from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import {
  selectSearchQuery,
  selectActiveFilter,
  selectFilteredPeople,
  selectFilteredPosts,
  selectFilteredHashtags,
  selectFilteredGroups,
  setSearchQuery,
  setActiveFilter,
} from "../store/slices/search/searchSlice";
import SearchHeader from "../components/Search/SearchHeader";
import SearchBar from "../components/Search/SearchBar";
import SearchFilters from "../components/Search/SearchFilters";
import PeopleResults from "../components/Search/PeopleResults";
import PostsResults from "../components/Search/PostsResults";
import HashtagsResults from "../components/Search/HashtagsResults";
import GroupsResults from "../components/Search/GroupsResults";

const Search: React.FC = () => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector(selectSearchQuery);
  const activeFilter = useAppSelector(selectActiveFilter);
  const filteredPeople = useAppSelector(selectFilteredPeople);
  const filteredPosts = useAppSelector(selectFilteredPosts);
  const filteredHashtags = useAppSelector(selectFilteredHashtags);
  const filteredGroups = useAppSelector(selectFilteredGroups);

  const handleSearchChange = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  const handleFilterChange = (filter: string) => {
    dispatch(
      setActiveFilter(
        filter as "all" | "people" | "posts" | "hashtags" | "groups"
      )
    );
  };

  const hasResults =
    filteredPeople.length > 0 ||
    filteredPosts.length > 0 ||
    filteredHashtags.length > 0 ||
    filteredGroups.length > 0;

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
      />

      {/* Empty State - When no search query */}
      {!searchQuery.trim() && (
        <div className="mt-16 text-center">
          <div className="mb-4 text-7xl">🔍</div>
          <h3 className="mb-2 text-2xl font-semibold text-gray-900">
            Search SocialHub
          </h3>
          <p className="text-gray-600">
            Start typing to search for people, posts, groups, and hashtags
          </p>
        </div>
      )}

      {/* Search Results */}
      {searchQuery.trim() && (
        <div className="space-y-5">
          <PeopleResults
            isVisible={activeFilter === "all" || activeFilter === "people"}
          />
          <PostsResults
            isVisible={activeFilter === "all" || activeFilter === "posts"}
          />
          <GroupsResults
            isVisible={activeFilter === "all" || activeFilter === "groups"}
          />
          <HashtagsResults
            isVisible={activeFilter === "all" || activeFilter === "hashtags"}
          />
        </div>
      )}

      {/* No Results */}
      {searchQuery.trim() && !hasResults && (
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
