import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "./AuthContext";

/**
 * Route guard: renders children only if the current user is an admin.
 * While the initial /auth/me probe is in flight, renders a minimal placeholder
 * (no redirect yet) to avoid bouncing refreshed admin sessions to /login.
 */
export const RequireAdmin = ({ children }: { children: ReactNode }) => {
  const { isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(226,232,240,0.5)",
          background: "#04040b",
          fontSize: "0.85rem",
          letterSpacing: "0.2em",
        }}
      >
        CHECKING SESSION…
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};
