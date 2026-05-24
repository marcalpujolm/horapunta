import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { fontFamily, BLACK, WHITE, RED, SPRING_SNAP, cl } from "../brand";
import { SplitText } from "../utils/SplitText";

// ─── Scene 4: The Solution — RAPID SLAM-IN BLOCKS ───────────────────────────
// Title "nota al carrer." via SplitText. 3 blocks crash in from bottom.
// No emojis. Hard flash on each impact. Burst particles. Bigger text.
// Duration: 240f

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

const BURST = Array.from({ length: 16 }, (_, i) => ({
  angle: (i / 16) * Math.PI * 2,
  r: 60 + (i % 4) * 18,
}));

export const S4Solution: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn  = interpolate(f, [0, 14], [0, 1], cl);
  const fadeOut = interpolate(f, [210, 235], [1, 0], cl);

  // "La solució" label + title line 1 slams in from top
  const tSp = spring({ frame: f - 6, fps, config: SPRING_SNAP, durationInFrames: 36 });
  const tY  = interpolate(tSp, [0, 1], [-110, 0]);
  const tSc = interpolate(tSp, [0, 0.65, 1], [1.4, 0.88, 1]);

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
        padding: "0 28px", gap: 20,
      }}>

        {/* ── Title section ────────────────────────────────────────────── */}
        <div style={{ transform: `translateY(${tY}px) scale(${tSc})`, textAlign: "center" }}>
          <div style={{
            fontFamily, fontSize: 24, fontWeight: 700, color: RED,
            letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8,
          }}>
            La solució
          </div>
          {/* Line 1: static big white */}
          <div style={{
            fontFamily, fontSize: 84, fontWeight: 900,
            color: WHITE, letterSpacing: "-0.055em", lineHeight: 0.93,
          }}>
            Màrqueting que es
          </div>
        </div>

        {/* Line 2: "nota al carrer." via SplitText — starts at f=14 */}
        <div style={{ marginTop: -12, textAlign: "center" }}>
          <SplitText
            text="nota al carrer."
            startFrame={14}
            fontSize={84}
            fontWeight={900}
            color={RED}
            fontFamily={fontFamily}
            letterSpacing="-0.055em"
            stagger={2}
            animType="rise"
            cfg={{ damping: 9, stiffness: 280, mass: 0.85 }}
          />
        </div>

        {/* ── 3 blocks — crash in consecutively from below ─────────────── */}
        <div style={{ display: "flex", gap: 12, width: "100%", alignItems: "stretch" }}>
          {BLOCKS.map((b, i) => {
            const sp = spring({ frame: f - b.start, fps, config: SPRING_SNAP, durationInFrames: 36 });
            const op = interpolate(f, [b.start, b.start + 10], [0, 1], cl);

            // Crash up from bottom with overshoot + 3D tilt
            const ty   = interpolate(sp, [0, 0.55, 0.78, 1], [380, -24, 8, 0]);
            const sc   = interpolate(sp, [0, 0.6, 0.82, 1], [0.62, 1.12, 0.96, 1]);
            // Cada bloc entra amb un angle 3D diferent (esquerra tilt, centre frontal, dreta tilt oposat)
            const rotY = interpolate(sp, [0, 0.65, 1], [(i - 1) * -22, (i - 1) * 4, 0]);

            // Hard color flash on impact
            const flashOp = interpolate(f, [b.start + 7, b.start + 9, b.start + 22], [0, 0.6, 0], cl);

            // Particle burst
            const burstP  = interpolate(f, [b.start + 6, b.start + 30], [0, 1], cl);
            const burstOp = interpolate(f, [b.start + 6, b.start + 11, b.start + 30], [0, 1, 0], cl);

            return (
              <div key={i} style={{
                flex: 1, position: "relative",
                opacity: op,
                transform: `perspective(900px) translateY(${ty}px) rotateY(${rotY}deg) scale(${sc})`,
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
                  padding: "28px 18px",
                  height: "100%",
                  boxSizing: "border-box",
                  boxShadow: b.bg === BLACK
                    ? `0 0 40px ${RED}55, 0 0 80px ${RED}22`
                    : b.bg === RED
                    ? `0 0 40px ${RED}99`
                    : "0 8px 40px rgba(0,0,0,0.6)",
                  display: "flex", flexDirection: "column", gap: 12,
                }}>
                  {/* Block title — bigger */}
                  <div style={{
                    fontFamily, fontSize: 44, fontWeight: 900,
                    color: b.fg, letterSpacing: "-0.04em",
                    lineHeight: 1.0, whiteSpace: "pre-line",
                  }}>
                    {b.title}
                  </div>
                  <div style={{ width: 40, height: 5, background: b.accent, borderRadius: 2 }} />
                  {/* Block body — bigger */}
                  <div style={{
                    fontFamily, fontSize: 22, fontWeight: 500,
                    color: b.bg === WHITE ? "rgba(0,0,0,0.62)" : "rgba(255,255,255,0.62)",
                    lineHeight: 1.4, whiteSpace: "pre-line",
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
