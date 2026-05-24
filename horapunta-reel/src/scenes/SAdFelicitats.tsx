import React from "react";
import {
  AbsoluteFill, useCurrentFrame, useVideoConfig,
  spring, interpolate,
} from "remotion";
import { fontFamily, BLACK, WHITE, RED, SPRING_SNAP, cl } from "../brand";

// ─── AD: "Felicitats" — 28s cinematogràfic ──────────────────────────────────
// Beat 1 (0–8s/240f):  Elogio — warm, slow, taula perfecta
// Beat 2 (8–16s):      Gir — sala buida, música para, vermell
// Beat 3 (16–22s):     La veritat — mòbil, xifres baixes
// Beat 4 (22–28s):     Logo + tagline

const WARM   = "#1A1108";
const CREAM  = "#F4EFE6";
const GOLD   = "#C8A96E";
const COLD   = "#0A0A12";

// ── helpers ──────────────────────────────────────────────────────────────────

const FPS = 30;
const s = (sec: number) => Math.round(sec * FPS); // seconds → frames

// Cutlery / table geometry
const TableLine: React.FC<{ x: number; y: number; w: number; h: number; color?: string; opacity?: number }> =
  ({ x, y, w, h, color = CREAM, opacity = 0.35 }) => (
    <div style={{
      position: "absolute", left: x, top: y, width: w, height: h,
      background: color, opacity, borderRadius: 1,
    }} />
  );

// Steam particle
const Steam: React.FC<{ x: number; delay: number; f: number }> = ({ x, delay, f }) => {
  const t = Math.max(0, f - delay);
  const yOff = interpolate(t, [0, 60], [0, -40], cl);
  const op   = interpolate(t, [0, 10, 50, 60], [0, 0.5, 0.4, 0], cl);
  const xWave = Math.sin(t * 0.18) * 5;
  return (
    <div style={{
      position: "absolute", left: x + xWave, top: 40 + yOff,
      width: 3, height: 18, borderRadius: 2,
      background: `rgba(244,239,230,${op})`,
    }} />
  );
};

