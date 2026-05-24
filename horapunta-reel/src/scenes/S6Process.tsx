import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { fontFamily, BLACK, WHITE, RED, SPRING, cl } from "../brand";

// ─── Scene 6: The Process — DRAMATIC STEPS ──────────────────────────────────
// Alternating RED / WHITE step bubbles. Large number rolls up.
// Timeline tilted 3D. Each step bursts in with a color flash.

const STEPS = [
  { num: 1, title: "DIAGNOSI",    sub: "Setmana 1",   bg: RED,   fg: WHITE },
  { num: 2, title: "PLA D'ACCIÓ", sub: "Setmana 2",   bg: WHITE, fg: BLACK },
  { num: 3, title: "EXECUCIÓ",    sub: "Setmana 3–6", bg: RED,   fg: WHITE },
  { num: 4, title: "ITERACIÓ",    sub: "Mes 2+",      bg: WHITE, fg: BLACK },
] as const;

export const S6Process: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn  = interpolate(f, [0, 18], [0, 1], cl);
  const fadeOut = interpolate(f, [276, 300], [1, 0], cl);

  const tiltSp = spring({ frame: f - 4, fps, config: { damping: 16, stiffness: 80, mass: 1.2 }, durationInFrames: 60 });
  const tiltX  = interpolate(tiltSp, [0, 1], [40, 14]);

  const starts = [28, 76, 124, 172];

  const lineProgress = (from: number, to: number) =>
    interpolate(f, [from + 22, to], [0, 1], cl);

  const lines = [
    lineProgress(starts[0], starts[1]),
    lineProgress(starts[1], starts[2]),
    lineProgress(starts[2], starts[3]),
  ];

  return (
    <AbsoluteFill style={{ background: BLACK, opacity: Math.min(fadeIn, fadeOut), overflow: "hidden" }}>

      {/* Horizontal lines decoration */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {[20, 40, 60, 80].map((pct, i) => (
          <div key={i} style={{
            position: "absolute", left: 0, right: 0,
            top: `${pct}%`, height: 1,
            background: "rgba(255,255,255,0.03)",
          }} />
        ))}
      </AbsoluteFill>

      {/* Heading */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", paddingTop: 110 }}>
        <div style={{
          fontFamily, fontSize: 24, fontWeight: 800, color: RED,
          letterSpacing: "0.18em", textTransform: "uppercase",
          opacity: interpolate(f, [6, 24], [0, 1], cl),
          transform: `translateY(${interpolate(f, [6, 24], [-20, 0], cl)}px)`,
        }}>
          Com treballem
        </div>
      </AbsoluteFill>

      {/* 3D tilted timeline */}
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0 52px" }}>
        <div style={{
          transform: `perspective(1400px) rotateX(${tiltX}deg)`,
          width: "100%",
          display: "flex", alignItems: "flex-start",
          justifyContent: "space-between", gap: 8,
        }}>
          {STEPS.map((step, i) => {
            const sp = spring({ frame: f - starts[i], fps, config: SPRING, durationInFrames: 42 });
            const op = interpolate(f, [starts[i], starts[i] + 16], [0, 1], cl);
            const sc = interpolate(sp, [0, 0.7, 1], [0, 1.12, 1]);
            const numVal = interpolate(f, [starts[i], starts[i] + 28], [0, step.num], cl);

            // Flash on arrival
            const flashOp = interpolate(f, [starts[i], starts[i] + 2, starts[i] + 8], [0, 1, 0], cl);

            return (
              <div key={i} style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                flex: 1, position: "relative", opacity: op,
              }}>
                {/* Flash */}
                <AbsoluteFill style={{
                  background: step.bg === RED ? RED : WHITE,
                  opacity: flashOp * 0.3, borderRadius: 12,
                  pointerEvents: "none",
                }} />

                {/* Connecting line */}
                {i < 3 && (
                  <div style={{
                    position: "absolute", top: 36, left: "50%",
                    width: `${lines[i] * 100}%`, height: 3,
                    background: RED, zIndex: 0,
                    boxShadow: `0 0 8px ${RED}88`,
                  }} />
                )}

                {/* Number bubble */}
                <div style={{
                  width: 72, height: 72, borderRadius: "50%",
                  background: step.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  zIndex: 1, marginBottom: 16,
                  transform: `scale(${sc})`,
                  boxShadow: step.bg === RED
                    ? `0 0 24px ${RED}88, 0 0 48px ${RED}44`
                    : "0 4px 20px rgba(0,0,0,0.5)",
                }}>
                  <span style={{ fontFamily, fontSize: 26, fontWeight: 900, color: step.fg }}>
                    {`0${Math.round(numVal)}`}
                  </span>
                </div>

                {/* Step title */}
                <div style={{ fontFamily, fontSize: 20, fontWeight: 900, color: WHITE, letterSpacing: "-0.03em", textAlign: "center", lineHeight: 1.1 }}>
                  {step.title}
                </div>
                <div style={{ fontFamily, fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.42)", marginTop: 6, letterSpacing: "0.06em", textAlign: "center" }}>
                  {step.sub}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
