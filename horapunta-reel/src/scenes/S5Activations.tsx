import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { fontFamily, BLACK, WHITE, RED, SPRING_SNAP, cl } from "../brand";
import { SplitText } from "../utils/SplitText";

// ─── Scene 5: Activations — FULL-SCREEN SLIDES (contingut original) ──────────
// 4 slides seqüencials full-screen. Títols originals + tags preservats.
// Flash cuts entre slides. SplitText per lletra. Text molt mes gran.
// Duration: 270f

const SLIDES = [
  {
    start: 0,
    bg: "#111111",
    ghost: "01",
    ghostColor: "rgba(255,255,255,0.055)",
    label: "FIDELITZACIÓ · RECURRÈNCIA",
    labelColor: RED,
    line1: { text: "COMUNITAT",       size: 148, color: WHITE, anim: "flip3d" as const },
    line2: { text: "QUE TORNA SOLA",  size:  96, color: RED,   anim: "rise"  as const },
    tags: ["Comunitat", "Fidelització", "Recurrència"],
    tagAccent: RED,
    tagText: WHITE,
    line1Start:  12,
    line2Start:  25,
    tagsStart:   46,
  },
  {
    start: 65,
    bg: RED,
    ghost: "02",
    ghostColor: "rgba(0,0,0,0.065)",
    label: "BARRI · MOMENT · FLUX",
    labelColor: BLACK,
    line1: { text: "EL PUNT DE TROBADA", size: 88,  color: BLACK, anim: "left"  as const },
    line2: { text: "DEL BARRI",          size: 130, color: WHITE, anim: "right" as const },
    tags: ["Barri", "Moment", "Flux"],
    tagAccent: BLACK,
    tagText: WHITE,
    line1Start:  77,
    line2Start:  90,
    tagsStart:  110,
  },
  {
    start: 130,
    bg: WHITE,
    ghost: "03",
    ghostColor: "rgba(0,0,0,0.055)",
    label: "COL·LABORACIÓ · EXCLUSIVITAT",
    labelColor: RED,
    line1: { text: "IDENTITAT",  size: 148, color: RED,   anim: "spinY" as const },
    line2: { text: "PRÒPIA",     size: 130, color: BLACK, anim: "scale" as const },
    tags: ["Col·lab.", "Exclusivitat", "Diferenciació"],
    tagAccent: RED,
    tagText: BLACK,
    line1Start: 142,
    line2Start: 156,
    tagsStart:  174,
  },
  {
    start: 195,
    bg: "#0A0A0A",
    ghost: "04",
    ghostColor: "rgba(255,255,255,0.055)",
    label: "EXPERIÈNCIA · CULTURA · PERTINENÇA",
    labelColor: RED,
    line1: { text: "UN LOCAL QUE ES",     size:  88, color: WHITE, anim: "zDive"  as const },
    line2: { text: "CONVERTEIX EN DESTÍ", size:  80, color: RED,   anim: "flip3d" as const },
    tags: ["Experiència", "Cultura", "Pertinença"],
    tagAccent: RED,
    tagText: WHITE,
    line1Start: 205,
    line2Start: 218,
    tagsStart:  235,
  },
] as const;

