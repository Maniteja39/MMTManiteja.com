import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Briefcase } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    title: "Senior Software Engineer",
    company: "IFS",
    type: "Full-time",
    period: "Feb 2026 - Present · 3 mos",
    location: "San Francisco Bay Area · On-site",
    description: [
      "Building backend systems for IFS Loops — the company's enterprise-grade Agentic AI platform that deploys autonomous Digital Workers to automate high-volume industrial operations across manufacturing, energy, utilities, and field service sectors.",
      "Engineering distributed microservices that orchestrate AI agent lifecycles — dynamically spawning, routing, and scaling Digital Workers that handle real-time tasks such as field dispatch, supplier coordination, customer order management, and inventory replenishment.",
      "Designing and optimizing event-driven data pipelines using Kafka capable of processing billions of messages per day with low latency and fault-tolerant reliability across enterprise systems.",
      "Implementing gRPC-based service communication layers and Protobuf message schemas to ensure high-throughput, low-overhead inter-service contracts across the agentic platform.",
      "Integrating observability tooling (Prometheus, Grafana, OpenTelemetry) to provide end-to-end tracing, metrics, and audit-ready compliance for mission-critical agent workflows.",
      "Collaborating with infrastructure and SRE teams to design self-healing, auto-scaling platform components that degrade gracefully under unpredictable industrial workloads.",
    ],
  },
  {
    title: "Full-stack Developer",
    company: "Hughes",
    type: "Contract",
    period: "Nov 2021 - Feb 2026 · 4 yrs 4 mos",
    location: "Germantown, Maryland · Remote",
    description: [
      "Designed, developed, and implemented complete web applications from scratch, including front-end, back-end, database design, and deployments, using Java, Angular, and JavaScript.",
      "Collaborated with cross-functional teams to ensure seamless integration of application components and deliver user-friendly and responsive web solutions.",
      "Optimized application performance by identifying and addressing bottlenecks, resulting in a 25% improvement in load times.",
      "Implemented Agile methodologies to ensure timely delivery of projects and effective communication within the team.",
    ],
  },
  {
    title: "Full Stack Developer",
    company: "iTradeNetwork, Inc.",
    type: "Contract",
    period: "Nov 2020 - Nov 2021 · 1 yr 1 mo",
    location: "Dublin, California",
    description: [
      "Designed, developed, and modified applications using Java/J2EE, Spring Boot, and Angular for SaaS product offerings.",
      "Developed Microservices using Spring Boot and Java 8; responsible for design, development, and integration.",
      "Migrated application from ColdFusion 8 to Java 8/Angular. Involved in CI/CD using Jenkins.",
      "Used Hibernate, SQL Server, and Oracle DB for data persistence and optimization.",
    ],
  },
  {
    title: "Java Developer",
    company: "Centillionz",
    type: "Full-time",
    period: "Jan 2020 - Nov 2020 · 11 mos",
    location: "",
    description: [
      "Designed, developed, and maintained RESTful APIs using Java, Spring Boot, and Hibernate for enterprise applications.",
      "Optimized SQL queries and wrote stored procedures to improve data retrieval efficiency.",
      "Developed unit and integration tests using JUnit and Mockito to ensure application reliability.",
    ],
  },
  {
    title: "Software Engineer Intern",
    company: "Prosurix, Inc.",
    type: "Internship",
    period: "May 2019 - Sep 2019 · 5 mos",
    location: "Buffalo-Niagara Falls Area · Remote",
    description: [
      "Developed Android applications to automate manual data collection and reporting workflows.",
      "Integrated Google Maps APIs and geocoding services for location-based features.",
      "Designed backend using Python (Flask) and MySQL for secure data storage.",
    ],
  },
  {
    title: "Web Development Intern",
    company: "Crest Solutions",
    type: "Part-time",
    period: "May 2016 - Aug 2016 · 4 mos",
    location: "Guntur, Andhra Pradesh, India · On-site",
    description: [
      "Built a mini inventory management web app using HTML, CSS, JavaScript, and PHP.",
      "Designed responsive UI layouts and implemented database connectivity with MySQL.",
    ],
  },
  {
    title: "Software Intern",
    company: "CodeWave Technologies",
    type: "Internship",
    period: "May 2015 - Jul 2015 · 3 mos",
    location: "Visakhapatnam, India · On-site",
    description: [
      "Developed a student record management application using Java Swing and MySQL.",
      "Learned fundamentals of OOP and version control with Git.",
    ],
  },
];

const ExperienceSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      // Header fades in first
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
      // Cards cascade in
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(".exp-card");
        gsap.fromTo(
          cards,
          { opacity: 0, y: 35, x: -20 },
          {
            opacity: 1,
            y: 0,
            x: 0,
            duration: 0.7,
            stagger: 0.09,
            ease: "power2.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="experience" className="relative py-20 sm:py-32">
      <div className="container mx-auto px-5 sm:px-8 lg:px-16">
        {/* Header */}
        <div ref={headerRef} className="mb-14">
          <p
            className="text-xs font-semibold tracking-[0.25em] uppercase mb-3"
            style={{ opacity: 0, color: "#F5B820" }}
          >
            002 — Experience
          </p>
          <h2
            className="font-bold"
            style={{
              opacity: 0,
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              color: "#e2e8f0",
              lineHeight: 1.1,
            }}
          >
            Where I've{" "}
            <span style={{ color: "#6366f1" }}>shipped.</span>
          </h2>
        </div>

        {/* Cards */}
        <div ref={cardsRef} className="max-w-3xl space-y-4">
          {experiences.map((exp, i) => (
            <div
              key={i}
              className="exp-card p-6 rounded-xl transition-all duration-300 hover:scale-[1.01]"
              style={{
                opacity: 0,
                background: "rgba(4,4,11,0.68)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "0 0 40px rgba(0,0,0,0.3)",
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="p-3 rounded-lg shrink-0"
                  style={{ background: "rgba(245,184,32,0.1)", border: "1px solid rgba(245,184,32,0.2)" }}
                >
                  <Briefcase className="w-4 h-4" style={{ color: "#F5B820" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                    <h3 className="text-base font-semibold" style={{ color: "#e2e8f0" }}>
                      {exp.title}
                    </h3>
                    <span
                      className="text-xs font-medium px-2.5 py-1 rounded-full"
                      style={{
                        background: "rgba(99,102,241,0.15)",
                        color: "#818cf8",
                        border: "1px solid rgba(99,102,241,0.25)",
                      }}
                    >
                      {exp.type}
                    </span>
                  </div>
                  <p className="text-sm font-medium mb-1" style={{ color: "#F5B820" }}>
                    {exp.company}
                  </p>
                  <p className="text-xs mb-3" style={{ color: "rgba(226,232,240,0.4)" }}>
                    {exp.period}{exp.location && ` · ${exp.location}`}
                  </p>
                  {exp.description.length > 0 && (
                    <ul className="space-y-2">
                      {exp.description.map((item, j) => (
                        <li
                          key={j}
                          className="text-sm leading-relaxed pl-4 relative"
                          style={{
                            color: "rgba(226,232,240,0.6)",
                          }}
                        >
                          <span
                            className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full"
                            style={{ background: "rgba(245,184,32,0.5)" }}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
