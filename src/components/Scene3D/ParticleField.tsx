import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 1400;

const ParticleField = () => {
  const meshRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const col = new Float32Array(PARTICLE_COUNT * 3);

    const gold = new THREE.Color("#F5B820");
    const indigo = new THREE.Color("#6366f1");
    const teal = new THREE.Color("#22d3ee");
    const white = new THREE.Color("#e2e8f0");

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Wide, deep volume to fill the fly-through space
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 24;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;

      const r = Math.random();
      let c: THREE.Color;
      if (r < 0.35) c = gold.clone();
      else if (r < 0.6) c = indigo.clone();
      else if (r < 0.78) c = teal.clone();
      else c = white.clone();

      // Vary brightness so some particles sparkle brighter
      const brightness = 0.25 + Math.random() * 0.75;
      col[i * 3] = c.r * brightness;
      col[i * 3 + 1] = c.g * brightness;
      col[i * 3 + 2] = c.b * brightness;
    }

    return [pos, col];
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.y = t * 0.006;
    meshRef.current.rotation.x = Math.sin(t * 0.004) * 0.04;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default ParticleField;
