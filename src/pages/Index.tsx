import Scene3D from "@/components/Scene3D";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* Full-screen 3D canvas — always visible behind everything */}
      <Scene3D />

      {/* Scrollable HTML content on top */}
      <div style={{ position: "relative", zIndex: 10 }}>
        <Header />
        <main>
          <HeroSection />
          <AboutSection />
          <ExperienceSection />
          <ProjectsSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
