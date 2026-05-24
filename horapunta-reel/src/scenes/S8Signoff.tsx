import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { fontFamily, BLACK, WHITE, RED, SPRING, SPRING_SNAP, cl } from "../brand";

// ─── Scene 8: Sign Off — IMPACTFUL CLOSE ────────────────────────────────────
// Big logo springs in. Tagline punches up. Heartbeat double-beat.
// White flash → cut to black.

export const S8Signoff: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(f, [0, 16], [0, 1], cl);

  // Logo spring
  const logoSp = spring({ frame: f - 14, fps, config: SPRING_SNAP, durationInFrames: 44 });
  const logoSc = interpolate(logoSp, [0, 0.7, 1], [0.3, 1.1, 1]);
  const logoOp = interpolate(f, [14, 26], [0, 1], cl);

  // Tagline punch up
  const tagSp = spring({ frame: f - 38, fps, config: SPRING, durationInFrames: 36 });
  const tagY  = interpolate(tagSp, [0, 1], [30, 0]);
  const tagOp = interpolate(f, [38, 50], [0, 1], cl);

  // Heartbeat: dub-DUB (two pulses)
  const beat1 = spring({ frame: f - 48, fps, config: { damping: 5, stiffness: 600, mass: 0.25 }, durationInFrames: 14 });
  const beat2 = spring({ frame: f - 56, fps, config: { damping: 5, stiffness: 600, mass: 0.25 }, durationInFrames: 14 });
  const dotSc  = 1 + beat1 * 0.8 + beat2 * 1.2;
  const dotGlow = (beat1 + beat2) * 0.5;

  // Final white flash → cut to black
  const flashOut = interpolate(f, [66, 68, 70, 75], [0, 1, 0.4, 0], cl);
  const cutBlack = interpolate(f, [73, 80], [0, 1], cl);

  return (
    <AbsoluteFill style={{
      background: BLACK,
      opacity: fadeIn,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 18,
    }}>

      {/* White flash */}
      <AbsoluteFill style={{ background: WHITE, opacity: flashOut, pointerEvents: "none" }} />
      {/* Cut to black */}
      <AbsoluteFill style={{ background: BLACK, opacity: cutBlack, pointerEvents: "none" }} />

      {/* Logo */}
      <div style={{ opacity: logoOp, transform: `scale(${logoSc})`, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontFamily, fontSize: 130, fontWeight: 900, color: WHITE, letterSpacing: "-0.065em", lineHeight: 0.86, textTransform: "uppercase" }}>
          HORA
        </div>
        <div style={{ width: 90, height: 6, background: RED, margin: "18px 0", borderRadius: 3, boxShadow: `0 0 20px ${RED}` }} />
        <div style={{ fontFamily, fontSize: 130, fontWeight: 900, color: RED, letterSpacing: "-0.065em", lineHeight: 0.86, textTransform: "uppercase" }}>
          PUNTA
        </div>
      </div>

      {/* Tagline */}
      <div style={{ opacity: tagOp, transform: `translateY(${tagY}px)`, textAlign: "center" }}>
        <div style={{ fontFamily, fontSize: 26, fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: "0.05em" }}>
          No gestionem xarxes. Activem negocis.
        </div>
      </div>

      {/* Heartbeat dot */}
      <div style={{
        width: 18, height: 18, borderRadius: "50%", background: RED,
        transform: `scale(${dotSc})`,
        boxShadow: `0 0 ${12 + dotGlow * 40}px ${RED}, 0 0 ${24 + dotGlow * 60}px ${RED}66`,
        opacity: interpolate(f, [46, 58], [0, 1], cl),
      }} />
    </AbsoluteFill>
  );
};
