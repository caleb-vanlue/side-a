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
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-6 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 z-50">
      <div className="flex flex-row lg:flex-col gap-4 p-3 bg-black/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
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
          <svg
            className={`w-6 h-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
              isPlaying || isAutoPlaying
                ? "text-gray-400"
                : "text-white group-hover:scale-110"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
          </svg>
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
          <svg
            className={`w-5 h-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
              !isPlaying && !isAutoPlaying
                ? "text-gray-400"
                : "text-white group-hover:scale-110"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <rect x="6" y="6" width="8" height="8" rx="1" />
          </svg>
        </button>
      </div>
    </div>
  );
}
