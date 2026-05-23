import {
  AbsoluteFill,
  Video,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  Sequence,
  staticFile,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/DMSerifDisplay";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

const { fontFamily: serif } = loadFont("normal");
const { fontFamily: mono } = loadMono();

const CREAM = "#f4f1ea";
const RED = "#c9222a";

// ── Clips ──────────────────────────────────────────────────────────────────
const CLIPS = [
  {
    id: "c01",
    url: "https://videos.pexels.com/video-files/28651856/12443098_2560_1440_30fps.mp4",
    from: 0,
    durationInFrames: 90, // 3s
    trans: "fade" as const,
    overlay: "rgba(0,0,0,0.42)",
    eyebrow: "Barcelona · ara",
    phrase: ["El teu barri", "ja es mou."],
    pos: "bottom" as const,
  },
  {
    id: "c02",
    url: "https://videos.pexels.com/video-files/29218982/12613026_2560_1440_30fps.mp4",
    from: 90,
    durationInFrames: 75, // 2.5s
    trans: "cut" as const,
    overlay: "rgba(0,0,0,0.38)",
    phrase: ["La pregunta", "és si hi", "ets tu."],
    pos: "bottom" as const,
  },
  {
    id: "c03",
    url: "https://videos.pexels.com/video-files/5847921/5847921-hd_1080_1920_30fps.mp4",
    from: 165,
    durationInFrames: 60, // 2s
    trans: "cut" as const,
    overlay: "rgba(0,0,0,0.28)",
    phrase: null,
    pos: "center" as const,
  },
  {
    id: "c04",
    url: "https://videos.pexels.com/video-files/3135924/3135924-hd_1920_1080_30fps.mp4",
    from: 225,
    durationInFrames: 90, // 3s
    trans: "fade" as const,
    overlay: "rgba(0,0,0,0.50)",
    phrase: ["Connectem locals.", "Creem moviment."],
    pos: "center" as const,
  },
  {
    id: "c05",
    url: "https://videos.pexels.com/video-files/28990396/12539433_2560_1440_30fps.mp4",
    from: 315,
    durationInFrames: 75, // 2.5s
    trans: "fade" as const,
    overlay: "rgba(0,0,0,0.52)",
    phraseGrey: "No és sort.",
    phrase: ["És", "estratègia."],
    pos: "bottom" as const,
  },
  {
    id: "c06",
    url: "https://videos.pexels.com/video-files/37565495/15918085_1440_2560_30fps.mp4",
    from: 390,
    durationInFrames: 90, // 3s
    trans: "fade" as const,
    overlay: "rgba(0,0,0,0.80)",
    isLogo: true,
    phrase: null,
    pos: "center" as const,
  },
];

// ── Grain ──────────────────────────────────────────────────────────────────
const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = (frame * 7919) % 1000;
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' seed='${seed}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23g)'/%3E%3C/svg%3E")`,
        opacity: 0.055,
        pointerEvents: "none",
      }}
    />
  );
};

// ── Vignette ───────────────────────────────────────────────────────────────
const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse at 50% 42%, transparent 28%, rgba(0,0,0,0.72) 100%)",
      pointerEvents: "none",
    }}
  />
);

// ── Scene ──────────────────────────────────────────────────────────────────
const Scene: React.FC<{ clip: (typeof CLIPS)[number] }> = ({ clip }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeInFrames = clip.trans === "fade" ? fps * 1.2 : fps * 0.12;
  const fadeOutFrames = fps * 0.5;

  const opacity = interpolate(
    frame,
    [
      0,
      fadeInFrames,
      clip.durationInFrames - fadeOutFrames,
      clip.durationInFrames,
    ],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const textOpacity = interpolate(frame, [fadeInFrames * 0.5, fadeInFrames * 1.2], [0, 1], {
    easing: Easing.out(Easing.ease),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const isBottom = clip.pos === "bottom";
  const isCenter = clip.pos === "center";

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* Video */}
      <AbsoluteFill>
        <Video
          src={clip.url}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.78) contrast(1.1) saturate(0.72)",
          }}
        />
      </AbsoluteFill>

      {/* Colour overlay */}
      <AbsoluteFill style={{ background: clip.overlay }} />

      {/* Vignette */}
      <Vignette />

      {/* Text */}
      <AbsoluteFill
        style={{
          padding: "0 72px",
          display: "flex",
          flexDirection: "column",
          justifyContent: isBottom ? "flex-end" : "center",
          alignItems: isCenter ? "center" : "flex-start",
          paddingBottom: isBottom ? 140 : 0,
          textAlign: isCenter ? "center" : "left",
          opacity: textOpacity,
        }}
      >
        {clip.isLogo ? (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: serif,
                fontSize: 96,
                color: CREAM,
                lineHeight: 1,
                letterSpacing: "0.01em",
              }}
            >
              Hora
              <span style={{ color: RED }}>·</span>
              Punta
            </div>
            <div
              style={{
                fontFamily: mono,
                fontSize: 28,
                color: "rgba(244,241,234,0.35)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                marginTop: 24,
              }}
            >
              eshorapunta.com
            </div>
          </div>
        ) : (
          <>
            {"eyebrow" in clip && clip.eyebrow && (
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 26,
                  color: "rgba(244,241,234,0.45)",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  marginBottom: 24,
                }}
              >
                {clip.eyebrow}
              </div>
            )}
            {"phraseGrey" in clip && clip.phraseGrey && (
              <div
                style={{
                  fontFamily: serif,
                  fontStyle: "italic",
                  fontSize: 112,
                  color: "rgba(244,241,234,0.28)",
                  lineHeight: 1.08,
                  marginBottom: 8,
                }}
              >
                {clip.phraseGrey}
              </div>
            )}
            {clip.phrase &&
              clip.phrase.map((line, i) => (
                <div
                  key={i}
                  style={{
                    fontFamily: serif,
                    fontStyle: "italic",
                    fontSize: 112,
                    color: CREAM,
                    lineHeight: 1.08,
                  }}
                >
                  {line}
                </div>
              ))}
            {isBottom && (
              <div
                style={{
                  width: 48,
                  height: 2,
                  background: RED,
                  marginTop: 24,
                }}
              />
            )}
          </>
        )}
      </AbsoluteFill>

      {/* Grain */}
      <Grain />

      {/* Watermark */}
      <AbsoluteFill
        style={{
          padding: "40px 56px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontFamily: mono,
            fontSize: 22,
            color: "rgba(244,241,234,0.28)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          HORA<span style={{ color: RED }}>·</span>PUNTA
        </span>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Main composition ───────────────────────────────────────────────────────
export const HoraPuntaReel: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#0d0d0d" }}>
      {CLIPS.map((clip) => (
        <Sequence key={clip.id} from={clip.from} durationInFrames={clip.durationInFrames + 10}>
          <Scene clip={clip} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
