import React from "react";
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
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">
          No suggestions available
        </h3>
        <p className="mt-2 text-gray-600">
          We don't have any friend suggestions for you right now. Check back
          later!
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
