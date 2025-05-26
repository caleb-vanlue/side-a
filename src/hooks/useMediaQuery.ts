"use client";

import { useState, useEffect } from "react";

export default function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    if (typeof window !== "undefined") {
      const isDesktopQuery = query.includes("min-width: 1024px");
      const initialValue = isDesktopQuery ? window.innerWidth >= 1024 : false;

      const mediaQuery = window.matchMedia(query);
      setMatches(initialValue || mediaQuery.matches);

      const handler = (event: MediaQueryListEvent) => {
        setMatches(event.matches);
      };

      mediaQuery.addEventListener("change", handler);

      return () => {
        mediaQuery.removeEventListener("change", handler);
      };
    }
  }, [query]);

  return isClient ? matches : false;
}

export const breakpoints = {
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  "2xl": "(min-width: 1536px)",
  mobile: "(max-width: 639px)",
  tablet: "(min-width: 640px) and (max-width: 1023px)",
  desktop: "(min-width: 1024px)",
  landscape: "(orientation: landscape)",
  portrait: "(orientation: portrait)",
  dark: "(prefers-color-scheme: dark)",
  light: "(prefers-color-scheme: light)",
  motion: "(prefers-reduced-motion: no-preference)",
  noMotion: "(prefers-reduced-motion: reduce)",
};
