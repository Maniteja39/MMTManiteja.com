import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FloatingMeshProps {
  position: [number, number, number];
  rotationSeed?: number;
  geometry: "icosahedron" | "torusKnot" | "octahedron" | "torus" | "dodecahedron";
  color: string;
  emissiveColor?: string;
  wireframe?: boolean;
  scale?: number;
  speed?: number;
  floatAmplitude?: number;
  /** Lower segment counts on mobile for perf */
  lowPoly?: boolean;
}

const FloatingMesh = ({
  position,
  rotationSeed = 0,
  geometry,
  color,
  emissiveColor,
  wireframe = false,
  scale = 1,
  speed = 1,
  floatAmplitude = 0.3,
  lowPoly = false,
}: FloatingMeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const offset = rotationSeed * Math.PI * 2;

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime * speed + offset;
    meshRef.current.rotation.x = t * 0.28;
    meshRef.current.rotation.y = t * 0.37;
    meshRef.current.rotation.z = Math.sin(t * 0.18) * 0.12;
    meshRef.current.position.y =
      position[1] + Math.sin(t * 0.45) * floatAmplitude;
    meshRef.current.position.x =
      position[0] + Math.cos(t * 0.22) * (floatAmplitude * 0.4);
  });

  const material = wireframe ? (
    <meshBasicMaterial color={color} wireframe transparent opacity={0.55} />
  ) : (
    <meshStandardMaterial
      color={color}
      emissive={emissiveColor ?? color}
      emissiveIntensity={1.2}
      metalness={0.4}
      roughness={0.15}
    />
  );

  // Reduce segment count on mobile
  const seg = lowPoly ? 48 : 128;
  const ringSegs = lowPoly ? 12 : 20;
  const tubularSegs = lowPoly ? 32 : 64;

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      {geometry === "icosahedron" && <icosahedronGeometry args={[1, lowPoly ? 0 : 1]} />}
      {geometry === "torusKnot" && <torusKnotGeometry args={[0.7, 0.22, seg, 16]} />}
      {geometry === "octahedron" && <octahedronGeometry args={[1]} />}
      {geometry === "torus" && <torusGeometry args={[1, 0.28, ringSegs, tubularSegs]} />}
      {geometry === "dodecahedron" && <dodecahedronGeometry args={[1]} />}
      {material}
    </mesh>
  );
};

/* ─────────────────────────────────────────────────────────
   Desktop: 8 objects
   Mobile:  4 objects (keep the hero-visible + background)
   ───────────────────────────────────────────────────────── */

interface FloatingGeometryProps {
  isMobile: boolean;
}

const FloatingGeometry = ({ isMobile }: FloatingGeometryProps) => {
  return (
    <group>
      {/* ── Always rendered ── */}

      {/* Large wireframe icosahedron — right side, hero depth */}
      <FloatingMesh
        position={[5.5, 1.5, 0]}
        geometry="icosahedron"
        color="#F5B820"
        wireframe
        scale={isMobile ? 1.5 : 2.0}
        speed={0.35}
        rotationSeed={0.1}
        floatAmplitude={0.4}
        lowPoly={isMobile}
      />

      {/* Solid torus knot — left, the showpiece */}
      <FloatingMesh
        position={[-5.5, 0.5, -3]}
        geometry="torusKnot"
        color="#6366f1"
        emissiveColor="#818cf8"
        wireframe={false}
        scale={isMobile ? 0.65 : 0.85}
        speed={0.28}
        rotationSeed={0.4}
        floatAmplitude={0.35}
        lowPoly={isMobile}
      />

      {/* Giant wireframe octahedron — deep background */}
      <FloatingMesh
        position={[1, -3, -10]}
        geometry="octahedron"
        color="#22d3ee"
        wireframe
        scale={isMobile ? 3.0 : 4.5}
        speed={0.15}
        rotationSeed={0.7}
        floatAmplitude={0.6}
        lowPoly={isMobile}
      />

      {/* Small icosahedron — close, bottom-left */}
      <FloatingMesh
        position={[-2.5, -2, 2.5]}
        geometry="icosahedron"
        color="#22d3ee"
        wireframe
        scale={0.55}
        speed={0.65}
        rotationSeed={0.85}
        floatAmplitude={0.2}
        lowPoly={isMobile}
      />

      {/* ── Desktop-only (skip on mobile for GPU savings) ── */}
      {!isMobile && (
        <>
          <FloatingMesh
            position={[8, -0.5, -4]}
            geometry="torus"
            color="#F5B820"
            wireframe
            scale={1.5}
            speed={0.45}
            rotationSeed={0.25}
            floatAmplitude={0.25}
          />

          <FloatingMesh
            position={[-7, 3.5, -7]}
            geometry="dodecahedron"
            color="#f43f5e"
            emissiveColor="#fb7185"
            wireframe={false}
            scale={1.1}
            speed={0.3}
            rotationSeed={0.6}
            floatAmplitude={0.5}
          />

          <FloatingMesh
            position={[6, -2, -8]}
            geometry="torusKnot"
            color="#6366f1"
            wireframe
            scale={1.4}
            speed={0.22}
            rotationSeed={0.5}
            floatAmplitude={0.55}
          />

          <FloatingMesh
            position={[9, 4, -12]}
            geometry="octahedron"
            color="#F5B820"
            wireframe
            scale={2.5}
            speed={0.12}
            rotationSeed={0.9}
            floatAmplitude={0.8}
          />
        </>
      )}
    </group>
  );
};

export default FloatingGeometry;
