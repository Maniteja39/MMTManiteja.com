import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center pt-20">
      <div className="container mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <p className="text-accent font-medium tracking-wide uppercase text-sm">
            Senior Backend Engineer
          </p>
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
            Hi, I'm{" "}
            <span className="text-accent">Maniteja.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-[55ch]">
            Senior Backend Engineer at IFS.ai, designing and building scalable,
            high-performance distributed systems. Based in San Francisco, CA.
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
        <div className="lg:col-span-5">
          <div className="relative aspect-square rounded-lg overflow-hidden shadow-2xl shadow-primary/10">
            <img
              src={heroBg}
              alt="Technology background"
              className="w-full h-full object-cover"
              width={1280}
              height={720}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
