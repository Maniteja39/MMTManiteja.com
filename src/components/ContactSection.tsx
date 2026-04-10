import { Mail } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-32">
      <div className="container mx-auto px-8 text-center">
        <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground">
          Let's Build Together
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
          Interested in collaborating on a project that demands efficiency and
          measurable impact? Let's discuss how my expertise can drive your goals
          forward.
        </p>
        <a
          href="mailto:alex@example.com"
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-md text-lg hover:opacity-90 transition-opacity duration-200"
        >
          <Mail className="w-5 h-5" />
          Contact Me
        </a>
      </div>
    </section>
  );
};

export default ContactSection;
