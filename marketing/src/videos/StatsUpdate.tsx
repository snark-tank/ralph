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

// Premium cinematic background - Apple-quality depth and atmosphere
const CinematicBackground: React.FC<{
  accentColor?: string;
  variant?: "center" | "top" | "split";
  intensity?: number;
}> = ({ accentColor = "#00ff88", variant = "center", intensity = 1 }) => {
  const frame = useCurrentFrame();

  // Extremely subtle drift - barely perceptible, creates organic life
  const drift = interpolate(frame, [0, 900], [0, 2], {
    extrapolateRight: "clamp",
  });

  const gradientPosition = variant === "top" ? 30 : variant === "split" ? 45 : 50;

  // Convert hex to rgb for opacity control
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
      : { r: 0, g: 255, b: 136 };
  };

  const rgb = hexToRgb(accentColor);

  return (
    <AbsoluteFill>
      {/* True black base - premium feel */}
      <AbsoluteFill style={{ background: "#050505" }} />

      {/* Primary ambient glow - extremely subtle, barely visible */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 100% 50% at 50% ${gradientPosition + drift}%, rgba(${rgb.r},${rgb.g},${rgb.b},${0.03 * intensity}) 0%, transparent 60%)`,
        }}
      />

      {/* Secondary warmth layer - adds depth without distraction */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 35% at 50% ${gradientPosition + drift * 0.7}%, rgba(255,255,255,0.006) 0%, transparent 50%)`,
        }}
      />

      {/* Cinematic vignette - draws focus to center */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse 85% 75% at 50% 50%, transparent 30%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* Top edge gradient for dimension */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 15%)",
        }}
      />
    </AbsoluteFill>
  );
};

