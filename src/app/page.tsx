"use client";

import { useCallback } from "react";
import {
  PlayerControls,
  ProjectCard,
  VinylRecord,
  ToneArmContainer,
} from "../components";
import { GitHubBadge, Navigation } from "../components/layout";
import { useResponsiveVinyl } from "../hooks/useResponsiveVinyl";
import { CONTACT } from "../lib/constants";
import { useRecordPlayer } from "../components/RecordPlayerContext";

export default function HomePage() {
  const { isPlaying, isSpinning, canStart, canStop, play, stop } =
    useRecordPlayer();

  const { isDesktop, playingPosition, sizing } = useResponsiveVinyl();

  const handleStart = useCallback(
    () => play(playingPosition),
    [play, playingPosition]
  );

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="relative z-30">
        <Navigation />
      </div>

      {isPlaying && (
        <div
          className={`
            fixed z-20 
            ${isDesktop ? "top-24 left-10" : "top-20 left-0 right-0 px-3"}
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
          data-record-player
          className={`flex items-center justify-center ${sizing.gap} ${sizing.offset}`}
          style={{
            transformStyle: "preserve-3d",
            perspective: "1000px",
            transform: "translateZ(0)",
          }}
        >
          <div className={`${sizing.record} relative flex-shrink-0`}>
            <VinylRecord backgroundColor="white" isSpinning={isSpinning} />
          </div>

          <div
            className={`${sizing.toneArm} flex items-center relative z-10 overflow-visible mobile-tone-arm-fix flex-shrink-0`}
            style={{
              isolation: "isolate",
              transformStyle: "preserve-3d",
              transform: "translateZ(0.1px)",
            }}
          >
            <ToneArmContainer />
          </div>
        </div>

        <PlayerControls
          onStart={handleStart}
          onStop={stop}
          canStart={canStart}
          canStop={canStop}
          isPlaying={isPlaying}
        />
      </div>
      <GitHubBadge repoUrl={CONTACT.REPO} />
    </main>
  );
}
