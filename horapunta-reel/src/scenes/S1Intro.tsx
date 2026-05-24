import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { fontFamily, BLACK, WHITE, RED, SPRING_SNAP, cl } from "../brand";

// ─── Scene 1: Brand Intro — AGGRESSIVE ──────────────────────────────────────
// HORA (white) PUNTA (red) — letters crash down with squash + impact burst.
// Full RED flash when all letters land. Kinetic diagonals + pulsing halo.

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
const BURST_DOTS = Array.from({ length: 10 }, (_, i) => ({
  angle: (i / 10) * Math.PI * 2,
  r: 45 + i * 9,
}));

export const S1Intro: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Full RED flash when all letters have landed (~f 90)
  const impact = interpolate(f, [88, 90, 94, 102], [0, 1, 0.6, 0], cl);
  const bgColor = impact > 0.01
    ? `rgb(${Math.round(232 * impact)},${Math.round(28 * impact)},${Math.round(28 * impact)})`
    : BLACK;

  // Global out
  const fadeOut = interpolate(f, [175, 195], [1, 0], cl);

  // Pulsing red halo behind the letters — appears as letters land
  const haloOp  = interpolate(f, [50, 80, 102, 130], [0, 0.18, 0.12, 0], cl);
  const haloSc  = 1 + Math.sin(f * 0.08) * 0.06;

  return (
    <AbsoluteFill style={{ background: bgColor, overflow: "hidden", opacity: fadeOut }}>

      {/* Red halo glow */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at 50% 48%, rgba(232,64,28,${haloOp}) 0%, transparent 55%)`,
        transform: `scale(${haloSc})`,
        pointerEvents: "none",
      }} />

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
            if (ch === " ") return <span key={i} style={{ width: 24 }} />;

            const t0 = 8 + i * 9;
            const sp = spring({ frame: f - t0, fps, config: SPRING_SNAP, durationInFrames: 55 });
            const y = interpolate(sp, [0, 1], [-420, 0]);

            // Squash on impact
            const imp = spring({ frame: f - (t0 + 16), fps, config: { damping: 4, stiffness: 600, mass: 0.25 }, durationInFrames: 18 });
            const scaleY = 1 - imp * 0.3;

            // Per-letter mini burst
            const burstProg = interpolate(f, [t0 + 14, t0 + 28], [0, 1], cl);
            const burstOp   = interpolate(f, [t0 + 14, t0 + 18, t0 + 30], [0, 1, 0], cl);

            return (
              <div key={i} style={{ position: "relative" }}>
                {/* Burst dots */}
                {burstOp > 0 && BURST_DOTS.map((dot, di) => (
                  <div key={di} style={{
                    position: "absolute",
                    left: "50%", top: "100%",
                    width: 6, height: 6,
                    borderRadius: "50%",
                    background: di % 2 === 0 ? RED : WHITE,
                    transform: `translate(${Math.cos(dot.angle) * dot.r * burstProg - 3}px, ${Math.sin(dot.angle) * dot.r * burstProg - 3}px)`,
                    opacity: burstOp,
                    pointerEvents: "none",
                  }} />
                ))}

                <span style={{
                  fontFamily, fontSize: 210, fontWeight: 900,
                  color, letterSpacing: "-0.055em", lineHeight: 1,
                  display: "inline-block",
                  transform: `translateY(${y}px) scaleY(${scaleY})`,
                  transformOrigin: "bottom center",
                }}>
                  {ch}
                </span>
              </div>
            );
          })}
        </div>

        {/* ── Subtitle ─────────────────────────────────────────────────── */}
        <div style={{
          marginTop: 22,
          opacity: interpolate(f, [96, 118], [0, 1], cl),
          transform: `perspective(1200px) translateZ(${interpolate(f, [96, 118], [220, 0], cl)}px) skewX(${interpolate(f, [96, 118], [-4, 0], cl)}deg)`,
        }}>
          <div style={{
            fontFamily, fontSize: 38, fontWeight: 700,
            color: "rgba(255,255,255,0.6)",
            letterSpacing: "0.14em", textTransform: "uppercase", textAlign: "center",
          }}>
            Consultoria de màrqueting i comunicació
          </div>
        </div>

        {/* ── Red underline ─────────────────────────────────────────────── */}
        <div style={{
          marginTop: 24, height: 9, background: RED, borderRadius: 4,
          width: interpolate(f, [108, 162], [0, 640], cl),
          boxShadow: `0 0 24px ${RED}99`,
        }} />

        {/* ── Tagline below ────────────────────────────────────────────── */}
        <div style={{
          marginTop: 20,
          opacity: interpolate(f, [135, 155], [0, 1], cl),
          transform: `translateY(${interpolate(f, [135, 155], [22, 0], cl)}px)`,
        }}>
          <div style={{
            fontFamily, fontSize: 28, fontWeight: 800,
            color: RED, letterSpacing: "0.2em", textTransform: "uppercase",
          }}>
            No gestionem xarxes. Activem negocis.
          </div>
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
