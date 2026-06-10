"use client";

import { FaPlay, FaStop, FaVolumeUp } from "react-icons/fa";
import { useRecordPlayer } from "./RecordPlayerContext";

interface PlayerControlsProps {
  onStart: () => void;
  onStop: () => void;
  isPlaying: boolean;
  isAutoPlaying: boolean;
}

export default function PlayerControls({
  onStart,
  onStop,
  isPlaying,
  isAutoPlaying,
}: PlayerControlsProps) {
  const { volume, setVolume } = useRecordPlayer();

  return (
    <div className="fixed bottom-6 left-4 lg:left-auto lg:right-6 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 z-50">
      <div className="flex flex-row lg:flex-col items-center gap-4 p-3 bg-black/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
        <button
          onClick={onStart}
          disabled={isPlaying || isAutoPlaying}
          className={`
            group relative w-14 h-14 rounded-full transition-all duration-300 ease-out
            ${
              isPlaying || isAutoPlaying
                ? "bg-gray-600 cursor-not-allowed opacity-60"
                : "bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 hover:scale-110 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-95"
            }
          `}
          aria-label={isPlaying ? "Currently playing" : "Start playback"}
        >
          <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <FaPlay
            className={`w-5 h-5 absolute top-1/2 left-1/2 transform -translate-x-[45%] -translate-y-1/2 transition-all duration-300 ${
              isPlaying || isAutoPlaying
                ? "text-gray-400"
                : "text-white group-hover:scale-110"
            }`}
          />
          {isAutoPlaying && (
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-pulse" />
          )}
        </button>

        <button
          onClick={onStop}
          disabled={!isPlaying && !isAutoPlaying}
          className={`
            group relative w-14 h-14 rounded-full transition-all duration-300 ease-out
            ${
              !isPlaying && !isAutoPlaying
                ? "bg-gray-600 cursor-not-allowed opacity-60"
                : "bg-gradient-to-br from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 hover:scale-110 hover:shadow-lg hover:shadow-red-500/25 active:scale-95"
            }
          `}
          aria-label={!isPlaying ? "Nothing playing" : "Stop playback"}
        >
          <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <FaStop
            className={`w-5 h-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
              !isPlaying && !isAutoPlaying
                ? "text-gray-400"
                : "text-white group-hover:scale-110"
            }`}
          />
        </button>

        <div className="flex flex-col lg:flex-row items-center gap-1.5 px-1 lg:px-0 lg:py-1">
          <FaVolumeUp className="text-gray-400 w-3 h-3 flex-shrink-0" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-24 lg:w-8 lg:[writing-mode:vertical-lr] lg:[direction:rtl] accent-emerald-500 cursor-pointer"
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
}
