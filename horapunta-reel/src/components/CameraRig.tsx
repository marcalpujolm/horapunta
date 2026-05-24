import React from "react";
import { useThree } from "@react-three/fiber";
import { useCurrentFrame, interpolate } from "remotion";
import { cin } from "../utils/easing";

/**
 * Organic camera movement — slow cinematic push-in + subtle sinusoidal drift.
 * Uses useThree to imperatively modify the ThreeCanvas default camera.
 * Never robotic. Always alive.
 */

const CameraInner: React.FC = () => {
  const { camera } = useThree();
  const f = useCurrentFrame();

  // Main push-in: z = 10 → 3.5 over full 18s
  const z = interpolate(f, [0, 540], [10.0, 3.5], {
    easing: cin,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Organic lateral drift (sinusoidal)
  const x = Math.sin(f * 0.009) * 0.28 + Math.cos(f * 0.013) * 0.1;

  // Vertical breath
  const y = Math.sin(f * 0.007 + 1.4) * 0.13 + Math.cos(f * 0.011) * 0.055;

  // Pitch: very slight downward build
  const rotX = interpolate(f, [0, 300, 540], [0.01, -0.02, -0.04], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Yaw: slow pan
  const rotY = Math.sin(f * 0.007 + 0.8) * 0.025;

  // Subtle roll
  const rotZ =
    interpolate(f, [0, 540], [0.007, -0.005], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) + Math.sin(f * 0.006) * 0.005;

  // Apply imperatively to the existing camera
  camera.position.set(x, y, z);
  camera.rotation.set(rotX, rotY, rotZ);

  // Set FOV if it's a perspective camera
  if ("fov" in camera) {
    (camera as any).fov = 60;
    (camera as any).updateProjectionMatrix();
  }

  return null;
};

export const CameraRig: React.FC = () => <CameraInner />;
