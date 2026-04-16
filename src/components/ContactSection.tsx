import { Mail, Linkedin } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const ContactSection = () => {
  const sectionRef = useScrollAnimation<HTMLElement>();

  return (
    <section ref={sectionRef} id="contact" className="py-32">
      <div className="container mx-auto px-8 text-center">
        <h2
          className="animate-child text-4xl lg:text-5xl font-bold mb-6 text-foreground"
          style={{ opacity: 0 }}
        >
          Let's Connect
        </h2>
        <p
          className="animate-child text-xl text-muted-foreground max-w-2xl mx-auto mb-12"
          style={{ opacity: 0 }}
        >
          I'm always open to discussing new opportunities, collaborations, and
          innovative backend engineering challenges. Feel free to reach out.
        </p>
        <div
          className="animate-child flex justify-center gap-4"
          style={{ opacity: 0 }}
        >
          <a
            href="https://www.linkedin.com/in/maniteja-m-6987a71b9/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-md text-lg hover:opacity-90 transition-opacity duration-200"
          >
            <Linkedin className="w-5 h-5" />
            LinkedIn
          </a>
          <a
            href="mailto:maniteja@example.com"
            className="inline-flex items-center gap-2 px-8 py-4 border border-border text-foreground font-semibold rounded-md text-lg hover:bg-secondary transition-colors duration-200"
          >
            <Mail className="w-5 h-5" />
            Email Me
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
