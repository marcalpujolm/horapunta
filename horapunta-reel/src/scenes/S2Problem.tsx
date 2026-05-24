import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { fontFamily, BLACK, WHITE, RED, cl } from "../brand";
import { SplitText } from "../utils/SplitText";

// ─── Scene 2: The Problem — FULL-SCREEN PHRASE SEQUENCE ─────────────────────
// Contingut original preservat. Cada problema ocupa tota la pantalla.
// Flash cuts entre frases. SplitText per lletra. Text molt mes gran.
// Duration: 240f

// ── Text original de les 4 raons ────────────────────────────────────────────
// Cada problema es divideix en dues línies per llegibilitat a mida gran.

export const S2Problem: React.FC = () => {
  const f = useCurrentFrame();

  // ── Background: RED per títol → BLACK → RED → BLACK → RED ───────────────
  const bgPhase = f < 40 ? 0 : f < 96 ? 1 : f < 154 ? 2 : f < 200 ? 3 : 4;
  const bgColors = [RED, BLACK, RED, BLACK, RED];
  const bg = bgColors[bgPhase];

  // ── Flash cuts blancs entre frases ──────────────────────────────────────
  const flash1 = interpolate(f, [34, 36, 40, 44],   [0, 1, 1, 0], cl);
  const flash2 = interpolate(f, [92, 94, 98, 102],  [0, 1, 1, 0], cl);
  const flash3 = interpolate(f, [150,152,156,160],  [0, 1, 1, 0], cl);
  const flash4 = interpolate(f, [196,198,202,206],  [0, 1, 1, 0], cl);
  const flashOp = Math.min(1, flash1 + flash2 + flash3 + flash4);

  // ── Global fade-out ──────────────────────────────────────────────────────
  const fadeOut = interpolate(f, [225, 240], [1, 0], cl);

  // ── Visibilitat de cada frase ────────────────────────────────────────────
  const titleOp = interpolate(f, [0,  8,  28, 40],  [0, 1, 1, 0], cl);
  const p1Op    = interpolate(f, [40, 48, 84, 96],  [0, 1, 1, 0], cl);
  const p2Op    = interpolate(f, [96, 104,142,154], [0, 1, 1, 0], cl);
  const p3Op    = interpolate(f, [154,162,190,200], [0, 1, 1, 0], cl);
  const p4Op    = interpolate(f, [200,208,226,238], [0, 1, 1, 0], cl);

  // ── Línies cinètiques de fons ────────────────────────────────────────────
  const lineOffset = (f * 0.35) % 100;
  const lineColor = bgPhase % 2 === 0
    ? "rgba(0,0,0,0.06)"
    : "rgba(255,255,255,0.04)";

  return (
    <AbsoluteFill style={{ background: bg, opacity: fadeOut, overflow: "hidden" }}>

      {/* Diagonal lines animades */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} style={{
            position: "absolute",
            left: `${-20 + i * 28 + lineOffset * 0.4}%`,
            top: "-100%", width: 1, height: "300%",
            background: lineColor,
            transform: "rotate(20deg)",
          }} />
        ))}
      </AbsoluteFill>

      {/* Flash overlay */}
      <AbsoluteFill style={{ background: WHITE, opacity: flashOp, pointerEvents: "none" }} />

      {/* ══ TÍTOL: "Per què el teu local no creix." ═══════════════════════ */}
      {/* Fons RED — text WHITE + BLACK */}
      <AbsoluteFill style={{
        opacity: titleOp,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 4,
      }}>
        <SplitText
          text="Per què el teu local"
          startFrame={8}
          fontSize={88}
          fontWeight={900}
          color={WHITE}
          fontFamily={fontFamily}
          letterSpacing="-0.055em"
          stagger={2}
          animType="flip3d"
          cfg={{ damping: 9, stiffness: 300, mass: 0.8 }}
        />
        <SplitText
          text="no creix."
          startFrame={18}
          fontSize={110}
          fontWeight={900}
          color={BLACK}
          fontFamily={fontFamily}
          letterSpacing="-0.06em"
          stagger={2}
          animType="zDive"
          cfg={{ damping: 9, stiffness: 300, mass: 0.8 }}
        />
      </AbsoluteFill>

      {/* ══ PROBLEMA 1: "No serveix amb un bon servei" ════════════════════ */}
      {/* Fons BLACK — text WHITE + RED */}
      <AbsoluteFill style={{
        opacity: p1Op,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 4,
      }}>
        <div style={{
          fontFamily, fontSize: 12, fontWeight: 900, color: RED,
          letterSpacing: "0.32em", marginBottom: 16,
          opacity: interpolate(f, [44, 56], [0, 1], cl),
        }}>
          01 / 04
        </div>
        <SplitText
          text="No serveix"
          startFrame={42}
          fontSize={110}
          fontWeight={900}
          color={WHITE}
          fontFamily={fontFamily}
          letterSpacing="-0.06em"
          stagger={2}
          animType="fall"
          cfg={{ damping: 9, stiffness: 290, mass: 0.85 }}
        />
        <SplitText
          text="amb un bon servei"
          startFrame={54}
          fontSize={78}
          fontWeight={900}
          color={RED}
          fontFamily={fontFamily}
          letterSpacing="-0.045em"
          stagger={2}
          animType="rise"
          cfg={{ damping: 9, stiffness: 290, mass: 0.85 }}
        />
      </AbsoluteFill>

      {/* ══ PROBLEMA 2: "El local buit també comunica" ════════════════════ */}
      {/* Fons RED — text BLACK + WHITE */}
      <AbsoluteFill style={{
        opacity: p2Op,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 4,
      }}>
        <div style={{
          fontFamily, fontSize: 12, fontWeight: 900, color: BLACK,
          letterSpacing: "0.32em", marginBottom: 16,
          opacity: interpolate(f, [100, 112], [0, 1], cl),
        }}>
          02 / 04
        </div>
        <SplitText
          text="El local buit"
          startFrame={98}
          fontSize={105}
          fontWeight={900}
          color={BLACK}
          fontFamily={fontFamily}
          letterSpacing="-0.06em"
          stagger={2}
          animType="flip3d"
          cfg={{ damping: 8, stiffness: 280, mass: 0.9 }}
        />
        <SplitText
          text="també comunica"
          startFrame={110}
          fontSize={85}
          fontWeight={900}
          color={WHITE}
          fontFamily={fontFamily}
          letterSpacing="-0.05em"
          stagger={2}
          animType="spinY"
          cfg={{ damping: 9, stiffness: 280, mass: 0.9 }}
        />
      </AbsoluteFill>

      {/* ══ PROBLEMA 3: "No connectes amb cap comunitat" ══════════════════ */}
      {/* Fons BLACK — text WHITE + RED */}
      <AbsoluteFill style={{
        opacity: p3Op,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 4,
      }}>
        <div style={{
          fontFamily, fontSize: 12, fontWeight: 900, color: RED,
          letterSpacing: "0.32em", marginBottom: 16,
          opacity: interpolate(f, [158, 170], [0, 1], cl),
        }}>
          03 / 04
        </div>
        <SplitText
          text="No connectes"
          startFrame={156}
          fontSize={108}
          fontWeight={900}
          color={WHITE}
          fontFamily={fontFamily}
          letterSpacing="-0.06em"
          stagger={2}
          animType="left"
          cfg={{ damping: 9, stiffness: 280, mass: 0.8 }}
        />
        <SplitText
          text="amb cap comunitat"
          startFrame={168}
          fontSize={76}
          fontWeight={900}
          color={RED}
          fontFamily={fontFamily}
          letterSpacing="-0.045em"
          stagger={2}
          animType="right"
          cfg={{ damping: 9, stiffness: 280, mass: 0.8 }}
        />
      </AbsoluteFill>

      {/* ══ PROBLEMA 4: "No tens temps per fer coses diferents" ═══════════ */}
      {/* Fons RED — text BLACK */}
      <AbsoluteFill style={{
        opacity: p4Op,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 4,
      }}>
        <div style={{
          fontFamily, fontSize: 12, fontWeight: 900, color: BLACK,
          letterSpacing: "0.32em", marginBottom: 16,
          opacity: interpolate(f, [204, 216], [0, 1], cl),
        }}>
          04 / 04
        </div>
        <SplitText
          text="No tens temps"
          startFrame={202}
          fontSize={105}
          fontWeight={900}
          color={BLACK}
          fontFamily={fontFamily}
          letterSpacing="-0.06em"
          stagger={2}
          animType="zDive"
          cfg={{ damping: 8, stiffness: 260, mass: 1.0 }}
        />
        <SplitText
          text="per fer coses"
          startFrame={213}
          fontSize={78}
          fontWeight={900}
          color={WHITE}
          fontFamily={fontFamily}
          letterSpacing="-0.045em"
          stagger={2}
          animType="bounce"
          cfg={{ damping: 8, stiffness: 280, mass: 0.9 }}
        />
        <SplitText
          text="diferents"
          startFrame={224}
          fontSize={118}
          fontWeight={900}
          color={BLACK}
          fontFamily={fontFamily}
          letterSpacing="-0.07em"
          stagger={2}
          animType="fall"
          cfg={{ damping: 8, stiffness: 300, mass: 0.85 }}
        />
      </AbsoluteFill>

    </AbsoluteFill>
  );
};
