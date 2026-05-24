import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { fontFamily, BLACK, WHITE, RED, SPRING, SPRING_SNAP, cl } from "../brand";

// ─── Scene 2: The Problem — 0-240f ──────────────────────────────────────────
// Title crashes in. 4 problem cards flip in one by one (3D rotateX).

const CARDS = [
  "No serveix només\namb un bon servei",
  "El local buit\ntambé comunica",
  "No connectes\namb cap comunitat",
  "No tens temps\nper fer coses diferents",
];

const ProblemCard: React.FC<{ text: string; startF: number; f: number; fps: number; index: number }> = ({
  text, startF, f, fps, index,
}) => {
  const sp = spring({ frame: f - startF, fps, config: SPRING, durationInFrames: 45 });
  const rotX = interpolate(sp, [0, 1], [90, 0]);
  const opacity = interpolate(f, [startF, startF + 15], [0, 1], cl);

  // Subtle idle float
  const floatY = Math.sin((f - startF) * 0.04 + index * 1.2) * 3;

  return (
    <div
      style={{
        perspective: "800px",
        opacity,
        transform: `translateY(${floatY}px)`,
      }}
    >
      <div
        style={{
          transform: `perspective(800px) rotateX(${rotX}deg)`,
          transformOrigin: "top center",
          background: "#0A0A0A",
          border: `2px solid ${RED}`,
          borderLeft: `6px solid ${RED}`,
          borderRadius: 6,
          padding: "22px 26px",
          minWidth: 420,
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 32,
            fontWeight: 800,
            color: WHITE,
            lineHeight: 1.2,
            letterSpacing: "-0.03em",
            whiteSpace: "pre-line",
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};

export const S2Problem: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene fade in/out
  const fadeIn  = interpolate(f, [0, 18], [0, 1], cl);
  const fadeOut = interpolate(f, [220, 240], [1, 0], cl);
  const opacity = Math.min(fadeIn, fadeOut);

  // Title crash in
  const titleSp = spring({ frame: f - 5, fps, config: SPRING_SNAP, durationInFrames: 40 });
  const titleY  = interpolate(titleSp, [0, 1], [-120, 0]);
  const titleScale = interpolate(titleSp, [0, 0.8, 1], [1.4, 0.92, 1]);

  // Card start frames
  const cardStarts = [38, 65, 92, 119];

  return (
    <AbsoluteFill style={{ background: BLACK, opacity }}>
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 64px",
          gap: 28,
        }}
      >
        {/* Title */}
        <div
          style={{
            transform: `translateY(${titleY}px) scale(${titleScale})`,
            textAlign: "center",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontFamily,
              fontSize: 72,
              fontWeight: 900,
              color: WHITE,
              letterSpacing: "-0.045em",
              lineHeight: 1.0,
            }}
          >
            Per què el teu local
          </div>
          <div
            style={{
              fontFamily,
              fontSize: 72,
              fontWeight: 900,
              color: RED,
              letterSpacing: "-0.045em",
              lineHeight: 1.0,
            }}
          >
            no creix.
          </div>
        </div>

        {/* Cards — 2×2 grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, width: "100%" }}>
          {CARDS.map((text, i) => (
            <ProblemCard
              key={i}
              text={text}
              startF={cardStarts[i]}
              f={f}
              fps={fps}
              index={i}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
