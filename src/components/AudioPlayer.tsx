"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRecordPlayer } from "./RecordPlayerContext";
import { VINYL_CONSTANTS } from "../lib/constants";
import { TRACKS } from "../lib/tracks";

export default function AudioPlayer() {
  const { isAutoPlaying, toneArmRotation, volume, setCurrentTrackIndex } =
    useRecordPlayer();
  const isPlaying =
    isAutoPlaying ||
    toneArmRotation > VINYL_CONSTANTS.NEEDLE_ON_RECORD_THRESHOLD;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const preloadRef = useRef<HTMLAudioElement | null>(null);
  const preloadIndexRef = useRef<number | null>(null);
  const nextIndexRef = useRef(0);
  const isPlayingRef = useRef(false);
  const volumeRef = useRef(volume);

  useEffect(() => {
    volumeRef.current = volume;
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const startPreload = useCallback((index: number) => {
    const audio = new Audio(TRACKS[index].src);
    audio.preload = "auto";
    preloadRef.current = audio;
    preloadIndexRef.current = index;
  }, []);

  const playTrack = useCallback(
    (index: number) => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.onended = null;
      }

      const nextIndex = (index + 1) % TRACKS.length;
      nextIndexRef.current = nextIndex;

      // Use preloaded audio if available for this index
      setCurrentTrackIndex(index);

      const usePreloaded =
        preloadIndexRef.current === index && preloadRef.current !== null;
      const audio = usePreloaded
        ? (preloadRef.current as HTMLAudioElement)
        : new Audio(TRACKS[index].src);

      if (usePreloaded) {
        preloadRef.current = null;
        preloadIndexRef.current = null;
      }

      audioRef.current = audio;
      audio.volume = volumeRef.current;
      audio.onended = () => {
        if (isPlayingRef.current) {
          playTrack(nextIndexRef.current);
        }
      };

      startPreload(nextIndex);
      audio.play().catch(() => {});
    },
    [startPreload, setCurrentTrackIndex]
  );

  useEffect(() => {
    const wasPlaying = isPlayingRef.current;
    isPlayingRef.current = isPlaying;

    if (isPlaying && !wasPlaying) {
      playTrack(nextIndexRef.current);
    } else if (!isPlaying && wasPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.onended = null;
        audioRef.current = null;
      }
    }
  }, [isPlaying, playTrack]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  return null;
}
