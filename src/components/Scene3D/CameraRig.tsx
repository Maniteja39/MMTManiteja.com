import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CameraRig = () => {
  const { camera } = useThree();
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const scroll = useRef({ progress: 0 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseX.current = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY.current = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouse);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          scroll.current.progress = self.progress;
        },
      });
    });

    return () => {
      window.removeEventListener("mousemove", handleMouse);
      ctx.revert();
    };
  }, []);

  useFrame(() => {
    const p = scroll.current.progress;

    // Camera flies forward (z: 8 → 1.5) and drifts slightly down as you scroll
    const targetZ = 8 - p * 6.5;
    const targetY = -p * 2.5;

    // Mouse adds a subtle parallax tilt
    const targetX = mouseX.current * 0.7;
    const mouseYOffset = mouseY.current * 0.4;

    camera.position.x += (targetX - camera.position.x) * 0.04;
    camera.position.y += (targetY + mouseYOffset - camera.position.y) * 0.04;
    camera.position.z += (targetZ - camera.position.z) * 0.04;

    // Always look slightly towards the origin — creates subtle drift effect
    camera.lookAt(
      camera.position.x * 0.08,
      camera.position.y * 0.08,
      0
    );
  });

  return null;
};

export default CameraRig;
