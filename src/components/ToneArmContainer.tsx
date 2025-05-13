"use client";

import { useState, useRef, useEffect } from "react";
import ToneArm from "./ToneArm";

interface ToneArmContainerProps {
  onRotationChange?: (rotation: number) => void;
  isPlaying?: boolean;
  targetRotation?: number | null;
}

export default function ToneArmContainer({
  onRotationChange,
  isPlaying,
  targetRotation = null,
}: ToneArmContainerProps) {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pivotRef = useRef<{ x: number; y: number } | null>(null);
  const playbackAnimationRef = useRef<number | null>(null);
  const targetAnimationRef = useRef<number | null>(null);

  useEffect(() => {
    const updatePivotPoint = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        pivotRef.current = {
          x: rect.left + rect.width / 2,
          y: rect.top + (rect.height * 20) / 300,
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

    let angle = Math.atan2(-deltaX, deltaY) * (180 / Math.PI);
    angle = Math.max(0, Math.min(45, angle));

    return angle;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
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

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as SVGElement;
      if (target.closest("g.cursor-grab")) {
        setIsDragging(true);
        e.preventDefault();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length > 0) {
        const touch = e.touches[0];
        const newRotation = calculateRotation(touch.clientX, touch.clientY);
        setRotation(newRotation);
        onRotationChange?.(newRotation);
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    element.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    element.addEventListener("touchmove", handleTouchMove, { passive: false });
    element.addEventListener("touchend", handleTouchEnd);

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, onRotationChange]);

  useEffect(() => {
    onRotationChange?.(rotation);
  }, [rotation, onRotationChange]);

  useEffect(() => {
    if (targetRotation !== null && !isDragging) {
      if (playbackAnimationRef.current) {
        cancelAnimationFrame(playbackAnimationRef.current);
        playbackAnimationRef.current = null;
      }

      const animate = () => {
        setRotation((prevRotation) => {
          const diff = targetRotation - prevRotation;
          const speed = 0.001;

          if (Math.abs(diff) < 0.5) {
            if (targetAnimationRef.current) {
              cancelAnimationFrame(targetAnimationRef.current);
              targetAnimationRef.current = null;
            }
            return targetRotation;
          }

          const newRotation = prevRotation + diff * speed;
          targetAnimationRef.current = requestAnimationFrame(animate);
          return newRotation;
        });
      };

      targetAnimationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (targetAnimationRef.current) {
        cancelAnimationFrame(targetAnimationRef.current);
      }
    };
  }, [targetRotation, isDragging]);

  useEffect(() => {
    if (isPlaying && targetRotation === null && rotation < 47) {
      const animate = () => {
        setRotation((prevRotation) => {
          const newRotation = prevRotation + 0.005;
          if (newRotation >= 47) {
            return 47;
          }

          return newRotation;
        });

        playbackAnimationRef.current = requestAnimationFrame(animate);
      };

      playbackAnimationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (playbackAnimationRef.current) {
        cancelAnimationFrame(playbackAnimationRef.current);
      }
    };
  }, [isPlaying, targetRotation]);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newRotation = calculateRotation(e.clientX, e.clientY);
        setRotation(newRotation);
      }
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length > 0) {
        const touch = e.touches[0];
        const newRotation = calculateRotation(touch.clientX, touch.clientY);
        setRotation(newRotation);
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    const handleGlobalTouchEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);
      document.addEventListener("touchmove", handleGlobalTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleGlobalTouchEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
      document.removeEventListener("touchmove", handleGlobalTouchMove);
      document.removeEventListener("touchend", handleGlobalTouchEnd);
    };
  }, [isDragging, onRotationChange]);

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
