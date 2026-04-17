import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * LiveClock — a thin status-bar strip fixed to the top of the viewport.
 *
 * - Resolves the visitor's timezone via Intl (no IP geolocation, no tracking).
 * - Ticks once a second; uses tabular figures so the seconds column doesn't shimmy.
 * - Hides itself on /admin/* routes so the admin dashboard stays clean.
 *
 * The Header component is intentionally offset by 28px from the top so this
 * strip can sit above it without overlap.
 */
const CLOCK_HEIGHT = 28;

const LiveClock = () => {
  const location = useLocation();
  const [now, setNow] = useState<Date>(() => new Date());

  // Tick every second. Not aligned to the second boundary — the extra precision
  // isn't worth the ceremony, and the offset is invisible at this scale.
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Resolved TZ info is stable for the session — no need to recompute per tick.
  const tz = useMemo(() => {
    const zone =
      Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    const cityRaw = zone.split("/").pop() ?? zone;
    const city = cityRaw.replace(/_/g, " ").toUpperCase();

    // "PST", "IST", "GMT+5:30" — whatever the browser gives back. Some browsers
    // return long names for non-major zones; we fall back silently if so.
    let abbr = "";
    try {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: zone,
        timeZoneName: "short",
      }).formatToParts(new Date());
      abbr = parts.find((p) => p.type === "timeZoneName")?.value ?? "";
    } catch {
      abbr = "";
    }
    return { zone, city, abbr };
  }, []);

  const timeStr = useMemo(
    () =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: tz.zone,
      }).format(now),
    [now, tz.zone],
  );

  // Keep the admin area free of the public-portfolio chrome.
  if (location.pathname.startsWith("/admin")) return null;

  return (
    <div
      role="status"
      aria-live="off"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: CLOCK_HEIGHT,
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.75rem",
        background: "rgba(4,4,11,0.78)",
        backdropFilter: "blur(14px) saturate(140%)",
        WebkitBackdropFilter: "blur(14px) saturate(140%)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        color: "rgba(226,232,240,0.55)",
        fontSize: "0.68rem",
        letterSpacing: "0.22em",
        fontFamily:
          "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace",
        fontVariantNumeric: "tabular-nums",
        userSelect: "none",
      }}
    >
      {/* pulsing dot */}
      <span
        aria-hidden
        style={{
          display: "inline-block",
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#F5B820",
          boxShadow: "0 0 8px rgba(245,184,32,0.75)",
          animation: "mmt-clock-pulse 1.6s ease-in-out infinite",
        }}
      />

      {/* desktop: full strip */}
      <span className="hidden sm:inline" style={{ color: "rgba(245,184,32,0.75)" }}>
        LIVE
      </span>
      <Divider className="hidden sm:inline" />

      <span style={{ color: "#f1f5f9" }}>{timeStr}</span>

      {tz.abbr && (
        <>
          <Divider />
          <span>{tz.abbr}</span>
        </>
      )}

      {tz.city && (
        <>
          <Divider className="hidden sm:inline" />
          <span className="hidden sm:inline">{tz.city}</span>
        </>
      )}

      <style>{`
        @keyframes mmt-clock-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%     { opacity: 0.3; transform: scale(0.82); }
        }
      `}</style>
    </div>
  );
};

const Divider = ({ className }: { className?: string }) => (
  <span className={className} style={{ opacity: 0.35 }} aria-hidden>
    ·
  </span>
);

export default LiveClock;
export { CLOCK_HEIGHT };
