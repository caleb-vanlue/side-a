"use client";

import { useState, useRef, useEffect } from "react";
import VinylGrooves from "./VinylGrooves";
import VinylReflection from "./VinylReflection";
import VinylLabel from "./VinylLabel";

interface VinylRecordProps {
  backgroundColor?: string;
  isSpinning?: boolean;
}

export default function VinylRecord({ isSpinning = false }: VinylRecordProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const recordRef = useRef<HTMLDivElement>(null);
  const lastAngleRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  const animationRef = useRef<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      const currentTime = Date.now();
      const angleDiff = currentAngle - lastAngleRef.current;
      const timeDiff = currentTime - lastTimeRef.current;

      let normalizedDiff = angleDiff;
      if (angleDiff > 180) normalizedDiff -= 360;
      if (angleDiff < -180) normalizedDiff += 360;

      if (timeDiff > 0) {
        let newVelocity = (normalizedDiff / timeDiff) * 16;
        newVelocity = Math.max(-5, Math.min(5, newVelocity));
        setVelocity(newVelocity);
      }

      setRotation((prev) => prev + normalizedDiff);
      lastAngleRef.current = currentAngle;
      lastTimeRef.current = currentTime;
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (recordRef.current) {
      const rect = recordRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const currentX = e.clientX - centerX;

      const isOnRightHalf = currentX > 0;
      const scrollDirection = e.deltaY > 0 ? 1 : -1;
      const rotationDirection = isOnRightHalf
        ? -scrollDirection
        : scrollDirection;

      const scrollIntensity = Math.min(Math.abs(e.deltaY) / 100, 1);
      const newVelocity = rotationDirection * scrollIntensity * 4;

      setVelocity((prev) => {
        const combined = prev + newVelocity;
        return Math.max(-5, Math.min(5, combined));
      });
    }
  };

  useEffect(() => {
    const element = recordRef.current;
    if (!element) return;

    const preventDefaultWheel = (e: WheelEvent) => {
      e.preventDefault();
    };

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
        const currentTime = Date.now();
        const angleDiff = currentAngle - lastAngleRef.current;
        const timeDiff = currentTime - lastTimeRef.current;

        let normalizedDiff = angleDiff;
        if (angleDiff > 180) normalizedDiff -= 360;
        if (angleDiff < -180) normalizedDiff += 360;

        if (timeDiff > 0) {
          let newVelocity = (normalizedDiff / timeDiff) * 16;
          newVelocity = Math.max(-5, Math.min(5, newVelocity));
          setVelocity(newVelocity);
        }

        setRotation((prev) => prev + normalizedDiff);
        lastAngleRef.current = currentAngle;
        lastTimeRef.current = currentTime;
      }
    };

    const touchEndHandler = (e: TouchEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    element.addEventListener("wheel", preventDefaultWheel, { passive: false });
    element.addEventListener("touchstart", touchStartHandler, {
      passive: false,
    });
    element.addEventListener("touchmove", touchMoveHandler, { passive: false });
    element.addEventListener("touchend", touchEndHandler, { passive: false });

    return () => {
      element.removeEventListener("wheel", preventDefaultWheel);
      element.removeEventListener("touchstart", touchStartHandler);
      element.removeEventListener("touchmove", touchMoveHandler);
      element.removeEventListener("touchend", touchEndHandler);
    };
  });

  useEffect(() => {
    if (isSpinning && !isDragging) {
      let lastTimestamp = 0;

      const animate = (timestamp: number) => {
        if (timestamp - lastTimestamp > 16) {
          setRotation((r) => r + 1);
          lastTimestamp = timestamp;
        }
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else if (!isDragging && Math.abs(velocity) > 0.1) {
      const animate = () => {
        setVelocity((v) => {
          const newVelocity = v * 0.92;

          setRotation((r) => r + v);

          if (Math.abs(newVelocity) < 0.1) {
            return 0;
          }
          return newVelocity;
        });

        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDragging, velocity, isSpinning]);

  // In VinylRecord.tsx
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
        ...(isMobile
          ? {}
          : {
              maskImage: `radial-gradient(circle at center, transparent 2%, black 2%)`,
              WebkitMaskImage: `radial-gradient(circle at center, transparent 2%, black 2%)`,
              maskSize: "100% 100%",
              WebkitMaskSize: "100% 100%",
            }),
        willChange:
          isDragging || isSpinning || Math.abs(velocity) > 0.1
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
      onWheel={handleWheel}
    >
      <VinylGrooves />
      <VinylReflection />
      <VinylLabel />
    </div>
  );
}
