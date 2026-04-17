import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/AuthContext";
import { ApiError } from "@/lib/api";

const Login = () => {
  const { login, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // If already authenticated, redirect straight to dashboard
  if (!authLoading && isAdmin) {
    const to = (location.state as { from?: Location } | null)?.from?.pathname ?? "/admin";
    return <Navigate to={to} replace />;
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await login(username.trim(), password);
      toast.success("Welcome back.");
      const to = (location.state as { from?: Location } | null)?.from?.pathname ?? "/admin";
      navigate(to, { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        toast.error("Wrong username or password.");
      } else {
        toast.error((err as Error)?.message ?? "Login failed.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#04040b",
        color: "#e2e8f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8 sm:p-10"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Link
          to="/"
          className="text-sm font-semibold tracking-wide"
          style={{ color: "#e2e8f0" }}
        >
          Maniteja<span style={{ color: "#F5B820" }}>.</span>
        </Link>

        <div className="mt-6 mb-8">
          <span
            className="text-xs tracking-[0.25em] block mb-2"
            style={{ color: "rgba(245,184,32,0.6)" }}
          >
            ADMIN
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold" style={{ color: "#f1f5f9" }}>
            Sign in
          </h1>
          <p className="mt-2 text-sm" style={{ color: "rgba(226,232,240,0.55)" }}>
            Credentials are the ones seeded on the API's first boot.
          </p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs tracking-[0.18em]" style={{ color: "rgba(226,232,240,0.55)" }}>
              USERNAME
            </span>
            <input
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-lg px-4 py-3 text-base outline-none focus:ring-2"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#f1f5f9",
              }}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs tracking-[0.18em]" style={{ color: "rgba(226,232,240,0.55)" }}>
              PASSWORD
            </span>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg px-4 py-3 text-base outline-none focus:ring-2"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#f1f5f9",
              }}
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="mt-3 rounded-lg px-5 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-60"
            style={{
              background: "#F5B820",
              color: "#1a1205",
            }}
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
