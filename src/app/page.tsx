"use client";

import { useEffect, useCallback } from "react";
import {
  PlayerControls,
  ProjectCard,
  VinylRecord,
  ToneArmContainer,
} from "../components";
import { GitHubBadge, Navigation } from "../components/layout";
import { useResponsiveVinyl } from "../hooks/useResponsiveVinyl";
import { VINYL_CONSTANTS } from "../lib/constants";
import { useRecordPlayer } from "../components/RecordPlayerContext";

export default function HomePage() {
  const {
    isPlaying,
    setIsPlaying,
    isAutoPlaying,
    setIsAutoPlaying,
    toneArmRotation,
    setToneArmRotation,
    targetRotation,
    setTargetRotation,
  } = useRecordPlayer();

  const { isDesktop, playingPosition, sizing } = useResponsiveVinyl();

  const isNeedleOnRecord =
    toneArmRotation > VINYL_CONSTANTS.NEEDLE_ON_RECORD_THRESHOLD;

  useEffect(() => {
    if (isNeedleOnRecord || isAutoPlaying) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [isNeedleOnRecord, isAutoPlaying, setIsPlaying]);

  const handleStart = useCallback(() => {
    if (!isAutoPlaying) {
      setIsAutoPlaying(true);
      setTargetRotation(playingPosition);
    }
  }, [isAutoPlaying, setIsAutoPlaying, setTargetRotation, playingPosition]);

  const handleStop = useCallback(() => {
    setIsAutoPlaying(false);
    setTargetRotation(0);
  }, [setIsAutoPlaying, setTargetRotation]);

  const handleRotationChange = useCallback((rotation: number) => {
    setToneArmRotation(rotation);

    if (
      rotation <= VINYL_CONSTANTS.NEEDLE_ON_RECORD_THRESHOLD &&
      isAutoPlaying &&
      targetRotation === null
    ) {
      setIsAutoPlaying(false);
    }
  }, [setToneArmRotation, isAutoPlaying, targetRotation, setIsAutoPlaying]);

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
  }, [toneArmRotation, targetRotation, setTargetRotation]);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="relative z-30">
        <Navigation />
      </div>

      {isNeedleOnRecord && (
        <div
          className={`
            fixed z-20 
            ${isDesktop ? "top-24 right-10" : "top-20 right-4"}
            transition-all duration-500 ease-in-out
          `}
        >
          <ProjectCard isVisible={true} />
        </div>
      )}

      <div
        className={`relative z-10 flex min-h-screen flex-col items-center justify-center p-4 ${
          isDesktop ? "pt-24" : "pt-28"
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
      <GitHubBadge repoUrl="https://github.com/caleb-vanlue/side-a" />
    </main>
  );
}
