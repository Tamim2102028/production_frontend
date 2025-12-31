import React from "react";
import { FaUniversity, FaMapMarkerAlt, FaGlobe, FaUsers } from "react-icons/fa";

interface Institution {
  _id: string;
  name: string;
  code: string;
  type: string;
  category: string;
  location: string;
  logo?: string;
  website?: string;
  postsCount: number;
}

interface InstitutionsResultsProps {
  isVisible: boolean;
  institutions: Institution[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const InstitutionsResults: React.FC<InstitutionsResultsProps> = ({
  isVisible,
  institutions,
  loading = false,
  onLoadMore,
  hasMore = false,
}) => {
  if (!isVisible) return null;

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Institutions</h3>
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

  if (institutions.length === 0) {
    return (
      <div className="py-8 text-center">
        <FaUniversity className="mx-auto mb-4 h-12 w-12 text-gray-400" />
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          No institutions found
        </h3>
        <p className="text-gray-600">Try searching with different keywords</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Institutions ({institutions.length})
      </h3>

      <div className="space-y-3">
        {institutions.map((institution) => (
          <div
            key={institution._id}
            className="flex cursor-pointer items-center space-x-4 rounded-lg border border-gray-200 p-4 transition-all hover:border-blue-300 hover:shadow-md"
          >
            {/* Institution Logo */}
            <div className="flex-shrink-0">
              {institution.logo ? (
                <img
                  src={institution.logo}
                  alt={institution.name}
                  className="h-12 w-12 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <FaUniversity className="h-6 w-6 text-blue-600" />
                </div>
              )}
            </div>

            {/* Institution Info */}
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center space-x-2">
                <h4 className="truncate text-lg font-semibold text-gray-900">
                  {institution.name}
                </h4>
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                  {institution.code}
                </span>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <FaMapMarkerAlt className="h-3 w-3" />
                  <span>{institution.location}</span>
                </div>

                <div className="flex items-center space-x-1">
                  <span className="capitalize">{institution.type}</span>
                  {institution.category && (
                    <>
                      <span>•</span>
                      <span className="capitalize">{institution.category}</span>
                    </>
                  )}
                </div>

                {institution.postsCount > 0 && (
                  <div className="flex items-center space-x-1">
                    <FaUsers className="h-3 w-3" />
                    <span>{institution.postsCount} posts</span>
                  </div>
                )}
              </div>

              {institution.website && (
                <div className="mt-2">
                  <a
                    href={institution.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaGlobe className="h-3 w-3" />
                    <span>Visit Website</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="pt-4 text-center">
          <button
            onClick={onLoadMore}
            className="rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600"
          >
            Load More Institutions
          </button>
        </div>
      )}
    </div>
  );
};

export default InstitutionsResults;
