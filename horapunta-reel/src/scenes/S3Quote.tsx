import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { fontFamily, BLACK, WHITE, RED, SPRING_SOFT, cl } from "../brand";

// ─── Scene 3: Quote Impact — 0-125f ─────────────────────────────────────────
// Word by word reveal, large type. Then glow flash. Hard cut.

const LINE1_WORDS = ["La gent va a llocs"];
const LINE2_WORDS = ["per experiències i pertinença"];
const LINE3_WORDS = ["— no per un Reel ben editat."];

const WordReveal: React.FC<{
  words: string[];
  startF: number;
  f: number;
  fps: number;
  size?: number;
  color?: string;
  spacing?: number;
}> = ({ words, startF, f, fps, size = 58, color = WHITE, spacing = 10 }) => {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: `0 ${spacing}px`, justifyContent: "center" }}>
      {words.map((word, i) => {
        const t0 = startF + i * 12;
        const sp = spring({ frame: f - t0, fps, config: SPRING_SOFT, durationInFrames: 35 });
        const y = interpolate(sp, [0, 1], [30, 0]);
        const op = interpolate(f, [t0, t0 + 12], [0, 1], cl);

        return (
          <span
            key={i}
            style={{
              fontFamily,
              fontSize: size,
              fontWeight: 900,
              color,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              display: "inline-block",
              transform: `translateY(${y}px)`,
              opacity: op,
            }}
          >
            {word}&nbsp;
          </span>
        );
      })}
    </div>
  );
};

export const S3Quote: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Glow: flashes briefly at f88
  const glow = interpolate(f, [85, 90, 95, 102], [0, 1, 0.6, 0], cl);

  // Hard cut: everything visible until very last frame
  const opacity = interpolate(f, [120, 125], [1, 0], cl);

  return (
    <AbsoluteFill
      style={{
        background: BLACK,
        opacity,
      }}
    >
      {/* Glow layer */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 50%, rgba(232,64,28,${glow * 0.2}) 0%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 80px",
          gap: 12,
        }}
      >
        {/* Opening quote mark */}
        <div
          style={{
            fontFamily,
            fontSize: 80,
            fontWeight: 900,
            color: RED,
            lineHeight: 1,
            opacity: interpolate(f, [5, 20], [0, 1], cl),
            alignSelf: "flex-start",
            marginBottom: -12,
          }}
        >
          "
        </div>

        <WordReveal words={LINE1_WORDS} startF={8} f={f} fps={fps} size={62} />
        <WordReveal words={LINE2_WORDS} startF={24} f={f} fps={fps} size={62} />

        {/* Divider */}
        <div
          style={{
            width: interpolate(f, [50, 72], [0, 200], cl),
            height: 3,
            background: RED,
            borderRadius: 2,
            margin: "8px 0",
          }}
        />

        <WordReveal
          words={LINE3_WORDS}
          startF={56}
          f={f}
          fps={fps}
          size={52}
          color="rgba(255,255,255,0.65)"
        />
      </AbsoluteFill>

      {/* Scan lines */}
      <AbsoluteFill
        style={{
          background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 1px, transparent 1px, transparent 4px)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
