import { Briefcase } from "lucide-react";

const experiences = [
  {
    title: "Senior Backend Engineer",
    company: "IFS.ai",
    period: "Present",
    description:
      "Designing and building scalable, high-performance distributed systems and backend architectures for AI-powered enterprise solutions.",
  },
];

const ExperienceSection = () => {
  return (
    <section id="experience" className="py-32">
      <div className="container mx-auto px-8">
        <h2 className="text-4xl lg:text-5xl font-bold mb-16 text-center text-foreground">
          Experience
        </h2>
        <div className="max-w-3xl mx-auto space-y-8">
          {experiences.map((exp) => (
            <div
              key={exp.company}
              className="p-6 rounded-lg bg-card border border-border hover:border-accent/30 transition-colors duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-md bg-secondary">
                  <Briefcase className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="text-xl font-semibold text-foreground">
                      {exp.title}
                    </h3>
                    <span className="text-sm text-accent font-medium">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-accent font-medium mt-1">{exp.company}</p>
                  <p className="text-muted-foreground mt-3 leading-relaxed">
                    {exp.description}
                  </p>
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
