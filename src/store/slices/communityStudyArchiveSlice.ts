import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  coursesData,
  type Course,
} from "../../components/FilesAndArchive/CommunityStudyArchive/data/courses";
import {
  levelsData,
  termsData,
} from "../../components/FilesAndArchive/CommunityStudyArchive/data/levels";

export interface CommunityStudyArchiveState {
  selectedLevel: string;
  selectedTerm: string;
  activeArchiveTab: "official" | "seniors" | "classmates";
  searchQuery: string;
  courses: Course[];
  levels: string[];
  terms: string[];
  currentFolder: {
    courseId: string | null;
    courseName: string | null;
    folderId: string | null;
    folderName: string | null;
  };
  folderPath: Array<{ id: string; name: string }>; // Breadcrumb trail for nested folders
  folderContents: Record<
    string,
    Array<{
      id: string;
      name: string;
      type: "folder" | "file";
      fileCount?: number;
      size?: string;
      uploadedBy?: string;
      uploadDate?: string;
      description?: string;
      url?: string;
      downloads?: number;
      views?: number;
    }>
  >; // Dynamic folder/file contents
}

// Initial state
const initialState: CommunityStudyArchiveState = {
  selectedLevel: "Level 3",
  selectedTerm: "Term 1",
  activeArchiveTab: "official",
  searchQuery: "",
  courses: coursesData,
  levels: levelsData,
  terms: termsData,
  currentFolder: {
    courseId: null,
    courseName: null,
    folderId: null,
    folderName: null,
  },
  folderPath: [],
  folderContents: {}, // Empty initially, will be populated dynamically
};

// Slice
const communityStudyArchiveSlice = createSlice({
  name: "communityStudyArchive",
  initialState,
  reducers: {
    setSelectedLevel: (state, action: PayloadAction<string>) => {
      state.selectedLevel = action.payload;
      // Reset folder view when changing level
      state.currentFolder = {
        courseId: null,
        courseName: null,
        folderId: null,
        folderName: null,
      };
      state.folderPath = [];
    },
    setSelectedTerm: (state, action: PayloadAction<string>) => {
      state.selectedTerm = action.payload;
      // Reset folder view when changing term
      state.currentFolder = {
        courseId: null,
        courseName: null,
        folderId: null,
        folderName: null,
      };
      state.folderPath = [];
    },
    setActiveArchiveTab: (
      state,
      action: PayloadAction<"official" | "seniors" | "classmates">
    ) => {
      state.activeArchiveTab = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    navigateToFolder: (
      state,
      action: PayloadAction<{
        courseId: string;
        courseName: string;
        folderId: string;
        folderName: string;
      }>
    ) => {
      state.currentFolder = action.payload;
      // Reset folderPath and add only the first folder
      const { folderId, folderName } = action.payload;
      state.folderPath = [{ id: folderId, name: folderName }];
    },
    navigateToSubFolder: (
      state,
      action: PayloadAction<{ id: string; name: string }>
    ) => {
      // Add sub-folder to path
      state.folderPath.push(action.payload);
      state.currentFolder.folderId = action.payload.id;
      state.currentFolder.folderName = action.payload.name;
    },
    navigateBack: (state) => {
      if (state.folderPath.length > 1) {
        // Go back one folder level
        state.folderPath.pop();
        const previousFolder = state.folderPath[state.folderPath.length - 1];
        state.currentFolder.folderId = previousFolder.id;
        state.currentFolder.folderName = previousFolder.name;
      } else {
        // Go back to course list
        state.currentFolder = {
          courseId: null,
          courseName: null,
          folderId: null,
          folderName: null,
        };
        state.folderPath = [];
      }
    },
    navigateToBreadcrumb: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index === 0) {
        // Navigate back to course list (clicking "Courses")
        state.currentFolder = {
          courseId: null,
          courseName: null,
          folderId: null,
          folderName: null,
        };
        state.folderPath = [];
      } else if (index === 1) {
        // Navigate back to course main folder (clicking course name)
        // Keep only the first folder in path (main course folder)
        state.folderPath = state.folderPath.slice(0, 1);
        const mainFolder = state.folderPath[0];
        state.currentFolder.folderId = mainFolder.id;
        state.currentFolder.folderName = mainFolder.name;
      } else {
        // Navigate to specific sub-folder in breadcrumb
        // Adjust index because breadcrumb includes "Courses" and "Course Name"
        const folderIndex = index - 2;
        state.folderPath = state.folderPath.slice(0, folderIndex + 1);
        const targetFolder = state.folderPath[folderIndex];
        state.currentFolder.folderId = targetFolder.id;
        state.currentFolder.folderName = targetFolder.name;
      }
    },
    navigateBackToCourses: (state) => {
      state.currentFolder = {
        courseId: null,
        courseName: null,
        folderId: null,
        folderName: null,
      };
      state.folderPath = [];
    },
    createFolderInArchive: (
      state,
      action: PayloadAction<{ parentFolderId: string; folderName: string }>
    ) => {
      const { parentFolderId, folderName } = action.payload;
      const newFolderId = `${parentFolderId}-${Date.now()}`;

      // Initialize parent folder contents if not exists
      if (!state.folderContents[parentFolderId]) {
        state.folderContents[parentFolderId] = [];
      }

      // Add new folder to parent's contents
      state.folderContents[parentFolderId].push({
        id: newFolderId,
        name: folderName,
        type: "folder",
        fileCount: 0,
      });

      // Initialize new folder's contents as empty
      state.folderContents[newFolderId] = [];
    },
    uploadFileToArchive: (
      state,
      action: PayloadAction<{
        folderId: string;
        files: Array<{ name: string; size: string }>;
      }>
    ) => {
      const { folderId, files } = action.payload;

      // Initialize folder contents if not exists
      if (!state.folderContents[folderId]) {
        state.folderContents[folderId] = [];
      }

      // Add files to folder with metadata
      const currentDate = new Date().toLocaleDateString();
      files.forEach((file) => {
        state.folderContents[folderId].push({
          id: `${folderId}-file-${Date.now()}-${Math.random()}`,
          name: file.name,
          type: "file",
          size: file.size,
          uploadedBy: "Current User", // TODO: Get from auth context
          uploadDate: currentDate,
          description: "",
          url: `/files/${file.name}`, // Placeholder URL
          downloads: 0,
          views: 0,
        });
      });
    },
  },
});

