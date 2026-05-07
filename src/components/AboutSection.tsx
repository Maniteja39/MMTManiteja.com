import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Code, Server, Database, Cloud, GraduationCap, MapPin } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const skills = [
  { icon: Code, label: "Java / Spring Boot" },
  { icon: Server, label: "Angular / JavaScript" },
  { icon: Database, label: "SQL / Hibernate" },
  { icon: Cloud, label: "AWS / Docker" },
];

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const targets = el.querySelectorAll(".about-in");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.14,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="relative min-h-screen flex items-center py-20 sm:py-32">
      <div className="container mx-auto px-5 sm:px-8 lg:px-16">
        {/* Section label */}
        <p
          className="about-in text-xs font-semibold tracking-[0.25em] uppercase mb-4"
          style={{ opacity: 0, color: "var(--brand-gold)" }}
        >
          001 — About
        </p>

        {/* Glass panel */}
        <div
          className="about-in rounded-2xl p-5 sm:p-8 lg:p-12"
          style={{
            opacity: 0,
            background: "color-mix(in srgb, var(--page-bg) 72%, transparent)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid var(--border-medium)",
            boxShadow: "0 0 60px rgba(0,0,0,0.18), inset 0 1px 0 var(--border-soft)",
          }}
        >
          {/* Full name — visible to Google and screen readers */}
          <p className="text-sm font-medium mb-2" style={{ color: "var(--text-soft)" }}>
            Maniteja Manchikalapudi
          </p>
          <h2
            className="font-bold mb-10"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              color: "var(--text-strong)",
              lineHeight: 1.1,
            }}
          >
            Building things that{" "}
            <span style={{ color: "var(--brand-gold)" }}>scale.</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">
            <div className="space-y-4 sm:space-y-5">
              <p className="text-base lg:text-lg leading-relaxed" style={{ color: "var(--text-body)" }}>
                As a Senior Software Engineer at IFS, I bring 6+ years of experience
                designing and building full-stack web applications — from Java and
                Spring Boot backends to Angular reactive forms and dynamic UI
                workflows on the frontend.
              </p>
              <p className="text-base lg:text-lg leading-relaxed" style={{ color: "var(--text-body)" }}>
                I've shipped multi-tenant platforms, API integration layers,
                SLA reporting engines with complex business-hour and holiday
                logic, and validation-heavy order workflows. Most of my work
                lives at the intersection of clean REST APIs, real business
                rules, and the long tail of production edge cases.
              </p>
              <div className="flex flex-wrap gap-5 pt-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" style={{ color: "var(--brand-gold)" }} />
                  <span className="text-sm" style={{ color: "var(--text-soft)" }}>San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" style={{ color: "var(--brand-gold)" }} />
                  <span className="text-sm" style={{ color: "var(--text-soft)" }}>University at Buffalo</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {skills.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 p-4 rounded-xl transition-all duration-300 hover:scale-105"
                  style={{
                    background: "var(--surface-1)",
                    border: "1px solid var(--surface-3)",
                    boxShadow: "0 0 20px rgba(0,0,0,0.08)",
                  }}
                >
                  <Icon className="w-5 h-5 shrink-0" style={{ color: "var(--brand-gold)" }} />
                  <span className="text-sm font-medium" style={{ color: "var(--text-strong)" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
