import React from "react";
import { VINYL_CONSTANTS } from "../lib/constants";

// Label radius as a fraction of the closest-side gradient ray (the record's radius)
const LABEL_STOP = VINYL_CONSTANTS.LABEL_SIZE_PERCENTAGE;
const GROOVED_AREA_MASK = `radial-gradient(circle closest-side, transparent ${LABEL_STOP}%, black ${
  LABEL_STOP + 1
}%, black 99%, transparent 100%)`;

// Rendered outside the rotating layer: the light source is fixed, so the
// highlights stay put while the record spins beneath them.
const VinylReflection = React.memo(() => {
  return (
    <div
      className="absolute inset-0 rounded-full pointer-events-none"
      style={{
        background: `
          conic-gradient(
            from 0deg at 50% 50%,
            transparent 18deg,
            rgba(255,255,255,0.05) 34deg,
            rgba(255,255,255,0.13) 45deg,
            rgba(255,255,255,0.05) 56deg,
            transparent 72deg,
            transparent 198deg,
            rgba(255,255,255,0.04) 214deg,
            rgba(255,255,255,0.1) 225deg,
            rgba(255,255,255,0.04) 236deg,
            transparent 252deg
          ),
          radial-gradient(
            circle at 30% 25%,
            rgba(255,255,255,0.05) 0%,
            transparent 55%
          )
        `,
        maskImage: GROOVED_AREA_MASK,
        WebkitMaskImage: GROOVED_AREA_MASK,
      }}
    />
  );
});

VinylReflection.displayName = "VinylReflection";

export default VinylReflection;
