import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

/**
 * Cinematic lighting rig.
 * Scene 1 (0–130): Deep dark, single red point grows.
 * Scene 2 (110–340): Warm amber fills in (city).
 * Scene 3 (300–490): More intense warm + stronger red.
 * Scene 4 (460–540): Fades — logo handled in 2D.
 */
export const CinematicLighting: React.FC = () => {
  const f = useCurrentFrame();

  // Ambient — almost nothing at start, builds gently
  const ambient = interpolate(f, [0, 100, 300, 490, 540], [0.01, 0.04, 0.08, 0.06, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Red point light (identity — mood setter)
  const redI = interpolate(f, [0, 60, 130, 300, 400, 490, 520], [0, 0.5, 0.35, 0.4, 0.65, 0.3, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Warm directional (city reveal)
  const warmI = interpolate(f, [100, 155, 340, 390, 490, 520], [0, 0.55, 0.55, 0.75, 0.3, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Secondary fill (deep escalation)
  const fillI = interpolate(f, [300, 360, 460, 500], [0, 0.25, 0.25, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      <ambientLight color="#0A0806" intensity={ambient} />

      {/* Red identity light — behind camera, slight right */}
      <pointLight
        position={[3, 5, 7]}
        color="#FF4500"
        intensity={redI}
        distance={22}
        decay={2}
      />

      {/* Warm directional — upper left, city feel */}
      <directionalLight
        position={[-3, 6, 4]}
        color="#FFD4A0"
        intensity={warmI}
      />

      {/* Escalation fill — low, right */}
      <pointLight
        position={[4, -2, 2]}
        color="#FFB870"
        intensity={fillI}
        distance={16}
        decay={2}
      />
    </>
  );
};
