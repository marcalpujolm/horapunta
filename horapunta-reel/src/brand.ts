import { loadFont } from "@remotion/google-fonts/Inter";

export const { fontFamily } = loadFont("normal");

export const BLACK = "#000000";
export const WHITE = "#FFFFFF";
export const RED   = "#E8401C";

export const SPRING = { damping: 12, stiffness: 100, mass: 0.8 } as const;
export const SPRING_SNAP = { damping: 9, stiffness: 260, mass: 1.0 } as const;
export const SPRING_SOFT = { damping: 18, stiffness: 80, mass: 1.2 } as const;

/** Clamp helper */
export const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
