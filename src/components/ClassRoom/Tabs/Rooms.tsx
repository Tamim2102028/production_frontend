import React, { useEffect, useState } from "react";
import RoomForm, { type RoomFormValues } from "../RoomForm";
import RoomCard from "../RoomCard";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import type { RootState } from "../../../store/store";
import {
  toggleRoomStatus,
  selectOpenRooms,
  selectVisibleRoomIds,
  selectHiddenRoomIds,
} from "../../../store/slices/classRoom/classRoomSlice";
import { selectUserById } from "../../../store/slices/profileSlice";

const Rooms: React.FC<{
  showCreateForm?: boolean;
  onCreate?: (data: RoomFormValues) => void;
  onCancelCreate?: () => void;
}> = ({ showCreateForm = false, onCreate, onCancelCreate }) => {
  const dispatch = useAppDispatch();

  // Get current user ID
  const currentUser = useAppSelector((s: RootState) =>
    selectUserById(s, s.profile.id)
  );
  const currentUserId = currentUser?.id || "";

  // Get all non-deleted rooms from Redux
  const allRooms = useAppSelector((s: RootState) => selectOpenRooms(s));

  // Get visible and hidden room IDs from Redux (automatically updates!)
  const visibleRoomIds = useAppSelector((s: RootState) =>
    selectVisibleRoomIds(s, currentUserId)
  );
  const hiddenRoomIds = useAppSelector((s: RootState) =>
    selectHiddenRoomIds(s, currentUserId)
  );

  // Filter rooms based on membership status
  const userOpenRooms = allRooms.filter((r) => visibleRoomIds.includes(r.id));
  const userHiddenRooms = allRooms.filter((r) => hiddenRoomIds.includes(r.id));

  // keep menu state locally
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);

  useEffect(() => {
    // clear any open menu when room lists change
    setMenuOpenFor(null);
  }, [userOpenRooms.length, userHiddenRooms.length]);

  useEffect(() => {
    const onDocClick = () => setMenuOpenFor(null);
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpenFor((prev) => (prev === id ? null : id));
  };

  const toggleRoomStatusLocal = (id: string) => {
    if (!currentUserId) return;

    // Just dispatch the Redux action - selectors will automatically update!
    dispatch(toggleRoomStatus({ userId: currentUserId, roomId: id }));
    setMenuOpenFor(null);
  };

  return (
    <div className="space-y-3">
      {/* header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Rooms</h2>
      </div>

      {/* create room form */}
      {showCreateForm && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow">
          <div>
            <RoomForm
              onSubmit={(d) => onCreate?.(d)}
              onCancel={onCancelCreate}
            />
          </div>
        </div>
      )}

      {/* no rooms message */}
      {userOpenRooms.length + userHiddenRooms.length === 0 ? (
        <div className="rounded-xl border border-gray-300 bg-white p-6 shadow">
          <p className="text-sm text-gray-600">
            No rooms yet. Create one to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {userOpenRooms.map((r) => (
            <RoomCard
              key={r.id}
              room={r}
              menuOpenFor={menuOpenFor}
              toggleMenu={toggleMenu}
              onToggleStatus={toggleRoomStatusLocal}
            />
          ))}
        </div>
      )}

      {userHiddenRooms.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-900">Hidden Rooms</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {userHiddenRooms.map((r) => (
              <RoomCard
                key={r.id}
                room={r}
                menuOpenFor={menuOpenFor}
                toggleMenu={toggleMenu}
                onToggleStatus={toggleRoomStatusLocal}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;
