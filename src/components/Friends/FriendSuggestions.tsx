import React from "react";
import { FaMagic } from "react-icons/fa";
import FriendCard from "../shared/friends/FriendCard";
import { useFriendSuggestions } from "../../hooks/useFriendship";
import { toast } from "sonner";

const FriendSuggestions: React.FC = () => {
  const { data, isLoading, error } = useFriendSuggestions();

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading suggestions...
      </div>
    );
  }

  if (error) {
    console.error("Failed to fetch suggestions", error);
    toast.error("Failed to fetch suggestions. Please try again.");
    return (
      <div className="p-8 text-center text-red-500">
        Failed to fetch suggestions. Please try again.
        <p>Error: {error.message}</p>
      </div>
    );
  }

  const suggestions = data?.users || [];

  if (suggestions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-12 text-center">
        <div className="mb-4 rounded-full bg-white p-4 shadow-sm">
          <FaMagic className="h-8 w-8 text-blue-500" />
        </div>
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          No Suggestions
        </h3>
        <p className="text-sm font-medium text-gray-500">
          We don't have any friend suggestions for you right now.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {suggestions.map((suggestion) => (
        <FriendCard
          key={suggestion._id}
          friend={suggestion}
          type="suggestion"
        />
      ))}
    </div>
  );
};

export default FriendSuggestions;
