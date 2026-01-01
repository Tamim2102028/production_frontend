import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import GroupMediaTab from "../../components/Groups/group-tabs-inside/GroupMediaTab";
import GroupAboutTab from "../../components/Groups/group-tabs-inside/GroupAboutTab";
import { useGroupDetails } from "../../hooks/useGroup";
import GroupAccessDenied from "../../components/Groups/utils/GroupAccessDenied";
import GroupBanned from "../../components/Groups/utils/GroupBanned";
import GroupHeader from "../../components/Groups/GroupHeader";
import GroupNavBar from "../../components/Groups/GroupNavBar";
import CreateGroupPost from "../../components/Groups/CreateGroupPost";
import GroupPosts from "../../components/Groups/group-tabs-inside/GroupPosts";
import GroupPinnedPosts from "../../components/Groups/group-tabs-inside/GroupPinnedPosts";
import GroupMembersTab from "../../components/Groups/group-tabs-inside/GroupMembersTab";
import GroupNotFound from "../../components/Groups/utils/GroupNotFound";
import GroupLoading from "../../components/Groups/utils/GroupLoading";

const Marketplace = lazy(
  () => import("../../components/Groups/group-tabs-inside/Marketplace")
);

const GroupDetail: React.FC = () => {
  const { data: response, isLoading, error } = useGroupDetails();
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
  if (meta.isBanned) {
    return <GroupBanned group={group} />;
  }

  if (meta.isRestricted) {
    return <GroupAccessDenied group={group} />;
  }

  return (
    <div className="space-y-5 overflow-hidden">
      <GroupHeader group={group} meta={meta} />

      <div className="mx-auto max-w-5xl">
        <div className="space-y-3 rounded-xl shadow">
          <GroupNavBar />

          <div className="space-y-3">
            <Routes>
              <Route
                index
                element={
                  <>
                    {meta.isMember && <CreateGroupPost groupId={group._id} />}
                    <GroupPosts />
                  </>
                }
              />
              <Route path="pinned" element={<GroupPinnedPosts />} />
              <Route path="members" element={<GroupMembersTab />} />
              <Route path="media" element={<GroupMediaTab />} />
              <Route
                path="marketplace"
                element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <Marketplace />
                  </Suspense>
                }
              />
              <Route path="about" element={<GroupAboutTab group={group} />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetail;
