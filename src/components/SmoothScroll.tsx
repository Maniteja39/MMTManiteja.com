import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lightweight Lenis-style smooth scroll using native RAF.
 * Falls back to normal scroll on mobile / touch devices for
 * better UX (Lenis fights with native momentum on iOS).
 *
 * Integrates with GSAP ScrollTrigger by calling
 * ScrollTrigger.update() on every smoothed frame.
 */
const SmoothScroll = () => {
  const rafId = useRef(0);
  const current = useRef(0);
  const target = useRef(0);
  const ease = 0.08; // lower = smoother, higher = snappier

  useEffect(() => {
    // Skip on touch devices — native momentum is better
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const body = document.body;

    const onWheel = (e: WheelEvent) => {
      // Allow normal scroll inside elements with overflow
      const t = e.target as HTMLElement;
      if (t.closest("[data-scroll-lock]")) return;
      e.preventDefault();
      target.current += e.deltaY;
      target.current = Math.max(
        0,
        Math.min(target.current, body.scrollHeight - window.innerHeight)
      );
    };

    // Also sync target when user uses keyboard or scrollbar
    const onScroll = () => {
      if (Math.abs(window.scrollY - current.current) > 80) {
        // user scrolled via scrollbar or keyboard
        target.current = window.scrollY;
        current.current = window.scrollY;
      }
    };

    const tick = () => {
      current.current += (target.current - current.current) * ease;

      // Only apply if delta is visible (> 0.5px)
      if (Math.abs(current.current - target.current) > 0.5) {
        window.scrollTo(0, current.current);
      }

      ScrollTrigger.update();
      rafId.current = requestAnimationFrame(tick);
    };

    // Sync initial position
    current.current = window.scrollY;
    target.current = window.scrollY;

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    rafId.current = requestAnimationFrame(tick);

    // Disable browser smooth scroll (we do it ourselves)
    document.documentElement.style.scrollBehavior = "auto";

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId.current);
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  return null;
};

export default SmoothScroll;
