import { ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const projects = [
  {
    title: "Scalable Data Pipeline",
    description:
      "Designed and implemented a high-throughput data pipeline processing millions of events in real-time with fault tolerance and low latency.",
    tags: ["Python", "Kafka", "Redis"],
  },
  {
    title: "Microservices Architecture",
    description:
      "Built a robust microservices orchestration layer improving system availability and enabling independent service scaling.",
    tags: ["Go", "Kubernetes", "gRPC"],
  },
  {
    title: "API Gateway & Platform",
    description:
      "Developed a centralized API gateway handling authentication, rate limiting, and request routing for distributed backend services.",
    tags: ["Node.js", "PostgreSQL", "Docker"],
  },
];

const ProjectsSection = () => {
  const sectionRef = useScrollAnimation<HTMLElement>();

  return (
    <section ref={sectionRef} id="projects" className="py-32">
      <div className="container mx-auto px-8">
        <h2
          className="animate-child text-4xl lg:text-5xl font-bold mb-16 text-center text-foreground"
          style={{ opacity: 0 }}
        >
          Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.title}
              className="animate-child group bg-card p-6 rounded-lg border border-border hover:border-accent/30 transition-all duration-300"
              style={{ opacity: 0 }}
            >
              <div className="aspect-video rounded-md overflow-hidden mb-6 bg-secondary" />
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {project.title}
              </h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium px-3 py-1 rounded-full bg-secondary text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <a
                href="#"
                className="inline-flex items-center gap-1 text-accent font-semibold text-sm group-hover:gap-2 transition-all duration-200"
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
