import { Suspense, useEffect, useRef } from "react";
import gsap from "gsap";
import ParticleBackground from "@/components/ParticleBackground";

const HeroSection = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const targets = el.querySelectorAll(".hero-animate");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.14,
          ease: "power3.out",
          delay: 0.25,
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section className="min-h-screen flex items-center pt-20 relative overflow-hidden">
      <Suspense fallback={null}>
        <ParticleBackground />
      </Suspense>
      <div className="container mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        <div ref={contentRef} className="lg:col-span-8 space-y-6">
          <p className="hero-animate text-accent font-medium tracking-wide uppercase text-sm" style={{ opacity: 0 }}>
            Senior Software Engineer
          </p>
          <h1 className="hero-animate text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-tight" style={{ opacity: 0 }}>
            Hi, I'm{" "}
            <span className="text-gradient">Maniteja.</span>
          </h1>
          <p className="hero-animate text-xl text-muted-foreground max-w-[55ch]" style={{ opacity: 0 }}>
            Senior Software Engineer at IFS with 6+ years of experience building
            scalable full-stack applications. Based in San Francisco, CA.
          </p>
          <div className="hero-animate flex gap-4 pt-2" style={{ opacity: 0 }}>
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
