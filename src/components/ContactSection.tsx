import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, Linkedin, ArrowRight, Download } from "lucide-react";
import { useSound } from "@/lib/sound/SoundProvider";

gsap.registerPlugin(ScrollTrigger);

const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { play } = useSound();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const targets = el.querySelectorAll(".contact-in");
      gsap.fromTo(
        targets,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 75%",
            toggleActions: "play none none none",
            onEnter: () => play("whoosh"),
          },
        }
      );
    }, el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section ref={sectionRef} id="contact" className="relative min-h-screen flex items-center py-20 sm:py-32">
      <div className="container mx-auto px-5 sm:px-8 lg:px-16">
        <div className="max-w-2xl">
          <p
            className="contact-in text-xs font-semibold tracking-[0.25em] uppercase mb-4"
            style={{ opacity: 0, color: "#F5B820" }}
          >
            004 — Contact
          </p>

          <h2
            className="contact-in font-bold mb-6"
            style={{
              opacity: 0,
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              color: "#e2e8f0",
              lineHeight: 1.05,
            }}
          >
            Let's build something{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #F5B820, #f97316)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              great.
            </span>
          </h2>

          <p
            className="contact-in text-base lg:text-lg leading-relaxed mb-10"
            style={{ opacity: 0, color: "rgba(226,232,240,0.6)" }}
          >
            I'm always open to discussing new opportunities, collaborations, and
            innovative engineering challenges. Feel free to reach out.
          </p>

          {/* CTA Links */}
          <div className="contact-in flex flex-col sm:flex-row gap-4" style={{ opacity: 0 }}>
            <a
              href="https://www.linkedin.com/in/maniteja-m-6987a71b9/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-105 group"
              style={{
                background: "linear-gradient(135deg, #F5B820, #f97316)",
                color: "#04040b",
                boxShadow: "0 0 35px rgba(245,184,32,0.3)",
              }}
              onMouseEnter={() => play("hover")}
              onClick={() => play("success")}
            >
              <Linkedin className="w-5 h-5" />
              Connect on LinkedIn
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="mailto:manitejajavadev@gmail.com"
              className="inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-105"
              style={{
                background: "rgba(255,255,255,0.05)",
                color: "#e2e8f0",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(8px)",
              }}
              onMouseEnter={() => play("hover")}
              onClick={() => play("whoosh")}
            >
              <Mail className="w-5 h-5" />
              Send an Email
            </a>

            <a
              href="/Maniteja_Manchikalapudi_Resume.pdf"
              download
              className="inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-105"
              style={{
                background: "rgba(99,102,241,0.1)",
                color: "#e2e8f0",
                border: "1px solid rgba(99,102,241,0.25)",
                backdropFilter: "blur(8px)",
              }}
              onMouseEnter={() => play("hover")}
              onClick={() => play("descend")}
            >
              <Download className="w-5 h-5" />
              Download Resume
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
