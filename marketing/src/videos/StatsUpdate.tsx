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

// Scene 1: The Hook - Logo emerges with cinematic gravitas
const IntroScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Cinematic light sweep - horizontal line that draws attention
  const sweepProgress = interpolate(
    frame,
    [0, fps * 0.4],
    [0, 1],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const sweepOpacity = interpolate(
    frame,
    [0, fps * 0.1, fps * 0.3, fps * 0.5],
    [0, 0.6, 0.4, 0],
    { extrapolateRight: "clamp" }
  );

  // Logo: Emerges from darkness with gravitas
  const logoDelay = 0.15;
  const logoProgress = spring({
    frame: frame - logoDelay * fps,
    fps,
    config: { damping: 200, stiffness: 50, mass: 1.2 },
  });

  const logoOpacity = interpolate(
    frame,
    [logoDelay * fps, (logoDelay + 0.35) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const logoScale = interpolate(logoProgress, [0, 1], [0.85, 1]);
  const logoY = interpolate(logoProgress, [0, 1], [15, 0]);

  // Logo glow builds to create presence
  const logoGlow = interpolate(
    frame,
    [fps * 0.4, fps * 1.5],
    [0, 55],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Ring pulse around logo - adds depth
  const ringOpacity = interpolate(
    frame,
    [fps * 0.5, fps * 0.8, fps * 1.4],
    [0, 0.15, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ringScale = interpolate(
    frame,
    [fps * 0.5, fps * 1.4],
    [0.8, 1.6],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // $FED text - appears after logo settles
  const fedDelay = 0.7;
  const fedProgress = spring({
    frame: frame - fedDelay * fps,
    fps,
    config: { damping: 200, stiffness: 80 },
  });
  const fedOpacity = interpolate(
    frame,
    [fedDelay * fps, (fedDelay + 0.2) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const fedY = interpolate(fedProgress, [0, 1], [12, 0]);

  // Tagline - final beat
  const tagDelay = 1.05;
  const tagOpacity = interpolate(
    frame,
    [tagDelay * fps, (tagDelay + 0.25) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const tagY = interpolate(
    frame,
    [tagDelay * fps, (tagDelay + 0.3) * fps],
    [8, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00ff88" intensity={0.03} focusY={50} />

      {/* Cinematic light sweep - horizontal line */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: `${sweepProgress * 400}px`,
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(0,255,136,0.8) 30%, rgba(0,255,136,1) 50%, rgba(0,255,136,0.8) 70%, transparent)",
            opacity: sweepOpacity,
            boxShadow: "0 0 20px rgba(0,255,136,0.4)",
            position: "absolute",
          }}
        />
      </AbsoluteFill>

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
            gap: 18,
          }}
        >
          {/* Logo with ring pulse */}
          <div style={{ position: "relative" }}>
            {/* Ring pulse */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 160,
                height: 160,
                borderRadius: "50%",
                border: "1px solid rgba(0, 255, 136, 0.3)",
                transform: `translate(-50%, -50%) scale(${ringScale})`,
                opacity: ringOpacity,
              }}
            />
            {/* Logo */}
            <div
              style={{
                transform: `scale(${logoScale}) translateY(${logoY}px)`,
                opacity: logoOpacity,
                filter: `drop-shadow(0 0 ${logoGlow}px rgba(0, 255, 136, 0.5))`,
              }}
            >
              <FedLogo size={140} glow={false} />
            </div>
          </div>

          {/* $FED */}
          <div
            style={{
              opacity: fedOpacity,
              transform: `translateY(${fedY}px)`,
            }}
          >
            <span
              style={{
                fontSize: 56,
                fontWeight: 900,
                color: "#ffffff",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -2,
              }}
            >
              <span style={{ color: "#00ff88" }}>$</span>FED
            </span>
          </div>

          {/* Tagline */}
          <div
            style={{
              opacity: tagOpacity,
              transform: `translateY(${tagY}px)`,
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: "#505050",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: 4.5,
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              Quantitative Easing for the people
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 2: Headline - Typography that commands attention
const HeadlineScene: React.FC<{ headline: string }> = ({ headline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = headline.split(" ");

  // Scene fade in - quick
  const sceneFade = interpolate(frame, [0, fps * 0.06], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Accent lines - subtle framing that builds
  const lineWidth = interpolate(
    frame,
    [fps * 0.08, fps * 0.5],
    [0, 60],
    {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Underline for BRRR - draws after the word appears
  const brrrUnderline = interpolate(
    frame,
    [fps * 0.7, fps * 1.0],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00ff88" intensity={0.035} focusY={48} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 70,
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* Top accent */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: lineWidth,
              height: 1,
              background: "linear-gradient(270deg, rgba(0, 255, 136, 0.35), transparent)",
            }}
          />
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#00ff88",
              opacity: interpolate(frame, [fps * 0.15, fps * 0.35], [0, 0.6], {
                extrapolateRight: "clamp",
              }),
              boxShadow: "0 0 8px rgba(0, 255, 136, 0.4)",
            }}
          />
          <div
            style={{
              width: lineWidth,
              height: 1,
              background: "linear-gradient(90deg, rgba(0, 255, 136, 0.35), transparent)",
            }}
          />
        </div>

        {/* Headline - word by word with precise rhythm */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0 22px",
            maxWidth: 1050,
            position: "relative",
          }}
        >
          {words.map((word, index) => {
            // Tight stagger - 80ms between words
            const delay = 0.12 + index * 0.08;
            const wordProgress = spring({
              frame: frame - delay * fps,
              fps,
              config: { damping: 180, stiffness: 120 },
            });
            const wordOpacity = interpolate(
              frame,
              [delay * fps, (delay + 0.1) * fps],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const wordY = interpolate(wordProgress, [0, 1], [18, 0]);

            // BRRR gets special treatment - it's the payoff
            const isEmphasis = word === "BRRR";

            // Glow builds on BRRR
            const emphasisGlow = isEmphasis ? interpolate(
              frame,
              [(delay + 0.15) * fps, fps * 1.2],
              [0, 45],
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
                  transform: `translateY(${wordY}px)`,
                  display: "inline-block",
                  letterSpacing: -3.5,
                  lineHeight: 1.08,
                  textShadow: isEmphasis
                    ? `0 0 ${emphasisGlow}px rgba(0, 255, 136, 0.5)`
                    : "0 4px 35px rgba(0, 0, 0, 0.45)",
                  position: "relative",
                }}
              >
                {word}
                {/* Underline accent for BRRR */}
                {isEmphasis && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: -8,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: `${brrrUnderline}%`,
                      height: 3,
                      background: "linear-gradient(90deg, transparent, #00ff88, transparent)",
                      borderRadius: 2,
                      opacity: 0.7,
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

// Stat card - Premium glass card with hero number and counting animation
const StatCard: React.FC<{
  stat: StatsUpdateProps["stats"][0];
  delay: number;
  index: number;
}> = ({ stat, delay, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card entrance - smooth spring
  const cardProgress = spring({
    frame: frame - delay * fps,
    fps,
    config: { damping: 180, stiffness: 60 },
  });

  // Number counting with very satisfying deceleration
  const countDuration = 1.8;
  const numberProgress = interpolate(
    frame,
    [(delay + 0.12) * fps, (delay + 0.12 + countDuration) * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      // Custom easing for more dramatic slow-down at the end
      easing: (t) => 1 - Math.pow(1 - t, 4),
    }
  );

  // Parse value
  const numericValue =
    stat.numericValue ?? (parseFloat(stat.value.replace(/[^0-9.]/g, "")) || 0);
  const displayValue = Math.floor(numericValue * numberProgress);
  const prefix = stat.prefix ?? (stat.value.startsWith("$") ? "$" : "");
  const suffix = stat.suffix ?? (stat.value.includes("+") ? "+" : "");

  const cardOpacity = interpolate(cardProgress, [0, 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });
  const cardY = interpolate(cardProgress, [0, 1], [35, 0]);
  const cardScale = interpolate(cardProgress, [0, 1], [0.97, 1]);

  // Color system - FED brand palette with distinct colors
  const accentColors = ["#00ff88", "#00d4ff", "#ff6b9d"];
  const accentColor = stat.color || accentColors[index % accentColors.length];

  // Top accent line draws from left
  const accentWidth = interpolate(
    frame,
    [(delay + 0.1) * fps, (delay + 0.55) * fps],
    [0, 100],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Card glow builds after number lands
  const glowIntensity = interpolate(
    frame,
    [(delay + 1.2) * fps, (delay + 2.0) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : "0, 255, 136";
  };
  const accentRgb = hexToRgb(accentColor);

  // Subtle pulse on the number when it lands
  const landedPulse = numberProgress >= 0.98 ? interpolate(
    frame,
    [(delay + 0.12 + countDuration) * fps, (delay + 0.12 + countDuration + 0.15) * fps],
    [1.02, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : 1;

  return (
    <div
      style={{
        transform: `translateY(${cardY}px) scale(${cardScale})`,
        opacity: cardOpacity,
      }}
    >
      <div
        style={{
          padding: "30px 40px",
          background:
            "linear-gradient(165deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.008) 100%)",
          borderRadius: 16,
          minWidth: 270,
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          boxShadow: `
            0 25px 60px rgba(0, 0, 0, 0.45),
            0 0 ${35 * glowIntensity}px rgba(${accentRgb}, ${0.05 * glowIntensity}),
            inset 0 1px 0 rgba(255, 255, 255, 0.03)
          `,
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${accentWidth}%`,
            height: 2,
            background: `linear-gradient(90deg, ${accentColor} 0%, ${accentColor}50 80%, transparent 100%)`,
            borderRadius: "2px 0 0 0",
          }}
        />

        {/* Hero number */}
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
          }}
        >
          <span style={{ color: accentColor, opacity: 0.95 }}>{prefix}</span>
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

        {/* Label with indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: accentColor,
              opacity: 0.4 + glowIntensity * 0.4,
              boxShadow: `0 0 ${6 * glowIntensity}px ${accentColor}`,
            }}
          />
          <div
            style={{
              fontSize: 11,
              color: "#555555",
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

// Scene 3: Stats - The meat of the video with dramatic reveals
const StatsScene: React.FC<{ stats: StatsUpdateProps["stats"] }> = ({ stats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneFade = interpolate(frame, [0, fps * 0.06], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Section header
  const headerOpacity = interpolate(frame, [fps * 0.04, fps * 0.22], [0, 1], {
    extrapolateRight: "clamp",
  });
  const headerY = interpolate(
    frame,
    [fps * 0.04, fps * 0.28],
    [10, 0],
    {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Live indicator pulse
  const livePulse = interpolate(
    (frame - fps * 0.25) % (fps * 1.5),
    [0, fps * 0.3, fps * 1.5],
    [0.5, 1, 0.5],
    { extrapolateLeft: "clamp" }
  );
  const indicatorOpacity = frame > fps * 0.2 ? livePulse : interpolate(
    frame,
    [fps * 0.08, fps * 0.2],
    [0, 0.5],
    { extrapolateRight: "clamp" }
  );

  // Accent lines - draws outward
  const lineWidth = interpolate(
    frame,
    [fps * 0.05, fps * 0.38],
    [0, 55],
    {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Background glow intensifies as numbers count
  const bgGlowIntensity = interpolate(
    frame,
    [fps * 1.0, fps * 2.5],
    [0.025, 0.04],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00ff88" intensity={bgGlowIntensity} focusY={42} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 50,
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
              background: "linear-gradient(270deg, #333333, transparent)",
            }}
          />

          {/* Live dot with glow */}
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#00ff88",
              opacity: indicatorOpacity,
              boxShadow: `0 0 ${8 + 6 * indicatorOpacity}px rgba(0, 255, 136, ${0.5 + 0.3 * indicatorOpacity})`,
            }}
          />

          <span
            style={{
              fontSize: 11,
              color: "#555555",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 4.5,
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
              background: "linear-gradient(90deg, #333333, transparent)",
            }}
          />
        </div>

        {/* Stats row - tighter stagger for rhythm */}
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
              delay={0.18 + index * 0.2}
              index={index}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 4: CTA - Confident, memorable close that sticks
const CTAScene: React.FC<{ tagline: string; cta: string }> = ({ tagline, cta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneFade = interpolate(frame, [0, fps * 0.08], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Logo with spring entrance
  const logoProgress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 60, mass: 1.1 },
  });
  const logoOpacity = interpolate(frame, [0, fps * 0.18], [0, 1], {
    extrapolateRight: "clamp",
  });
  const logoGlow = interpolate(
    frame,
    [fps * 0.12, fps * 0.7],
    [0, 45],
    {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Tagline - slightly earlier
  const taglineOpacity = interpolate(
    frame,
    [fps * 0.3, fps * 0.55],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const taglineY = interpolate(
    frame,
    [fps * 0.3, fps * 0.58],
    [12, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // CTA button - the main action
  const ctaDelay = fps * 0.55;
  const ctaProgress = spring({
    frame: frame - ctaDelay,
    fps,
    config: { damping: 170, stiffness: 80 },
  });
  const ctaOpacity = interpolate(
    frame,
    [ctaDelay, ctaDelay + fps * 0.18],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ctaY = interpolate(ctaProgress, [0, 1], [20, 0]);
  const ctaGlow = interpolate(
    frame,
    [ctaDelay + fps * 0.15, fps * 1.4],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Bottom text - final beat
  const bottomOpacity = interpolate(
    frame,
    [fps * 1.0, fps * 1.35],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const bottomY = interpolate(
    frame,
    [fps * 1.0, fps * 1.4],
    [8, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Subtle decorative lines
  const lineWidth = interpolate(
    frame,
    [fps * 1.2, fps * 1.7],
    [0, 40],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00ff88" intensity={0.045} focusY={50} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 24,
          flexDirection: "column",
        }}
      >
        {/* Logo */}
        <div
          style={{
            transform: `scale(${logoProgress})`,
            opacity: logoOpacity,
            filter: `drop-shadow(0 0 ${logoGlow}px rgba(0, 255, 136, 0.45))`,
          }}
        >
          <FedLogo size={95} glow={false} />
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
              color: "#606060",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 400,
              letterSpacing: 0.3,
            }}
          >
            {tagline}
          </span>
        </div>

        {/* CTA Button - prominent and glowing */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px)`,
          }}
        >
          <div
            style={{
              padding: "17px 52px",
              background: "linear-gradient(135deg, #00ff88 0%, #00ffaa 100%)",
              borderRadius: 50,
              boxShadow: `
                0 6px 26px rgba(0, 255, 136, ${0.22 + 0.14 * ctaGlow}),
                0 0 ${32 * ctaGlow}px rgba(0, 255, 136, ${0.12 * ctaGlow}),
                inset 0 1px 0 rgba(255, 255, 255, 0.15)
              `,
            }}
          >
            <span
              style={{
                fontSize: 34,
                fontWeight: 900,
                color: "#030303",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -0.5,
              }}
            >
              {cta}
            </span>
          </div>
        </div>

        {/* Bottom proposition with decorative lines */}
        <div
          style={{
            opacity: bottomOpacity,
            transform: `translateY(${bottomY}px)`,
            marginTop: 10,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: lineWidth,
              height: 1,
              background: "linear-gradient(270deg, #2a2a2a, transparent)",
            }}
          />
          <span
            style={{
              fontSize: 12,
              color: "#454545",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 3.5,
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            Real yield. Every 2 minutes.
          </span>
          <div
            style={{
              width: lineWidth,
              height: 1,
              background: "linear-gradient(90deg, #2a2a2a, transparent)",
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
