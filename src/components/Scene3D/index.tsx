import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import CameraRig from "./CameraRig";
import ParticleField from "./ParticleField";
import FloatingGeometry from "./FloatingGeometry";

const Scene3D = () => {
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
        camera={{ position: [0, 0, 8], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={null}>
          {/* Very dim ambient light — geometry relies on emissive for glow */}
          <ambientLight intensity={0.05} />
          <pointLight position={[5, 5, 5]} intensity={0.3} color="#F5B820" />
          <pointLight position={[-5, -3, -5]} intensity={0.2} color="#6366f1" />

          <CameraRig />
          <ParticleField />
          <FloatingGeometry />

          <EffectComposer>
            <Bloom
              luminanceThreshold={0.08}
              luminanceSmoothing={0.92}
              intensity={1.4}
              radius={0.6}
            />
            <Vignette eskil={false} offset={0.06} darkness={0.65} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Scene3D;
