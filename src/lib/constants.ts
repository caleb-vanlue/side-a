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

export const VINYL_CONSTANTS = {
  MAX_TONE_ARM_ROTATION: 45,
  NEEDLE_ON_RECORD_THRESHOLD: 25,
  // Lower than the drop threshold so jitter around 25° doesn't toggle playback
  NEEDLE_LIFT_THRESHOLD: 23,
  PLAYING_POSITION: 28,
  NEEDLE_SETTLED_POSITION: 47,
  // Degrees per second the arm drifts inward while a record plays
  TONE_ARM_CREEP_SPEED: 0.1,
  DEFAULT_ROTATION_SPEED: 1,
  GROOVE_COUNT: 30,
  LABEL_SIZE_PERCENTAGE: 35,
  SPINDLE_HOLE_SIZE_PERCENTAGE: 3,
} as const;

export const VINYL_SIZING = {
  RECORD_SIZE: {
    mobile: "w-[85vmin] h-[85vmin]",
    tablet: "w-[65vmin] h-[65vmin]",
    desktop: "w-[60vmin] h-[60vmin]",
  },
  TONE_ARM_CONTAINER: {
    mobile: "w-[25vmin] h-[85vmin]",
    tablet: "w-[20vmin] h-[65vmin]",
    desktop: "w-[18vmin] h-[60vmin]",
  },
  GAP: {
    mobile: "gap-2",
    tablet: "gap-4",
    desktop: "gap-6",
  },
} as const;

export const ANIMATION_DURATIONS = {
  FAST: 200,
  MEDIUM: 300,
  SLOW: 500,
  TONE_ARM_ANIMATION: 300,
} as const;

export const CONTACT = {
  EMAIL: "vanluecaleb@icloud.com",
  GITHUB: "https://github.com/caleb-vanlue",
  REPO: "https://github.com/caleb-vanlue/side-a",
  LETTERBOXD: "https://letterboxd.com/irrelativity/",
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;
