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
  PLAYING_POSITION: 28,
  DEFAULT_ROTATION_SPEED: 1,
  GROOVE_COUNT: 65,
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

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;
