import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { fontFamily, BLACK, WHITE, RED, SPRING_SNAP, cl } from "../brand";

// ─── Scene 7: CTA — MAXIMUM ENERGY ──────────────────────────────────────────
// 90 particles in 3 colors. Background flashes on text reveal.
// Huge text. Glowing button with double pulse.

const ORANGE = "#FF6B35";

// 90 deterministic particles — 3 colors
const PARTICLES = Array.from({ length: 90 }, (_, i) => {
  const angle  = (i / 90) * Math.PI * 2 + (i % 3) * 0.4;
  const radius = 60 + (i % 7) * 55;
  const color  = i % 3 === 0 ? RED : i % 3 === 1 ? WHITE : ORANGE;
  const size   = 3 + (i % 5) * 2;
  const delay  = Math.floor(i / 9) * 2;
  return { angle, radius, color, size, delay };
});

export const S7CTA: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn  = interpolate(f, [0, 12], [0, 1], cl);
  const fadeOut = interpolate(f, [162, 180], [1, 0], cl);

  // Background: flashes RED when text arrives
  const bgFlash = interpolate(f, [36, 38, 42, 52], [0, 0.35, 0.2, 0], cl);

  // Text spring
  const textSp = spring({ frame: f - 36, fps, config: SPRING_SNAP, durationInFrames: 45 });
  const textSc = interpolate(textSp, [0, 0.75, 1], [0.5, 1.08, 1]);
  const textOp = interpolate(f, [36, 48], [0, 1], cl);

  // Subtext
  const subOp = interpolate(f, [65, 80], [0, 1], cl);
  const subY  = interpolate(f, [65, 80], [18, 0], cl);

  // Button
  const btnSp = spring({ frame: f - 96, fps, config: SPRING_SNAP, durationInFrames: 38 });
  const btnSc = 0.5 + btnSp * 0.5;
  const btnOp = interpolate(f, [96, 110], [0, 1], cl);

  // Double pulse (heartbeat rhythm)
  const beat1 = Math.sin(Math.max(0, f - 118) * 0.22) * 0.05;
  const beat2 = Math.sin(Math.max(0, f - 118) * 0.44) * 0.02;
  const pulse = 1 + beat1 + beat2;
  const glowSize = 20 + Math.abs(beat1) * 80;

  return (
    <AbsoluteFill style={{ background: BLACK, opacity: Math.min(fadeIn, fadeOut), overflow: "hidden" }}>

      {/* Red background flash */}
      <AbsoluteFill style={{ background: RED, opacity: bgFlash, pointerEvents: "none" }} />

      {/* Particle burst */}
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        {PARTICLES.map((p, i) => {
          const sp = spring({ frame: f - p.delay, fps, config: { damping: 22, stiffness: 160, mass: 0.5 }, durationInFrames: 28 });
          const dist = interpolate(sp, [0, 1], [0, 1]);
          const pOp  = interpolate(f, [p.delay, p.delay + 6, 38, 55], [0, 1, 0.9, 0], cl);

          return (
            <div key={i} style={{
              position: "absolute",
              width: p.size, height: p.size,
              borderRadius: "50%",
              background: p.color,
              transform: `translate(${Math.cos(p.angle) * p.radius * dist}px, ${Math.sin(p.angle) * p.radius * dist}px)`,
              opacity: pOp,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}88`,
            }} />
          );
        })}
      </AbsoluteFill>

      {/* Main content */}
      <AbsoluteFill style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 22, padding: "0 64px",
      }}>

        {/* Hero text */}
        <div style={{ opacity: textOp, transform: `scale(${textSc})`, textAlign: "center" }}>
          <div style={{ fontFamily, fontSize: 92, fontWeight: 900, color: WHITE, letterSpacing: "-0.055em", lineHeight: 0.95 }}>
            Comença a
          </div>
          <div style={{ fontFamily, fontSize: 92, fontWeight: 900, color: RED, letterSpacing: "-0.055em", lineHeight: 0.95 }}>
            omplir taules.
          </div>
        </div>

        {/* Subtext */}
        <div style={{ opacity: subOp, transform: `translateY(${subY}px)`, textAlign: "center" }}>
          <div style={{ fontFamily, fontSize: 28, fontWeight: 600, color: "rgba(255,255,255,0.52)", letterSpacing: "0.06em" }}>
            20 minuts. Sense compromís.
          </div>
        </div>

        {/* CTA Button */}
        <div style={{ opacity: btnOp, transform: `scale(${btnSc * pulse})` }}>
          <div style={{
            fontFamily, fontSize: 22, fontWeight: 900,
            color: WHITE, background: RED,
            padding: "20px 48px", borderRadius: 6,
            letterSpacing: "0.04em", textTransform: "uppercase",
            boxShadow: `0 0 ${glowSize}px ${RED}88, 0 0 ${glowSize * 2}px ${RED}44`,
            whiteSpace: "nowrap",
          }}>
            VULL OMPLIR EL MEU LOCAL →
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
