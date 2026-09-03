import { create } from 'zustand';

interface ScrollNavState {
  /** True when the bottom nav bar should be hidden (user scrolling down through a list). */
  hidden: boolean;
  setHidden: (hidden: boolean) => void;
}

const HIDE_THRESHOLD_PX = 12;

/**
 * Tiny shared store so any independent list screen's scroll position can drive the bottom nav
 * bar's hide/show state without prop-drilling a callback down through every screen.
 */
export const useScrollNavStore = create<ScrollNavState>((set, get) => ({
  hidden: false,
  setHidden: (hidden) => {
    if (get().hidden !== hidden) set({ hidden });
  },
}));

let lastOffset = 0;

/**
 * Feeds one scroll-position sample into the shared hide/show state. Call from a list's onScroll
 * handler with `event.nativeEvent.contentOffset.y`. Ignores small jitter below HIDE_THRESHOLD_PX
 * and never hides while already near the top.
 */
export function reportScrollOffset(offsetY: number): void {
  const delta = offsetY - lastOffset;
  const { setHidden } = useScrollNavStore.getState();

  if (offsetY <= 4) {
    setHidden(false);
  } else if (delta > HIDE_THRESHOLD_PX) {
    setHidden(true);
  } else if (delta < -HIDE_THRESHOLD_PX) {
    setHidden(false);
  }

  lastOffset = offsetY;
}