// Scene 1: The Hook - Cinematic reveal with dramatic tension
const IntroScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: Dramatic light bloom from center
  const bloomProgress = interpolate(frame, [0, fps * 0.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const bloomOpacity = interpolate(
    frame,
    [0, fps * 0.12, fps * 0.55, fps * 0.85],
    [0, 0.9, 0.65, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const bloomScale = interpolate(bloomProgress, [0, 1], [0.2, 1.2]);

  // Phase 2: Elegant ring expands - creates space for logo
  const ringProgress = interpolate(frame, [fps * 0.18, fps * 0.75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const ringScale = interpolate(ringProgress, [0, 1], [0.35, 1.1]);
  const ringOpacity = interpolate(
    frame,
    [fps * 0.18, fps * 0.38, fps * 1.3, fps * 1.7],
    [0, 0.3, 0.22, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Phase 3: Logo emerges with gravitas
  const logoDelay = fps * 0.32;
  const logoScale = spring({
    frame: frame - logoDelay,
    fps,
    config: { damping: 200, stiffness: 55 },
  });
  const logoOpacity = interpolate(frame, [logoDelay, logoDelay + fps * 0.28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Logo glow builds to emphasize the reveal
  const logoGlow = interpolate(frame, [logoDelay + fps * 0.15, fps * 1.3], [0, 42], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Phase 4: Title text - character by character, refined timing
  const titleText = "$FED";
  const titleChars = titleText.split("");

  // Horizontal accent lines - frame the composition
  const lineReveal = interpolate(frame, [fps * 0.65, fps * 1.05], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const lineWidth = interpolate(lineReveal, [0, 1], [0, 55]);
  const lineOpacity = interpolate(
    frame,
    [fps * 0.65, fps * 0.85, fps * 1.5, fps * 1.85],
    [0, 0.28, 0.28, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00ff88" variant="center" intensity={0.75} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Light bloom - dramatic opener */}
        <div
          style={{
            position: "absolute",
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,255,136,0.6) 0%, rgba(0,255,136,0.2) 40%, transparent 70%)",
            opacity: bloomOpacity,
            transform: `scale(${bloomScale})`,
            filter: "blur(8px)",
          }}
        />

        {/* Inner glow point */}
        <div
          style={{
            position: "absolute",
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#00ff88",
            opacity: bloomOpacity * 1.1,
            transform: `scale(${interpolate(bloomProgress, [0, 1], [0.3, 1])})`,
            boxShadow: `
              0 0 15px rgba(0, 255, 136, 0.9),
              0 0 30px rgba(0, 255, 136, 0.6)
            `,
          }}
        />

        {/* Single elegant ring */}
        <div
          style={{
            position: "absolute",
            width: 270,
            height: 270,
            borderRadius: "50%",
            border: "1px solid rgba(0, 255, 136, 0.35)",
            opacity: ringOpacity,
            transform: `scale(${ringScale})`,
          }}
        />

        {/* Horizontal accent lines */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            alignItems: "center",
            gap: 250,
          }}
        >
          <div
            style={{
              width: lineWidth,
              height: 1,
              background: "linear-gradient(270deg, rgba(0, 255, 136, 0.45), transparent)",
              opacity: lineOpacity,
            }}
          />
          <div
            style={{
              width: lineWidth,
              height: 1,
              background: "linear-gradient(90deg, rgba(0, 255, 136, 0.45), transparent)",
              opacity: lineOpacity,
            }}
          />
        </div>

        {/* Logo and title container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          {/* Logo - the hero element */}
          <div
            style={{
              transform: `scale(${logoScale})`,
              opacity: logoOpacity,
              filter: `drop-shadow(0 0 ${logoGlow}px rgba(0, 255, 136, 0.42))`,
            }}
          >
            <FedLogo size={125} glow={false} />
          </div>

          {/* Title - character stagger with refined timing */}
          <div
            style={{
              display: "flex",
              gap: 2,
              height: 58,
              overflow: "hidden",
            }}
          >
            {titleChars.map((char, i) => {
              const charDelay = 0.58 + i * 0.06;
              const charProgress = spring({
                frame: frame - charDelay * fps,
                fps,
                config: { damping: 200, stiffness: 95 },
              });
              const charOpacity = interpolate(
                frame,
                [charDelay * fps, (charDelay + 0.14) * fps],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              const charY = interpolate(charProgress, [0, 1], [18, 0]);

              return (
                <span
                  key={i}
                  style={{
                    fontSize: 50,
                    fontWeight: 900,
                    color: char === "$" ? "#00ff88" : "#ffffff",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    letterSpacing: -2,
                    opacity: charOpacity,
                    transform: `translateY(${charY}px)`,
                    display: "inline-block",
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 2: The Headline - Typography that demands attention
const HeadlineScene: React.FC<{ headline: string }> = ({ headline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Split into words for staggered reveal
  const words = headline.split(" ");

  // Scene fade - quick but smooth
  const sceneFade = interpolate(frame, [0, fps * 0.12], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Badge line draws from center outward
  const lineProgress = interpolate(frame, [fps * 0.08, fps * 0.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const lineWidth = interpolate(lineProgress, [0, 1], [0, 45]);
  const lineOpacity = interpolate(
    frame,
    [fps * 0.08, fps * 0.2, fps * 1.3, fps * 1.5],
    [0, 0.4, 0.4, 0.2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Badge text fades in
  const badgeOpacity = interpolate(frame, [fps * 0.15, fps * 0.35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const badgeY = interpolate(frame, [fps * 0.15, fps * 0.4], [6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00ff88" variant="center" intensity={0.9} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 80,
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* Badge with accent lines */}
        <div
          style={{
            opacity: badgeOpacity,
            transform: `translateY(${badgeY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: lineWidth,
              height: 1,
              background: "linear-gradient(270deg, rgba(0, 255, 136, 0.6), transparent)",
              opacity: lineOpacity,
            }}
          />
          <span
            style={{
              fontSize: 11,
              color: "#4a4a4a",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 4,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Protocol Status
          </span>
          <div
            style={{
              width: lineWidth,
              height: 1,
              background: "linear-gradient(90deg, rgba(0, 255, 136, 0.6), transparent)",
              opacity: lineOpacity,
            }}
          />
        </div>

        {/* Headline words - staggered reveal with refined timing */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0 16px",
            maxWidth: 950,
          }}
        >
          {words.map((word, index) => {
            // Tighter stagger for punchy delivery
            const delay = 0.18 + index * 0.085;
            const wordProgress = spring({
              frame: frame - delay * fps,
              fps,
              config: { damping: 200, stiffness: 120 },
            });
            const wordOpacity = interpolate(
              frame,
              [delay * fps, (delay + 0.12) * fps],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const wordY = interpolate(wordProgress, [0, 1], [18, 0]);

            // "BRRR" gets the emphasis treatment
            const isEmphasis = word === "BRRR";

            return (
              <span
                key={index}
                style={{
                  fontSize: 68,
                  fontWeight: 900,
                  color: isEmphasis ? "#00ff88" : "#ffffff",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  opacity: wordOpacity,
                  transform: `translateY(${wordY}px)`,
                  display: "inline-block",
                  letterSpacing: -2.5,
                  lineHeight: 1.1,
                  textShadow: isEmphasis
                    ? "0 0 25px rgba(0, 255, 136, 0.35)"
                    : "0 2px 20px rgba(0, 0, 0, 0.4)",
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

// Premium stat card - refined glass morphism with sophisticated animations
const StatCard: React.FC<{
  stat: StatsUpdateProps["stats"][0];
  delay: number;
  isLast?: boolean;
  index: number;
}> = ({ stat, delay, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card entrance - smooth spring with no overshoot
  const cardProgress = spring({
    frame: frame - delay * fps,
    fps,
    config: { damping: 200, stiffness: 75 },
  });

  // Number counting - satisfying ease-out with longer settle
  const countDuration = 1.05;
  const numberProgress = interpolate(
    frame,
    [(delay + 0.15) * fps, (delay + 0.15 + countDuration) * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Parse and display value
  const numericValue = stat.numericValue ?? (parseFloat(stat.value.replace(/[^0-9.]/g, "")) || 0);
  const displayValue = Math.floor(numericValue * numberProgress);
  const prefix = stat.prefix ?? (stat.value.startsWith("$") ? "$" : "");
  const suffix = stat.suffix ?? (stat.value.includes("+") ? "+" : "");

  // Card transforms - subtle, professional
  const cardOpacity = interpolate(cardProgress, [0, 0.45], [0, 1], {
    extrapolateRight: "clamp",
  });
  const cardY = interpolate(cardProgress, [0, 1], [25, 0]);
  const cardScale = interpolate(cardProgress, [0, 1], [0.97, 1]);

  // Accent colors - refined palette
  const accentColors = ["#00ff88", "#00d4ff", "#ff6b9d"];
  const accentColor = accentColors[index % accentColors.length];

  // Top accent line - draws from left to right
  const accentWidth = interpolate(
    frame,
    [(delay + 0.1) * fps, (delay + 0.5) * fps],
    [0, 100],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Glow builds subtly after card settles
  const glowIntensity = interpolate(
    frame,
    [(delay + 0.4) * fps, (delay + 0.85) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Subtle shimmer effect - a single pass that catches the eye
  const shimmerProgress = interpolate(
    frame,
    [(delay + 0.25) * fps, (delay + 0.7) * fps],
    [-100, 200],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const shimmerOpacity = interpolate(
    frame,
    [(delay + 0.25) * fps, (delay + 0.4) * fps, (delay + 0.55) * fps, (delay + 0.7) * fps],
    [0, 0.15, 0.15, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Convert hex to rgb for dynamic shadow
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : "0, 255, 136";
  };
  const accentRgb = hexToRgb(accentColor);

  return (
    <div
      style={{
        transform: `translateY(${cardY}px) scale(${cardScale})`,
        opacity: cardOpacity,
      }}
    >
      <div
        style={{
          padding: "26px 32px",
          background: `linear-gradient(145deg, rgba(255,255,255,0.028) 0%, rgba(255,255,255,0.008) 100%)`,
          borderRadius: 14,
          minWidth: 250,
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.04)",
          boxShadow: `
            0 18px 40px rgba(0, 0, 0, 0.4),
            0 0 ${28 * glowIntensity}px rgba(${accentRgb}, ${0.055 * glowIntensity}),
            inset 0 1px 0 rgba(255, 255, 255, 0.025)
          `,
        }}
      >
        {/* Shimmer highlight - single pass */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: `${shimmerProgress}%`,
            width: "30%",
            height: "100%",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
            opacity: shimmerOpacity,
            transform: "skewX(-20deg)",
            pointerEvents: "none",
          }}
        />

        {/* Top accent line - draws from left */}
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

        {/* Number display */}
        <div
          style={{
            fontSize: 44,
            fontWeight: 900,
            color: "#ffffff",
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: -2,
            lineHeight: 1,
            marginBottom: 12,
          }}
        >
          <span style={{ color: accentColor, opacity: 0.88 }}>{prefix}</span>
          {displayValue.toLocaleString()}
          <span
            style={{
              color: "#2e2e2e",
              fontSize: 25,
              fontWeight: 700,
              marginLeft: 3,
            }}
          >
            {suffix}
          </span>
        </div>

        {/* Label with subtle indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: accentColor,
              opacity: 0.45 + glowIntensity * 0.35,
            }}
          />
          <div
            style={{
              fontSize: 10,
              color: "#484848",
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

// Scene 3: Stats Display - The core content with perfect pacing
const StatsScene: React.FC<{ stats: StatsUpdateProps["stats"] }> = ({ stats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene fade - quick and clean
  const sceneFade = interpolate(frame, [0, fps * 0.12], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Header line animation
  const lineProgress = interpolate(frame, [fps * 0.06, fps * 0.35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const lineWidth = interpolate(lineProgress, [0, 1], [0, 35]);
  const lineOpacity = interpolate(lineProgress, [0, 0.5, 1], [0, 0.3, 0.25]);

  // Header text
  const headerOpacity = interpolate(frame, [fps * 0.1, fps * 0.28], [0, 1], {
    extrapolateRight: "clamp",
  });
  const headerY = interpolate(frame, [fps * 0.1, fps * 0.32], [6, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Live indicator - subtle pulsing glow that suggests real-time
  const indicatorOpacity = interpolate(
    frame,
    [fps * 0.12, fps * 0.3],
    [0, 1],
    { extrapolateRight: "clamp" }
  );
  const indicatorGlow = interpolate(
    frame,
    [fps * 0.25, fps * 0.55],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00ff88" variant="top" intensity={0.85} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 50,
          flexDirection: "column",
          gap: 36,
        }}
      >
        {/* Section header - minimal and purposeful */}
        <div
          style={{
            opacity: headerOpacity,
            transform: `translateY(${headerY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          {/* Left accent line */}
          <div
            style={{
              width: lineWidth,
              height: 1,
              background: "linear-gradient(270deg, #2a2a2a, transparent)",
              opacity: lineOpacity,
            }}
          />

          {/* Live indicator */}
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#00ff88",
              opacity: indicatorOpacity,
              boxShadow: `0 0 ${6 + 4 * indicatorGlow}px rgba(0, 255, 136, ${0.5 + 0.2 * indicatorGlow})`,
            }}
          />

          <span
            style={{
              fontSize: 10,
              color: "#484848",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 4,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Live Metrics
          </span>

          {/* Right accent line */}
          <div
            style={{
              width: lineWidth,
              height: 1,
              background: "linear-gradient(90deg, #2a2a2a, transparent)",
              opacity: lineOpacity,
            }}
          />
        </div>

        {/* Stats row - refined spacing and stagger */}
        <div
          style={{
            display: "flex",
            gap: 22,
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 920,
          }}
        >
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              stat={stat}
              delay={0.22 + index * 0.18}
              isLast={index === stats.length - 1}
              index={index}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 4: CTA - Confident, memorable close
const CTAScene: React.FC<{ tagline: string; cta: string }> = ({ tagline, cta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene fade
  const sceneFade = interpolate(frame, [0, fps * 0.15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Logo entrance - elegant spring
  const logoProgress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 70 },
  });
  const logoOpacity = interpolate(frame, [0, fps * 0.22], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Logo glow - builds and holds
  const logoGlow = interpolate(frame, [fps * 0.15, fps * 0.7], [0, 35], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Tagline - appears with subtle lift
  const taglineOpacity = interpolate(frame, [fps * 0.3, fps * 0.55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const taglineY = interpolate(frame, [fps * 0.3, fps * 0.6], [8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // CTA button - the hero action
  const ctaDelay = fps * 0.55;
  const ctaProgress = spring({
    frame: frame - ctaDelay,
    fps,
    config: { damping: 180, stiffness: 90 },
  });
  const ctaOpacity = interpolate(frame, [ctaDelay, ctaDelay + fps * 0.25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ctaY = interpolate(ctaProgress, [0, 1], [16, 0]);

  // CTA glow - subtle emphasis
  const ctaGlow = interpolate(frame, [ctaDelay + fps * 0.2, fps * 1.2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Bottom text - final touch
  const bottomOpacity = interpolate(frame, [fps * 1.0, fps * 1.35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bottomY = interpolate(frame, [fps * 1.0, fps * 1.4], [6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00ff88" variant="center" intensity={1.1} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
          flexDirection: "column",
        }}
      >
        {/* Logo */}
        <div
          style={{
            transform: `scale(${logoProgress})`,
            opacity: logoOpacity,
            filter: `drop-shadow(0 0 ${logoGlow}px rgba(0, 255, 136, 0.4))`,
          }}
        >
          <FedLogo size={85} glow={false} />
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
              fontSize: 20,
              color: "#5a5a5a",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 400,
              letterSpacing: 0.3,
            }}
          >
            {tagline}
          </span>
        </div>

        {/* CTA Button - refined pill */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px)`,
          }}
        >
          <div
            style={{
              padding: "14px 44px",
              background: "#00ff88",
              borderRadius: 50,
              boxShadow: `
                0 4px 16px rgba(0, 255, 136, ${0.2 + 0.1 * ctaGlow}),
                0 0 ${25 * ctaGlow}px rgba(0, 255, 136, ${0.15 * ctaGlow})
              `,
            }}
          >
            <span
              style={{
                fontSize: 30,
                fontWeight: 900,
                color: "#080808",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -0.5,
              }}
            >
              {cta}
            </span>
          </div>
        </div>

        {/* Bottom value proposition */}
        <div
          style={{
            opacity: bottomOpacity,
            transform: `translateY(${bottomY}px)`,
            marginTop: 6,
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: "#3d3d3d",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 3,
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

// Main composition - precisely timed for ~10 second video
export const StatsUpdate: React.FC<StatsUpdateProps> = ({
  headline,
  stats,
  tagline,
  cta,
}) => {
  const { fps } = useVideoConfig();

  // Quick, clean transitions (0.25s) - not sluggish
  const transitionFrames = Math.round(0.25 * fps);

  return (
    <TransitionSeries>
      {/* Intro: 2.0s - The hook - cinematic reveal */}
      <TransitionSeries.Sequence durationInFrames={Math.round(2.0 * fps)}>
        <IntroScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* Headline: 1.5s - Typography punch - quick but impactful */}
      <TransitionSeries.Sequence durationInFrames={Math.round(1.5 * fps)}>
        <HeadlineScene headline={headline} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* Stats: 4.0s - The core content - numbers need time to land */}
      <TransitionSeries.Sequence durationInFrames={Math.round(4.0 * fps)}>
        <StatsScene stats={stats} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* CTA: 2.5s - Confident close */}
      <TransitionSeries.Sequence durationInFrames={Math.round(2.5 * fps)}>
        <CTAScene tagline={tagline} cta={cta} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
