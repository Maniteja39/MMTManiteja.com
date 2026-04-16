import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useScrollAnimations() {
  useEffect(() => {
    // Remove default smooth scroll — GSAP handles it
    document.documentElement.style.scrollBehavior = "auto";

    // Animate all sections except hero
    const sections = gsap.utils.toArray<HTMLElement>("section:not(:first-child)");

    sections.forEach((section) => {
      // Fade + slide the whole section
      gsap.fromTo(
        section,
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            end: "top 40%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Stagger children inside each section container
      const children = section.querySelectorAll(
        ".container > h2, .container > p, .container > div > div, .container > div > p, .container > .flex, .container > .grid > div"
      );

      if (children.length > 0) {
        gsap.fromTo(
          children,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    });

    // Hero entrance animation
    const hero = document.querySelector("section:first-child");
    if (hero) {
      const heroChildren = hero.querySelectorAll(".container > div > *");
      gsap.fromTo(
        heroChildren,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.3,
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);
}
