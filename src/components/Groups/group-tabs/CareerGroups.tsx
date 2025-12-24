import React from "react";
import GroupCard from "../utils/GroupCard";
import { FaBriefcase } from "react-icons/fa";

// TODO: Replace with API data
interface Group {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  memberCount?: number;
  privacy?: string;
}

interface CareerGroupsProps {
  groups?: Group[];
}

const CareerGroups: React.FC<CareerGroupsProps> = ({ groups = [] }) => {
  return (
    <div>
      <h2 className="mb-3 text-xl font-semibold text-gray-900">
        Career & Job Groups ({groups.length})
      </h2>
      {groups.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-12 text-center">
          <div className="mb-4 rounded-full bg-white p-4 shadow-sm">
            <FaBriefcase className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No Career Groups
          </h3>
          <p className="text-sm font-medium text-gray-500">
            No career-focused groups found. Start networking by creating a new
            group.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} showJoinButton={true} />
        ))}
      </div>
    </div>
  );
};

export default CareerGroups;
