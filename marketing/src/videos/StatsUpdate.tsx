import {
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
  spring,
  interpolate,
  Easing,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { FedLogo } from "../components/visuals";

export type StatsUpdateProps = {
  headline: string;
  stats: Array<{
    value: string;
    numericValue?: number;
    prefix?: string;
    suffix?: string;
    label: string;
    color: string;
  }>;
  tagline: string;
  cta: string;
};

// ============================================================================
// DESIGN SYSTEM - Unified color palette for sophistication
// ============================================================================
const COLORS = {
  // Backgrounds
  black: "#010101",
  nearBlack: "#030303",
  darkGray: "#0a0a0a",

  // Primary accent - FED green (use sparingly, at reduced opacity)
  primary: "#00d878",
  primaryMuted: "#00b868",
  primaryGlow: "rgba(0, 216, 120, 0.5)",

  // Secondary accent - cyan (very subtle)
  secondary: "#00c8e0",

  // Text
  white: "#ffffff",
  grayLight: "#888888",
  grayMid: "#555555",
  grayDark: "#404040",
};

// Utility to convert hex to rgba
const hexToRgba = (hex: string, alpha: number) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(0, 216, 120, ${alpha})`;
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// ============================================================================
// FILM GRAIN - Ultra-minimal texture for cinema feel
// ============================================================================
const FilmGrain: React.FC<{ opacity?: number }> = ({ opacity = 0.012 }) => {
  const frame = useCurrentFrame();
  const offsetX = (frame * 17) % 100;
  const offsetY = (frame * 23) % 100;

  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundPosition: `${offsetX}px ${offsetY}px`,
        opacity,
        mixBlendMode: "overlay",
        pointerEvents: "none",
      }}
    />
  );
};

// ============================================================================
// CINEMATIC BACKGROUND - Deep, refined, atmospheric
// ============================================================================
const CinematicBackground: React.FC<{
  intensity?: number;
  focusY?: number;
}> = ({ intensity = 0.025, focusY = 50 }) => {
  const frame = useCurrentFrame();

  // Imperceptible drift for organic feel
  const drift = interpolate(frame, [0, 600], [0, 1.5], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Pure black base - premium foundation */}
      <AbsoluteFill style={{ background: COLORS.black }} />

      {/* Subtle depth layer */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 100% 100% at 50% 50%, ${COLORS.nearBlack} 0%, ${COLORS.black} 100%)`,
        }}
      />

      {/* Primary ambient glow - restrained, centered */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 50% at 50% ${focusY + drift}%, ${hexToRgba(COLORS.primary, intensity)} 0%, transparent 55%)`,
        }}
      />

      {/* Top edge - barely perceptible warmth */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${hexToRgba(COLORS.primary, intensity * 0.15)} 0%, transparent 20%)`,
        }}
      />

      {/* Deep cinematic vignette - draws focus to center */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 85% 75% at 50% 50%, transparent 25%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      <FilmGrain opacity={0.01} />
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 1: THE HOOK - Apple keynote style reveal
// Precise timing, deliberate motion, cinematic presence
// The first 2 seconds MUST hook - instant intrigue, premium feel
// ============================================================================
const IntroScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 0: Quicker power-on for stronger hook
  const powerOn = interpolate(
    frame,
    [fps * 0.05, fps * 0.25],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Central light point - brighter, faster expansion for drama
  const lightOpacity = interpolate(
    frame,
    [fps * 0.03, fps * 0.1, fps * 0.35, fps * 0.55],
    [0, 0.95, 0.35, 0],
    { extrapolateRight: "clamp" }
  );
  const lightScale = interpolate(
    frame,
    [fps * 0.03, fps * 0.55],
    [0, 5.5],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Horizontal reveal line - faster, more dramatic wipe
  const lineWidth = interpolate(
    frame,
    [fps * 0.06, fps * 0.35],
    [0, 850],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const lineOpacity = interpolate(
    frame,
    [fps * 0.06, fps * 0.12, fps * 0.45, fps * 0.65],
    [0, 0.9, 0.3, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Logo entrance - faster, confident
  const logoDelay = 0.22;
  const logoProgress = spring({
    frame: frame - logoDelay * fps,
    fps,
    config: { damping: 180, stiffness: 55, mass: 1.35 },
  });
  const logoOpacity = interpolate(
    frame,
    [logoDelay * fps, (logoDelay + 0.18) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const logoScale = interpolate(logoProgress, [0, 1], [0.7, 1]);
  const logoGlow = interpolate(
    frame,
    [fps * 0.35, fps * 0.7, fps * 1.5],
    [0, 55, 38],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // $FED text - enters with authority
  const textDelay = 0.45;
  const textProgress = spring({
    frame: frame - textDelay * fps,
    fps,
    config: { damping: 180, stiffness: 50, mass: 1.45 },
  });
  const textOpacity = interpolate(
    frame,
    [textDelay * fps, (textDelay + 0.2) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const textY = interpolate(textProgress, [0, 1], [22, 0]);
  const textScale = interpolate(textProgress, [0, 1], [0.92, 1]);

  // Tagline - quicker reveal, but still refined
  const tagDelay = 0.95;
  const tagOpacity = interpolate(
    frame,
    [tagDelay * fps, (tagDelay + 0.3) * fps],
    [0, 0.55],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const tagY = interpolate(
    frame,
    [tagDelay * fps, (tagDelay + 0.35) * fps],
    [8, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Background glow - builds with content
  const bgGlow = interpolate(
    frame,
    [fps * 0.15, fps * 1.4],
    [0.01, 0.035],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ opacity: powerOn }}>
      <CinematicBackground intensity={bgGlow} focusY={50} />

      {/* Light effects layer */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        {/* Central light point */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(255,255,255,0.95) 0%, ${hexToRgba(COLORS.primary, 0.6)} 25%, ${hexToRgba(COLORS.primary, 0.2)} 50%, transparent 70%)`,
            opacity: lightOpacity,
            transform: `scale(${lightScale})`,
            position: "absolute",
          }}
        />

        {/* Horizontal reveal line */}
        <div
          style={{
            width: lineWidth,
            height: 2,
            background: `linear-gradient(90deg, transparent 0%, ${hexToRgba(COLORS.primary, 0.3)} 15%, rgba(255,255,255,0.9) 50%, ${hexToRgba(COLORS.primary, 0.3)} 85%, transparent 100%)`,
            opacity: lineOpacity,
            position: "absolute",
            boxShadow: `0 0 30px ${hexToRgba(COLORS.primary, 0.35)}`,
          }}
        />
      </AbsoluteFill>

      {/* Main content */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
          }}
        >
          {/* Logo */}
          <div
            style={{
              transform: `scale(${logoScale})`,
              opacity: logoOpacity,
              filter: `drop-shadow(0 0 ${logoGlow}px ${hexToRgba(COLORS.primary, 0.55)})`,
            }}
          >
            <FedLogo size={100} glow={false} />
          </div>

          {/* $FED wordmark */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              opacity: textOpacity,
              transform: `translateY(${textY}px) scale(${textScale})`,
            }}
          >
            <span
              style={{
                fontSize: 52,
                fontWeight: 900,
                color: COLORS.primary,
                fontFamily: "system-ui, -apple-system, sans-serif",
                textShadow: `0 0 25px ${hexToRgba(COLORS.primary, 0.45)}`,
                marginRight: -2,
              }}
            >
              $
            </span>
            <span
              style={{
                fontSize: 52,
                fontWeight: 900,
                color: COLORS.white,
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -2.5,
                textShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
              }}
            >
              FED
            </span>
          </div>

          {/* Tagline */}
          <div
            style={{
              opacity: tagOpacity,
              transform: `translateY(${tagY}px)`,
              marginTop: 6,
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: COLORS.grayMid,
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: 4.5,
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              Quantitative Easing for the People
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 2: HEADLINE with dramatic BRRR payoff
// The money printer moment - words reveal cinematically, BRRR impacts with weight
// Refined for Apple-keynote level impact - measured anticipation, then powerful delivery
// ============================================================================
const HeadlineScene: React.FC<{ headline: string }> = ({ headline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = headline.split(" ");
  const brrrIndex = words.findIndex(w => w === "BRRR");

  // Scene fade - quick, confident entrance
  const sceneFade = interpolate(frame, [0, fps * 0.08], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Word timing - slower stagger for anticipation, pause before BRRR
  const wordStagger = 0.16;
  const brrrExtraDelay = 0.12; // Extra pause before BRRR for anticipation
  const brrrDelay = 0.06 + brrrIndex * wordStagger + brrrExtraDelay;
  const brrrLandTime = (brrrDelay + 0.06) * fps;

  // Subtle camera push on BRRR - slightly more dramatic
  const cameraScale = interpolate(
    frame,
    [brrrLandTime - fps * 0.02, brrrLandTime + fps * 0.04, brrrLandTime + fps * 0.35],
    [1, 1.025, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Background glow - builds tension, then flares dramatically on BRRR
  const bgGlow = interpolate(
    frame,
    [fps * 0.04, brrrLandTime - fps * 0.08, brrrLandTime, brrrLandTime + fps * 0.08, brrrLandTime + fps * 0.4, fps * 1.5],
    [0.012, 0.02, 0.025, 0.1, 0.05, 0.04],
    { extrapolateRight: "clamp" }
  );

  // Central flash on BRRR impact - brighter, faster
  const flashOpacity = interpolate(
    frame,
    [brrrLandTime - fps * 0.01, brrrLandTime + fps * 0.02, brrrLandTime + fps * 0.12],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const flashScale = interpolate(
    frame,
    [brrrLandTime - fps * 0.01, brrrLandTime + fps * 0.12],
    [0.2, 3.2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Expanding ring - single, elegant, faster expansion
  const ringOpacity = interpolate(
    frame,
    [brrrLandTime, brrrLandTime + fps * 0.04, brrrLandTime + fps * 0.4],
    [0.8, 0.4, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ringScale = interpolate(
    frame,
    [brrrLandTime, brrrLandTime + fps * 0.4],
    [0.15, 4.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Second ring for depth - slightly delayed
  const ring2Opacity = interpolate(
    frame,
    [brrrLandTime + fps * 0.03, brrrLandTime + fps * 0.08, brrrLandTime + fps * 0.5],
    [0, 0.3, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ring2Scale = interpolate(
    frame,
    [brrrLandTime + fps * 0.03, brrrLandTime + fps * 0.5],
    [0.1, 5.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground intensity={bgGlow} focusY={48} />

      {/* Light effects layer */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        {/* Central flash - pure white core */}
        <div
          style={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.8) 15%, ${hexToRgba(COLORS.primary, 0.5)} 35%, transparent 55%)`,
            opacity: flashOpacity,
            transform: `scale(${flashScale})`,
            position: "absolute",
          }}
        />

        {/* Primary expanding ring */}
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            border: `2px solid ${hexToRgba(COLORS.primary, 0.6)}`,
            opacity: ringOpacity,
            transform: `scale(${ringScale})`,
            position: "absolute",
            boxShadow: `0 0 25px ${hexToRgba(COLORS.primary, 0.35)}`,
          }}
        />

        {/* Secondary ring for depth */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            border: `1px solid ${hexToRgba(COLORS.primary, 0.4)}`,
            opacity: ring2Opacity,
            transform: `scale(${ring2Scale})`,
            position: "absolute",
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 60,
          transform: `scale(${cameraScale})`,
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0 24px",
            maxWidth: 950,
          }}
        >
          {words.map((word, index) => {
            // Add extra delay before BRRR for anticipation
            const baseDelay = 0.06 + index * wordStagger;
            const delay = index >= brrrIndex ? baseDelay + brrrExtraDelay : baseDelay;

            const wordProgress = spring({
              frame: frame - delay * fps,
              fps,
              config: { damping: 200, stiffness: 65, mass: 1.35 },
            });
            const wordOpacity = interpolate(
              frame,
              [delay * fps, (delay + 0.18) * fps],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const wordY = interpolate(wordProgress, [0, 1], [35, 0]);

            const isBrrr = word === "BRRR";

            // BRRR scale - dramatic entrance with satisfying overshoot then settle
            const brrrScale = isBrrr ? interpolate(
              frame,
              [delay * fps, (delay + 0.02) * fps, (delay + 0.08) * fps, (delay + 0.16) * fps, (delay + 0.28) * fps],
              [0.4, 1.28, 0.94, 1.02, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ) : 1;

            // BRRR glow - intense burst then settle
            const brrrGlow = isBrrr ? interpolate(
              frame,
              [(delay + 0.01) * fps, (delay + 0.06) * fps, (delay + 0.25) * fps, fps * 1.4],
              [0, 120, 55, 45],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ) : 0;

            // BRRR letter spacing - snaps in tight
            const brrrLetterSpacing = isBrrr ? interpolate(
              frame,
              [delay * fps, (delay + 0.06) * fps, (delay + 0.16) * fps],
              [12, -8, -5],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
            ) : -3;

            return (
              <span
                key={index}
                style={{
                  fontSize: isBrrr ? 88 : 60,
                  fontWeight: 900,
                  color: isBrrr ? COLORS.primary : COLORS.white,
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  opacity: wordOpacity,
                  transform: `translateY(${wordY}px) scale(${brrrScale})`,
                  display: "inline-block",
                  letterSpacing: brrrLetterSpacing,
                  lineHeight: 1.15,
                  textShadow: isBrrr
                    ? `0 0 ${brrrGlow}px ${hexToRgba(COLORS.primary, 0.55)}, 0 5px 45px rgba(0, 0, 0, 0.5)`
                    : "0 4px 35px rgba(0, 0, 0, 0.5)",
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============================================================================
// STAT CARD - Premium glass morphism with buttery smooth counting animation
// Refined for maximum sophistication - numbers feel weighty and satisfying
// ============================================================================
const StatCard: React.FC<{
  stat: StatsUpdateProps["stats"][0];
  delay: number;
  index: number;
}> = ({ stat, delay, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card entrance - smooth slide up with perfect damping
  const cardProgress = spring({
    frame: frame - delay * fps,
    fps,
    config: { damping: 180, stiffness: 45, mass: 1.5 },
  });

  const cardOpacity = interpolate(
    frame,
    [delay * fps, (delay + 0.22) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const cardY = interpolate(cardProgress, [0, 1], [45, 0]);
  const cardScale = interpolate(cardProgress, [0, 1], [0.94, 1]);

  // Number counting with premium quintic easing - accelerates then decelerates beautifully
  const countDuration = 1.4;
  const countStart = delay + 0.15;
  const numberProgress = interpolate(
    frame,
    [countStart * fps, (countStart + countDuration) * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      // Custom easing: slow start, fast middle, elegant deceleration at end
      easing: (t) => {
        if (t < 0.15) return t * t * 4; // Slow acceleration
        if (t < 0.85) return 0.09 + (t - 0.15) * 1.2; // Fast middle
        return 0.93 + (1 - Math.pow(1 - (t - 0.85) / 0.15, 3)) * 0.07; // Smooth deceleration
      },
    }
  );

  const numericValue = stat.numericValue ?? (parseFloat(stat.value.replace(/[^0-9.]/g, "")) || 0);
  // Smooth final approach - the last few digits slow down elegantly
  const displayValue = numberProgress > 0.98
    ? numericValue
    : Math.floor(numericValue * numberProgress);

  const prefix = stat.prefix ?? (stat.value.startsWith("$") ? "$" : "");
  const suffix = stat.suffix ?? (stat.value.includes("+") ? "+" : "");

  // Landing state detection
  const hasLanded = numberProgress >= 0.98;
  const landTime = (countStart + countDuration) * fps;

  // Land pulse - satisfying pop with quick settle
  const landPulse = hasLanded ? interpolate(
    frame,
    [landTime - fps * 0.01, landTime + fps * 0.06, landTime + fps * 0.15, landTime + fps * 0.3],
    [1, 1.06, 0.98, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 1;

  // Number glow - builds during count, bursts on land, settles to subtle
  const numberGlow = hasLanded ? interpolate(
    frame,
    [landTime - fps * 0.02, landTime + fps * 0.06, landTime + fps * 0.4],
    [12, 40, 15],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : interpolate(
    frame,
    [(countStart + 0.15) * fps, landTime],
    [0, 12],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Top accent bar - sweeps across with purpose
  const accentWidth = interpolate(
    frame,
    [(delay + 0.1) * fps, (delay + 0.45) * fps],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Border glow - subtle pulse on land
  const borderOpacity = hasLanded ? interpolate(
    frame,
    [landTime - fps * 0.02, landTime + fps * 0.08, landTime + fps * 0.35],
    [0.05, 0.12, 0.06],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : 0.05;

  // Label fades in after card settles
  const labelOpacity = interpolate(
    frame,
    [(delay + 0.25) * fps, (delay + 0.42) * fps],
    [0, 0.9],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Color mapping - use unified, sophisticated palette
  const accentColor = stat.color === "#00ff88" ? COLORS.primary :
                      stat.color === "#00d4ff" ? COLORS.secondary :
                      stat.color === "#ff6b9d" ? "#e06090" : stat.color;

  return (
    <div
      style={{
        transform: `translateY(${cardY}px) scale(${cardScale})`,
        opacity: cardOpacity,
        position: "relative",
      }}
    >
      <div
        style={{
          padding: "30px 42px",
          background: `linear-gradient(168deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.015) 40%, rgba(255,255,255,0.005) 100%)`,
          borderRadius: 16,
          minWidth: 275,
          position: "relative",
          overflow: "hidden",
          border: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
          boxShadow: `
            0 30px 70px rgba(0, 0, 0, 0.5),
            0 10px 25px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.06)
          `,
        }}
      >
        {/* Top glass shine - subtle reflection */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "40%",
            background: "linear-gradient(180deg, rgba(255,255,255,0.035) 0%, transparent 100%)",
            borderRadius: "16px 16px 0 0",
            pointerEvents: "none",
          }}
        />

        {/* Top accent bar - elegant sweep */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${accentWidth}%`,
            height: 2,
            background: `linear-gradient(90deg, ${accentColor} 0%, ${hexToRgba(accentColor, 0.7)} 60%, transparent 100%)`,
            borderRadius: "16px 0 0 0",
            boxShadow: `0 0 14px ${hexToRgba(accentColor, 0.35)}`,
          }}
        />

        {/* Number - the hero element */}
        <div
          style={{
            fontSize: 54,
            fontWeight: 900,
            color: COLORS.white,
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: -2.5,
            lineHeight: 1,
            marginBottom: 14,
            transform: `scale(${landPulse})`,
            transformOrigin: "left center",
            filter: `drop-shadow(0 0 ${numberGlow}px ${hexToRgba(accentColor, 0.4)})`,
          }}
        >
          <span style={{ color: accentColor, marginRight: -1 }}>
            {prefix}
          </span>
          {displayValue.toLocaleString()}
          <span
            style={{
              color: COLORS.grayMid,
              fontSize: 20,
              fontWeight: 800,
              marginLeft: 4,
            }}
          >
            {suffix}
          </span>
        </div>

        {/* Label - understated, supportive */}
        <div style={{ opacity: labelOpacity }}>
          <div
            style={{
              fontSize: 10,
              color: COLORS.grayMid,
              fontFamily: "system-ui, -apple-system, sans-serif",
              textTransform: "uppercase",
              letterSpacing: 2.5,
              fontWeight: 600,
            }}
          >
            {stat.label}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SCENE 3: STATS SHOWCASE - Refined layout with perfect rhythm
// The heart of the video - impressive numbers revealed with precision
// ============================================================================
const StatsScene: React.FC<{ stats: StatsUpdateProps["stats"] }> = ({ stats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Quick, confident entrance
  const sceneFade = interpolate(frame, [0, fps * 0.08], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Slightly tighter stagger for more energy
  const cardStagger = 0.26;

  // Header - subtle, anchors the stats
  const headerOpacity = interpolate(frame, [fps * 0.03, fps * 0.16], [0, 0.65], {
    extrapolateRight: "clamp",
  });
  const headerY = interpolate(
    frame,
    [fps * 0.03, fps * 0.2],
    [10, 0],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Background glow - builds with card reveals, peaks, then settles
  const bgGlow = interpolate(
    frame,
    [fps * 0.08, fps * 1.8, fps * 3.2],
    [0.012, 0.05, 0.038],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground intensity={bgGlow} focusY={48} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 50,
          flexDirection: "column",
          gap: 38,
        }}
      >
        {/* Header */}
        <div
          style={{
            opacity: headerOpacity,
            transform: `translateY(${headerY}px)`,
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: COLORS.grayMid,
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 5,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Live Metrics
          </span>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: 24,
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 920,
          }}
        >
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              stat={stat}
              delay={0.18 + index * cardStagger}
              index={index}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 4: CTA - Commanding, confident close
// Apple keynote energy - the domain emerges as the hero with gravitas
// Perfect spacing, measured timing, unforgettable finish
// ============================================================================
const CTAScene: React.FC<{ tagline: string; cta: string }> = ({ tagline, cta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Quick, confident scene entrance
  const sceneFade = interpolate(frame, [0, fps * 0.1], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Background glow - builds presence
  const bgIntensity = interpolate(
    frame,
    [0, fps * 1.2, fps * 2.2],
    [0.015, 0.05, 0.04],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Logo entrance - small, confident, anchors the composition
  const logoProgress = spring({
    frame: frame - fps * 0.08,
    fps,
    config: { damping: 200, stiffness: 55, mass: 1.3 },
  });
  const logoOpacity = interpolate(frame, [fps * 0.08, fps * 0.26], [0, 1], {
    extrapolateRight: "clamp",
  });
  const logoScale = interpolate(logoProgress, [0, 1], [0.75, 1]);
  const logoGlow = interpolate(
    frame,
    [fps * 0.25, fps * 0.6, fps * 1.5],
    [0, 35, 28],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Hero domain name - THE moment of the entire video
  const domainDelay = fps * 0.32;
  const domainProgress = spring({
    frame: frame - domainDelay,
    fps,
    config: { damping: 170, stiffness: 50, mass: 1.4 },
  });
  const domainOpacity = interpolate(
    frame,
    [domainDelay, domainDelay + fps * 0.22],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const domainY = interpolate(domainProgress, [0, 1], [30, 0]);
  const domainScale = interpolate(domainProgress, [0, 1], [0.88, 1]);

  // Domain land pulse - satisfying settle
  const domainLandTime = domainDelay + fps * 0.32;
  const domainLandPulse = frame > domainLandTime ? interpolate(
    frame,
    [domainLandTime, domainLandTime + fps * 0.06, domainLandTime + fps * 0.14, domainLandTime + fps * 0.28],
    [1, 1.04, 0.99, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 1;

  // Domain glow - builds majestically
  const domainGlow = interpolate(
    frame,
    [domainDelay + fps * 0.18, fps * 1.0, fps * 2.0],
    [0, 50, 38],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Underline - elegant sweep from center
  const underlineDelay = domainDelay + fps * 0.25;
  const underlineWidth = interpolate(
    frame,
    [underlineDelay, underlineDelay + fps * 0.35],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const underlineOpacity = interpolate(
    frame,
    [underlineDelay, underlineDelay + fps * 0.15],
    [0, 0.6],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Tagline - the value prop
  const taglineDelay = domainDelay + fps * 0.4;
  const taglineOpacity = interpolate(
    frame,
    [taglineDelay, taglineDelay + fps * 0.25],
    [0, 0.85],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const taglineY = interpolate(
    frame,
    [taglineDelay, taglineDelay + fps * 0.3],
    [10, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Bottom text - the differentiator
  const bottomDelay = taglineDelay + fps * 0.28;
  const bottomOpacity = interpolate(
    frame,
    [bottomDelay, bottomDelay + fps * 0.25],
    [0, 0.6],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const bottomY = interpolate(
    frame,
    [bottomDelay, bottomDelay + fps * 0.3],
    [8, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Side lines - frame the bottom text elegantly
  const sideLineWidth = interpolate(
    frame,
    [bottomDelay + fps * 0.1, bottomDelay + fps * 0.45],
    [0, 80],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground intensity={bgIntensity} focusY={50} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
          flexDirection: "column",
        }}
      >
        {/* Logo - small anchor */}
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              transform: `scale(${logoScale})`,
              opacity: logoOpacity,
              filter: `drop-shadow(0 0 ${logoGlow}px ${hexToRgba(COLORS.primary, 0.45)})`,
            }}
          >
            <FedLogo size={56} glow={false} />
          </div>
        </div>

        {/* Hero domain name - massive, commanding */}
        <div
          style={{
            opacity: domainOpacity,
            transform: `translateY(${domainY}px) scale(${domainScale * domainLandPulse})`,
            position: "relative",
          }}
        >
          <span
            style={{
              fontSize: 62,
              fontWeight: 900,
              color: COLORS.white,
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: -2,
              textShadow: `0 0 ${domainGlow}px ${hexToRgba(COLORS.primary, 0.35)}, 0 8px 40px rgba(0, 0, 0, 0.5)`,
            }}
          >
            {cta}
          </span>
          {/* Underline - elegant accent */}
          <div
            style={{
              position: "absolute",
              bottom: -6,
              left: "50%",
              transform: "translateX(-50%)",
              width: `${underlineWidth}%`,
              height: 2.5,
              background: `linear-gradient(90deg, transparent 0%, ${hexToRgba(COLORS.primary, 0.5)} 20%, ${hexToRgba(COLORS.primary, 0.65)} 50%, ${hexToRgba(COLORS.primary, 0.5)} 80%, transparent 100%)`,
              opacity: underlineOpacity,
              borderRadius: 2,
              boxShadow: `0 0 14px ${hexToRgba(COLORS.primary, 0.2)}`,
            }}
          />
        </div>

        {/* Tagline - clear value prop */}
        <div
          style={{
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
            marginTop: 18,
          }}
        >
          <span
            style={{
              fontSize: 18,
              color: COLORS.grayLight,
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 400,
              letterSpacing: 0.3,
            }}
          >
            {tagline}
          </span>
        </div>

        {/* Bottom text with side lines - differentiator */}
        <div
          style={{
            opacity: bottomOpacity,
            transform: `translateY(${bottomY}px)`,
            marginTop: 28,
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <div
            style={{
              width: sideLineWidth,
              height: 1,
              background: `linear-gradient(270deg, ${hexToRgba(COLORS.primary, 0.28)}, transparent)`,
            }}
          />
          <span
            style={{
              fontSize: 10,
              color: COLORS.grayMid,
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 4.5,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Real yield. Every 2 minutes.
          </span>
          <div
            style={{
              width: sideLineWidth,
              height: 1,
              background: `linear-gradient(90deg, ${hexToRgba(COLORS.primary, 0.28)}, transparent)`,
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============================================================================
// MAIN COMPOSITION - 10 seconds with perfect scene timing
// Hook -> Punch -> Showcase -> Close
// Each scene gets the time it needs to breathe and land
// ============================================================================
export const StatsUpdate: React.FC<StatsUpdateProps> = ({
  headline,
  stats,
  tagline,
  cta,
}) => {
  const { fps } = useVideoConfig();

  // Elegant crossfade transitions - quick but smooth
  const transitionFrames = Math.round(0.28 * fps);

  return (
    <TransitionSeries>
      {/* Intro: 1.9s - Logo reveal, strong hook */}
      <TransitionSeries.Sequence durationInFrames={Math.round(1.9 * fps)}>
        <IntroScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* Headline: 1.9s - BRRR moment with impact and room to breathe */}
      <TransitionSeries.Sequence durationInFrames={Math.round(1.9 * fps)}>
        <HeadlineScene headline={headline} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* Stats: 3.8s - Numbers count with breathing room */}
      <TransitionSeries.Sequence durationInFrames={Math.round(3.8 * fps)}>
        <StatsScene stats={stats} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* CTA: 2.6s - Confident close with domain as hero */}
      <TransitionSeries.Sequence durationInFrames={Math.round(2.6 * fps)}>
        <CTAScene tagline={tagline} cta={cta} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
