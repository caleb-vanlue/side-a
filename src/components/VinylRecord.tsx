"use client";

import { useState, useRef, useEffect } from "react";
import VinylGrooves from "./VinylGrooves";
import VinylReflection from "./VinylReflection";
import VinylLabel from "./VinylLabel";
import SpindleHole from "./SpindleHole";

interface VinylRecordProps {
  backgroundColor?: string;
}

export default function VinylRecord({
  backgroundColor = "white",
}: VinylRecordProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const recordRef = useRef<HTMLDivElement>(null);
  const lastAngleRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  const animationRef = useRef<number | null>(null);

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
        newVelocity = Math.max(-10, Math.min(10, newVelocity));
        setVelocity(newVelocity);
      }

      setRotation((prev) => prev + normalizedDiff);
      lastAngleRef.current = currentAngle;
      lastTimeRef.current = currentTime;
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
        const currentTime = Date.now();
        const angleDiff = currentAngle - lastAngleRef.current;
        const timeDiff = currentTime - lastTimeRef.current;

        let normalizedDiff = angleDiff;
        if (angleDiff > 180) normalizedDiff -= 360;
        if (angleDiff < -180) normalizedDiff += 360;

        if (timeDiff > 0) {
          let newVelocity = (normalizedDiff / timeDiff) * 16;
          newVelocity = Math.max(-10, Math.min(10, newVelocity));
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
  });

  useEffect(() => {
    if (!isDragging && Math.abs(velocity) > 0.1) {
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
  }, [isDragging, velocity]);

  return (
    <div
      ref={recordRef}
      className={`relative w-[80vw] h-[80vw] max-w-[80vh] max-h-[80vh] rounded-full ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      } touch-none overflow-hidden`}
      style={{
        background: "#0f0f0f",
        transform: `rotate(${rotation}deg)`,
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <VinylGrooves />
      <VinylReflection />
      <VinylLabel />
      <SpindleHole backgroundColor={backgroundColor} />
    </div>
  );
}
