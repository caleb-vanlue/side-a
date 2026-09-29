import { VINYL_CONSTANTS } from "./constants";

/**
 * idle      – arm at rest, nothing moving it
 * cueing    – arm animating onto the record after pressing play
 * playing   – needle on the record, arm slowly creeping inward
 * returning – arm animating back to rest after pressing stop
 * dragging  – the user is holding the arm
 */
export type PlayerMode = "idle" | "cueing" | "playing" | "returning" | "dragging";

export interface PlayerState {
  mode: PlayerMode;
  needleDown: boolean;
  cueTarget: number;
}

export type PlayerEvent =
  | { type: "PLAY"; cueTarget: number }
  | { type: "STOP" }
  | { type: "DRAG_START" }
  | { type: "DRAG_END" }
  | { type: "ARM_SETTLED" }
  | { type: "NEEDLE_CHANGED"; needleDown: boolean };

export const initialPlayerState: PlayerState = {
  mode: "idle",
  needleDown: false,
  cueTarget: VINYL_CONSTANTS.PLAYING_POSITION,
};

export function playerReducer(
  state: PlayerState,
  event: PlayerEvent
): PlayerState {
  switch (event.type) {
    case "PLAY":
      if (state.mode !== "idle" && state.mode !== "returning") return state;
      return { ...state, mode: "cueing", cueTarget: event.cueTarget };

    case "STOP":
      if (state.mode !== "cueing" && state.mode !== "playing") return state;
      return { ...state, mode: "returning" };

    case "DRAG_START":
      return { ...state, mode: "dragging" };

    case "DRAG_END":
      if (state.mode !== "dragging") return state;
      return { ...state, mode: state.needleDown ? "playing" : "idle" };

    case "ARM_SETTLED":
      if (state.mode === "cueing") {
        return { ...state, mode: state.needleDown ? "playing" : "idle" };
      }
      if (state.mode === "returning") return { ...state, mode: "idle" };
      return state;

    case "NEEDLE_CHANGED":
      if (state.needleDown === event.needleDown) return state;
      return { ...state, needleDown: event.needleDown };
  }
}

/** Audio plays while the needle is down, except while the arm is lifting off. */
export const selectIsPlaying = (state: PlayerState) =>
  state.needleDown && state.mode !== "returning";

/** The platter starts turning as soon as play is pressed. */
export const selectIsSpinning = (state: PlayerState) =>
  state.needleDown || state.mode === "cueing";

export const selectCanStart = (state: PlayerState) =>
  state.mode === "idle" || state.mode === "returning";

export const selectCanStop = (state: PlayerState) =>
  state.mode === "cueing" || state.mode === "playing";

/** Needle contact with hysteresis, so hovering at the threshold doesn't flicker. */
export function isNeedleDown(angle: number, wasDown: boolean) {
  return wasDown
    ? angle > VINYL_CONSTANTS.NEEDLE_LIFT_THRESHOLD
    : angle > VINYL_CONSTANTS.NEEDLE_ON_RECORD_THRESHOLD;
}

/** Arm angle for a pointer position; 0° hangs straight down, positive swings over the record. */
export function armAngleFromPointer(
  pivot: { x: number; y: number },
  clientX: number,
  clientY: number
) {
  const angle =
    Math.atan2(-(clientX - pivot.x), clientY - pivot.y) * (180 / Math.PI);
  return Math.max(0, Math.min(VINYL_CONSTANTS.MAX_TONE_ARM_ROTATION, angle));
}
