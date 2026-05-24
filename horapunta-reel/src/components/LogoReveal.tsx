import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring } from "remotion";
import { cin } from "../utils/easing";

const FPS = 30;
const RED = "#FF4500";
const CREAM = "#F4EFE6";

interface LogoRevealProps {
  startFrame: number;
  fontFamily: string;
}

/**
 * Final logo reveal — clean black, 2D.
 * HORA springs in → separator bar grows → PUNTA slides up → URL fades.
 * Timing feels like an Apple product reveal.
 */
export const LogoReveal: React.FC<LogoRevealProps> = ({
  startFrame,
  fontFamily,
}) => {
  const f = useCurrentFrame();
  const lf = f - startFrame; // local frame

  // Black background fills in
  const bgOp = interpolate(f, [startFrame - 12, startFrame + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (bgOp <= 0) return null;

  // ─── HORA: spring entrance ─────────────────────────────────────────────
  const horaSpring = spring({
    frame: lf - 8,
    fps: FPS,
    config: { damping: 14, stiffness: 120, mass: 1.1 },
    durationInFrames: 50,
  });
  const horaOp = interpolate(lf, [8, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Scale from 0.55 → 1 via spring
  const horaScale = 0.55 + horaSpring * 0.45;

  // ─── Separator bar grows left → right ─────────────────────────────────
  const barW = interpolate(lf, [32, 52], [0, 88], {
    easing: cin,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ─── PUNTA: slides up + fades ─────────────────────────────────────────
  const puntaOp = interpolate(lf, [44, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const puntaY = interpolate(lf, [44, 64], [28, 0], {
    easing: cin,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ─── URL fades ────────────────────────────────────────────────────────
  const urlOp = interpolate(lf, [62, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ─── Subtle whole-logo scale-in ───────────────────────────────────────
  const wrapScale = interpolate(lf, [0, 80], [0.96, 1.0], {
    easing: cin,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `rgba(10,10,10,${bgOp})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `scale(${wrapScale})`,
        }}
      >
        {/* HORA */}
        <div
          style={{
            fontFamily,
            fontSize: 136,
            fontWeight: 900,
            color: CREAM,
            letterSpacing: "-0.065em",
            textTransform: "uppercase",
            lineHeight: 0.86,
            opacity: horaOp,
            transform: `scale(${horaScale})`,
            transformOrigin: "center bottom",
          }}
        >
          HORA
        </div>

        {/* Separator bar */}
        <div
          style={{
            width: barW,
            height: 5,
            background: RED,
            margin: "24px 0",
            borderRadius: 2,
          }}
        />

        {/* PUNTA */}
        <div
          style={{
            fontFamily,
            fontSize: 136,
            fontWeight: 900,
            color: RED,
            letterSpacing: "-0.065em",
            textTransform: "uppercase",
            lineHeight: 0.86,
            opacity: puntaOp,
            transform: `translateY(${puntaY}px)`,
          }}
        >
          PUNTA
        </div>

        {/* URL */}
        <div
          style={{
            fontFamily,
            fontSize: 24,
            fontWeight: 400,
            color: "rgba(244,239,230,0.28)",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            marginTop: 38,
            opacity: urlOp,
          }}
        >
          eshorapunta.com
        </div>
      </div>
    </AbsoluteFill>
  );
};
