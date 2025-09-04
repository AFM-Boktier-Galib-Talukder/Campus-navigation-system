import React from "react";
import { Navigate } from "react-router-dom";
import { useSession } from "./SessionContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSession();

  // Show loading while checking session
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50/90 to-emerald-50/90">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, show the protected component
  return children;
};

export default ProtectedRoute;
