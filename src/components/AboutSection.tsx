import { Code, Server, Database, Cloud, GraduationCap, MapPin } from "lucide-react";

const skills = [
  { icon: Server, label: "Backend Systems" },
  { icon: Database, label: "Distributed Databases" },
  { icon: Cloud, label: "Cloud Architecture" },
  { icon: Code, label: "API Design" },
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
              As a Senior Backend Engineer at IFS.ai, I design and build scalable,
              high-performance distributed systems. I'm passionate about crafting
              robust backend architectures that power mission-critical applications
              at scale.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              With deep expertise in backend engineering, I focus on building
              reliable, efficient, and maintainable systems. My work spans data
              pipelines, API design, and cloud-native infrastructure.
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
