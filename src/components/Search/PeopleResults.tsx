import React from "react";
import FriendCard from "../shared/friends/FriendCard";

// TODO: Replace with API data
interface Person {
  id: string;
  name: string;
  profileImage?: string;
  relationStatus?: "friend" | "request" | "suggestion" | "sent";
}

interface PeopleResultsProps {
  isVisible: boolean;
  people?: Person[];
}

const PeopleResults: React.FC<PeopleResultsProps> = ({
  isVisible,
  people = [],
}) => {
  const filteredPeople = people;

  if (!isVisible) return null;
  if (filteredPeople.length === 0) return null;

  // Map relationStatus to FriendCard type
  const getCardType = (
    status?: "friend" | "request" | "suggestion" | "sent"
  ): "friend" | "request" | "suggestion" | "sent" => {
    if (status === "friend") return "friend";
    if (status === "request") return "request";
    if (status === "sent") return "sent";
    return "suggestion";
  };

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-gray-900">
        People ({filteredPeople.length})
      </h2>
      <div className="space-y-4">
        {filteredPeople.map((person) => (
          <FriendCard
            key={person.id}
            friend={person}
            type={getCardType(person.relationStatus)}
          />
        ))}
      </div>
    </div>
  );
};

export default PeopleResults;
