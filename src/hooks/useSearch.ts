import { useState, useCallback, useEffect } from "react";
import { searchService } from "../services/search.service";
import type { GlobalSearchResponse, SearchSuggestion } from "../types";

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GlobalSearchResponse | null>(null);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 500);

  // Search function
  const search = useCallback(
    async (searchQuery: string, type: string = "all", page: number = 1) => {
      if (!searchQuery.trim()) {
        setResults(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await searchService.globalSearch(
          searchQuery,
          type,
          page
        );
        setResults(response.data);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Search failed";
        setError(errorMessage);
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Fetch suggestions when query changes (debounced)
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedQuery.trim() || debouncedQuery.length < 1) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await searchService.getSuggestions(debouncedQuery);
        setSuggestions(response.data.suggestions);
      } catch (err) {
        console.error("Suggestion error:", err);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  return {
    query,
    setQuery,
    results,
    suggestions,
    loading,
    error,
    search,
  };
};

export default useSearch;
