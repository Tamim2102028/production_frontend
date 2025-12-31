import React from "react";
import {
  FaBuilding,
  FaUniversity,
  FaUsers,
  FaCalendarAlt,
} from "react-icons/fa";

interface Department {
  _id: string;
  name: string;
  code: string;
  description?: string;
  establishedYear?: number;
  postsCount: number;
  institution: {
    _id: string;
    name: string;
    code: string;
  };
}

interface DepartmentsResultsProps {
  isVisible: boolean;
  departments: Department[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const DepartmentsResults: React.FC<DepartmentsResultsProps> = ({
  isVisible,
  departments,
  loading = false,
  onLoadMore,
  hasMore = false,
}) => {
  if (!isVisible) return null;

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Departments</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-4 rounded-lg border p-4">
                <div className="h-12 w-12 rounded-lg bg-gray-200"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                  <div className="h-3 w-1/2 rounded bg-gray-200"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (departments.length === 0) {
    return (
      <div className="py-8 text-center">
        <FaBuilding className="mx-auto mb-4 h-12 w-12 text-gray-400" />
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          No departments found
        </h3>
        <p className="text-gray-600">Try searching with different keywords</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Departments ({departments.length})
      </h3>

      <div className="space-y-3">
        {departments.map((department) => (
          <div
            key={department._id}
            className="flex cursor-pointer items-start space-x-4 rounded-lg border border-gray-200 p-4 transition-all hover:border-blue-300 hover:shadow-md"
          >
            {/* Department Icon */}
            <div className="flex-shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <FaBuilding className="h-6 w-6 text-green-600" />
              </div>
            </div>

            {/* Department Info */}
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center space-x-2">
                <h4 className="text-lg font-semibold text-gray-900">
                  {department.name}
                </h4>
                <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                  {department.code}
                </span>
              </div>

              {/* Institution Info */}
              <div className="mb-2 flex items-center space-x-1 text-sm text-gray-600">
                <FaUniversity className="h-3 w-3" />
                <span>{department.institution.name}</span>
                <span className="text-gray-400">
                  ({department.institution.code})
                </span>
              </div>

              {/* Description */}
              {department.description && (
                <p className="mb-2 line-clamp-2 text-sm text-gray-600">
                  {department.description}
                </p>
              )}

              {/* Additional Info */}
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                {department.establishedYear && (
                  <div className="flex items-center space-x-1">
                    <FaCalendarAlt className="h-3 w-3" />
                    <span>Est. {department.establishedYear}</span>
                  </div>
                )}

                {department.postsCount > 0 && (
                  <div className="flex items-center space-x-1">
                    <FaUsers className="h-3 w-3" />
                    <span>{department.postsCount} posts</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="pt-4 text-center">
          <button
            onClick={onLoadMore}
            className="rounded-lg bg-green-500 px-6 py-2 text-white transition-colors hover:bg-green-600"
          >
            Load More Departments
          </button>
        </div>
      )}
    </div>
  );
};

export default DepartmentsResults;
