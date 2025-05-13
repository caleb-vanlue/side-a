"use client";

import { useState, useRef, useEffect } from "react";
import ToneArm from "./ToneArm";

export default function ToneArmContainer() {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pivotRef = useRef<{ x: number; y: number } | null>(null);

  // Calculate the pivot point (base of the tone arm)
  useEffect(() => {
    const updatePivotPoint = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // The pivot is at the top of the tone arm (20px from top in SVG coordinates)
        pivotRef.current = {
          x: rect.left + rect.width / 2,
          y: rect.top + (rect.height * 20) / 300, // 20 is the cy of the base in the SVG viewBox
        };
      }
    };

    updatePivotPoint();
    window.addEventListener("resize", updatePivotPoint);
    return () => window.removeEventListener("resize", updatePivotPoint);
  }, []);

  const calculateRotation = (clientX: number, clientY: number) => {
    if (!pivotRef.current) return 0;

    const deltaX = clientX - pivotRef.current.x;
    const deltaY = clientY - pivotRef.current.y;

    // Calculate angle in radians, then convert to degrees
    // Note: Using negative deltaX to fix the inverted direction
    let angle = Math.atan2(-deltaX, deltaY) * (180 / Math.PI);

    // Constrain the rotation: 0 degrees (straight down) to 45 degrees (onto record)
    angle = Math.max(0, Math.min(45, angle));

    return angle;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start dragging if clicking on the needle/headshell area
    const target = e.target as SVGElement;
    if (target.closest("g.cursor-grab")) {
      setIsDragging(true);
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newRotation = calculateRotation(e.clientX, e.clientY);
      setRotation(newRotation);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle global mouse events
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newRotation = calculateRotation(e.clientX, e.clientY);
        setRotation(newRotation);
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-visible"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <ToneArm rotation={rotation} />
    </div>
  );
}
