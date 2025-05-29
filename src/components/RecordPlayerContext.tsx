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
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  isAutoPlaying: boolean;
  setIsAutoPlaying: (isAutoPlaying: boolean) => void;
  toneArmRotation: number;
  setToneArmRotation: (rotation: number) => void;
  targetRotation: number | null;
  setTargetRotation: (rotation: number | null) => void;
}

const RecordPlayerContext = createContext<RecordPlayerContextType>({
  isPlaying: false,
  setIsPlaying: () => {},
  isAutoPlaying: false,
  setIsAutoPlaying: () => {},
  toneArmRotation: 0,
  setToneArmRotation: () => {},
  targetRotation: null,
  setTargetRotation: () => {},
});

export const useRecordPlayer = () => useContext(RecordPlayerContext);

export function RecordPlayerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [toneArmRotation, setToneArmRotation] = useState(0);
  const [targetRotation, setTargetRotation] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const granimRef = useRef<Granim | null>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.className = "fixed inset-0 w-full h-full";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.zIndex = "-10";
    canvas.style.pointerEvents = "none";
    document.body.appendChild(canvas);
    canvasRef.current = canvas;

    granimRef.current = new Granim({
      element: canvas,
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
      if (granimRef.current) {
        granimRef.current.destroy();
      }
      if (canvasRef.current && document.body.contains(canvasRef.current)) {
        document.body.removeChild(canvasRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (granimRef.current) {
      if (isPlaying) {
        granimRef.current.changeState("playing-state");
      } else {
        granimRef.current.changeState("default-state");
      }
    }
  }, [isPlaying]);

  return (
    <RecordPlayerContext.Provider
      value={{
        isPlaying,
        setIsPlaying,
        isAutoPlaying,
        setIsAutoPlaying,
        toneArmRotation,
        setToneArmRotation,
        targetRotation,
        setTargetRotation,
      }}
    >
      {children}
    </RecordPlayerContext.Provider>
  );
}