// ── Beat 1: Warm table scene ──────────────────────────────────────────────────
const Beat1: React.FC<{ f: number; fps: number }> = ({ f, fps }) => {
  const fadeIn  = interpolate(f, [0, 20], [0, 1], cl);
  const fadeOut = interpolate(f, [s(7.2), s(8)], [1, 0], cl);
  const opacity = Math.min(fadeIn, fadeOut);

  // Slow zoom in (cinematic push)
  const zoom = interpolate(f, [0, s(8)], [1, 1.08], cl);

  // Title text
  const t1Sp = spring({ frame: f - 18, fps, config: SPRING_SNAP, durationInFrames: 40 });
  const t1Y  = interpolate(t1Sp, [0, 1], [40, 0]);
  const t1Op = interpolate(f, [18, 34], [0, 1], cl);

  const t2Op = interpolate(f, [s(2.5), s(3.5)], [0, 1], cl);
  const t3Op = interpolate(f, [s(4), s(5)], [0, 1], cl);
  const t4Op = interpolate(f, [s(5.5), s(6.5)], [0, 1], cl);

  // Plate pulse
  const platePulse = 1 + Math.sin(f * 0.04) * 0.015;

  return (
    <AbsoluteFill style={{ opacity, overflow: "hidden" }}>
      {/* Warm background */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 60%, #2A1E0E 0%, ${WARM} 70%)` }} />

      {/* Slow zoom wrapper */}
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "50% 55%" }}>

        {/* Table surface */}
        <AbsoluteFill style={{
          background: `linear-gradient(180deg, transparent 52%, #0D0906 52%)`,
          pointerEvents: "none",
        }} />

        {/* Table edge line */}
        <div style={{
          position: "absolute", left: 0, right: 0, top: "52%",
          height: 2, background: GOLD, opacity: 0.3,
        }} />

        {/* Plate */}
        <div style={{
          position: "absolute", left: "50%", top: "42%",
          transform: `translate(-50%, -50%) scale(${platePulse})`,
        }}>
          {/* Outer ring */}
          <div style={{
            width: 180, height: 180, borderRadius: "50%",
            border: `2px solid rgba(200,169,110,0.25)`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {/* Inner plate */}
            <div style={{
              width: 140, height: 140, borderRadius: "50%",
              background: "radial-gradient(circle at 38% 38%, #2A2218, #1A1510)",
              border: `1px solid rgba(200,169,110,0.15)`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {/* Food suggestion — abstract dot */}
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: `radial-gradient(circle, ${GOLD}88, ${GOLD}22)`,
              }} />
            </div>
          </div>
          {/* Steam */}
          {[0, 12, 22].map((d, i) => <Steam key={i} x={80 + i * 10 - 10} delay={d} f={f} />)}
        </div>

        {/* Cutlery left — fork */}
        <div style={{ position: "absolute", left: "calc(50% - 105px)", top: "28%", opacity: 0.4 }}>
          <TableLine x={0} y={0} w={1} h={90} color={GOLD} opacity={0.6} />
          <TableLine x={-4} y={0} w={1} h={30} color={GOLD} opacity={0.4} />
          <TableLine x={4} y={0} w={1} h={30} color={GOLD} opacity={0.4} />
        </div>

        {/* Cutlery right — knife */}
        <div style={{ position: "absolute", left: "calc(50% + 105px)", top: "28%", opacity: 0.4 }}>
          <TableLine x={0} y={0} w={1} h={90} color={GOLD} opacity={0.6} />
          <TableLine x={-2} y={0} w={3} h={20} color={GOLD} opacity={0.3} />
        </div>

        {/* Wine glass */}
        <div style={{ position: "absolute", left: "calc(50% + 52px)", top: "20%", opacity: 0.35 }}>
          <TableLine x={-14} y={0} w={28} h={2} color={GOLD} opacity={0.5} />
          <TableLine x={-10} y={2} w={20} h={22} color={GOLD} opacity={0.2} />
          <TableLine x={-3} y={24} w={6} h={30} color={GOLD} opacity={0.4} />
          <TableLine x={-14} y={54} w={28} h={2} color={GOLD} opacity={0.3} />
        </div>

        {/* Ambient light streak */}
        <div style={{
          position: "absolute", top: 0, left: "30%", width: 2, height: "55%",
          background: `linear-gradient(180deg, transparent, ${GOLD}18, transparent)`,
          transform: "rotate(-8deg)",
        }} />
      </AbsoluteFill>

      {/* Text overlay */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", paddingTop: 120 }}>

        <div style={{ opacity: t1Op, transform: `translateY(${t1Y}px)`, textAlign: "center" }}>
          <div style={{ fontFamily, fontSize: 80, fontWeight: 900, color: CREAM, letterSpacing: "-0.04em", lineHeight: 1 }}>
            Felicitats.
          </div>
        </div>

        <div style={{ opacity: t2Op, marginTop: 24, textAlign: "center" }}>
          <div style={{ fontFamily, fontSize: 28, fontWeight: 600, color: `${CREAM}99`, letterSpacing: "0.04em" }}>
            Tens el millor local del barri.
          </div>
        </div>

        <div style={{ opacity: t3Op, marginTop: 14, textAlign: "center" }}>
          <div style={{ fontFamily, fontSize: 22, fontWeight: 500, color: `${GOLD}BB`, letterSpacing: "0.08em" }}>
            La cuina és perfecta.
          </div>
        </div>

        <div style={{ opacity: t4Op, marginTop: 6, textAlign: "center" }}>
          <div style={{ fontFamily, fontSize: 22, fontWeight: 500, color: `${GOLD}BB`, letterSpacing: "0.08em" }}>
            El servei, impecable.
          </div>
        </div>
      </AbsoluteFill>

      {/* Vignette */}
      <AbsoluteFill style={{
        background: "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.7) 100%)",
        pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};

// ── Beat 2: Empty restaurant ─────────────────────────────────────────────────
const Beat2: React.FC<{ f: number; fps: number }> = ({ f, fps }) => {
  const fadeIn  = interpolate(f, [0, 10], [0, 1], cl);
  const fadeOut = interpolate(f, [s(7.2), s(8)], [1, 0], cl);
  const opacity = Math.min(fadeIn, fadeOut);

  // Camera slowly pulling back
  const zoom = interpolate(f, [0, s(8)], [1.06, 1], cl);

  // Tables fade in: empty, cold
  const tableOp = interpolate(f, [8, 24], [0, 1], cl);

  // "Però ningú ho sap." text — delayed, smaller, RED
  const textOp  = interpolate(f, [s(3), s(4.2)], [0, 1], cl);
  const textSp  = spring({ frame: f - s(3), fps, config: SPRING_SNAP, durationInFrames: 30 });
  const textSc  = interpolate(textSp, [0, 0.7, 1], [1.2, 0.94, 1]);

  // Cold flash at start
  const coldFlash = interpolate(f, [0, 4, 12], [0.5, 0.2, 0], cl);

  // Chairs — 3 tables × 2 chairs
  const TABLES = [
    { x: "18%", chairs: [-36, 36] },
    { x: "50%", chairs: [-36, 36] },
    { x: "82%", chairs: [-36, 36] },
  ];

  return (
    <AbsoluteFill style={{ opacity, overflow: "hidden" }}>
      {/* Cold dark background */}
      <AbsoluteFill style={{ background: COLD }} />

      {/* White flash on cut */}
      <AbsoluteFill style={{ background: WHITE, opacity: coldFlash, pointerEvents: "none" }} />

      {/* Perspective room */}
      <AbsoluteFill style={{
        transform: `scale(${zoom})`,
        transformOrigin: "50% 50%",
      }}>

        {/* Floor perspective lines */}
        <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.12 }}>
          {[-3, -2, -1, 0, 1, 2, 3].map(i => (
            <div key={i} style={{
              position: "absolute",
              left: `${50 + i * 3}%`, top: "50%",
              width: 1, height: "60%",
              background: WHITE,
              transformOrigin: "top center",
              transform: `rotate(${i * 14}deg)`,
            }} />
          ))}
        </AbsoluteFill>

        {/* Tables + chairs */}
        <div style={{ position: "absolute", top: "54%", left: 0, right: 0, opacity: tableOp }}>
          {TABLES.map((table, ti) => (
            <div key={ti} style={{
              position: "absolute",
              left: table.x, top: 0,
              transform: "translateX(-50%)",
            }}>
              {/* Table top */}
              <div style={{
                width: 80, height: 4,
                background: `rgba(255,255,255,0.12)`,
                borderRadius: 2,
                border: `1px solid rgba(255,255,255,0.06)`,
                marginLeft: -40,
              }} />
              {/* Table leg */}
              <div style={{ width: 2, height: 30, background: "rgba(255,255,255,0.06)", marginLeft: -1 }} />

              {/* Chairs */}
              {table.chairs.map((cx, ci) => (
                <div key={ci} style={{
                  position: "absolute", top: -28, left: cx,
                  width: 24, height: 24,
                  border: `1px solid rgba(255,255,255,0.1)`,
                  borderRadius: 2,
                }} />
              ))}
            </div>
          ))}
        </div>

        {/* Empty candle on each table */}
        {TABLES.map((table, ti) => (
          <div key={ti} style={{
            position: "absolute", top: "48%", left: table.x,
            transform: "translate(-50%, -50%)",
            opacity: tableOp * 0.5,
          }}>
            <div style={{ width: 4, height: 16, background: "rgba(255,255,255,0.15)", borderRadius: 1, margin: "0 auto" }} />
          </div>
        ))}
      </AbsoluteFill>

      {/* Main text */}
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          opacity: textOp,
          transform: `scale(${textSc})`,
          textAlign: "center",
        }}>
          <div style={{
            fontFamily, fontSize: 64, fontWeight: 900,
            color: RED, letterSpacing: "-0.04em", lineHeight: 1,
          }}>
            Però ningú ho sap.
          </div>
        </div>
      </AbsoluteFill>

      {/* Heavy vignette */}
      <AbsoluteFill style={{
        background: "radial-gradient(ellipse at 50% 50%, transparent 20%, rgba(0,0,0,0.88) 100%)",
        pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};

// ── Beat 3: Phone / Instagram mockup ────────────────────────────────────────
const Beat3: React.FC<{ f: number; fps: number }> = ({ f, fps }) => {
  const fadeIn  = interpolate(f, [0, 12], [0, 1], cl);
  const fadeOut = interpolate(f, [s(5.5), s(6)], [1, 0], cl);
  const opacity = Math.min(fadeIn, fadeOut);

  // Phone slides up
  const phoneSp = spring({ frame: f - 6, fps, config: SPRING_SNAP, durationInFrames: 40 });
  const phoneY  = interpolate(phoneSp, [0, 1], [200, 0]);
  const phoneSc = interpolate(phoneSp, [0, 0.7, 1], [0.85, 1.04, 1]);

  // Numbers count — low, sad
  const followers = Math.round(interpolate(f, [s(1.5), s(3)], [0, 847], cl));
  const likes     = Math.round(interpolate(f, [s(2), s(3.5)], [0, 12], cl));

  // Text lines
  const t1Op = interpolate(f, [s(2.8), s(3.8)], [0, 1], cl);
  const t2Op = interpolate(f, [s(3.6), s(4.6)], [0, 1], cl);

  return (
    <AbsoluteFill style={{ opacity, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "#080810" }} />

      {/* Subtle grid */}
      <AbsoluteFill style={{
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        pointerEvents: "none",
      }} />

      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40 }}>

        {/* Phone mockup */}
        <div style={{
          transform: `translateY(${phoneY}px) scale(${phoneSc})`,
          position: "relative",
        }}>
          {/* Phone frame */}
          <div style={{
            width: 200, height: 340,
            border: `2px solid rgba(255,255,255,0.15)`,
            borderRadius: 28,
            background: "#101018",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08)",
            padding: 0,
          }}>
            {/* Status bar */}
            <div style={{
              height: 28, background: "#181820",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "0 16px",
            }}>
              <div style={{ fontFamily, fontSize: 9, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>9:41</div>
              <div style={{ display: "flex", gap: 4 }}>
                {[10, 14, 18, 22].map((h, i) => (
                  <div key={i} style={{ width: 3, height: h, background: i < 3 ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)", borderRadius: 1, alignSelf: "flex-end" }} />
                ))}
              </div>
            </div>

            {/* IG header */}
            <div style={{
              padding: "10px 12px 6px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.08)" }} />
              <div>
                <div style={{ fontFamily, fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.7)" }}>elmeulocal</div>
                <div style={{ fontFamily, fontSize: 8, color: "rgba(255,255,255,0.3)" }}>Restauració</div>
              </div>
            </div>

            {/* Post image placeholder */}
            <div style={{
              width: "100%", height: 130,
              background: "linear-gradient(135deg, #1A1A22, #0E0E16)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }} />
            </div>

            {/* Engagement bar */}
            <div style={{ padding: "8px 12px", display: "flex", gap: 12 }}>
              <div style={{ fontFamily, fontSize: 9, color: "rgba(255,255,255,0.5)" }}>♥ {likes}</div>
              <div style={{ fontFamily, fontSize: 9, color: "rgba(255,255,255,0.25)" }}>💬 1</div>
            </div>

            {/* Stats */}
            <div style={{
              padding: "0 12px 10px",
              borderTop: "1px solid rgba(255,255,255,0.04)",
              marginTop: 4,
            }}>
              <div style={{ fontFamily, fontSize: 9, color: "rgba(255,255,255,0.25)", marginBottom: 6, marginTop: 8 }}>ESTADÍSTIQUES</div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily, fontSize: 16, fontWeight: 900, color: "rgba(255,255,255,0.5)" }}>{followers}</div>
                  <div style={{ fontFamily, fontSize: 7, color: "rgba(255,255,255,0.2)" }}>seguidors</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily, fontSize: 16, fontWeight: 900, color: "rgba(255,255,255,0.2)" }}>3</div>
                  <div style={{ fontFamily, fontSize: 7, color: "rgba(255,255,255,0.2)" }}>clients nous</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Text */}
        <div style={{ textAlign: "center", padding: "0 48px" }}>
          <div style={{ opacity: t1Op, marginBottom: 10 }}>
            <div style={{ fontFamily, fontSize: 28, fontWeight: 900, color: WHITE, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              Tenir un bon local
            </div>
            <div style={{ fontFamily, fontSize: 28, fontWeight: 900, color: WHITE, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              no és suficient.
            </div>
          </div>
          <div style={{ opacity: t2Op }}>
            <div style={{ fontFamily, fontSize: 20, fontWeight: 600, color: RED, letterSpacing: "0.02em" }}>
              Cal que la gent el trobi.
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Beat 4: Logo + CTA ────────────────────────────────────────────────────────
const Beat4: React.FC<{ f: number; fps: number }> = ({ f, fps }) => {
  const fadeIn = interpolate(f, [0, 8], [0, 1], cl);

  // Logo spring
  const logoSp = spring({ frame: f - 10, fps, config: SPRING_SNAP, durationInFrames: 44 });
  const logoSc = interpolate(logoSp, [0, 0.7, 1], [0.3, 1.12, 1]);
  const logoOp = interpolate(f, [10, 24], [0, 1], cl);

  // Separator bar
  const barW = interpolate(f, [s(1.2), s(2.2)], [0, 90], cl);

  // Tagline
  const tagOp = interpolate(f, [s(1.8), s(2.8)], [0, 1], cl);
  const tagY  = interpolate(f, [s(1.8), s(2.8)], [16, 0], cl);

  // URL
  const urlOp = interpolate(f, [s(2.6), s(3.4)], [0, 1], cl);

  // Heartbeat glow on the red bar
  const glow = 1 + Math.sin(Math.max(0, f - s(2)) * 0.28) * 0.6;

  return (
    <AbsoluteFill style={{ background: BLACK, opacity: fadeIn }}>
      {/* Hard white flash on cut in */}
      <AbsoluteFill style={{
        background: WHITE,
        opacity: interpolate(f, [0, 2, 6], [0.6, 0.2, 0], cl),
        pointerEvents: "none",
      }} />

      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 0 }}>

        {/* Logo */}
        <div style={{ opacity: logoOp, transform: `scale(${logoSc})`, textAlign: "center" }}>
          <div style={{ fontFamily, fontSize: 120, fontWeight: 900, color: WHITE, letterSpacing: "-0.065em", lineHeight: 0.88, textTransform: "uppercase" }}>
            HORA
          </div>
          {/* Red separator */}
          <div style={{
            width: barW, height: 6, background: RED, margin: "16px auto",
            borderRadius: 3,
            boxShadow: `0 0 ${16 * glow}px ${RED}, 0 0 ${32 * glow}px ${RED}66`,
          }} />
          <div style={{ fontFamily, fontSize: 120, fontWeight: 900, color: RED, letterSpacing: "-0.065em", lineHeight: 0.88, textTransform: "uppercase" }}>
            PUNTA
          </div>
        </div>

        {/* Tagline */}
        <div style={{
          opacity: tagOp, transform: `translateY(${tagY}px)`,
          marginTop: 28, textAlign: "center",
        }}>
          <div style={{ fontFamily, fontSize: 20, fontWeight: 700, color: "rgba(255,255,255,0.42)", letterSpacing: "0.05em" }}>
            No gestionem xarxes. Activem negocis.
          </div>
        </div>

        {/* URL */}
        <div style={{ opacity: urlOp, marginTop: 20 }}>
          <div style={{
            fontFamily, fontSize: 16, fontWeight: 800,
            color: RED, letterSpacing: "0.12em", textTransform: "uppercase",
          }}>
            horapunta.cat
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Main composition ──────────────────────────────────────────────────────────
export const SAdFelicitats: React.FC = () => {
  const f   = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Local frame per beat
  const f1 = f;                  // Beat 1: 0 – 8s (240f)
  const f2 = f - s(8);           // Beat 2: 8 – 16s
  const f3 = f - s(16);          // Beat 3: 16 – 22s
  const f4 = f - s(22);          // Beat 4: 22 – 28s

  return (
    <AbsoluteFill style={{ background: BLACK, overflow: "hidden" }}>

      {/* Beat 1 — Warm table (0–8s) */}
      {f < s(8.5) && <Beat1 f={f1} fps={fps} />}

      {/* Beat 2 — Empty room (8–16s) */}
      {f >= s(7.8) && f < s(16.5) && <Beat2 f={f2} fps={fps} />}

      {/* Beat 3 — Phone (16–22s) */}
      {f >= s(15.8) && f < s(22.5) && <Beat3 f={f3} fps={fps} />}

      {/* Beat 4 — Logo (22–28s) */}
      {f >= s(21.8) && <Beat4 f={f4} fps={fps} />}

      {/* Global film grain */}
      <AbsoluteFill style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' seed='${(f * 7919) % 9999}'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
        opacity: 0.045,
        mixBlendMode: "overlay",
        pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};
