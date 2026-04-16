import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Download } from "lucide-react";

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
    <section className="relative min-h-screen flex items-center pt-16 sm:pt-0">
      <div ref={containerRef} className="container mx-auto px-5 sm:px-8 lg:px-16">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <p
            className="hero-in text-xs sm:text-sm font-semibold tracking-[0.2em] sm:tracking-[0.25em] uppercase mb-4 sm:mb-6"
            style={{ opacity: 0, color: "#F5B820" }}
          >
            Senior Software Engineer
          </p>

          {/* Main headline — clamp goes smaller on mobile */}
          <h1
            className="hero-in font-bold leading-[1.05] tracking-tight mb-6 sm:mb-8"
            style={{
              opacity: 0,
              fontSize: "clamp(2.6rem, 9vw, 8rem)",
              color: "#e2e8f0",
            }}
          >
            Hi, I'm{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #F5B820 0%, #f97316 50%, #6366f1 100%)",
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
            style={{ opacity: 0, color: "rgba(226,232,240,0.65)" }}
          >
            Senior Software Engineer at IFS with 6+ years of experience building
            scalable full-stack applications. Based in San Francisco, CA.
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
                background: "linear-gradient(135deg, #F5B820, #f97316)",
                color: "#04040b",
                boxShadow: "0 0 30px rgba(245,184,32,0.35)",
              }}
            >
              Get In Touch
            </a>
            <a
              href="#experience"
              className="px-6 sm:px-8 py-3.5 sm:py-4 font-semibold rounded-md transition-all duration-300 hover:scale-105 text-center text-sm sm:text-base"
              style={{
                background: "rgba(255,255,255,0.05)",
                color: "#e2e8f0",
                border: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(8px)",
              }}
            >
              View Experience
            </a>
            <a
              href="/Maniteja_Manchikalapudi_Resume.pdf"
              download
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 font-semibold rounded-md transition-all duration-300 hover:scale-105 text-center text-sm sm:text-base"
              style={{
                background: "rgba(99,102,241,0.1)",
                color: "#e2e8f0",
                border: "1px solid rgba(99,102,241,0.25)",
                backdropFilter: "blur(8px)",
              }}
            >
              <Download className="w-4 h-4" />
              Resume
            </a>
          </div>
        </div>

        {/* Scroll indicator — hidden on small phones */}
        <div
          className="hero-in hidden sm:flex absolute bottom-12 left-8 lg:left-16 flex-col items-center gap-2"
          style={{ opacity: 0 }}
        >
          <span
            className="text-xs tracking-widest uppercase"
            style={{ color: "rgba(226,232,240,0.35)" }}
          >
            Scroll
          </span>
          <div
            className="w-px h-12"
            style={{
              background:
                "linear-gradient(to bottom, rgba(245,184,32,0.6), transparent)",
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
