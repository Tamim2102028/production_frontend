import React, { useState } from "react";
import { FaArrowLeft, FaFolder, FaFile } from "react-icons/fa";
import ActionBar from "./PersonalFiles/ActionBar";
import Breadcrumb from "./PersonalFiles/Breadcrumb";
import EmptyState from "./PersonalFiles/EmptyState";
import FilesList from "./PersonalFiles/FilesList";
import UploadModal from "./PersonalFiles/UploadModal";
import { inputFolderName, showSuccess } from "../../utils/sweetAlert";
import { formatPostDate, formatPostClock } from "../../utils/dateUtils";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  navigateToFolder,
  navigateBack,
  navigateToBreadcrumb,
  createNewFolder as createFolder,
  uploadFiles as uploadFilesToStore,
  selectCurrentFiles,
  selectCurrentPath,
  selectBreadcrumbPath,
} from "../../store/slices/filesSlice";
import type { RootState } from "../../store/store";
import { selectUserById } from "../../store/slices/profileSlice";
// Note: This view renders a fixed set of folders (Level/Term grid)

const PersonalFiles: React.FC = () => {
  // Redux state and actions
  const dispatch = useAppDispatch();
  const currentPath = useAppSelector(selectCurrentPath);
  const breadcrumbPath = useAppSelector(selectBreadcrumbPath);

  // Local UI state (only for modals and search)
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Navigation functions using Redux actions
  const handleNavigateToFolder = (folderId: string, folderName: string) => {
    dispatch(navigateToFolder({ id: folderId, name: folderName }));
  };

  const handleNavigateToBreadcrumb = (index: number) => {
    dispatch(navigateToBreadcrumb(index));
  };

  const handleNavigateBack = () => {
    dispatch(navigateBack());
  };

  // File management functions using Redux actions

  const handleOpenNewFolder = async () => {
    const folderName = await inputFolderName();

    if (folderName) {
      dispatch(createFolder(folderName));
      showSuccess({ title: "Folder created" });
    }
  };

  const handleUploadFiles = (files: File[]) => {
    dispatch(uploadFilesToStore(files));
  };

  // Current folder files (from store)
  const currentFiles = useAppSelector(selectCurrentFiles);
  // Get raw user fixture so we can read university.year and semester
  const rawUser = useAppSelector((s: RootState) =>
    selectUserById(s, s.profile.id)
  );
  const userLevel = rawUser?.university?.year;
  const userTerm = rawUser?.university?.semester;

  const getFileIcon = (item: { type: string }) => {
    return item.type === "folder" ? (
      <FaFolder className="h-5 w-5 text-blue-600" />
    ) : (
      <FaFile className="h-5 w-5 text-gray-600" />
    );
  };

  // Build the fixed 8-folder grid: Level 1..4 × Term 1..2
  const fixedFolders = [] as { id: string; level: number; term: number }[];
  for (let level = 1; level <= 4; level++) {
    for (let term = 1; term <= 2; term++) {
      const id = `level-${level}-term-${term}`;
      fixedFolders.push({ id, level, term });
    }
  }

  return (
    <div className="space-y-3">
      {/* Action Bar */}
      <ActionBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNewFolder={handleOpenNewFolder}
        onUpload={() => setShowUploadModal(true)}
      />

      {/* Navigation with Back Button and Breadcrumbs */}
      <div className="flex items-center space-x-3">
        {/* Back Button */}
        <button
          onClick={handleNavigateBack}
          disabled={currentPath.length === 0}
          className={`flex h-[38px] items-center justify-center rounded-lg border border-gray-300 px-3 py-2 transition-colors ${
            currentPath.length === 0
              ? "cursor-not-allowed bg-gray-100 text-gray-400"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
          }`}
          title="Go back"
        >
          <FaArrowLeft className="h-4 w-4" />
        </button>

        {/* Breadcrumbs */}
        <Breadcrumb
          currentPath={breadcrumbPath}
          onNavigate={handleNavigateToBreadcrumb}
        />
      </div>

      {/* Content: show fixed Level/Term grid at root, otherwise show real folder contents */}
      <div>
        {currentPath.length === 0 ? (
          <div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {fixedFolders
                .filter((f) =>
                  `Level ${f.level} Term ${f.term}`
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
                .map((folder) => {
                  const folderName = `Level ${folder.level} Term ${folder.term}`;
                  const isHighlighted =
                    userLevel === folder.level && userTerm === folder.term;

                  return (
                    <button
                      key={folder.id}
                      onClick={() =>
                        handleNavigateToFolder(folder.id, folderName)
                      }
                      className={`flex transform flex-col items-start rounded-xl border p-4 shadow-sm transition-all duration-150 hover:shadow-md ${
                        isHighlighted
                          ? "border-blue-300 bg-green-50"
                          : "border-gray-200 bg-white"
                      }`}
                      aria-label={`Open ${folderName}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center rounded-lg bg-blue-100 p-3 text-blue-600">
                          <FaFolder className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <div
                            className={`text-lg font-semibold ${isHighlighted ? "text-green-700" : "text-gray-800"}`}
                          >
                            Level {folder.level}
                          </div>
                          <div
                            className={`text-sm font-semibold ${isHighlighted ? "text-green-600" : "text-gray-600"}`}
                          >
                            Term {folder.term}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>

            {/* If there's an active search but no results, show the EmptyState */}
            {searchQuery &&
              fixedFolders.filter((f) =>
                `Level ${f.level} Term ${f.term}`
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
              ).length === 0 && (
                <div className="mt-6">
                  <EmptyState
                    searchQuery={searchQuery}
                    onNewFolder={handleOpenNewFolder}
                    onUpload={() => setShowUploadModal(true)}
                  />
                </div>
              )}
          </div>
        ) : (
          <div>
            {currentFiles.length > 0 ? (
              <FilesList
                files={currentFiles}
                onFolderClick={handleNavigateToFolder}
                getFileIcon={(item) => getFileIcon(item)}
                formatDate={formatPostDate}
                formatTime={formatPostClock}
              />
            ) : (
              <EmptyState
                searchQuery={searchQuery}
                onNewFolder={handleOpenNewFolder}
                onUpload={() => setShowUploadModal(true)}
              />
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadFiles={handleUploadFiles}
      />
    </div>
  );
};

export default PersonalFiles;
