import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SoundProvider } from "@/lib/sound/SoundProvider";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <SoundProvider>
      <div
        style={{
          minHeight: "100vh",
          background: "var(--page-bg)",
          color: "var(--text-strong)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header />

        <main className="flex-1 container mx-auto px-5 sm:px-8 lg:px-16 pt-32 sm:pt-40 pb-24 max-w-3xl flex flex-col justify-center">
          <p
            className="text-xs font-semibold tracking-[0.25em] uppercase mb-3"
            style={{ color: "var(--brand-gold)" }}
          >
            404 — page not found
          </p>
          <h1
            className="font-bold mb-6"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              color: "var(--text-strong)",
              lineHeight: 1.05,
            }}
          >
            That page doesn't{" "}
            <span style={{ color: "var(--brand-gold)" }}>exist.</span>
          </h1>
          <p
            className="text-base sm:text-lg leading-relaxed mb-10 max-w-xl"
            style={{ color: "var(--text-body)" }}
          >
            You followed a stale link, mistyped a URL, or wandered somewhere I
            haven't built yet. No harm done — try one of these instead.
          </p>

          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              { label: "Home", to: "/", desc: "Start at the top." },
              { label: "Writings", to: "/writings", desc: "Recent notes and essays." },
              { label: "About", to: "/#about", desc: "Background and skills." },
              { label: "Contact", to: "/#contact", desc: "Get in touch." },
            ].map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="group block rounded-xl p-5 transition-colors"
                  style={{
                    background: "var(--surface-1)",
                    border: "1px solid var(--border-medium)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      "color-mix(in srgb, var(--brand-gold) 35%, transparent)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-medium)";
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="text-base font-semibold"
                      style={{ color: "var(--text-strong)" }}
                    >
                      {item.label}
                    </span>
                    <ArrowRight
                      className="w-4 h-4 transition-transform group-hover:translate-x-1"
                      style={{ color: "var(--brand-gold)" }}
                    />
                  </div>
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {item.desc}
                  </p>
                </Link>
              </li>
            ))}
          </ul>

          <p
            className="mt-10 text-xs font-mono"
            style={{ color: "var(--text-very-faint)" }}
          >
            requested: <span style={{ color: "var(--text-soft)" }}>{location.pathname}</span>
          </p>
        </main>

        <Footer />
      </div>
    </SoundProvider>
  );
};

export default NotFound;
