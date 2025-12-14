import React from "react";

interface VideoCategoriesProps {
  categories: string[];
  selectedCategory?: string;
  onCategorySelect?: (category: string) => void;
}

const VideoCategories: React.FC<VideoCategoriesProps> = ({
  categories,
  selectedCategory = "All",
  onCategorySelect,
}) => {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategorySelect?.(category)}
          className={`rounded-full px-4 py-2 text-sm transition-colors ${
            selectedCategory === category
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default VideoCategories;
