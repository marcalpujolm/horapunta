import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { fontFamily, BLACK, WHITE, RED, cl } from "../brand";
import { SplitText } from "../utils/SplitText";

// ─── Scene 2: The Problem — FULL-SCREEN PHRASE SEQUENCE ─────────────────────
// 4 massive statements, one at a time. Alternating BLACK / RED bg.
// WHITE flash cuts between phrases. Per-letter spring animations via SplitText.
// Duration: 240f

export const S2Problem: React.FC = () => {
  const f = useCurrentFrame();

  // ── Background phase ──────────────────────────────────────────────────────
  const bgPhase = f < 58 ? 0 : f < 114 ? 1 : f < 172 ? 2 : 3;
  const bg = bgPhase % 2 === 0 ? BLACK : RED;

  // ── Flash cuts between phrases ────────────────────────────────────────────
  const flash1 = interpolate(f, [54, 56, 60, 64],   [0, 1, 1, 0], cl);
  const flash2 = interpolate(f, [110, 112, 116, 120],[0, 1, 1, 0], cl);
  const flash3 = interpolate(f, [168, 170, 174, 178],[0, 1, 1, 0], cl);
  const flashOp = Math.min(1, flash1 + flash2 + flash3);

  // ── Global fade-out ───────────────────────────────────────────────────────
  const fadeOut = interpolate(f, [225, 240], [1, 0], cl);

  // ── Phrase visibility ─────────────────────────────────────────────────────
  const p1Op = interpolate(f, [0,  8,  46, 58],  [0, 1, 1, 0], cl);
  const p2Op = interpolate(f, [58, 66, 102, 114],[0, 1, 1, 0], cl);
  const p3Op = interpolate(f, [114,122,158, 172],[0, 1, 1, 0], cl);
  const p4Op = interpolate(f, [172,180,220, 235],[0, 1, 1, 0], cl);

  // ── Kinetic diagonal lines ────────────────────────────────────────────────
  const lineOffset = (f * 0.35) % 100;

  const lineColor = bgPhase % 2 === 0
    ? "rgba(255,255,255,0.04)"
    : "rgba(0,0,0,0.07)";

  return (
    <AbsoluteFill style={{ background: bg, opacity: fadeOut, overflow: "hidden" }}>

      {/* Kinetic diagonal lines */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} style={{
            position: "absolute",
            left: `${-20 + i * 28 + lineOffset * 0.5}%`,
            top: "-100%", width: 1, height: "300%",
            background: lineColor,
            transform: "rotate(20deg)",
          }} />
        ))}
      </AbsoluteFill>

      {/* White flash overlay */}
      <AbsoluteFill style={{ background: WHITE, opacity: flashOp, pointerEvents: "none" }} />

      {/* ══ PHRASE 1: "BON SERVEI ≠ PROU." ══════════════════════════════════ */}
      {/* BLACK bg → WHITE text + RED accent */}
      <AbsoluteFill style={{
        opacity: p1Op,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 4,
      }}>
        <div style={{
          fontFamily, fontSize: 13, fontWeight: 900,
          color: RED, letterSpacing: "0.35em", marginBottom: 18,
          opacity: interpolate(f, [4, 16], [0, 1], cl),
        }}>
          01 / 04
        </div>
        <SplitText
          text="BON SERVEI"
          startFrame={10}
          fontSize={130}
          fontWeight={900}
          color={WHITE}
          fontFamily={fontFamily}
          letterSpacing="-0.06em"
          stagger={2}
          animType="fall"
          cfg={{ damping: 9, stiffness: 300, mass: 0.8 }}
        />
        <SplitText
          text="≠ PROU."
          startFrame={20}
          fontSize={155}
          fontWeight={900}
          color={RED}
          fontFamily={fontFamily}
          letterSpacing="-0.06em"
          stagger={2}
          animType="rise"
          cfg={{ damping: 9, stiffness: 300, mass: 0.8 }}
        />
      </AbsoluteFill>

      {/* ══ PHRASE 2: "EL BUIT COMUNICA." ═══════════════════════════════════ */}
      {/* RED bg → BLACK text + WHITE accent */}
      <AbsoluteFill style={{
        opacity: p2Op,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 4,
      }}>
        <div style={{
          fontFamily, fontSize: 13, fontWeight: 900,
          color: BLACK, letterSpacing: "0.35em", marginBottom: 18,
          opacity: interpolate(f, [62, 74], [0, 1], cl),
        }}>
          02 / 04
        </div>
        <SplitText
          text="EL BUIT"
          startFrame={62}
          fontSize={185}
          fontWeight={900}
          color={BLACK}
          fontFamily={fontFamily}
          letterSpacing="-0.08em"
          stagger={3}
          animType="scale"
          cfg={{ damping: 8, stiffness: 280, mass: 0.9 }}
        />
        <SplitText
          text="COMUNICA."
          startFrame={75}
          fontSize={108}
          fontWeight={900}
          color={WHITE}
          fontFamily={fontFamily}
          letterSpacing="-0.05em"
          stagger={2}
          animType="spinY"
          cfg={{ damping: 9, stiffness: 260, mass: 0.9 }}
        />
      </AbsoluteFill>

      {/* ══ PHRASE 3: "SENSE COMUNITAT." ════════════════════════════════════ */}
      {/* BLACK bg → WHITE + RED */}
      <AbsoluteFill style={{
        opacity: p3Op,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 4,
      }}>
        <div style={{
          fontFamily, fontSize: 13, fontWeight: 900,
          color: RED, letterSpacing: "0.35em", marginBottom: 18,
          opacity: interpolate(f, [118, 130], [0, 1], cl),
        }}>
          03 / 04
        </div>
        <SplitText
          text="SENSE"
          startFrame={118}
          fontSize={195}
          fontWeight={900}
          color={WHITE}
          fontFamily={fontFamily}
          letterSpacing="-0.08em"
          stagger={3}
          animType="left"
          cfg={{ damping: 9, stiffness: 280, mass: 0.8 }}
        />
        <SplitText
          text="COMUNITAT."
          startFrame={130}
          fontSize={100}
          fontWeight={900}
          color={RED}
          fontFamily={fontFamily}
          letterSpacing="-0.05em"
          stagger={2}
          animType="right"
          cfg={{ damping: 9, stiffness: 280, mass: 0.8 }}
        />
      </AbsoluteFill>

      {/* ══ PHRASE 4: "PERDS TEMPS." ════════════════════════════════════════ */}
      {/* RED bg → BLACK text (strong contrast) */}
      <AbsoluteFill style={{
        opacity: p4Op,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 4,
      }}>
        <div style={{
          fontFamily, fontSize: 13, fontWeight: 900,
          color: BLACK, letterSpacing: "0.35em", marginBottom: 18,
          opacity: interpolate(f, [176, 188], [0, 1], cl),
        }}>
          04 / 04
        </div>
        <SplitText
          text="PERDS"
          startFrame={176}
          fontSize={205}
          fontWeight={900}
          color={BLACK}
          fontFamily={fontFamily}
          letterSpacing="-0.09em"
          stagger={3}
          animType="chaos"
          cfg={{ damping: 8, stiffness: 260, mass: 1.0 }}
        />
        <SplitText
          text="TEMPS."
          startFrame={192}
          fontSize={130}
          fontWeight={900}
          color={BLACK}
          fontFamily={fontFamily}
          letterSpacing="-0.06em"
          stagger={3}
          animType="bounce"
          cfg={{ damping: 8, stiffness: 280, mass: 0.9 }}
        />
      </AbsoluteFill>

    </AbsoluteFill>
  );
};
