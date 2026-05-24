import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { fontFamily, BLACK, WHITE, RED, cl } from "../brand";
import { SplitText } from "../utils/SplitText";

// ─── Scene 5: Activations — FULL-SCREEN SLIDE PER ACTIVATION ────────────────
// 4 slides sequential, each full-screen with massive SplitText title.
// Alternating bg: #111 → RED → WHITE → #111. Flash cuts between.
// Duration: 270f

const SLIDES = [
  {
    start: 0,
    bg: "#111111",
    ghost: "01",
    ghostColor: "rgba(255,255,255,0.06)",
    label: "FIDELITZACIÓ · RECURRÈNCIA",
    labelColor: RED,
    line1: { text: "TORNEN",   size: 185, color: WHITE, anim: "fall"  as const },
    line2: { text: "SOLS.",    size: 140, color: RED,   anim: "rise"  as const },
    line1Start: 12,
    line2Start: 24,
  },
  {
    start: 65,
    bg: RED,
    ghost: "02",
    ghostColor: "rgba(0,0,0,0.08)",
    label: "BARRI · COMUNITAT · FLUX",
    labelColor: BLACK,
    line1: { text: "EL BARRI",  size: 150, color: BLACK, anim: "left"  as const },
    line2: { text: "ÉS TU.",    size: 120, color: WHITE, anim: "right" as const },
    line1Start: 77,
    line2Start: 91,
  },
  {
    start: 130,
    bg: WHITE,
    ghost: "03",
    ghostColor: "rgba(0,0,0,0.06)",
    label: "COL·LABORACIÓ · EXCLUSIVITAT",
    labelColor: RED,
    line1: { text: "IDENTITAT",  size: 140, color: RED,   anim: "spinY" as const },
    line2: { text: "PRÒPIA.",    size: 110, color: BLACK,  anim: "scale" as const },
    line1Start: 142,
    line2Start: 156,
  },
  {
    start: 195,
    bg: "#0A0A0A",
    ghost: "04",
    ghostColor: "rgba(255,255,255,0.06)",
    label: "EXPERIÈNCIA · CULTURA · DESTÍ",
    labelColor: RED,
    line1: { text: "UN LOCAL",  size: 148, color: WHITE, anim: "chaos"  as const },
    line2: { text: "DESTÍ.",    size: 120, color: RED,   anim: "bounce" as const },
    line1Start: 207,
    line2Start: 222,
  },
] as const;

export const S5Activations: React.FC = () => {
  const f = useCurrentFrame();

  // ── Overall fade ──────────────────────────────────────────────────────────
  const fadeOut = interpolate(f, [248, 265], [1, 0], cl);

  // ── Per-slide opacity ─────────────────────────────────────────────────────
  const sOp = [
    interpolate(f, [0,  10, 55, 65],  [0, 1, 1, 0], cl),
    interpolate(f, [65, 73,120,130],  [0, 1, 1, 0], cl),
    interpolate(f, [130,138,185,195], [0, 1, 1, 0], cl),
    interpolate(f, [195,203,245,258], [0, 1, 1, 0], cl),
  ];

  // ── White flash cuts ──────────────────────────────────────────────────────
  const flash1 = interpolate(f, [61, 63, 67, 71],  [0, 1, 1, 0], cl);
  const flash2 = interpolate(f, [126,128,132,136], [0, 1, 1, 0], cl);
  const flash3 = interpolate(f, [191,193,197,201], [0, 1, 1, 0], cl);
  const flashOp = Math.min(1, flash1 + flash2 + flash3);

  // ── Background: which slide is dominant? ─────────────────────────────────
  const bgIdx = f < 65 ? 0 : f < 130 ? 1 : f < 195 ? 2 : 3;
  const bg = SLIDES[bgIdx].bg;

  return (
    <AbsoluteFill style={{ background: bg, opacity: fadeOut, overflow: "hidden" }}>

      {/* White flash cuts */}
      <AbsoluteFill style={{ background: WHITE, opacity: flashOp, pointerEvents: "none" }} />

      {/* ── All 4 slides rendered simultaneously, controlled by opacity ── */}
      {SLIDES.map((s, idx) => {
        const op = sOp[idx];

        // Ghost number animation — floats in from below
        const ghostY = interpolate(f, [s.start, s.start + 30], [40, 0], cl);

        // Label slide-in from left
        const labelOp = interpolate(f, [s.start + 10, s.start + 22], [0, 1], cl);
        const labelX  = interpolate(f, [s.start + 10, s.start + 22], [-28, 0], cl);

        // Separator line grows
        const lineW = interpolate(f, [s.start + 18, s.start + 38], [0, 80], cl);

        return (
          <AbsoluteFill
            key={idx}
            style={{
              opacity: op,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            {/* Ghost number in background */}
            <div style={{
              position: "absolute",
              right: "6%",
              bottom: "8%",
              fontFamily,
              fontSize: 240,
              fontWeight: 900,
              color: s.ghostColor,
              lineHeight: 1,
              userSelect: "none",
              transform: `translateY(${ghostY}px)`,
            }}>
              {s.ghost}
            </div>

            {/* Category label */}
            <div style={{
              fontFamily,
              fontSize: 13,
              fontWeight: 900,
              color: s.labelColor,
              letterSpacing: "0.28em",
              opacity: labelOp,
              transform: `translateX(${labelX}px)`,
              marginBottom: 8,
            }}>
              {s.label}
            </div>

            {/* Red/accent separator line */}
            <div style={{
              width: lineW,
              height: 4,
              background: s.labelColor,
              borderRadius: 2,
              marginBottom: 12,
            }} />

            {/* Main title — line 1 */}
            <SplitText
              text={s.line1.text}
              startFrame={s.line1Start}
              fontSize={s.line1.size}
              fontWeight={900}
              color={s.line1.color}
              fontFamily={fontFamily}
              letterSpacing="-0.07em"
              stagger={3}
              animType={s.line1.anim}
              cfg={{ damping: 9, stiffness: 290, mass: 0.85 }}
            />

            {/* Main title — line 2 */}
            <SplitText
              text={s.line2.text}
              startFrame={s.line2Start}
              fontSize={s.line2.size}
              fontWeight={900}
              color={s.line2.color}
              fontFamily={fontFamily}
              letterSpacing="-0.06em"
              stagger={3}
              animType={s.line2.anim}
              cfg={{ damping: 9, stiffness: 290, mass: 0.85 }}
            />
          </AbsoluteFill>
        );
      })}

    </AbsoluteFill>
  );
};
