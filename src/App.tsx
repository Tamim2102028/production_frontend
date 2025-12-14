import React from "react";
import { useLocation } from "react-router-dom";
import { useAppSelector } from "./store/hooks";
import Sidebar from "./layout/Sidebar";
import SidebarRight from "./layout/SidebarRight";
import MainContent from "./layout/MainContent";

const App: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const isAuthPage = ["/login", "/register"].includes(location.pathname);
  const isMessagesPage = location.pathname === "/messages";
  const isStudyHelperPage = location.pathname === "/study-helper";

  // For non-authenticated users or auth pages, don't show right sidebar
  const showRightSidebar = isAuthenticated || !isAuthPage;

  if (isAuthPage) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <MainContent />
      </div>
    );
  }

  return (
    <div className="grid h-screen grid-cols-[15rem_1fr_auto] overflow-hidden">
      {/* Left Sidebar - Navigation */}
      <div className="h-full overflow-y-auto bg-gray-50">
        <Sidebar />
      </div>

      {/* Main Content - Middle Column */}
      <div className="h-full overflow-y-auto">
        <div
          className={
            isMessagesPage || isStudyHelperPage ? "mx-5" : "mx-auto w-[750px]"
          }
        >
          <MainContent />
        </div>
      </div>

      {/* Right Sidebar - Trending/Quick Links */}
      {showRightSidebar && (
        <div className="h-full w-75 overflow-y-auto border-l border-gray-500 bg-white">
          <SidebarRight />
        </div>
      )}
    </div>
  );
};

export default App;
