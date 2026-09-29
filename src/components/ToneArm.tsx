import React from "react";
import { motion, type MotionValue } from "framer-motion";

// Arm geometry in SVG units. The pivot is shared with ToneArmContainer's
// drag math, so both must use these values.
export const TONE_ARM_VIEWBOX = { width: 100, height: 300 };
export const TONE_ARM_PIVOT = { x: 50, y: 20 };

const VIEWBOX = `0 0 ${TONE_ARM_VIEWBOX.width} ${TONE_ARM_VIEWBOX.height}`;

interface ToneArmProps {
  rotation: MotionValue<number>;
}

/**
 * The arm rotates on an HTML wrapper rather than an SVG <g>, so the browser
 * can move it on the compositor instead of repainting the SVG every frame.
 * Both layers must fill a box with the viewBox's aspect ratio for the
 * transform origin to line up with the pivot.
 */
const ToneArm = React.memo<ToneArmProps>(({ rotation }) => {
  return (
    <>
      <svg
        viewBox={VIEWBOX}
        className="absolute inset-0 w-full h-full overflow-visible"
        aria-hidden="true"
      >
        <circle
          cx={TONE_ARM_PIVOT.x}
          cy={TONE_ARM_PIVOT.y}
          r="12"
          fill="#2a2a2a"
          stroke="#1a1a1a"
          strokeWidth="1"
        />
        <circle cx={TONE_ARM_PIVOT.x} cy={TONE_ARM_PIVOT.y} r="8" fill="#3a3a3a" />
        <circle cx={TONE_ARM_PIVOT.x} cy={TONE_ARM_PIVOT.y} r="4" fill="#1a1a1a" />
      </svg>

      <motion.div
        className="absolute inset-0"
        style={{
          rotate: rotation,
          originX: TONE_ARM_PIVOT.x / TONE_ARM_VIEWBOX.width,
          originY: TONE_ARM_PIVOT.y / TONE_ARM_VIEWBOX.height,
          willChange: "transform",
        }}
      >
        <svg
          viewBox={VIEWBOX}
          className="w-full h-full overflow-visible"
          aria-hidden="true"
        >
          <rect x="47" y="20" width="6" height="180" fill="#3a3a3a" rx="3" />

          <circle
            cx="50"
            cy="200"
            r="8"
            fill="#2a2a2a"
            stroke="#1a1a1a"
            strokeWidth="1"
          />

          <rect x="48" y="200" width="4" height="60" fill="#3a3a3a" rx="2" />

          <g>
            <path
              d="M 45 260 L 45 270 L 50 275 L 55 270 L 55 260 Z"
              fill="#2a2a2a"
              stroke="#1a1a1a"
              strokeWidth="1"
            />
            <rect x="49" y="270" width="2" height="10" fill="#1a1a1a" />
            <path d="M 49 280 L 50 285 L 51 280 Z" fill="#888" />
          </g>

          <rect x="45" y="5" width="10" height="15" fill="#4a4a4a" rx="5" />

          <rect
            x="49"
            y="20"
            width="1"
            height="180"
            fill="rgba(255,255,255,0.1)"
            rx="0.5"
          />
        </svg>
      </motion.div>
    </>
  );
});

ToneArm.displayName = "ToneArm";

export default ToneArm;
