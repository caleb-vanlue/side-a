"use client";

import { useState, useEffect, useRef } from "react";
import Granim from "granim";
import VinylRecord from "../components/VinylRecord";
import GitHubBadge from "../components/GitHubBadge";
import ToneArmContainer from "../components/ToneArmContainer";
import PlayerControls from "../components/PlayerControls";
import HamburgerButton from "../components/HamburgerButton";
import SideDrawer from "../components/SideDrawer";
import ProjectCard from "../components/ProjectCard";

export default function Home() {
  const [toneArmRotation, setToneArmRotation] = useState(0);
  const [isControlledPlayback, setIsControlledPlayback] = useState(false);
  const [targetRotation, setTargetRotation] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const granimRef = useRef<Granim | null>(null);

  const isNeedleOnRecord = toneArmRotation > 25;
  const isPlaying = isNeedleOnRecord || isControlledPlayback;

  const handleStart = () => {
    if (toneArmRotation < 25) {
      setTargetRotation(26);
      setIsControlledPlayback(true);
    }
  };

  const handleStop = () => {
    setTargetRotation(0);
    setIsControlledPlayback(false);
  };

  const handleRotationChange = (rotation: number) => {
    setToneArmRotation(rotation);
    // If user manually drags needle off the record while in controlled playback, stop it
    if (rotation < 25 && isControlledPlayback) {
      setIsControlledPlayback(false);
    }
  };

  useEffect(() => {
    if (
      targetRotation !== null &&
      Math.abs(toneArmRotation - targetRotation) < 0.5
    ) {
      setTimeout(() => {
        setTargetRotation(null);
      }, 100);
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

      {/* Add hamburger button and drawer */}
      <HamburgerButton
        isOpen={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      />
      <SideDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4">
        <div className="flex items-center justify-center sm:gap-4 md:gap-8 relative -left-16 sm:left-0">
          <div className="w-[100vmin] h-[100vmin] sm:w-[70vmin] sm:h-[70vmin] md:w-[80vmin] md:h-[80vmin] relative">
            <VinylRecord backgroundColor="white" isSpinning={isPlaying} />
          </div>
          <div className="w-8 sm:hidden"></div>
          <div
            className="w-36 sm:w-28 md:w-[25vmin] h-[100vmin] sm:h-[70vmin] md:h-[80vmin] flex items-center relative z-10 overflow-visible"
            style={{ isolation: "isolate" }}
          >
            {" "}
            <ToneArmContainer
              onRotationChange={handleRotationChange}
              isPlaying={isPlaying}
              targetRotation={targetRotation}
            />
          </div>
          <div className="w-4 sm:hidden"></div>
        </div>

        <PlayerControls
          onStart={handleStart}
          onStop={handleStop}
          isPlaying={isPlaying}
        />

        <ProjectCard isVisible={isNeedleOnRecord} />
        <GitHubBadge repoUrl="https://github.com/caleb-vanlue/portfolio" />
      </div>
    </main>
  );
}