export const S5Activations: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── "Coses que fem" heading — apareix a l'inici i es queda ──────────────
  const headSp = spring({ frame: f - 4, fps, config: SPRING_SNAP, durationInFrames: 36 });
  const headY  = interpolate(headSp, [0, 1], [-50, 0]);
  const headOp = interpolate(f, [4, 18], [0, 1], cl);

  // ── Global fade-out ──────────────────────────────────────────────────────
  const fadeOut = interpolate(f, [248, 265], [1, 0], cl);

  // ── Per-slide opacity ────────────────────────────────────────────────────
  const sOp = [
    interpolate(f, [0,  10,  55, 65],  [0, 1, 1, 0], cl),
    interpolate(f, [65, 73, 120, 130], [0, 1, 1, 0], cl),
    interpolate(f, [130,138, 185, 195],[0, 1, 1, 0], cl),
    interpolate(f, [195,203, 245, 258],[0, 1, 1, 0], cl),
  ];

  // ── Flash cuts ──────────────────────────────────────────────────────────
  const flash1 = interpolate(f, [61, 63, 67, 71],  [0, 1, 1, 0], cl);
  const flash2 = interpolate(f, [126,128,132,136], [0, 1, 1, 0], cl);
  const flash3 = interpolate(f, [191,193,197,201], [0, 1, 1, 0], cl);
  const flashOp = Math.min(1, flash1 + flash2 + flash3);

  // ── Background actiu ─────────────────────────────────────────────────────
  const bgIdx = f < 65 ? 0 : f < 130 ? 1 : f < 195 ? 2 : 3;
  const bg = SLIDES[bgIdx].bg;

  return (
    <AbsoluteFill style={{ background: bg, opacity: fadeOut, overflow: "hidden" }}>

      {/* Flash cuts */}
      <AbsoluteFill style={{ background: WHITE, opacity: flashOp, pointerEvents: "none" }} />

      {/* ── "Coses que fem" — header persistent ─────────────────────────── */}
      <div style={{
        position: "absolute", top: 48, left: 0, right: 0,
        display: "flex", flexDirection: "column", alignItems: "center",
        zIndex: 10,
        opacity: headOp,
        transform: `translateY(${headY}px)`,
        pointerEvents: "none",
      }}>
        <div style={{
          fontFamily, fontSize: 16, fontWeight: 900,
          color: SLIDES[bgIdx].labelColor,
          letterSpacing: "0.26em", textTransform: "uppercase",
          transition: "color 0.1s",
        }}>
          Coses que fem
        </div>
        <div style={{
          width: 48, height: 4, background: RED,
          borderRadius: 2, marginTop: 8,
          boxShadow: `0 0 12px ${RED}88`,
        }} />
      </div>

      {/* ── 4 slides, simultanis, controlats per opacity ─────────────────── */}
      {SLIDES.map((s, idx) => {
        const op = sOp[idx];

        // Ghost number: float-in des d'avall
        const ghostY = interpolate(f, [s.start, s.start + 28], [50, 0], cl);
        const ghostOp = interpolate(f, [s.start, s.start + 20], [0, 1], cl);

        // Label slide-in
        const labelOp = interpolate(f, [s.start + 10, s.start + 22], [0, 1], cl);
        const labelX  = interpolate(f, [s.start + 10, s.start + 22], [-30, 0], cl);

        // Separator line grows
        const lineW = interpolate(f, [s.start + 18, s.start + 38], [0, 72], cl);

        return (
          <AbsoluteFill key={idx} style={{
            opacity: op,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 6,
          }}>

            {/* Ghost number */}
            <div style={{
              position: "absolute",
              right: "5%", bottom: "7%",
              fontFamily, fontSize: 220, fontWeight: 900,
              color: s.ghostColor, lineHeight: 1,
              opacity: ghostOp,
              transform: `translateY(${ghostY}px)`,
              userSelect: "none",
            }}>
              {s.ghost}
            </div>

            {/* Label */}
            <div style={{
              fontFamily, fontSize: 13, fontWeight: 900,
              color: s.labelColor, letterSpacing: "0.26em",
              opacity: labelOp,
              transform: `translateX(${labelX}px)`,
              marginBottom: 6,
            }}>
              {s.label}
            </div>

            {/* Accent line */}
            <div style={{
              width: lineW, height: 4,
              background: s.labelColor,
              borderRadius: 2, marginBottom: 10,
            }} />

            {/* Title line 1 — SplitText */}
            <SplitText
              text={s.line1.text}
              startFrame={s.line1Start}
              fontSize={s.line1.size}
              fontWeight={900}
              color={s.line1.color}
              fontFamily={fontFamily}
              letterSpacing="-0.06em"
              stagger={2}
              animType={s.line1.anim}
              cfg={{ damping: 9, stiffness: 290, mass: 0.85 }}
            />

            {/* Title line 2 — SplitText */}
            <SplitText
              text={s.line2.text}
              startFrame={s.line2Start}
              fontSize={s.line2.size}
              fontWeight={900}
              color={s.line2.color}
              fontFamily={fontFamily}
              letterSpacing="-0.055em"
              stagger={2}
              animType={s.line2.anim}
              cfg={{ damping: 9, stiffness: 290, mass: 0.85 }}
            />

            {/* Tags — apareixen un per un */}
            <div style={{
              display: "flex", flexWrap: "wrap",
              gap: 10, justifyContent: "center",
              marginTop: 18,
            }}>
              {s.tags.map((tag, ti) => {
                const tagStart = s.tagsStart + ti * 10;
                const tagOp = interpolate(f, [tagStart, tagStart + 12], [0, 1], cl);
                const tagX  = interpolate(f, [tagStart, tagStart + 14], [-20, 0], cl);
                return (
                  <span key={ti} style={{
                    fontFamily, fontSize: 16, fontWeight: 800,
                    color: s.tagText,
                    background: "rgba(255,255,255,0.1)",
                    border: `1px solid rgba(255,255,255,0.25)`,
                    borderRadius: 100, padding: "6px 18px",
                    opacity: tagOp,
                    transform: `translateX(${tagX}px)`,
                    display: "inline-block",
                  }}>
                    {tag}
                  </span>
                );
              })}
            </div>
          </AbsoluteFill>
        );
      })}

    </AbsoluteFill>
  );
};
