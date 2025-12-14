import React from "react";
import dayjs from "dayjs";
import Header from "../components/ClassRoom/Header";
import ClassroomTabs from "../components/ClassRoom/ClassroomTabs";
// Section component removed per request
import { Routes, Route, Navigate } from "react-router-dom";
import { useMatch } from "react-router-dom";
import Rooms from "../components/ClassRoom/Tabs/Rooms";
import MoreTab from "../components/ClassRoom/Tabs/MoreTab";
import RoomDetails from "./ClassRoom/RoomDetails";
import RoomLive from "./ClassRoom/RoomLive";

import { useAppDispatch } from "../store/hooks";
import { updateRoom, addRoomMember } from "../store/slices/classRoom/classRoomSlice";
import type { Room as SampleRoom } from "../data/rooms-data/roomsData";
import type { RoomFormValues } from "../components/ClassRoom/RoomForm";
import { getCurrentUserId } from "../services/userService";

const ClassRoom: React.FC = () => {
  const dispatch = useAppDispatch();
  const [showCreateForm, setShowCreateForm] = React.useState<boolean>(false);

  const openCreateForm = () => setShowCreateForm(true);
  const closeCreateForm = () => setShowCreateForm(false);

  const handleCreate = (data: RoomFormValues) => {
    const id = `room_${Date.now()}`;
    const currentUserId = getCurrentUserId();
    
    const room: SampleRoom = {
      id,
      name: data.name,
      university: data.university,
      department: data.department,
      year: data.year,
      semester: data.semester,
      section: data.section,
      subsection: data.subsection || undefined,
      createdAt: dayjs().toISOString(),
      lastActivityAt: dayjs().toISOString(),
    };
    
    // dispatch to redux slice (updateRoom will add if not existing)
    dispatch(updateRoom(room));
    
    // Add the creator as a room member with "creator" role
    dispatch(
      addRoomMember({
        id: `member_${Date.now()}`,
        userId: currentUserId,
        roomId: id,
        role: "creator",
        joinedAt: dayjs().toISOString(),
        status: "open",
      })
    );
    
    setShowCreateForm(false);
  };

  const matchIndex = useMatch({ path: "/classroom", end: true });

  return (
    <div className="space-y-5">
      <Header onOpenCreate={openCreateForm} showCreate={!!matchIndex} />
      <ClassroomTabs />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-1">
        <main>
          <Routes>
            <Route
              index
              element={
                <Rooms
                  showCreateForm={showCreateForm}
                  onCreate={handleCreate}
                  onCancelCreate={closeCreateForm}
                />
              }
            />
            <Route path="more" element={<MoreTab />} />
            {/* room details route */}
            <Route path="rooms/:roomId" element={<RoomDetails />} />
            <Route path="rooms/:roomId/live" element={<RoomLive />} />
            {/* redirect unknown to index */}
            <Route path="*" element={<Navigate to="." replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default ClassRoom;
