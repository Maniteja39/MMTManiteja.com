import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Code2,
  Layout,
  Database,
  Cloud,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { useSound } from "@/lib/sound/SoundProvider";

gsap.registerPlugin(ScrollTrigger);

const groups = [
  {
    icon: Code2,
    title: "Backend",
    accent: "#F5B820",
    items: [
      "Java 8 / 11 / 17",
      "Spring Boot",
      "Hibernate / JPA",
      "REST API design",
      "Microservices",
      "JUnit / Mockito",
    ],
  },
  {
    icon: Layout,
    title: "Frontend",
    accent: "#6366f1",
    items: [
      "Angular (Reactive Forms)",
      "TypeScript",
      "JavaScript (ES6+)",
      "Angular Material",
      "HTML5 / CSS3",
      "State & session restore",
    ],
  },
  {
    icon: Database,
    title: "Data",
    accent: "#22d3ee",
    items: [
      "SQL (MySQL / Postgres / Oracle)",
      "Stored procedures",
      "Pagination & indexing",
      "Hibernate ORM",
      "Query optimization",
    ],
  },
  {
    icon: Workflow,
    title: "Architecture",
    accent: "#f97316",
    items: [
      "Multi-tenant systems",
      "Business rules engines",
      "SLA / time-based logic",
      "Validation-driven workflows",
      "Event-driven pipelines",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Validation & Integration",
    accent: "#a78bfa",
    items: [
      "IPv4 / email / phone validation",
      "Address validation APIs",
      "B2B payload mapping",
      "POJO / DTO modeling",
      "Server- + field-level rules",
    ],
  },
  {
    icon: Cloud,
    title: "Cloud & Tooling",
    accent: "#34d399",
    items: [
      "AWS (Route 53, EC2, S3)",
      "Docker",
      "Jenkins CI/CD",
      "Git",
      "Chrome DevTools",
      "Postman",
    ],
  },
];

const SkillsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { play } = useSound();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const header = el.querySelectorAll(".skills-header");
      gsap.fromTo(
        header,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 78%",
            toggleActions: "play none none none",
          },
        }
      );
      const cards = el.querySelectorAll(".skills-card");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 40, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.08,
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
    <section
      ref={sectionRef}
      id="skills"
      className="relative py-20 sm:py-32"
    >
      <div className="container mx-auto px-5 sm:px-8 lg:px-16">
        <p
          className="skills-header text-xs font-semibold tracking-[0.25em] uppercase mb-3"
          style={{ opacity: 0, color: "#F5B820" }}
        >
          002 — Tech Stack
        </p>
        <h2
          className="skills-header font-bold mb-4"
          style={{
            opacity: 0,
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            color: "#e2e8f0",
            lineHeight: 1.1,
          }}
        >
          Tools I{" "}
          <span style={{ color: "#F5B820" }}>reach for.</span>
        </h2>
        <p
          className="skills-header text-base lg:text-lg leading-relaxed max-w-2xl mb-14"
          style={{ opacity: 0, color: "rgba(226,232,240,0.6)" }}
        >
          A working toolkit built up over six years of shipping full-stack
          features — enterprise Java backends, Angular frontends, and the
          glue in between.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {groups.map(({ icon: Icon, title, accent, items }) => (
            <div
              key={title}
              className="skills-card rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]"
              style={{
                opacity: 0,
                background: "rgba(4,4,11,0.72)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: `0 0 40px rgba(0,0,0,0.3)`,
                transition: "all 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  `0 0 40px rgba(0,0,0,0.3), 0 0 25px ${accent}25`;
                (e.currentTarget as HTMLDivElement).style.borderColor = `${accent}30`;
                play("hover");
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  "0 0 40px rgba(0,0,0,0.3)";
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  "rgba(255,255,255,0.07)";
              }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="p-2.5 rounded-lg shrink-0"
                  style={{
                    background: `${accent}15`,
                    border: `1px solid ${accent}25`,
                  }}
                >
                  <Icon className="w-4 h-4" style={{ color: accent }} />
                </div>
                <h3
                  className="text-base font-semibold"
                  style={{ color: "#e2e8f0" }}
                >
                  {title}
                </h3>
              </div>

              <ul className="space-y-2">
                {items.map((item) => (
                  <li
                    key={item}
                    className="text-sm leading-relaxed pl-4 relative"
                    style={{ color: "rgba(226,232,240,0.65)" }}
                  >
                    <span
                      className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full"
                      style={{ background: `${accent}99` }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
