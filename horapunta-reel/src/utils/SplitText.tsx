import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { cl } from "../brand";

// ─── SplitText — anima cada lletra individualment ────────────────────────────
// animType: "fall" | "rise" | "scale" | "spinY" | "left" | "right" | "bounce" | "chaos"

export type AnimType = "fall" | "rise" | "scale" | "spinY" | "left" | "right" | "bounce" | "chaos" | "flip3d" | "zDive";

interface SplitTextProps {
  text: string;
  startFrame: number;
  stagger?: number;       // frames entre cada lletra
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  fontFamily?: string;
  letterSpacing?: string;
  lineHeight?: number;
  animType?: AnimType;
  cfg?: { damping: number; stiffness: number; mass: number };
}

export const SplitText: React.FC<SplitTextProps> = ({
  text,
  startFrame,
  stagger = 3,
  fontSize = 100,
  fontWeight = 900,
  color = "#FFFFFF",
  fontFamily,
  letterSpacing = "-0.05em",
  lineHeight = 1,
  animType = "fall",
  cfg = { damping: 8, stiffness: 280, mass: 0.9 },
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chars = text.split("");

  return (
    <div style={{ display: "flex", flexWrap: "nowrap", justifyContent: "center", alignItems: "baseline" }}>
      {chars.map((ch, i) => {
        if (ch === " ") {
          return <span key={i} style={{ display: "inline-block", width: fontSize * 0.22 }} />;
        }

        const t0  = startFrame + i * stagger;
        const sp  = spring({ frame: f - t0, fps, config: cfg, durationInFrames: 52 });
        const op  = interpolate(f, [t0, t0 + 7], [0, 1], cl);
        const alt = i % 2 === 0 ? 1 : -1;

        let transform = "none";
        switch (animType) {
          case "fall": {
            const y   = interpolate(sp, [0, 1], [-180, 0]);
            const rot = interpolate(sp, [0, 0.5, 1], [alt * 18, alt * -4, 0]);
            transform = `translateY(${y}px) rotate(${rot}deg)`;
            break;
          }
          case "rise": {
            const y   = interpolate(sp, [0, 1], [180, 0]);
            const rot = interpolate(sp, [0, 0.5, 1], [alt * -12, alt * 3, 0]);
            transform = `translateY(${y}px) rotate(${rot}deg)`;
            break;
          }
          case "scale": {
            const sc  = interpolate(sp, [0, 0.6, 1], [0, 1.3, 1]);
            const rot = interpolate(sp, [0, 0.5, 1], [alt * 35, 0, 0]);
            transform = `scale(${sc}) rotate(${rot}deg)`;
            break;
          }
          case "spinY": {
            const rotY = interpolate(sp, [0, 1], [90, 0]);
            const sc   = interpolate(sp, [0, 0.7, 1], [0.5, 1.1, 1]);
            transform = `perspective(600px) rotateY(${rotY}deg) scale(${sc})`;
            break;
          }
          case "left": {
            const x  = interpolate(sp, [0, 0.7, 1], [-400, 14, 0]);
            const sc = interpolate(sp, [0, 0.7, 1], [0.6, 1.06, 1]);
            transform = `translateX(${x}px) scale(${sc})`;
            break;
          }
          case "right": {
            const x  = interpolate(sp, [0, 0.7, 1], [400, -14, 0]);
            const sc = interpolate(sp, [0, 0.7, 1], [0.6, 1.06, 1]);
            transform = `translateX(${x}px) scale(${sc})`;
            break;
          }
          case "bounce": {
            const sc = interpolate(sp, [0, 0.45, 0.7, 0.88, 1], [0, 1.4, 0.82, 1.12, 1]);
            transform = `scale(${sc})`;
            break;
          }
          case "chaos": {
            const y   = interpolate(sp, [0, 1], [(i % 3 - 1) * 220, 0]);
            const x   = interpolate(sp, [0, 1], [(i % 2 === 0 ? 1 : -1) * 140, 0]);
            const rot = interpolate(sp, [0, 0.5, 1], [alt * 45, alt * -8, 0]);
            const sc  = interpolate(sp, [0, 0.65, 1], [0, 1.15, 1]);
            transform = `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${sc})`;
            break;
          }
          case "flip3d": {
            // Backflip des de -90deg rotateX en perspectiva 3D
            const rotX = interpolate(sp, [0, 1], [-90, 0]);
            const sc   = interpolate(sp, [0, 0.7, 1], [0.7, 1.12, 1]);
            transform = `perspective(500px) rotateX(${rotX}deg) scale(${sc})`;
            break;
          }
          case "zDive": {
            // Entra des de lluny (Z negatiu gran) cap a la càmera, amb un petit gir
            const z   = interpolate(sp, [0, 1], [-600, 0]);
            const sc  = interpolate(sp, [0, 1], [0.1, 1]);
            const rot = interpolate(sp, [0, 0.5, 1], [alt * 20, alt * -3, 0]);
            transform = `perspective(700px) translateZ(${z}px) scale(${sc}) rotate(${rot}deg)`;
            break;
          }
        }

        return (
          <span key={i} style={{
            fontFamily,
            fontSize,
            fontWeight,
            color,
            letterSpacing,
            lineHeight,
            display: "inline-block",
            transform,
            opacity: op,
            transformOrigin: "bottom center",
          }}>
            {ch}
          </span>
        );
      })}
    </div>
  );
};
