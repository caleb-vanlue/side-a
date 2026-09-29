"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import VinylGrooves from "./VinylGrooves";
import VinylReflection from "./VinylReflection";
import VinylLabel from "./VinylLabel";
import SpindleHole from "./SpindleHole";
import useVinylRotation from "../hooks/useVinylRotation";

interface VinylRecordProps {
  backgroundColor?: string;
  isSpinning?: boolean;
  rotationSpeed?: number;
}

const VinylRecord = React.memo<VinylRecordProps>(
  ({ backgroundColor = "white", isSpinning = false, rotationSpeed = 1 }) => {
    const recordRef = useRef<HTMLDivElement>(null);

    const { rotation, isDragging, handlers } = useVinylRotation({
      elementRef: recordRef,
      isSpinning,
      rotationSpeed,
    });

    return (
      <div className="relative aspect-square w-full h-full">
        <motion.div
          ref={recordRef}
          className={`absolute inset-0 rounded-full ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          } touch-none select-none`}
          style={{
            rotate: rotation,
            background: "#0f0f0f",
            isolation: "isolate",
            maskImage: `radial-gradient(circle at center, transparent 2%, black 2%)`,
            WebkitMaskImage: `radial-gradient(circle at center, transparent 2%, black 2%)`,
            maskSize: "100% 100%",
            WebkitMaskSize: "100% 100%",
            // Always on, so the layer isn't torn down and rebuilt between spins
            willChange: "transform",
            contain: "layout style",
          }}
          {...handlers}
        >
          <VinylGrooves />
          <VinylReflection />
          <VinylLabel />
        </motion.div>
        {/* Outside the rotating layer: it's centred, so rotation is invisible,
            and its backdrop blur would otherwise be recomputed every frame. */}
        <SpindleHole backgroundColor={backgroundColor} isPlaying={isSpinning} />
      </div>
    );
  }
);

VinylRecord.displayName = "VinylRecord";

export default VinylRecord;
