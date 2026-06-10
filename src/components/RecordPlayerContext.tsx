"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import Granim from "granim";
import { VINYL_CONSTANTS } from "../lib/constants";

interface RecordPlayerContextType {
  isAutoPlaying: boolean;
  setIsAutoPlaying: (isAutoPlaying: boolean) => void;
  toneArmRotation: number;
  setToneArmRotation: (rotation: number) => void;
  targetRotation: number | null;
  setTargetRotation: (rotation: number | null) => void;
  volume: number;
  setVolume: (volume: number) => void;
}

const RecordPlayerContext = createContext<RecordPlayerContextType>({
  isAutoPlaying: false,
  setIsAutoPlaying: () => {},
  toneArmRotation: 0,
  setToneArmRotation: () => {},
  targetRotation: null,
  setTargetRotation: () => {},
  volume: 0.5,
  setVolume: () => {},
});

export const useRecordPlayer = () => useContext(RecordPlayerContext);

export function RecordPlayerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [toneArmRotation, setToneArmRotation] = useState(0);
  const [targetRotation, setTargetRotation] = useState<number | null>(null);
  const [volume, setVolume] = useState(0.5);

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
    if (granimRef.current) {
      const isPlaying =
        toneArmRotation > VINYL_CONSTANTS.NEEDLE_ON_RECORD_THRESHOLD ||
        isAutoPlaying;
      granimRef.current.changeState(
        isPlaying ? "playing-state" : "default-state"
      );
    }
  }, [toneArmRotation, isAutoPlaying]);

  return (
    <RecordPlayerContext.Provider
      value={{
        isAutoPlaying,
        setIsAutoPlaying,
        toneArmRotation,
        setToneArmRotation,
        targetRotation,
        setTargetRotation,
        volume,
        setVolume,
      }}
    >
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: -10 }}
      />
      {children}
    </RecordPlayerContext.Provider>
  );
}
