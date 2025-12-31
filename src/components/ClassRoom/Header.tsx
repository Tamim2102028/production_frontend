import React from "react";
import { FaPlus } from "react-icons/fa";

const Header: React.FC<{ onOpenCreate?: () => void; showCreate?: boolean }> = ({
  onOpenCreate,
  showCreate = true,
}) => {
  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ClassRoom</h1>
        <p className="text-gray-600">Join and manage your online classes.</p>
      </div>
      <div>
        {showCreate && (
          <button
            onClick={() => onOpenCreate?.()}
            className="flex items-center gap-2 rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition-colors hover:border-blue-400 hover:bg-blue-100"
          >
            <FaPlus className="h-4 w-4" />
            Create Room
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
