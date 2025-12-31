import { FaUsers } from "react-icons/fa";
import GroupCard from "../utils/GroupCard";
import GroupEmptyState from "../utils/GroupEmptyState";
import GroupErrorState from "../utils/GroupErrorState";
import { useMyGroups } from "../../../hooks/useGroup";

const MyGroups = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useMyGroups(); // Limit handled in service

  const groups = data?.pages.flatMap((page) => page.data.groups) || [];
  const totalDocs = data?.pages[0]?.data.pagination.totalDocs || 0;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-64 animate-pulse rounded-xl bg-gray-200"
          ></div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <GroupErrorState
        message="Failed to load your groups. Please check your connection."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div>
      <h2 className="mb-3 text-xl font-semibold text-gray-900">
        My Groups {totalDocs ? `(${totalDocs})` : ""}
      </h2>

      {groups.length === 0 ? (
        <GroupEmptyState
          icon={FaUsers}
          title="No Groups Joined"
          message={
            <>
              You haven't joined any groups yet. <br />
              Explore suggested groups to find your community.
            </>
          }
          actionLabel="Explore Groups"
          onAction={() => {
            // Logic to switch to Suggested tab could go here if managed by parent
            // Or just navigate/scroll
          }}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((item) => (
              <GroupCard
                key={item.group._id}
                group={item.group}
                meta={item.meta}
              />
            ))}
          </div>

          {/* Load More Button */}
          {hasNextPage && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg disabled:opacity-70"
              >
                {isFetchingNextPage ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Loading more...
                  </>
                ) : (
                  "Load More"
                )}
              </button>
            </div>
          )}

          {/* Loading Skeleton for Next Page */}
          {isFetchingNextPage && (
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="h-64 animate-pulse rounded-xl bg-gray-100"
                ></div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyGroups;
