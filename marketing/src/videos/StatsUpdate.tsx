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
// DESIGN SYSTEM - Refined palette for Apple-keynote sophistication
// ============================================================================
const COLORS = {
  // Backgrounds - deeper blacks for premium feel
  black: "#000000",
  nearBlack: "#020202",
  darkGray: "#080808",

  // Primary accent - FED green (refined, less saturated for elegance)
  primary: "#00d070",
  primaryMuted: "#00a858",
  primaryGlow: "rgba(0, 208, 112, 0.45)",

  // Secondary accent - cyan (very subtle, for contrast)
  secondary: "#00b8d4",

  // Text - pure white headlines, refined grays
  white: "#ffffff",
  offWhite: "#f5f5f5",
  grayLight: "#909090",
  grayMid: "#606060",
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
// IMPROVED: Added subtle secondary color wash and refined vignette
// ============================================================================
const CinematicBackground: React.FC<{
  intensity?: number;
  focusY?: number;
}> = ({ intensity = 0.025, focusY = 50 }) => {
  const frame = useCurrentFrame();

  // Imperceptible drift for organic feel - slightly slower for elegance
  const drift = interpolate(frame, [0, 720], [0, 1.5], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Pure black base - premium foundation */}
      <AbsoluteFill style={{ background: COLORS.black }} />

      {/* Subtle depth layer with slight noise */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 100% 100% at 50% 50%, ${COLORS.nearBlack} 0%, ${COLORS.black} 100%)`,
        }}
      />

      {/* Primary ambient glow - restrained, centered with refined falloff */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 72% 50% at 50% ${focusY + drift}%, ${hexToRgba(COLORS.primary, intensity)} 0%, ${hexToRgba(COLORS.primary, intensity * 0.3)} 35%, transparent 55%)`,
        }}
      />

      {/* Ultra-subtle secondary accent wash - adds depth without distraction */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 45% 35% at 65% ${55 + drift * 0.5}%, ${hexToRgba(COLORS.secondary, intensity * 0.08)} 0%, transparent 45%)`,
        }}
      />

      {/* Secondary subtle top wash - refined positioning */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 85% 14% at 50% 0%, ${hexToRgba(COLORS.primary, intensity * 0.08)} 0%, transparent 35%)`,
        }}
      />

      {/* Subtle bottom glow - grounds the composition */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 18% at 50% 100%, ${hexToRgba(COLORS.primary, intensity * 0.05)} 0%, transparent 40%)`,
        }}
      />

      {/* Deep cinematic vignette - refined falloff */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 85% 75% at 50% 50%, transparent 25%, rgba(0,0,0,0.72) 100%)",
        }}
      />

      <FilmGrain opacity={0.007} />
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 1: THE HOOK - Apple keynote style reveal
// Precise timing, deliberate motion, cinematic presence
// The first 2 seconds MUST hook - instant intrigue, premium feel
// IMPROVED: More refined flicker timing, smoother light burst, premium lens flare
// ============================================================================
const IntroScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 0: Cinematic power-on with organic, film-like flicker
  // Slower, more deliberate timing creates anticipation without feeling glitchy
  const flicker = frame < fps * 0.04 ? 0 :
    frame < fps * 0.06 ? 0.08 :
    frame < fps * 0.08 ? 0.02 :
    frame < fps * 0.10 ? 0.18 :
    frame < fps * 0.12 ? 0.05 :
    frame < fps * 0.14 ? 0.35 : 1;

  const powerOn = interpolate(
    frame,
    [fps * 0.14, fps * 0.35],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }
  ) * (frame < fps * 0.14 ? flicker : 1);

  // Central light point - softer build, more cinematic
  const lightOpacity = interpolate(
    frame,
    [fps * 0.03, fps * 0.12, fps * 0.35, fps * 0.55],
    [0, 0.85, 0.35, 0],
    { extrapolateRight: "clamp" }
  );
  const lightScale = interpolate(
    frame,
    [fps * 0.03, fps * 0.55],
    [0.02, 4.2],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }
  );

  // Secondary ring burst - softer, more diffused
  const ring2Opacity = interpolate(
    frame,
    [fps * 0.06, fps * 0.15, fps * 0.45, fps * 0.65],
    [0, 0.4, 0.15, 0],
    { extrapolateRight: "clamp" }
  );
  const ring2Scale = interpolate(
    frame,
    [fps * 0.06, fps * 0.65],
    [0.01, 5.2],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }
  );

  // Tertiary outer ring - ultra subtle for depth layering
  const ring3Opacity = interpolate(
    frame,
    [fps * 0.1, fps * 0.2, fps * 0.5, fps * 0.75],
    [0, 0.2, 0.08, 0],
    { extrapolateRight: "clamp" }
  );
  const ring3Scale = interpolate(
    frame,
    [fps * 0.1, fps * 0.75],
    [0.01, 6.5],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }
  );

  // Horizontal reveal line - tighter timing, more elegant
  const lineWidth = interpolate(
    frame,
    [fps * 0.05, fps * 0.38],
    [0, 850],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const lineOpacity = interpolate(
    frame,
    [fps * 0.05, fps * 0.12, fps * 0.45, fps * 0.62],
    [0, 0.9, 0.3, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Subtle vertical accent lines - premium detail
  const vertLineHeight = interpolate(
    frame,
    [fps * 0.08, fps * 0.42],
    [0, 180],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const vertLineOpacity = interpolate(
    frame,
    [fps * 0.08, fps * 0.15, fps * 0.5, fps * 0.7],
    [0, 0.35, 0.12, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Logo entrance - refined spring with better settling
  const logoDelay = 0.22;
  const logoProgress = spring({
    frame: frame - logoDelay * fps,
    fps,
    config: { damping: 180, stiffness: 55, mass: 1.3 },
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
    [0, 45, 32],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // $FED text - enters with commanding authority, tighter delay
  const textDelay = 0.42;
  const textProgress = spring({
    frame: frame - textDelay * fps,
    fps,
    config: { damping: 180, stiffness: 50, mass: 1.4 },
  });
  const textOpacity = interpolate(
    frame,
    [textDelay * fps, (textDelay + 0.2) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const textY = interpolate(textProgress, [0, 1], [18, 0]);
  const textScale = interpolate(textProgress, [0, 1], [0.92, 1]);

  // Tagline - refined reveal with better timing
  const tagDelay = 0.92;
  const tagOpacity = interpolate(
    frame,
    [tagDelay * fps, (tagDelay + 0.3) * fps],
    [0, 0.55],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const tagY = interpolate(
    frame,
    [tagDelay * fps, (tagDelay + 0.35) * fps],
    [5, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Background glow - more gradual build
  const bgGlow = interpolate(
    frame,
    [fps * 0.15, fps * 1.4],
    [0.006, 0.028],
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
        {/* Outermost ring - ultra diffuse */}
        <div
          style={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${hexToRgba(COLORS.primary, 0.18)} 0%, ${hexToRgba(COLORS.primary, 0.05)} 50%, transparent 70%)`,
            opacity: ring3Opacity,
            transform: `scale(${ring3Scale})`,
            position: "absolute",
          }}
        />

        {/* Secondary ring burst */}
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${hexToRgba(COLORS.primary, 0.35)} 0%, ${hexToRgba(COLORS.primary, 0.12)} 45%, transparent 68%)`,
            opacity: ring2Opacity,
            transform: `scale(${ring2Scale})`,
            position: "absolute",
          }}
        />

        {/* Central light point - pure white core with softer edges */}
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.65) 18%, ${hexToRgba(COLORS.primary, 0.45)} 38%, ${hexToRgba(COLORS.primary, 0.12)} 58%, transparent 72%)`,
            opacity: lightOpacity,
            transform: `scale(${lightScale})`,
            position: "absolute",
          }}
        />

        {/* Horizontal reveal line */}
        <div
          style={{
            width: lineWidth,
            height: 1.5,
            background: `linear-gradient(90deg, transparent 0%, ${hexToRgba(COLORS.primary, 0.3)} 15%, rgba(255,255,255,0.92) 50%, ${hexToRgba(COLORS.primary, 0.3)} 85%, transparent 100%)`,
            opacity: lineOpacity,
            position: "absolute",
            boxShadow: `0 0 22px ${hexToRgba(COLORS.primary, 0.35)}`,
          }}
        />

        {/* Vertical accent lines - premium detail */}
        <div
          style={{
            width: 1,
            height: vertLineHeight,
            background: `linear-gradient(180deg, transparent 0%, ${hexToRgba(COLORS.primary, 0.25)} 30%, rgba(255,255,255,0.6) 50%, ${hexToRgba(COLORS.primary, 0.25)} 70%, transparent 100%)`,
            opacity: vertLineOpacity,
            position: "absolute",
            boxShadow: `0 0 12px ${hexToRgba(COLORS.primary, 0.2)}`,
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
            gap: 12,
          }}
        >
          {/* Logo */}
          <div
            style={{
              transform: `scale(${logoScale})`,
              opacity: logoOpacity,
              filter: `drop-shadow(0 0 ${logoGlow}px ${hexToRgba(COLORS.primary, 0.5)})`,
            }}
          >
            <FedLogo size={95} glow={false} />
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
                fontSize: 56,
                fontWeight: 900,
                color: COLORS.primary,
                fontFamily: "system-ui, -apple-system, sans-serif",
                textShadow: `0 0 22px ${hexToRgba(COLORS.primary, 0.5)}`,
                marginRight: -3,
              }}
            >
              $
            </span>
            <span
              style={{
                fontSize: 56,
                fontWeight: 900,
                color: COLORS.white,
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -3,
                textShadow: "0 5px 35px rgba(0, 0, 0, 0.55)",
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
              marginTop: 4,
            }}
          >
            <span
              style={{
                fontSize: 10.5,
                color: COLORS.grayMid,
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: 5,
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

  // Scene fade - crisp entrance
  const sceneFade = interpolate(frame, [0, fps * 0.06], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Word timing - deliberate stagger for anticipation, dramatic pause before BRRR
  const wordStagger = 0.14;
  const brrrExtraDelay = 0.18; // Extended pause before BRRR for maximum anticipation
  const brrrDelay = 0.05 + brrrIndex * wordStagger + brrrExtraDelay;
  const brrrLandTime = (brrrDelay + 0.05) * fps;

  // Camera push on BRRR - IMPROVED with more cinematic scale and timing
  const cameraScale = interpolate(
    frame,
    [brrrLandTime - fps * 0.03, brrrLandTime + fps * 0.04, brrrLandTime + fps * 0.12, brrrLandTime + fps * 0.38],
    [1, 1.028, 1.012, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Background glow - builds tension, then flares on BRRR
  const bgGlow = interpolate(
    frame,
    [fps * 0.03, brrrLandTime - fps * 0.1, brrrLandTime, brrrLandTime + fps * 0.06, brrrLandTime + fps * 0.35, fps * 1.4],
    [0.01, 0.018, 0.022, 0.09, 0.045, 0.038],
    { extrapolateRight: "clamp" }
  );

  // Central flash on BRRR impact - pure white burst
  const flashOpacity = interpolate(
    frame,
    [brrrLandTime - fps * 0.01, brrrLandTime + fps * 0.015, brrrLandTime + fps * 0.1],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const flashScale = interpolate(
    frame,
    [brrrLandTime - fps * 0.01, brrrLandTime + fps * 0.1],
    [0.15, 3],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Primary expanding ring - crisp and fast
  const ringOpacity = interpolate(
    frame,
    [brrrLandTime, brrrLandTime + fps * 0.03, brrrLandTime + fps * 0.35],
    [0.85, 0.45, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ringScale = interpolate(
    frame,
    [brrrLandTime, brrrLandTime + fps * 0.35],
    [0.12, 4.2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Secondary ring - adds depth
  const ring2Opacity = interpolate(
    frame,
    [brrrLandTime + fps * 0.025, brrrLandTime + fps * 0.07, brrrLandTime + fps * 0.45],
    [0, 0.35, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ring2Scale = interpolate(
    frame,
    [brrrLandTime + fps * 0.025, brrrLandTime + fps * 0.45],
    [0.08, 5.2],
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
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(255,255,255,0.99) 0%, rgba(255,255,255,0.85) 12%, ${hexToRgba(COLORS.primary, 0.55)} 32%, transparent 52%)`,
            opacity: flashOpacity,
            transform: `scale(${flashScale})`,
            position: "absolute",
          }}
        />

        {/* Primary expanding ring */}
        <div
          style={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            border: `1.5px solid ${hexToRgba(COLORS.primary, 0.65)}`,
            opacity: ringOpacity,
            transform: `scale(${ringScale})`,
            position: "absolute",
            boxShadow: `0 0 20px ${hexToRgba(COLORS.primary, 0.4)}`,
          }}
        />

        {/* Secondary ring for depth */}
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: "50%",
            border: `1px solid ${hexToRgba(COLORS.primary, 0.35)}`,
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
          padding: 55,
          transform: `scale(${cameraScale})`,
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0 22px",
            maxWidth: 920,
          }}
        >
          {words.map((word, index) => {
            // Extra delay before BRRR for anticipation
            const baseDelay = 0.05 + index * wordStagger;
            const delay = index >= brrrIndex ? baseDelay + brrrExtraDelay : baseDelay;

            const wordProgress = spring({
              frame: frame - delay * fps,
              fps,
              config: { damping: 200, stiffness: 70, mass: 1.25 },
            });
            const wordOpacity = interpolate(
              frame,
              [delay * fps, (delay + 0.15) * fps],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const wordY = interpolate(wordProgress, [0, 1], [32, 0]);

            const isBrrr = word === "BRRR";

            // BRRR scale - IMPROVED dramatic pop with tighter keyframes
            const brrrScale = isBrrr ? interpolate(
              frame,
              [delay * fps, (delay + 0.02) * fps, (delay + 0.08) * fps, (delay + 0.15) * fps, (delay + 0.28) * fps],
              [0.4, 1.38, 0.94, 1.04, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ) : 1;

            // BRRR glow - IMPROVED intense burst with faster decay
            const brrrGlow = isBrrr ? interpolate(
              frame,
              [(delay + 0.01) * fps, (delay + 0.06) * fps, (delay + 0.18) * fps, fps * 1.2],
              [0, 140, 55, 38],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ) : 0;

            // BRRR letter spacing - IMPROVED tighter snap
            const brrrLetterSpacing = isBrrr ? interpolate(
              frame,
              [delay * fps, (delay + 0.04) * fps, (delay + 0.12) * fps],
              [16, -10, -7],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
            ) : -3;

            return (
              <span
                key={index}
                style={{
                  fontSize: isBrrr ? 92 : 58,
                  fontWeight: 900,
                  color: isBrrr ? COLORS.primary : COLORS.white,
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  opacity: wordOpacity,
                  transform: `translateY(${wordY}px) scale(${brrrScale})`,
                  display: "inline-block",
                  letterSpacing: brrrLetterSpacing,
                  lineHeight: 1.12,
                  textShadow: isBrrr
                    ? `0 0 ${brrrGlow}px ${hexToRgba(COLORS.primary, 0.5)}, 0 6px 50px rgba(0, 0, 0, 0.55)`
                    : "0 5px 40px rgba(0, 0, 0, 0.55)",
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

  // Card entrance - IMPROVED smooth slide up with refined spring
  const cardProgress = spring({
    frame: frame - delay * fps,
    fps,
    config: { damping: 170, stiffness: 48, mass: 1.4 },
  });

  const cardOpacity = interpolate(
    frame,
    [delay * fps, (delay + 0.22) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const cardY = interpolate(cardProgress, [0, 1], [38, 0]);
  const cardScale = interpolate(cardProgress, [0, 1], [0.94, 1]);

  // Number counting with IMPROVED premium easing - cinematic deceleration
  const countDuration = 1.4;
  const countStart = delay + 0.15;
  const numberProgress = interpolate(
    frame,
    [countStart * fps, (countStart + countDuration) * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      // Refined easing: smooth acceleration, sustained velocity, then elegant cinematic brake
      easing: (t) => {
        if (t < 0.08) return t * t * 12; // Smooth acceleration from 0
        if (t < 0.7) return 0.0768 + (t - 0.08) * 1.38; // Fast, satisfying count
        // Final 30%: luxurious exponential ease-out for cinematic landing
        const x = (t - 0.7) / 0.3;
        return 0.9316 + (1 - Math.pow(1 - x, 6)) * 0.0684;
      },
    }
  );

  const numericValue = stat.numericValue ?? (parseFloat(stat.value.replace(/[^0-9.]/g, "")) || 0);
  // Snap to final value at 99.5% for clean landing
  const displayValue = numberProgress > 0.995
    ? numericValue
    : Math.floor(numericValue * numberProgress);

  const prefix = stat.prefix ?? (stat.value.startsWith("$") ? "$" : "");
  const suffix = stat.suffix ?? (stat.value.includes("+") ? "+" : "");

  // Landing state detection
  const hasLanded = numberProgress >= 0.995;
  const landTime = (countStart + countDuration) * fps;

  // Land pulse - IMPROVED satisfying pop with tighter settle timing
  const landPulse = hasLanded ? interpolate(
    frame,
    [landTime - fps * 0.015, landTime + fps * 0.04, landTime + fps * 0.10, landTime + fps * 0.18],
    [1, 1.065, 0.988, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 1;

  // Number glow - builds during count, bursts on land, settles elegantly
  const numberGlow = hasLanded ? interpolate(
    frame,
    [landTime - fps * 0.02, landTime + fps * 0.05, landTime + fps * 0.35],
    [10, 38, 14],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : interpolate(
    frame,
    [(countStart + 0.12) * fps, landTime],
    [0, 10],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Top accent bar - elegant sweep
  const accentWidth = interpolate(
    frame,
    [(delay + 0.08) * fps, (delay + 0.4) * fps],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Border glow - subtle pulse on land
  const borderOpacity = hasLanded ? interpolate(
    frame,
    [landTime - fps * 0.02, landTime + fps * 0.06, landTime + fps * 0.3],
    [0.04, 0.11, 0.055],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : 0.04;

  // Label fades in after card settles
  const labelOpacity = interpolate(
    frame,
    [(delay + 0.22) * fps, (delay + 0.38) * fps],
    [0, 0.95],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Shimmer effect - IMPROVED subtle sweep across card with refined timing
  const shimmerProgress = interpolate(
    frame,
    [(delay + 0.2) * fps, (delay + 0.72) * fps],
    [-35, 135],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const shimmerOpacity = interpolate(
    frame,
    [(delay + 0.2) * fps, (delay + 0.38) * fps, (delay + 0.58) * fps, (delay + 0.72) * fps],
    [0, 0.15, 0.1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Color mapping - use unified, sophisticated palette
  const accentColor = stat.color === "#00ff88" ? COLORS.primary :
                      stat.color === "#00d4ff" ? COLORS.secondary :
                      stat.color === "#ff6b9d" ? "#e05888" : stat.color;

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
          padding: "28px 40px",
          background: `linear-gradient(165deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.018) 35%, rgba(255,255,255,0.006) 100%)`,
          borderRadius: 14,
          minWidth: 265,
          position: "relative",
          overflow: "hidden",
          border: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
          boxShadow: `
            0 28px 65px rgba(0, 0, 0, 0.55),
            0 8px 22px rgba(0, 0, 0, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.07)
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
            height: "38%",
            background: "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)",
            borderRadius: "14px 14px 0 0",
            pointerEvents: "none",
          }}
        />

        {/* Shimmer sweep - premium glass effect */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: `${shimmerProgress}%`,
            width: "25%",
            height: "100%",
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
            opacity: shimmerOpacity,
            pointerEvents: "none",
            transform: "skewX(-15deg)",
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
            background: `linear-gradient(90deg, ${accentColor} 0%, ${hexToRgba(accentColor, 0.65)} 55%, transparent 100%)`,
            borderRadius: "14px 0 0 0",
            boxShadow: `0 0 12px ${hexToRgba(accentColor, 0.4)}`,
          }}
        />

        {/* Number - the hero element */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 900,
            color: COLORS.white,
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: -2.8,
            lineHeight: 1,
            marginBottom: 12,
            transform: `scale(${landPulse})`,
            transformOrigin: "left center",
            filter: `drop-shadow(0 0 ${numberGlow}px ${hexToRgba(accentColor, 0.45)})`,
          }}
        >
          <span style={{ color: accentColor, marginRight: -2 }}>
            {prefix}
          </span>
          {displayValue.toLocaleString()}
          <span
            style={{
              color: COLORS.grayMid,
              fontSize: 18,
              fontWeight: 800,
              marginLeft: 3,
            }}
          >
            {suffix}
          </span>
        </div>

        {/* Label - understated, supportive */}
        <div style={{ opacity: labelOpacity }}>
          <div
            style={{
              fontSize: 9.5,
              color: COLORS.grayMid,
              fontFamily: "system-ui, -apple-system, sans-serif",
              textTransform: "uppercase",
              letterSpacing: 2.8,
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
// IMPROVED: Better stagger timing, refined header, enhanced glow dynamics
// ============================================================================
const StatsScene: React.FC<{ stats: StatsUpdateProps["stats"] }> = ({ stats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Crisp entrance - slightly longer for elegance
  const sceneFade = interpolate(frame, [0, fps * 0.08], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // IMPROVED: Slightly longer stagger for each card to breathe
  const cardStagger = 0.28;

  // Header - subtle anchor with refined timing
  const headerOpacity = interpolate(frame, [fps * 0.03, fps * 0.16], [0, 0.65], {
    extrapolateRight: "clamp",
  });
  const headerY = interpolate(
    frame,
    [fps * 0.03, fps * 0.2],
    [10, 0],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Background glow - IMPROVED dynamics with subtle peak on each card landing
  const bgGlow = interpolate(
    frame,
    [fps * 0.08, fps * 0.8, fps * 1.8, fps * 3.2],
    [0.008, 0.035, 0.052, 0.038],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground intensity={bgGlow} focusY={48} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 48,
          flexDirection: "column",
          gap: 35,
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
              fontSize: 10.5,
              color: COLORS.grayMid,
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 5.5,
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
            gap: 22,
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 900,
          }}
        >
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              stat={stat}
              delay={0.15 + index * cardStagger}
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

  // Crisp scene entrance
  const sceneFade = interpolate(frame, [0, fps * 0.08], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Background glow - builds presence majestically
  const bgIntensity = interpolate(
    frame,
    [0, fps * 1.0, fps * 2.0],
    [0.012, 0.048, 0.038],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Logo entrance - confident anchor
  const logoProgress = spring({
    frame: frame - fps * 0.06,
    fps,
    config: { damping: 200, stiffness: 60, mass: 1.2 },
  });
  const logoOpacity = interpolate(frame, [fps * 0.06, fps * 0.22], [0, 1], {
    extrapolateRight: "clamp",
  });
  const logoScale = interpolate(logoProgress, [0, 1], [0.7, 1]);
  const logoGlow = interpolate(
    frame,
    [fps * 0.2, fps * 0.55, fps * 1.4],
    [0, 32, 25],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Hero domain name - THE moment of the entire video
  const domainDelay = fps * 0.28;
  const domainProgress = spring({
    frame: frame - domainDelay,
    fps,
    config: { damping: 180, stiffness: 55, mass: 1.3 },
  });
  const domainOpacity = interpolate(
    frame,
    [domainDelay, domainDelay + fps * 0.2],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const domainY = interpolate(domainProgress, [0, 1], [28, 0]);
  const domainScale = interpolate(domainProgress, [0, 1], [0.85, 1]);

  // Domain land pulse - IMPROVED satisfying settle with tighter timing
  const domainLandTime = domainDelay + fps * 0.26;
  const domainLandPulse = frame > domainLandTime ? interpolate(
    frame,
    [domainLandTime, domainLandTime + fps * 0.045, domainLandTime + fps * 0.10, domainLandTime + fps * 0.2],
    [1, 1.045, 0.99, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 1;

  // Domain glow - IMPROVED builds with tighter timing
  const domainGlow = interpolate(
    frame,
    [domainDelay + fps * 0.12, fps * 0.85, fps * 1.7],
    [0, 48, 32],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Underline - elegant sweep from center
  const underlineDelay = domainDelay + fps * 0.22;
  const underlineWidth = interpolate(
    frame,
    [underlineDelay, underlineDelay + fps * 0.32],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const underlineOpacity = interpolate(
    frame,
    [underlineDelay, underlineDelay + fps * 0.12],
    [0, 0.65],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Tagline - the value prop
  const taglineDelay = domainDelay + fps * 0.38;
  const taglineOpacity = interpolate(
    frame,
    [taglineDelay, taglineDelay + fps * 0.22],
    [0, 0.9],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const taglineY = interpolate(
    frame,
    [taglineDelay, taglineDelay + fps * 0.28],
    [8, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Bottom text - the differentiator
  const bottomDelay = taglineDelay + fps * 0.25;
  const bottomOpacity = interpolate(
    frame,
    [bottomDelay, bottomDelay + fps * 0.22],
    [0, 0.65],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const bottomY = interpolate(
    frame,
    [bottomDelay, bottomDelay + fps * 0.28],
    [6, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Side lines - frame the bottom text elegantly
  const sideLineWidth = interpolate(
    frame,
    [bottomDelay + fps * 0.08, bottomDelay + fps * 0.4],
    [0, 75],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground intensity={bgIntensity} focusY={50} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 14,
          flexDirection: "column",
        }}
      >
        {/* Logo - confident anchor */}
        <div style={{ marginBottom: 14 }}>
          <div
            style={{
              transform: `scale(${logoScale})`,
              opacity: logoOpacity,
              filter: `drop-shadow(0 0 ${logoGlow}px ${hexToRgba(COLORS.primary, 0.5)})`,
            }}
          >
            <FedLogo size={52} glow={false} />
          </div>
        </div>

        {/* Hero domain name - massive, commanding with refined typography */}
        <div
          style={{
            opacity: domainOpacity,
            transform: `translateY(${domainY}px) scale(${domainScale * domainLandPulse})`,
            position: "relative",
          }}
        >
          <span
            style={{
              fontSize: 68,
              fontWeight: 900,
              color: COLORS.white,
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: -3,
              textShadow: `0 0 ${domainGlow}px ${hexToRgba(COLORS.primary, 0.38)}, 0 8px 40px rgba(0, 0, 0, 0.5)`,
            }}
          >
            {cta}
          </span>
          {/* Underline - elegant accent */}
          <div
            style={{
              position: "absolute",
              bottom: -5,
              left: "50%",
              transform: "translateX(-50%)",
              width: `${underlineWidth}%`,
              height: 2,
              background: `linear-gradient(90deg, transparent 0%, ${hexToRgba(COLORS.primary, 0.55)} 18%, ${hexToRgba(COLORS.primary, 0.7)} 50%, ${hexToRgba(COLORS.primary, 0.55)} 82%, transparent 100%)`,
              opacity: underlineOpacity,
              borderRadius: 1.5,
              boxShadow: `0 0 12px ${hexToRgba(COLORS.primary, 0.25)}`,
            }}
          />
        </div>

        {/* Tagline - clear value prop */}
        <div
          style={{
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
            marginTop: 16,
          }}
        >
          <span
            style={{
              fontSize: 17,
              color: COLORS.grayLight,
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 400,
              letterSpacing: 0.4,
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
            marginTop: 26,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: sideLineWidth,
              height: 1,
              background: `linear-gradient(270deg, ${hexToRgba(COLORS.primary, 0.32)}, transparent)`,
            }}
          />
          <span
            style={{
              fontSize: 9.5,
              color: COLORS.grayMid,
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 5,
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
              background: `linear-gradient(90deg, ${hexToRgba(COLORS.primary, 0.32)}, transparent)`,
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
// IMPROVED: Refined scene durations for better pacing and transitions
// ============================================================================
export const StatsUpdate: React.FC<StatsUpdateProps> = ({
  headline,
  stats,
  tagline,
  cta,
}) => {
  const { fps } = useVideoConfig();

  // Elegant crossfade transitions - slightly longer for smoother feel
  const transitionFrames = Math.round(0.32 * fps);

  return (
    <TransitionSeries>
      {/* Intro: 1.85s - Logo reveal, strong hook - slightly tighter */}
      <TransitionSeries.Sequence durationInFrames={Math.round(1.85 * fps)}>
        <IntroScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* Headline: 2.0s - BRRR moment with impact and room to breathe */}
      <TransitionSeries.Sequence durationInFrames={Math.round(2.0 * fps)}>
        <HeadlineScene headline={headline} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* Stats: 3.9s - Numbers count with breathing room - slightly longer */}
      <TransitionSeries.Sequence durationInFrames={Math.round(3.9 * fps)}>
        <StatsScene stats={stats} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* CTA: 2.5s - Confident close with domain as hero */}
      <TransitionSeries.Sequence durationInFrames={Math.round(2.5 * fps)}>
        <CTAScene tagline={tagline} cta={cta} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
