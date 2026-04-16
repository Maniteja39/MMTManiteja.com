import { Suspense } from "react";
import ParticleBackground from "@/components/ParticleBackground";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center pt-20 relative overflow-hidden">
      <Suspense fallback={null}>
        <ParticleBackground />
      </Suspense>
      <div className="container mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        <div className="lg:col-span-8 space-y-6">
          <p className="text-accent font-medium tracking-wide uppercase text-sm">
            Senior Software Engineer
          </p>
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-tight">
            Hi, I'm{" "}
            <span className="text-gradient">Maniteja.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-[55ch]">
            Senior Software Engineer at IFS with 6+ years of experience building
            scalable full-stack applications. Based in San Francisco, CA.
          </p>
          <div className="flex gap-4 pt-2">
            <a
              href="#contact"
              className="px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-md hover:opacity-90 transition-opacity duration-200"
            >
              Get In Touch
            </a>
            <a
              href="#experience"
              className="px-6 py-3 border border-border text-foreground rounded-md hover:bg-secondary transition-colors duration-200"
            >
              View Experience
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
