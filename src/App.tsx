import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import Sidebar from "./layout/Sidebar";
import SidebarRight from "./layout/SidebarRight";
import MainContent from "./layout/MainContent";
import { useAppDispatch } from "./store/store.hooks";
import { useAuthCheck, useUser } from "./hooks/useAuth";
import { clearUser } from "./store/slices/authSlice";

/**
 * ====================================
 * APP COMPONENT - Main Entry Point
 * ====================================
 *
 * ✅ PROPER AUTH FLOW:
 *
 * 1. App Load (App.tsx mount):
 *    → useAuthCheck() call
 *    → isCheckingAuth = true
 *    → Loading spinner show করে
 *
 * 2. Auth Check (Background):
 *    → GET /users/current-user API call
 *    → Cookie থেকে accessToken/refreshToken automatically যায়
 *
 * 3. Auth Check Success (User logged in):
 *    → User data পাওয়া গেছে
 *    → Redux এ setUser(userData)
 *    → isAuthenticated = true
 *    → isCheckingAuth = false
 *    → UI render হয়
 *    → ProtectedRoute allow করে
 *
 * 4. Auth Check Failed (User not logged in):
 *    → 401/403 error
 *    → Redux এ clearUser()
 *    → isAuthenticated = false
 *    → isCheckingAuth = false
 *    → ProtectedRoute redirect করে /login এ
 *
 * 5. Login করার পর:
 *    → POST /users/login
 *    → Success → GET /users/current-user (fresh data)
 *    → Redux এ setUser(userData)
 *    → Navigate to "/"
 *
 * 6. Logout করার পর:
 *    → POST /users/logout
 *    → Redux এ clearUser()
 *    → Navigate to "/login"
 *
 * ⚠️ auth:logout Event:
 * Axios interceptor থেকে fire হয় যখন refresh token ও expire/invalid।
 * এটা listen করে automatically user logout করে দেয়।
 */

const App: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  // Redux থেকে auth state
  const { isAuthenticated, isCheckingAuth } = useUser();

  // ⚠️ CRITICAL: App load এ auth check
  // Cookie valid কিনা check করে, valid হলে user data fetch করে Redux এ save করে
  useAuthCheck();

  // 🔔 Global logout event listener
  // Axios interceptor থেকে fire হয় যখন সব token expire
  useEffect(() => {
    const handleLogout = () => {
      console.log("Global logout event received");
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
