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

// Minimal cinematic background - barely perceptible, supremely elegant
const CinematicBackground: React.FC<{
  accentColor?: string;
  intensity?: number;
  focusY?: number;
}> = ({ accentColor = "#00ff88", intensity = 0.02, focusY = 50 }) => {
  const frame = useCurrentFrame();

  // Extremely slow, imperceptible drift
  const drift = interpolate(frame, [0, 600], [0, 3], {
    extrapolateRight: "clamp",
  });

  // Convert hex to rgba
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
      {/* Pure black base - premium foundation */}
      <AbsoluteFill style={{ background: "#020202" }} />

      {/* Primary glow - whisper-quiet presence */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 90% 45% at 50% ${focusY + drift}%, ${hexToRgba(accentColor, intensity)} 0%, transparent 65%)`,
        }}
      />

      {/* Cinematic vignette - frames the content */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 25%, rgba(0,0,0,0.65) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// Scene 1: The Hook - Cinematic reveal with dramatic tension
const IntroScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: Dramatic emergence from black - the reveal
  const curtainProgress = interpolate(
    frame,
    [0, fps * 0.6],
    [0, 1],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Ambient glow - builds tension, then settles
  const ambientGlow = interpolate(
    frame,
    [0, fps * 0.4, fps * 1.0],
    [0, 0.06, 0.035],
    { extrapolateRight: "clamp" }
  );

  // Logo: Fades up with scale from darkness - THE moment
  const logoDelay = 0.3;
  const logoProgress = spring({
    frame: frame - logoDelay * fps,
    fps,
    config: { damping: 200, stiffness: 45, mass: 1.4 },
  });

  const logoOpacity = interpolate(
    frame,
    [logoDelay * fps, (logoDelay + 0.45) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const logoScale = interpolate(logoProgress, [0, 1], [0.8, 1]);

  // Single elegant ring - expands outward creating depth
  const ringDelay = 0.5;
  const ringOpacity = interpolate(
    frame,
    [ringDelay * fps, (ringDelay + 0.2) * fps, fps * 1.5, fps * 1.9],
    [0, 0.2, 0.1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ringScale = interpolate(
    frame,
    [ringDelay * fps, fps * 1.9],
    [0.7, 2.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Logo glow builds majestically
  const logoGlow = interpolate(
    frame,
    [fps * 0.6, fps * 1.7],
    [0, 55],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // $FED text - appears with measured confidence
  const fedDelay = 0.9;
  const fedProgress = spring({
    frame: frame - fedDelay * fps,
    fps,
    config: { damping: 200, stiffness: 70 },
  });
  const fedOpacity = interpolate(
    frame,
    [fedDelay * fps, (fedDelay + 0.3) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const fedY = interpolate(fedProgress, [0, 1], [16, 0]);

  // Tagline - final beat, elegant fade
  const tagDelay = 1.25;
  const tagOpacity = interpolate(
    frame,
    [tagDelay * fps, (tagDelay + 0.35) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const tagY = interpolate(
    frame,
    [tagDelay * fps, (tagDelay + 0.4) * fps],
    [10, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Decorative side lines - frame the composition
  const lineWidth = interpolate(
    frame,
    [fps * 1.1, fps * 1.6],
    [0, 75],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00ff88" intensity={0.022} focusY={50} />

      {/* Ambient glow layer - breathes life */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 55% 45% at 50% 50%, rgba(0, 255, 136, ${ambientGlow}) 0%, transparent 55%)`,
        }}
      />

      {/* Content container */}
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
            gap: 24,
            opacity: curtainProgress,
          }}
        >
          {/* Logo container with ring */}
          <div style={{ position: "relative" }}>
            {/* Single expanding ring - clean and purposeful */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 170,
                height: 170,
                borderRadius: "50%",
                border: "1px solid rgba(0, 255, 136, 0.18)",
                transform: `translate(-50%, -50%) scale(${ringScale})`,
                opacity: ringOpacity,
              }}
            />
            {/* Logo */}
            <div
              style={{
                transform: `scale(${logoScale})`,
                opacity: logoOpacity,
                filter: `drop-shadow(0 0 ${logoGlow}px rgba(0, 255, 136, 0.5))`,
              }}
            >
              <FedLogo size={145} glow={false} />
            </div>
          </div>

          {/* $FED text with sophisticated typography */}
          <div
            style={{
              opacity: fedOpacity,
              transform: `translateY(${fedY}px)`,
            }}
          >
            <span
              style={{
                fontSize: 58,
                fontWeight: 900,
                color: "#ffffff",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -2,
                textShadow: "0 4px 35px rgba(0, 0, 0, 0.4)",
              }}
            >
              <span style={{ color: "#00ff88", textShadow: "0 0 30px rgba(0, 255, 136, 0.35)" }}>$</span>FED
            </span>
          </div>

          {/* Tagline with decorative lines */}
          <div
            style={{
              opacity: tagOpacity,
              transform: `translateY(${tagY}px)`,
              display: "flex",
              alignItems: "center",
              gap: 18,
            }}
          >
            <div
              style={{
                width: lineWidth,
                height: 1,
                background: "linear-gradient(270deg, rgba(0, 255, 136, 0.25), transparent)",
              }}
            />
            <span
              style={{
                fontSize: 10,
                color: "#505050",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: 5,
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Quantitative Easing for the People
            </span>
            <div
              style={{
                width: lineWidth,
                height: 1,
                background: "linear-gradient(90deg, rgba(0, 255, 136, 0.25), transparent)",
              }}
            />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 2: Headline - Typography with dramatic impact
const HeadlineScene: React.FC<{ headline: string }> = ({ headline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = headline.split(" ");

  // Scene builds in
  const sceneFade = interpolate(frame, [0, fps * 0.12], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Background glow intensifies with BRRR
  const bgGlow = interpolate(
    frame,
    [fps * 0.5, fps * 1.3],
    [0.025, 0.045],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // BRRR underline - dramatic draw after word appears
  const brrrWordIndex = words.findIndex(w => w === "BRRR");
  const brrrDelay = 0.12 + brrrWordIndex * 0.08;
  const brrrUnderline = interpolate(
    frame,
    [(brrrDelay + 0.28) * fps, (brrrDelay + 0.65) * fps],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const underlineGlow = interpolate(
    frame,
    [(brrrDelay + 0.4) * fps, (brrrDelay + 0.85) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00ff88" intensity={bgGlow} focusY={48} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 80,
          flexDirection: "column",
        }}
      >
        {/* Headline - word by word with perfect rhythm */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0 28px",
            maxWidth: 1100,
            position: "relative",
          }}
        >
          {words.map((word, index) => {
            // Tighter stagger for snappier feel
            const delay = 0.12 + index * 0.08;
            const wordProgress = spring({
              frame: frame - delay * fps,
              fps,
              config: { damping: 200, stiffness: 110, mass: 1.0 },
            });
            const wordOpacity = interpolate(
              frame,
              [delay * fps, (delay + 0.18) * fps],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const wordY = interpolate(wordProgress, [0, 1], [22, 0]);
            const wordScale = interpolate(wordProgress, [0, 1], [0.98, 1]);

            // BRRR gets special treatment - it's the payoff moment
            const isEmphasis = word === "BRRR";

            // BRRR scale pulse when it lands - subtle but impactful
            const emphasisScale = isEmphasis ? interpolate(
              frame,
              [(delay + 0.2) * fps, (delay + 0.38) * fps],
              [1.04, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
            ) * wordScale : wordScale;

            // Glow builds majestically on BRRR
            const emphasisGlow = isEmphasis ? interpolate(
              frame,
              [(delay + 0.22) * fps, fps * 1.5],
              [0, 50],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
            ) : 0;

            return (
              <span
                key={index}
                style={{
                  fontSize: 78,
                  fontWeight: 900,
                  color: isEmphasis ? "#00ff88" : "#ffffff",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  opacity: wordOpacity,
                  transform: `translateY(${wordY}px) scale(${emphasisScale})`,
                  display: "inline-block",
                  letterSpacing: -3.5,
                  lineHeight: 1.1,
                  textShadow: isEmphasis
                    ? `0 0 ${emphasisGlow}px rgba(0, 255, 136, 0.5)`
                    : "0 5px 35px rgba(0, 0, 0, 0.45)",
                  position: "relative",
                }}
              >
                {word}
                {/* Dramatic underline accent for BRRR */}
                {isEmphasis && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: -8,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: `${brrrUnderline}%`,
                      height: 3,
                      background: "linear-gradient(90deg, transparent 5%, #00ff88 50%, transparent 95%)",
                      borderRadius: 2,
                      opacity: 0.75,
                      boxShadow: `0 0 ${14 * underlineGlow}px rgba(0, 255, 136, ${0.45 * underlineGlow})`,
                    }}
                  />
                )}
              </span>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Stat card - Premium glass morphism with hero number and luxurious counting
const StatCard: React.FC<{
  stat: StatsUpdateProps["stats"][0];
  delay: number;
  index: number;
}> = ({ stat, delay, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card entrance - deliberate, weighty spring
  const cardProgress = spring({
    frame: frame - delay * fps,
    fps,
    config: { damping: 200, stiffness: 55, mass: 1.2 },
  });

  // Number counting with exponential deceleration for maximum satisfaction
  const countDuration = 1.8;
  const countStart = delay + 0.15;
  const numberProgress = interpolate(
    frame,
    [countStart * fps, (countStart + countDuration) * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      // Quintic ease-out for that "slowing to a stop" feel
      easing: (t) => 1 - Math.pow(1 - t, 5),
    }
  );

  // Parse value
  const numericValue =
    stat.numericValue ?? (parseFloat(stat.value.replace(/[^0-9.]/g, "")) || 0);
  const displayValue = Math.floor(numericValue * numberProgress);
  const prefix = stat.prefix ?? (stat.value.startsWith("$") ? "$" : "");
  const suffix = stat.suffix ?? (stat.value.includes("+") ? "+" : "");

  const cardOpacity = interpolate(cardProgress, [0, 0.35], [0, 1], {
    extrapolateRight: "clamp",
  });
  const cardY = interpolate(cardProgress, [0, 1], [35, 0]);
  const cardScale = interpolate(cardProgress, [0, 1], [0.96, 1]);

  // Color system - FED brand palette
  const accentColors = ["#00ff88", "#00d4ff", "#ff6b9d"];
  const accentColor = stat.color || accentColors[index % accentColors.length];

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : "0, 255, 136";
  };
  const accentRgb = hexToRgb(accentColor);

  // Top accent line draws elegantly from left
  const accentWidth = interpolate(
    frame,
    [(delay + 0.12) * fps, (delay + 0.6) * fps],
    [0, 100],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Left border glow builds with count
  const borderGlow = interpolate(
    frame,
    [(delay + 0.25) * fps, (delay + 1.3) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Card ambient glow after number lands
  const cardGlow = interpolate(
    frame,
    [(countStart + countDuration - 0.4) * fps, (countStart + countDuration + 0.4) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Number "lands" with subtle scale pulse
  const landedPulse = numberProgress >= 0.97 ? interpolate(
    frame,
    [(countStart + countDuration) * fps, (countStart + countDuration + 0.1) * fps],
    [1.025, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 1;

  // Number glow intensifies as it lands
  const numberGlow = interpolate(
    frame,
    [(countStart + countDuration - 0.4) * fps, (countStart + countDuration + 0.25) * fps],
    [0, 18],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Label fades in after card settles
  const labelOpacity = interpolate(
    frame,
    [(delay + 0.3) * fps, (delay + 0.55) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        transform: `translateY(${cardY}px) scale(${cardScale})`,
        opacity: cardOpacity,
      }}
    >
      <div
        style={{
          padding: "26px 36px",
          background:
            "linear-gradient(168deg, rgba(255,255,255,0.032) 0%, rgba(255,255,255,0.006) 100%)",
          borderRadius: 14,
          minWidth: 270,
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          boxShadow: `
            0 28px 60px rgba(0, 0, 0, 0.45),
            0 0 ${40 * cardGlow}px rgba(${accentRgb}, ${0.07 * cardGlow}),
            inset 0 1px 0 rgba(255, 255, 255, 0.035)
          `,
        }}
      >
        {/* Top accent line - full width draw */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${accentWidth}%`,
            height: 2,
            background: `linear-gradient(90deg, ${accentColor} 0%, ${accentColor}70 65%, transparent 100%)`,
            borderRadius: "2px 0 0 0",
            boxShadow: `0 0 ${10 * borderGlow}px ${accentColor}55`,
          }}
        />

        {/* Left accent bar - vertical */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 3,
            height: "100%",
            background: `linear-gradient(180deg, ${accentColor} 0%, ${accentColor}35 65%, transparent 100%)`,
            opacity: borderGlow * 0.65,
            boxShadow: `0 0 ${12 * borderGlow}px ${accentColor}45`,
          }}
        />

        {/* Hero number with glow */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 900,
            color: "#ffffff",
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: -2,
            lineHeight: 1,
            marginBottom: 14,
            transform: `scale(${landedPulse})`,
            transformOrigin: "left center",
            filter: `drop-shadow(0 0 ${numberGlow}px rgba(${accentRgb}, 0.28))`,
          }}
        >
          <span
            style={{
              color: accentColor,
              textShadow: `0 0 ${12 * cardGlow}px ${accentColor}55`,
            }}
          >
            {prefix}
          </span>
          {displayValue.toLocaleString()}
          <span
            style={{
              color: "#3a3a3a",
              fontSize: 26,
              fontWeight: 700,
              marginLeft: 2,
            }}
          >
            {suffix}
          </span>
        </div>

        {/* Label with animated indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            opacity: labelOpacity,
          }}
        >
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: accentColor,
              opacity: 0.45 + cardGlow * 0.45,
              boxShadow: `0 0 ${7 * cardGlow}px ${accentColor}`,
            }}
          />
          <div
            style={{
              fontSize: 10,
              color: "#555555",
              fontFamily: "system-ui, -apple-system, sans-serif",
              textTransform: "uppercase",
              letterSpacing: 3,
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

// Scene 3: Stats - The showcase with compelling number reveals
const StatsScene: React.FC<{ stats: StatsUpdateProps["stats"] }> = ({ stats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene builds in smoothly
  const sceneFade = interpolate(frame, [0, fps * 0.12], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Section header - refined entrance
  const headerOpacity = interpolate(frame, [fps * 0.08, fps * 0.32], [0, 1], {
    extrapolateRight: "clamp",
  });
  const headerY = interpolate(
    frame,
    [fps * 0.08, fps * 0.38],
    [10, 0],
    {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Live indicator with elegant pulse
  const pulseBase = interpolate(
    (frame - fps * 0.35) % (fps * 2.0),
    [0, fps * 0.4, fps * 2.0],
    [0.4, 1, 0.4],
    { extrapolateLeft: "clamp" }
  );
  const indicatorOpacity = frame > fps * 0.3 ? pulseBase : interpolate(
    frame,
    [fps * 0.12, fps * 0.3],
    [0, 0.4],
    { extrapolateRight: "clamp" }
  );

  // Accent lines - draw outward symmetrically
  const lineWidth = interpolate(
    frame,
    [fps * 0.1, fps * 0.5],
    [0, 55],
    {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Background glow intensifies as numbers count up - creates energy
  const bgGlowIntensity = interpolate(
    frame,
    [fps * 0.7, fps * 2.6],
    [0.022, 0.042],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00ff88" intensity={bgGlowIntensity} focusY={42} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 60,
          flexDirection: "column",
          gap: 45,
        }}
      >
        {/* Header with live indicator */}
        <div
          style={{
            opacity: headerOpacity,
            transform: `translateY(${headerY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: lineWidth,
              height: 1,
              background: "linear-gradient(270deg, rgba(0, 255, 136, 0.22), transparent)",
            }}
          />

          {/* Live indicator with glow */}
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#00ff88",
              opacity: indicatorOpacity,
              boxShadow: `0 0 ${9 + 7 * indicatorOpacity}px rgba(0, 255, 136, ${0.4 + 0.3 * indicatorOpacity})`,
            }}
          />

          <span
            style={{
              fontSize: 10,
              color: "#505050",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 5,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Live Metrics
          </span>

          <div
            style={{
              width: lineWidth,
              height: 1,
              background: "linear-gradient(90deg, rgba(0, 255, 136, 0.22), transparent)",
            }}
          />
        </div>

        {/* Stats row - deliberate stagger for impact */}
        <div
          style={{
            display: "flex",
            gap: 24,
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 950,
          }}
        >
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              stat={stat}
              delay={0.2 + index * 0.2}
              index={index}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 4: CTA - Commanding, memorable close with gravitas
const CTAScene: React.FC<{ tagline: string; cta: string }> = ({ tagline, cta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene builds from darkness
  const sceneFade = interpolate(frame, [0, fps * 0.15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Background glow intensifies throughout
  const bgIntensity = interpolate(
    frame,
    [0, fps * 1.6],
    [0.025, 0.055],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Logo - powerful entrance with weight
  const logoProgress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 55, mass: 1.2 },
  });
  const logoOpacity = interpolate(frame, [0, fps * 0.28], [0, 1], {
    extrapolateRight: "clamp",
  });
  const logoScale = interpolate(logoProgress, [0, 1], [0.88, 1]);
  const logoGlow = interpolate(
    frame,
    [fps * 0.22, fps * 0.95],
    [0, 50],
    {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Single ring - adds presence without clutter
  const ringOpacity = interpolate(
    frame,
    [fps * 0.15, fps * 0.32, fps * 0.9, fps * 1.3],
    [0, 0.2, 0.1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ringScale = interpolate(
    frame,
    [fps * 0.15, fps * 1.3],
    [0.75, 1.9],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Tagline - confident timing
  const taglineOpacity = interpolate(
    frame,
    [fps * 0.42, fps * 0.7],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const taglineY = interpolate(
    frame,
    [fps * 0.42, fps * 0.75],
    [12, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // CTA button - THE action moment, slightly delayed for impact
  const ctaDelay = fps * 0.7;
  const ctaProgress = spring({
    frame: frame - ctaDelay,
    fps,
    config: { damping: 200, stiffness: 75, mass: 1.1 },
  });
  const ctaOpacity = interpolate(
    frame,
    [ctaDelay, ctaDelay + fps * 0.25],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ctaY = interpolate(ctaProgress, [0, 1], [22, 0]);
  const ctaScale = interpolate(ctaProgress, [0, 1], [0.96, 1]);

  // CTA glow builds dramatically
  const ctaGlow = interpolate(
    frame,
    [ctaDelay + fps * 0.2, fps * 1.7],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Subtle pulsing glow on CTA after it lands - more subdued
  const ctaPulse = frame > fps * 1.3 ? interpolate(
    (frame - fps * 1.3) % (fps * 2.2),
    [0, fps * 1.1, fps * 2.2],
    [0.88, 1, 0.88]
  ) : 1;

  // Bottom text - final beat with gravitas
  const bottomOpacity = interpolate(
    frame,
    [fps * 1.2, fps * 1.55],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const bottomY = interpolate(
    frame,
    [fps * 1.2, fps * 1.6],
    [8, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Decorative lines frame the bottom text
  const lineWidth = interpolate(
    frame,
    [fps * 1.4, fps * 1.9],
    [0, 50],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00ff88" intensity={bgIntensity} focusY={50} />

      {/* Additional ambient glow behind CTA */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 48% 38% at 50% 54%, rgba(0, 255, 136, ${0.035 * ctaGlow}) 0%, transparent 55%)`,
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
        {/* Logo with ring */}
        <div style={{ position: "relative" }}>
          {/* Expanding ring */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 115,
              height: 115,
              borderRadius: "50%",
              border: "1px solid rgba(0, 255, 136, 0.25)",
              transform: `translate(-50%, -50%) scale(${ringScale})`,
              opacity: ringOpacity,
            }}
          />
          <div
            style={{
              transform: `scale(${logoScale})`,
              opacity: logoOpacity,
              filter: `drop-shadow(0 0 ${logoGlow}px rgba(0, 255, 136, 0.45))`,
            }}
          >
            <FedLogo size={95} glow={false} />
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
          }}
        >
          <span
            style={{
              fontSize: 22,
              color: "#585858",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 400,
              letterSpacing: 0.3,
            }}
          >
            {tagline}
          </span>
        </div>

        {/* CTA Button - commanding presence */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px) scale(${ctaScale})`,
          }}
        >
          <div
            style={{
              padding: "17px 54px",
              background: "linear-gradient(145deg, #00ff88 0%, #00ffaa 50%, #00ff88 100%)",
              borderRadius: 50,
              boxShadow: `
                0 7px 28px rgba(0, 255, 136, ${(0.22 + 0.14 * ctaGlow) * ctaPulse}),
                0 0 ${35 * ctaGlow * ctaPulse}px rgba(0, 255, 136, ${0.12 * ctaGlow * ctaPulse}),
                inset 0 2px 0 rgba(255, 255, 255, 0.18),
                inset 0 -1px 0 rgba(0, 0, 0, 0.08)
              `,
            }}
          >
            <span
              style={{
                fontSize: 34,
                fontWeight: 900,
                color: "#020202",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -0.5,
                textShadow: "0 1px 0 rgba(255, 255, 255, 0.18)",
              }}
            >
              {cta}
            </span>
          </div>
        </div>

        {/* Bottom proposition - final authority */}
        <div
          style={{
            opacity: bottomOpacity,
            transform: `translateY(${bottomY}px)`,
            marginTop: 10,
            display: "flex",
            alignItems: "center",
            gap: 15,
          }}
        >
          <div
            style={{
              width: lineWidth,
              height: 1,
              background: "linear-gradient(270deg, rgba(0, 255, 136, 0.22), transparent)",
            }}
          />
          <span
            style={{
              fontSize: 10,
              color: "#404040",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 4,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Real yield. Every 2 minutes.
          </span>
          <div
            style={{
              width: lineWidth,
              height: 1,
              background: "linear-gradient(90deg, rgba(0, 255, 136, 0.22), transparent)",
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Main composition - 10 second video with cinematic pacing
export const StatsUpdate: React.FC<StatsUpdateProps> = ({
  headline,
  stats,
  tagline,
  cta,
}) => {
  const { fps } = useVideoConfig();

  // Clean, professional fades (0.25s - smooth but purposeful)
  const transitionFrames = Math.round(0.25 * fps);

  return (
    <TransitionSeries>
      {/* Intro: 2.1s - Logo hook with gravitas, let it breathe */}
      <TransitionSeries.Sequence durationInFrames={Math.round(2.1 * fps)}>
        <IntroScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* Headline: 1.7s - Snappy word reveal, don't overstay */}
      <TransitionSeries.Sequence durationInFrames={Math.round(1.7 * fps)}>
        <HeadlineScene headline={headline} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* Stats: 3.7s - The meat with counting animations */}
      <TransitionSeries.Sequence durationInFrames={Math.round(3.7 * fps)}>
        <StatsScene stats={stats} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* CTA: 2.5s - Strong, confident close with room to land */}
      <TransitionSeries.Sequence durationInFrames={Math.round(2.5 * fps)}>
        <CTAScene tagline={tagline} cta={cta} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
