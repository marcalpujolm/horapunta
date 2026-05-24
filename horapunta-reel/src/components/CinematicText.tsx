import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { cin } from "../utils/easing";

interface Line {
  text: string;
  /** Frames after globalStart when this line animates in */
  offset?: number;
}

interface CinematicTextProps {
  lines: Line[];
  globalStart: number;
  globalEnd: number;
  /** Bottom padding in px — controls vertical position */
  paddingBottom?: number;
  fontFamily: string;
  fontSize?: number;
  color?: string;
  align?: "left" | "center";
}

/**
 * Cinematic text block with staggered line reveals.
 * Each line slides up from below + fades in.
 * The whole block fades out at globalEnd.
 */
export const CinematicText: React.FC<CinematicTextProps> = ({
  lines,
  globalStart,
  globalEnd,
  paddingBottom = 310,
  fontFamily,
  fontSize = 82,
  color = "#F4EFE6",
  align = "left",
}) => {
  const f = useCurrentFrame();

  // Global fade-out
  const blockOp = interpolate(
    f,
    [globalEnd - 22, globalEnd],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Don't render outside window
  if (f < globalStart || f > globalEnd) return null;
  if (blockOp <= 0) return null;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: align === "center" ? "center" : "flex-start",
        padding:
          align === "center"
            ? "0"
            : `0 72px ${paddingBottom}px`,
        opacity: blockOp,
        pointerEvents: "none",
      }}
    >
      {lines.map(({ text, offset = 0 }, i) => {
        const lineStart = globalStart + offset;
        const lineOp = interpolate(
          f,
          [lineStart, lineStart + 24],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const lineY = interpolate(
          f,
          [lineStart, lineStart + 28],
          [36, 0],
          {
            easing: cin,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        return (
          <div
            key={i}
            style={{
              fontFamily,
              fontSize,
              fontWeight: 900,
              color,
              lineHeight: 1.04,
              letterSpacing: "-0.042em",
              textAlign: align,
              opacity: lineOp,
              transform: `translateY(${lineY}px)`,
              marginBottom: i < lines.length - 1 ? 4 : 0,
            }}
          >
            {text}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
