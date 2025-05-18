
import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth-context";

const AuthLayout = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // If still loading auth state, show nothing
  if (loading) {
    return null;
  }

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AuthLayout;
