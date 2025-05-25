import Button from "./Button";

interface PlayerControlsProps {
  onStart: () => void;
  onStop: () => void;
  isPlaying: boolean;
  disabled?: boolean;
}

export default function PlayerControls({
  onStart,
  onStop,
  isPlaying,
  disabled = false,
}: PlayerControlsProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-6 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 z-50 flex flex-row lg:flex-col gap-6">
      <Button
        variant="icon"
        size="lg"
        onClick={onStart}
        disabled={disabled || isPlaying}
        className={
          disabled || isPlaying
            ? "opacity-50 cursor-not-allowed"
            : "hover:scale-110"
        }
        aria-label="Start playback"
      >
        <svg
          className={`w-6 h-6 ${
            disabled || isPlaying ? "text-gray-500" : "text-green-400"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
        </svg>
      </Button>

      <Button
        variant="icon"
        size="lg"
        onClick={onStop}
        disabled={disabled || !isPlaying}
        className={
          disabled || !isPlaying
            ? "opacity-50 cursor-not-allowed"
            : "hover:scale-110"
        }
        aria-label="Stop playback"
      >
        <svg
          className={`w-6 h-6 ${
            disabled || !isPlaying ? "text-gray-500" : "text-red-400"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <rect x="6" y="6" width="8" height="8" />
        </svg>
      </Button>
    </div>
  );
}
