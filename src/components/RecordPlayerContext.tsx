"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  animate,
  useMotionValue,
  useMotionValueEvent,
  type AnimationPlaybackControls,
  type MotionValue,
} from "framer-motion";
import Granim from "granim";
import { VINYL_CONSTANTS } from "../lib/constants";
import {
  initialPlayerState,
  isNeedleDown,
  playerReducer,
  selectCanStart,
  selectCanStop,
  selectIsPlaying,
  selectIsSpinning,
  type PlayerMode,
} from "../lib/recordPlayerMachine";
import useTrackPlayback from "../hooks/useTrackPlayback";

// Overdamped, so the arm glides into place without bouncing
const ARM_SPRING = {
  type: "spring",
  stiffness: 30,
  damping: 12,
  restDelta: 0.05,
  restSpeed: 0.05,
} as const;

interface RecordPlayerContextType {
  mode: PlayerMode;
  isPlaying: boolean;
  isSpinning: boolean;
  canStart: boolean;
  canStop: boolean;
  /** Tone arm angle in degrees. Updated every frame without re-rendering. */
  armRotation: MotionValue<number>;
  play: (cueTarget: number) => void;
  stop: () => void;
  startArmDrag: () => void;
  endArmDrag: () => void;
  volume: number;
  setVolume: (volume: number) => void;
  currentTrackIndex: number;
}

const RecordPlayerContext = createContext<RecordPlayerContextType | null>(
  null
);

export const useRecordPlayer = () => {
  const context = useContext(RecordPlayerContext);
  if (!context) {
    throw new Error("useRecordPlayer must be used within RecordPlayerProvider");
  }
  return context;
};

export function RecordPlayerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(playerReducer, initialPlayerState);
  const [volume, setVolume] = useState(0.5);
  const armRotation = useMotionValue(0);
  const needleDownRef = useRef(false);

  const isPlaying = selectIsPlaying(state);
  const isSpinning = selectIsSpinning(state);

  const { currentTrackIndex } = useTrackPlayback({
    shouldPlay: isPlaying,
    volume,
  });

  // Per-frame angle changes stay out of React; only threshold crossings dispatch
  useMotionValueEvent(armRotation, "change", (angle) => {
    const needleDown = isNeedleDown(angle, needleDownRef.current);
    if (needleDown !== needleDownRef.current) {
      needleDownRef.current = needleDown;
      dispatch({ type: "NEEDLE_CHANGED", needleDown });
    }
  });

  useEffect(() => {
    const settle = () => dispatch({ type: "ARM_SETTLED" });
    let controls: AnimationPlaybackControls | undefined;

    switch (state.mode) {
      case "cueing":
        controls = animate(armRotation, state.cueTarget, {
          ...ARM_SPRING,
          onComplete: settle,
        });
        break;
      case "returning":
        controls = animate(armRotation, 0, {
          ...ARM_SPRING,
          onComplete: settle,
        });
        break;
      case "playing": {
        const remaining =
          VINYL_CONSTANTS.NEEDLE_SETTLED_POSITION - armRotation.get();
        if (remaining > 0) {
          controls = animate(
            armRotation,
            VINYL_CONSTANTS.NEEDLE_SETTLED_POSITION,
            {
              type: "tween",
              ease: "linear",
              duration: remaining / VINYL_CONSTANTS.TONE_ARM_CREEP_SPEED,
            }
          );
        }
        break;
      }
    }

    return () => controls?.stop();
  }, [state.mode, state.cueTarget, armRotation]);

  const play = useCallback(
    (cueTarget: number) => dispatch({ type: "PLAY", cueTarget }),
    []
  );
  const stop = useCallback(() => dispatch({ type: "STOP" }), []);
  const startArmDrag = useCallback(() => {
    // Stop any glide immediately rather than waiting for the effect to re-run
    armRotation.stop();
    dispatch({ type: "DRAG_START" });
  }, [armRotation]);
  const endArmDrag = useCallback(() => dispatch({ type: "DRAG_END" }), []);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const granimRef = useRef<Granim | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    granimRef.current = new Granim({
      element: canvasRef.current,
      direction: "radial",
      isPausedWhenNotInView: false,
      states: {
        "default-state": {
          gradients: [
            ["#FFFFFF", "#FFFFFF"],
            ["#FFFFFF", "#FFFFFF"],
          ],
          transitionSpeed: 500,
          loop: false,
        },
        "playing-state": {
          gradients: [
            ["#E0F2F1", "#B2DFDB"],
            ["#B2DFDB", "#BBDEFB"],
            ["#BBDEFB", "#D1C4E9"],
            ["#D1C4E9", "#F8BBD0"],
            ["#F8BBD0", "#FFECB3"],
            ["#FFECB3", "#C8E6C9"],
            ["#C8E6C9", "#E0F2F1"],
          ],
          transitionSpeed: 5000,
          loop: true,
        },
      },
    });

    return () => {
      granimRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    granimRef.current?.changeState(
      isPlaying ? "playing-state" : "default-state"
    );
  }, [isPlaying]);

  const value = useMemo<RecordPlayerContextType>(
    () => ({
      mode: state.mode,
      isPlaying,
      isSpinning,
      canStart: selectCanStart(state),
      canStop: selectCanStop(state),
      armRotation,
      play,
      stop,
      startArmDrag,
      endArmDrag,
      volume,
      setVolume,
      currentTrackIndex,
    }),
    [
      state,
      isPlaying,
      isSpinning,
      armRotation,
      play,
      stop,
      startArmDrag,
      endArmDrag,
      volume,
      currentTrackIndex,
    ]
  );

  return (
    <RecordPlayerContext.Provider value={value}>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: -10 }}
      />
      {children}
    </RecordPlayerContext.Provider>
  );
}
