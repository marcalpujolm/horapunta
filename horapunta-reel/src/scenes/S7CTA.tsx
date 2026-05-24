import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { fontFamily, BLACK, WHITE, RED, SPRING, SPRING_SNAP, cl } from "../brand";

// ─── Scene 7: CTA — 0-180f ──────────────────────────────────────────────────
// Particle burst from center. Text assembles. Red button pulses.

// Particle data: deterministic positions
const PARTICLES = Array.from({ length: 48 }, (_, i) => {
  const angle = (i / 48) * Math.PI * 2;
  const radius = 80 + (i % 5) * 60;
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
    size: 3 + (i % 4) * 2,
    delay: Math.floor(i / 6) * 2,
  };
});

export const S7CTA: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn  = interpolate(f, [0, 14], [0, 1], cl);
  const fadeOut = interpolate(f, [162, 180], [1, 0], cl);
  const opacity = Math.min(fadeIn, fadeOut);

  // Main text spring
  const textSp = spring({ frame: f - 38, fps, config: SPRING, durationInFrames: 50 });
  const textY  = interpolate(textSp, [0, 1], [50, 0]);
  const textOp = interpolate(f, [38, 55], [0, 1], cl);

  // Subtext
  const subOp = interpolate(f, [68, 86], [0, 1], cl);
  const subY  = interpolate(f, [68, 86], [20, 0], cl);

  // Button
  const btnSp = spring({ frame: f - 98, fps, config: SPRING_SNAP, durationInFrames: 40 });
  const btnScale = 0.6 + btnSp * 0.4;
  const btnOp = interpolate(f, [98, 112], [0, 1], cl);

  // Button pulse (after it appears)
  const pulsePhase = Math.max(0, f - 120);
  const pulse = 1 + Math.sin(pulsePhase * 0.18) * 0.04;

  return (
    <AbsoluteFill style={{ background: BLACK, opacity }}>
      {/* Particle burst */}
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        {PARTICLES.map((p, i) => {
          const particleSp = spring({
            frame: f - p.delay,
            fps,
            config: { damping: 20, stiffness: 140, mass: 0.6 },
            durationInFrames: 30,
          });
          const dist = interpolate(particleSp, [0, 1], [0, 1]);
          const particleOp = interpolate(f, [p.delay, p.delay + 8, 35, 55], [0, 1, 0.8, 0], cl);

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                width: p.size,
                height: p.size,
                borderRadius: "50%",
                background: i % 3 === 0 ? RED : WHITE,
                transform: `translate(${p.x * dist}px, ${p.y * dist}px)`,
                opacity: particleOp,
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* Main content */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          padding: "0 72px",
        }}
      >
        {/* Hero text */}
        <div
          style={{
            opacity: textOp,
            transform: `translateY(${textY}px)`,
            textAlign: "center",
          }}
        >
          <div style={{ fontFamily, fontSize: 76, fontWeight: 900, color: WHITE, letterSpacing: "-0.05em", lineHeight: 1.0 }}>
            Comença a
          </div>
          <div style={{ fontFamily, fontSize: 76, fontWeight: 900, color: RED, letterSpacing: "-0.05em", lineHeight: 1.0 }}>
            omplir taules.
          </div>
        </div>

        {/* Subtext */}
        <div
          style={{
            opacity: subOp,
            transform: `translateY(${subY}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily,
              fontSize: 26,
              fontWeight: 500,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.06em",
            }}
          >
            20 minuts. Sense compromís.
          </div>
        </div>

        {/* CTA Button */}
        <div
          style={{
            opacity: btnOp,
            transform: `scale(${btnScale * pulse})`,
          }}
        >
          <div
            style={{
              fontFamily,
              fontSize: 22,
              fontWeight: 900,
              color: WHITE,
              background: RED,
              padding: "18px 44px",
              borderRadius: 6,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              boxShadow: `0 0 ${20 + pulse * 8}px rgba(232,64,28,0.5)`,
            }}
          >
            VULL OMPLIR EL MEU LOCAL →
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
