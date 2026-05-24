import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { fontFamily, BLACK, WHITE, RED, SPRING_SNAP, cl } from "../brand";

// ─── Scene 6: The Process — VERTICAL SLAM SEQUENCE ──────────────────────────
// 4 full-width rows slam in alternating left / right every 28 frames.
// Giant ghost numbers. Bold titles. Fast and aggressive.

const STEPS = [
  { num: 1, title: "DIAGNOSI",    sub: "Setmana 1",   bg: RED,   fg: WHITE, dir: "left"  as const },
  { num: 2, title: "PLA D'ACCIÓ", sub: "Setmana 2",   bg: WHITE, fg: BLACK, dir: "right" as const },
  { num: 3, title: "EXECUCIÓ",    sub: "Setmana 3–6", bg: RED,   fg: WHITE, dir: "left"  as const },
  { num: 4, title: "ITERACIÓ\nI ESCALA",    sub: "Mes 2+",      bg: WHITE, fg: BLACK, dir: "right" as const },
] as const;

export const S6Process: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn  = interpolate(f, [0, 14], [0, 1], cl);
  const fadeOut = interpolate(f, [276, 300], [1, 0], cl);

  // Heading slams down
  const hSp = spring({ frame: f - 4, fps, config: SPRING_SNAP, durationInFrames: 32 });
  const hY  = interpolate(hSp, [0, 1], [-80, 0]);
  const hSc = interpolate(hSp, [0, 0.7, 1], [1.3, 0.9, 1]);

  const starts = [20, 52, 84, 116]; // every 32 frames — fast and punchy

  return (
    <AbsoluteFill style={{ background: BLACK, opacity: Math.min(fadeIn, fadeOut), overflow: "hidden" }}>

      <AbsoluteFill style={{
        display: "flex", flexDirection: "column",
        justifyContent: "center",
        padding: "0", gap: 0,
      }}>

        {/* Heading */}
        <div style={{
          transform: `translateY(${hY}px) scale(${hSc})`,
          textAlign: "center",
          paddingBottom: 18, paddingTop: 10,
        }}>
          <div style={{
            fontFamily, fontSize: 20, fontWeight: 900,
            color: RED, letterSpacing: "0.25em", textTransform: "uppercase",
          }}>
            Com treballem
          </div>
          <div style={{
            width: 56, height: 5, background: RED,
            margin: "10px auto 0", borderRadius: 3,
            boxShadow: `0 0 18px ${RED}`,
          }} />
        </div>

        {/* Steps — full-width rows */}
        {STEPS.map((step, i) => {
          const sp = spring({ frame: f - starts[i], fps, config: SPRING_SNAP, durationInFrames: 38 });
          const op = interpolate(f, [starts[i], starts[i] + 10], [0, 1], cl);

          // Slam from left or right with overshoot
          const tx = interpolate(sp, [0, 0.6, 0.82, 1],
            step.dir === "left"
              ? [-600, 24, -8, 0]
              : [600, -24, 8, 0]
          );
          const sc = interpolate(sp, [0, 0.65, 1], [0.9, 1.05, 1]);

          // Hard flash on impact
          const flashOp = interpolate(f, [starts[i] + 6, starts[i] + 8, starts[i] + 20], [0, 0.6, 0], cl);

          // Number count-up
          const numVal = Math.round(interpolate(f, [starts[i], starts[i] + 16], [0, step.num], cl));

          return (
            <div key={i} style={{
              position: "relative",
              opacity: op,
              transform: `translateX(${tx}px) scale(${sc})`,
              overflow: "hidden",
            }}>

              {/* Impact flash */}
              <div style={{
                position: "absolute", inset: 0,
                background: step.bg === RED ? RED : WHITE,
                opacity: flashOp, pointerEvents: "none", zIndex: 5,
              }} />

              <div style={{
                background: step.bg,
                display: "flex", alignItems: "center",
                padding: "20px 44px", gap: 0,
                boxShadow: step.bg === RED
                  ? `0 0 50px ${RED}55, inset 0 -5px 0 rgba(0,0,0,0.25)`
                  : `0 8px 36px rgba(0,0,0,0.55)`,
                position: "relative", overflow: "hidden",
              }}>

                {/* Ghost number — big background accent */}
                <div style={{
                  fontFamily, fontSize: 140, fontWeight: 900,
                  color: step.fg, lineHeight: 1,
                  opacity: 0.09, minWidth: 130,
                  letterSpacing: "-0.06em", textAlign: "center",
                  userSelect: "none",
                }}>
                  {`0${numVal > 0 ? numVal : 0}`}
                </div>

                {/* Vertical separator */}
                <div style={{
                  width: 3, height: 90,
                  background: step.fg === WHITE ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)",
                  borderRadius: 2, marginRight: 36,
                }} />

                {/* Text block */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily, fontSize: 52, fontWeight: 900,
                    color: step.fg, letterSpacing: "-0.045em", lineHeight: 1,
                  }}>
                    {step.title}
                  </div>
                  <div style={{
                    fontFamily, fontSize: 22, fontWeight: 600,
                    color: step.fg === WHITE
                      ? "rgba(255,255,255,0.5)"
                      : "rgba(0,0,0,0.4)",
                    marginTop: 8, letterSpacing: "0.08em", textTransform: "uppercase",
                  }}>
                    {step.sub}
                  </div>
                </div>

                {/* RED accent bar on the right edge */}
                {step.bg !== RED && (
                  <div style={{
                    position: "absolute", right: 0, top: 0, bottom: 0,
                    width: 6, background: RED,
                    boxShadow: `0 0 20px ${RED}88`,
                    opacity: interpolate(f, [starts[i] + 20, starts[i] + 36], [0, 1], cl),
                  }} />
                )}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
