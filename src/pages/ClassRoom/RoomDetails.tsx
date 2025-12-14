import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaUsers, FaImage, FaInfoCircle, FaThumbtack } from "react-icons/fa";
import { BsPostcard } from "react-icons/bs";
import sampleRooms, { type Room } from "../../data/rooms-data/roomsData";
import { usersData } from "../../data/profile-data/userData";
import { roomPosts } from "../../data/rooms-data/roomPostData";
import CreatePostForm from "../../components/ClassRoom/CreatePostForm";
import PostsTab from "../../components/ClassRoom/detailsPageTabs/PostsTab";
import PinnedTab from "../../components/ClassRoom/detailsPageTabs/PinnedTab";
import MembersTab from "../../components/ClassRoom/detailsPageTabs/MembersTab";
import MediaTab from "../../components/ClassRoom/detailsPageTabs/MediaTab";
import AboutTab from "../../components/ClassRoom/detailsPageTabs/AboutTab";
import { addReply } from "../../store/slices/classRoom/roomPostsSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectUserById } from "../../store/slices/profileSlice";
import confirm from "../../utils/sweetAlert";
import {
  updateRoom,
  makeAdmin,
  removeAdmin,
  removeMember,
  selectRoomCreator,
  selectMemberCount,
  selectAllAdmins,
  selectIsAdminOrCreator,
} from "../../store/slices/classRoom/classRoomSlice";

