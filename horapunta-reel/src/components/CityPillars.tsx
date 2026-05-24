import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { cin, easeOut } from "../utils/easing";

// ─── Pillar layout ──────────────────────────────────────────────────────────
// Designed for 60° vFOV, 9:16 aspect (≈33° hFOV), camera z=10→3.5
// Front row: dramatic, close. Middle: context. Back: depth suggestion.
const PILLARS = [
  // Front — x ∈ [-2, 2], z ∈ [0, -1]
  { x: -2.1, z:  0.2, h: 17, w: 0.095, lum: 0.90, emI: 0.14 },
  { x: -1.3, z: -0.6, h: 14, w: 0.075, lum: 0.78, emI: 0.09 },
  { x: -0.4, z:  0.1, h: 19, w: 0.105, lum: 0.95, emI: 0.16 },
  { x:  0.5, z: -0.4, h: 15, w: 0.085, lum: 0.82, emI: 0.11 },
  { x:  1.4, z:  0.3, h: 17, w: 0.090, lum: 0.88, emI: 0.13 },
  { x:  2.2, z: -0.2, h: 13, w: 0.070, lum: 0.72, emI: 0.08 },
  // Middle — z ∈ [-2, -4]
  { x: -2.3, z: -2.8, h: 14, w: 0.075, lum: 0.68, emI: 0.07 },
  { x: -1.0, z: -2.2, h: 16, w: 0.080, lum: 0.74, emI: 0.09 },
  { x:  0.2, z: -3.4, h: 13, w: 0.070, lum: 0.60, emI: 0.06 },
  { x:  1.5, z: -2.6, h: 15, w: 0.078, lum: 0.71, emI: 0.08 },
  { x:  2.4, z: -3.0, h: 12, w: 0.065, lum: 0.58, emI: 0.06 },
  // Back — z ∈ [-5, -8] (depth atmosphere)
  { x: -1.8, z: -5.5, h: 11, w: 0.060, lum: 0.44, emI: 0.04 },
  { x:  0.0, z: -6.2, h: 13, w: 0.062, lum: 0.40, emI: 0.04 },
  { x:  1.8, z: -5.0, h: 10, w: 0.058, lum: 0.42, emI: 0.04 },
  { x: -0.8, z: -7.8, h:  9, w: 0.055, lum: 0.32, emI: 0.03 },
  { x:  1.0, z: -7.2, h: 11, w: 0.057, lum: 0.35, emI: 0.03 },
] as const;

/**
 * Abstract city architecture.
 * Thin cream/ivory pillars at varying depths — urban skyline abstracted.
 * Each pillar emerges from below with staggered timing (cinematic entrance).
 */
export const CityPillars: React.FC = () => {
  const f = useCurrentFrame();

  // Overall scene opacity: appears at scene 2, fades before logo
  const groupOp = interpolate(
    f,
    [105, 148, 435, 478],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Escalation tilt phase
  const escalPhase = interpolate(f, [305, 375], [0, 1], {
    easing: easeOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <group>
      {PILLARS.map((p, i) => {
        // Staggered entrance from below (scene 2 build)
        const t0 = 108 + i * 5;
        const entryOp = interpolate(f, [t0, t0 + 28], [0, 1], {
          easing: cin,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const entryY = interpolate(f, [t0, t0 + 35], [-2.5, 0], {
          easing: cin,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        // Subtle sway in escalation — alternating direction
        const swayDir = i % 2 === 0 ? 1 : -1;
        const sway = escalPhase * 0.018 * swayDir * (1 - Math.abs(p.x) / 3);

        // Color: cream → slightly warmer for depth
        const lum = Math.round(p.lum * 244);
        const color = `rgb(${lum}, ${Math.round(lum * 0.94)}, ${Math.round(lum * 0.85)})`;

        return (
          <mesh
            key={i}
            position={[p.x, entryY, p.z]}
            rotation={[0, 0, sway]}
          >
            <boxGeometry args={[p.w, p.h, p.w]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={p.emI}
              roughness={0.7}
              metalness={0.1}
              transparent
              opacity={entryOp * groupOp}
            />
          </mesh>
        );
      })}
    </group>
  );
};
