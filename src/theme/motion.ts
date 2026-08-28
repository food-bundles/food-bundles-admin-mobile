import { Easing } from 'react-native-reanimated';

export const duration = {
  nav: 380,
  overlay: 300,
  micro: 180,
} as const;

/**
 * Bespoke timings for the app's named "signature motion" moments —
 * deliberately outside the generic duration set above. See the motion
 * skill.
 */
export const signatureDuration = {
  skeletonSweep: 1200,
  statusPulse: 2000,
  statusDotBump: 300,
  statusChipCrossfade: 200,
  chartDrawIn: 800,
  chartBarStagger: 60,
  chartBarRise: 600,
  gaugeDrawIn: 1200,
  rowExpand: 220,
  bellWobble: 240,
  badgePop: 180,
  bannerAutoDismiss: 4000,
} as const;

export const easing = {
  standard: Easing.bezier(0.4, 0, 0.2, 1),
  enter: Easing.bezier(0, 0, 0.2, 1),
  exit: Easing.bezier(0.4, 0, 1, 1),
} as const;
