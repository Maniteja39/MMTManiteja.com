import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { BarChart3, FileText, LogOut, PenSquare } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    color: isActive ? "#F5B820" : "rgba(226,232,240,0.6)",
    borderColor: isActive ? "rgba(245,184,32,0.35)" : "rgba(255,255,255,0.06)",
    background: isActive ? "rgba(245,184,32,0.06)" : "transparent",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#04040b", color: "#e2e8f0" }}>
      {/* Top bar */}
      <header
        className="sticky top-0 z-40 backdrop-blur"
        style={{
          background: "rgba(4,4,11,0.85)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="container mx-auto px-5 sm:px-8 lg:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-sm font-semibold tracking-wide">
              Maniteja<span style={{ color: "#F5B820" }}>.</span>
              <span
                className="ml-2 text-xs tracking-[0.25em]"
                style={{ color: "rgba(245,184,32,0.65)" }}
              >
                ADMIN
              </span>
            </Link>
            <nav className="hidden sm:flex items-center gap-2">
              <NavLink
                to="/admin"
                end
                style={linkStyle}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-medium"
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </NavLink>
              <NavLink
                to="/admin/posts"
                style={linkStyle}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-medium"
              >
                <FileText className="w-4 h-4" />
                Posts
              </NavLink>
              <NavLink
                to="/admin/posts/new"
                style={linkStyle}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-medium"
              >
                <PenSquare className="w-4 h-4" />
                New
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs hidden sm:inline" style={{ color: "rgba(226,232,240,0.5)" }}>
              {user?.username}
            </span>
            <button
              onClick={() => {
                logout();
                navigate("/admin/login", { replace: true });
              }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium"
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(226,232,240,0.7)",
              }}
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-5 sm:px-8 lg:px-12 py-10">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
