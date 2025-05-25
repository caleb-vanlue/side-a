"use client";

import { useState, useEffect, useRef } from "react";
import Granim from "granim";
import {
  PlayerControls,
  ProjectCard,
  VinylRecord,
  ToneArmContainer,
} from "../components";
import { Navigation } from "../components/layout";
import { useResponsiveVinyl } from "../hooks/useResponsiveVinyl";
import { VINYL_CONSTANTS } from "../lib/constants";

export default function HomePage() {
  const [toneArmRotation, setToneArmRotation] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [targetRotation, setTargetRotation] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const granimRef = useRef<Granim | null>(null);

  const { isDesktop, playingPosition, sizing } = useResponsiveVinyl();

  const isNeedleOnRecord =
    toneArmRotation > VINYL_CONSTANTS.NEEDLE_ON_RECORD_THRESHOLD;
  const isPlaying = isNeedleOnRecord || isAutoPlaying;

  const handleStart = () => {
    if (!isAutoPlaying) {
      setIsAutoPlaying(true);
      setTargetRotation(playingPosition);
    }
  };

  const handleStop = () => {
    setIsAutoPlaying(false);
    setTargetRotation(0);
  };

  const handleRotationChange = (rotation: number) => {
    setToneArmRotation(rotation);

    if (
      rotation <= VINYL_CONSTANTS.NEEDLE_ON_RECORD_THRESHOLD &&
      isAutoPlaying &&
      targetRotation === null
    ) {
      setIsAutoPlaying(false);
    }
  };

  useEffect(() => {
    if (
      targetRotation !== null &&
      Math.abs(toneArmRotation - targetRotation) < 1
    ) {
      const timeoutId = setTimeout(() => {
        setTargetRotation(null);
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [toneArmRotation, targetRotation]);

  useEffect(() => {
    if (canvasRef.current) {
      granimRef.current = new Granim({
        element: canvasRef.current,
        direction: "radial",
        isPausedWhenNotInView: true,
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
              ["#2E5E3E", "#4A7C59"],
              ["#4A7C59", "#87CEEB"],
              ["#87CEEB", "#F5E6A3"],
              ["#F5E6A3", "#6FA86F"],
              ["#6FA86F", "#2E5E3E"],
            ],
            transitionSpeed: 4000,
            loop: true,
          },
        },
      });
    }

    return () => {
      if (granimRef.current) {
        granimRef.current.destroy();
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
    <main className="relative min-h-screen overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <div className="relative z-30">
        <Navigation />
      </div>

      {isNeedleOnRecord && (
        <div
          className={`
          fixed z-20 
          ${isDesktop ? "top-24 right-10" : "top-6 right-4"}
          transition-all duration-500 ease-in-out
        `}
        >
          <ProjectCard isVisible={true} />
        </div>
      )}

      <div
        className={`relative z-10 flex min-h-screen flex-col items-center justify-center p-4 ${
          isDesktop ? "pt-24" : "pt-16"
        }`}
      >
        <div
          className={`flex items-center justify-center ${sizing.gap} ${sizing.offset}`}
          style={{
            transformStyle: "preserve-3d",
            perspective: "1000px",
            transform: "translateZ(0)",
          }}
        >
          <div className={`${sizing.record} relative flex-shrink-0`}>
            <VinylRecord backgroundColor="white" isSpinning={isPlaying} />
          </div>

          <div
            className={`${sizing.toneArm} flex items-center relative z-10 overflow-visible mobile-tone-arm-fix flex-shrink-0`}
            style={{
              isolation: "isolate",
              transformStyle: "preserve-3d",
              transform: "translateZ(0.1px)",
            }}
          >
            <ToneArmContainer
              onRotationChange={handleRotationChange}
              isPlaying={isPlaying}
              targetRotation={targetRotation}
            />
          </div>
        </div>

        <PlayerControls
          onStart={handleStart}
          onStop={handleStop}
          isPlaying={isPlaying}
          isAutoPlaying={isAutoPlaying}
        />
      </div>
    </main>
  );
}
