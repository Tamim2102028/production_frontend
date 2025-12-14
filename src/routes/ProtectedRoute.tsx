import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
}) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const location = useLocation();

  // If authentication is required and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    // Redirect to login page with the current location as state
    // so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is authenticated and trying to access auth pages (login/register)
  if (!requireAuth && isAuthenticated) {
    // Redirect to home page
    return <Navigate to="/" replace />;
  }

  // Render children if conditions are met
  return <>{children}</>;
};

export default ProtectedRoute;
