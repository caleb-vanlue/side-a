export interface NavigationLink {
  href: string;
  label: string;
  external?: boolean;
}

export const NAVIGATION_LINKS: NavigationLink[] = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/collection", label: "My Records" },
];

export const EXTERNAL_LINKS: NavigationLink[] = [
  {
    href: "https://www.linkedin.com/in/calebvanlue/",
    label: "LinkedIn",
    external: true,
  },
  {
    href: "https://github.com/caleb-vanlue",
    label: "GitHub",
    external: true,
  },
];

export const VINYL_CONSTANTS = {
  MAX_TONE_ARM_ROTATION: 45,
  NEEDLE_ON_RECORD_THRESHOLD: 25,
  DEFAULT_ROTATION_SPEED: 1,
  GROOVE_COUNT: 65,
  LABEL_SIZE_PERCENTAGE: 35,
  SPINDLE_HOLE_SIZE_PERCENTAGE: 3,
} as const;

export const ANIMATION_DURATIONS = {
  FAST: 200,
  MEDIUM: 300,
  SLOW: 500,
  TONE_ARM_ANIMATION: 300,
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;
