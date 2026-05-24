import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { fontFamily, BLACK, WHITE, RED, SPRING, cl } from "../brand";

// ─── Scene 4: The Solution — 0-370f ─────────────────────────────────────────
// Perspective flip entrance. Title + 3 solution blocks from 3 directions.
// Blocks float while idle.

const BLOCKS = [
  {
    icon: "⚡",
    title: "ACTIVACIONS FÍSIQUES",
    body: "Events i experiències que porten gent real.",
    dir: "left" as const,
    start: 60,
  },
  {
    icon: "🔗",
    title: "CONNEXIÓ AMB COMUNITATS",
    body: "El teu local, punt de trobada.",
    dir: "top" as const,
    start: 90,
  },
  {
    icon: "🧠",
    title: "ESTRATÈGIA I EXECUCIÓ",
    body: "Dissenyem, executem, estarem allà.",
    dir: "right" as const,
    start: 120,
  },
] as const;

const SolutionBlock: React.FC<{
  icon: string;
  title: string;
  body: string;
  dir: "left" | "top" | "right";
  startF: number;
  f: number;
  fps: number;
  index: number;
}> = ({ icon, title, body, dir, startF, f, fps, index }) => {
  const sp = spring({ frame: f - startF, fps, config: SPRING, durationInFrames: 50 });
  const opacity = interpolate(f, [startF, startF + 18], [0, 1], cl);

  const tx = dir === "left" ? interpolate(sp, [0, 1], [-180, 0]) : dir === "right" ? interpolate(sp, [0, 1], [180, 0]) : 0;
  const ty = dir === "top" ? interpolate(sp, [0, 1], [-140, 0]) : 0;

  // Idle float
  const floatY = Math.sin((f - startF) * 0.038 + index * 2.1) * 5;
  const floatR = Math.sin((f - startF) * 0.028 + index * 1.5) * 0.8;

  return (
    <div
      style={{
        opacity,
        transform: `translate(${tx}px, ${ty + floatY}px) rotate(${floatR}deg)`,
        flex: 1,
        background: "#0A0A0A",
        border: "1px solid rgba(255,255,255,0.08)",
        borderTop: `4px solid ${RED}`,
        borderRadius: 8,
        padding: "28px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        minHeight: 200,
      }}
    >
      <div style={{ fontSize: 40, lineHeight: 1 }}>{icon}</div>
      <div
        style={{
          fontFamily,
          fontSize: 26,
          fontWeight: 900,
          color: WHITE,
          letterSpacing: "-0.03em",
          lineHeight: 1.15,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily,
          fontSize: 20,
          fontWeight: 400,
          color: "rgba(255,255,255,0.55)",
          lineHeight: 1.4,
        }}
      >
        {body}
      </div>
    </div>
  );
};

export const S4Solution: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Perspective flip entrance: scene flips in from rotateY 90→0 in first 28f
  const flipSp = spring({ frame: f - 0, fps, config: { damping: 14, stiffness: 120, mass: 0.9 }, durationInFrames: 40 });
  const rotY = interpolate(flipSp, [0, 1], [-90, 0]);
  const fadeIn = interpolate(f, [0, 22], [0, 1], cl);
  const fadeOut = interpolate(f, [348, 370], [1, 0], cl);
  const opacity = Math.min(fadeIn, fadeOut);

  // Title slides in from top
  const titleSp = spring({ frame: f - 20, fps, config: SPRING, durationInFrames: 40 });
  const titleY = interpolate(titleSp, [0, 1], [-80, 0]);

  return (
    <AbsoluteFill
      style={{
        background: BLACK,
        opacity,
        perspective: "1600px",
      }}
    >
      <AbsoluteFill
        style={{
          transform: `rotateY(${rotY}deg)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 56px",
          gap: 36,
        }}
      >
        {/* Title */}
        <div
          style={{
            transform: `translateY(${titleY}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily,
              fontSize: 68,
              fontWeight: 900,
              color: WHITE,
              letterSpacing: "-0.045em",
              lineHeight: 1.0,
            }}
          >
            Màrqueting que es nota
          </div>
          <div
            style={{
              fontFamily,
              fontSize: 68,
              fontWeight: 900,
              color: RED,
              letterSpacing: "-0.045em",
              lineHeight: 1.0,
            }}
          >
            al carrer.
          </div>
        </div>

        {/* 3 Solution blocks */}
        <div style={{ display: "flex", gap: 20, width: "100%", alignItems: "stretch" }}>
          {BLOCKS.map((b, i) => (
            <SolutionBlock
              key={i}
              icon={b.icon}
              title={b.title}
              body={b.body}
              dir={b.dir}
              startF={b.start}
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
