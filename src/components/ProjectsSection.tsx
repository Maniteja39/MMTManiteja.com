import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: "Scalable Data Pipeline",
    description:
      "Designed and implemented a high-throughput data pipeline processing millions of events in real-time with fault tolerance and low latency.",
    tags: ["Python", "Kafka", "Redis"],
    accent: "#F5B820",
  },
  {
    title: "Microservices Architecture",
    description:
      "Built a robust microservices orchestration layer improving system availability and enabling independent service scaling.",
    tags: ["Go", "Kubernetes", "gRPC"],
    accent: "#6366f1",
  },
  {
    title: "API Gateway & Platform",
    description:
      "Developed a centralized API gateway handling authentication, rate limiting, and request routing for distributed backend services.",
    tags: ["Node.js", "PostgreSQL", "Docker"],
    accent: "#22d3ee",
  },
];

const ProjectsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

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
          scrollTrigger: { trigger: el, start: "top 72%", toggleActions: "play none none none" },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="relative min-h-screen py-20 sm:py-32 flex items-center">
      <div className="container mx-auto px-5 sm:px-8 lg:px-16">
        <p
          className="proj-header text-xs font-semibold tracking-[0.25em] uppercase mb-3"
          style={{ opacity: 0, color: "#F5B820" }}
        >
          003 — Projects
        </p>
        <h2
          className="proj-header font-bold mb-16"
          style={{
            opacity: 0,
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            color: "#e2e8f0",
            lineHeight: 1.1,
          }}
        >
          What I've{" "}
          <span style={{ color: "#22d3ee" }}>built.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.title}
              className="proj-card group relative flex flex-col rounded-2xl p-6 transition-all duration-400 hover:scale-[1.02]"
              style={{
                opacity: 0,
                background: "rgba(4,4,11,0.72)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: `0 0 50px rgba(0,0,0,0.35), 0 0 0 0px ${project.accent}22`,
                transition: "all 0.35s ease, box-shadow 0.35s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  `0 0 50px rgba(0,0,0,0.35), 0 0 30px ${project.accent}30`;
                (e.currentTarget as HTMLDivElement).style.borderColor = `${project.accent}30`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  "0 0 50px rgba(0,0,0,0.35)";
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)";
              }}
            >
              {/* Color accent stripe */}
              <div
                className="w-8 h-1 rounded-full mb-5"
                style={{ background: project.accent, boxShadow: `0 0 12px ${project.accent}80` }}
              />

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "#e2e8f0" }}
              >
                {project.title}
              </h3>

              <p
                className="text-sm leading-relaxed mb-5 flex-1"
                style={{ color: "rgba(226,232,240,0.6)" }}
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

              <a
                href="#"
                className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 group-hover:gap-3"
                style={{ color: project.accent }}
              >
                Learn More <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
