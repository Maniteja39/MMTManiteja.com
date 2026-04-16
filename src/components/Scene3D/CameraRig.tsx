import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface CameraRigProps {
  isMobile: boolean;
}

const CameraRig = ({ isMobile }: CameraRigProps) => {
  const { camera } = useThree();
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const touchX = useRef(0);
  const scroll = useRef({ progress: 0 });

  useEffect(() => {
    // Desktop: mouse parallax
    if (!isMobile) {
      const handleMouse = (e: MouseEvent) => {
        mouseX.current = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY.current = -(e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("mousemove", handleMouse);
      return () => window.removeEventListener("mousemove", handleMouse);
    }

    // Mobile: gentle tilt based on touch position
    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const t = e.touches[0];
      touchX.current = (t.clientX / window.innerWidth - 0.5) * 2;
    };
    window.addEventListener("touchmove", handleTouch, { passive: true });
    return () => window.removeEventListener("touchmove", handleTouch);
  }, [isMobile]);

  useEffect(() => {
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

    return () => ctx.revert();
  }, []);

  useFrame(() => {
    const p = scroll.current.progress;

    // Camera flies forward as user scrolls
    const targetZ = 8 - p * 6.5;
    const targetY = -p * 2.5;

    let targetX: number;
    let yOffset: number;

    if (isMobile) {
      // Mobile: much subtler parallax from touch drag, no Y parallax
      targetX = touchX.current * 0.25;
      yOffset = 0;
    } else {
      // Desktop: full mouse parallax
      targetX = mouseX.current * 0.7;
      yOffset = mouseY.current * 0.4;
    }

    // Smoother lerp on mobile (0.03) vs desktop (0.04)
    const lerp = isMobile ? 0.03 : 0.04;
    camera.position.x += (targetX - camera.position.x) * lerp;
    camera.position.y += (targetY + yOffset - camera.position.y) * lerp;
    camera.position.z += (targetZ - camera.position.z) * lerp;

    camera.lookAt(
      camera.position.x * 0.08,
      camera.position.y * 0.08,
      0
    );
  });

  return null;
};

export default CameraRig;
