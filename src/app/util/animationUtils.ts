export const easings = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => --t * t * t + 1,
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
};

export const animateValue = (
  start: number,
  end: number,
  duration: number,
  easing: (t: number) => number = easings.easeOutQuad,
  onUpdate: (value: number) => void,
  onComplete?: () => void
) => {
  let startTime: number | null = null;
  let animationFrameId: number | null = null;

  const animate = (timestamp: number) => {
    if (!startTime) startTime = timestamp;

    const elapsedTime = timestamp - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    const easedProgress = easing(progress);

    const value = start + (end - start) * easedProgress;
    onUpdate(value);

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(animate);
    } else if (onComplete) {
      onComplete();
    }
  };

  animationFrameId = requestAnimationFrame(animate);

  return () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  };
};

export const smoothRotateTo = (
  currentRotation: number,
  targetRotation: number,
  duration: number = 300,
  onUpdate: (value: number) => void,
  onComplete?: () => void
) => {
  let diff = targetRotation - currentRotation;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;

  const endRotation = currentRotation + diff;

  return animateValue(
    currentRotation,
    endRotation,
    duration,
    easings.easeOutQuad,
    onUpdate,
    onComplete
  );
};
