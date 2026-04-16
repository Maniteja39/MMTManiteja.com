import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { soundEngine, SoundName } from "./SoundEngine";

interface SoundContextValue {
  play: (name: SoundName) => void;
  muted: boolean;
  toggleMute: () => void;
  unlocked: boolean;
}

const SoundContext = createContext<SoundContextValue | null>(null);

const MUTE_STORAGE_KEY = "mmt-sfx-muted";

export const SoundProvider = ({ children }: { children: ReactNode }) => {
  const [muted, setMuted] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(MUTE_STORAGE_KEY) === "1";
  });
  const [unlocked, setUnlocked] = useState(false);

  // Unlock AudioContext on first user gesture (browser requirement)
  useEffect(() => {
    if (unlocked) return;

    const handler = () => {
      soundEngine.unlock();
      setUnlocked(soundEngine.isUnlocked());
    };

    window.addEventListener("pointerdown", handler, { once: true });
    window.addEventListener("keydown", handler, { once: true });
    window.addEventListener("touchstart", handler, { once: true });

    return () => {
      window.removeEventListener("pointerdown", handler);
      window.removeEventListener("keydown", handler);
      window.removeEventListener("touchstart", handler);
    };
  }, [unlocked]);

  const play = useCallback(
    (name: SoundName) => {
      if (muted) return;
      // Respect prefers-reduced-motion as a proxy for "minimize stimulation"
      if (
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }
      soundEngine.play(name);
    },
    [muted]
  );

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      try {
        window.localStorage.setItem(MUTE_STORAGE_KEY, next ? "1" : "0");
      } catch {
        /* ignore quota errors */
      }
      return next;
    });
  }, []);

  return (
    <SoundContext.Provider value={{ play, muted, toggleMute, unlocked }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = (): SoundContextValue => {
  const ctx = useContext(SoundContext);
  if (!ctx) {
    // Graceful fallback if used outside provider (e.g. in tests)
    return {
      play: () => {},
      muted: true,
      toggleMute: () => {},
      unlocked: false,
    };
  }
  return ctx;
};
