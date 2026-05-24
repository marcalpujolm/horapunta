import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";

import { S1Intro }       from "./scenes/S1Intro";
import { S2Problem }     from "./scenes/S2Problem";
import { S3Quote }       from "./scenes/S3Quote";
import { S4Solution }    from "./scenes/S4Solution";
import { S5Activations } from "./scenes/S5Activations";
import { S6Process }     from "./scenes/S6Process";
import { S7CTA }         from "./scenes/S7CTA";
import { S8Signoff }     from "./scenes/S8Signoff";

// ─── Shared post-FX ──────────────────────────────────────────────────────────
const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background: "radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.75) 100%)",
      pointerEvents: "none",
    }}
  />
);

const Grain: React.FC = () => {
  const f = useCurrentFrame();
  const seed = (f * 7919) % 9999;
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='280'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' seed='${seed}'/%3E%3C/filter%3E%3Crect width='280' height='280' filter='url(%23n)'/%3E%3C/svg%3E")`,
        opacity: 0.038,
        mixBlendMode: "overlay",
        pointerEvents: "none",
      }}
    />
  );
};

// ─── Timeline — 60s = 1800f @ 30fps ──────────────────────────────────────────
//
//  S1  Intro          0  → 195   (0s  – 6.5s)
//  S2  Problem       180 → 420   (6s  – 14s)    15f overlap with S1 fade-out
//  S3  Quote         410 → 540   (13.7s – 18s)  10f overlap
//  S4  Solution      530 → 908   (17.7s – 30.3s) 10f overlap
//  S5  Activations   895 →1268   (29.8s – 42.3s) 13f overlap
//  S6  Process      1255 →1560   (41.8s – 52s)   13f overlap
//  S7  CTA          1548 →1733   (51.6s – 57.8s) 12f overlap
//  S8  Sign Off     1720 →1800   (57.3s – 60s)   13f overlap

export const HoraPuntaPromo: React.FC = () => (
  <AbsoluteFill style={{ background: "#000000" }}>
    <Sequence from={0}    durationInFrames={195}><S1Intro /></Sequence>
    <Sequence from={180}  durationInFrames={240}><S2Problem /></Sequence>
    <Sequence from={410}  durationInFrames={130}><S3Quote /></Sequence>
    <Sequence from={530}  durationInFrames={378}><S4Solution /></Sequence>
    <Sequence from={895}  durationInFrames={373}><S5Activations /></Sequence>
    <Sequence from={1255} durationInFrames={305}><S6Process /></Sequence>
    <Sequence from={1548} durationInFrames={185}><S7CTA /></Sequence>
    <Sequence from={1720} durationInFrames={80}><S8Signoff /></Sequence>

    {/* Post-FX — always on top */}
    <Vignette />
    <Grain />
  </AbsoluteFill>
);
