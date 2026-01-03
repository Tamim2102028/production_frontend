import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCamera, FaCog, FaArrowLeft, FaInfoCircle } from "react-icons/fa";
import PageLoader from "../Fallbacks/PageLoader";
import { useGroupDetails } from "../../hooks/useGroup";
import GeneralTab from "../../components/Groups/Edit/GeneralTab";
import PhotosTab from "../../components/Groups/Edit/PhotosTab";
import SettingsTab from "../../components/Groups/Edit/SettingsTab";

type TabType = "general" | "photos" | "settings";

interface Tab {
  id: TabType;
  label: string;
  icon: React.ReactNode;
}

const TABS: Tab[] = [
  { id: "photos", label: "Media & Photos", icon: <FaCamera /> },
  { id: "general", label: "Basic Info", icon: <FaInfoCircle /> },
  { id: "settings", label: "Group Settings", icon: <FaCog /> },
];

const EditGroupPage: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { data: groupData, isLoading, error } = useGroupDetails();
  const [activeTab, setActiveTab] = useState<TabType>("photos");

  if (isLoading) return <PageLoader />;
  if (error || !groupData) {
    return (
      <div className="animate-in fade-in zoom-in-95 flex h-[80vh] flex-col items-center justify-center gap-6 duration-500">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500">
          <FaInfoCircle className="text-4xl" />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-black text-gray-900">Group Not Found</h1>
          <p className="mt-2 font-medium text-gray-500">
            The group you're trying to manage doesn't exist or has been removed.
          </p>
        </div>
        <button
          onClick={() => navigate("/groups")}
          className="mt-4 rounded-xl bg-gray-900 px-8 py-3 font-bold text-white shadow-lg shadow-gray-200 transition-all hover:bg-gray-800 active:scale-95"
        >
          Back to Groups
        </button>
      </div>
    );
  }

  const { group, meta } = groupData.data;

  // Security: Only owner and admin can access
  if (!meta.isOwner && !meta.isAdmin) {
    navigate(`/groups/${slug}`);
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex items-center justify-between py-5">
            <div className="flex items-center gap-5">
              <button
                onClick={() => navigate(`/groups/${slug}`)}
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-50 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 active:scale-90"
                aria-label="Go back"
              >
                <FaArrowLeft className="text-lg" />
              </button>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-gray-900">
                  Manage Group
                </h1>
                <p className="text-sm font-semibold tracking-wider text-blue-600 uppercase">
                  {group.name}
                </p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 border-b-4 px-6 py-5 text-sm font-black whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "border-blue-600 bg-blue-50/30 text-blue-600"
                    : "border-transparent text-gray-400 hover:bg-gray-50/50 hover:text-gray-700"
                }`}
              >
                <span
                  className={`text-xl transition-all duration-300 ${activeTab === tab.id ? "scale-110 drop-shadow-[0_0_8px_rgba(37,99,235,0.3)]" : "scale-100"}`}
                >
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mx-auto max-w-4xl px-4 pt-10">
        <div className="flex flex-col gap-8">
          {activeTab === "photos" && (
            <PhotosTab avatar={group.avatar} coverImage={group.coverImage} />
          )}

          {activeTab === "general" && <GeneralTab group={group} />}

          {activeTab === "settings" && <SettingsTab group={group} />}
        </div>
      </div>
    </div>
  );
};

export default EditGroupPage;
