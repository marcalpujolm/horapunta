import React from "react";
import { PerspectiveCamera } from "@react-three/drei";
import { useCurrentFrame, interpolate } from "remotion";
import { cin } from "../utils/easing";

/**
 * Organic camera movement — slow drift, cinematic push-in.
 * Never robotic. Always alive.
 *
 * fov=60 gives 60° vertical FOV → ~33° horizontal at 9:16.
 * For 1080×1920 this creates a telephoto feel, elegant.
 */
export const CameraRig: React.FC = () => {
  const f = useCurrentFrame();

  // ─── Main push-in: z = 10 → 3.5 over full duration ──────────────────────
  const z = interpolate(f, [0, 540], [10.0, 3.5], {
    easing: cin,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ─── Organic lateral drift: sinusoidal, very subtle ───────────────────────
  const x = Math.sin(f * 0.009) * 0.28 + Math.cos(f * 0.013) * 0.12;

  // ─── Vertical breath: inhale / exhale ─────────────────────────────────────
  const y = Math.sin(f * 0.007 + 1.4) * 0.14 + Math.cos(f * 0.011) * 0.06;

  // ─── Subtle roll (cinematic tilt) ─────────────────────────────────────────
  const rollBase = interpolate(f, [0, 540], [0.008, -0.005], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rollLive = Math.sin(f * 0.006) * 0.006;
  const rotZ = rollBase + rollLive;

  // ─── Pitch: very slight downward angle building ───────────────────────────
  const rotX = interpolate(f, [0, 300, 540], [0.01, -0.02, -0.04], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ─── Yaw: slow pan ────────────────────────────────────────────────────────
  const rotY = Math.sin(f * 0.007 + 0.8) * 0.03;

  return (
    <PerspectiveCamera
      makeDefault
      fov={60}
      near={0.05}
      far={120}
      position={[x, y, z]}
      rotation={[rotX, rotY, rotZ]}
    />
  );
};
