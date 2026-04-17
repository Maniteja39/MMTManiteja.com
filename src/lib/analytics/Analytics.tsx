import { useEffect, useRef, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { analyticsApi } from "@/lib/api";

/**
 * Tiny privacy-respecting analytics: fires one pageview per route change,
 * and a dwell-time beacon on unload or the next navigation.
 *
 * Session ID is a random UUID in sessionStorage so it resets every new tab/visit.
 * No personal data leaves the browser beyond what's already in the request
 * (path, referrer, User-Agent — all visible to any server anyway).
 */
const SESSION_KEY = "mmt.sessionId";

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = window.sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `s_${Math.random().toString(36).slice(2)}_${Date.now()}`;
    window.sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

/**
 * Honors Do Not Track. Also disables itself in dev (localhost) to keep
 * your dashboard honest.
 */
function analyticsDisabled(): boolean {
  if (typeof navigator === "undefined") return true;
  if (navigator.doNotTrack === "1") return true;
  if (typeof window !== "undefined" &&
      /^(localhost|127\.0\.0\.1|\[::1\])(:|$)/.test(window.location.host)) {
    return true;
  }
  return false;
}

export const Analytics = ({ children }: { children?: ReactNode }) => {
  const location = useLocation();
  const startRef = useRef<number>(Date.now());
  const currentPathRef = useRef<string>(location.pathname + location.search);

  // Fire on every route change + set up the unload beacon lifecycle.
  useEffect(() => {
    if (analyticsDisabled()) return;

    const sessionId = getOrCreateSessionId();
    const path = location.pathname + location.search;
    const referrer = document.referrer || "(direct)";

    // Pageview in — non-blocking fire-and-forget; errors are swallowed
    // so the site never gets interrupted by a backend hiccup.
    analyticsApi.pageview(sessionId, path, referrer).catch(() => {});

    // Reset the timer for this route
    startRef.current = Date.now();
    const pathForThisEffect = path;
    currentPathRef.current = pathForThisEffect;

    const sendDwell = () => {
      const dwellMs = Date.now() - startRef.current;
      // Must use the beacon-compatible endpoint — sendBeacon is the only reliable
      // way to POST on page unload.
      analyticsApi.dwellBeacon(sessionId, pathForThisEffect, dwellMs);
    };

    // On tab close / navigation away — sendBeacon is the right tool.
    const onBeforeUnload = () => sendDwell();
    // Firing on visibilitychange covers mobile Safari which often skips pagehide.
    const onVisibility = () => {
      if (document.visibilityState === "hidden") sendDwell();
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      // SPA route change — also counts as "leaving" the previous page.
      sendDwell();
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // Re-run on path+search change only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search]);

  return <>{children}</>;
};
