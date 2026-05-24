import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { fontFamily, BLACK, WHITE, RED, SPRING_SNAP, cl } from "../brand";

// ─── Scene 4: The Solution — RAPID SLAM-IN BLOCKS ───────────────────────────
// 3 blocks crash in from the bottom one after another every 22 frames.
// No emojis. Hard flash on each impact. Burst particles. Bigger text.
// Shorter total duration (~240f).

const BLOCKS = [
  {
    title: "ACTIVACIONS\nFÍSIQUES",
    body: "Events i experiències\nque porten gent real.",
    bg: RED, fg: WHITE, accent: WHITE, start: 24,
  },
  {
    title: "CONNEXIÓ AMB\nCOMUNITATS",
    body: "El teu local,\npunt de trobada.",
    bg: WHITE, fg: BLACK, accent: RED, start: 52,
  },
  {
    title: "ESTRATÈGIA\nI COMUNICACIÓ",
    body: "Dissenyem, executem,\nestarem allà.",
    bg: BLACK, fg: WHITE, accent: RED, start: 80,
  },
] as const;

const BURST = Array.from({ length: 14 }, (_, i) => ({
  angle: (i / 14) * Math.PI * 2,
  r: 55 + (i % 4) * 16,
}));

export const S4Solution: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn  = interpolate(f, [0, 14], [0, 1], cl);
  const fadeOut = interpolate(f, [210, 235], [1, 0], cl);

  // Title slams in from top
  const tSp = spring({ frame: f - 6, fps, config: SPRING_SNAP, durationInFrames: 36 });
  const tY  = interpolate(tSp, [0, 1], [-110, 0]);
  const tSc = interpolate(tSp, [0, 0.65, 1], [1.45, 0.86, 1]);

  return (
    <AbsoluteFill style={{ background: BLACK, opacity: Math.min(fadeIn, fadeOut), overflow: "hidden" }}>

      {/* Diagonal grid decoration */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{
            position: "absolute", left: `${-10 + i * 22}%`, top: "-100%",
            width: 1, height: "300%",
            background: "rgba(255,255,255,0.025)",
            transform: "rotate(15deg)",
          }} />
        ))}
      </AbsoluteFill>

      <AbsoluteFill style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "0 32px", gap: 22,
      }}>

        {/* Title */}
        <div style={{ transform: `translateY(${tY}px) scale(${tSc})`, textAlign: "center" }}>
          <div style={{
            fontFamily, fontSize: 26, fontWeight: 700, color: RED,
            letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8,
          }}>
            La solució
          </div>
          <div style={{ fontFamily, fontSize: 80, fontWeight: 900, color: WHITE, letterSpacing: "-0.055em", lineHeight: 0.93 }}>
            Màrqueting que es
          </div>
          <div style={{ fontFamily, fontSize: 80, fontWeight: 900, color: RED, letterSpacing: "-0.055em", lineHeight: 0.93 }}>
            nota al carrer.
          </div>
        </div>

        {/* 3 blocks — crash in consecutively from below */}
        <div style={{ display: "flex", gap: 12, width: "100%", alignItems: "stretch" }}>
          {BLOCKS.map((b, i) => {
            const sp = spring({ frame: f - b.start, fps, config: SPRING_SNAP, durationInFrames: 36 });
            const op = interpolate(f, [b.start, b.start + 10], [0, 1], cl);

            // Crash up from bottom with overshoot
            const ty = interpolate(sp, [0, 0.55, 0.78, 1], [360, -22, 8, 0]);
            const sc = interpolate(sp, [0, 0.6, 0.82, 1], [0.65, 1.1, 0.96, 1]);

            // Hard color flash on impact
            const flashOp = interpolate(f, [b.start + 7, b.start + 9, b.start + 20], [0, 0.55, 0], cl);

            // Particle burst
            const burstP  = interpolate(f, [b.start + 6, b.start + 28], [0, 1], cl);
            const burstOp = interpolate(f, [b.start + 6, b.start + 11, b.start + 28], [0, 1, 0], cl);

            return (
              <div key={i} style={{
                flex: 1, position: "relative",
                opacity: op,
                transform: `translateY(${ty}px) scale(${sc})`,
              }}>

                {/* Flash overlay */}
                <AbsoluteFill style={{
                  background: b.bg === WHITE ? WHITE : RED,
                  opacity: flashOp, borderRadius: 10,
                  pointerEvents: "none", zIndex: 10,
                }} />

                {/* Burst dots */}
                {burstOp > 0 && BURST.map((dot, di) => (
                  <div key={di} style={{
                    position: "absolute", left: "50%", top: "50%",
                    width: 5, height: 5, borderRadius: "50%",
                    background: b.bg === WHITE ? RED : WHITE,
                    transform: `translate(${Math.cos(dot.angle) * dot.r * burstP - 2.5}px, ${Math.sin(dot.angle) * dot.r * burstP - 2.5}px)`,
                    opacity: burstOp,
                    pointerEvents: "none",
                  }} />
                ))}

                <div style={{
                  background: b.bg,
                  border: b.bg === BLACK ? `2px solid ${RED}` : "none",
                  borderRadius: 10,
                  padding: "30px 20px",
                  height: "100%",
                  boxSizing: "border-box",
                  boxShadow: b.bg === BLACK
                    ? `0 0 40px ${RED}55, 0 0 80px ${RED}22`
                    : b.bg === RED
                    ? `0 0 40px ${RED}99`
                    : "0 8px 40px rgba(0,0,0,0.6)",
                  display: "flex", flexDirection: "column", gap: 14,
                }}>
                  <div style={{
                    fontFamily, fontSize: 32, fontWeight: 900,
                    color: b.fg, letterSpacing: "-0.04em",
                    lineHeight: 1.05, whiteSpace: "pre-line",
                  }}>
                    {b.title}
                  </div>
                  <div style={{ width: 40, height: 4, background: b.accent, borderRadius: 2 }} />
                  <div style={{
                    fontFamily, fontSize: 19, fontWeight: 500,
                    color: b.bg === WHITE ? "rgba(0,0,0,0.62)" : "rgba(255,255,255,0.62)",
                    lineHeight: 1.45, whiteSpace: "pre-line",
                  }}>
                    {b.body}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
