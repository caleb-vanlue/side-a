import { useCallback, useEffect, useRef, useState } from "react";
import { TRACKS } from "../lib/tracks";

// Events that grant user activation, i.e. where browsers allow media to start.
// Touch only counts on release, so a drag onto the record can't start audio
// mid-gesture on a first visit; the pending play is retried on release instead.
const ACTIVATION_EVENTS = ["pointerdown", "pointerup", "click", "keydown"];

// Only prime the audio elements for interactions with the player, so a click
// elsewhere on the site doesn't start downloading tracks.
const UNLOCK_SCOPE_SELECTOR = "[data-record-player]";

// How long the playhead may sit still while the record is playing before the
// track is treated as stuck (dropped connection, decoder hang, lost play()).
const STALL_TIMEOUT_MS = 10_000;
const WATCHDOG_INTERVAL_MS = 2_000;

// Reloads of one track before giving up on it and moving to the next
const MAX_RELOAD_ATTEMPTS = 2;

const nextTrackIndex = (index: number) => (index + 1) % TRACKS.length;

interface UseTrackPlaybackOptions {
  shouldPlay: boolean;
  volume: number;
}

/**
 * Plays TRACKS through two persistent audio elements: one playing, one
 * preloading the next track. Keeping the same elements (instead of creating
 * new ones per track) lets iOS remember they were unlocked by a gesture.
 *
 * While the record is playing, failures are recovered rather than left silent:
 * a stalled or errored track is reloaded where it left off, and skipped if it
 * keeps failing.
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
  const reloadAttemptsRef = useRef(0);
  // Tracks skipped in a row without any of them playing; stops a skip loop
  // when nothing can play at all (e.g. the format is unsupported).
  const failedTracksRef = useRef(0);

  const playActive = useCallback(() => {
    const player = playersRef.current[activeSlotRef.current];
    if (!player) return;

    const track = TRACKS[trackIndexRef.current];
    pendingPlayRef.current = false;
    player.muted = false;
    player.volume = volumeRef.current;

    // play() doesn't restart a load that already failed (e.g. the standby's
    // preload connection dropped while the previous track played), so the
    // element would sit silent; start the load over first.
    if (player.error) player.load();

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

      // NotSupportedError and friends also fire an "error" event on the
      // element, which handles recovery.
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

    // The standby may have been nudged forward by the unlock play()/pause()
    players[activeSlotRef.current].currentTime = 0;
    reloadAttemptsRef.current = 0;

    setCurrentTrackIndex(trackIndexRef.current);
  }, []);

  /** Restarts the active track's download and resumes where it left off. */
  const reloadActive = useCallback(() => {
    const player = playersRef.current[activeSlotRef.current];
    if (!player) return;

    const src = player.src;
    const resumeAt = player.currentTime;
    player.load();
    if (resumeAt > 0) {
      player.addEventListener(
        "loadedmetadata",
        () => {
          // Skip if the slot moved on to another track in the meantime
          if (player.src === src) player.currentTime = resumeAt;
        },
        { once: true }
      );
    }
    playActive();
  }, [playActive]);

  const recoverActive = useCallback(
    (reason: string) => {
      // Waiting on a user gesture isn't a failure; reloading won't help
      if (!isPlayingRef.current || pendingPlayRef.current) return;

      const player = playersRef.current[activeSlotRef.current];
      if (!player) return;

      const track = TRACKS[trackIndexRef.current];
      const details = {
        reason,
        track: track.title,
        src: track.src,
        position: player.currentTime,
        readyState: player.readyState,
        networkState: player.networkState,
        errorCode: player.error?.code,
      };
      const unsupported =
        player.error?.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED;

      if (!unsupported && reloadAttemptsRef.current < MAX_RELOAD_ATTEMPTS) {
        reloadAttemptsRef.current += 1;
        console.warn("[TrackPlayback] Reloading track", {
          ...details,
          attempt: reloadAttemptsRef.current,
        });
        reloadActive();
        return;
      }

      failedTracksRef.current += 1;
      if (failedTracksRef.current >= TRACKS.length) {
        console.error(
          "[TrackPlayback] No track could be played; giving up",
          details
        );
        return;
      }

      console.error(
        "[TrackPlayback] Skipping track that failed to play",
        details
      );
      advanceTrack();
      playActive();
    },
    [advanceTrack, playActive, reloadActive]
  );

  const startPlayback = useCallback(() => {
    const players = playersRef.current;
    if (players.length === 0) return;

    // Each drop of the needle plays the next track, like the old player did
    if (hasStartedRef.current) advanceTrack();
    hasStartedRef.current = true;
    failedTracksRef.current = 0;
    reloadAttemptsRef.current = 0;

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

      const isActive = () =>
        player === playersRef.current[activeSlotRef.current];

      const handleEnded = () => {
        if (!isActive() || !isPlayingRef.current) return;
        advanceTrack();
        playActive();
      };

      const handlePlaying = () => {
        if (!isActive()) return;
        reloadAttemptsRef.current = 0;
        failedTracksRef.current = 0;
      };

      const handleError = () => {
        console.error("[TrackPlayback] Audio element error", {
          src: player.currentSrc || player.src,
          active: isActive(),
          code: player.error?.code,
          message: player.error?.message,
        });
        // A failed standby is reloaded by playActive() when its turn comes
        if (isActive()) recoverActive("error");
      };

      player.addEventListener("ended", handleEnded);
      player.addEventListener("playing", handlePlaying);
      player.addEventListener("error", handleError);
      return () => {
        player.removeEventListener("ended", handleEnded);
        player.removeEventListener("playing", handlePlaying);
        player.removeEventListener("error", handleError);
        player.pause();
      };
    });

    playersRef.current = players;
    return () => {
      cleanups.forEach((cleanup) => cleanup());
      playersRef.current = [];
    };
  }, [advanceTrack, playActive, recoverActive]);

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

    // A track change blocked while the tab was hidden may be allowed once
    // it's visible again; if not, the next interaction retries it.
    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;
      if (pendingPlayRef.current && isPlayingRef.current) playActive();
    };

    for (const type of ACTIVATION_EVENTS) {
      document.addEventListener(type, handleActivation, { capture: true });
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      for (const type of ACTIVATION_EVENTS) {
        document.removeEventListener(type, handleActivation, { capture: true });
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
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

  // Catches silent failures that never fire "error": a download that hangs or
  // a play() that never gets going. A paused element is left alone, since that
  // was the OS or media keys, not a stall.
  useEffect(() => {
    if (!shouldPlay) return;

    let watchedPlayer: HTMLAudioElement | undefined;
    let lastPosition = -1;
    let lastProgressAt = performance.now();

    const intervalId = window.setInterval(() => {
      const player = playersRef.current[activeSlotRef.current];
      if (!player) return;
      const now = performance.now();

      if (
        player !== watchedPlayer ||
        player.currentTime !== lastPosition ||
        player.paused ||
        pendingPlayRef.current
      ) {
        watchedPlayer = player;
        lastPosition = player.currentTime;
        lastProgressAt = now;
        return;
      }

      if (now - lastProgressAt >= STALL_TIMEOUT_MS) {
        lastProgressAt = now;
        recoverActive("stalled");
      }
    }, WATCHDOG_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [shouldPlay, recoverActive]);

  useEffect(() => {
    volumeRef.current = volume;
    for (const player of playersRef.current) player.volume = volume;
  }, [volume]);

  return { currentTrackIndex };
}
