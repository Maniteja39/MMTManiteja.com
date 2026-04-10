import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center pt-20">
      <div className="container mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
            Engineered Systems,{" "}
            <span className="text-accent">Optimized Performance.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-[55ch]">
            Senior Software Engineer specializing in high-throughput data
            pipelines and scalable backend architecture. Focused on delivering
            efficient, measurable results through precise code.
          </p>
          <div className="flex gap-4 pt-2">
            <a
              href="#contact"
              className="px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-md hover:opacity-90 transition-opacity duration-200"
            >
              Let's Connect
            </a>
            <a
              href="#projects"
              className="px-6 py-3 border border-border text-foreground rounded-md hover:bg-secondary transition-colors duration-200"
            >
              View Work
            </a>
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="relative aspect-square rounded-lg overflow-hidden shadow-2xl shadow-primary/10">
            <img
              src={heroBg}
              alt="Abstract technology background"
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
