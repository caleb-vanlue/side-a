"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ToneArm from "./ToneArm";
import { VINYL_CONSTANTS } from "../lib/constants";
import { useRecordPlayer } from "./RecordPlayerContext";

interface ToneArmContainerProps {
  onRotationChange?: (rotation: number) => void;
  isPlaying?: boolean;
  targetRotation?: number | null;
  onDragStart?: () => void;
}

export default function ToneArmContainer({
  onRotationChange,
  isPlaying,
  targetRotation = null,
  onDragStart,
}: ToneArmContainerProps) {
  const { toneArmRotation: contextRotation } = useRecordPlayer();

  const [rotation, setRotation] = useState(contextRotation);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pivotRef = useRef<{ x: number; y: number } | null>(null);
  const animationRef = useRef<number | null>(null);

  const rotationRef = useRef(contextRotation);
  const isDraggingRef = useRef(false);
  const targetRotationRef = useRef<number | null>(null);
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    targetRotationRef.current = targetRotation;
  }, [targetRotation]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const resetContainerStyle = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.style.transform = "translateZ(0.01px)";
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.style.transform = "translateZ(0)";
        }
      }, 10);
    }
  }, []);

  const calculateRotation = useCallback((clientX: number, clientY: number) => {
    if (!pivotRef.current) return 0;
    const deltaX = clientX - pivotRef.current.x;
    const deltaY = clientY - pivotRef.current.y;
    const angle = Math.atan2(-deltaX, deltaY) * (180 / Math.PI);
    return Math.max(0, Math.min(VINYL_CONSTANTS.MAX_TONE_ARM_ROTATION, angle));
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as SVGElement;
      if (target.closest("svg") || target.tagName === "svg") {
        isDraggingRef.current = true;
        setIsDragging(true);
        onDragStart?.();
        e.preventDefault();
      }
    },
    [onDragStart]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDraggingRef.current) {
        const newRotation = calculateRotation(e.clientX, e.clientY);
        rotationRef.current = newRotation;
        setRotation(newRotation);
      }
    },
    [calculateRotation]
  );

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    setIsDragging(false);
  }, []);

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

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        setIsDragging(true);
        onDragStart?.();
        e.preventDefault();
      }
    };

    element.addEventListener("touchstart", handleTouchStart, { passive: false });
    return () => element.removeEventListener("touchstart", handleTouchStart);
  }, [onDragStart]);

  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      const newRotation = calculateRotation(e.clientX, e.clientY);
      rotationRef.current = newRotation;
      setRotation(newRotation);
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        e.preventDefault();
        const touch = e.touches[0];
        const newRotation = calculateRotation(touch.clientX, touch.clientY);
        rotationRef.current = newRotation;
        setRotation(newRotation);
      }
    };

    const handleGlobalEnd = () => {
      isDraggingRef.current = false;
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleGlobalMouseMove);
    document.addEventListener("mouseup", handleGlobalEnd);
    document.addEventListener("touchmove", handleGlobalTouchMove, {
      passive: false,
    });
    document.addEventListener("touchend", handleGlobalEnd);

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalEnd);
      document.removeEventListener("touchmove", handleGlobalTouchMove);
      document.removeEventListener("touchend", handleGlobalEnd);
    };
  }, [isDragging, calculateRotation]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onRotationChange?.(rotation);
    }, 16);
    return () => clearTimeout(timeoutId);
  }, [rotation, onRotationChange]);

  useEffect(() => {
    resetContainerStyle();
  }, [isPlaying, targetRotation, resetContainerStyle]);

  useEffect(() => {
    const animate = () => {
      const target = targetRotationRef.current;
      const dragging = isDraggingRef.current;
      const playing = isPlayingRef.current;
      const current = rotationRef.current;

      let newRotation = current;

      if (target !== null && !dragging) {
        const diff = target - current;
        if (Math.abs(diff) >= 0.5) {
          newRotation = current + diff * 0.02;
        }
      } else if (
        playing &&
        target === null &&
        current < VINYL_CONSTANTS.NEEDLE_SETTLED_POSITION &&
        !dragging
      ) {
        newRotation = Math.min(
          current + VINYL_CONSTANTS.TONE_ARM_AUTO_SPEED,
          VINYL_CONSTANTS.NEEDLE_SETTLED_POSITION
        );
      }

      if (newRotation !== current) {
        rotationRef.current = newRotation;
        setRotation(newRotation);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-visible cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        transformStyle: "preserve-3d",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
        position: "relative",
        zIndex: 50,
      }}
    >
      <ToneArm rotation={rotation} />
    </div>
  );
}
