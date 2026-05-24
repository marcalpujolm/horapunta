import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { fontFamily, BLACK, WHITE, RED, SPRING, SPRING_SNAP, cl } from "../brand";

// ─── Scene 5: Activations — ALTERNATING COLOR CARDS ─────────────────────────
// Cards alternate: dark → RED bg → WHITE bg → dark
// Each card flips differently. Tags animate as colored pills.

const CARDS = [
  { title: "COMUNITAT\nQUE TORNA SOLA",         tags: ["Comunitat", "Fidelització", "Recurrència"], bg: "#111111", fg: WHITE,  accent: RED,   flipDir: "Y" as const },
  { title: "EL PUNT DE\nTROBADA DEL BARRI",      tags: ["Barri", "Moment", "Flux"],                  bg: RED,      fg: WHITE,  accent: WHITE, flipDir: "X" as const },
  { title: "IDENTITAT\nPRÒPIA",                  tags: ["Col·lab.", "Exclusivitat", "Diferenciació"], bg: WHITE,    fg: BLACK,  accent: RED,   flipDir: "Y" as const },
  { title: "UN LOCAL QUE ES\nCONVERTEIX EN DESTÍ",tags: ["Experiència","Cultura","Pertinença"],       bg: RED,      fg: WHITE,  accent: WHITE, flipDir: "X" as const },
] as const;

export const S5Activations: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn  = interpolate(f, [0, 14], [0, 1], cl);
  const fadeOut = interpolate(f, [245, 265], [1, 0], cl);

  // Title Y-spin
  const tSp = spring({ frame: f - 4, fps, config: SPRING_SNAP, durationInFrames: 42 });
  const tRotY = interpolate(tSp, [0, 1], [-90, 0]);
  const tOp   = interpolate(f, [4, 22], [0, 1], cl);

  const starts = [28, 68, 108, 148];

  return (
    <AbsoluteFill style={{ background: "#0A0A0A", opacity: Math.min(fadeIn, fadeOut), overflow: "hidden" }}>

      {/* Dot grid background */}
      <AbsoluteFill style={{
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
        pointerEvents: "none",
      }} />

      <AbsoluteFill style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "0 28px", gap: 16,
      }}>

        {/* Title */}
        <div style={{
          opacity: tOp,
          transform: `perspective(1000px) rotateY(${tRotY}deg)`,
          textAlign: "center", marginBottom: 4,
        }}>
          <div style={{ fontFamily, fontSize: 32, fontWeight: 900, color: RED, letterSpacing: "0.16em", textTransform: "uppercase" }}>
            Coses que fem
          </div>
          <div style={{ width: 60, height: 4, background: RED, borderRadius: 2, margin: "10px auto 0" }} />
        </div>

        {/* Cards — 2×2 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, width: "100%" }}>
          {CARDS.map((card, i) => {
            const sp   = spring({ frame: f - starts[i], fps, config: SPRING, durationInFrames: 52 });
            const op   = interpolate(f, [starts[i], starts[i] + 16], [0, 1], cl);
            const rot  = card.flipDir === "Y"
              ? `perspective(900px) rotateY(${interpolate(sp, [0, 1], [90, 0])}deg)`
              : `perspective(900px) rotateX(${interpolate(sp, [0, 1], [-90, 0])}deg)`;

            const sc = interpolate(sp, [0, 0.8, 1], [0.88, 1.06, 1]);

            // Idle micro-motion
            const floatY = Math.sin((f - starts[i]) * 0.032 + i * 1.6) * 4;

            return (
              <div key={i} style={{
                opacity: op,
                transform: `${rot} scale(${sc}) translateY(${floatY}px)`,
                transformOrigin: "center center",
                background: card.bg,
                border: card.bg === "#111111" ? `1px solid rgba(255,255,255,0.08)` : "none",
                borderBottom: `6px solid ${card.accent}`,
                borderRadius: 10,
                padding: "26px 22px",
                boxShadow: card.bg === RED ? `0 0 30px ${RED}77` : card.bg === WHITE ? "0 6px 28px rgba(0,0,0,0.4)" : "none",
              }}>
                {/* Number */}
                <div style={{
                  fontFamily, fontSize: 10, fontWeight: 900,
                  color: card.bg === WHITE ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.4)",
                  letterSpacing: "0.22em", marginBottom: 8,
                }}>
                  0{i + 1} —
                </div>

                {/* Title */}
                <div style={{
                  fontFamily, fontSize: 34, fontWeight: 900,
                  color: card.fg, letterSpacing: "-0.04em",
                  lineHeight: 1.05, marginBottom: 14,
                  whiteSpace: "pre-line",
                }}>
                  {card.title}
                </div>

                {/* Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {card.tags.map((tag, ti) => {
                    const tagStart = starts[i] + 28 + ti * 8;
                    return (
                      <span key={ti} style={{
                        fontFamily, fontSize: 14, fontWeight: 800,
                        color: card.bg === WHITE ? RED : card.accent,
                        background: card.bg === WHITE
                          ? "rgba(232,64,28,0.1)"
                          : "rgba(255,255,255,0.12)",
                        border: `1px solid ${card.bg === WHITE ? RED : card.accent}55`,
                        borderRadius: 100, padding: "4px 12px",
                        opacity: interpolate(f, [tagStart, tagStart + 12], [0, 1], cl),
                        transform: `translateX(${interpolate(f, [tagStart, tagStart + 14], [-16, 0], cl)}px)`,
                        display: "inline-block",
                      }}>
                        {tag}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
