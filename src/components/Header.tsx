import { useState, useEffect } from "react";
import { Linkedin, Menu, X, Volume2, VolumeX } from "lucide-react";
import { useSound } from "@/lib/sound/SoundProvider";

const NAV_ITEMS = ["About", "Skills", "Experience", "Projects", "Contact"];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { play, muted, toggleMute } = useSound();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      if (menuOpen) setMenuOpen(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: "all 0.4s ease",
          background: scrolled || menuOpen ? "rgba(4,4,11,0.92)" : "transparent",
          backdropFilter: scrolled || menuOpen ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled || menuOpen ? "blur(20px)" : "none",
          borderBottom: scrolled
            ? "1px solid rgba(255,255,255,0.06)"
            : "1px solid transparent",
        }}
      >
        <div className="container mx-auto px-5 sm:px-8 lg:px-16 py-4 sm:py-6 flex justify-between items-center">
          {/* Logo */}
          <a
            href="#"
            className="text-base font-semibold tracking-wide"
            style={{ color: "#e2e8f0" }}
            onClick={() => setMenuOpen(false)}
          >
            Maniteja<span style={{ color: "#F5B820" }}>.</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-8 items-center">
            {NAV_ITEMS.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium transition-colors duration-200"
                style={{ color: "rgba(226,232,240,0.55)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#F5B820";
                  play("hover");
                }}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(226,232,240,0.55)")
                }
                onClick={() => play("whoosh")}
              >
                {item}
              </a>
            ))}
            <a
              href="https://www.linkedin.com/in/maniteja-m-6987a71b9/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-200"
              style={{ color: "rgba(226,232,240,0.55)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#F5B820";
                play("hover");
              }}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(226,232,240,0.55)")
              }
              onClick={() => play("click")}
            >
              <Linkedin className="w-5 h-5" />
            </a>

            {/* Mute toggle */}
            <button
              onClick={toggleMute}
              aria-label={muted ? "Unmute sound effects" : "Mute sound effects"}
              aria-pressed={!muted}
              className="transition-colors duration-200"
              style={{
                color: muted ? "rgba(226,232,240,0.35)" : "#F5B820",
                background: "transparent",
                border: "none",
                padding: 0,
                display: "flex",
                alignItems: "center",
              }}
              onMouseEnter={(e) => {
                if (muted) e.currentTarget.style.color = "#F5B820";
              }}
              onMouseLeave={(e) => {
                if (muted) e.currentTarget.style.color = "rgba(226,232,240,0.35)";
              }}
            >
              {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </nav>

          {/* Mobile hamburger button */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-200"
            style={{
              color: menuOpen ? "#F5B820" : "#e2e8f0",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            onClick={() => {
              play(menuOpen ? "menuClose" : "menuOpen");
              setMenuOpen((prev) => !prev);
            }}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      {/* ──────────────── Mobile full-screen overlay ──────────────── */}
      <div
        className="md:hidden fixed inset-0 z-40 flex flex-col"
        style={{
          background: "rgba(4,4,11,0.97)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          transition: "opacity 0.3s ease, visibility 0.3s ease",
          opacity: menuOpen ? 1 : 0,
          visibility: menuOpen ? "visible" : "hidden",
          pointerEvents: menuOpen ? "auto" : "none",
        }}
      >
        {/* Spacer for header */}
        <div className="shrink-0" style={{ height: 72 }} />

        {/* Nav links — centered vertically */}
        <nav className="flex flex-col items-center justify-center flex-1 gap-7 px-8">
          {NAV_ITEMS.map((item, i) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-2xl font-semibold tracking-wide"
              style={{
                color: "rgba(226,232,240,0.85)",
                transition: `color 0.2s, transform 0.4s ease ${i * 70}ms, opacity 0.4s ease ${i * 70}ms`,
                transform: menuOpen ? "translateY(0)" : "translateY(16px)",
                opacity: menuOpen ? 1 : 0,
              }}
              onClick={() => {
                play("whoosh");
                setMenuOpen(false);
              }}
            >
              <span
                className="text-xs font-normal tracking-[0.2em] block mb-1"
                style={{ color: "rgba(245,184,32,0.5)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              {item}
            </a>
          ))}

          {/* LinkedIn CTA */}
          <a
            href="https://www.linkedin.com/in/maniteja-m-6987a71b9/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 mt-6 px-6 py-3 rounded-xl font-semibold text-sm"
            style={{
              background: "rgba(245,184,32,0.12)",
              color: "#F5B820",
              border: "1px solid rgba(245,184,32,0.25)",
              transition: `transform 0.4s ease ${NAV_ITEMS.length * 70}ms, opacity 0.4s ease ${NAV_ITEMS.length * 70}ms`,
              transform: menuOpen ? "translateY(0)" : "translateY(16px)",
              opacity: menuOpen ? 1 : 0,
            }}
            onClick={() => {
              play("click");
              setMenuOpen(false);
            }}
          >
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </a>
        </nav>

        {/* Decorative accent line */}
        <div
          className="mx-auto mb-10 w-10 h-px"
          style={{ background: "rgba(245,184,32,0.25)" }}
        />
      </div>
    </>
  );
};

export default Header;
