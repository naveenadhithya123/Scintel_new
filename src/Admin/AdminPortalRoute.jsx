import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { hasAdminSession } from "../auth/adminAuth";
import AdminLogin from "./AdminLogin";

export default function AdminPortalRoute() {
  const location = useLocation();
  const isAuthenticated = hasAdminSession();
  const isLoginPath = location.pathname === "/admin" || location.pathname === "/admin/";

  if (isAuthenticated) {
    return <Outlet />;
  }

  if (isLoginPath) {
    return <AdminLogin />;
  }

  return <Navigate to="/admin" replace state={{ from: location }} />;
}
