"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TRACKS } from "../lib/tracks";
import { VINYL_CONSTANTS } from "../lib/constants";
import { useRecordPlayer } from "./RecordPlayerContext";

// All coordinates are in the label's 100×100 viewBox, so its edge is r=50.
const INK = "#f1e8d0";
const LABEL_FONT = '"Futura", "Avenir Next", "Helvetica Neue", Arial, sans-serif';
const SIGNATURE_FONT = "var(--font-handwriting), cursive";

const PRINTED_RING_RADIUS = 45.5;
const HOLE_RING_RADIUS = 6.5;

// Title block in the lower half: widest a line may get, and where it starts
const TITLE_MAX_WIDTH = 60;
const TITLE_TOP_Y = 63.5;
const TITLE_MAX_SIZE_SINGLE = 6.5;
const TITLE_MAX_SIZE_DOUBLE = 5.6;
const TITLE_MIN_SIZE = 3.5;
// Below this size a single line looks cramped, so the title wraps instead
const TITLE_WRAP_BELOW = 5.2;
// Rough advance per character for bold uppercase, as a fraction of font size
// (glyph width plus the 0.06em letter spacing)
const CHAR_WIDTH_EM = 0.7;
const TITLE_LINE_HEIGHT = 1.15;

const fitFontSize = (lines: string[], max: number) => {
  const longest = Math.max(...lines.map((line) => line.length));
  const size = TITLE_MAX_WIDTH / (longest * CHAR_WIDTH_EM);
  return Math.max(TITLE_MIN_SIZE, Math.min(max, size));
};

// Split at the word boundary that keeps the two lines closest in length
function splitBalanced(title: string): string[] {
  const words = title.split(" ");
  let best: string[] = [title];
  let bestLongest = Infinity;
  for (let i = 1; i < words.length; i++) {
    const lines = [words.slice(0, i).join(" "), words.slice(i).join(" ")];
    const longest = Math.max(lines[0].length, lines[1].length);
    if (longest < bestLongest) {
      best = lines;
      bestLongest = longest;
    }
  }
  return best;
}

function layoutTitle(title: string) {
  const singleSize = fitFontSize([title], TITLE_MAX_SIZE_SINGLE);
  if (singleSize >= TITLE_WRAP_BELOW || !title.includes(" ")) {
    return { lines: [title], fontSize: singleSize };
  }
  const lines = splitBalanced(title);
  return { lines, fontSize: fitFontSize(lines, TITLE_MAX_SIZE_DOUBLE) };
}

