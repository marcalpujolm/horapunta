import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { fontFamily, BLACK, WHITE, RED, SPRING_SNAP, cl } from "../brand";

// ─── Scene 1: Brand Intro — AGGRESSIVE ──────────────────────────────────────
// HORA (white) PUNTA (red) — letters crash down with squash + impact burst
// Full RED flash when all letters land. Background diagonal decoration.

const CHARS = [
  { ch: "H", color: WHITE },
  { ch: "O", color: WHITE },
  { ch: "R", color: WHITE },
  { ch: "A", color: WHITE },
  { ch: " ", color: WHITE },
  { ch: "P", color: RED },
  { ch: "U", color: RED },
  { ch: "N", color: RED },
  { ch: "T", color: RED },
  { ch: "A", color: RED },
];

// Mini burst particles per letter
const BURST_DOTS = Array.from({ length: 8 }, (_, i) => ({
  angle: (i / 8) * Math.PI * 2,
  r: 40 + i * 8,
}));

export const S1Intro: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Full RED flash when all letters have landed (~f 90)
  const impact = interpolate(f, [88, 90, 93, 100], [0, 1, 0.6, 0], cl);
  const bgColor = impact > 0.01
    ? `rgb(${Math.round(232 * impact)},${Math.round(28 * impact)},${Math.round(28 * impact)})`
    : BLACK;

  // Global out
  const fadeOut = interpolate(f, [175, 195], [1, 0], cl);

  return (
    <AbsoluteFill style={{ background: bgColor, overflow: "hidden", opacity: fadeOut }}>

      {/* Diagonal decoration lines */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} style={{
            position: "absolute",
            left: `${-20 + i * 28}%`,
            top: "-100%",
            width: 1,
            height: "300%",
            background: "rgba(255,255,255,0.04)",
            transform: "rotate(20deg)",
          }} />
        ))}
      </AbsoluteFill>

      <AbsoluteFill style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>

        {/* ── Letters ─────────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", position: "relative" }}>
          {CHARS.map(({ ch, color }, i) => {
            if (ch === " ") return <span key={i} style={{ width: 20 }} />;

            const t0 = 8 + i * 9;
            const sp = spring({ frame: f - t0, fps, config: SPRING_SNAP, durationInFrames: 55 });
            const y = interpolate(sp, [0, 1], [-380, 0]);

            // Squash on impact
            const imp = spring({ frame: f - (t0 + 16), fps, config: { damping: 4, stiffness: 600, mass: 0.25 }, durationInFrames: 18 });
            const scaleY = 1 - imp * 0.28;

            // Per-letter mini burst
            const burstProg = interpolate(f, [t0 + 14, t0 + 26], [0, 1], cl);
            const burstOp = interpolate(f, [t0 + 14, t0 + 18, t0 + 28], [0, 1, 0], cl);

            return (
              <div key={i} style={{ position: "relative" }}>
                {/* Burst dots */}
                {burstOp > 0 && BURST_DOTS.map((dot, di) => (
                  <div key={di} style={{
                    position: "absolute",
                    left: "50%", top: "100%",
                    width: 5, height: 5,
                    borderRadius: "50%",
                    background: di % 2 === 0 ? RED : WHITE,
                    transform: `translate(${Math.cos(dot.angle) * dot.r * burstProg - 2.5}px, ${Math.sin(dot.angle) * dot.r * burstProg - 2.5}px)`,
                    opacity: burstOp,
                    pointerEvents: "none",
                  }} />
                ))}

                <span style={{
                  fontFamily, fontSize: 178, fontWeight: 900,
                  color, letterSpacing: "-0.05em", lineHeight: 1,
                  display: "inline-block",
                  transform: `translateY(${y}px) scaleY(${scaleY})`,
                  transformOrigin: "bottom center",
                }} >
                  {ch}
                </span>
              </div>
            );
          })}
        </div>

        {/* ── Subtitle ─────────────────────────────────────────────────── */}
        <div style={{
          marginTop: 20,
          opacity: interpolate(f, [96, 118], [0, 1], cl),
          transform: `perspective(1200px) translateZ(${interpolate(f, [96, 118], [220, 0], cl)}px) skewX(${interpolate(f, [96, 118], [-4, 0], cl)}deg)`,
        }}>
          <div style={{
            fontFamily, fontSize: 34, fontWeight: 700,
            color: "rgba(255,255,255,0.6)",
            letterSpacing: "0.14em", textTransform: "uppercase", textAlign: "center",
          }}>
            Consultoria de màrqueting físic
          </div>
        </div>

        {/* ── Red underline ─────────────────────────────────────────────── */}
        <div style={{
          marginTop: 22, height: 7, background: RED, borderRadius: 3,
          width: interpolate(f, [108, 162], [0, 560], cl),
          boxShadow: `0 0 20px ${RED}88`,
        }} />

        {/* ── Tagline below ────────────────────────────────────────────── */}
        <div style={{
          marginTop: 18,
          opacity: interpolate(f, [135, 155], [0, 1], cl),
          transform: `translateY(${interpolate(f, [135, 155], [20, 0], cl)}px)`,
        }}>
          <div style={{
            fontFamily, fontSize: 22, fontWeight: 800,
            color: RED, letterSpacing: "0.2em", textTransform: "uppercase",
          }}>
            No gestionem xarxes. Activem negocis.
          </div>
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
