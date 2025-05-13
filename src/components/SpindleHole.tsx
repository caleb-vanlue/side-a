import React from "react";

interface SpindleHoleProps {
  backgroundColor: string;
  isPlaying?: boolean;
}

const SpindleHole = React.memo(
  ({ backgroundColor, isPlaying = false }: SpindleHoleProps) => {
    return (
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[3%] h-[3%] rounded-full pointer-events-none"
        style={{
          backgroundColor: isPlaying
            ? "rgba(255, 255, 255, 0.3)"
            : backgroundColor,
          backdropFilter: isPlaying ? "blur(5px)" : "none",
          transition: "all 0.5s ease-in-out",
        }}
      />
    );
  }
);

SpindleHole.displayName = "SpindleHole";

export default SpindleHole;
