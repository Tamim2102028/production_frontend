import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import Sidebar from "./layout/Sidebar";
import SidebarRight from "./layout/SidebarRight";
import MainContent from "./layout/MainContent";
import { useAppSelector, useAppDispatch } from "./store/hooks";
import { useAuthCheck } from "./hooks/useAuth";
import { clearUser } from "./store/slices/authSlice";

/**
 * ====================================
 * APP COMPONENT - Main Entry Point
 * ====================================
 *
 * App load হলে যা হয়:
 * 1. useAuthCheck() call → /current-user API check
 * 2. isCheckingAuth = true → Loading spinner দেখায়
 * 3. API response এলে:
 *    - Success → user Redux এ save, isAuthenticated = true
 *    - Fail → clearUser, redirect to /login
 * 4. isCheckingAuth = false → Actual UI দেখায়
 *
 * ⚠️ auth:logout Event:
 * axios interceptor থেকে fire হয় যখন refresh token ও fail হয়।
 * এটা listen করে user কে logout করে দেয়।
 */

const App: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  // Redux থেকে auth state নাও
  const { isAuthenticated, isCheckingAuth } = useAppSelector(
    (state) => state.auth
  );

  // ⚠️ IMPORTANT: App load এ auth check করো
  // এটা /current-user call করে cookie valid কিনা check করে
  useAuthCheck();

  // 🔔 Listen for logout event from axios interceptor
  // যখন refresh token expire হয়, axios এই event fire করে
  useEffect(() => {
    const handleLogout = () => {
      dispatch(clearUser());
    };

    window.addEventListener("auth:logout", handleLogout);
    return () => {
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, [dispatch]);

  const isAuthPage = ["/login", "/register"].includes(location.pathname);
  const isMessagesPage = location.pathname === "/messages";
  const isStudyHelperPage = location.pathname === "/study-helper";

  // ⏳ Auth check চলছে - Loading দেখাও
  // এটা না থাকলে logged in user ও flash এ /login দেখবে
  if (isCheckingAuth) {
    return (
      <>
        <Toaster position="top-right" richColors closeButton />
        <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </>
    );
  }

  // For non-authenticated users or auth pages, don't show right sidebar
  const showRightSidebar = isAuthenticated || !isAuthPage;

  if (isAuthPage) {
    return (
      <>
        <Toaster position="top-right" richColors closeButton />
        <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
          <MainContent />
        </div>
      </>
    );
  }

  return (
    <>
      {/* Toast Notifications */}
      <Toaster position="top-right" richColors closeButton />

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
    </>
  );
};

export default App;
