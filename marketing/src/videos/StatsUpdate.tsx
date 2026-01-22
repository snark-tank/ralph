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

// Ultra-minimal film grain - barely visible texture for cinema feel
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

// Premium cinematic background - minimal, elegant
const CinematicBackground: React.FC<{
  accentColor?: string;
  intensity?: number;
  focusY?: number;
}> = ({ accentColor = "#00ff88", intensity = 0.025, focusY = 50 }) => {
  const frame = useCurrentFrame();

  // Imperceptible drift for organic feel
  const drift = interpolate(frame, [0, 600], [0, 1.2], {
    extrapolateRight: "clamp",
  });

  const hexToRgba = (hex: string, alpha: number) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return `rgba(0, 255, 136, ${alpha})`;
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <AbsoluteFill>
      {/* Deep black base */}
      <AbsoluteFill style={{ background: "#020202" }} />

      {/* Subtle center gradient - restrained */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 75% 45% at 50% ${focusY + drift}%, ${hexToRgba(accentColor, intensity)} 0%, transparent 50%)`,
        }}
      />

      {/* Deep vignette for focus */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 20%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      <FilmGrain opacity={0.012} />
    </AbsoluteFill>
  );
};

// Scene 1: The Hook - Apple keynote style reveal with premium execution
// Precise timing, deliberate motion, cinematic presence
const IntroScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 0: Extended darkness, then controlled power-on with organic flicker
  // Creates anticipation like a projector warming up - refined flicker pattern
  const flicker = frame < fps * 0.06 ? 0 :
    frame < fps * 0.075 ? 0.02 :
    frame < fps * 0.09 ? 0.005 :
    frame < fps * 0.105 ? 0.04 :
    frame < fps * 0.12 ? 0.01 :
    frame < fps * 0.135 ? 0.08 :
    frame < fps * 0.15 ? 0.03 : 1;

  const powerOn = interpolate(
    frame,
    [fps * 0.15, fps * 0.35],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) * (frame < fps * 0.15 ? flicker : 1);

  // Phase 1: Single point of light emerges from center - the spark
  // More refined expansion with layered glow
  const pointLightOpacity = interpolate(
    frame,
    [fps * 0.06, fps * 0.15, fps * 0.4, fps * 0.6],
    [0, 0.95, 0.5, 0],
    { extrapolateRight: "clamp" }
  );
  const pointLightScale = interpolate(
    frame,
    [fps * 0.06, fps * 0.6],
    [0, 5],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Secondary inner glow - adds depth to the spark
  const innerGlowOpacity = interpolate(
    frame,
    [fps * 0.08, fps * 0.18, fps * 0.35, fps * 0.5],
    [0, 0.8, 0.3, 0],
    { extrapolateRight: "clamp" }
  );
  const innerGlowScale = interpolate(
    frame,
    [fps * 0.08, fps * 0.5],
    [0, 2.5],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Horizontal line of light - the "reveal" moment - dramatic cinematic wipe
  const lineWidth = interpolate(
    frame,
    [fps * 0.1, fps * 0.45],
    [0, 950],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const lineOpacity = interpolate(
    frame,
    [fps * 0.1, fps * 0.18, fps * 0.55, fps * 0.8],
    [0, 0.95, 0.35, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const lineThickness = interpolate(
    frame,
    [fps * 0.1, fps * 0.22, fps * 0.5],
    [0.5, 3, 1.8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Logo entrance - emerges from the light with weight and presence
  const logoDelay = 0.32;
  const logoProgress = spring({
    frame: frame - logoDelay * fps,
    fps,
    config: { damping: 160, stiffness: 45, mass: 1.5 },
  });
  const logoOpacity = interpolate(
    frame,
    [logoDelay * fps, (logoDelay + 0.2) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const logoScale = interpolate(logoProgress, [0, 1], [0.65, 1]);
  const logoGlow = interpolate(
    frame,
    [fps * 0.38, fps * 0.75, fps * 1.6],
    [0, 50, 35],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // $FED text - unified entrance with gravitas
  const textDelay = 0.55;
  const textProgress = spring({
    frame: frame - textDelay * fps,
    fps,
    config: { damping: 200, stiffness: 50, mass: 1.4 },
  });
  const textOpacity = interpolate(
    frame,
    [textDelay * fps, (textDelay + 0.25) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const textY = interpolate(textProgress, [0, 1], [20, 0]);
  const textScale = interpolate(textProgress, [0, 1], [0.92, 1]);

  // Tagline - refined, appears last
  const tagDelay = 1.05;
  const tagOpacity = interpolate(
    frame,
    [tagDelay * fps, (tagDelay + 0.35) * fps],
    [0, 0.55],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const tagY = interpolate(
    frame,
    [tagDelay * fps, (tagDelay + 0.4) * fps],
    [6, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Background glow - barely perceptible, builds with content
  const bgGlow = interpolate(
    frame,
    [fps * 0.2, fps * 1.4],
    [0.005, 0.028],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ opacity: powerOn }}>
      <CinematicBackground accentColor="#00cc77" intensity={bgGlow} focusY={50} />

      {/* Light effects layer - the "reveal" magic */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        {/* Outer point light - soft ambient expansion */}
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,200,120,0.4) 0%, rgba(0,180,100,0.15) 40%, transparent 65%)",
            opacity: pointLightOpacity * 0.7,
            transform: `scale(${pointLightScale * 1.2})`,
            position: "absolute",
          }}
        />

        {/* Central point light - the first spark with hot core */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.98) 0%, rgba(200,255,230,0.7) 15%, rgba(0,210,136,0.45) 35%, rgba(0,180,100,0.12) 55%, transparent 70%)",
            opacity: pointLightOpacity,
            transform: `scale(${pointLightScale})`,
            position: "absolute",
          }}
        />

        {/* Inner bright core - the hottest center point */}
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 30%, rgba(200,255,240,0.4) 60%, transparent 80%)",
            opacity: innerGlowOpacity,
            transform: `scale(${innerGlowScale})`,
            position: "absolute",
          }}
        />

        {/* Horizontal light line - cinematic reveal bar */}
        <div
          style={{
            width: lineWidth,
            height: lineThickness,
            background: "linear-gradient(90deg, transparent 0%, rgba(0,200,120,0.15) 10%, rgba(0,220,140,0.3) 25%, rgba(255,255,255,0.95) 50%, rgba(0,220,140,0.3) 75%, rgba(0,200,120,0.15) 90%, transparent 100%)",
            opacity: lineOpacity,
            position: "absolute",
            boxShadow: "0 0 40px rgba(0, 200, 120, 0.35), 0 0 80px rgba(0, 180, 100, 0.2)",
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
          {/* Logo - the hero element */}
          <div
            style={{
              transform: `scale(${logoScale})`,
              opacity: logoOpacity,
              filter: `drop-shadow(0 0 ${logoGlow}px rgba(0, 200, 120, 0.55))`,
            }}
          >
            <FedLogo size={105} glow={false} />
          </div>

          {/* $FED wordmark - tight kerning, unified mark */}
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
                fontSize: 54,
                fontWeight: 900,
                color: "#00c872",
                fontFamily: "system-ui, -apple-system, sans-serif",
                textShadow: "0 0 25px rgba(0, 200, 114, 0.45)",
                marginRight: -3,
              }}
            >
              $
            </span>
            <span
              style={{
                fontSize: 54,
                fontWeight: 900,
                color: "#ffffff",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -3,
                textShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
              }}
            >
              FED
            </span>
          </div>

          {/* Tagline - subtle but readable */}
          <div
            style={{
              opacity: tagOpacity,
              transform: `translateY(${tagY}px)`,
              marginTop: 4,
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: "#555555",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: 4,
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

// Scene 2: Headline with powerful BRRR payoff
// Cinematic word reveals, impactful BRRR moment - the money printer moment
const HeadlineScene: React.FC<{ headline: string }> = ({ headline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = headline.split(" ");
  const brrrIndex = words.findIndex(w => w === "BRRR");

  // Scene fade - smooth entrance
  const sceneFade = interpolate(frame, [0, fps * 0.08], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Word timing - measured stagger for rhythm
  const wordStagger = 0.12;
  const brrrDelay = 0.06 + brrrIndex * wordStagger;
  const brrrLandTime = (brrrDelay + 0.06) * fps;

  // Camera push on BRRR - subtle but adds weight
  const cameraScale = interpolate(
    frame,
    [brrrLandTime - fps * 0.04, brrrLandTime + fps * 0.04, brrrLandTime + fps * 0.25],
    [1, 1.022, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Background glow burst on BRRR - dramatic flash
  const bgGlow = interpolate(
    frame,
    [fps * 0.04, brrrLandTime - fps * 0.02, brrrLandTime + fps * 0.04, brrrLandTime + fps * 0.25, fps * 1.3],
    [0.015, 0.025, 0.12, 0.055, 0.04],
    { extrapolateRight: "clamp" }
  );

  // Primary shockwave - the main ring (fastest, most prominent)
  const shock1Opacity = interpolate(
    frame,
    [brrrLandTime, brrrLandTime + fps * 0.05, brrrLandTime + fps * 0.45],
    [0.85, 0.4, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const shock1Scale = interpolate(
    frame,
    [brrrLandTime, brrrLandTime + fps * 0.45],
    [0.15, 4.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Secondary shockwave - slightly delayed, slower expansion
  const shock2Delay = brrrLandTime + fps * 0.05;
  const shock2Opacity = interpolate(
    frame,
    [shock2Delay, shock2Delay + fps * 0.05, shock2Delay + fps * 0.5],
    [0.6, 0.28, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const shock2Scale = interpolate(
    frame,
    [shock2Delay, shock2Delay + fps * 0.5],
    [0.12, 3.8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Tertiary shockwave - creates depth cascade
  const shock3Delay = brrrLandTime + fps * 0.1;
  const shock3Opacity = interpolate(
    frame,
    [shock3Delay, shock3Delay + fps * 0.04, shock3Delay + fps * 0.55],
    [0.4, 0.18, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const shock3Scale = interpolate(
    frame,
    [shock3Delay, shock3Delay + fps * 0.55],
    [0.1, 3.2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Central flash burst on BRRR impact - brighter, more dramatic
  const flashOpacity = interpolate(
    frame,
    [brrrLandTime - fps * 0.02, brrrLandTime + fps * 0.025, brrrLandTime + fps * 0.12],
    [0, 0.95, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const flashScale = interpolate(
    frame,
    [brrrLandTime - fps * 0.02, brrrLandTime + fps * 0.12],
    [0.2, 2.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Secondary soft glow behind flash - adds depth
  const flashGlowOpacity = interpolate(
    frame,
    [brrrLandTime - fps * 0.01, brrrLandTime + fps * 0.04, brrrLandTime + fps * 0.2],
    [0, 0.6, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const flashGlowScale = interpolate(
    frame,
    [brrrLandTime - fps * 0.01, brrrLandTime + fps * 0.2],
    [0.4, 3.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00c872" intensity={bgGlow} focusY={48} />

      {/* Light effects layer */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        {/* Soft glow behind flash - atmospheric depth */}
        <div
          style={{
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,200,120,0.35) 0%, rgba(0,180,100,0.15) 40%, transparent 60%)",
            opacity: flashGlowOpacity,
            transform: `scale(${flashGlowScale})`,
            position: "absolute",
          }}
        />

        {/* Central flash burst - bright hot core */}
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.98) 0%, rgba(200,255,230,0.6) 25%, rgba(0,200,120,0.35) 45%, transparent 65%)",
            opacity: flashOpacity,
            transform: `scale(${flashScale})`,
            position: "absolute",
          }}
        />

        {/* Primary shockwave - fastest, most prominent */}
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: "50%",
            border: "2.5px solid rgba(0, 200, 120, 0.6)",
            opacity: shock1Opacity,
            transform: `scale(${shock1Scale})`,
            position: "absolute",
            boxShadow: "0 0 40px rgba(0, 200, 120, 0.35), inset 0 0 25px rgba(0, 200, 120, 0.15)",
          }}
        />

        {/* Secondary shockwave - layered cascade */}
        <div
          style={{
            width: 130,
            height: 130,
            borderRadius: "50%",
            border: "2px solid rgba(0, 200, 120, 0.45)",
            opacity: shock2Opacity,
            transform: `scale(${shock2Scale})`,
            position: "absolute",
            boxShadow: "0 0 30px rgba(0, 200, 120, 0.25)",
          }}
        />

        {/* Tertiary shockwave - deepest layer */}
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            border: "1.5px solid rgba(0, 200, 120, 0.3)",
            opacity: shock3Opacity,
            transform: `scale(${shock3Scale})`,
            position: "absolute",
            boxShadow: "0 0 20px rgba(0, 200, 120, 0.15)",
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 65,
          transform: `scale(${cameraScale})`,
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0 24px",
            maxWidth: 980,
          }}
        >
          {words.map((word, index) => {
            const delay = 0.06 + index * wordStagger;
            const wordProgress = spring({
              frame: frame - delay * fps,
              fps,
              config: { damping: 200, stiffness: 75, mass: 1.3 },
            });
            const wordOpacity = interpolate(
              frame,
              [delay * fps, (delay + 0.18) * fps],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const wordY = interpolate(wordProgress, [0, 1], [35, 0]);

            const isBrrr = word === "BRRR";

            // BRRR scale - dramatic entrance with powerful overshoot and settle
            const brrrScale = isBrrr ? interpolate(
              frame,
              [delay * fps, (delay + 0.025) * fps, (delay + 0.1) * fps, (delay + 0.18) * fps, (delay + 0.3) * fps],
              [0.4, 1.28, 0.88, 1.05, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ) : 1;

            // BRRR glow - dramatic burst that settles elegantly
            const brrrGlow = isBrrr ? interpolate(
              frame,
              [(delay + 0.015) * fps, (delay + 0.06) * fps, (delay + 0.25) * fps, fps * 1.2],
              [0, 120, 60, 45],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ) : 0;

            // BRRR letter spacing animation - tightens dramatically on land
            const brrrLetterSpacing = isBrrr ? interpolate(
              frame,
              [delay * fps, (delay + 0.06) * fps, (delay + 0.18) * fps],
              [12, -8, -5],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
            ) : -3.5;

            // BRRR rotation wobble on impact - subtle shake
            const brrrRotation = isBrrr ? interpolate(
              frame,
              [(delay + 0.02) * fps, (delay + 0.05) * fps, (delay + 0.08) * fps, (delay + 0.12) * fps, (delay + 0.18) * fps],
              [0, -1.5, 1.2, -0.5, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ) : 0;

            return (
              <span
                key={index}
                style={{
                  fontSize: isBrrr ? 88 : 66,
                  fontWeight: 900,
                  color: isBrrr ? "#00d880" : "#ffffff",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  opacity: wordOpacity,
                  transform: `translateY(${wordY}px) scale(${brrrScale}) rotate(${brrrRotation}deg)`,
                  display: "inline-block",
                  letterSpacing: brrrLetterSpacing,
                  lineHeight: 1.12,
                  textShadow: isBrrr
                    ? `0 0 ${brrrGlow}px rgba(0, 216, 128, 0.6), 0 0 ${brrrGlow * 0.5}px rgba(0, 255, 170, 0.4), 0 4px 50px rgba(0, 0, 0, 0.5)`
                    : "0 4px 40px rgba(0, 0, 0, 0.5)",
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

// Stat card with premium counting animation
// Luxurious easing, refined visual hierarchy, Apple-level elegance
const StatCard: React.FC<{
  stat: StatsUpdateProps["stats"][0];
  delay: number;
  index: number;
}> = ({ stat, delay, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card entrance - smooth, weighty spring
  const cardProgress = spring({
    frame: frame - delay * fps,
    fps,
    config: { damping: 180, stiffness: 45, mass: 1.5 },
  });

  const cardOpacity = interpolate(
    frame,
    [delay * fps, (delay + 0.25) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const cardY = interpolate(cardProgress, [0, 1], [45, 0]);
  const cardScale = interpolate(cardProgress, [0, 1], [0.9, 1]);

  // Number counting - ultra-premium easing with dramatic deceleration
  // Slot machine feel: fast spin that decelerates elegantly to land perfectly
  const countDuration = 1.6;
  const countStart = delay + 0.15;
  const numberProgress = interpolate(
    frame,
    [countStart * fps, (countStart + countDuration) * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      // Custom easing: aggressive start, dramatic slow landing
      easing: (t) => {
        // Exponential ease with stronger deceleration at end
        const exp = 1 - Math.pow(1 - t, 6);
        // Additional smoothing for the final approach
        const smoothLanding = t > 0.85 ? 0.85 + (t - 0.85) * 0.6 : t;
        const final = 1 - Math.pow(1 - smoothLanding, 5);
        return 0.8 * exp + 0.2 * final;
      },
    }
  );

  // Parse value
  const numericValue = stat.numericValue ?? (parseFloat(stat.value.replace(/[^0-9.]/g, "")) || 0);

  // Smooth number display - prevents jittery final digits
  const rawDisplayValue = numericValue * numberProgress;
  const displayValue = numberProgress > 0.98
    ? numericValue  // Lock to final value in last 2%
    : Math.floor(rawDisplayValue);

  const prefix = stat.prefix ?? (stat.value.startsWith("$") ? "$" : "");
  const suffix = stat.suffix ?? (stat.value.includes("+") ? "+" : "");

  // Landing celebration - the moment of payoff
  const hasLanded = numberProgress >= 0.98;
  const landTime = (countStart + countDuration) * fps;

  // Scale pulse on landing - refined pop with elegant settle
  // Slightly stronger for larger numbers (more impact for bigger stats)
  const pulseIntensity = numericValue > 10000 ? 1.14 : numericValue > 1000 ? 1.12 : 1.08;
  const landPulse = hasLanded ? interpolate(
    frame,
    [landTime - fps * 0.02, landTime + fps * 0.07, landTime + fps * 0.16, landTime + fps * 0.35],
    [1, pulseIntensity, 0.97, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 1;

  // Number glow - builds during count, flares on landing
  const countGlow = interpolate(
    frame,
    [(countStart + 0.15) * fps, (countStart + countDuration * 0.7) * fps, landTime],
    [0, 18, 22],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const landGlow = hasLanded ? interpolate(
    frame,
    [landTime - fps * 0.04, landTime + fps * 0.07, landTime + fps * 0.5],
    [22, 60, 20],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : 0;
  const numberGlow = hasLanded ? landGlow : countGlow;

  // Top accent bar - draws across elegantly
  const accentWidth = interpolate(
    frame,
    [(delay + 0.1) * fps, (delay + 0.55) * fps],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const accentGlow = hasLanded ? interpolate(
    frame,
    [landTime - fps * 0.02, landTime + fps * 0.1, landTime + fps * 0.45],
    [15, 40, 18],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : 15;

  // Card border glow - refined with landing burst
  const borderOpacity = hasLanded ? interpolate(
    frame,
    [landTime - fps * 0.04, landTime + fps * 0.1, landTime + fps * 0.4],
    [0.07, 0.16, 0.08],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : interpolate(
    frame,
    [(delay + 0.12) * fps, (delay + 0.5) * fps],
    [0.05, 0.08],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Card outer glow on landing
  const cardGlow = hasLanded ? interpolate(
    frame,
    [landTime - fps * 0.02, landTime + fps * 0.08, landTime + fps * 0.4],
    [0, 0.4, 0.15],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : 0;

  // Label opacity - fades in with card
  const labelOpacity = interpolate(
    frame,
    [(delay + 0.25) * fps, (delay + 0.45) * fps],
    [0, 0.9],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Color conversion
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : "0, 255, 136";
  };
  const accentRgb = hexToRgb(stat.color);

  // Muted color for text - sophisticated, less saturated
  const mutedColor = stat.color === "#00ff88" ? "#00d478" :
                     stat.color === "#00d4ff" ? "#00c0e0" :
                     stat.color === "#ff6b9d" ? "#f06090" : stat.color;

  return (
    <div
      style={{
        transform: `translateY(${cardY}px) scale(${cardScale})`,
        opacity: cardOpacity,
        position: "relative",
      }}
    >
      {/* Outer glow layer */}
      <div
        style={{
          position: "absolute",
          top: -8,
          left: -8,
          right: -8,
          bottom: -8,
          borderRadius: 24,
          background: `radial-gradient(ellipse 100% 100% at 50% 30%, rgba(${accentRgb}, ${cardGlow * 0.25}) 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          padding: "30px 42px",
          background: `linear-gradient(165deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.012) 50%, rgba(255,255,255,0.006) 100%)`,
          borderRadius: 16,
          minWidth: 280,
          position: "relative",
          overflow: "hidden",
          border: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
          boxShadow: `
            0 28px 70px rgba(0, 0, 0, 0.6),
            0 10px 25px rgba(0, 0, 0, 0.35),
            0 0 ${35 * cardGlow}px rgba(${accentRgb}, ${cardGlow * 0.3}),
            inset 0 1px 0 rgba(255, 255, 255, 0.06),
            inset 0 -1px 0 rgba(0, 0, 0, 0.1)
          `,
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Inner glass shine - top edge highlight */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "50%",
            background: "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)",
            borderRadius: "16px 16px 0 0",
            pointerEvents: "none",
          }}
        />

        {/* Top accent bar - elegant line with dynamic glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${accentWidth}%`,
            height: 2.5,
            background: `linear-gradient(90deg, ${mutedColor} 0%, ${mutedColor}85 60%, transparent 100%)`,
            borderRadius: "16px 0 0 0",
            boxShadow: `0 0 ${accentGlow}px ${mutedColor}55, 0 1px 8px ${mutedColor}35`,
          }}
        />

        {/* Number - the hero element */}
        <div
          style={{
            fontSize: 60,
            fontWeight: 900,
            color: "#ffffff",
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: -3,
            lineHeight: 1,
            marginBottom: 16,
            transform: `scale(${landPulse})`,
            transformOrigin: "left center",
            filter: `drop-shadow(0 0 ${numberGlow}px rgba(${accentRgb}, 0.5))`,
          }}
        >
          <span
            style={{
              color: mutedColor,
              marginRight: -2,
            }}
          >
            {prefix}
          </span>
          {displayValue.toLocaleString()}
          <span
            style={{
              color: "#555555",
              fontSize: 24,
              fontWeight: 800,
              marginLeft: 5,
            }}
          >
            {suffix}
          </span>
        </div>

        {/* Label - understated but clear */}
        <div
          style={{
            opacity: labelOpacity,
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: "#505050",
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

// Scene 3: Stats showcase - refined layout, perfect rhythm
const StatsScene: React.FC<{ stats: StatsUpdateProps["stats"] }> = ({ stats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneFade = interpolate(frame, [0, fps * 0.08], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Card stagger for rhythm - tighter for punchy reveal, but still breathing
  const cardStagger = 0.28;

  // Header - refined with subtle scale entrance
  const headerOpacity = interpolate(frame, [fps * 0.02, fps * 0.15], [0, 0.65], {
    extrapolateRight: "clamp",
  });
  const headerY = interpolate(
    frame,
    [fps * 0.02, fps * 0.2],
    [10, 0],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const headerScale = interpolate(
    frame,
    [fps * 0.02, fps * 0.25],
    [0.95, 1],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Background glow - responsive to card reveals
  // Intensifies as each card lands, creating energy buildup
  const card1LandTime = (0.15 + 1.6) * fps;  // First card lands
  const card2LandTime = (0.15 + cardStagger + 1.6) * fps;
  const card3LandTime = (0.15 + cardStagger * 2 + 1.6) * fps;

  const bgGlow = interpolate(
    frame,
    [fps * 0.08, card1LandTime, card1LandTime + fps * 0.1, card2LandTime, card2LandTime + fps * 0.1, card3LandTime, card3LandTime + fps * 0.1, fps * 3.5],
    [0.01, 0.025, 0.035, 0.04, 0.05, 0.052, 0.06, 0.045],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00c872" intensity={bgGlow} focusY={48} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 50,
          flexDirection: "column",
          gap: 40,
        }}
      >
        {/* Header - refined with scale entrance */}
        <div
          style={{
            opacity: headerOpacity,
            transform: `translateY(${headerY}px) scale(${headerScale})`,
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: "#555555",
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
            gap: 26,
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 940,
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

// Scene 4: CTA - Commanding, confident close
// Premium button design, perfect pacing, memorable exit like a keynote finale
const CTAScene: React.FC<{ tagline: string; cta: string }> = ({ tagline, cta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneFade = interpolate(frame, [0, fps * 0.12], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Background glow - builds with content
  const bgIntensity = interpolate(
    frame,
    [0, fps * 1.5],
    [0.018, 0.055],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Logo entrance - commanding presence
  const logoProgress = spring({
    frame: frame - fps * 0.04,
    fps,
    config: { damping: 160, stiffness: 40, mass: 1.5 },
  });
  const logoOpacity = interpolate(frame, [fps * 0.04, fps * 0.28], [0, 1], {
    extrapolateRight: "clamp",
  });
  const logoScale = interpolate(logoProgress, [0, 1], [0.7, 1]);
  const logoGlow = interpolate(
    frame,
    [fps * 0.2, fps * 0.7, fps * 1.2],
    [0, 55, 42],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Dual expanding rings - elegant layered depth
  const ring1Opacity = interpolate(
    frame,
    [fps * 0.06, fps * 0.2, fps * 1.1, fps * 1.6],
    [0, 0.22, 0.08, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ring1Scale = interpolate(
    frame,
    [fps * 0.06, fps * 1.6],
    [0.4, 2.8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  const ring2Opacity = interpolate(
    frame,
    [fps * 0.15, fps * 0.3, fps * 1.3, fps * 1.8],
    [0, 0.15, 0.05, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ring2Scale = interpolate(
    frame,
    [fps * 0.15, fps * 1.8],
    [0.35, 3.2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Tagline - refined timing
  const taglineOpacity = interpolate(
    frame,
    [fps * 0.32, fps * 0.55],
    [0, 0.9],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const taglineY = interpolate(
    frame,
    [fps * 0.32, fps * 0.6],
    [12, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // CTA button - the hero moment with dramatic entrance
  const ctaDelay = fps * 0.58;
  const ctaProgress = spring({
    frame: frame - ctaDelay,
    fps,
    config: { damping: 150, stiffness: 50, mass: 1.4 },
  });
  const ctaOpacity = interpolate(
    frame,
    [ctaDelay, ctaDelay + fps * 0.28],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ctaY = interpolate(ctaProgress, [0, 1], [40, 0]);
  const ctaScale = interpolate(ctaProgress, [0, 1], [0.82, 1]);

  // CTA land pulse - satisfying pop
  const ctaLandTime = ctaDelay + fps * 0.4;
  const ctaLandPulse = frame > ctaLandTime ? interpolate(
    frame,
    [ctaLandTime, ctaLandTime + fps * 0.1, ctaLandTime + fps * 0.18, ctaLandTime + fps * 0.32],
    [1, 1.08, 0.98, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 1;

  // CTA glow - builds with presence
  const ctaGlow = interpolate(
    frame,
    [ctaDelay + fps * 0.2, fps * 1.3, fps * 2.0],
    [0, 1, 0.8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Shimmer - premium sweep across button with refined timing
  const ctaShimmerDelay = ctaDelay + fps * 0.5;
  const ctaShimmerProgress = interpolate(
    frame,
    [ctaShimmerDelay, ctaShimmerDelay + fps * 0.65],
    [-40, 140],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) }
  );
  const ctaShimmerOpacity = interpolate(
    frame,
    [ctaShimmerDelay, ctaShimmerDelay + fps * 0.1, ctaShimmerDelay + fps * 0.5, ctaShimmerDelay + fps * 0.65],
    [0, 0.5, 0.28, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Secondary shimmer for depth - slightly offset
  const ctaShimmer2Delay = ctaShimmerDelay + fps * 0.08;
  const ctaShimmer2Progress = interpolate(
    frame,
    [ctaShimmer2Delay, ctaShimmer2Delay + fps * 0.6],
    [-35, 135],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) }
  );
  const ctaShimmer2Opacity = interpolate(
    frame,
    [ctaShimmer2Delay, ctaShimmer2Delay + fps * 0.1, ctaShimmer2Delay + fps * 0.45, ctaShimmer2Delay + fps * 0.6],
    [0, 0.25, 0.12, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Bottom text - confident close
  const bottomOpacity = interpolate(
    frame,
    [fps * 1.1, fps * 1.35],
    [0, 0.8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const bottomY = interpolate(
    frame,
    [fps * 1.1, fps * 1.4],
    [10, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00c872" intensity={bgIntensity} focusY={50} />

      {/* Ambient glow behind CTA */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 60% 45% at 50% 54%, rgba(0, 200, 114, ${0.03 * ctaGlow}) 0%, transparent 65%)`,
        }}
      />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 24,
          flexDirection: "column",
        }}
      >
        {/* Logo with dual expanding rings */}
        <div style={{ position: "relative" }}>
          {/* Outer ring */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 90,
              height: 90,
              borderRadius: "50%",
              border: "1px solid rgba(0, 200, 120, 0.14)",
              transform: `translate(-50%, -50%) scale(${ring2Scale})`,
              opacity: ring2Opacity,
            }}
          />
          {/* Inner ring */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 85,
              height: 85,
              borderRadius: "50%",
              border: "1px solid rgba(0, 200, 120, 0.2)",
              transform: `translate(-50%, -50%) scale(${ring1Scale})`,
              opacity: ring1Opacity,
            }}
          />
          <div
            style={{
              transform: `scale(${logoScale})`,
              opacity: logoOpacity,
              filter: `drop-shadow(0 0 ${logoGlow}px rgba(0, 200, 120, 0.55))`,
            }}
          >
            <FedLogo size={78} glow={false} />
          </div>
        </div>

        {/* Tagline - refined but clear */}
        <div
          style={{
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
          }}
        >
          <span
            style={{
              fontSize: 19,
              color: "#5a5a5a",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 400,
              letterSpacing: 0.4,
            }}
          >
            {tagline}
          </span>
        </div>

        {/* CTA Button - premium, sophisticated design */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px) scale(${ctaScale * ctaLandPulse})`,
          }}
        >
          {/* Outer button glow */}
          <div
            style={{
              position: "absolute",
              top: -6,
              left: -6,
              right: -6,
              bottom: -6,
              borderRadius: 56,
              background: `radial-gradient(ellipse 100% 100% at 50% 40%, rgba(0, 200, 110, ${0.2 * ctaGlow}) 0%, transparent 55%)`,
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              padding: "20px 60px",
              background: "linear-gradient(172deg, #00dc85 0%, #00c878 35%, #00b56a 70%, #00a862 100%)",
              borderRadius: 56,
              position: "relative",
              overflow: "hidden",
              boxShadow: `
                0 20px 60px rgba(0, 180, 100, ${0.4 + 0.2 * ctaGlow}),
                0 10px 30px rgba(0, 160, 90, ${0.28 + 0.15 * ctaGlow}),
                0 0 ${45 * ctaGlow}px rgba(0, 200, 110, ${0.12 * ctaGlow}),
                inset 0 1.5px 0 rgba(255, 255, 255, 0.28),
                inset 0 -1.5px 0 rgba(0, 0, 0, 0.12)
              `,
            }}
          >
            {/* Primary shimmer - main sweep */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: `${ctaShimmerProgress}%`,
                width: "28%",
                height: "100%",
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
                opacity: ctaShimmerOpacity,
                pointerEvents: "none",
              }}
            />
            {/* Secondary shimmer - adds depth */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: `${ctaShimmer2Progress}%`,
                width: "20%",
                height: "100%",
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)",
                opacity: ctaShimmer2Opacity,
                pointerEvents: "none",
              }}
            />
            {/* Inner shine - top edge highlight */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "48%",
                background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
                borderRadius: "56px 56px 0 0",
                pointerEvents: "none",
              }}
            />
            {/* Bottom edge subtle shadow for depth */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "35%",
                background: "linear-gradient(0deg, rgba(0,0,0,0.08) 0%, transparent 100%)",
                borderRadius: "0 0 56px 56px",
                pointerEvents: "none",
              }}
            />
            <span
              style={{
                fontSize: 32,
                fontWeight: 900,
                color: "#010101",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -0.8,
                textShadow: "0 1px 0 rgba(255, 255, 255, 0.28)",
                position: "relative",
              }}
            >
              {cta}
            </span>
          </div>
        </div>

        {/* Bottom text - confident close */}
        <div
          style={{
            opacity: bottomOpacity,
            transform: `translateY(${bottomY}px)`,
            marginTop: 14,
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: "#4a4a4a",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 4.5,
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            Real yield. Every 2 minutes.
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Main composition - 10 seconds with perfect scene timing
// Optimized pacing for maximum impact: hook, punch, showcase, close
export const StatsUpdate: React.FC<StatsUpdateProps> = ({
  headline,
  stats,
  tagline,
  cta,
}) => {
  const { fps } = useVideoConfig();

  // Transition timing - quick, elegant crossfades
  const transitionFrames = Math.round(0.3 * fps);

  return (
    <TransitionSeries>
      {/* Intro: 2.1s - dramatic logo reveal with cinematic breathing room */}
      <TransitionSeries.Sequence durationInFrames={Math.round(2.1 * fps)}>
        <IntroScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* Headline: 1.8s - punchy BRRR moment with satisfying impact */}
      <TransitionSeries.Sequence durationInFrames={Math.round(1.8 * fps)}>
        <HeadlineScene headline={headline} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* Stats: 3.8s - numbers count up and land with payoff */}
      <TransitionSeries.Sequence durationInFrames={Math.round(3.8 * fps)}>
        <StatsScene stats={stats} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* CTA: 2.5s - confident, memorable close with call to action */}
      <TransitionSeries.Sequence durationInFrames={Math.round(2.5 * fps)}>
        <CTAScene tagline={tagline} cta={cta} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
