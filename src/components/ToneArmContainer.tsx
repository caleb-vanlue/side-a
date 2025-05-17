"use client";

import { useState, useRef, useEffect } from "react";
import ToneArm from "./ToneArm";

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
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pivotRef = useRef<{ x: number; y: number } | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastRotationRef = useRef(0);

  const resetContainerStyle = () => {
    if (containerRef.current) {
      containerRef.current.style.transform = "translateZ(0.01px)";
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.style.transform = "translateZ(0)";
        }
      }, 10);
    }
  };

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

    const angle = Math.atan2(-deltaX, deltaY) * (180 / Math.PI);
    return Math.max(0, Math.min(29, angle)); // Limit to 29 degrees to match auto-move
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as SVGElement;
    if (target.closest("g.cursor-grab")) {
      setIsDragging(true);
      onDragStart?.();
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
        onDragStart?.();
        e.preventDefault();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length > 0) {
        e.preventDefault();
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
    const timeoutId = setTimeout(() => {
      onRotationChange?.(rotation);
    }, 16);

    return () => clearTimeout(timeoutId);
  }, [rotation, onRotationChange]);

  useEffect(() => {
    resetContainerStyle();
  }, [isPlaying, targetRotation]);

  useEffect(() => {
    let currentRotation = rotation;

    const animate = () => {
      let needsUpdate = false;
      let newRotation = currentRotation;

      if (targetRotation !== null && !isDragging) {
        const diff = targetRotation - currentRotation;
        if (Math.abs(diff) >= 0.5) {
          newRotation = currentRotation + diff * 0.02;
          needsUpdate = true;

          if (Math.abs(diff) > 3) {
            resetContainerStyle();
          }
        }
      } else if (
        isPlaying &&
        targetRotation === null &&
        currentRotation < 29 &&
        !isDragging
      ) {
        newRotation = Math.min(currentRotation + 0.005, 29);
        needsUpdate = true;
      }

      if (needsUpdate) {
        currentRotation = newRotation;
        if (Math.abs(newRotation - lastRotationRef.current) > 0.01) {
          setRotation(newRotation);
          lastRotationRef.current = newRotation;
        }
        animationRef.current = requestAnimationFrame(animate);
      } else {
        animationRef.current = null;
      }
    };

    if (
      (targetRotation !== null || (isPlaying && rotation < 29)) &&
      !isDragging
    ) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [targetRotation, isPlaying, isDragging, rotation]);

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
