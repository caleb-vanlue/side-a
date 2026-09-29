import { useCallback, useEffect, useRef, useState } from "react";
import { TRACKS } from "../lib/tracks";

// Events that grant user activation, i.e. where browsers allow media to start.
// Touch only counts on release, so a drag onto the record can't start audio
// mid-gesture on a first visit; the pending play is retried on release instead.
const ACTIVATION_EVENTS = ["pointerdown", "pointerup", "click", "keydown"];

// Only prime the audio elements for interactions with the player, so a click
// elsewhere on the site doesn't start downloading tracks.
const UNLOCK_SCOPE_SELECTOR = "[data-record-player]";

const nextTrackIndex = (index: number) => (index + 1) % TRACKS.length;

interface UseTrackPlaybackOptions {
  shouldPlay: boolean;
  volume: number;
}

/**
 * Plays TRACKS through two persistent audio elements: one playing, one
 * preloading the next track. Keeping the same elements (instead of creating
 * new ones per track) lets iOS remember they were unlocked by a gesture.
 */
export default function useTrackPlayback({
  shouldPlay,
  volume,
}: UseTrackPlaybackOptions) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const playersRef = useRef<HTMLAudioElement[]>([]);
  const activeSlotRef = useRef(0);
  const trackIndexRef = useRef(0);
  const hasStartedRef = useRef(false);
  const isPlayingRef = useRef(false);
  const pendingPlayRef = useRef(false);
  const isUnlockedRef = useRef(false);
  const volumeRef = useRef(volume);

  const playActive = useCallback(() => {
    const player = playersRef.current[activeSlotRef.current];
    if (!player) return;

    const track = TRACKS[trackIndexRef.current];
    pendingPlayRef.current = false;
    player.muted = false;
    player.volume = volumeRef.current;

    player.play().catch((error: unknown) => {
      const name = error instanceof DOMException ? error.name : undefined;
      // Interrupted by pause() or a source change; expected when stopping quickly
      if (name === "AbortError") return;

      if (name === "NotAllowedError") {
        pendingPlayRef.current = isPlayingRef.current;
        console.warn(
          "[TrackPlayback] Browser blocked playback until the next user interaction",
          { track: track.title }
        );
        return;
      }

      console.error("[TrackPlayback] Failed to play track", {
        track: track.title,
        src: track.src,
        error,
      });
    });
  }, []);

  const advanceTrack = useCallback(() => {
    const players = playersRef.current;
    const previous = players[activeSlotRef.current];
    previous.pause();

    // The standby slot already holds the next track; queue the one after it
    // in the slot being vacated.
    activeSlotRef.current = 1 - activeSlotRef.current;
    trackIndexRef.current = nextTrackIndex(trackIndexRef.current);
    previous.preload = "auto";
    previous.src = TRACKS[nextTrackIndex(trackIndexRef.current)].src;

    setCurrentTrackIndex(trackIndexRef.current);
  }, []);

  const startPlayback = useCallback(() => {
    const players = playersRef.current;
    if (players.length === 0) return;

    // Each drop of the needle plays the next track, like the old player did
    if (hasStartedRef.current) advanceTrack();
    hasStartedRef.current = true;

    players[activeSlotRef.current].currentTime = 0;
    playActive();

    const standby = players[1 - activeSlotRef.current];
    if (standby.preload !== "auto") {
      standby.preload = "auto";
      standby.load();
    }
  }, [advanceTrack, playActive]);

  useEffect(() => {
    const players = [new Audio(), new Audio()];
    players[0].src = TRACKS[0].src;
    players[1].src = TRACKS[nextTrackIndex(0)].src;

    const cleanups = players.map((player) => {
      player.preload = "none";
      player.volume = volumeRef.current;

      const handleEnded = () => {
        if (player !== playersRef.current[activeSlotRef.current]) return;
        if (!isPlayingRef.current) return;
        advanceTrack();
        playActive();
      };

      const handleError = () => {
        console.error("[TrackPlayback] Audio element error", {
          src: player.currentSrc || player.src,
          code: player.error?.code,
          message: player.error?.message,
        });
      };

      player.addEventListener("ended", handleEnded);
      player.addEventListener("error", handleError);
      return () => {
        player.removeEventListener("ended", handleEnded);
        player.removeEventListener("error", handleError);
        player.pause();
      };
    });

    playersRef.current = players;
    return () => {
      cleanups.forEach((cleanup) => cleanup());
      playersRef.current = [];
    };
  }, [advanceTrack, playActive]);

  useEffect(() => {
    const handleActivation = (event: Event) => {
      // e.g. a touch pointerdown, which fires before the gesture counts
      if (navigator.userActivation && !navigator.userActivation.isActive) {
        return;
      }

      const target = event.target;
      const inPlayer =
        target instanceof Element && target.closest(UNLOCK_SCOPE_SELECTOR);

      if (!isUnlockedRef.current && inPlayer) {
        isUnlockedRef.current = true;
        // A muted play()/pause() inside a gesture unlocks each element for
        // later programmatic playback (needle landing, track changes) on iOS.
        for (const player of playersRef.current) {
          if (!player.paused) continue;
          player.muted = true;
          // Rejects with AbortError because of the pause() below; that's expected
          player.play().catch(() => {});
          player.pause();
          player.muted = false;
        }
      }

      if (pendingPlayRef.current && isPlayingRef.current) playActive();
    };

    for (const type of ACTIVATION_EVENTS) {
      document.addEventListener(type, handleActivation, { capture: true });
    }
    return () => {
      for (const type of ACTIVATION_EVENTS) {
        document.removeEventListener(type, handleActivation, { capture: true });
      }
    };
  }, [playActive]);

  useEffect(() => {
    const wasPlaying = isPlayingRef.current;
    isPlayingRef.current = shouldPlay;

    if (shouldPlay && !wasPlaying) {
      startPlayback();
    } else if (!shouldPlay && wasPlaying) {
      pendingPlayRef.current = false;
      playersRef.current[activeSlotRef.current]?.pause();
    }
  }, [shouldPlay, startPlayback]);

  useEffect(() => {
    volumeRef.current = volume;
    for (const player of playersRef.current) player.volume = volume;
  }, [volume]);

  return { currentTrackIndex };
}
