import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { Download, ArrowRight } from "lucide-react";
import { useSound } from "@/lib/sound/SoundProvider";
import { SEED_POSTS } from "@/data/seedPosts";

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { play } = useSound();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const targets = el.querySelectorAll(".hero-in");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          stagger: 0.18,
          ease: "power3.out",
          delay: 0.4,
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-16 sm:pt-0">
      <div ref={containerRef} className="container mx-auto px-5 sm:px-8 lg:px-16">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <p
            className="hero-in text-xs sm:text-sm font-semibold tracking-[0.2em] sm:tracking-[0.25em] uppercase mb-4 sm:mb-6"
            style={{ opacity: 0, color: "var(--brand-gold)" }}
          >
            Senior Software Engineer
          </p>

          {/* Main headline — clamp goes smaller on mobile */}
          <h1
            className="hero-in font-bold leading-[1.05] tracking-tight mb-6 sm:mb-8"
            style={{
              opacity: 0,
              fontSize: "clamp(2.6rem, 9vw, 8rem)",
              color: "var(--text-strong)",
            }}
          >
            Hi, I'm{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, var(--brand-gold) 0%, var(--brand-orange) 50%, var(--brand-indigo) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Maniteja.
            </span>
          </h1>

          {/* Sub-headline */}
          <p
            className="hero-in text-base sm:text-lg lg:text-xl leading-relaxed mb-8 sm:mb-10 max-w-[52ch]"
            style={{ opacity: 0, color: "var(--text-body)" }}
          >
            Senior Software Engineer at IFS with 6+ years building full-stack
            systems in Java, Spring Boot, and Angular — specializing in
            multi-tenant platforms, B2B integrations, and business-rule engines
            that power real enterprise workflows. Based in San Francisco, CA.
          </p>

          {/* CTAs — stack on very small screens */}
          <div
            className="hero-in flex flex-col sm:flex-row gap-3 sm:gap-4"
            style={{ opacity: 0 }}
          >
            <a
              href="#contact"
              className="px-6 sm:px-8 py-3.5 sm:py-4 font-semibold rounded-md transition-all duration-300 hover:scale-105 text-center text-sm sm:text-base"
              style={{
                background: "linear-gradient(135deg, var(--brand-gold), var(--brand-orange))",
                color: "var(--on-brand-gold)",
                boxShadow: "0 0 30px color-mix(in srgb, var(--brand-gold) 35%, transparent)",
              }}
              onMouseEnter={() => play("hover")}
              onClick={() => play("clickPrimary")}
            >
              Get In Touch
            </a>
            <a
              href="#experience"
              className="px-6 sm:px-8 py-3.5 sm:py-4 font-semibold rounded-md transition-all duration-300 hover:scale-105 text-center text-sm sm:text-base"
              style={{
                background: "var(--surface-1)",
                color: "var(--text-strong)",
                border: "1px solid var(--surface-3)",
                backdropFilter: "blur(8px)",
              }}
              onMouseEnter={() => play("hover")}
              onClick={() => play("click")}
            >
              View Experience
            </a>
            <a
              href="/Maniteja_Manchikalapudi_Resume.pdf"
              download
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 font-semibold rounded-md transition-all duration-300 hover:scale-105 text-center text-sm sm:text-base"
              style={{
                background: "color-mix(in srgb, var(--brand-indigo) 10%, transparent)",
                color: "var(--text-strong)",
                border: "1px solid color-mix(in srgb, var(--brand-indigo) 25%, transparent)",
                backdropFilter: "blur(8px)",
              }}
              onMouseEnter={() => play("hover")}
              onClick={() => play("descend")}
            >
              <Download className="w-4 h-4" />
              Resume
            </a>
          </div>

          {/* Featured writing — links to the most recent post so the hero
              quietly drives readers toward the blog. */}
          {SEED_POSTS.length > 0 && (
            <div
              className="hero-in mt-10 sm:mt-12"
              style={{ opacity: 0 }}
            >
              <Link
                to={`/writings/${SEED_POSTS[0].slug}`}
                className="group inline-flex items-center gap-3 px-4 py-2.5 rounded-full text-sm transition-colors"
                style={{
                  background: "var(--surface-1)",
                  border: "1px solid var(--border-medium)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor =
                    "color-mix(in srgb, var(--brand-gold) 40%, transparent)";
                  play("hover");
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-medium)";
                }}
                onClick={() => play("whoosh")}
              >
                <span
                  className="text-[10px] font-semibold tracking-[0.22em] uppercase"
                  style={{ color: "var(--brand-gold)" }}
                >
                  New
                </span>
                <span style={{ color: "var(--text-strong)" }}>
                  {SEED_POSTS[0].title}
                </span>
                <ArrowRight
                  className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                  style={{ color: "var(--brand-gold)" }}
                />
              </Link>
            </div>
          )}
        </div>

        {/* Scroll indicator — hidden on small phones */}
        <div
          className="hero-in hidden sm:flex absolute bottom-12 left-8 lg:left-16 flex-col items-center gap-2"
          style={{ opacity: 0 }}
        >
          <span
            className="text-xs tracking-widest uppercase"
            style={{ color: "var(--text-faint)" }}
          >
            Scroll
          </span>
          <div
            className="w-px h-12"
            style={{
              background:
                "linear-gradient(to bottom, color-mix(in srgb, var(--brand-gold) 60%, transparent), transparent)",
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
