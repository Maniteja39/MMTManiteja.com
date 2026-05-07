import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type Theme = "dark" | "light";

type ThemeContextValue = {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "theme";

const readInitialTheme = (): Theme => {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("light") ? "light" : "dark";
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(readInitialTheme);

  const apply = useCallback((next: Theme) => {
    const root = document.documentElement;

    // Briefly tag the document so a global CSS rule can apply transitions to
    // colors/backgrounds across the whole tree during the swap. Removed after
    // the transition window so per-element transitions (hover, etc.) aren't
    // dampened in steady state.
    root.classList.add("theme-transitioning");
    root.classList.remove("light", "dark");
    root.classList.add(next);
    window.setTimeout(() => {
      root.classList.remove("theme-transitioning");
    }, 350);

    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage may be unavailable (private mode, embedded contexts) — fine to skip.
    }
    setThemeState(next);
  }, []);

  const setTheme = useCallback((t: Theme) => apply(t), [apply]);
  const toggle = useCallback(
    () => apply(theme === "dark" ? "light" : "dark"),
    [apply, theme],
  );

  // Keep state in sync if another tab changes it.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && (e.newValue === "dark" || e.newValue === "light")) {
        apply(e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [apply]);

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
};
