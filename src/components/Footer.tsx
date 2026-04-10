const Footer = () => {
  return (
    <footer className="border-t border-border py-12 text-center text-muted-foreground text-sm">
      <div className="container mx-auto px-8">
        <div className="flex justify-center gap-6 mb-4">
          {["GitHub", "LinkedIn", "Twitter"].map((link) => (
            <a
              key={link}
              href="#"
              className="hover:text-accent transition-colors duration-200"
            >
              {link}
            </a>
          ))}
        </div>
        <p>&copy; {new Date().getFullYear()} Alex Chen. Built for precision.</p>
      </div>
    </footer>
  );
};

export default Footer;
