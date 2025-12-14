import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaUsers, FaLock, FaGlobe, FaBan } from "react-icons/fa";

// Accepts group with 'id' property instead of 'groupId'.
type SmallGroup = {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  profileImage?: string;
  memberCount?: number;
  privacy?: string;
  category?: string;
};

type GroupCardProps = {
  group: SmallGroup;
  showJoinButton?: boolean;
  showCancelButton?: boolean;
  isRequested?: boolean;
  isMember?: boolean;
};

const GroupCard: React.FC<GroupCardProps> = ({
  group,
  showJoinButton = false,
  showCancelButton = false,
  isRequested: propIsRequested = false,
  isMember: propIsMember = false,
}) => {
  // TODO: Replace with actual state from API
  const [isRequested, setIsRequested] = useState(propIsRequested);
  const isMember = propIsMember;
  const effectiveMember = isMember;

  const handleJoin = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Replace with API call
    console.log("Join group:", group.id);
    setIsRequested(true);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Replace with API call
    console.log("Cancel join request:", group.id);
    setIsRequested(false);
  };
  return (
    <NavLink
      to={`/groups/${group.id}`}
      className="cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative overflow-hidden">
        <img
          src={
            group.profileImage ||
            group.coverImage ||
            "/images/default-group-cover.jpg"
          }
          alt={group.name}
          className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Privacy Badge (closed / private / public) */}
        <div className="absolute top-3 right-3">
          {group.privacy === "closed" ? (
            <div className="flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white">
              <FaBan size={10} />
              Closed
            </div>
          ) : group.privacy === "private" ? (
            <div className="flex items-center gap-1.5 rounded-full bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white">
              <FaLock size={10} />
              Private
            </div>
          ) : (
            <div className="flex items-center gap-1.5 rounded-full bg-green-600 px-3 py-1.5 text-xs font-semibold text-white">
              <FaGlobe size={10} />
              Public
            </div>
          )}
        </div>
      </div>

      <div className="p-3">
        <h3 className="mb-2 text-lg font-bold text-gray-900">{group.name}</h3>

        <div className="mb-3 flex items-center gap-2 text-sm text-gray-600">
          <FaUsers size={14} />
          <span className="font-medium">
            {group.memberCount?.toLocaleString()} members
          </span>
        </div>

        {showJoinButton &&
          !isRequested &&
          !effectiveMember &&
          group.privacy !== "closed" && (
            <button
              type="button"
              onClick={handleJoin}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Join Group
            </button>
          )}

        {isRequested && showCancelButton && (
          <button
            type="button"
            onClick={handleCancel}
            className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
          >
            Cancel Request
          </button>
        )}

        {isRequested && !showCancelButton && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="w-full rounded-lg bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-700"
            disabled
          >
            Requested
          </button>
        )}
      </div>
    </NavLink>
  );
};

export default GroupCard;