// Actions
export const {
  setSelectedLevel,
  setSelectedTerm,
  setActiveArchiveTab,
  setSearchQuery,
  navigateToFolder,
  navigateToSubFolder,
  navigateBack,
  navigateToBreadcrumb,
  navigateBackToCourses,
  createFolderInArchive,
  uploadFileToArchive,
} = communityStudyArchiveSlice.actions;

// Selectors
export const selectSelectedLevel = (state: {
  communityStudyArchive: CommunityStudyArchiveState;
}) => state.communityStudyArchive.selectedLevel;

export const selectSelectedTerm = (state: {
  communityStudyArchive: CommunityStudyArchiveState;
}) => state.communityStudyArchive.selectedTerm;

export const selectActiveArchiveTab = (state: {
  communityStudyArchive: CommunityStudyArchiveState;
}) => state.communityStudyArchive.activeArchiveTab;

export const selectSearchQuery = (state: {
  communityStudyArchive: CommunityStudyArchiveState;
}) => state.communityStudyArchive.searchQuery;

export const selectLevels = (state: {
  communityStudyArchive: CommunityStudyArchiveState;
}) => state.communityStudyArchive.levels;

export const selectTerms = (state: {
  communityStudyArchive: CommunityStudyArchiveState;
}) => state.communityStudyArchive.terms;

// Filtered courses based on selected level and term
export const selectFilteredCourses = (state: {
  communityStudyArchive: CommunityStudyArchiveState;
}) => {
  const { courses, selectedLevel, selectedTerm, searchQuery } =
    state.communityStudyArchive;

  return courses.filter(
    (course) =>
      course.level === selectedLevel &&
      course.term === selectedTerm &&
      (searchQuery === "" ||
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.code.toLowerCase().includes(searchQuery.toLowerCase()))
  );
};

// Theory courses only
export const selectTheoryCourses = (state: {
  communityStudyArchive: CommunityStudyArchiveState;
}) => {
  const filteredCourses = selectFilteredCourses(state);
  return filteredCourses.filter((course) => course.type === "theory");
};

// Sessional courses only
export const selectSessionalCourses = (state: {
  communityStudyArchive: CommunityStudyArchiveState;
}) => {
  const filteredCourses = selectFilteredCourses(state);
  return filteredCourses.filter((course) => course.type === "sessional");
};

// Current folder selector
export const selectCurrentFolder = (state: {
  communityStudyArchive: CommunityStudyArchiveState;
}) => state.communityStudyArchive.currentFolder;

// Check if currently viewing a folder
export const selectIsViewingFolder = (state: {
  communityStudyArchive: CommunityStudyArchiveState;
}) => state.communityStudyArchive.currentFolder.folderId !== null;

// Folder path selector (for breadcrumb)
export const selectFolderPath = (state: {
  communityStudyArchive: CommunityStudyArchiveState;
}) => state.communityStudyArchive.folderPath;

// Breadcrumb path with course name
export const selectBreadcrumbPath = (state: {
  communityStudyArchive: CommunityStudyArchiveState;
}) => {
  const { currentFolder, folderPath } = state.communityStudyArchive;
  if (!currentFolder.courseId) return [];

  return [
    { id: "courses", name: "Courses" },
    { id: currentFolder.courseId, name: currentFolder.courseName || "" },
    ...folderPath,
  ];
};

// Folder contents selector
export const selectFolderContents = (state: {
  communityStudyArchive: CommunityStudyArchiveState;
}) => state.communityStudyArchive.folderContents;

// Current folder's items (folders and files)
export const selectCurrentFolderItems = (state: {
  communityStudyArchive: CommunityStudyArchiveState;
}) => {
  const { currentFolder, folderContents } = state.communityStudyArchive;
  if (!currentFolder.folderId) return [];

  return folderContents[currentFolder.folderId] || [];
};

export default communityStudyArchiveSlice.reducer;
