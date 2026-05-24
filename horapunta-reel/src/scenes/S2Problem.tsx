import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { fontFamily, BLACK, WHITE, RED, SPRING, SPRING_SNAP, cl } from "../brand";

// ─── Scene 2: The Problem — AGGRESSIVE ──────────────────────────────────────
// Starts on FULL RED background (inversion). Title crashes.
// Each card: different color scheme + different entry animation.

const CARDS = [
  { text: "No serveix\namb un bon servei", bg: RED, fg: WHITE, border: WHITE },
  { text: "El local buit\ntambé comunica", bg: WHITE, fg: BLACK, border: BLACK },
  { text: "No connectes\namb cap comunitat", bg: RED, fg: WHITE, border: WHITE },
  { text: "No tens temps\nper fer coses\ndiferents", bg: WHITE, fg: BLACK, border: BLACK },
];

export const S2Problem: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOut = interpolate(f, [220, 240], [1, 0], cl);

  // Background: starts RED, smashes to BLACK at f22
  const bgFlip = interpolate(f, [18, 24], [0, 1], cl);
  const bg = bgFlip > 0.5 ? BLACK : RED;

  const titleSp = spring({ frame: f - 2, fps, config: SPRING_SNAP, durationInFrames: 38 });
  const titleY = interpolate(titleSp, [0, 1], [-100, 0]);
  const titleScale = interpolate(titleSp, [0, 0.7, 1], [1.5, 0.88, 1]);

  // Flash at background switch
  const switchFlash = interpolate(f, [18, 20, 24], [0, 1, 0], cl);

  // Card configs — each with a unique animation style
  const cardConfigs = [
    // Card 1: scale punch from center
    { start: 38, tx: 0, ty: 0, rot: 0, scale: true },
    // Card 2: slide + tilt from left
    { start: 65, tx: -200, ty: 0, rot: -5, scale: false },
    // Card 3: drop from top + slight skew
    { start: 92, tx: 0, ty: -180, rot: 3, scale: false },
    // Card 4: slam from right
    { start: 119, tx: 200, ty: 0, rot: 4, scale: false },
  ];

  return (
    <AbsoluteFill style={{ background: bg, opacity: fadeOut, overflow: "hidden" }}>

      {/* White flash on bg switch */}
      <AbsoluteFill style={{ background: WHITE, opacity: switchFlash, pointerEvents: "none" }} />

      {/* Vertical accent lines (decoration) */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {[15, 50, 85].map((pct, i) => (
          <div key={i} style={{
            position: "absolute", top: 0, bottom: 0,
            left: `${pct}%`, width: 1,
            background: bgFlip > 0.5 ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.1)",
          }} />
        ))}
      </AbsoluteFill>

      <AbsoluteFill style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "0 56px", gap: 24,
      }}>

        {/* Title */}
        <div style={{
          transform: `translateY(${titleY}px) scale(${titleScale})`,
          textAlign: "center", marginBottom: 8,
          width: "100%",
        }}>
          <div style={{
            fontFamily, fontSize: 82, fontWeight: 900,
            color: bgFlip > 0.5 ? WHITE : WHITE,
            letterSpacing: "-0.05em", lineHeight: 0.95,
          }}>
            Per què el teu local
          </div>
          <div style={{
            fontFamily, fontSize: 82, fontWeight: 900,
            color: bgFlip > 0.5 ? RED : BLACK,
            letterSpacing: "-0.05em", lineHeight: 0.95,
          }}>
            no creix.
          </div>
        </div>

        {/* Cards — 2×2 grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, width: "100%" }}>
          {CARDS.map((card, i) => {
            const cfg = cardConfigs[i];
            const sp = spring({ frame: f - cfg.start, fps, config: SPRING, durationInFrames: 48 });
            const op = interpolate(f, [cfg.start, cfg.start + 16], [0, 1], cl);

            const tx = cfg.scale
              ? 0
              : interpolate(sp, [0, 1], [cfg.tx, 0]);
            const ty = cfg.scale
              ? 0
              : interpolate(sp, [0, 1], [cfg.ty, 0]);
            const rot = cfg.scale
              ? 0
              : interpolate(sp, [0, 1], [cfg.rot, 0]);
            const sc = cfg.scale
              ? interpolate(sp, [0, 0.7, 1], [0, 1.12, 1])
              : 1;

            // Idle float
            const floatY = Math.sin((f - cfg.start) * 0.04 + i * 1.4) * 4;

            return (
              <div key={i} style={{
                opacity: op,
                transform: `translate(${tx}px, ${ty + floatY}px) rotate(${rot}deg) scale(${sc})`,
                background: card.bg,
                borderRadius: 6,
                padding: "24px 22px",
                border: `3px solid ${card.border}`,
                boxShadow: card.bg === RED ? `0 0 30px ${RED}66` : "0 4px 24px rgba(0,0,0,0.3)",
                minHeight: 140,
              }}>
                {/* Number tag */}
                <div style={{
                  fontFamily, fontSize: 11, fontWeight: 900,
                  color: card.fg === WHITE ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)",
                  letterSpacing: "0.22em", marginBottom: 10,
                }}>
                  {`0${i + 1}`} / 04
                </div>
                <div style={{
                  fontFamily, fontSize: 30, fontWeight: 900,
                  color: card.fg, letterSpacing: "-0.03em",
                  lineHeight: 1.2, whiteSpace: "pre-line",
                }}>
                  {card.text}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
