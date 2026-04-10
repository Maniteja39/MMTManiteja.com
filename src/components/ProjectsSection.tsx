import { ArrowRight } from "lucide-react";

const projects = [
  {
    title: "Analytics Engine",
    description:
      "Real-time distributed system processing millions of events per second, reducing data latency by 70%.",
    tags: ["Go", "Kafka", "Redis"],
  },
  {
    title: "Microservice Orchestration",
    description:
      "Robust orchestration layer improving service availability from 99.5% to 99.99% uptime.",
    tags: ["Kubernetes", "gRPC", "Prometheus"],
  },
  {
    title: "Performance Profiler",
    description:
      "Profiling tool that identified and resolved bottlenecks, achieving a 30% reduction in API response times.",
    tags: ["Rust", "Flamegraphs", "CLI"],
  },
];

const ProjectsSection = () => {
  return (
    <section id="projects" className="py-32">
      <div className="container mx-auto px-8">
        <h2 className="text-4xl lg:text-5xl font-bold mb-16 text-center text-foreground">
          Selected Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.title}
              className="group bg-card p-6 rounded-lg border border-border hover:border-accent/30 transition-all duration-300"
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
                View Case Study <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
