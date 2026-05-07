import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Linkedin, Menu, X, Volume2, VolumeX, Sun, Moon } from "lucide-react";
import { useSound } from "@/lib/sound/SoundProvider";
import { useTheme } from "@/lib/theme/ThemeContext";

// Section anchors live on "/". Routes are full paths. The "to" field is what we
// render as; on the landing page section links use `#about` directly, elsewhere
// they prefix with `/` so the browser navigates home first.
const NAV_ITEMS: Array<{ label: string; kind: "section" | "route"; target: string }> = [
  { label: "About", kind: "section", target: "about" },
  { label: "Skills", kind: "section", target: "skills" },
  { label: "Experience", kind: "section", target: "experience" },
  { label: "Projects", kind: "section", target: "projects" },
  { label: "Writings", kind: "route", target: "/writings" },
  { label: "Contact", kind: "section", target: "contact" },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { play, muted, toggleMute } = useSound();
  const { theme, toggle: toggleTheme } = useTheme();
  const location = useLocation();
  const onHome = location.pathname === "/";

  // Build the href for a section-style nav item. On the landing page we use
  // the native anchor hash so the browser scrolls; elsewhere we prefix with "/"
  // so react-router navigates home, then the hash resolves.
  const sectionHref = (target: string) => (onHome ? `#${target}` : `/#${target}`);

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
          // Offset by the LiveClock strip (28px) so the two don't overlap.
          top: 28,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: "all 0.4s ease",
          background: scrolled || menuOpen ? "var(--header-bg-scrolled)" : "transparent",
          backdropFilter: scrolled || menuOpen ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled || menuOpen ? "blur(20px)" : "none",
          borderBottom: scrolled
            ? "1px solid var(--border-soft)"
            : "1px solid transparent",
        }}
      >
        <div className="container mx-auto px-5 sm:px-8 lg:px-16 py-4 sm:py-6 flex justify-between items-center">
          {/* Logo — routes home */}
          <Link
            to="/"
            className="text-base font-semibold tracking-wide"
            style={{ color: "var(--text-strong)" }}
            onClick={() => setMenuOpen(false)}
          >
            Maniteja<span style={{ color: "var(--brand-gold)" }}>.</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-8 items-center">
            {NAV_ITEMS.map((item) => {
              const commonProps = {
                className: "text-sm font-medium transition-colors duration-200",
                style: { color: "var(--text-soft)" },
                onMouseEnter: (e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.currentTarget.style.color = "var(--brand-gold)";
                  play("hover");
                },
                onMouseLeave: (e: React.MouseEvent<HTMLAnchorElement>) =>
                  (e.currentTarget.style.color = "var(--text-soft)"),
                onClick: () => play("whoosh"),
              };
              return item.kind === "route" ? (
                <Link key={item.label} to={item.target} {...commonProps}>
                  {item.label}
                </Link>
              ) : (
                <a key={item.label} href={sectionHref(item.target)} {...commonProps}>
                  {item.label}
                </a>
              );
            })}
            <a
              href="https://www.linkedin.com/in/maniteja-m-6987a71b9/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-200"
              style={{ color: "var(--text-soft)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--brand-gold)";
                play("hover");
              }}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text-soft)")
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
                color: muted ? "var(--text-very-faint)" : "var(--brand-gold)",
                background: "transparent",
                border: "none",
                padding: 0,
                display: "flex",
                alignItems: "center",
              }}
              onMouseEnter={(e) => {
                if (muted) e.currentTarget.style.color = "var(--brand-gold)";
              }}
              onMouseLeave={(e) => {
                if (muted) e.currentTarget.style.color = "var(--text-very-faint)";
              }}
            >
              {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            {/* Theme toggle — Sun for "click to go light", Moon for "click to go dark". */}
            <button
              onClick={() => {
                play("click");
                toggleTheme();
              }}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              aria-pressed={theme === "light"}
              className="transition-colors duration-200"
              style={{
                color: "var(--brand-gold)",
                background: "transparent",
                border: "none",
                padding: 0,
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--text-strong)";
                play("hover");
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--brand-gold)";
              }}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </nav>

          {/* Mobile actions — theme toggle + hamburger, always visible on small screens. */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => {
                play("click");
                toggleTheme();
              }}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              aria-pressed={theme === "light"}
              className="flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-200"
              style={{
                color: "var(--brand-gold)",
                background: "var(--surface-2)",
                border: "1px solid var(--border-medium)",
              }}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <button
              className="flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-200"
              style={{
                color: menuOpen ? "var(--brand-gold)" : "var(--text-strong)",
                background: "var(--surface-2)",
                border: "1px solid var(--border-medium)",
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
        </div>
      </header>

      {/* ──────────────── Mobile full-screen overlay ──────────────── */}
      <div
        className="md:hidden fixed inset-0 z-40 flex flex-col"
        style={{
          background: "var(--mobile-overlay-bg)",
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
          {NAV_ITEMS.map((item, i) => {
            const linkStyle = {
              color: "var(--text-strong)",
              transition: `color 0.2s, transform 0.4s ease ${i * 70}ms, opacity 0.4s ease ${i * 70}ms`,
              transform: menuOpen ? "translateY(0)" : "translateY(16px)",
              opacity: menuOpen ? 1 : 0,
            };
            const onClickClose = () => {
              play("whoosh");
              setMenuOpen(false);
            };
            const inner = (
              <>
                <span
                  className="text-xs font-normal tracking-[0.2em] block mb-1"
                  style={{ color: "var(--text-faint)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {item.label}
              </>
            );
            return item.kind === "route" ? (
              <Link
                key={item.label}
                to={item.target}
                className="text-2xl font-semibold tracking-wide text-center"
                style={linkStyle}
                onClick={onClickClose}
              >
                {inner}
              </Link>
            ) : (
              <a
                key={item.label}
                href={sectionHref(item.target)}
                className="text-2xl font-semibold tracking-wide text-center"
                style={linkStyle}
                onClick={onClickClose}
              >
                {inner}
              </a>
            );
          })}

          {/* LinkedIn CTA */}
          <a
            href="https://www.linkedin.com/in/maniteja-m-6987a71b9/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 mt-6 px-6 py-3 rounded-xl font-semibold text-sm"
            style={{
              background: "color-mix(in srgb, var(--brand-gold) 12%, transparent)",
              color: "var(--brand-gold)",
              border: "1px solid color-mix(in srgb, var(--brand-gold) 25%, transparent)",
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
          style={{ background: "color-mix(in srgb, var(--brand-gold) 25%, transparent)" }}
        />
      </div>
    </>
  );
};

export default Header;
