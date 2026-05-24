import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { fontFamily, BLACK, WHITE, RED, SPRING_SOFT, cl } from "../brand";

// ─── Scene 3: Quote Impact — AGGRESSIVE ─────────────────────────────────────
// Words animate in alternating WHITE/RED. Background pulses.
// Ends with a hard white flash → cut.

// Words with color assignment
const LINE1: { w: string; c: string }[] = [
  { w: "La gent", c: WHITE },
  { w: "va a llocs", c: RED },
  { w: "per experiències", c: WHITE },
  { w: "i pertinença", c: RED },
];
const LINE2: { w: string; c: string }[] = [
  { w: "—", c: RED },
  { w: "no per un", c: WHITE },
  { w: "Reel", c: RED },
  { w: "ben editat.", c: "rgba(255,255,255,0.55)" },
];

const WordReveal: React.FC<{
  words: { w: string; c: string }[];
  startF: number;
  f: number;
  fps: number;
  size?: number;
}> = ({ words, startF, f, fps, size = 70 }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: "0 14px", justifyContent: "center" }}>
    {words.map(({ w, c }, i) => {
      const t0 = startF + i * 10;
      const sp = spring({ frame: f - t0, fps, config: SPRING_SOFT, durationInFrames: 32 });
      const y  = interpolate(sp, [0, 1], [40, 0]);
      const sc = interpolate(sp, [0, 0.7, 1], [0.6, 1.1, 1]);
      const op = interpolate(f, [t0, t0 + 10], [0, 1], cl);

      return (
        <span key={i} style={{
          fontFamily, fontSize: size, fontWeight: 900,
          color: c, letterSpacing: "-0.045em", lineHeight: 1.05,
          display: "inline-block",
          transform: `translateY(${y}px) scale(${sc})`,
          opacity: op,
        }}>
          {w}
        </span>
      );
    })}
  </div>
);

export const S3Quote: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pulsing red background glow mid-way
  const bgGlow = interpolate(f, [35, 55, 75], [0, 0.18, 0], cl);

  // Hard WHITE flash at the end
  const flashOut = interpolate(f, [112, 116, 120, 125], [0, 1, 0.5, 1], cl);

  const opacity = interpolate(f, [0, 14], [0, 1], cl);

  return (
    <AbsoluteFill style={{ background: BLACK, opacity }}>

      {/* Red glow background */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at 50% 50%, rgba(232,64,28,${bgGlow}) 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* Hard cut flash */}
      <AbsoluteFill style={{ background: WHITE, opacity: flashOut, pointerEvents: "none" }} />

      <AbsoluteFill style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "0 72px", gap: 16,
      }}>

        {/* Opening quote — huge red */}
        <div style={{
          fontFamily, fontSize: 100, fontWeight: 900, color: RED,
          lineHeight: 1, alignSelf: "flex-start", marginBottom: -18,
          opacity: interpolate(f, [4, 16], [0, 1], cl),
          transform: `scale(${interpolate(f, [4, 18], [0.5, 1], cl)})`,
          transformOrigin: "left center",
        }}>
          "
        </div>

        <WordReveal words={LINE1} startF={8}  f={f} fps={fps} size={68} />

        {/* Red separator line */}
        <div style={{
          width: interpolate(f, [52, 72], [0, 260], cl),
          height: 4, background: RED, borderRadius: 2,
        }} />

        <WordReveal words={LINE2} startF={58} f={f} fps={fps} size={58} />

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
