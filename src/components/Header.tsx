import { useState, useEffect } from "react";
import { Linkedin } from "lucide-react";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: "all 0.4s ease",
        background: scrolled ? "rgba(4,4,11,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
      }}
    >
      <div className="container mx-auto px-8 lg:px-16 py-6 flex justify-between items-center">
        <div
          className="text-base font-semibold tracking-wide"
          style={{ color: "#e2e8f0" }}
        >
          Maniteja<span style={{ color: "#F5B820" }}>.</span>
        </div>

        <nav className="flex gap-8 items-center">
          {["About", "Experience", "Projects", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium transition-colors duration-200 hover:opacity-100"
              style={{ color: "rgba(226,232,240,0.55)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#F5B820")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(226,232,240,0.55)")}
            >
              {item}
            </a>
          ))}
          <a
            href="https://www.linkedin.com/in/maniteja-m-6987a71b9/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200"
            style={{ color: "rgba(226,232,240,0.55)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#F5B820")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(226,232,240,0.55)")}
          >
            <Linkedin className="w-5 h-5" />
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
