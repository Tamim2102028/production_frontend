import React from "react";
import { FaMagic } from "react-icons/fa";
import FriendCard from "../shared/friends/FriendCard";

// TODO: Replace with API data
interface Suggestion {
  id: string;
  name: string;
  avatar?: string;
  [key: string]: unknown;
}

interface FriendSuggestionsProps {
  suggestions?: Suggestion[];
}

const FriendSuggestions: React.FC<FriendSuggestionsProps> = ({
  suggestions = [],
}) => {
  const friendSuggestions = suggestions;

  if (friendSuggestions.length === 0) {
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
      {friendSuggestions.map((suggestion) => (
        <FriendCard key={suggestion.id} friend={suggestion} type="suggestion" />
      ))}
    </div>
  );
};

export default FriendSuggestions;