const VinylLabel = React.memo(() => {
  const { currentTrackIndex, isPlaying } = useRecordPlayer();

  const catalogNumber = React.useMemo(() => {
    const age = Math.floor(
      (new Date().getTime() - new Date("2000-09-05").getTime()) /
        (365.25 * 24 * 60 * 60 * 1000)
    );
    return `CV-2000-${String(age).padStart(3, "0")}`;
  }, []);

  const track = isPlaying ? TRACKS[currentTrackIndex] : undefined;
  const overline = track ? `A${currentTrackIndex + 1}` : "HIGH FIDELITY";
  const { lines, fontSize } = layoutTitle(
    track?.title.toUpperCase() ?? "LONG PLAY"
  );

  const labelSize = `${VINYL_CONSTANTS.LABEL_SIZE_PERCENTAGE}%`;
  const animKey = track ? currentTrackIndex : "idle";

  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{ width: labelSize, height: labelSize }}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        style={{ fontFamily: LABEL_FONT }}
      >
        <defs>
          <radialGradient id="label-paper" cx="42%" cy="40%" r="62%">
            <stop offset="0%" stopColor="#25426f" />
            <stop offset="70%" stopColor="#1c3459" />
            <stop offset="100%" stopColor="#0e1b33" />
          </radialGradient>
          <filter id="label-grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              stitchTiles="stitch"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0"
            />
          </filter>
          <clipPath id="label-clip">
            <circle cx="50" cy="50" r="50" />
          </clipPath>
          {/* Left to right over the top, so the signature reads upright */}
          <path id="label-top-arc" d="M 12,50 A 38,38 0 0,1 88,50" />
          {/* Left to right under the bottom, glyphs facing the centre */}
          <path id="label-bottom-arc" d="M 9,50 A 41,41 0 0,0 91,50" />
        </defs>

        {/* Paper */}
        <circle cx="50" cy="50" r="50" fill="url(#label-paper)" />
        <rect
          width="100"
          height="100"
          filter="url(#label-grain)"
          clipPath="url(#label-clip)"
          opacity="0.5"
        />
        {/* Dark lip where the label is pressed into the vinyl */}
        <circle
          cx="50"
          cy="50"
          r="49.4"
          fill="none"
          stroke="#000"
          strokeOpacity="0.35"
          strokeWidth="1.2"
        />

        {/* Printed rings */}
        <circle
          cx="50"
          cy="50"
          r={PRINTED_RING_RADIUS}
          fill="none"
          stroke={INK}
          strokeOpacity="0.55"
          strokeWidth="0.4"
        />
        <circle
          cx="50"
          cy="50"
          r={PRINTED_RING_RADIUS - 1.2}
          fill="none"
          stroke={INK}
          strokeOpacity="0.3"
          strokeWidth="0.2"
        />
        <circle
          cx="50"
          cy="50"
          r={HOLE_RING_RADIUS}
          fill="none"
          stroke={INK}
          strokeOpacity="0.45"
          strokeWidth="0.3"
        />

        {/* Upper half: signature and side */}
        <text
          fill={INK}
          style={{ fontFamily: SIGNATURE_FONT, fontSize: "8px" }}
        >
          <textPath
            href="#label-top-arc"
            startOffset="50%"
            textAnchor="middle"
          >
            Caleb Van Lue
          </textPath>
        </text>
        <text
          x="50"
          y="32"
          textAnchor="middle"
          fill={INK}
          style={{ fontSize: "6px", fontWeight: 700, letterSpacing: "2.4px" }}
        >
          SIDE A
        </text>
        <line
          x1="45"
          y1="35.5"
          x2="55"
          y2="35.5"
          stroke={INK}
          strokeOpacity="0.5"
          strokeWidth="0.3"
        />

        {/* Centre band, flanking the spindle hole */}
        <g
          fill={INK}
          fillOpacity="0.85"
          style={{ fontSize: "3.6px", fontWeight: 500, letterSpacing: "0.6px" }}
        >
          <text x="27" y="50" textAnchor="end" dominantBaseline="central">
            33⅓
          </text>
          <text x="73" y="50" textAnchor="start" dominantBaseline="central">
            STEREO
          </text>
        </g>
        <g stroke={INK} strokeOpacity="0.4" strokeWidth="0.25">
          <line x1="30" y1="50" x2="41.5" y2="50" />
          <line x1="58.5" y1="50" x2="70" y2="50" />
        </g>

        {/* Lower half: current track */}
        <AnimatePresence mode="wait">
          <motion.g
            key={animKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <text
              x="50"
              y="59"
              textAnchor="middle"
              fill={INK}
              fillOpacity="0.75"
              style={{ fontSize: "3px", fontWeight: 500, letterSpacing: "1px" }}
            >
              {overline}
            </text>
            {lines.map((line, i) => (
              <text
                key={i}
                x="50"
                y={
                  TITLE_TOP_Y +
                  fontSize * 0.75 +
                  i * fontSize * TITLE_LINE_HEIGHT
                }
                textAnchor="middle"
                fill={INK}
                style={{
                  fontSize: `${fontSize}px`,
                  fontWeight: 700,
                  letterSpacing: `${fontSize * 0.06}px`,
                }}
              >
                {line}
              </text>
            ))}
          </motion.g>
        </AnimatePresence>

        {/* Rim text */}
        <text
          fill={INK}
          fillOpacity="0.65"
          style={{ fontSize: "2.8px", letterSpacing: "0.5px" }}
        >
          <textPath
            href="#label-bottom-arc"
            startOffset="50%"
            textAnchor="middle"
          >
            {catalogNumber} • MADE IN USA • ALL RIGHTS RESERVED
          </textPath>
        </text>
      </svg>
    </div>
  );
});

VinylLabel.displayName = "VinylLabel";

export default VinylLabel;
