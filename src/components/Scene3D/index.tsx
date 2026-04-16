import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import CameraRig from "./CameraRig";
import ParticleField from "./ParticleField";
import FloatingGeometry from "./FloatingGeometry";

const Scene3D = () => {
  const isMobile = useMemo(
    () =>
      typeof window !== "undefined" &&
      (window.innerWidth < 768 ||
        /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)),
    []
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        background: "#04040b",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: isMobile ? 65 : 55 }}
        dpr={isMobile ? [1, 1] : [1, 1.5]}
        gl={{
          antialias: !isMobile,
          alpha: false,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.05} />
          <pointLight position={[5, 5, 5]} intensity={0.3} color="#F5B820" />
          {!isMobile && (
            <pointLight
              position={[-5, -3, -5]}
              intensity={0.2}
              color="#6366f1"
            />
          )}

          <CameraRig isMobile={isMobile} />
          <ParticleField isMobile={isMobile} />
          <FloatingGeometry isMobile={isMobile} />

          <EffectComposer>
            <Bloom
              luminanceThreshold={isMobile ? 0.2 : 0.08}
              luminanceSmoothing={0.92}
              intensity={isMobile ? 0.7 : 1.4}
              radius={isMobile ? 0.35 : 0.6}
            />
            <Vignette eskil={false} offset={0.06} darkness={0.65} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Scene3D;
