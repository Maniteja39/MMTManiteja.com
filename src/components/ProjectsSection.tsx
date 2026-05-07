import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSound } from "@/lib/sound/SoundProvider";
import type { SoundName } from "@/lib/sound/SoundEngine";

gsap.registerPlugin(ScrollTrigger);

const projects: Array<{
  title: string;
  description: string;
  tags: string[];
  accent: string;
  sound: SoundName;
}> = [
  {
    title: "Multi-Step Order Workflow (Angular)",
    description:
      "Angular reactive form engine for complex order entry — live address validation, strict IPv4 / email / phone rules, programmatic mat-tab navigation driven by field validity, and session-based form restoration after browser refreshes.",
    tags: ["Angular", "Reactive Forms", "TypeScript", "Material"],
    accent: "#F5B820",
    sound: "projectA",
  },
  {
    title: "API Integration Layer",
    description:
      "Java / Spring Boot service that maps external payloads into a clean internal domain model. Strongly-typed POJOs, disciplined serialization boundaries, and defensive server-side validation for every downstream field.",
    tags: ["Java", "Spring Boot", "REST", "Hibernate"],
    accent: "#6366f1",
    sound: "projectB",
  },
  {
    title: "SLA Reporting & Analytics Engine",
    description:
      "Time-based business-rules engine that computes SLA compliance against business hours, weekends, and federal holidays — with per-tenant overrides. Surfaces response-time metrics and breach alerts to operations dashboards.",
    tags: ["Java", "SQL", "Business Rules", "Reporting"],
    accent: "#22d3ee",
    sound: "projectC",
  },
  {
    title: "Multi-Tenant Business Logic System",
    description:
      "Shared Java service layer that dispatches tenant-specific validation, pricing, and routing rules through a single shared workflow — keeping the core code path clean while isolating per-tenant divergence behind a well-defined strategy interface.",
    tags: ["Java", "Multi-tenant", "Microservices", "SaaS"],
    accent: "#f97316",
    sound: "projectD",
  },
];

const ProjectsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { play } = useSound();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const header = el.querySelectorAll(".proj-header");
      gsap.fromTo(
        header,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 78%", toggleActions: "play none none none" },
        }
      );
      const cards = el.querySelectorAll(".proj-card");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 50, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.13,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 72%",
            toggleActions: "play none none none",
            onEnter: () => play("whoosh"),
          },
        }
      );
    }, el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="relative min-h-screen py-20 sm:py-32 flex items-center">
      <div className="container mx-auto px-5 sm:px-8 lg:px-16">
        <p
          className="proj-header text-xs font-semibold tracking-[0.25em] uppercase mb-3"
          style={{ opacity: 0, color: "var(--brand-gold)" }}
        >
          004 — Projects
        </p>
        <h2
          className="proj-header font-bold mb-16"
          style={{
            opacity: 0,
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            color: "var(--text-strong)",
            lineHeight: 1.1,
          }}
        >
          What I've{" "}
          <span style={{ color: "var(--brand-cyan)" }}>built.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.title}
              className="proj-card group relative flex flex-col rounded-2xl p-6 transition-all duration-400 hover:scale-[1.02]"
              style={{
                opacity: 0,
                background: "color-mix(in srgb, var(--page-bg) 72%, transparent)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid var(--border-medium)",
                boxShadow: `0 0 50px rgba(0,0,0,0.2), 0 0 0 0px ${project.accent}22`,
                transition: "all 0.35s ease, box-shadow 0.35s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  `0 0 50px rgba(0,0,0,0.2), 0 0 30px ${project.accent}30`;
                (e.currentTarget as HTMLDivElement).style.borderColor = `${project.accent}30`;
                play(project.sound);
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  "0 0 50px rgba(0,0,0,0.2)";
                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-medium)";
              }}
            >
              {/* Color accent stripe */}
              <div
                className="w-8 h-1 rounded-full mb-5"
                style={{ background: project.accent, boxShadow: `0 0 12px ${project.accent}80` }}
              />

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-strong)" }}
              >
                {project.title}
              </h3>

              <p
                className="text-sm leading-relaxed mb-5 flex-1"
                style={{ color: "var(--text-muted)" }}
              >
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium px-3 py-1 rounded-full"
                    style={{
                      background: `${project.accent}15`,
                      color: project.accent,
                      border: `1px solid ${project.accent}25`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
