import React from "react";
import { FaBan, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import type { Group } from "../../../types/group.types";

interface GroupBannedProps {
  group: Group;
}

const GroupBanned: React.FC<GroupBannedProps> = ({ group }) => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-xl">
        {/* Icon Container with Animated Pulse */}
        <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-50">
          <div className="absolute h-full w-full animate-ping rounded-full bg-red-100 opacity-20"></div>
          <FaBan className="relative z-10 text-4xl text-red-500" />
        </div>

        {/* Title */}
        <h2 className="mb-2 text-2xl font-bold text-gray-800">
          You are Banned
        </h2>
        <p className="mb-6 text-gray-500">
          You have been banned from this group.
          <br />
          You cannot view or interact with this group's content.
        </p>

        {/* Group Name Badge */}
        <div className="mb-8 inline-flex items-center rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-600">
          {group.name}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3 font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <FaArrowLeft className="text-sm" />
            Go Back
          </button>

          <button
            onClick={() => navigate("/groups/suggested")}
            className="w-full rounded-xl border border-gray-500 bg-white px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-100"
          >
            Explore Other Groups
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupBanned;
