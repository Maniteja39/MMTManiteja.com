import { Code, Server, Database, Cloud, GraduationCap, MapPin } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const skills = [
  { icon: Code, label: "Java / Spring Boot" },
  { icon: Server, label: "Angular / JavaScript" },
  { icon: Database, label: "SQL / Hibernate" },
  { icon: Cloud, label: "AWS / Docker" },
];

const AboutSection = () => {
  const sectionRef = useScrollAnimation<HTMLElement>();

  return (
    <section ref={sectionRef} id="about" className="py-32">
      <div className="container mx-auto px-8">
        <h2
          className="animate-child text-4xl lg:text-5xl font-bold mb-12 text-center text-foreground"
          style={{ opacity: 0 }}
        >
          About Me
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="animate-child space-y-6" style={{ opacity: 0 }}>
            <p className="text-lg text-muted-foreground leading-relaxed">
              As a Senior Software Engineer at IFS, I bring 6+ years of experience
              designing and building full-stack web applications. From Java and
              Spring Boot backends to Angular frontends, I deliver scalable,
              high-performance solutions end to end.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              I've worked across enterprise SaaS, government contracting, and
              supply chain platforms — optimizing performance, leading migrations,
              and building microservices architectures that serve real business needs.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-accent" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <GraduationCap className="w-4 h-4 text-accent" />
                <span>University at Buffalo</span>
              </div>
            </div>
          </div>
          <div className="animate-child grid grid-cols-2 gap-4" style={{ opacity: 0 }}>
            {skills.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border hover:border-accent/30 transition-colors duration-200"
              >
                <Icon className="w-5 h-5 text-accent" />
                <span className="text-foreground font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
