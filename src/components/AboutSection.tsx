import { Code, Server, Database, Globe } from "lucide-react";

const skills = [
  { icon: Code, label: "TypeScript" },
  { icon: Server, label: "Go" },
  { icon: Database, label: "PostgreSQL" },
  { icon: Globe, label: "AWS" },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-32">
      <div className="container mx-auto px-8">
        <h2 className="text-4xl lg:text-5xl font-bold mb-12 text-center text-foreground">
          About Me
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              I solve complex problems with elegant, performant solutions. With
              8+ years of experience building distributed systems and scalable
              architectures, I approach every challenge with a focus on
              reliability, efficiency, and long-term maintainability.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              From intricate algorithms to production-grade infrastructure, I'm
              driven by a desire to understand the underlying mechanics of
              technology and to craft software that operates with precision.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {skills.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border hover:border-accent/30 transition-colors duration-200"
              >
                <Icon className="w-5 h-5 text-accent" />
                <span className="text-foreground font-medium">{label}</span>
              </div>
            ))}
            <div className="col-span-2 grid grid-cols-2 gap-4 mt-2">
              <div className="p-4 rounded-lg bg-card border border-border text-center">
                <div className="text-3xl font-bold text-accent">8+</div>
                <div className="text-sm text-muted-foreground mt-1">Years Experience</div>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border text-center">
                <div className="text-3xl font-bold text-accent">40+</div>
                <div className="text-sm text-muted-foreground mt-1">Projects Shipped</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
