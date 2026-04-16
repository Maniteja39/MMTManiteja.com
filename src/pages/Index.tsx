import { useState, useCallback, lazy, Suspense } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

// Lazy-load the heavy 3D scene — keeps first paint fast
const Scene3D = lazy(() => import("@/components/Scene3D"));

const Index = () => {
  const [loaded, setLoaded] = useState(false);

  const handleLoadFinished = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      {/* Loading screen — overlays everything until dismissed */}
      {!loaded && <LoadingScreen onFinished={handleLoadFinished} />}

      {/* Custom cursor (desktop only) */}
      <CustomCursor />

      {/* Smooth scroll (desktop only, skips on touch) */}
      <SmoothScroll />

      <div style={{ position: "relative", minHeight: "100vh" }}>
        {/* Full-screen 3D canvas — lazy-loaded */}
        <Suspense fallback={null}>
          <Scene3D />
        </Suspense>

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
    </>
  );
};

export default Index;
