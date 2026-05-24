import React from "react";
import {
  AbsoluteFill, useCurrentFrame, useVideoConfig,
  spring, interpolate, OffthreadVideo, staticFile,
} from "remotion";
import { fontFamily, BLACK, WHITE, RED, SPRING_SNAP, cl } from "../brand";

// ─── AD: "Passen" — 27s cinematogràfic ──────────────────────────────────────
// La ciutat no para. La gent passa. Però no entra.
// Vídeos reals de trànsit BCN + text cinètic agressiu.
//
// Beat 1 (0–9s):   BCN en moviment, càlid, gent que passa
// Beat 2 (8–14s):  Mateix vídeo, desatura, "I no hi entren." — impacte
// Beat 3 (13–21s): Cut a negre, moviment cotxes de fons fosc, veritat brutal
// Beat 4 (20–27s): Logo HORA PUNTA, tagline, CTA

const FPS = 30;
const s = (sec: number) => Math.round(sec * FPS);

export const SAdPassen: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Globals ──────────────────────────────────────────────────────────────
  const globalFadeIn = interpolate(f, [0, 18], [0, 1], cl);

  // ── Beat 1: BCN movement — warm & cinematic (0–9s) ──────────────────────

  // Slow zoom in on the video
  const videoZoom = interpolate(f, [0, s(14)], [1, 1.12], cl);

  // Desaturation: warm → cold starts at 8s
  const saturation = interpolate(f, [s(8), s(13)], [1.1, 0], cl);
  const brightness  = interpolate(f, [s(8), s(13)], [1,   0.55], cl);

  // Dark overlay for text legibility (grows over time)
  const darkOverlay = interpolate(f, [0, s(3), s(9)], [0.25, 0.45, 0.72], cl);

  // Text 1: "Cada dia,"
  const t1Op = interpolate(f, [s(1.8), s(3)], [0, 1], cl);
  const t1Y  = interpolate(f, [s(1.8), s(3)], [24, 0], cl);

  // Text 2: "milers de persones"
  const t2Op = interpolate(f, [s(3.2), s(4.4)], [0, 1], cl);
  const t2Y  = interpolate(f, [s(3.2), s(4.4)], [24, 0], cl);

  // Text 3: "passen pel davant del teu local."
  const t3Op = interpolate(f, [s(4.8), s(6.2)], [0, 1], cl);
  const t3Y  = interpolate(f, [s(4.8), s(6.2)], [24, 0], cl);

  // ── Beat 2: "I no hi entren." (8–14s) ────────────────────────────────────
  const b2Active = f >= s(7.5) && f < s(14.5);

  // Impact text — RED, slams in
  const impactSp = spring({ frame: f - s(8.5), fps, config: SPRING_SNAP, durationInFrames: 32 });
  const impactSc  = interpolate(impactSp, [0, 0.65, 1], [1.5, 0.88, 1]);
  const impactOp  = interpolate(f, [s(8.5), s(9.2)], [0, 1], cl);
  const impactFadeOut = interpolate(f, [s(12.5), s(14)], [1, 0], cl);

  // Red flash on impact
  const redFlash = interpolate(f, [s(8.5), s(8.7), s(9.5)], [0, 0.45, 0], cl);

  // ── Beat 3: Black + veritat (13–21s) ─────────────────────────────────────
  const b3FadeIn = interpolate(f, [s(13), s(14)], [0, 1], cl);
  const b3FadeOut = interpolate(f, [s(20), s(21)], [1, 0], cl);
  const b3Active  = f >= s(12.5);

  // Video 2 (cotxes) com a fons fosc i ràpid
  const v2Opacity = interpolate(f, [s(13), s(15)], [0, 0.18], cl);

  // "El problema no és la gent."
  const p1Sp = spring({ frame: f - s(14.2), fps, config: SPRING_SNAP, durationInFrames: 36 });
  const p1Sc = interpolate(p1Sp, [0, 0.7, 1], [0.7, 1.06, 1]);
  const p1Op = interpolate(f, [s(14.2), s(15)], [0, 1], cl);

  // "És que no saben que hi ets."
  const p2Sp = spring({ frame: f - s(16.5), fps, config: SPRING_SNAP, durationInFrames: 36 });
  const p2Sc = interpolate(p2Sp, [0, 0.7, 1], [0.7, 1.06, 1]);
  const p2Op = interpolate(f, [s(16.5), s(17.3)], [0, 1], cl);
  const p2Color = RED;

  // White flash on cut to black
  const cutFlash = interpolate(f, [s(13), s(13.2), s(14)], [0.7, 0.3, 0], cl);

  // ── Beat 4: Logo (20–27s) ─────────────────────────────────────────────────
  const b4FadeIn = interpolate(f, [s(20), s(21.2)], [0, 1], cl);
  const b4Active = f >= s(19.5);

  // Logo spring
  const logoSp = spring({ frame: f - s(20.5), fps, config: SPRING_SNAP, durationInFrames: 44 });
  const logoSc = interpolate(logoSp, [0, 0.7, 1], [0.3, 1.12, 1]);
  const logoOp = interpolate(f, [s(20.5), s(21.8)], [0, 1], cl);

  // Bar width animates
  const barW = interpolate(f, [s(22), s(23.2)], [0, 90], cl);
  const barGlow = 1 + Math.sin(Math.max(0, f - s(23)) * 0.28) * 0.5;

  // Tagline + URL
  const tagOp = interpolate(f, [s(22.5), s(23.5)], [0, 1], cl);
  const tagY  = interpolate(f, [s(22.5), s(23.5)], [14, 0], cl);
  const urlOp = interpolate(f, [s(23.8), s(24.8)], [0, 1], cl);

  // Logo white flash on entry
  const logoFlash = interpolate(f, [s(20), s(20.3), s(21)], [0.5, 0.2, 0], cl);

  return (
    <AbsoluteFill style={{ background: BLACK, overflow: "hidden", opacity: globalFadeIn }}>

      {/* ═══ BEAT 1 + 2: BCN movement video ═══════════════════════════════ */}
      {f < s(14.5) && (
        <AbsoluteFill style={{ transform: `scale(${videoZoom})`, transformOrigin: "50% 50%" }}>
          <OffthreadVideo
            src={staticFile("media/bcn-moviment.mp4")}
            style={{
              width: "100%", height: "100%",
              objectFit: "cover",
              filter: `saturate(${saturation}) brightness(${brightness})`,
            }}
            muted
          />
        </AbsoluteFill>
      )}

      {/* Dark overlay for legibility */}
      {f < s(14.5) && (
        <AbsoluteFill style={{
          background: `linear-gradient(180deg, rgba(0,0,0,${darkOverlay * 0.6}) 0%, rgba(0,0,0,${darkOverlay}) 100%)`,
          pointerEvents: "none",
        }} />
      )}

      {/* ═══ BEAT 3: Cotxes dark bg ════════════════════════════════════════ */}
      {b3Active && (
        <AbsoluteFill style={{ opacity: v2Opacity }}>
          <OffthreadVideo
            src={staticFile("media/moviment-cotxes.mp4")}
            style={{
              width: "100%", height: "100%",
              objectFit: "cover",
              filter: "saturate(0) brightness(0.4)",
            }}
            muted
          />
        </AbsoluteFill>
      )}

      {/* Cut flash (beat 1→3) */}
      <AbsoluteFill style={{ background: WHITE, opacity: cutFlash, pointerEvents: "none" }} />

      {/* Red flash on "I no hi entren" */}
      <AbsoluteFill style={{ background: RED, opacity: redFlash, pointerEvents: "none" }} />

      {/* ═══ TEXT BEAT 1 ═══════════════════════════════════════════════════ */}
      {f < s(8.5) && (
        <AbsoluteFill style={{
          display: "flex", flexDirection: "column",
          justifyContent: "flex-end", alignItems: "flex-start",
          padding: "0 52px 160px",
        }}>
          <div style={{ opacity: t1Op, transform: `translateY(${t1Y}px)` }}>
            <div style={{
              fontFamily, fontSize: 22, fontWeight: 700,
              color: "rgba(255,255,255,0.6)", letterSpacing: "0.12em",
              textTransform: "uppercase", marginBottom: 12,
            }}>
              Cada dia,
            </div>
          </div>

          <div style={{ opacity: t2Op, transform: `translateY(${t2Y}px)` }}>
            <div style={{
              fontFamily, fontSize: 64, fontWeight: 900,
              color: WHITE, letterSpacing: "-0.04em", lineHeight: 0.95,
            }}>
              milers de
            </div>
            <div style={{
              fontFamily, fontSize: 64, fontWeight: 900,
              color: WHITE, letterSpacing: "-0.04em", lineHeight: 0.95,
            }}>
              persones
            </div>
          </div>

          <div style={{ opacity: t3Op, transform: `translateY(${t3Y}px)`, marginTop: 8 }}>
            <div style={{
              fontFamily, fontSize: 28, fontWeight: 600,
              color: "rgba(255,255,255,0.72)", letterSpacing: "0.01em", lineHeight: 1.3,
            }}>
              passen pel davant
            </div>
            <div style={{
              fontFamily, fontSize: 28, fontWeight: 600,
              color: "rgba(255,255,255,0.72)", letterSpacing: "0.01em",
            }}>
              del teu local.
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ═══ TEXT BEAT 2: "I no hi entren." ═══════════════════════════════ */}
      {b2Active && f >= s(8.5) && (
        <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            opacity: Math.min(impactOp, impactFadeOut),
            transform: `scale(${impactSc})`,
            textAlign: "center",
          }}>
            <div style={{
              fontFamily, fontSize: 88, fontWeight: 900,
              color: RED, letterSpacing: "-0.05em", lineHeight: 1,
              textShadow: `0 0 60px ${RED}88`,
            }}>
              I no hi entren.
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ═══ TEXT BEAT 3: Veritat ══════════════════════════════════════════ */}
      {b3Active && (
        <AbsoluteFill style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 18,
          opacity: Math.min(b3FadeIn, b3FadeOut),
        }}>
          <div style={{
            opacity: p1Op,
            transform: `scale(${p1Sc})`,
            textAlign: "center", padding: "0 48px",
          }}>
            <div style={{
              fontFamily, fontSize: 50, fontWeight: 900,
              color: WHITE, letterSpacing: "-0.04em", lineHeight: 1.05,
            }}>
              El problema
            </div>
            <div style={{
              fontFamily, fontSize: 50, fontWeight: 900,
              color: WHITE, letterSpacing: "-0.04em", lineHeight: 1.05,
            }}>
              no és la gent.
            </div>
          </div>

          <div style={{
            opacity: p2Op,
            transform: `scale(${p2Sc})`,
            textAlign: "center", padding: "0 48px",
          }}>
            <div style={{
              fontFamily, fontSize: 44, fontWeight: 900,
              color: p2Color, letterSpacing: "-0.04em", lineHeight: 1.05,
              textShadow: `0 0 40px ${RED}66`,
            }}>
              És que no saben
            </div>
            <div style={{
              fontFamily, fontSize: 44, fontWeight: 900,
              color: p2Color, letterSpacing: "-0.04em", lineHeight: 1.05,
              textShadow: `0 0 40px ${RED}66`,
            }}>
              que hi ets.
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ═══ BEAT 4: Logo ══════════════════════════════════════════════════ */}
      {b4Active && (
        <AbsoluteFill style={{ background: BLACK, opacity: b4FadeIn }}>
          {/* Logo flash */}
          <AbsoluteFill style={{ background: WHITE, opacity: logoFlash, pointerEvents: "none" }} />

          <AbsoluteFill style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 0,
          }}>
            {/* Logo */}
            <div style={{ opacity: logoOp, transform: `scale(${logoSc})`, textAlign: "center" }}>
              <div style={{
                fontFamily, fontSize: 118, fontWeight: 900, color: WHITE,
                letterSpacing: "-0.065em", lineHeight: 0.88, textTransform: "uppercase",
              }}>
                HORA
              </div>
              <div style={{
                width: barW, height: 6, background: RED,
                margin: "14px auto", borderRadius: 3,
                boxShadow: `0 0 ${16 * barGlow}px ${RED}, 0 0 ${32 * barGlow}px ${RED}55`,
              }} />
              <div style={{
                fontFamily, fontSize: 118, fontWeight: 900, color: RED,
                letterSpacing: "-0.065em", lineHeight: 0.88, textTransform: "uppercase",
              }}>
                PUNTA
              </div>
            </div>

            {/* Tagline */}
            <div style={{ opacity: tagOp, transform: `translateY(${tagY}px)`, marginTop: 26, textAlign: "center" }}>
              <div style={{
                fontFamily, fontSize: 19, fontWeight: 700,
                color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em",
              }}>
                No gestionem xarxes. Activem negocis.
              </div>
            </div>

            {/* URL */}
            <div style={{ opacity: urlOp, marginTop: 18 }}>
              <div style={{
                fontFamily, fontSize: 15, fontWeight: 800,
                color: RED, letterSpacing: "0.14em", textTransform: "uppercase",
              }}>
                horapunta.cat
              </div>
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      )}

      {/* Vignette global */}
      <AbsoluteFill style={{
        background: "radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.65) 100%)",
        pointerEvents: "none",
      }} />

      {/* Film grain */}
      <AbsoluteFill style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' seed='${(f * 7919) % 9999}'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
        opacity: 0.04, mixBlendMode: "overlay", pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};
