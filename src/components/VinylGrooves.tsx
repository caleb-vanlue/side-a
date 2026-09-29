import React from "react";
import { VINYL_CONSTANTS } from "../lib/constants";
import { TRACKS } from "../lib/tracks";

// All radii are in the 200×200 viewBox, so the record's edge is r=100.
const LABEL_RADIUS = VINYL_CONSTANTS.LABEL_SIZE_PERCENTAGE;
const RIM_RADIUS = 99.4;
// Smooth lead-in between the rim and the first track
const LEAD_IN_RADIUS = 95.5;
// Smooth run-out ("dead wax") between the last track and the label
const RUN_OUT_RADIUS = 46;
// Unmodulated gap separating one track's band from the next
const TRACK_GAP = 1.6;
const GROOVE_SPACING = 0.55;

interface Groove {
  radius: number;
  stroke: string;
  opacity: number;
}

interface TrackGap {
  radius: number;
}

const round = (n: number) => Math.round(n * 1000) / 1000;

// One band of fine grooves per track, outermost first like a real side
function buildGrooves(trackCount: number) {
  const count = Math.max(trackCount, 1);
  const grooved = LEAD_IN_RADIUS - RUN_OUT_RADIUS - TRACK_GAP * (count - 1);
  const bandWidth = grooved / count;

  const grooves: Groove[] = [];
  const gaps: TrackGap[] = [];

  let outer = LEAD_IN_RADIUS;
  for (let band = 0; band < count; band++) {
    const inner = outer - bandWidth;
    for (let r = outer, i = 0; r > inner; r -= GROOVE_SPACING, i++) {
      grooves.push({
        radius: r,
        stroke: i % 2 === 0 ? "#262626" : "#050505",
        // Deterministic wobble so the band reads as modulated, not machined.
        // Rounded because Math.sin can differ in the last digit between Node
        // and the browser, which breaks hydration.
        opacity: round(0.45 + 0.35 * Math.abs(Math.sin(r * 12.9898))),
      });
    }
    if (band < count - 1) gaps.push({ radius: inner - TRACK_GAP / 2 });
    outer = inner - TRACK_GAP;
  }

  return { grooves, gaps };
}

const VinylGrooves = React.memo(() => {
  const { grooves, gaps } = React.useMemo(
    () => buildGrooves(TRACKS.length),
    []
  );

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 200 200"
      style={{ pointerEvents: "none" }}
    >
      <defs>
        <path
          id="run-out-arc"
          d={`M 100,${100 + 41} A 41,41 0 1,1 100.01,${100 + 41}`}
        />
      </defs>

      {/* Raised rim */}
      <circle
        cx="100"
        cy="100"
        r={RIM_RADIUS}
        fill="none"
        stroke="#2e2e2e"
        strokeWidth="1.2"
      />
      <circle
        cx="100"
        cy="100"
        r={RIM_RADIUS - 1}
        fill="none"
        stroke="#050505"
        strokeWidth="0.4"
      />

      {grooves.map((groove, i) => (
        <circle
          key={i}
          cx="100"
          cy="100"
          r={groove.radius}
          fill="none"
          stroke={groove.stroke}
          strokeWidth={GROOVE_SPACING / 2}
          opacity={groove.opacity}
        />
      ))}

      {/* Smooth, glossier gaps between tracks */}
      {gaps.map((gap, i) => (
        <circle
          key={i}
          cx="100"
          cy="100"
          r={gap.radius}
          fill="none"
          stroke="#080808"
          strokeWidth={TRACK_GAP}
        />
      ))}

      {/* Lead-out spiral and locked groove in the dead wax */}
      <circle
        cx="100"
        cy="100"
        r={RUN_OUT_RADIUS - 2.5}
        fill="none"
        stroke="#222"
        strokeWidth="0.3"
      />
      <circle
        cx="100"
        cy="100"
        r={LABEL_RADIUS + 2.5}
        fill="none"
        stroke="#222"
        strokeWidth="0.3"
      />

      {/* Hand-etched matrix number, like a real pressing */}
      <text
        fill="#3a3a3a"
        style={{ fontSize: "2.2px", letterSpacing: "0.4px" }}
      >
        <textPath href="#run-out-arc" startOffset="8%">
          CV-2000-A1 ✱ SIDE A
        </textPath>
      </text>
    </svg>
  );
});

VinylGrooves.displayName = "VinylGrooves";

export default VinylGrooves;
