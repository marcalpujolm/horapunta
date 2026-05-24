import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { fontFamily, BLACK, WHITE, RED, SPRING, SPRING_SNAP, cl } from "../brand";

// ─── Scene 5: Activations — 0-370f ──────────────────────────────────────────
// Title spins in on Y. 4 cards flip in (3D rotateY). Each card has tags.

const CARDS = [
  {
    title: "COMUNITAT QUE TORNA SOLA",
    tags: ["Comunitat", "Fidelització", "Recurrència"],
  },
  {
    title: "EL PUNT DE TROBADA DEL BARRI",
    tags: ["Barri", "Moment", "Flux"],
  },
  {
    title: "IDENTITAT PRÒPIA",
    tags: ["Col·laboració", "Exclusivitat", "Diferenciació"],
  },
  {
    title: "UN LOCAL QUE ES CONVERTEIX EN DESTÍ",
    tags: ["Experiència", "Cultura", "Pertinença"],
  },
];

const ActivationCard: React.FC<{
  title: string;
  tags: string[];
  startF: number;
  f: number;
  fps: number;
  index: number;
}> = ({ title, tags, startF, f, fps, index }) => {
  // Card flip: rotateY 90→0
  const flipSp = spring({ frame: f - startF, fps, config: SPRING, durationInFrames: 50 });
  const rotY = interpolate(flipSp, [0, 1], [90, 0]);
  const opacity = interpolate(f, [startF, startF + 14], [0, 1], cl);

  // Idle micro-rotation
  const idleRot = Math.sin((f - startF) * 0.03 + index * 1.8) * 0.6;

  return (
    <div
      style={{
        perspective: "900px",
        opacity,
      }}
    >
      <div
        style={{
          transform: `perspective(900px) rotateY(${rotY}deg) rotate(${idleRot}deg)`,
          transformOrigin: "left center",
          background: "#080808",
          border: "1px solid rgba(255,255,255,0.07)",
          borderBottom: `4px solid ${RED}`,
          borderRadius: 8,
          padding: "22px 24px",
        }}
      >
        {/* Number */}
        <div
          style={{
            fontFamily,
            fontSize: 13,
            fontWeight: 900,
            color: RED,
            letterSpacing: "0.2em",
            marginBottom: 10,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* Title */}
        <div
          style={{
            fontFamily,
            fontSize: 28,
            fontWeight: 900,
            color: WHITE,
            letterSpacing: "-0.035em",
            lineHeight: 1.15,
            marginBottom: 18,
          }}
        >
          {title}
        </div>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {tags.map((tag, ti) => {
            const tagStart = startF + 30 + ti * 8;
            const tagOp = interpolate(f, [tagStart, tagStart + 14], [0, 1], cl);
            const tagX = interpolate(f, [tagStart, tagStart + 18], [-20, 0], cl);
            return (
              <span
                key={ti}
                style={{
                  fontFamily,
                  fontSize: 14,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.7)",
                  background: "rgba(232,64,28,0.12)",
                  border: "1px solid rgba(232,64,28,0.3)",
                  borderRadius: 100,
                  padding: "5px 14px",
                  opacity: tagOp,
                  transform: `translateX(${tagX}px)`,
                  display: "inline-block",
                }}
              >
                {tag}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const S5Activations: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn  = interpolate(f, [0, 16], [0, 1], cl);
  const fadeOut = interpolate(f, [348, 370], [1, 0], cl);
  const opacity = Math.min(fadeIn, fadeOut);

  // Title: spins in on Y axis
  const titleSp = spring({ frame: f - 5, fps, config: SPRING_SNAP, durationInFrames: 45 });
  const titleRotY = interpolate(titleSp, [0, 1], [-90, 0]);
  const titleOp = interpolate(f, [5, 25], [0, 1], cl);

  const cardStarts = [48, 108, 168, 228];

  return (
    <AbsoluteFill style={{ background: BLACK, opacity }}>
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 60px",
          gap: 24,
        }}
      >
        {/* Title */}
        <div
          style={{
            opacity: titleOp,
            transform: `perspective(1200px) rotateY(${titleRotY}deg)`,
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          <div style={{ fontFamily, fontSize: 22, fontWeight: 700, color: RED, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8 }}>
            Coses que fem. De veritat.
          </div>
          <div style={{ width: 80, height: 3, background: RED, borderRadius: 2, margin: "0 auto" }} />
        </div>

        {/* Cards grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, width: "100%" }}>
          {CARDS.map((card, i) => (
            <ActivationCard
              key={i}
              title={card.title}
              tags={card.tags}
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
