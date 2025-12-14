import React from "react";
import { FaExclamationCircle, FaUser, FaUsers } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setActiveTab } from "../../../store/slices/mainMore/bloodDonationSlice";

const BloodDonationTabs: React.FC = () => {
  const dispatch = useAppDispatch();
  const { activeTab, requests, donors } = useAppSelector(
    (state) => state.bloodDonation
  );

  const handleTabChange = (tab: "requests" | "donors" | "donorList") => {
    dispatch(setActiveTab(tab));
  };
  return (
    <div className="flex gap-2 rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
      <button
        onClick={() => handleTabChange("requests")}
        className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-3 font-semibold transition-colors ${
          activeTab === "requests"
            ? "bg-red-600 text-white"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <FaExclamationCircle />
        Blood Requests ({requests.length})
      </button>
      <button
        onClick={() => handleTabChange("donors")}
        className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-3 font-semibold transition-colors ${
          activeTab === "donors"
            ? "bg-red-600 text-white"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <FaUser />
        Find Donors ({donors.length})
      </button>
      <button
        onClick={() => handleTabChange("donorList")}
        className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-3 font-semibold transition-colors ${
          activeTab === "donorList"
            ? "bg-red-600 text-white"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <FaUsers />
        Donor List ({donors.length})
      </button>
    </div>
  );
};

export default BloodDonationTabs;
