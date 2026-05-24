import { Easing } from "remotion";

/** Cubic bezier: feel like Apple/A24 — fast out, organic */
export const cin = Easing.bezier(0.22, 1, 0.36, 1);
export const easeOut = Easing.out(Easing.cubic);
export const easeIn = Easing.in(Easing.cubic);
export const easeInOut = Easing.inOut(Easing.cubic);
