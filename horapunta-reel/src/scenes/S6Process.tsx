import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { fontFamily, BLACK, WHITE, RED, SPRING, cl } from "../brand";

// ─── Scene 6: The Process — 0-300f ──────────────────────────────────────────
// Horizontal timeline tilted on X-axis for 3D depth.
// Steps count up. Connecting line draws between them.

const STEPS = [
  { num: "01", title: "DIAGNOSI", sub: "Setmana 1" },
  { num: "02", title: "PLA D'ACCIÓ", sub: "Setmana 2" },
  { num: "03", title: "EXECUCIÓ", sub: "Setmana 3–6" },
  { num: "04", title: "ITERACIÓ", sub: "Mes 2+" },
];

const ProcessStep: React.FC<{
  num: string;
  title: string;
  sub: string;
  startF: number;
  f: number;
  fps: number;
  isLast: boolean;
  lineProgress: number;
}> = ({ num, title, sub, startF, f, fps, isLast, lineProgress }) => {
  const sp = spring({ frame: f - startF, fps, config: SPRING, durationInFrames: 40 });
  const opacity = interpolate(f, [startF, startF + 18], [0, 1], cl);
  const y = interpolate(sp, [0, 1], [40, 0]);

  // Rolling number: counts from 0 to the target
  const displayNum = interpolate(
    f,
    [startF, startF + 25],
    [0, parseInt(num)],
    cl
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flex: 1,
        position: "relative",
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      {/* Connecting line (except last) */}
      {!isLast && (
        <div
          style={{
            position: "absolute",
            top: 24,
            left: "50%",
            width: `${lineProgress * 100}%`,
            height: 2,
            background: RED,
            transformOrigin: "left",
            zIndex: 0,
          }}
        />
      )}

      {/* Circle node */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: RED,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
          boxShadow: `0 0 20px rgba(232,64,28,0.4)`,
          marginBottom: 16,
        }}
      >
        <span style={{ fontFamily, fontSize: 16, fontWeight: 900, color: WHITE }}>
          {String(Math.round(displayNum)).padStart(2, "0")}
        </span>
      </div>

      {/* Step info */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily, fontSize: 22, fontWeight: 900, color: WHITE, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
          {title}
        </div>
        <div style={{ fontFamily, fontSize: 16, fontWeight: 500, color: "rgba(255,255,255,0.45)", marginTop: 6, letterSpacing: "0.06em" }}>
          {sub}
        </div>
      </div>
    </div>
  );
};

export const S6Process: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn  = interpolate(f, [0, 20], [0, 1], cl);
  const fadeOut = interpolate(f, [276, 300], [1, 0], cl);
  const opacity = Math.min(fadeIn, fadeOut);

  // Container: tilted on X for 3D depth feel
  const tiltSp = spring({ frame: f - 5, fps, config: { damping: 16, stiffness: 80, mass: 1.2 }, durationInFrames: 60 });
  const tiltX = interpolate(tiltSp, [0, 1], [35, 12]);

  // Step start frames
  const stepStarts = [28, 75, 122, 169];

  // Connecting line progress between each pair
  const getLineP = (from: number, to: number) =>
    interpolate(f, [from + 20, to], [0, 1], cl);

  const lineProgress = [
    getLineP(stepStarts[0], stepStarts[1]),
    getLineP(stepStarts[1], stepStarts[2]),
    getLineP(stepStarts[2], stepStarts[3]),
  ];

  return (
    <AbsoluteFill style={{ background: BLACK, opacity }}>
      {/* Heading */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: 120,
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 22,
            fontWeight: 700,
            color: RED,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            opacity: interpolate(f, [8, 28], [0, 1], cl),
          }}
        >
          Com treballem
        </div>
      </AbsoluteFill>

      {/* 3D tilted timeline */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 60px",
        }}
      >
        <div
          style={{
            transform: `perspective(1400px) rotateX(${tiltX}deg)`,
            width: "100%",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          {STEPS.map((step, i) => (
            <ProcessStep
              key={i}
              num={step.num}
              title={step.title}
              sub={step.sub}
              startF={stepStarts[i]}
              f={f}
              fps={fps}
              isLast={i === STEPS.length - 1}
              lineProgress={i < lineProgress.length ? lineProgress[i] : 0}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
