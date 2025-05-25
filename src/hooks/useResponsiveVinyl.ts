import { VINYL_CONSTANTS } from "../lib/constants";
import useMediaQuery from "./useMediaQuery";

export const useResponsiveVinyl = () => {
  const isMobile = useMediaQuery("(max-width: 639px)");
  const isTablet = useMediaQuery("(min-width: 640px) and (max-width: 1023px)");

  const getPlayingPosition = () => {
    if (isMobile) {
      return VINYL_CONSTANTS.NEEDLE_ON_RECORD_THRESHOLD + 5;
    } else if (isTablet) {
      return VINYL_CONSTANTS.NEEDLE_ON_RECORD_THRESHOLD + 3;
    } else {
      return VINYL_CONSTANTS.NEEDLE_ON_RECORD_THRESHOLD + 2;
    }
  };

  const getVinylSizing = () => {
    if (isMobile) {
      return {
        record: "w-[85vmin] h-[85vmin]",
        toneArm: "w-[25vmin] h-[85vmin]",
        gap: "gap-2",
        offset: "relative -left-8",
      };
    } else if (isTablet) {
      return {
        record: "w-[65vmin] h-[65vmin]",
        toneArm: "w-[20vmin] h-[65vmin]",
        gap: "gap-4",
        offset: "",
      };
    } else {
      return {
        record: "w-[60vmin] h-[60vmin]",
        toneArm: "w-[18vmin] h-[60vmin]",
        gap: "gap-6",
        offset: "",
      };
    }
  };

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    playingPosition: getPlayingPosition(),
    sizing: getVinylSizing(),
  };
};
