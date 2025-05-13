"use client";

import { useState } from "react";
import VinylRecord from "../components/VinylRecord";
import GitHubBadge from "../components/GitHubBadge";
import ToneArmContainer from "../components/ToneArmContainer";

export default function Home() {
  const backgroundColor = "white";
  const [toneArmRotation, setToneArmRotation] = useState(0);

  // Consider the needle "on the record" when rotation is greater than 25 degrees
  const isNeedleOnRecord = toneArmRotation > 25;

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center p-4 relative overflow-x-hidden`}
      style={{ backgroundColor }}
    >
      {/* Mobile: custom positioning, Desktop: normal centered layout */}
      <div className="flex items-center justify-center sm:gap-4 md:gap-8 relative -left-16 sm:left-0">
        {/* Vinyl Record - partial off-screen on mobile, normal on desktop */}
        <div className="w-[100vmin] h-[100vmin] sm:w-[70vmin] sm:h-[70vmin] md:w-[80vmin] md:h-[80vmin]">
          <VinylRecord
            backgroundColor={backgroundColor}
            isSpinning={isNeedleOnRecord}
          />
        </div>

        {/* Gap on mobile to push tone arm right */}
        <div className="w-8 sm:hidden"></div>

        {/* Tone Arm - stays on screen */}
        <div className="w-36 sm:w-28 md:w-[25vmin] h-[100vmin] sm:h-[70vmin] md:h-[80vmin] flex items-center relative z-10 overflow-visible">
          <ToneArmContainer onRotationChange={setToneArmRotation} />
        </div>

        {/* Right padding to ensure tone arm stays visible */}
        <div className="w-4 sm:hidden"></div>
      </div>

      <GitHubBadge repoUrl="https://github.com/caleb-vanlue/portfolio" />
    </main>
  );
}
