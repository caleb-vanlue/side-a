import { useState, useRef, useEffect, useCallback } from "react";

interface UseVinylRotationProps {
  isSpinning: boolean;
  rotationSpeed?: number;
}

export default function useVinylRotation({
  isSpinning,
  rotationSpeed = 1,
}: UseVinylRotationProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState(0);

  // Animation state lives in refs — no re-renders, no stale closures
  const rotationRef = useRef(0);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isSpinningRef = useRef(isSpinning);
  const rotationSpeedRef = useRef(rotationSpeed);
  const lastAngleRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  const animationRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef(0);

  // Keep prop refs in sync without restarting the loop
  useEffect(() => {
    isSpinningRef.current = isSpinning;
  }, [isSpinning]);

  useEffect(() => {
    rotationSpeedRef.current = rotationSpeed;
  }, [rotationSpeed]);

  // Single persistent loop — starts once, reads everything from refs
  useEffect(() => {
    const animate = (timestamp: number) => {
      const spinning = isSpinningRef.current;
      const dragging = isDraggingRef.current;

      if (spinning && !dragging) {
        // Throttle spinning to ~60fps to match original speed
        if (timestamp - lastFrameTimeRef.current >= 16) {
          lastFrameTimeRef.current = timestamp;
          rotationRef.current += rotationSpeedRef.current;
          setRotation(rotationRef.current);
        }
        velocityRef.current = 0;
      } else if (!dragging && Math.abs(velocityRef.current) > 0.1) {
        rotationRef.current += velocityRef.current;
        velocityRef.current *= 0.92;
        if (Math.abs(velocityRef.current) < 0.1) {
          velocityRef.current = 0;
        }
        setRotation(rotationRef.current);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const calculateAngle = useCallback(
    (clientX: number, clientY: number, element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      return (
        Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI)
      );
    },
    []
  );

  const startDrag = useCallback(
    (clientX: number, clientY: number, element: HTMLElement) => {
      isDraggingRef.current = true;
      setIsDragging(true);
      velocityRef.current = 0;
      lastAngleRef.current = calculateAngle(clientX, clientY, element);
      lastTimeRef.current = Date.now();
    },
    [calculateAngle]
  );

  const stopDrag = useCallback(() => {
    isDraggingRef.current = false;
    setIsDragging(false);
  }, []);

  const updateDrag = useCallback(
    (clientX: number, clientY: number, element: HTMLElement) => {
      if (!isDraggingRef.current) return;

      const currentAngle = calculateAngle(clientX, clientY, element);
      const currentTime = Date.now();
      const angleDiff = currentAngle - lastAngleRef.current;
      const timeDiff = currentTime - lastTimeRef.current;

      let normalizedDiff = angleDiff;
      if (angleDiff > 180) normalizedDiff -= 360;
      if (angleDiff < -180) normalizedDiff += 360;

      if (timeDiff > 0) {
        const newVelocity = (normalizedDiff / timeDiff) * 16;
        velocityRef.current = Math.max(-5, Math.min(5, newVelocity));
      }

      rotationRef.current += normalizedDiff;
      setRotation(rotationRef.current);
      lastAngleRef.current = currentAngle;
      lastTimeRef.current = currentTime;
    },
    [calculateAngle]
  );

  const handleWheel = useCallback(
    (deltaY: number, clientX: number, element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const isOnRightHalf = clientX - centerX > 0;
      const scrollDirection = deltaY > 0 ? 1 : -1;
      const rotationDirection = isOnRightHalf ? -scrollDirection : scrollDirection;
      const scrollIntensity = Math.min(Math.abs(deltaY) / 100, 1);
      const delta = rotationDirection * scrollIntensity * 4;
      const combined = velocityRef.current + delta;
      velocityRef.current = Math.max(-5, Math.min(5, combined));
    },
    []
  );

  return {
    rotation,
    isDragging,
    startDrag,
    stopDrag,
    updateDrag,
    handleWheel,
  };
}
