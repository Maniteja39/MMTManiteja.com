import { useState, useEffect } from "react";
import { useSound } from "@/lib/sound/SoundProvider";

interface LoadingScreenProps {
  /** Called when the exit animation completes */
  onFinished: () => void;
  /** Minimum ms to hold the screen (lets 3D warm up) */
  minDuration?: number;
}

const LoadingScreen = ({ onFinished, minDuration = 2200 }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const { play } = useSound();

  useEffect(() => {
    const start = Date.now();

    // Simulate load progress
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / minDuration, 1);
      // Ease-out curve so it slows down near 100 %
      setProgress(Math.round(p * p * 100));

      if (p >= 1) {
        clearInterval(interval);
        // Intro chime — no-op if AudioContext hasn't been unlocked yet
        play("chime");
        // Start exit animation
        setExiting(true);
        setTimeout(onFinished, 600); // match CSS transition
      }
    }, 30);

    return () => clearInterval(interval);
  }, [minDuration, onFinished, play]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#04040b",
        transition: "opacity 0.6s ease, visibility 0.6s ease",
        opacity: exiting ? 0 : 1,
        visibility: exiting ? "hidden" : "visible",
      }}
    >
      {/* MMT Hexagon Logo */}
      <svg
        viewBox="-90 -90 180 180"
        width="90"
        height="90"
        style={{
          marginBottom: 28,
          filter: "drop-shadow(0 0 24px rgba(245,184,32,0.4))",
          animation: "loader-pulse 1.6s ease-in-out infinite",
        }}
      >
        <polygon
          points="0,-80 69,-40 69,40 0,80 -69,40 -69,-40"
          fill="#0d1117"
          stroke="#F5B820"
          strokeWidth="3"
          style={{
            strokeDasharray: 480,
            strokeDashoffset: 480 - (480 * progress) / 100,
            transition: "stroke-dashoffset 0.15s ease",
          }}
        />
        <text
          x="0"
          y="-8"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="38"
          fontWeight="bold"
          fill="#F5B820"
          style={{ opacity: progress > 20 ? 1 : 0, transition: "opacity 0.4s" }}
        >
          MM
        </text>
        <text
          x="0"
          y="32"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="22"
          fontWeight="bold"
          fill="#6366f1"
          style={{ opacity: progress > 40 ? 1 : 0, transition: "opacity 0.4s" }}
        >
          T
        </text>
      </svg>

      {/* Progress bar */}
      <div
        style={{
          width: 120,
          height: 2,
          background: "rgba(255,255,255,0.08)",
          borderRadius: 1,
          overflow: "hidden",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "linear-gradient(90deg, #F5B820, #f97316)",
            borderRadius: 1,
            transition: "width 0.15s ease",
            boxShadow: "0 0 8px rgba(245,184,32,0.5)",
          }}
        />
      </div>

      {/* Percentage */}
      <span
        style={{
          fontFamily: "monospace",
          fontSize: 11,
          letterSpacing: "0.15em",
          color: "rgba(226,232,240,0.35)",
        }}
      >
        {progress}%
      </span>

      <style>{`
        @keyframes loader-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
