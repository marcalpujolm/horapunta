import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { fontFamily, BLACK, WHITE, RED, SPRING_SOFT, cl } from "../brand";
import { SplitText } from "../utils/SplitText";

// ─── Scene 3: Quote Impact — KINETIC FULL-SCREEN (contingut original) ────────
// Cita original preservada: "La gent va a llocs per experiències i pertinença
// — no per un Reel ben editat."
// SplitText per lletra, text molt mes gran. Background glow. Flash final.
// Duration: 130f

export const S3Quote: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn  = interpolate(f, [0, 10], [0, 1], cl);

  // Pulsing red background glow
  const bgGlow = interpolate(f, [30, 55, 82], [0, 0.22, 0.06], cl);

  // Opening quote mark spring-in
  const quoteSp = spring({ frame: f - 2, fps, config: SPRING_SOFT, durationInFrames: 28 });
  const quoteOp = interpolate(f, [2, 14], [0, 1], cl);

  // Separator line
  const sepW = interpolate(f, [52, 72], [0, 300], cl);

  // Hard WHITE flash → cut al final
  const flashOut = interpolate(f, [112, 115, 120, 125], [0, 1, 0.5, 1], cl);

  return (
    <AbsoluteFill style={{ background: BLACK, opacity: fadeIn }}>

      {/* Red glow background */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at 50% 55%, rgba(232,64,28,${bgGlow}) 0%, transparent 68%)`,
        pointerEvents: "none",
      }} />

      {/* Hard cut flash */}
      <AbsoluteFill style={{ background: WHITE, opacity: flashOut, pointerEvents: "none" }} />

      <AbsoluteFill style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "0 52px", gap: 0,
      }}>

        {/* ── Cometes obertes ── */}
        <div style={{
          fontFamily, fontSize: 140, fontWeight: 900, color: RED,
          lineHeight: 1, alignSelf: "flex-start", marginBottom: -22,
          opacity: quoteOp,
          transform: `scale(${interpolate(quoteSp, [0, 0.65, 1], [0.4, 1.12, 1])}) translateY(${interpolate(quoteSp, [0, 1], [30, 0])}px)`,
          transformOrigin: "left bottom",
        }}>
          "
        </div>

        {/* ── Línia 1: "La gent va a llocs" ── */}
        {/* Contingut original — "La gent va a llocs" en blanc, gran */}
        <SplitText
          text="La gent va a llocs"
          startFrame={8}
          fontSize={90}
          fontWeight={900}
          color={WHITE}
          fontFamily={fontFamily}
          letterSpacing="-0.055em"
          stagger={2}
          animType="fall"
          cfg={{ damping: 9, stiffness: 290, mass: 0.85 }}
        />

        {/* ── Línia 2: "per experiències i pertinença" ── */}
        <SplitText
          text="per experiències i pertinença"
          startFrame={22}
          fontSize={80}
          fontWeight={900}
          color={RED}
          fontFamily={fontFamily}
          letterSpacing="-0.05em"
          stagger={1}
          animType="rise"
          cfg={{ damping: 9, stiffness: 290, mass: 0.85 }}
        />

        {/* ── Separador ── */}
        <div style={{
          width: sepW, height: 5, background: RED,
          borderRadius: 2, margin: "18px 0",
          boxShadow: `0 0 14px ${RED}88`,
        }} />

        {/* ── Línia 3: "— no per un Reel ben editat." ── */}
        {/* Contingut original — cita completa preservada */}
        <SplitText
          text="— no per un Reel ben editat."
          startFrame={68}
          fontSize={64}
          fontWeight={800}
          color={"rgba(255,255,255,0.55)"}
          fontFamily={fontFamily}
          letterSpacing="-0.03em"
          stagger={1}
          animType="left"
          cfg={{ damping: 10, stiffness: 240, mass: 1.0 }}
        />

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
