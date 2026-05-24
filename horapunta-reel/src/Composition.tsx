import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { loadFont } from "@remotion/google-fonts/Inter";

// ─── 3D Scene components ────────────────────────────────────────────────────
import { CinematicLighting } from "./components/CinematicLighting";
import { CameraRig } from "./components/CameraRig";
import { ParticleField } from "./components/ParticleField";
import { CityPillars } from "./components/CityPillars";
import { RedSlash } from "./components/RedSlash";

// ─── 2D Overlay components ──────────────────────────────────────────────────
import { FilmGrain } from "./components/FilmGrain";
import { CinematicText } from "./components/CinematicText";
import { LogoReveal } from "./components/LogoReveal";

// ─── Font ────────────────────────────────────────────────────────────────────
const { fontFamily } = loadFont("normal");

// ─── Brand ───────────────────────────────────────────────────────────────────
const BLACK = "#0A0A0A";

// ─── Timeline (18s = 540f @ 30fps) ──────────────────────────────────────────
//
//  SCENE 1 — ATMOSFERA     0  → 130   (0s – 4.3s)
//    Darkness, breath, particles, red light builds.
//    No text. Pure atmosphere.
//
//  SCENE 2 — CONSTRUCCIÓ   105 → 340  (3.5s – 11.3s)
//    City pillars emerge. Camera drifts forward.
//    TEXT 1: "Els locals plens"          f 168 → 260
//    TEXT 2: "no passen per casualitat." f 222 → 318
//
//  SCENE 3 — ESCALADA      305 → 490  (10.2s – 16.3s)
//    Energy. Red slash sweeps. Pillars sway.
//    TEXT 3: "Activem negocis."           f 358 → 455
//
//  SCENE 4 — TANCAMENT     460 → 540  (15.3s – 18s)
//    Black canvas. Logo springs in.

export const HoraPuntaFilm: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: BLACK }}>
      {/* ══════════════════════════════════════════════
          THREE.JS — 3D Scene (all scenes share canvas)
         ══════════════════════════════════════════════ */}
      <ThreeCanvas width={width} height={height}>
        {/* Lighting rig */}
        <CinematicLighting />

        {/* Camera — organic push-in */}
        <CameraRig />

        {/* Atmospheric particles — throughout */}
        <ParticleField />

        {/* City pillar architecture — scenes 2–3 */}
        <CityPillars />

        {/* Red brand slash — scene 3 */}
        <RedSlash />
      </ThreeCanvas>

      {/* ══════════════════════════════════════════════
          2D OVERLAYS
         ══════════════════════════════════════════════ */}

      {/* SCENE 2 · Line 1 */}
      <CinematicText
        lines={[{ text: "Els locals plens", offset: 0 }]}
        globalStart={168}
        globalEnd={262}
        paddingBottom={348}
        fontFamily={fontFamily}
      />

      {/* SCENE 2 · Line 2 (staggered — appears while line 1 is still showing) */}
      <CinematicText
        lines={[{ text: "no passen per casualitat.", offset: 0 }]}
        globalStart={224}
        globalEnd={318}
        paddingBottom={258}
        fontFamily={fontFamily}
        fontSize={74}
        color="rgba(244,239,230,0.72)"
      />

      {/* SCENE 3 · Action line — centered */}
      <CinematicText
        lines={[{ text: "Activem negocis.", offset: 0 }]}
        globalStart={358}
        globalEnd={455}
        fontFamily={fontFamily}
        fontSize={96}
        color="#F4EFE6"
        align="center"
      />

      {/* SCENE 4 · Logo */}
      <LogoReveal startFrame={462} fontFamily={fontFamily} />

      {/* ══════════════════════════════════════════════
          POST-FX (always on top)
         ══════════════════════════════════════════════ */}
      <FilmGrain />
    </AbsoluteFill>
  );
};
