import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { folderContents } from "../../components/FilesAndArchive/PersonalFiles/data/personalFilesData";
import type {
  FileItem,
  BreadcrumbItem,
} from "../../components/FilesAndArchive/PersonalFiles/data/personalFilesData";

// State interface
interface FilesState {
  folderContents: Record<string, FileItem[]>;
  currentPath: BreadcrumbItem[];
}

// Initial state
const initialState: FilesState = {
  folderContents: folderContents,
  currentPath: [],
};

// Helper functions
const getFileTypeFromExtension = (extension: string): string => {
  const imageExts = ["jpg", "jpeg", "png", "gif", "bmp", "svg"];
  const documentExts = ["pdf", "doc", "docx", "txt"];
  const videoExts = ["mp4", "avi", "mov", "wmv"];
  const audioExts = ["mp3", "wav", "flac"];

  if (imageExts.includes(extension)) return "image";
  if (documentExts.includes(extension)) return extension;
  if (videoExts.includes(extension)) return "video";
  if (audioExts.includes(extension)) return "audio";
  return extension;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Create slice
const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    // Set current navigation path
    setCurrentPath: (state, action: PayloadAction<BreadcrumbItem[]>) => {
      state.currentPath = action.payload;
    },

    // Navigate to a folder
    navigateToFolder: (
      state,
      action: PayloadAction<{ id: string; name: string }>
    ) => {
      const { id, name } = action.payload;
      state.currentPath.push({ id, name });
    },

    // Navigate back one level
    navigateBack: (state) => {
      if (state.currentPath.length > 0) {
        state.currentPath.pop();
      }
    },

    // Navigate to specific breadcrumb level
    navigateToBreadcrumb: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index === 0) {
        // Navigating to root level
        state.currentPath = [];
      } else {
        // Navigating to a specific folder level (subtract 1 because root is index 0)
        state.currentPath = state.currentPath.slice(0, index);
      }
    },

    // Create a new folder
    createNewFolder: (state, action: PayloadAction<string>) => {
      const folderName = action.payload.trim();
      if (!folderName) return;

      const currentFolderKey =
        state.currentPath.length === 0
          ? "root"
          : state.currentPath[state.currentPath.length - 1].id;
      const newFolderId = `${currentFolderKey}-${Date.now()}`;

      const newFolder: FileItem = {
        id: newFolderId,
        name: folderName,
        type: "folder",
        createdAt: new Date().toISOString().split("T")[0],
      };

      // Add folder to current directory
      if (!state.folderContents[currentFolderKey]) {
        state.folderContents[currentFolderKey] = [];
      }
      state.folderContents[currentFolderKey].push(newFolder);

      // Initialize empty folder contents
      state.folderContents[newFolderId] = [];
    },

    // Upload files
    uploadFiles: (state, action: PayloadAction<File[]>) => {
      const files = action.payload;
      const currentFolderKey =
        state.currentPath.length === 0
          ? "root"
          : state.currentPath[state.currentPath.length - 1].id;

      const newFiles: FileItem[] = files.map((file) => {
        const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
        const fileType = getFileTypeFromExtension(fileExtension);

        return {
          id: `${currentFolderKey}-file-${Date.now()}-${Math.random()}`,
          name: file.name,
          type: "file",
          size: formatFileSize(file.size),
          createdAt: new Date().toISOString().split("T")[0],
          fileType: fileType,
        };
      });

      // Add files to current directory
      if (!state.folderContents[currentFolderKey]) {
        state.folderContents[currentFolderKey] = [];
      }
      state.folderContents[currentFolderKey].push(...newFiles);
    },

    // Reset to initial state (useful for testing or clearing data)
    resetFiles: (state) => {
      state.folderContents = folderContents;
      state.currentPath = [];
    },

    // Rename a file or folder
    renameItem: (
      state,
      action: PayloadAction<{ itemId: string; newName: string }>
    ) => {
      const { itemId, newName } = action.payload;
      if (!newName.trim()) return;

      // Find and update the item in the current folder
      const currentFolderKey =
        state.currentPath.length === 0
          ? "root"
          : state.currentPath[state.currentPath.length - 1].id;

      const items = state.folderContents[currentFolderKey] || [];
      const itemIndex = items.findIndex((item) => item.id === itemId);

      if (itemIndex !== -1) {
        state.folderContents[currentFolderKey][itemIndex].name = newName.trim();
      }
    },

    // Delete a file or folder
    deleteItem: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;

      // Find and remove the item from the current folder
      const currentFolderKey =
        state.currentPath.length === 0
          ? "root"
          : state.currentPath[state.currentPath.length - 1].id;

      const items = state.folderContents[currentFolderKey] || [];
      const updatedItems = items.filter((item) => item.id !== itemId);
      state.folderContents[currentFolderKey] = updatedItems;

      // If it's a folder, also remove its contents
      if (state.folderContents[itemId]) {
        delete state.folderContents[itemId];
      }
    },

    // Copy a file or folder
    copyItem: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;

      // Find the item to copy
      const currentFolderKey =
        state.currentPath.length === 0
          ? "root"
          : state.currentPath[state.currentPath.length - 1].id;

      const items = state.folderContents[currentFolderKey] || [];
      const itemToCopy = items.find((item) => item.id === itemId);

      if (itemToCopy) {
        const newItemId = `${currentFolderKey}-copy-${Date.now()}`;
        const copiedItem: FileItem = {
          ...itemToCopy,
          id: newItemId,
          name: `${itemToCopy.name} - Copy`,
        };

        state.folderContents[currentFolderKey].push(copiedItem);

        // If it's a folder, copy its contents too
        if (itemToCopy.type === "folder" && state.folderContents[itemId]) {
          state.folderContents[newItemId] = [...state.folderContents[itemId]];
        }
      }
    },

    // Share a file (toggle shared status)
    shareItem: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;

      const currentFolderKey =
        state.currentPath.length === 0
          ? "root"
          : state.currentPath[state.currentPath.length - 1].id;

      const items = state.folderContents[currentFolderKey] || [];
      const itemIndex = items.findIndex((item) => item.id === itemId);

      if (itemIndex !== -1) {
        const currentItem = state.folderContents[currentFolderKey][itemIndex];
        state.folderContents[currentFolderKey][itemIndex] = {
          ...currentItem,
          shared: !currentItem.shared,
        };
      }
    },

    // Toggle public status for a folder
    togglePublic: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;

      // Find the folder in the current directory
      const currentFolderKey =
        state.currentPath.length === 0
          ? "root"
          : state.currentPath[state.currentPath.length - 1].id;

      const items = state.folderContents[currentFolderKey] || [];
      const itemIndex = items.findIndex((item) => item.id === itemId);

      if (itemIndex !== -1 && items[itemIndex].type === "folder") {
        const currentItem = state.folderContents[currentFolderKey][itemIndex];
        state.folderContents[currentFolderKey][itemIndex] = {
          ...currentItem,
          isPublic: !currentItem.isPublic,
        };
      }
    },
  },
});

// Export actions
export const {
  setCurrentPath,
  navigateToFolder,
  navigateBack,
  navigateToBreadcrumb,
  createNewFolder,
  uploadFiles,
  resetFiles,
  renameItem,
  deleteItem,
  copyItem,
  shareItem,
  togglePublic,
} = filesSlice.actions;

// Selectors
export const selectFolderContents = (state: { files: FilesState }) =>
  state.files.folderContents;
export const selectCurrentPath = (state: { files: FilesState }) =>
  state.files.currentPath;

// Selector to get current folder files
export const selectCurrentFiles = (state: {
  files: FilesState;
}): FileItem[] => {
  const { folderContents, currentPath } = state.files;

  if (currentPath.length === 0) {
    return folderContents["root"] || [];
  }

  const currentFolderId = currentPath[currentPath.length - 1].id;
  return folderContents[currentFolderId] || [];
};

// Selector to get breadcrumb path with root
export const selectBreadcrumbPath = (state: {
  files: FilesState;
}): BreadcrumbItem[] => {
  const currentPath = state.files.currentPath;
  return [{ id: "root", name: "My Files" }, ...currentPath];
};

// Export reducer
export default filesSlice.reducer;
