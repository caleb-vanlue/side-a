import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { useAnimationFrame, useMotionValue } from "framer-motion";

// Speeds are in degrees per 60fps frame (matching the original tuning) and
// scaled by real elapsed time, so the record turns at the same rate at any
// refresh rate and doesn't hitch when a frame runs long.
const FRAME_MS = 1000 / 60;
const MAX_FRAME_DELTA_MS = 50;
const MAX_VELOCITY = 5;
const MIN_VELOCITY = 0.1;
// Fraction of velocity kept per frame when coasting after a fling or stop
const FRICTION = 0.92;
// Fraction of the gap to full speed left per frame while spinning up
const SPIN_UP = 0.94;
// A release this long after the last move is a hold, not a fling
const FLING_WINDOW_MS = 80;

const angleFromCenter = (
  center: { x: number; y: number },
  clientX: number,
  clientY: number
) => Math.atan2(clientY - center.y, clientX - center.x) * (180 / Math.PI);

interface UseVinylRotationProps {
  elementRef: RefObject<HTMLElement | null>;
  isSpinning: boolean;
  rotationSpeed?: number;
}

export default function useVinylRotation({
  elementRef,
  isSpinning,
  rotationSpeed = 1,
}: UseVinylRotationProps) {
  const rotation = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);

  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isSpinningRef = useRef(isSpinning);
  const rotationSpeedRef = useRef(rotationSpeed);
  const centerRef = useRef({ x: 0, y: 0 });
  const lastAngleRef = useRef(0);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    isSpinningRef.current = isSpinning;
  }, [isSpinning]);

  useEffect(() => {
    rotationSpeedRef.current = rotationSpeed;
  }, [rotationSpeed]);

  useAnimationFrame((_, delta) => {
    if (isDraggingRef.current) return;

    const frames = Math.min(delta, MAX_FRAME_DELTA_MS) / FRAME_MS;
    let velocity = velocityRef.current;

    if (isSpinningRef.current) {
      const target = rotationSpeedRef.current;
      velocity = target + (velocity - target) * Math.pow(SPIN_UP, frames);
    } else if (Math.abs(velocity) > MIN_VELOCITY) {
      velocity *= Math.pow(FRICTION, frames);
    } else {
      velocity = 0;
    }

    velocityRef.current = velocity;
    if (velocity !== 0) rotation.set(rotation.get() + velocity * frames);
  });

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!e.isPrimary || e.button !== 0 || !elementRef.current) return;

      // A rotated square's bounding box is still centred on the record
      const rect = elementRef.current.getBoundingClientRect();
      centerRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };

      e.currentTarget.setPointerCapture(e.pointerId);
      e.preventDefault();
      isDraggingRef.current = true;
      setIsDragging(true);
      velocityRef.current = 0;
      lastAngleRef.current = angleFromCenter(centerRef.current, e.clientX, e.clientY);
      lastTimeRef.current = e.timeStamp;
    },
    [elementRef]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!isDraggingRef.current) return;

      const angle = angleFromCenter(centerRef.current, e.clientX, e.clientY);
      let diff = angle - lastAngleRef.current;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;

      const elapsed = e.timeStamp - lastTimeRef.current;
      if (elapsed > 0) {
        const velocity = (diff / elapsed) * FRAME_MS;
        velocityRef.current = Math.max(
          -MAX_VELOCITY,
          Math.min(MAX_VELOCITY, velocity)
        );
      }

      rotation.set(rotation.get() + diff);
      lastAngleRef.current = angle;
      lastTimeRef.current = e.timeStamp;
    },
    [rotation]
  );

  const onPointerEnd = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (!isDraggingRef.current) return;
    if (e.timeStamp - lastTimeRef.current > FLING_WINDOW_MS) {
      velocityRef.current = 0;
    }
    isDraggingRef.current = false;
    setIsDragging(false);
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const rect = element.getBoundingClientRect();
      const isOnRightHalf = e.clientX > rect.left + rect.width / 2;
      const scrollDirection = e.deltaY > 0 ? 1 : -1;
      const rotationDirection = isOnRightHalf
        ? -scrollDirection
        : scrollDirection;
      const scrollIntensity = Math.min(Math.abs(e.deltaY) / 100, 1);
      const combined =
        velocityRef.current + rotationDirection * scrollIntensity * 4;
      velocityRef.current = Math.max(
        -MAX_VELOCITY,
        Math.min(MAX_VELOCITY, combined)
      );
    };

    element.addEventListener("wheel", handleWheel, { passive: false });
    return () => element.removeEventListener("wheel", handleWheel);
  }, [elementRef]);

  return {
    rotation,
    isDragging,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: onPointerEnd,
      onPointerCancel: onPointerEnd,
      onLostPointerCapture: onPointerEnd,
    },
  };
}
