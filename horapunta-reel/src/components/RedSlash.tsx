import React from "react";
import * as THREE from "three";
import { useCurrentFrame, interpolate } from "remotion";
import { cin, easeOut } from "../utils/easing";

/**
 * Diagonal red accent plane — the brand color arrives in scene 3.
 * A razor-thin slash that sweeps through the composition.
 * Very subtle: identity, not dominance.
 */
export const RedSlash: React.FC = () => {
  const f = useCurrentFrame();

  // ─── Appearance window: scene 3 only ────────────────────────────────────
  const opacity = interpolate(
    f,
    [308, 348, 435, 465],
    [0, 0.18, 0.14, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  if (opacity < 0.001) return null;

  // ─── Sweep: enters from left ─────────────────────────────────────────────
  const x = interpolate(f, [308, 420], [-6, 3], {
    easing: cin,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ─── A secondary thinner slash, offset ───────────────────────────────────
  const x2 = interpolate(f, [340, 445], [-6, 3], {
    easing: easeOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const angle = -Math.PI / 7; // ~26° diagonal

  return (
    <group>
      {/* Primary slash */}
      <mesh position={[x, 0, 2.5]} rotation={[0, 0, angle]}>
        <planeGeometry args={[0.045, 28]} />
        <meshBasicMaterial
          color="#FF4500"
          transparent
          opacity={opacity}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Echo slash — thinner, slightly offset */}
      <mesh position={[x2 + 0.4, 0.6, 2.2]} rotation={[0, 0, angle]}>
        <planeGeometry args={[0.018, 22]} />
        <meshBasicMaterial
          color="#FF4500"
          transparent
          opacity={opacity * 0.45}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};
