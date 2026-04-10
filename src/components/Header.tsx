import { useState, useEffect } from "react";
import { Linkedin } from "lucide-react";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/90 backdrop-blur-lg border-b border-border" : ""
      }`}
    >
      <div className="container mx-auto px-8 py-6 flex justify-between items-center">
        <div className="text-lg font-semibold text-foreground">Maniteja M.</div>
        <nav className="flex gap-8 items-center">
          {["About", "Experience", "Projects", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-muted-foreground hover:text-accent transition-colors duration-200"
            >
              {item}
            </a>
          ))}
          <a
            href="https://www.linkedin.com/in/maniteja-m-6987a71b9/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-accent transition-colors duration-200"
          >
            <Linkedin className="w-5 h-5" />
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
