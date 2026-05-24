import React, { useState } from "react";
import * as THREE from "three";
import { useCurrentFrame, interpolate } from "remotion";

const COUNT = 480;
const RANGE_X = 5.5;
const RANGE_Y = 24;
const RANGE_Z = 6;

/** Pre-compute base positions (golden-ratio spread — no clustering) */
const BASE = (() => {
  const pos = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    const t = i * 2.399963; // golden angle
    pos[i * 3]     = (Math.sin(t * 7.3) * 0.5 + Math.cos(t * 2.1) * 0.5) * RANGE_X;
    pos[i * 3 + 1] = (i / COUNT) * RANGE_Y - RANGE_Y / 2;
    pos[i * 3 + 2] = (Math.sin(t * 3.7) * 0.5 + Math.cos(t * 5.9) * 0.5) * RANGE_Z - 3;
  }
  return pos;
})();

/**
 * Atmospheric particle field.
 * Cream dust drifting slowly upward — two seamless layers for infinite loop.
 * Opacity controlled by scene timeline.
 */
export const ParticleField: React.FC = () => {
  const frame = useCurrentFrame();

  // Create Three.js objects ONCE (useState initializer fires once on mount)
  const [{ geo1, geo2, mat1, mat2, pts1, pts2 }] = useState(() => {
    const geo1 = new THREE.BufferGeometry();
    const geo2 = new THREE.BufferGeometry();
    const pos1 = BASE.slice();
    const pos2 = BASE.slice();
    // Offset layer 2 by half the Y range
    for (let i = 0; i < COUNT; i++) pos2[i * 3 + 1] -= RANGE_Y / 2;

    geo1.setAttribute("position", new THREE.BufferAttribute(pos1, 3));
    geo2.setAttribute("position", new THREE.BufferAttribute(pos2, 3));

    const makeMat = () =>
      new THREE.PointsMaterial({
        color: new THREE.Color("#F4EFE6"),
        size: 0.038,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0,
      });

    const mat1 = makeMat();
    const mat2 = makeMat();
    const pts1 = new THREE.Points(geo1, mat1);
    const pts2 = new THREE.Points(geo2, mat2);

    return { geo1, geo2, mat1, mat2, pts1, pts2 };
  });

  // ─── Drift upward, seamlessly looping ─────────────────────────────────────
  const drift = (frame * 0.006) % RANGE_Y;

  const a1 = geo1.getAttribute("position") as THREE.BufferAttribute;
  const a2 = geo2.getAttribute("position") as THREE.BufferAttribute;
  for (let i = 0; i < COUNT; i++) {
    const base = BASE[i * 3 + 1];
    a1.setY(i, ((base + drift + RANGE_Y / 2) % RANGE_Y) - RANGE_Y / 2);
    const base2 = BASE[i * 3 + 1] - RANGE_Y / 2;
    a2.setY(i, ((base2 + drift + RANGE_Y) % RANGE_Y) - RANGE_Y / 2);
  }
  a1.needsUpdate = true;
  a2.needsUpdate = true;

  // ─── Opacity timeline ─────────────────────────────────────────────────────
  // Scene 1: soft (0.38) | Scene 2: lighter (0.22) | Scene 3: back up (0.32) | Logo: gone
  const opacity = interpolate(
    frame,
    [0, 22, 130, 165, 300, 340, 455, 490],
    [0, 0.38, 0.38, 0.22, 0.22, 0.32, 0.32, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  mat1.opacity = opacity;
  mat2.opacity = opacity;

  return (
    <>
      <primitive object={pts1} />
      <primitive object={pts2} />
    </>
  );
};
