import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUsers, FaLock, FaGlobe, FaBan } from "react-icons/fa";
import {
  GROUP_MEMBERSHIP_STATUS,
  GROUP_PRIVACY,
} from "../../../constants/index";
import type { GroupCardProps } from "../../../types/group.types";

const GroupCard: React.FC<GroupCardProps> = ({ group, status }) => {
  const navigate = useNavigate();

  const handleViewGroup = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/groups/${group.slug}`);
  };

  const handleJoin = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Replace with API call
    console.log("Join group:", group._id);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Replace with API call
    console.log("Cancel join request:", group._id);
  };

  const handleAccept = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Replace with API call
    console.log("Accept join request:", group._id);
  };

  const handleReject = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Replace with API call
    console.log("Reject join request:", group._id);
  };

  return (
    <Link
      to={`/groups/${group.slug}`}
      className="cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Group Card Content */}
      <div className="relative overflow-hidden">
        <img
          src={group.coverImage || "/images/default-group-cover.jpg"}
          alt={group.name}
          className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Privacy Badge (closed / private / public) */}
        <div className="absolute top-3 right-3">
          {group.privacy === GROUP_PRIVACY.CLOSED ? (
            <div className="flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white">
              <FaBan size={10} />
              Closed
            </div>
          ) : group.privacy === GROUP_PRIVACY.PRIVATE ? (
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

      {/*  */}
      <div className="p-3">
        {/* Group Name */}
        <h3 className="mb-2 text-lg font-bold text-gray-900">{group.name}</h3>

        {/* Group Members Count */}
        <div className="mb-3 flex items-center gap-2 text-sm text-gray-600">
          <FaUsers size={14} />
          <span className="font-medium">
            {group.membersCount?.toLocaleString()} members
          </span>
        </div>

        {/* Join / Cancel / Accept / Reject - Buttons */}
        <div>
          {/* view group button */}
          {status === GROUP_MEMBERSHIP_STATUS.JOINED && (
            <button
              type="button"
              onClick={handleViewGroup}
              className="w-full rounded-lg bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-400"
            >
              View Group
            </button>
          )}

          {/* Join */}
          {status === GROUP_MEMBERSHIP_STATUS.NOT_JOINED &&
            status !== GROUP_MEMBERSHIP_STATUS.BANNED &&
            group.privacy !== GROUP_PRIVACY.CLOSED && (
              <button
                type="button"
                onClick={handleJoin}
                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Join Group
              </button>
            )}

          {/* Cancel Join Request */}
          {status === GROUP_MEMBERSHIP_STATUS.PENDING &&
            status !== GROUP_MEMBERSHIP_STATUS.BANNED && (
              <button
                type="button"
                onClick={handleCancel}
                className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
              >
                Cancel Request
              </button>
            )}

          {/* Accept / Reject Invitation */}
          {status === GROUP_MEMBERSHIP_STATUS.INVITED && (
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={handleAccept}
                className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700"
                disabled
              >
                Accept
              </button>
              <button
                type="button"
                onClick={handleReject}
                className="w-full rounded-lg bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-400"
                disabled
              >
                Reject
              </button>
            </div>
          )}

          {/* closed groups */}
          {group.privacy === GROUP_PRIVACY.CLOSED &&
            status !== GROUP_MEMBERSHIP_STATUS.JOINED &&
            status !== GROUP_MEMBERSHIP_STATUS.INVITED &&
            status !== GROUP_MEMBERSHIP_STATUS.PENDING && (
              <div className="mt-2 flex justify-center">
                <button
                  type="button"
                  disabled
                  className="w-full cursor-not-allowed rounded-lg bg-red-300 px-4 py-2 text-sm font-semibold text-gray-700"
                >
                  You can't join this group
                </button>
              </div>
            )}
        </div>
      </div>
    </Link>
  );
};

export default GroupCard;
