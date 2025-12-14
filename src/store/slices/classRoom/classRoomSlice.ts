import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import sampleRooms, {
  type Room as SampleRoom,
} from "../../../data/rooms-data/roomsData";
import roomMembers, { 
  type RoomMember 
} from "../../../data/rooms-data/roomMembers";

export interface ClassRoomState {
  rooms: SampleRoom[];
  members: RoomMember[]; // Add members to Redux state
  currentUserId?: string;
}

const initialState: ClassRoomState = {
  rooms: sampleRooms.map((r: SampleRoom) => ({ ...r })),
  members: [...roomMembers], // Initialize with sample data
  currentUserId: undefined,
};

const classRoomSlice = createSlice({
  name: "classRoom",
  initialState,
  reducers: {
    loadRooms(state, action: PayloadAction<SampleRoom[]>) {
      state.rooms = action.payload.map((r) => ({ ...r }));
    },

    setCurrentUser(state, action: PayloadAction<string | undefined>) {
      state.currentUserId = action.payload;
    },

    toggleRoomStatus(
      state,
      action: PayloadAction<{ userId: string; roomId: string }>
    ) {
      // Find the membership and toggle its status
      const { userId, roomId } = action.payload;
      const membership = state.members.find(
        (m) => m.userId === userId && m.roomId === roomId
      );
      
      if (membership) {
        // Toggle between "open" and "hide"
        membership.status = membership.status === "hide" ? "open" : "hide";
      }
    },

    // Member management actions
    makeAdmin(
      state,
      action: PayloadAction<{ userId: string; roomId: string }>
    ) {
      const { userId, roomId } = action.payload;
      const membership = state.members.find(
        (m) => m.userId === userId && m.roomId === roomId
      );

      if (membership && membership.role !== "creator") {
        membership.role = "admin";
      }
    },

    removeAdmin(
      state,
      action: PayloadAction<{ userId: string; roomId: string }>
    ) {
      const { userId, roomId } = action.payload;
      const membership = state.members.find(
        (m) => m.userId === userId && m.roomId === roomId
      );

      if (membership && membership.role === "admin") {
        membership.role = "member";
      }
    },

    removeMember(
      state,
      action: PayloadAction<{ userId: string; roomId: string }>
    ) {
      const { userId, roomId } = action.payload;
      // Remove the membership from the array
      state.members = state.members.filter(
        (m) => !(m.userId === userId && m.roomId === roomId)
      );
    },

    // helpers for future: create/update/delete room
    updateRoom(state, action: PayloadAction<SampleRoom>) {
      const updated = action.payload;
      const idx = state.rooms.findIndex((r: SampleRoom) => r.id === updated.id);
      if (idx >= 0) state.rooms[idx] = { ...updated };
      else state.rooms.push({ ...updated });
    },

    // Add a room member
    addRoomMember(state, action: PayloadAction<RoomMember>) {
      const newMember = action.payload;
      // Check if member already exists
      const exists = state.members.some(
        (m) => m.userId === newMember.userId && m.roomId === newMember.roomId
      );
      if (!exists) {
        state.members.push(newMember);
      }
    },
  },
});

export const {
  loadRooms,
  setCurrentUser,
  toggleRoomStatus,
  makeAdmin,
  removeAdmin,
  removeMember,
  updateRoom,
  addRoomMember,
} = classRoomSlice.actions;
export default classRoomSlice.reducer;

// selectors
export const selectAllRooms = (state: { classRoom: ClassRoomState }) =>
  state.classRoom.rooms.filter((r) => !r.isDeleted);

export const selectOpenRooms = (state: { classRoom: ClassRoomState }) =>
  state.classRoom.rooms.filter((r) => !r.isDeleted);

export const selectHiddenRooms = (state: { classRoom: ClassRoomState }) =>
  state.classRoom.rooms.filter((r) => !r.isDeleted);

export const selectDeletedRooms = (state: { classRoom: ClassRoomState }) =>
  state.classRoom.rooms.filter((r) => r.isDeleted);

// Member selectors
export const selectAllMembers = (state: { classRoom: ClassRoomState }) =>
  state.classRoom.members;

export const selectVisibleRoomIds = (
  state: { classRoom: ClassRoomState },
  userId: string
) =>
  state.classRoom.members
    .filter((m) => m.userId === userId && (m.status === "open" || !m.status))
    .map((m) => m.roomId);

export const selectHiddenRoomIds = (
  state: { classRoom: ClassRoomState },
  userId: string
) =>
  state.classRoom.members
    .filter((m) => m.userId === userId && m.status === "hide")
    .map((m) => m.roomId);

// Helper selectors (like roomMembers.ts helpers but for Redux)
export const selectRoomCreator = (
  state: { classRoom: ClassRoomState },
  roomId: string
) =>
  state.classRoom.members.find(
    (m) => m.roomId === roomId && m.role === "creator"
  )?.userId;

export const selectMemberCount = (
  state: { classRoom: ClassRoomState },
  roomId: string
) => state.classRoom.members.filter((m) => m.roomId === roomId).length;

export const selectAllAdmins = (
  state: { classRoom: ClassRoomState },
  roomId: string
) =>
  state.classRoom.members
    .filter(
      (m) => m.roomId === roomId && (m.role === "admin" || m.role === "creator")
    )
    .map((m) => m.userId);

export const selectIsAdminOrCreator = (
  state: { classRoom: ClassRoomState },
  userId: string,
  roomId: string
) =>
  state.classRoom.members.some(
    (m) =>
      m.userId === userId &&
      m.roomId === roomId &&
      (m.role === "admin" || m.role === "creator")
  );

export const selectRoomMembersForRoom = (
  state: { classRoom: ClassRoomState },
  roomId: string
) => state.classRoom.members.filter((m) => m.roomId === roomId);
