import { useEffect, useRef, useState } from "react";

/**
 * Custom glowing cursor — only on desktop (hidden on touch devices).
 *
 * Two elements:
 *  1. Inner dot  — follows mouse tightly (gold glow)
 *  2. Outer ring — follows with delay (creates trailing feel)
 *
 * When hovering over interactive elements (a, button) the ring
 * expands to a "magnetic pull" state.
 */
const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const mouse = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const raf = useRef(0);

  useEffect(() => {
    // Skip on touch devices
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    // Hide default cursor globally
    document.documentElement.style.cursor = "none";

    const move = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      if (!visible) setVisible(true);
    };

    const over = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest("a, button, [data-cursor-hover]");
      setHovering(!!el);
    };

    const leave = () => {
      setVisible(false);
    };

    const tick = () => {
      // Dot follows mouse instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouse.current.x}px, ${mouse.current.y}px)`;
      }

      // Ring follows with lerp
      ring.current.x += (mouse.current.x - ring.current.x) * 0.15;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) scale(${hovering ? 1.8 : 1})`;
      }

      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    document.addEventListener("mouseleave", leave);
    raf.current = requestAnimationFrame(tick);

    // Add cursor:none to all interactive elements so native cursor doesn't flash
    const style = document.createElement("style");
    style.id = "custom-cursor-style";
    style.textContent = `
      *, *::before, *::after { cursor: none !important; }
    `;
    document.head.appendChild(style);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.removeEventListener("mouseleave", leave);
      cancelAnimationFrame(raf.current);
      document.documentElement.style.cursor = "";
      style.remove();
    };
  }, [visible, hovering]);

  // Don't render anything on touch/mobile
  if (typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0)) {
    return null;
  }

  return (
    <>
      {/* Inner dot */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: -4,
          left: -4,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#F5B820",
          boxShadow: "0 0 12px rgba(245,184,32,0.6), 0 0 4px rgba(245,184,32,0.9)",
          pointerEvents: "none",
          zIndex: 99999,
          transition: "opacity 0.2s",
          opacity: visible ? 1 : 0,
          willChange: "transform",
        }}
      />
      {/* Outer ring */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: -20,
          left: -20,
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: hovering
            ? "1.5px solid rgba(245,184,32,0.5)"
            : "1px solid rgba(245,184,32,0.25)",
          background: hovering
            ? "rgba(245,184,32,0.06)"
            : "transparent",
          pointerEvents: "none",
          zIndex: 99998,
          transition: "border 0.3s, background 0.3s, opacity 0.2s, transform 0.15s ease-out",
          opacity: visible ? 1 : 0,
          willChange: "transform",
        }}
      />
    </>
  );
};

export default CustomCursor;
