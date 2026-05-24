import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { fontFamily, BLACK, WHITE, RED, SPRING_SNAP, cl } from "../brand";
import { SplitText } from "../utils/SplitText";

// ─── Scene 7: CTA — MAXIMUM ENERGY ──────────────────────────────────────────
// 90 particles burst. Hero text via SplitText (huge). Glowing button.
// Double heartbeat pulse. Background red flash on impact.

const ORANGE = "#FF6B35";

// 90 deterministic particles — 3 colors
const PARTICLES = Array.from({ length: 90 }, (_, i) => {
  const angle  = (i / 90) * Math.PI * 2 + (i % 3) * 0.4;
  const radius = 70 + (i % 7) * 60;
  const color  = i % 3 === 0 ? RED : i % 3 === 1 ? WHITE : ORANGE;
  const size   = 3 + (i % 5) * 2.5;
  const delay  = Math.floor(i / 9) * 2;
  return { angle, radius, color, size, delay };
});

export const S7CTA: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn  = interpolate(f, [0, 12], [0, 1], cl);
  const fadeOut = interpolate(f, [162, 180], [1, 0], cl);

  // Background: flashes RED when text arrives
  const bgFlash = interpolate(f, [30, 32, 38, 52], [0, 0.4, 0.22, 0], cl);

  // Secondary RED flash when "potenciar" line starts
  const bgFlash2 = interpolate(f, [47, 49, 55, 68], [0, 0.25, 0.12, 0], cl);

  // Subtext
  const subOp = interpolate(f, [78, 92], [0, 1], cl);
  const subY  = interpolate(f, [78, 92], [20, 0], cl);

  // Button
  const btnSp = spring({ frame: f - 108, fps, config: SPRING_SNAP, durationInFrames: 38 });
  const btnSc = 0.5 + btnSp * 0.5;
  const btnOp = interpolate(f, [108, 122], [0, 1], cl);

  // Double pulse (heartbeat rhythm)
  const beat1 = Math.sin(Math.max(0, f - 130) * 0.22) * 0.05;
  const beat2 = Math.sin(Math.max(0, f - 130) * 0.44) * 0.02;
  const pulse = 1 + beat1 + beat2;
  const glowSize = 24 + Math.abs(beat1) * 100;

  return (
    <AbsoluteFill style={{ background: BLACK, opacity: Math.min(fadeIn, fadeOut), overflow: "hidden" }}>

      {/* Red background flash */}
      <AbsoluteFill style={{ background: RED, opacity: Math.min(1, bgFlash + bgFlash2), pointerEvents: "none" }} />

      {/* Particle burst */}
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        {PARTICLES.map((p, i) => {
          const sp = spring({ frame: f - p.delay, fps, config: { damping: 20, stiffness: 180, mass: 0.4 }, durationInFrames: 26 });
          const dist = interpolate(sp, [0, 1], [0, 1]);
          const pOp  = interpolate(f, [p.delay, p.delay + 6, 40, 58], [0, 1, 0.9, 0], cl);

          return (
            <div key={i} style={{
              position: "absolute",
              width: p.size, height: p.size,
              borderRadius: "50%",
              background: p.color,
              transform: `translate(${Math.cos(p.angle) * p.radius * dist}px, ${Math.sin(p.angle) * p.radius * dist}px)`,
              opacity: pOp,
              boxShadow: `0 0 ${p.size * 2.5}px ${p.color}99`,
            }} />
          );
        })}
      </AbsoluteFill>

      {/* Main content */}
      <AbsoluteFill style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 20, padding: "0 40px",
      }}>

        {/* ── Hero text via SplitText ── */}
        <div style={{ textAlign: "center" }}>
          <SplitText
            text="Comença a"
            startFrame={32}
            fontSize={120}
            fontWeight={900}
            color={WHITE}
            fontFamily={fontFamily}
            letterSpacing="-0.06em"
            stagger={2}
            animType="fall"
            cfg={{ damping: 9, stiffness: 300, mass: 0.8 }}
          />
          <SplitText
            text="potenciar el local."
            startFrame={48}
            fontSize={96}
            fontWeight={900}
            color={RED}
            fontFamily={fontFamily}
            letterSpacing="-0.055em"
            stagger={2}
            animType="rise"
            cfg={{ damping: 9, stiffness: 300, mass: 0.8 }}
          />
        </div>

        {/* Subtext */}
        <div style={{ opacity: subOp, transform: `translateY(${subY}px)`, textAlign: "center" }}>
          <div style={{
            fontFamily, fontSize: 30, fontWeight: 600,
            color: "rgba(255,255,255,0.50)",
            letterSpacing: "0.06em",
          }}>
            20 minuts. Sense compromís.
          </div>
        </div>

        {/* CTA Button */}
        <div style={{ opacity: btnOp, transform: `scale(${btnSc * pulse})` }}>
          <div style={{
            fontFamily, fontSize: 22, fontWeight: 900,
            color: WHITE, background: RED,
            padding: "22px 52px", borderRadius: 6,
            letterSpacing: "0.04em", textTransform: "uppercase",
            boxShadow: `0 0 ${glowSize}px ${RED}99, 0 0 ${glowSize * 2}px ${RED}44`,
            whiteSpace: "nowrap",
          }}>
            VULL OMPLIR EL MEU LOCAL →
          </div>
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