const RoomDetails: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();

  // Get room from Redux state first, fallback to sample data
  const roomFromRedux = useAppSelector((s) =>
    s.classRoom.rooms.find((r) => r.id === roomId)
  );
  const roomFromSample = sampleRooms.find((r) => r.id === roomId);
  const room: Room | undefined = roomFromRedux || roomFromSample;

  // keep a local editable copy so we can remove members / promote admins in-memory
  const [roomState, setRoomState] = useState<Room | undefined>(
    room ? { ...room } : undefined
  );

  const [activeTab, setActiveTab] = useState<
    "posts" | "pinned" | "members" | "media" | "about"
  >("posts");

  const tabs: Array<{
    id: "posts" | "pinned" | "members" | "media" | "about";
    label: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }> = [
    { id: "posts", label: "Posts", icon: BsPostcard },
    { id: "pinned", label: "Pinned", icon: FaThumbtack },
    { id: "members", label: "Members", icon: FaUsers },
    { id: "media", label: "Files", icon: FaImage },
    { id: "about", label: "About", icon: FaInfoCircle },
  ];

  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((s) => selectUserById(s, s.profile.id));
  const navigate = useNavigate();

  // Use Redux selectors (like helper functions)
  const creatorId = useAppSelector((s) =>
    room ? selectRoomCreator(s, room.id) : undefined
  );
  const memberCount = useAppSelector((s) =>
    room ? selectMemberCount(s, room.id) : 0
  );
  const allAdmins = useAppSelector((s) =>
    room ? selectAllAdmins(s, room.id) : []
  );
  const isCurrentUserAdminOrCreator = useAppSelector((s) =>
    room && currentUser
      ? selectIsAdminOrCreator(s, currentUser.id, room.id)
      : false
  );

  const creator = creatorId
    ? usersData.find((u) => u.id === creatorId)
    : undefined;

  // Update roomState when room changes
  React.useEffect(() => {
    if (room) {
      setRoomState({ ...room });
    }
  }, [room]);

  const [showReplyFor, setShowReplyFor] = useState<Record<string, boolean>>({});
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [showCreatePost, setShowCreatePost] = useState(false);
  const postsFromStore = useAppSelector((s) => s.roomPosts?.posts || roomPosts);

  const toggleReply = (postId: string) =>
    setShowReplyFor((s) => ({ ...s, [postId]: !s[postId] }));

  const submitReply = (postId: string) => {
    const text = (replyText[postId] || "").trim();
    if (!text) return;

    const newReply = {
      id: `reply-${postId}-${Date.now()}`,
      authorId: currentUser?.id,
      content: text,
      createdAt: new Date().toISOString(),
    };
    dispatch(addReply({ postId, reply: newReply }));
    setReplyText((r) => ({ ...r, [postId]: "" }));
    setShowReplyFor((s) => ({ ...s, [postId]: false }));
  };

  if (!room) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">Room Not Found</h2>
        <p className="mt-2 text-gray-600">
          The room you're looking for doesn't exist or has been removed.
        </p>
        <div className="mt-4">
          <Link to="/classroom" className="text-blue-600 hover:underline">
            Back to Rooms
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header section */}
      <div className="rounded-lg border border-gray-300 bg-white p-3 shadow-sm">
        <div className="grid grid-cols-[auto_1fr_auto] gap-3">
          <img
            src={
              room.coverImage || `https://picsum.photos/seed/${room.id}/600/300`
            }
            alt={room.name}
            className="h-36 w-64 rounded object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{room.name}</h1>
            {creator && (
              <div className="mt-1">
                <div className="font-semibold text-gray-900">
                  <Link
                    to={`/profile/${creator.id}`}
                    className="cursor-pointer transition-colors hover:text-blue-600 hover:underline"
                  >
                    {creator.name}
                  </Link>
                </div>
              </div>
            )}
            <p className="mt-2 flex items-center gap-2 text-sm text-gray-700">
              <FaUsers className="h-4 w-4 text-gray-500" />
              <span className="font-medium">{memberCount} members</span>
            </p>
          </div>
          <div className="flex flex-col items-end justify-end gap-2">
            {/* Go Live button shown to admins and creator only */}
            {currentUser?.id && isCurrentUserAdminOrCreator ? (
              <button
                onClick={() => navigate(`/classroom/rooms/${room.id}/live`)}
                className="w-full rounded bg-green-600 px-3 py-1 text-sm font-medium text-white hover:bg-green-700"
              >
                Go live
              </button>
            ) : null}

            <button
              onClick={() => {
                setActiveTab("posts");
                setShowCreatePost(true);
              }}
              className="w-full rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700"
            >
              Create post
            </button>
          </div>
        </div>
      </div>

      <div />
      {/* post create form if clicked on create post button */}
      {showCreatePost && (
        <div className="mt-3">
          <CreatePostForm
            roomId={room.id}
            currentUserId={currentUser?.id}
            onClose={() => setShowCreatePost(false)}
          />
        </div>
      )}

      {/* Tabs container & content */}
      <div className="mx-auto max-w-5xl rounded-lg bg-white shadow">
        <div className="border-b border-gray-200 bg-white">
          <div className="flex justify-between px-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 border-b-2 px-6 py-4 font-semibold transition-colors ${activeTab === tab.id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-900"}`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3">
          {activeTab === "posts" && (
            <div className="space-y-3">
              <PostsTab
                roomId={roomState?.id || room!.id}
                posts={postsFromStore}
                users={usersData}
                showReplyFor={showReplyFor}
                replyText={replyText}
                toggleReply={toggleReply}
                setReplyText={setReplyText}
                submitReply={submitReply}
                currentUserId={currentUser?.id}
                creatorId={creatorId}
                admins={allAdmins}
              />
            </div>
          )}

          {activeTab === "pinned" && (
            <PinnedTab
              roomId={roomState?.id || room!.id}
              users={usersData}
              creatorId={creatorId}
              admins={allAdmins}
              currentUserId={currentUser?.id}
              showReplyFor={showReplyFor}
              replyText={replyText}
              toggleReply={toggleReply}
              setReplyText={setReplyText}
              submitReply={submitReply}
            />
          )}

          {/* live is a dedicated page now; we navigate to /classroom/rooms/:roomId/live */}

          {activeTab === "members" && (
            <MembersTab
              roomId={room.id}
              users={usersData}
              onRemoveMember={async (id: string) => {
                const ok = await confirm({
                  title: "Remove member?",
                  text: "This user will be removed from the room.",
                  confirmButtonText: "Yes, remove",
                  icon: "warning",
                });
                if (ok) {
                  dispatch(removeMember({ userId: id, roomId: room.id }));
                }
              }}
              onMakeAdmin={(id: string) => {
                dispatch(makeAdmin({ userId: id, roomId: room.id }));
              }}
              onRemoveAdmin={(id: string) => {
                dispatch(removeAdmin({ userId: id, roomId: room.id }));
              }}
            />
          )}

          {activeTab === "media" && (
            <MediaTab
              roomId={room.id}
              creatorId={creatorId}
              admins={allAdmins}
              currentUserId={currentUser?.id}
            />
          )}

          {activeTab === "about" && (
            <AboutTab
              room={roomState || room}
              creator={
                creator
                  ? {
                      id: creator.id,
                      name: creator.name,
                      username: creator.username,
                      avatar: creator.avatar,
                    }
                  : undefined
              }
              admins={allAdmins}
              memberCount={memberCount}
              users={usersData}
              currentUserId={currentUser?.id}
              roomId={room.id}
              onDeleteRoom={() => {
                // mark room as deleted in local state & store then navigate back
                if (roomState) setRoomState({ ...roomState, isDeleted: true });
                dispatch(
                  updateRoom({ ...(roomState || room), isDeleted: true })
                );
                // use SPA navigation to avoid full page reload
                navigate("/classroom");
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
