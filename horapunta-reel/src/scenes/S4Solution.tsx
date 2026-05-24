import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { fontFamily, BLACK, WHITE, RED, SPRING, SPRING_SNAP, cl } from "../brand";

// ─── Scene 4: The Solution — 3 DISTINCT COLOR BLOCKS ────────────────────────
// Block 1: RED bg / white text — slides from left
// Block 2: WHITE bg / black text — drops from top
// Block 3: BLACK bg / red border glow — slides from right
// Each block has its own burst of particles on arrival.

const BLOCKS = [
  { icon: "⚡", title: "ACTIVACIONS\nFÍSIQUES", body: "Events i experiències\nque porten gent real.", bg: RED, fg: WHITE, accent: WHITE, dir: "left" as const, start: 50 },
  { icon: "🔗", title: "CONNEXIÓ AMB\nCOMUNITATS",  body: "El teu local,\npunt de trobada.", bg: WHITE, fg: BLACK, accent: RED, dir: "top"  as const, start: 82 },
  { icon: "🧠", title: "ESTRATÈGIA\nI EXECUCIÓ",  body: "Dissenyem, executem,\nestarem allà.", bg: BLACK, fg: WHITE, accent: RED, dir: "right" as const, start: 114 },
] as const;

// Particles for block arrival
const BLOCK_DOTS = Array.from({ length: 10 }, (_, i) => ({
  angle: (i / 10) * Math.PI * 2,
  r: 50 + i * 12,
}));

export const S4Solution: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn  = interpolate(f, [0, 18], [0, 1], cl);
  const fadeOut = interpolate(f, [348, 370], [1, 0], cl);

  // Title punch-in
  const tSp = spring({ frame: f - 12, fps, config: SPRING_SNAP, durationInFrames: 42 });
  const tY  = interpolate(tSp, [0, 1], [-80, 0]);
  const tSc = interpolate(tSp, [0, 0.75, 1], [1.4, 0.9, 1]);

  return (
    <AbsoluteFill style={{ background: BLACK, opacity: Math.min(fadeIn, fadeOut), overflow: "hidden" }}>

      {/* Diagonal grid decoration */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {[0,1,2,3,4,5].map(i => (
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
        padding: "0 48px", gap: 28,
      }}>

        {/* Title */}
        <div style={{ transform: `translateY(${tY}px) scale(${tSc})`, textAlign: "center" }}>
          <div style={{ fontFamily, fontSize: 28, fontWeight: 700, color: RED, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 6 }}>
            La solució
          </div>
          <div style={{ fontFamily, fontSize: 74, fontWeight: 900, color: WHITE, letterSpacing: "-0.05em", lineHeight: 0.95 }}>
            Màrqueting que es
          </div>
          <div style={{ fontFamily, fontSize: 74, fontWeight: 900, color: RED, letterSpacing: "-0.05em", lineHeight: 0.95 }}>
            nota al carrer.
          </div>
        </div>

        {/* 3 blocks */}
        <div style={{ display: "flex", gap: 14, width: "100%", alignItems: "stretch" }}>
          {BLOCKS.map((b, i) => {
            const sp = spring({ frame: f - b.start, fps, config: SPRING, durationInFrames: 52 });
            const op = interpolate(f, [b.start, b.start + 16], [0, 1], cl);

            const tx = b.dir === "left"  ? interpolate(sp, [0, 1], [-220, 0])
                     : b.dir === "right" ? interpolate(sp, [0, 1], [220,  0]) : 0;
            const ty = b.dir === "top"   ? interpolate(sp, [0, 1], [-180, 0]) : 0;
            const sc = interpolate(sp, [0, 0.8, 1], [0.85, 1.05, 1]);

            // Arrival particles
            const burstOp = interpolate(f, [b.start + 10, b.start + 14, b.start + 28], [0, 1, 0], cl);
            const burstP  = interpolate(f, [b.start + 10, b.start + 28], [0, 1], cl);

            // Idle float
            const floatY = Math.sin((f - b.start) * 0.036 + i * 2.2) * 5;

            return (
              <div key={i} style={{
                flex: 1, position: "relative",
                opacity: op,
                transform: `translate(${tx}px, ${ty + floatY}px) scale(${sc})`,
              }}>
                {/* Arrival burst */}
                {burstOp > 0 && BLOCK_DOTS.map((dot, di) => (
                  <div key={di} style={{
                    position: "absolute", left: "50%", top: "50%",
                    width: 5, height: 5, borderRadius: "50%",
                    background: b.bg === RED ? WHITE : RED,
                    transform: `translate(${Math.cos(dot.angle) * dot.r * burstP - 2.5}px, ${Math.sin(dot.angle) * dot.r * burstP - 2.5}px)`,
                    opacity: burstOp,
                    pointerEvents: "none",
                  }} />
                ))}

                <div style={{
                  background: b.bg,
                  border: b.bg === BLACK ? `2px solid ${RED}` : "none",
                  borderRadius: 8,
                  padding: "26px 20px",
                  height: "100%",
                  boxSizing: "border-box",
                  boxShadow: b.bg === BLACK ? `0 0 28px ${RED}44` : b.bg === RED ? `0 0 28px ${RED}88` : "0 6px 32px rgba(0,0,0,0.5)",
                  display: "flex", flexDirection: "column", gap: 12,
                }}>
                  <div style={{ fontSize: 44 }}>{b.icon}</div>
                  <div style={{
                    fontFamily, fontSize: 26, fontWeight: 900,
                    color: b.fg, letterSpacing: "-0.03em",
                    lineHeight: 1.1, whiteSpace: "pre-line",
                  }}>{b.title}</div>
                  <div style={{ width: 32, height: 3, background: b.accent, borderRadius: 2 }} />
                  <div style={{
                    fontFamily, fontSize: 18, fontWeight: 500,
                    color: b.bg === WHITE ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.6)",
                    lineHeight: 1.4, whiteSpace: "pre-line",
                  }}>{b.body}</div>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
