"use client";

import { useCallback, useRef, useState } from "react";
import ToneArm, { TONE_ARM_PIVOT, TONE_ARM_VIEWBOX } from "./ToneArm";
import { useRecordPlayer } from "./RecordPlayerContext";
import { armAngleFromPointer } from "../lib/recordPlayerMachine";

// Largest box with the arm's aspect ratio that fits the container, so the
// rotation origin (a percentage of this box) always sits on the pivot.
const ARM_BOX_STYLE = {
  width: `min(100cqw, calc(100cqh * ${TONE_ARM_VIEWBOX.width / TONE_ARM_VIEWBOX.height}))`,
  aspectRatio: `${TONE_ARM_VIEWBOX.width} / ${TONE_ARM_VIEWBOX.height}`,
};

export default function ToneArmContainer() {
  const { armRotation, startArmDrag, endArmDrag } = useRecordPlayer();

  const [isDragging, setIsDragging] = useState(false);
  const armBoxRef = useRef<HTMLDivElement>(null);
  const pivotRef = useRef<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      // Mouse only: touch dragging is unreliable, so touch users get the play button.
      if (e.pointerType !== "mouse" || e.button !== 0 || !armBoxRef.current)
        return;

      // Measure on every grab: scrolling, layout shifts and breakpoint
      // changes all move the pivot without a resize event.
      const rect = armBoxRef.current.getBoundingClientRect();
      pivotRef.current = {
        x: rect.left + (rect.width * TONE_ARM_PIVOT.x) / TONE_ARM_VIEWBOX.width,
        y:
          rect.top + (rect.height * TONE_ARM_PIVOT.y) / TONE_ARM_VIEWBOX.height,
      };

      e.currentTarget.setPointerCapture(e.pointerId);
      e.preventDefault();
      isDraggingRef.current = true;
      setIsDragging(true);
      startArmDrag();
    },
    [startArmDrag],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current || !pivotRef.current) return;
      armRotation.set(
        armAngleFromPointer(pivotRef.current, e.clientX, e.clientY),
      );
    },
    [armRotation],
  );

  const handlePointerEnd = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    endArmDrag();
  }, [endArmDrag]);

  return (
    <div
      className={`w-full h-full flex items-center justify-center overflow-visible select-none [container-type:size] ${
        isDragging ? "cursor-grabbing" : "pointer-fine:cursor-grab"
      }`}
      style={{ position: "relative", zIndex: 50 }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onLostPointerCapture={handlePointerEnd}
    >
      <div ref={armBoxRef} className="relative" style={ARM_BOX_STYLE}>
        <ToneArm rotation={armRotation} />
      </div>
    </div>
  );
}
