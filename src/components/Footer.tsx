const Footer = () => {
  return (
    <footer
      className="relative py-12 text-center"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.05)",
        background: "rgba(4,4,11,0.5)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="container mx-auto px-5 sm:px-8">
        <div className="flex justify-center gap-8 mb-4">
          <a
            href="https://www.linkedin.com/in/maniteja-m-6987a71b9/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm transition-colors duration-200"
            style={{ color: "rgba(226,232,240,0.4)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#F5B820")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(226,232,240,0.4)")}
          >
            LinkedIn
          </a>
          <a
            href="#"
            className="text-sm transition-colors duration-200"
            style={{ color: "rgba(226,232,240,0.4)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#F5B820")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(226,232,240,0.4)")}
          >
            GitHub
          </a>
        </div>
        <p className="text-xs" style={{ color: "rgba(226,232,240,0.25)" }}>
          &copy; {new Date().getFullYear()} Maniteja Manchikalapudi. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
