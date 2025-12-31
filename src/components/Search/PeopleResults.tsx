import React from "react";
import FriendCard from "../shared/friends/FriendCard";
import type { SearchUser } from "../../types";

interface PeopleResultsProps {
  isVisible: boolean;
  people?: SearchUser[];
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
            key={person._id}
            friend={{
              _id: person._id,
              fullName: person.fullName,
              userName: person.userName,
              avatar: person.avatar || "",
              userType: person.userType || "student",
              institution: person.institution
                ? {
                    _id: person.institution._id,
                    name: person.institution.name,
                  }
                : null,
              department: person.academicInfo?.department
                ? {
                    _id: person.academicInfo.department._id,
                    name: person.academicInfo.department.name,
                  }
                : null,
            }}
            type={getCardType(person.relationStatus)}
          />
        ))}
      </div>
    </div>
  );
};

export default PeopleResults;
