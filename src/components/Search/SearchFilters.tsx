import React from "react";
import { FaSearch, FaUser, FaHashtag, FaImage, FaUsers } from "react-icons/fa";

interface SearchFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  const filters = [
    { id: "all", name: "All", icon: FaSearch },
    { id: "people", name: "People", icon: FaUser },
    { id: "posts", name: "Posts", icon: FaImage },
    { id: "groups", name: "Groups", icon: FaUsers },
    { id: "hashtags", name: "Hashtags", icon: FaHashtag },
  ];

  return (
    <div className="flex items-center space-x-2 overflow-x-auto">
      {filters.map((filter) => {
        const IconComponent = filter.icon;
        return (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`flex items-center space-x-2 rounded-full px-4 py-2 whitespace-nowrap transition-all ${
              activeFilter === filter.id
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <IconComponent className="h-4 w-4" />
            <span className="text-sm font-medium">{filter.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default SearchFilters;
