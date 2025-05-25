"use client";

import { useRef, useEffect } from "react";
import VinylGrooves from "./VinylGrooves";
import { VinylReflection, VinylLabel, SpindleHole } from ".";
import useVinylRotation from "../hooks/useVinylRotation";

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
      e.preventDefault();
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
      e.preventDefault();
      e.stopPropagation();
      handleWheel(e.deltaY, e.clientX, recordRef.current);
    }
  };

  useEffect(() => {
    const element = recordRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        if (recordRef.current) {
          startDrag(touch.clientX, touch.clientY, recordRef.current);
        }
        e.preventDefault();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDragging) {
        const touch = e.touches[0];
        if (recordRef.current) {
          updateDrag(touch.clientX, touch.clientY, recordRef.current);
        }
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      stopDrag();
      e.preventDefault();
    };

    element.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    element.addEventListener("touchmove", handleTouchMove, { passive: false });
    element.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, startDrag, updateDrag, stopDrag]);

  return (
    <div
      ref={recordRef}
      className={`relative aspect-square w-full h-full rounded-full ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      } touch-none select-none`}
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
