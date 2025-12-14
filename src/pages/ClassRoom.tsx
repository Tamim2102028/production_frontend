import React from "react";
import dayjs from "dayjs";
import Header from "../components/ClassRoom/Header";
import ClassroomTabs from "../components/ClassRoom/ClassroomTabs";
import { Routes, Route, Navigate } from "react-router-dom";
import { useMatch } from "react-router-dom";
import Rooms from "../components/ClassRoom/Tabs/Rooms";
import MoreTab from "../components/ClassRoom/Tabs/MoreTab";
import RoomDetails from "./ClassRoom/RoomDetails";
import RoomLive from "./ClassRoom/RoomLive";

// TODO: Define types when API is connected
interface Room {
  id: string;
  name: string;
  university: string;
  department: string;
  year: string;
  semester: string;
  section: string;
  subsection?: string;
  createdAt: string;
  lastActivityAt: string;
}

interface RoomFormValues {
  name: string;
  university: string;
  department: string;
  year: string;
  semester: string;
  section: string;
  subsection?: string;
}

const ClassRoom: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = React.useState<boolean>(false);

  const openCreateForm = () => setShowCreateForm(true);
  const closeCreateForm = () => setShowCreateForm(false);

  // TODO: Get current user from auth context/API
  const currentUserId = "1";

  const handleCreate = (data: RoomFormValues) => {
    const id = `room_${Date.now()}`;

    const room: Room = {
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

    // TODO: Call API to create room
    console.log("TODO: Create room via API", room);
    console.log("TODO: Add creator as member", {
      userId: currentUserId,
      roomId: id,
      role: "creator",
    });

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
