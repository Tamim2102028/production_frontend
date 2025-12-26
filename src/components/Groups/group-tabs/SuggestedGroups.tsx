import { FaLightbulb } from "react-icons/fa";
import GroupCard from "../utils/GroupCard";
import { useSuggestedGroups } from "../../../hooks/useGroup";
import { GROUP_MEMBERSHIP_STATUS } from "../../../constants/group";
import type { GroupCard as GroupCardType } from "../../../types/group.types";

const SuggestedGroups = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useSuggestedGroups(9);

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
      <div className="flex min-h-[200px] items-center justify-center text-red-500">
        Failed to load suggested groups. Please try again later.
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-3 text-xl font-semibold text-gray-900">
        Suggested Groups {totalDocs ? `(${totalDocs})` : ""}
      </h2>

      {groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-12 text-center">
          <div className="mb-4 rounded-full bg-white p-4 shadow-sm">
            <FaLightbulb className="h-8 w-8 text-yellow-500" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No Suggestions Available
          </h3>
          <p className="text-sm font-medium text-gray-500">
            We don't have any group suggestions for you right now. <br />
            Check back later!
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((group: GroupCardType) => (
              <GroupCard
                key={group._id}
                group={group}
                status={GROUP_MEMBERSHIP_STATUS.NOT_JOINED}
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

export default SuggestedGroups;
