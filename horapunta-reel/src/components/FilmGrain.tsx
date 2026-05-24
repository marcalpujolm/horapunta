import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

/**
 * CSS-based cinematic post-processing:
 * - Film grain (SVG feTurbulence, seed changes per frame)
 * - Heavy radial vignette
 * - Subtle cinematic letterbox bars (2% top/bottom)
 */
export const FilmGrain: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = (frame * 7919 + 42) % 9999;

  return (
    <>
      {/* Film grain */}
      <AbsoluteFill
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='320'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' seed='${seed}'/%3E%3C/filter%3E%3Crect width='320' height='320' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: 0.048,
          pointerEvents: "none",
          mixBlendMode: "overlay",
        }}
      />

      {/* Heavy vignette — cinematic mood */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 46%, transparent 18%, rgba(0,0,0,0.55) 58%, rgba(0,0,0,0.92) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Top fade — atmospheric */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.72) 0%, transparent 14%)",
          pointerEvents: "none",
        }}
      />

      {/* Bottom fade */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(0deg, rgba(0,0,0,0.78) 0%, transparent 14%)",
          pointerEvents: "none",
        }}
      />
    </>
  );
};
