"use client";

import { useRef } from "react";
import VinylGrooves from "./VinylGrooves";
import VinylReflection from "./VinylReflection";
import VinylLabel from "./VinylLabel";
import SpindleHole from "./SpindleHole";
import useVinylRotation from "../app/hooks/useVinylRotation";

interface VinylRecordProps {
  backgroundColor?: string;
  isSpinning?: boolean;
  rotationSpeed?: number;
}

export default function VinylRecord({
  backgroundColor = "white",
  isSpinning = false,
  rotationSpeed = 1,
}: VinylRecordProps) {
  const recordRef = useRef<HTMLDivElement>(null);

  const { rotation, isDragging, startDrag, stopDrag, updateDrag, handleWheel } =
    useVinylRotation({
      isSpinning,
      rotationSpeed,
    });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (recordRef.current) {
      startDrag(e.clientX, e.clientY, recordRef.current);
    }
  };

  const handleMouseUp = () => {
    stopDrag();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (recordRef.current) {
      updateDrag(e.clientX, e.clientY, recordRef.current);
    }
  };

  const handleWheelEvent = (e: React.WheelEvent) => {
    if (recordRef.current) {
      handleWheel(e.deltaY, e.clientX, recordRef.current);
    }
  };

  return (
    <div
      ref={recordRef}
      className={`relative aspect-square w-full h-full rounded-full ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      } touch-none`}
      style={{
        background: "#0f0f0f",
        transform: `rotate(${rotation}deg)`,
        isolation: "isolate",
        maskImage: `radial-gradient(circle at center, transparent 2%, black 2%)`,
        WebkitMaskImage: `radial-gradient(circle at center, transparent 2%, black 2%)`,
        maskSize: "100% 100%",
        WebkitMaskSize: "100% 100%",
        willChange:
          isDragging || isSpinning || Math.abs(rotation % 1) > 0
            ? "transform"
            : "auto",
        contain: "layout style",
        backfaceVisibility: "hidden",
        perspective: 1000,
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      onWheel={handleWheelEvent}
    >
      <VinylGrooves />
      <VinylReflection />
      <VinylLabel />
      <SpindleHole backgroundColor={backgroundColor} isPlaying={isSpinning} />
    </div>
  );
}
