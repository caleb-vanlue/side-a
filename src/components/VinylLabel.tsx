"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { VINYL_CONSTANTS } from "../lib/constants";
import { TRACKS } from "../lib/tracks";
import { useRecordPlayer } from "./RecordPlayerContext";

const MAX_CHARS_SINGLE_LINE = 15;
const LINE_HEIGHT = 10;
const TITLE_CENTER_Y = 38;

function splitTitle(title: string): string[] {
  const words = title.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > MAX_CHARS_SINGLE_LINE && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

const VinylLabel = React.memo(() => {
  const { currentTrackIndex, isAutoPlaying, toneArmRotation } =
    useRecordPlayer();
  const isPlaying =
    isAutoPlaying ||
    toneArmRotation > VINYL_CONSTANTS.NEEDLE_ON_RECORD_THRESHOLD;

  const currentYear = React.useMemo(() => {
    return Math.floor(
      (new Date().getTime() - new Date("2000-09-05").getTime()) /
        (365.25 * 24 * 60 * 60 * 1000)
    );
  }, []);

  const labelSize = `${VINYL_CONSTANTS.LABEL_SIZE_PERCENTAGE}%`;

  const titleLines = isPlaying
    ? splitTitle(TRACKS[currentTrackIndex]?.title.toUpperCase() ?? "SIDE A")
    : ["SIDE A"];

  const isMultiLine = titleLines.length > 1;
  const fontSize = isMultiLine ? "5.5px" : "7px";
  const letterSpacing = isMultiLine ? "0.5px" : "1px";
  const totalSpan = (titleLines.length - 1) * LINE_HEIGHT;
  const startY = TITLE_CENTER_Y - totalSpan / 2;

  const animKey = isPlaying ? currentTrackIndex : "default";

  return (
    <>
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none overflow-hidden"
        style={{ width: labelSize, height: labelSize }}
      >
        <div
          className="w-full h-full"
          style={{
            background: `
              radial-gradient(circle at 30% 30%, #1a4027 0%, #275c3a 50%, #347a4d 100%),
              radial-gradient(circle at 70% 70%, #234f33 0%, #2d6942 100%)
            `,
            boxShadow: "inset 0 0 10px rgba(0,0,0,0.2)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 5px,
                rgba(0,0,0,0.02) 5px,
                rgba(0,0,0,0.02) 6px
              ),
              repeating-linear-gradient(
                -45deg,
                transparent,
                transparent 5px,
                rgba(0,0,0,0.02) 5px,
                rgba(0,0,0,0.02) 6px
              )
            `,
          }}
        />
      </div>
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ width: labelSize, height: labelSize }}
      >
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
        >
          <text
            x="50"
            y="25"
            textAnchor="middle"
            className="fill-white/90"
            style={{ fontSize: "5.5px", letterSpacing: "1px", fontWeight: "500" }}
          >
            CALEB VAN LUE
          </text>

          <AnimatePresence mode="wait">
            <motion.g
              key={animKey}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              {titleLines.map((line, i) => (
                <text
                  key={i}
                  x="50"
                  y={startY + i * LINE_HEIGHT}
                  textAnchor="middle"
                  className="fill-white"
                  style={{ fontSize, letterSpacing, fontWeight: "700" }}
                >
                  {line}
                </text>
              ))}
            </motion.g>
          </AnimatePresence>

          <text
            x="50"
            y="60"
            textAnchor="middle"
            className="fill-white/80"
            style={{ fontSize: "4px" }}
          >
            33⅓ RPM
          </text>

          <text
            x="50"
            y="75"
            textAnchor="middle"
            className="fill-white/70"
            style={{ fontSize: "4px", letterSpacing: "0.5px" }}
          >
            CV-2000-0{currentYear}
          </text>

          <defs>
            <path id="bottom-arc" d="M 15,50 A 35,35 0 0,0 85,50" />
          </defs>
          <text
            className="fill-white/60"
            style={{ fontSize: "3.5px", letterSpacing: "0.6px" }}
          >
            <textPath href="#bottom-arc" startOffset="50%" textAnchor="middle">
              STEREO • MADE IN USA • ALL RIGHTS RESERVED
            </textPath>
          </text>
        </svg>
      </div>
    </>
  );
});

VinylLabel.displayName = "VinylLabel";

export default VinylLabel;
