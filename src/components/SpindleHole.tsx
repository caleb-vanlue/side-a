import React from "react";
import { VINYL_CONSTANTS } from "../lib/constants";

interface SpindleHoleProps {
  backgroundColor: string;
  isPlaying?: boolean;
}

const SpindleHole = React.memo<SpindleHoleProps>(
  ({ backgroundColor, isPlaying = false }) => {
    return (
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: `${VINYL_CONSTANTS.SPINDLE_HOLE_SIZE_PERCENTAGE}%`,
          height: `${VINYL_CONSTANTS.SPINDLE_HOLE_SIZE_PERCENTAGE}%`,
          backgroundColor: isPlaying
            ? "rgba(255, 255, 255, 0.3)"
            : backgroundColor,
          backdropFilter: isPlaying ? "blur(5px)" : "none",
          transition: "all 0.5s ease-in-out",
        }}
      />
    );
  }
);

SpindleHole.displayName = "SpindleHole";

export default SpindleHole;
