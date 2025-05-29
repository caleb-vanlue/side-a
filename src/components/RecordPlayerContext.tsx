"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import Granim from "granim";

interface RecordPlayerContextType {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
}

const RecordPlayerContext = createContext<RecordPlayerContextType>({
  isPlaying: false,
  setIsPlaying: () => {},
});

export const useRecordPlayer = () => useContext(RecordPlayerContext);

export function RecordPlayerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const granimRef = useRef<Granim | null>(null);

  useEffect(() => {
    // Create canvas element
    const canvas = document.createElement("canvas");
    canvas.className = "fixed inset-0 w-full h-full";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.zIndex = "-10"; // Make sure it's behind everything
    canvas.style.pointerEvents = "none";
    document.body.appendChild(canvas);
    canvasRef.current = canvas;

    // Initialize Granim
    granimRef.current = new Granim({
      element: canvas,
      direction: "radial",
      isPausedWhenNotInView: false, // Make sure it plays even when not in view
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
            ["#E0F2F1", "#B2DFDB"], // Light teal/mint
            ["#B2DFDB", "#BBDEFB"], // Mint to light blue
            ["#BBDEFB", "#D1C4E9"], // Light blue to lavender
            ["#D1C4E9", "#F8BBD0"], // Lavender to light pink
            ["#F8BBD0", "#FFECB3"], // Light pink to soft yellow
            ["#FFECB3", "#C8E6C9"], // Soft yellow to light green
            ["#C8E6C9", "#E0F2F1"], // Light green back to light teal
          ],
          transitionSpeed: 5000,
          loop: true,
        },
      },
    });

    // Clean up function
    return () => {
      if (granimRef.current) {
        granimRef.current.destroy();
      }
      if (canvasRef.current && document.body.contains(canvasRef.current)) {
        document.body.removeChild(canvasRef.current);
      }
    };
  }, []);

  // Update Granim state when isPlaying changes
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
    <RecordPlayerContext.Provider value={{ isPlaying, setIsPlaying }}>
      {children}
    </RecordPlayerContext.Provider>
  );
}
