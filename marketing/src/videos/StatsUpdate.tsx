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

  // Phase 1: Dramatic curtain lift - vertical reveal (0-0.6s)
  const curtainProgress = interpolate(
    frame,
    [0, fps * 0.5],
    [0, 1],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Ambient glow intensifies during reveal
  const ambientGlow = interpolate(
    frame,
    [0, fps * 0.3, fps * 0.8],
    [0, 0.08, 0.04],
    { extrapolateRight: "clamp" }
  );

  // Logo: Fades up with scale from darkness - THE moment
  const logoDelay = 0.25;
  const logoProgress = spring({
    frame: frame - logoDelay * fps,
    fps,
    config: { damping: 180, stiffness: 40, mass: 1.5 },
  });

  const logoOpacity = interpolate(
    frame,
    [logoDelay * fps, (logoDelay + 0.5) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const logoScale = interpolate(logoProgress, [0, 1], [0.75, 1]);

  // Outer ring - expands outward creating depth
  const ringDelay = 0.4;
  const ringOpacity = interpolate(
    frame,
    [ringDelay * fps, (ringDelay + 0.15) * fps, fps * 1.3, fps * 1.8],
    [0, 0.25, 0.15, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ringScale = interpolate(
    frame,
    [ringDelay * fps, fps * 1.8],
    [0.6, 2.2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Inner accent ring - tighter
  const innerRingOpacity = interpolate(
    frame,
    [fps * 0.5, fps * 0.7, fps * 1.1, fps * 1.5],
    [0, 0.4, 0.2, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const innerRingScale = interpolate(
    frame,
    [fps * 0.5, fps * 1.5],
    [0.9, 1.4],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Logo glow builds majestically
  const logoGlow = interpolate(
    frame,
    [fps * 0.5, fps * 1.6],
    [0, 70],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // $FED text - appears with measured confidence
  const fedDelay = 0.85;
  const fedProgress = spring({
    frame: frame - fedDelay * fps,
    fps,
    config: { damping: 200, stiffness: 60 },
  });
  const fedOpacity = interpolate(
    frame,
    [fedDelay * fps, (fedDelay + 0.25) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const fedY = interpolate(fedProgress, [0, 1], [18, 0]);

  // Tagline - final beat, elegant fade
  const tagDelay = 1.2;
  const tagOpacity = interpolate(
    frame,
    [tagDelay * fps, (tagDelay + 0.35) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const tagY = interpolate(
    frame,
    [tagDelay * fps, (tagDelay + 0.4) * fps],
    [12, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Decorative side lines - frame the composition
  const lineWidth = interpolate(
    frame,
    [fps * 1.0, fps * 1.5],
    [0, 80],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00ff88" intensity={0.025} focusY={50} />

      {/* Ambient glow layer - breathes life */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0, 255, 136, ${ambientGlow}) 0%, transparent 60%)`,
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
            gap: 20,
            opacity: curtainProgress,
          }}
        >
          {/* Logo container with rings */}
          <div style={{ position: "relative" }}>
            {/* Outer expanding ring */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 180,
                height: 180,
                borderRadius: "50%",
                border: "1px solid rgba(0, 255, 136, 0.2)",
                transform: `translate(-50%, -50%) scale(${ringScale})`,
                opacity: ringOpacity,
              }}
            />
            {/* Inner accent ring */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 160,
                height: 160,
                borderRadius: "50%",
                border: "2px solid rgba(0, 255, 136, 0.35)",
                transform: `translate(-50%, -50%) scale(${innerRingScale})`,
                opacity: innerRingOpacity,
                boxShadow: "0 0 30px rgba(0, 255, 136, 0.15)",
              }}
            />
            {/* Logo */}
            <div
              style={{
                transform: `scale(${logoScale})`,
                opacity: logoOpacity,
                filter: `drop-shadow(0 0 ${logoGlow}px rgba(0, 255, 136, 0.55))`,
              }}
            >
              <FedLogo size={150} glow={false} />
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
                fontSize: 62,
                fontWeight: 900,
                color: "#ffffff",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -2.5,
                textShadow: "0 4px 40px rgba(0, 0, 0, 0.4)",
              }}
            >
              <span style={{ color: "#00ff88", textShadow: "0 0 35px rgba(0, 255, 136, 0.4)" }}>$</span>FED
            </span>
          </div>

          {/* Tagline with decorative lines */}
          <div
            style={{
              opacity: tagOpacity,
              transform: `translateY(${tagY}px)`,
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: lineWidth,
                height: 1,
                background: "linear-gradient(270deg, rgba(0, 255, 136, 0.3), transparent)",
              }}
            />
            <span
              style={{
                fontSize: 11,
                color: "#4a4a4a",
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
                background: "linear-gradient(90deg, rgba(0, 255, 136, 0.3), transparent)",
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
  const sceneFade = interpolate(frame, [0, fps * 0.1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Background glow intensifies with BRRR
  const bgGlow = interpolate(
    frame,
    [fps * 0.5, fps * 1.2],
    [0.03, 0.05],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Top decorative element - draws with words
  const topLineWidth = interpolate(
    frame,
    [fps * 0.1, fps * 0.55],
    [0, 70],
    {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );
  const dotOpacity = interpolate(
    frame,
    [fps * 0.2, fps * 0.45],
    [0, 0.7],
    { extrapolateRight: "clamp" }
  );

  // BRRR underline - dramatic draw after word appears
  const brrrWordIndex = words.findIndex(w => w === "BRRR");
  const brrrDelay = 0.15 + brrrWordIndex * 0.1;
  const brrrUnderline = interpolate(
    frame,
    [(brrrDelay + 0.25) * fps, (brrrDelay + 0.65) * fps],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const underlineGlow = interpolate(
    frame,
    [(brrrDelay + 0.4) * fps, (brrrDelay + 0.8) * fps],
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
          padding: 70,
          flexDirection: "column",
          gap: 18,
        }}
      >
        {/* Top decorative accent */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              width: topLineWidth,
              height: 1,
              background: "linear-gradient(270deg, rgba(0, 255, 136, 0.4), transparent)",
            }}
          />
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#00ff88",
              opacity: dotOpacity,
              boxShadow: "0 0 12px rgba(0, 255, 136, 0.5)",
            }}
          />
          <div
            style={{
              width: topLineWidth,
              height: 1,
              background: "linear-gradient(90deg, rgba(0, 255, 136, 0.4), transparent)",
            }}
          />
        </div>

        {/* Headline - word by word with perfect rhythm */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0 24px",
            maxWidth: 1100,
            position: "relative",
          }}
        >
          {words.map((word, index) => {
            // Stagger with slightly more time for words to land
            const delay = 0.15 + index * 0.1;
            const wordProgress = spring({
              frame: frame - delay * fps,
              fps,
              config: { damping: 200, stiffness: 100, mass: 1.1 },
            });
            const wordOpacity = interpolate(
              frame,
              [delay * fps, (delay + 0.15) * fps],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const wordY = interpolate(wordProgress, [0, 1], [25, 0]);
            const wordScale = interpolate(wordProgress, [0, 1], [0.97, 1]);

            // BRRR gets special treatment - it's the payoff moment
            const isEmphasis = word === "BRRR";

            // BRRR scale pulse when it lands
            const emphasisScale = isEmphasis ? interpolate(
              frame,
              [(delay + 0.2) * fps, (delay + 0.35) * fps],
              [1.05, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
            ) * wordScale : wordScale;

            // Glow builds majestically on BRRR
            const emphasisGlow = isEmphasis ? interpolate(
              frame,
              [(delay + 0.2) * fps, fps * 1.4],
              [0, 55],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
            ) : 0;

            return (
              <span
                key={index}
                style={{
                  fontSize: 82,
                  fontWeight: 900,
                  color: isEmphasis ? "#00ff88" : "#ffffff",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  opacity: wordOpacity,
                  transform: `translateY(${wordY}px) scale(${emphasisScale})`,
                  display: "inline-block",
                  letterSpacing: -4,
                  lineHeight: 1.05,
                  textShadow: isEmphasis
                    ? `0 0 ${emphasisGlow}px rgba(0, 255, 136, 0.55)`
                    : "0 5px 40px rgba(0, 0, 0, 0.5)",
                  position: "relative",
                }}
              >
                {word}
                {/* Dramatic underline accent for BRRR */}
                {isEmphasis && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: -10,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: `${brrrUnderline}%`,
                      height: 3,
                      background: "linear-gradient(90deg, transparent 5%, #00ff88 50%, transparent 95%)",
                      borderRadius: 2,
                      opacity: 0.8,
                      boxShadow: `0 0 ${15 * underlineGlow}px rgba(0, 255, 136, ${0.5 * underlineGlow})`,
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
    config: { damping: 200, stiffness: 45, mass: 1.3 },
  });

  // Number counting with exponential deceleration for maximum satisfaction
  const countDuration = 2.0;
  const countStart = delay + 0.18;
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

  const cardOpacity = interpolate(cardProgress, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });
  const cardY = interpolate(cardProgress, [0, 1], [40, 0]);
  const cardScale = interpolate(cardProgress, [0, 1], [0.95, 1]);

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
    [(delay + 0.15) * fps, (delay + 0.7) * fps],
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
    [(delay + 0.3) * fps, (delay + 1.5) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Card ambient glow after number lands
  const cardGlow = interpolate(
    frame,
    [(countStart + countDuration - 0.3) * fps, (countStart + countDuration + 0.5) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Number "lands" with subtle scale pulse
  const landedPulse = numberProgress >= 0.97 ? interpolate(
    frame,
    [(countStart + countDuration) * fps, (countStart + countDuration + 0.12) * fps],
    [1.03, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 1;

  // Number glow intensifies as it lands
  const numberGlow = interpolate(
    frame,
    [(countStart + countDuration - 0.5) * fps, (countStart + countDuration + 0.3) * fps],
    [0, 20],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Label fades in after card settles
  const labelOpacity = interpolate(
    frame,
    [(delay + 0.35) * fps, (delay + 0.6) * fps],
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
          padding: "28px 38px",
          background:
            "linear-gradient(165deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.008) 100%)",
          borderRadius: 16,
          minWidth: 280,
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          boxShadow: `
            0 30px 70px rgba(0, 0, 0, 0.5),
            0 0 ${45 * cardGlow}px rgba(${accentRgb}, ${0.08 * cardGlow}),
            inset 0 1px 0 rgba(255, 255, 255, 0.04)
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
            background: `linear-gradient(90deg, ${accentColor} 0%, ${accentColor}80 70%, transparent 100%)`,
            borderRadius: "2px 0 0 0",
            boxShadow: `0 0 ${12 * borderGlow}px ${accentColor}60`,
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
            background: `linear-gradient(180deg, ${accentColor} 0%, ${accentColor}40 70%, transparent 100%)`,
            opacity: borderGlow * 0.7,
            boxShadow: `0 0 ${15 * borderGlow}px ${accentColor}50`,
          }}
        />

        {/* Hero number with glow */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 900,
            color: "#ffffff",
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: -2.5,
            lineHeight: 1,
            marginBottom: 16,
            transform: `scale(${landedPulse})`,
            transformOrigin: "left center",
            filter: `drop-shadow(0 0 ${numberGlow}px rgba(${accentRgb}, 0.3))`,
          }}
        >
          <span
            style={{
              color: accentColor,
              textShadow: `0 0 ${15 * cardGlow}px ${accentColor}60`,
            }}
          >
            {prefix}
          </span>
          {displayValue.toLocaleString()}
          <span
            style={{
              color: "#3a3a3a",
              fontSize: 28,
              fontWeight: 700,
              marginLeft: 3,
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
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: accentColor,
              opacity: 0.5 + cardGlow * 0.5,
              boxShadow: `0 0 ${8 * cardGlow}px ${accentColor}`,
            }}
          />
          <div
            style={{
              fontSize: 11,
              color: "#505050",
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
  const sceneFade = interpolate(frame, [0, fps * 0.1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Section header - refined entrance
  const headerOpacity = interpolate(frame, [fps * 0.06, fps * 0.28], [0, 1], {
    extrapolateRight: "clamp",
  });
  const headerY = interpolate(
    frame,
    [fps * 0.06, fps * 0.35],
    [12, 0],
    {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Live indicator with elegant pulse
  const pulseBase = interpolate(
    (frame - fps * 0.3) % (fps * 1.8),
    [0, fps * 0.35, fps * 1.8],
    [0.45, 1, 0.45],
    { extrapolateLeft: "clamp" }
  );
  const indicatorOpacity = frame > fps * 0.25 ? pulseBase : interpolate(
    frame,
    [fps * 0.1, fps * 0.25],
    [0, 0.45],
    { extrapolateRight: "clamp" }
  );

  // Accent lines - draw outward symmetrically
  const lineWidth = interpolate(
    frame,
    [fps * 0.08, fps * 0.45],
    [0, 60],
    {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Background glow intensifies as numbers count up - creates energy
  const bgGlowIntensity = interpolate(
    frame,
    [fps * 0.8, fps * 2.8],
    [0.025, 0.045],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00ff88" intensity={bgGlowIntensity} focusY={40} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 55,
          flexDirection: "column",
          gap: 48,
        }}
      >
        {/* Header with live indicator */}
        <div
          style={{
            opacity: headerOpacity,
            transform: `translateY(${headerY}px)`,
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

          {/* Live indicator with glow */}
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#00ff88",
              opacity: indicatorOpacity,
              boxShadow: `0 0 ${10 + 8 * indicatorOpacity}px rgba(0, 255, 136, ${0.45 + 0.35 * indicatorOpacity})`,
            }}
          />

          <span
            style={{
              fontSize: 11,
              color: "#4a4a4a",
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
              background: "linear-gradient(90deg, rgba(0, 255, 136, 0.25), transparent)",
            }}
          />
        </div>

        {/* Stats row - deliberate stagger for impact */}
        <div
          style={{
            display: "flex",
            gap: 26,
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 980,
          }}
        >
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              stat={stat}
              delay={0.22 + index * 0.22}
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
  const sceneFade = interpolate(frame, [0, fps * 0.12], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Background glow intensifies throughout
  const bgIntensity = interpolate(
    frame,
    [0, fps * 1.5],
    [0.03, 0.06],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Logo - powerful entrance with weight
  const logoProgress = spring({
    frame,
    fps,
    config: { damping: 180, stiffness: 50, mass: 1.3 },
  });
  const logoOpacity = interpolate(frame, [0, fps * 0.25], [0, 1], {
    extrapolateRight: "clamp",
  });
  const logoScale = interpolate(logoProgress, [0, 1], [0.85, 1]);
  const logoGlow = interpolate(
    frame,
    [fps * 0.2, fps * 0.9],
    [0, 60],
    {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Outer ring pulse - adds presence
  const ringOpacity = interpolate(
    frame,
    [fps * 0.15, fps * 0.3, fps * 0.8, fps * 1.2],
    [0, 0.25, 0.15, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ringScale = interpolate(
    frame,
    [fps * 0.15, fps * 1.2],
    [0.7, 1.8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Tagline - confident timing
  const taglineOpacity = interpolate(
    frame,
    [fps * 0.38, fps * 0.65],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const taglineY = interpolate(
    frame,
    [fps * 0.38, fps * 0.7],
    [15, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // CTA button - THE action moment, slightly delayed for impact
  const ctaDelay = fps * 0.65;
  const ctaProgress = spring({
    frame: frame - ctaDelay,
    fps,
    config: { damping: 180, stiffness: 70, mass: 1.1 },
  });
  const ctaOpacity = interpolate(
    frame,
    [ctaDelay, ctaDelay + fps * 0.22],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ctaY = interpolate(ctaProgress, [0, 1], [25, 0]);
  const ctaScale = interpolate(ctaProgress, [0, 1], [0.95, 1]);

  // CTA glow builds dramatically
  const ctaGlow = interpolate(
    frame,
    [ctaDelay + fps * 0.2, fps * 1.6],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Subtle pulsing glow on CTA after it lands
  const ctaPulse = frame > fps * 1.2 ? interpolate(
    (frame - fps * 1.2) % (fps * 2),
    [0, fps * 1, fps * 2],
    [0.85, 1, 0.85]
  ) : 1;

  // Bottom text - final beat with gravitas
  const bottomOpacity = interpolate(
    frame,
    [fps * 1.15, fps * 1.5],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const bottomY = interpolate(
    frame,
    [fps * 1.15, fps * 1.55],
    [10, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Decorative lines frame the bottom text
  const lineWidth = interpolate(
    frame,
    [fps * 1.35, fps * 1.85],
    [0, 55],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00ff88" intensity={bgIntensity} focusY={50} />

      {/* Additional ambient glow behind CTA */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 50% 40% at 50% 55%, rgba(0, 255, 136, ${0.04 * ctaGlow}) 0%, transparent 60%)`,
        }}
      />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 26,
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
              width: 120,
              height: 120,
              borderRadius: "50%",
              border: "1px solid rgba(0, 255, 136, 0.3)",
              transform: `translate(-50%, -50%) scale(${ringScale})`,
              opacity: ringOpacity,
            }}
          />
          <div
            style={{
              transform: `scale(${logoScale})`,
              opacity: logoOpacity,
              filter: `drop-shadow(0 0 ${logoGlow}px rgba(0, 255, 136, 0.5))`,
            }}
          >
            <FedLogo size={100} glow={false} />
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
              fontSize: 24,
              color: "#555555",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 400,
              letterSpacing: 0.5,
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
              padding: "18px 58px",
              background: "linear-gradient(140deg, #00ff88 0%, #00ffaa 50%, #00ff88 100%)",
              borderRadius: 50,
              boxShadow: `
                0 8px 32px rgba(0, 255, 136, ${(0.25 + 0.15 * ctaGlow) * ctaPulse}),
                0 0 ${40 * ctaGlow * ctaPulse}px rgba(0, 255, 136, ${0.15 * ctaGlow * ctaPulse}),
                inset 0 2px 0 rgba(255, 255, 255, 0.2),
                inset 0 -1px 0 rgba(0, 0, 0, 0.1)
              `,
            }}
          >
            <span
              style={{
                fontSize: 36,
                fontWeight: 900,
                color: "#020202",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -0.5,
                textShadow: "0 1px 0 rgba(255, 255, 255, 0.2)",
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
            marginTop: 12,
            display: "flex",
            alignItems: "center",
            gap: 16,
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
              fontSize: 11,
              color: "#3a3a3a",
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
              background: "linear-gradient(90deg, rgba(0, 255, 136, 0.25), transparent)",
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

  // Clean, professional fades (0.22s - quick but not jarring)
  const transitionFrames = Math.round(0.22 * fps);

  return (
    <TransitionSeries>
      {/* Intro: 2s - Logo hook with gravitas */}
      <TransitionSeries.Sequence durationInFrames={Math.round(2 * fps)}>
        <IntroScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* Headline: 1.8s - Let each word land properly */}
      <TransitionSeries.Sequence durationInFrames={Math.round(1.8 * fps)}>
        <HeadlineScene headline={headline} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* Stats: 3.8s - The meat with counting animations */}
      <TransitionSeries.Sequence durationInFrames={Math.round(3.8 * fps)}>
        <StatsScene stats={stats} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* CTA: 2.4s - Strong, confident close */}
      <TransitionSeries.Sequence durationInFrames={Math.round(2.4 * fps)}>
        <CTAScene tagline={tagline} cta={cta} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
