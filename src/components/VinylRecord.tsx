"use client";

import { useState, useRef, useEffect } from "react";

interface VinylRecordProps {
  backgroundColor?: string;
}

export default function VinylRecord({
  backgroundColor = "white",
}: VinylRecordProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState(0);
  const recordRef = useRef<HTMLDivElement>(null);
  const lastAngleRef = useRef(0);

  const calculateAngle = (clientX: number, clientY: number) => {
    if (!recordRef.current) return 0;

    const rect = recordRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;

    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    return angle;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    lastAngleRef.current = calculateAngle(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const currentAngle = calculateAngle(e.clientX, e.clientY);
      const angleDiff = currentAngle - lastAngleRef.current;

      let normalizedDiff = angleDiff;
      if (angleDiff > 180) normalizedDiff -= 360;
      if (angleDiff < -180) normalizedDiff += 360;

      setRotation((prev) => prev + normalizedDiff);
      lastAngleRef.current = currentAngle;
    }
  };

  useEffect(() => {
    const element = recordRef.current;
    if (!element) return;

    const touchStartHandler = (e: TouchEvent) => {
      e.preventDefault();
      setIsDragging(true);
      const touch = e.touches[0];
      lastAngleRef.current = calculateAngle(touch.clientX, touch.clientY);
    };

    const touchMoveHandler = (e: TouchEvent) => {
      e.preventDefault();
      if (isDragging) {
        const touch = e.touches[0];
        const currentAngle = calculateAngle(touch.clientX, touch.clientY);
        const angleDiff = currentAngle - lastAngleRef.current;

        let normalizedDiff = angleDiff;
        if (angleDiff > 180) normalizedDiff -= 360;
        if (angleDiff < -180) normalizedDiff += 360;

        setRotation((prev) => prev + normalizedDiff);
        lastAngleRef.current = currentAngle;
      }
    };

    const touchEndHandler = (e: TouchEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    element.addEventListener("touchstart", touchStartHandler, {
      passive: false,
    });
    element.addEventListener("touchmove", touchMoveHandler, { passive: false });
    element.addEventListener("touchend", touchEndHandler, { passive: false });

    return () => {
      element.removeEventListener("touchstart", touchStartHandler);
      element.removeEventListener("touchmove", touchMoveHandler);
      element.removeEventListener("touchend", touchEndHandler);
    };
  }, [isDragging]);

  return (
    <div
      ref={recordRef}
      className={`relative w-[80vw] h-[80vw] max-w-[80vh] max-h-[80vh] rounded-full ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      } touch-none`}
      style={{
        background: `
          repeating-radial-gradient(
            circle,
            #6b7280 0px,
            #6b7280 3px,
            #9ca3af 3px,
            #9ca3af 4px,
            #6b7280 4px,
            #6b7280 8px,
            #9ca3af 8px,
            #9ca3af 10px
          )
        `,
        transform: `rotate(${rotation}deg)`,
        transition: isDragging ? "none" : "transform 0.1s ease-out",
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-gray-600 rounded-full pointer-events-none" />
      <div className="absolute top-[35%] left-1/2 -translate-x-1/2 text-gray-400 text-lg font-bold tracking-wider pointer-events-none">
        Side A
      </div>
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2%] h-[2%] rounded-full pointer-events-none"
        style={{ backgroundColor }}
      />
    </div>
  );
}
