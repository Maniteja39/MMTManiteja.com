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
    <section ref={sectionRef} id="about" className="relative min-h-screen flex items-center py-32">
      <div className="container mx-auto px-8 lg:px-16">
        {/* Section label */}
        <p
          className="about-in text-xs font-semibold tracking-[0.25em] uppercase mb-4"
          style={{ opacity: 0, color: "#F5B820" }}
        >
          001 — About
        </p>

        {/* Glass panel */}
        <div
          className="about-in rounded-2xl p-8 lg:p-12"
          style={{
            opacity: 0,
            background: "rgba(4,4,11,0.72)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 0 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          {/* Full name — visible to Google and screen readers */}
          <p className="text-sm font-medium mb-2" style={{ color: "rgba(226,232,240,0.45)" }}>
            Maniteja Manchikalapudi
          </p>
          <h2
            className="font-bold mb-10"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              color: "#e2e8f0",
              lineHeight: 1.1,
            }}
          >
            Building things that{" "}
            <span style={{ color: "#F5B820" }}>scale.</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-5">
              <p className="text-base lg:text-lg leading-relaxed" style={{ color: "rgba(226,232,240,0.7)" }}>
                As a Senior Software Engineer at IFS, I bring 6+ years of experience
                designing and building full-stack web applications. From Java and
                Spring Boot backends to Angular frontends, I deliver scalable,
                high-performance solutions end to end.
              </p>
              <p className="text-base lg:text-lg leading-relaxed" style={{ color: "rgba(226,232,240,0.7)" }}>
                I've worked across enterprise SaaS, government contracting, and
                supply chain platforms — optimizing performance, leading migrations,
                and building microservices architectures that serve real business needs.
              </p>
              <div className="flex flex-wrap gap-5 pt-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" style={{ color: "#F5B820" }} />
                  <span className="text-sm" style={{ color: "rgba(226,232,240,0.55)" }}>San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" style={{ color: "#F5B820" }} />
                  <span className="text-sm" style={{ color: "rgba(226,232,240,0.55)" }}>University at Buffalo</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {skills.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 p-4 rounded-xl transition-all duration-300 hover:scale-105"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 0 20px rgba(0,0,0,0.2)",
                  }}
                >
                  <Icon className="w-5 h-5 shrink-0" style={{ color: "#F5B820" }} />
                  <span className="text-sm font-medium" style={{ color: "#e2e8f0" }}>{label}</span>
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
