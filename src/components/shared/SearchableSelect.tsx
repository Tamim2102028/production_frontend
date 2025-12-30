import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaChevronDown, FaSpinner, FaTimes } from "react-icons/fa";

interface Option {
  id: string;
  name: string;
  subtext?: string;
  logo?: string;
}

interface SearchableSelectProps {
  label?: string;
  placeholder?: string;
  onSearch: (query: string) => Promise<Option[]>;
  onSelect: (option: Option | null) => void;
  defaultValue?: Option | null;
  className?: string;
  disabled?: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  label,
  placeholder = "Search...",
  onSearch,
  onSelect,
  defaultValue = null,
  className = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState<Option | null>(defaultValue);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSelected(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (val: string) => {
    setQuery(val);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (val.length < 2) {
      setOptions([]);
      return;
    }

    setIsLoading(true);
    searchTimeout.current = setTimeout(async () => {
      try {
        const results = await onSearch(val);
        setOptions(results);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  const handleSelect = (option: Option) => {
    setSelected(option);
    onSelect(option);
    setIsOpen(false);
    setQuery("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected(null);
    onSelect(null);
    setQuery("");
    setOptions([]);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="mb-1 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`flex w-full cursor-pointer items-center justify-between rounded-lg border px-3 py-2 transition-all ${
          disabled
            ? "bg-gray-50 text-gray-400"
            : "bg-white hover:border-blue-500"
        } ${isOpen ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-300"}`}
      >
        <div className="flex flex-1 items-center gap-2 overflow-hidden">
          {selected ? (
            <div className="flex items-center gap-2 overflow-hidden">
              {(selected.logo && (
                <img
                  src={selected.logo}
                  alt={selected.name}
                  className="h-5 w-5 rounded object-contain"
                />
              )) || (
                <div className="flex h-5 w-5 items-center justify-center rounded bg-blue-100 text-[10px] font-bold text-blue-600">
                  {selected.name.charAt(0)}
                </div>
              )}
              <span className="truncate font-medium text-gray-800">
                {selected.name}
              </span>
            </div>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {selected && !disabled && (
            <FaTimes
              onClick={handleClear}
              className="h-3 w-3 text-gray-400 hover:text-red-500"
            />
          )}
          <FaChevronDown
            className={`h-3 w-3 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute right-0 left-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-xl">
          <div className="sticky top-0 border-b border-gray-100 bg-white p-2">
            <div className="relative">
              <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Type to search..."
                className="w-full rounded-md border border-gray-200 py-1.5 pr-3 pl-9 text-sm focus:border-blue-500 focus:outline-none"
                onClick={(e) => e.stopPropagation()}
              />
              {isLoading && (
                <FaSpinner className="absolute top-1/2 right-3 -translate-y-1/2 animate-spin text-blue-500" />
              )}
            </div>
          </div>

          <div className="p-1">
            {options.length > 0 ? (
              options.map((option) => (
                <div
                  key={option.id}
                  onClick={() => handleSelect(option)}
                  className={`flex cursor-pointer items-center gap-3 rounded-md p-2 transition-colors hover:bg-blue-50 ${
                    selected?.id === option.id ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-100">
                    {option.logo ? (
                      <img
                        src={option.logo}
                        alt={option.name}
                        className="h-full w-full rounded object-contain"
                      />
                    ) : (
                      <span className="text-sm font-bold text-gray-400">
                        {option.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate text-sm font-medium text-gray-900">
                      {option.name}
                    </span>
                    {option.subtext && (
                      <span className="truncate text-xs text-gray-500">
                        {option.subtext}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : query.length >= 2 ? (
              <div className="py-8 text-center text-sm text-gray-500">
                {isLoading ? "Searching..." : "No results found"}
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-gray-400">
                Type at least 2 characters to search
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
