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
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 200 200"
        style={{ pointerEvents: "none" }}
      >
        {Array.from({ length: 65 }, (_, i) => {
          const radius = 35 + i * 1;
          const strokeWidth = i % 3 === 0 ? 0.8 : 0.4;
          const opacity = i % 3 === 0 ? 0.7 : 0.4;

          return (
            <circle
              key={i}
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke={i % 2 === 0 ? "#2a2a2a" : "#1a1a1a"}
              strokeWidth={strokeWidth}
              opacity={opacity}
            />
          );
        })}
      </svg>

      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: `
            conic-gradient(
              from 90deg at 50% 50%,
              transparent 0deg,
              rgba(255,255,255,0.05) 45deg,
              rgba(255,255,255,0.1) 90deg,
              rgba(255,255,255,0.05) 135deg,
              transparent 180deg,
              transparent 360deg
            ),
            radial-gradient(
              circle at 30% 30%,
              rgba(255,255,255,0.06) 0%,
              transparent 50%
            )
          `,
        }}
      />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35%] h-[35%] rounded-full pointer-events-none overflow-hidden">
        <div
          className="w-full h-full"
          style={{
            background: `
              radial-gradient(circle at 30% 30%, #d32f2f 0%, #f44336 50%, #ef5350 100%),
              radial-gradient(circle at 70% 70%, #e53935 0%, #ef5350 100%)
            `,
            boxShadow: "inset 0 0 10px rgba(0,0,0,0.2)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 5px,
                rgba(0,0,0,0.02) 5px,
                rgba(0,0,0,0.02) 6px
              ),
              repeating-linear-gradient(
                -45deg,
                transparent,
                transparent 5px,
                rgba(0,0,0,0.02) 5px,
                rgba(0,0,0,0.02) 6px
              )
            `,
          }}
        />
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35%] h-[35%] pointer-events-none">
        <div className="absolute top-[22%] left-1/2 -translate-x-1/2 text-white/90 text-[0.5rem] sm:text-xs font-medium tracking-widest">
          CALEB VAN LUE
        </div>

        <div className="absolute top-[42%] left-1/2 -translate-x-1/2 text-white text-base sm:text-xl md:text-2xl font-bold tracking-wider">
          SIDE A
        </div>

        <div className="absolute top-[58%] left-1/2 -translate-x-1/2 text-white/80 text-[0.5rem] sm:text-xs">
          33⅓ RPM
        </div>

        <div className="absolute bottom-[28%] left-1/2 -translate-x-1/2 text-white/70 text-[0.4rem] sm:text-xs font-mono">
          CV-2000-0{new Date().getFullYear() - 2000}
        </div>

        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <defs>
            <path id="bottom-arc" d="M 15,50 A 35,35 0 0,0 85,50" />
          </defs>
          <text
            className="fill-white/60"
            style={{ fontSize: "2.5px", letterSpacing: "0.6px" }}
          >
            <textPath href="#bottom-arc" startOffset="50%" textAnchor="middle">
              STEREO • MADE IN USA • ALL RIGHTS RESERVED
            </textPath>
          </text>
        </svg>
      </div>

      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[3%] h-[3%] rounded-full pointer-events-none"
        style={{ backgroundColor }}
      />
    </div>
  );
}
