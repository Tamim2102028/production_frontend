import React from "react";
import { useParams, Routes, Route } from "react-router-dom";
import GroupMediaTab from "./GroupMediaTab";
import GroupAboutTab from "./GroupAboutTab";
import { useGroupDetails } from "../../hooks/useGroup";
import GroupAccessDenied from "./utils/GroupAccessDenied";
import GroupHeader from "./GroupHeader";
import GroupNavBar from "./GroupNavBar";
import CreateGroupPost from "./CreateGroupPost";
import GroupPosts from "./GroupPosts";
import GroupPinnedPosts from "./GroupPinnedPosts";
import GroupMembersTab from "./GroupMembersTab";
import GroupNotFound from "./utils/GroupNotFound";
import GroupLoading from "./utils/GroupLoading";

const GroupDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: response, isLoading, error } = useGroupDetails(slug!);
  // const error = apiError; // Uncomment this line and remove above block to revert
  const group = response?.data?.group;
  const meta = response?.data?.meta;

  // Loading State
  if (isLoading) {
    return <GroupLoading />;
  }

  // Error State or Not Found
  if (error || !group || !meta) {
    return <GroupNotFound error={error} />;
  }

  // Access Control Check
  if (meta.isRestricted) {
    return <GroupAccessDenied group={group} />;
  }

  return (
    <div className="space-y-5 overflow-hidden">
      <GroupHeader group={group} meta={meta} />

      <div className="mx-auto max-w-5xl">
        <div className="rounded-xl bg-white shadow">
          <GroupNavBar />

          <div className="p-3">
            <Routes>
              <Route
                index
                element={
                  <>
                    {meta.isMember && <CreateGroupPost groupId={group._id} />}
                    <GroupPosts groupId={group._id} />
                  </>
                }
              />
              <Route
                path="pinned"
                element={<GroupPinnedPosts groupId={group._id} />}
              />
              <Route
                path="members"
                element={
                  <GroupMembersTab
                    groupId={group._id}
                    isOwner={meta.isOwner}
                    isAdmin={meta.isAdmin}
                  />
                }
              />
              <Route path="media" element={<GroupMediaTab />} />
              <Route path="about" element={<GroupAboutTab group={group} />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetail;
