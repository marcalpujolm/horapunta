import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { fontFamily, BLACK, WHITE, RED, SPRING_SOFT, cl } from "../brand";
import { SplitText } from "../utils/SplitText";

// ─── Scene 3: Quote Impact — KINETIC FULL-SCREEN ────────────────────────────
// Synthesized quote displayed in massive SplitText bursts.
// Background glow pulses red. Ends with hard white flash → cut.
// Duration: 130f

export const S3Quote: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn  = interpolate(f, [0, 10], [0, 1], cl);

  // Pulsing red background glow builds up mid-scene
  const bgGlow = interpolate(f, [30, 55, 80], [0, 0.22, 0.05], cl);

  // Opening quote mark spring-in
  const quoteSp = spring({ frame: f - 2, fps, config: SPRING_SOFT, durationInFrames: 28 });
  const quoteOp = interpolate(f, [2, 14], [0, 1], cl);

  // Separator line grows at f=48
  const sepW = interpolate(f, [48, 68], [0, 320], cl);

  // Hard WHITE flash → cut at the end
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
        padding: "0 56px", gap: 0,
      }}>

        {/* ── Opening quote mark ── */}
        <div style={{
          fontFamily, fontSize: 140, fontWeight: 900, color: RED,
          lineHeight: 1, alignSelf: "flex-start", marginBottom: -24,
          opacity: quoteOp,
          transform: `scale(${interpolate(quoteSp, [0, 0.6, 1], [0.4, 1.15, 1])}) translateY(${interpolate(quoteSp, [0, 1], [30, 0])}px)`,
          transformOrigin: "left bottom",
        }}>
          "
        </div>

        {/* ── Main line 1: BIG WHITE ── */}
        <SplitText
          text="EXPERIÈNCIES"
          startFrame={10}
          fontSize={118}
          fontWeight={900}
          color={WHITE}
          fontFamily={fontFamily}
          letterSpacing="-0.06em"
          stagger={2}
          animType="fall"
          cfg={{ damping: 9, stiffness: 290, mass: 0.85 }}
        />

        {/* ── Main line 2: BIG RED ── */}
        <SplitText
          text="I PERTINENÇA."
          startFrame={24}
          fontSize={96}
          fontWeight={900}
          color={RED}
          fontFamily={fontFamily}
          letterSpacing="-0.05em"
          stagger={2}
          animType="rise"
          cfg={{ damping: 9, stiffness: 290, mass: 0.85 }}
        />

        {/* ── Separator ── */}
        <div style={{
          width: sepW, height: 5, background: RED,
          borderRadius: 2, margin: "18px 0",
          boxShadow: `0 0 14px ${RED}88`,
        }} />

        {/* ── Counter-line: smaller, punchy sub-quote ── */}
        <SplitText
          text="— no un Reel ben editat."
          startFrame={60}
          fontSize={62}
          fontWeight={800}
          color={"rgba(255,255,255,0.52)"}
          fontFamily={fontFamily}
          letterSpacing="-0.03em"
          stagger={2}
          animType="left"
          cfg={{ damping: 10, stiffness: 240, mass: 1.0 }}
        />

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
