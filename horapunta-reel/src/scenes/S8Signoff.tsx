import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { fontFamily, BLACK, WHITE, RED, SPRING, cl } from "../brand";

// ─── Scene 8: Sign Off — 0-62f ──────────────────────────────────────────────
// Everything fades to just the logo. Red heartbeat dot. Cut to black.

export const S8Signoff: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(f, [0, 18], [0, 1], cl);

  // Logo spring in
  const logoSp = spring({ frame: f - 16, fps, config: SPRING, durationInFrames: 40 });
  const logoScale = 0.7 + logoSp * 0.3;
  const logoOp = interpolate(f, [16, 30], [0, 1], cl);

  // Tagline
  const tagOp = interpolate(f, [35, 50], [0, 1], cl);

  // Red dot heartbeat (2 quick pulses)
  const beat1 = spring({ frame: f - 44, fps, config: { damping: 6, stiffness: 500, mass: 0.3 }, durationInFrames: 14 });
  const beat2 = spring({ frame: f - 52, fps, config: { damping: 6, stiffness: 500, mass: 0.3 }, durationInFrames: 14 });
  const dotScale = 1 + beat1 * 0.6 + beat2 * 0.4;

  // Cut to black at very end
  const cutOut = interpolate(f, [58, 62], [1, 0], cl);

  return (
    <AbsoluteFill
      style={{
        background: BLACK,
        opacity: fadeIn * cutOut,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
      }}
    >
      {/* HORA PUNTA logo */}
      <div
        style={{
          opacity: logoOp,
          transform: `scale(${logoScale})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ fontFamily, fontSize: 112, fontWeight: 900, color: WHITE, letterSpacing: "-0.06em", lineHeight: 0.88, textTransform: "uppercase" }}>
          HORA
        </div>
        <div style={{ width: 72, height: 4, background: RED, margin: "16px 0", borderRadius: 2 }} />
        <div style={{ fontFamily, fontSize: 112, fontWeight: 900, color: RED, letterSpacing: "-0.06em", lineHeight: 0.88, textTransform: "uppercase" }}>
          PUNTA
        </div>
      </div>

      {/* Tagline */}
      <div
        style={{
          opacity: tagOp,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 24,
            fontWeight: 500,
            color: "rgba(255,255,255,0.42)",
            letterSpacing: "0.06em",
          }}
        >
          No gestionem xarxes. Activem negocis.
        </div>
      </div>

      {/* Red heartbeat dot */}
      <div
        style={{
          marginTop: 12,
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: RED,
          transform: `scale(${dotScale})`,
          boxShadow: `0 0 ${dotScale * 12}px rgba(232,64,28,0.7)`,
          opacity: interpolate(f, [44, 56], [0, 1], cl),
        }}
      />
    </AbsoluteFill>
  );
};
