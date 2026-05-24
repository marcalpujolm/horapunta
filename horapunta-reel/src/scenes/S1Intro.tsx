import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { fontFamily, BLACK, WHITE, RED, SPRING_SNAP, cl } from "../brand";

// ─── Scene 1: Brand Intro — 0-195f ──────────────────────────────────────────
// "HORA PUNTA" letters crash down one by one with spring physics.
// Subtitle rises from depth. Red underline draws itself.

const CHARS = ["H","O","R","A"," ","P","U","N","T","A"];

export const S1Intro: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Global fade out at end
  const fadeOut = interpolate(f, [175, 195], [1, 0], cl);

  return (
    <AbsoluteFill
      style={{
        background: BLACK,
        overflow: "hidden",
        opacity: fadeOut,
      }}
    >
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* ── Letter drop ─────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          {CHARS.map((ch, i) => {
            if (ch === " ") return <span key={i} style={{ width: 32 }} />;

            const t0 = 10 + i * 8;
            const sp = spring({ frame: f - t0, fps, config: SPRING_SNAP, durationInFrames: 50 });
            const y = interpolate(sp, [0, 1], [-340, 0]);

            // Squash-and-stretch on impact
            const impact = spring({ frame: f - (t0 + 15), fps, config: { damping: 5, stiffness: 500, mass: 0.3 }, durationInFrames: 22 });
            const scaleY = 1 - impact * 0.24;

            return (
              <span
                key={i}
                style={{
                  fontFamily,
                  fontSize: 148,
                  fontWeight: 900,
                  color: WHITE,
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                  display: "inline-block",
                  transform: `translateY(${y}px) scaleY(${scaleY})`,
                  transformOrigin: "bottom center",
                  userSelect: "none",
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>

        {/* ── Subtitle from z-depth ───────────────────────────────────── */}
        <div
          style={{
            marginTop: 28,
            opacity:    interpolate(f, [88, 112], [0, 1], cl),
            transform: `perspective(1400px) translateZ(${interpolate(f, [88, 112], [260, 0], cl)}px)`,
          }}
        >
          <div
            style={{
              fontFamily,
              fontSize: 30,
              fontWeight: 600,
              color: "rgba(255,255,255,0.52)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            Consultoria de màrqueting físic
          </div>
        </div>

        {/* ── Red underline ───────────────────────────────────────────── */}
        <div
          style={{
            marginTop: 22,
            height: 5,
            background: RED,
            borderRadius: 3,
            width: interpolate(f, [105, 162], [0, 520], cl),
          }}
        />
      </AbsoluteFill>

      {/* Subtle scan-line grain */}
      <AbsoluteFill
        style={{
          background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 4px)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
