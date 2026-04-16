import { useEffect, useRef } from "react";
import gsap from "gsap";

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

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
    <section className="relative min-h-screen flex items-center">
      <div ref={containerRef} className="container mx-auto px-8 lg:px-16">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <p
            className="hero-in text-sm font-semibold tracking-[0.25em] uppercase mb-6"
            style={{ opacity: 0, color: "#F5B820", letterSpacing: "0.22em" }}
          >
            Senior Software Engineer
          </p>

          {/* Main headline */}
          <h1
            className="hero-in font-bold leading-[1.0] tracking-tight mb-8"
            style={{
              opacity: 0,
              fontSize: "clamp(3.5rem, 9vw, 8rem)",
              color: "#e2e8f0",
            }}
          >
            Hi, I'm{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #F5B820 0%, #f97316 50%, #6366f1 100%)",
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
            className="hero-in text-lg lg:text-xl leading-relaxed mb-10 max-w-[52ch]"
            style={{ opacity: 0, color: "rgba(226,232,240,0.65)" }}
          >
            Senior Software Engineer at IFS with 6+ years of experience building
            scalable full-stack applications. Based in San Francisco, CA.
          </p>

          {/* CTAs */}
          <div className="hero-in flex gap-4 flex-wrap" style={{ opacity: 0 }}>
            <a
              href="#contact"
              className="px-8 py-4 font-semibold rounded-md transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #F5B820, #f97316)",
                color: "#04040b",
                boxShadow: "0 0 30px rgba(245,184,32,0.35)",
              }}
            >
              Get In Touch
            </a>
            <a
              href="#experience"
              className="px-8 py-4 font-semibold rounded-md transition-all duration-300 hover:scale-105"
              style={{
                background: "rgba(255,255,255,0.05)",
                color: "#e2e8f0",
                border: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(8px)",
              }}
            >
              View Experience
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="hero-in absolute bottom-12 left-8 lg:left-16 flex flex-col items-center gap-2"
          style={{ opacity: 0 }}
        >
          <span className="text-xs tracking-widest uppercase" style={{ color: "rgba(226,232,240,0.35)" }}>
            Scroll
          </span>
          <div
            className="w-px h-12"
            style={{
              background: "linear-gradient(to bottom, rgba(245,184,32,0.6), transparent)",
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
