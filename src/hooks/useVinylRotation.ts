import { useState, useRef, useEffect } from "react";

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
  const [velocity, setVelocity] = useState(0);
  const lastAngleRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  const animationRef = useRef<number | null>(null);

  const calculateAngle = (
    clientX: number,
    clientY: number,
    element: HTMLElement
  ) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;

    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    return angle;
  };

  const startDrag = (
    clientX: number,
    clientY: number,
    element: HTMLElement
  ) => {
    setIsDragging(true);
    lastAngleRef.current = calculateAngle(clientX, clientY, element);
    lastTimeRef.current = Date.now();
  };

  const stopDrag = () => {
    setIsDragging(false);
  };

  const updateDrag = (
    clientX: number,
    clientY: number,
    element: HTMLElement
  ) => {
    if (!isDragging) return;

    const currentAngle = calculateAngle(clientX, clientY, element);
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
  };

  const handleWheel = (
    deltaY: number,
    clientX: number,
    element: HTMLElement
  ) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const currentX = clientX - centerX;

    const isOnRightHalf = currentX > 0;
    const scrollDirection = deltaY > 0 ? 1 : -1;
    const rotationDirection = isOnRightHalf
      ? -scrollDirection
      : scrollDirection;

    const scrollIntensity = Math.min(Math.abs(deltaY) / 100, 1);
    const newVelocity = rotationDirection * scrollIntensity * 4;

    setVelocity((prev) => {
      const combined = prev + newVelocity;
      return Math.max(-5, Math.min(5, combined));
    });
  };

  useEffect(() => {
    if (isSpinning && !isDragging) {
      let lastTimestamp = 0;

      const animate = (timestamp: number) => {
        if (timestamp - lastTimestamp > 16) {
          setRotation((r) => r + rotationSpeed);
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
  }, [isDragging, velocity, isSpinning, rotationSpeed]);

  return {
    rotation,
    isDragging,
    startDrag,
    stopDrag,
    updateDrag,
    handleWheel,
  };
}
