import { Briefcase } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const experiences = [
  {
    title: "Senior Software Engineer",
    company: "IFS",
    type: "Full-time",
    period: "Feb 2026 - Present · 3 mos",
    location: "San Francisco Bay Area · On-site",
    description: [],
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
  const sectionRef = useScrollAnimation<HTMLElement>();

  return (
    <section ref={sectionRef} id="experience" className="py-32">
      <div className="container mx-auto px-8">
        <h2
          className="animate-child text-4xl lg:text-5xl font-bold mb-16 text-center text-foreground"
          style={{ opacity: 0 }}
        >
          Experience
        </h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {experiences.map((exp, i) => (
            <div
              key={i}
              className="animate-child p-6 rounded-lg bg-card border border-border hover:border-accent/30 transition-colors duration-200"
              style={{ opacity: 0 }}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-md bg-secondary shrink-0">
                  <Briefcase className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="text-xl font-semibold text-foreground">
                      {exp.title}
                    </h3>
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                      {exp.type}
                    </span>
                  </div>
                  <p className="text-accent font-medium mt-1">{exp.company}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {exp.period}
                    {exp.location && ` · ${exp.location}`}
                  </p>
                  {exp.description.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {exp.description.map((item, j) => (
                        <li
                          key={j}
                          className="text-muted-foreground text-sm leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-accent/50"
                        >
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
