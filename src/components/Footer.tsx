const Footer = () => {
  return (
    <footer className="border-t border-border py-12 text-center text-muted-foreground text-sm">
      <div className="container mx-auto px-8">
        <div className="flex justify-center gap-6 mb-4">
          <a
            href="https://www.linkedin.com/in/maniteja-m-6987a71b9/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors duration-200"
          >
            LinkedIn
          </a>
          <a href="#" className="hover:text-accent transition-colors duration-200">
            GitHub
          </a>
        </div>
        <p>&copy; {new Date().getFullYear()} Maniteja M. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
