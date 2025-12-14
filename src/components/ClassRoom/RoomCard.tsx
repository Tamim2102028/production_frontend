import React from "react";
import { Link } from "react-router-dom";
import { FaEllipsisV } from "react-icons/fa";
import type { Room as SampleRoom } from "../../data/rooms-data/roomsData";
import { usersData } from "../../data/profile-data/userData";
import { useAppSelector } from "../../store/hooks";
import { selectUserById } from "../../store/slices/profileSlice";
import { selectHiddenRoomIds } from "../../store/slices/classRoom/classRoomSlice";
import type { RootState } from "../../store/store";

type Props = {
  room: SampleRoom;
  menuOpenFor: string | null;
  toggleMenu: (e: React.MouseEvent, id: string) => void;
  onToggleStatus: (id: string) => void;
};

const RoomCard: React.FC<Props> = ({
  room,
  menuOpenFor,
  toggleMenu,
  onToggleStatus,
}) => {
  const currentUser = useAppSelector((s) => selectUserById(s, s.profile.id));
  
  // Check if this room is hidden using Redux selector
  const hiddenRoomIds = useAppSelector((s: RootState) =>
    selectHiddenRoomIds(s, currentUser?.id || "")
  );
  const isHidden = hiddenRoomIds.includes(room.id);

  // Get room creator from Redux state
  const roomMembers = useAppSelector((s: RootState) => s.classRoom.members);
  const creatorMembership = roomMembers.find(
    (m) => m.roomId === room.id && m.role === "creator"
  );
  const creatorId = creatorMembership?.userId;

  const cover =
    (room as SampleRoom & { coverImage?: string }).coverImage ||
    `https://picsum.photos/seed/${room.id}/400/225`;

  const getCreatorName = (cid?: string) => {
    if (!cid) return undefined;
    const user = usersData.find((u) => u.id === cid);
    return user?.name;
  };
  const creatorName = getCreatorName(creatorId);

  return (
    <div className="overflow-hidden rounded-lg shadow-sm">
      <Link
        to={`/classroom/rooms/${room.id}`}
        className="relative block h-36 w-full bg-gray-100"
      >
        <img
          src={cover}
          alt={room.name}
          className="h-full w-full object-cover"
        />

        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={(e) => toggleMenu(e, room.id)}
            aria-label="room options"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/50"
          >
            <FaEllipsisV className="h-4 w-4" />
          </button>

          {menuOpenFor === room.id && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 mt-2 w-40 rounded bg-white shadow-lg ring-1 ring-black/5"
            >
              <button
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleStatus(room.id);
                }}
              >
                {isHidden ? "Unhide" : "Hide"}
              </button>
            </div>
          )}
        </div>

        <div className="absolute top-0 left-0 w-full bg-black/70 p-2">
          <p className="truncate text-sm font-medium text-white">{room.name}</p>
          {creatorName && (
            <p className="mt-0.5 truncate text-xs text-gray-200">
              <Link
                onClick={(e) => e.stopPropagation()}
                to={`/profile/${creatorId}`}
                className="text-gray-200 hover:underline"
              >
                {creatorName}
              </Link>
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default RoomCard;
