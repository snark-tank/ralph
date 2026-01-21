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

// Ultra-refined background - Apple-quality subtlety
const CinematicBackground: React.FC<{
  accentColor?: string;
  intensity?: number;
  focusY?: number;
}> = ({ accentColor = "#00ff88", intensity = 0.025, focusY = 50 }) => {
  const frame = useCurrentFrame();

  // Imperceptible drift - adds organic life without distraction
  const drift = interpolate(frame, [0, 900], [0, 1], {
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
      {/* True black - premium foundation */}
      <AbsoluteFill style={{ background: "#030303" }} />

      {/* Primary glow - barely there, supremely elegant */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 85% 40% at 50% ${focusY + drift}%, ${hexToRgba(accentColor, intensity)} 0%, transparent 70%)`,
        }}
      />

      {/* Deep vignette - cinematic framing */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 75% 65% at 50% 50%, transparent 30%, rgba(0,0,0,0.7) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// Scene 1: The Hook - Dramatic, minimal, cinematic
// A single point of light expands into the logo - Apple keynote style
const IntroScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: Single point of light appears at center
  const pointOpacity = interpolate(
    frame,
    [0, fps * 0.15, fps * 0.5, fps * 0.8],
    [0, 0.9, 0.9, 0],
    { extrapolateRight: "clamp" }
  );
  const pointScale = interpolate(frame, [0, fps * 0.15], [0.5, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const pointGlow = interpolate(frame, [fps * 0.05, fps * 0.4], [0, 25], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Phase 2: Light expands into soft ring - creates space for logo
  const ringProgress = interpolate(frame, [fps * 0.35, fps * 1.0], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const ringScale = interpolate(ringProgress, [0, 1], [0.3, 1]);
  const ringOpacity = interpolate(
    frame,
    [fps * 0.35, fps * 0.55, fps * 1.3, fps * 1.6],
    [0, 0.2, 0.15, 0],
    { extrapolateRight: "clamp" }
  );

  // Phase 3: Logo emerges - the star of the show
  const logoDelay = fps * 0.45;
  const logoScale = spring({
    frame: frame - logoDelay,
    fps,
    config: { damping: 200, stiffness: 40 },
  });
  const logoOpacity = interpolate(
    frame,
    [logoDelay, logoDelay + fps * 0.35],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const logoGlow = interpolate(frame, [logoDelay + fps * 0.15, fps * 1.6], [0, 40], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Phase 4: "$FED" text rises from below - refined stagger
  const titleText = "$FED";
  const titleChars = titleText.split("");

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00ff88" intensity={0.02} focusY={50} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Point of light - the spark */}
        <div
          style={{
            position: "absolute",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#00ff88",
            opacity: pointOpacity,
            transform: `scale(${pointScale})`,
            boxShadow: `
              0 0 ${pointGlow}px rgba(0, 255, 136, 0.8),
              0 0 ${pointGlow * 2}px rgba(0, 255, 136, 0.4)
            `,
          }}
        />

        {/* Expanding ring - creates visual space */}
        <div
          style={{
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: "50%",
            border: "1px solid rgba(0, 255, 136, 0.25)",
            opacity: ringOpacity,
            transform: `scale(${ringScale})`,
          }}
        />

        {/* Logo and title container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
          }}
        >
          {/* Logo - hero element */}
          <div
            style={{
              transform: `scale(${logoScale})`,
              opacity: logoOpacity,
              filter: `drop-shadow(0 0 ${logoGlow}px rgba(0, 255, 136, 0.55))`,
            }}
          >
            <FedLogo size={130} glow={false} />
          </div>

          {/* Title text - character stagger */}
          <div
            style={{
              display: "flex",
              gap: 2,
              height: 55,
              overflow: "hidden",
            }}
          >
            {titleChars.map((char, i) => {
              const charDelay = 0.9 + i * 0.07;
              const charProgress = spring({
                frame: frame - charDelay * fps,
                fps,
                config: { damping: 200, stiffness: 75 },
              });
              const charOpacity = interpolate(
                frame,
                [charDelay * fps, (charDelay + 0.15) * fps],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              const charY = interpolate(charProgress, [0, 1], [22, 0]);

              return (
                <span
                  key={i}
                  style={{
                    fontSize: 48,
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

// Scene 2: The Headline - Bold typography, perfect pacing
const HeadlineScene: React.FC<{ headline: string }> = ({ headline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = headline.split(" ");

  // Scene entrance
  const sceneFade = interpolate(frame, [0, fps * 0.12], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Badge with context - appears first
  const badgeOpacity = interpolate(frame, [fps * 0.08, fps * 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });
  const badgeY = interpolate(frame, [fps * 0.08, fps * 0.35], [10, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Accent lines - draw outward from badge
  const lineWidth = interpolate(frame, [fps * 0.12, fps * 0.5], [0, 55], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00ff88" intensity={0.03} focusY={48} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 80,
          flexDirection: "column",
          gap: 18,
        }}
      >
        {/* Badge */}
        <div
          style={{
            opacity: badgeOpacity,
            transform: `translateY(${badgeY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 14,
          }}
        >
          <div
            style={{
              width: lineWidth,
              height: 1,
              background: "linear-gradient(270deg, rgba(0, 255, 136, 0.45), transparent)",
            }}
          />
          <span
            style={{
              fontSize: 11,
              color: "#4a4a4a",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 4.5,
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
              background: "linear-gradient(90deg, rgba(0, 255, 136, 0.45), transparent)",
            }}
          />
        </div>

        {/* Headline - word by word with proper pacing */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0 20px",
            maxWidth: 1000,
          }}
        >
          {words.map((word, index) => {
            // Generous stagger - let each word land
            const delay = 0.2 + index * 0.14;
            const wordProgress = spring({
              frame: frame - delay * fps,
              fps,
              config: { damping: 200, stiffness: 90 },
            });
            const wordOpacity = interpolate(
              frame,
              [delay * fps, (delay + 0.16) * fps],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const wordY = interpolate(wordProgress, [0, 1], [22, 0]);

            // "BRRR" emphasis
            const isEmphasis = word === "BRRR";

            return (
              <span
                key={index}
                style={{
                  fontSize: 76,
                  fontWeight: 900,
                  color: isEmphasis ? "#00ff88" : "#ffffff",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  opacity: wordOpacity,
                  transform: `translateY(${wordY}px)`,
                  display: "inline-block",
                  letterSpacing: -3.5,
                  lineHeight: 1.05,
                  textShadow: isEmphasis
                    ? "0 0 50px rgba(0, 255, 136, 0.45)"
                    : "0 3px 35px rgba(0, 0, 0, 0.5)",
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

// Premium stat card - clean, hero numbers, minimal chrome
const StatCard: React.FC<{
  stat: StatsUpdateProps["stats"][0];
  delay: number;
  index: number;
}> = ({ stat, delay, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card entrance - smooth, decisive
  const cardProgress = spring({
    frame: frame - delay * fps,
    fps,
    config: { damping: 200, stiffness: 55 },
  });

  // Number counting - satisfying ease
  const countDuration = 1.3;
  const numberProgress = interpolate(
    frame,
    [(delay + 0.08) * fps, (delay + 0.08 + countDuration) * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Parse value
  const numericValue =
    stat.numericValue ?? (parseFloat(stat.value.replace(/[^0-9.]/g, "")) || 0);
  const displayValue = Math.floor(numericValue * numberProgress);
  const prefix = stat.prefix ?? (stat.value.startsWith("$") ? "$" : "");
  const suffix = stat.suffix ?? (stat.value.includes("+") ? "+" : "");

  // Card transforms
  const cardOpacity = interpolate(cardProgress, [0, 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });
  const cardY = interpolate(cardProgress, [0, 1], [35, 0]);

  // Accent colors
  const accentColors = ["#00ff88", "#00d4ff", "#ff6b9d"];
  const accentColor = accentColors[index % accentColors.length];

  // Top line draws from left
  const accentWidth = interpolate(
    frame,
    [(delay + 0.05) * fps, (delay + 0.45) * fps],
    [0, 100],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Glow builds subtly
  const glowIntensity = interpolate(
    frame,
    [(delay + 0.6) * fps, (delay + 1.2) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Convert hex to rgb
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
        transform: `translateY(${cardY}px)`,
        opacity: cardOpacity,
      }}
    >
      <div
        style={{
          padding: "30px 40px",
          background:
            "linear-gradient(155deg, rgba(255,255,255,0.022) 0%, rgba(255,255,255,0.004) 100%)",
          borderRadius: 16,
          minWidth: 270,
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.03)",
          boxShadow: `
            0 25px 60px rgba(0, 0, 0, 0.45),
            0 0 ${35 * glowIntensity}px rgba(${accentRgb}, ${0.035 * glowIntensity}),
            inset 0 1px 0 rgba(255, 255, 255, 0.015)
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
            background: `linear-gradient(90deg, ${accentColor} 0%, ${accentColor}30 90%, transparent 100%)`,
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
            letterSpacing: -2.5,
            lineHeight: 1,
            marginBottom: 16,
          }}
        >
          <span style={{ color: accentColor, opacity: 0.92 }}>{prefix}</span>
          {displayValue.toLocaleString()}
          <span
            style={{
              color: "#252525",
              fontSize: 28,
              fontWeight: 700,
              marginLeft: 4,
            }}
          >
            {suffix}
          </span>
        </div>

        {/* Label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
          }}
        >
          <div
            style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: accentColor,
              opacity: 0.5 + glowIntensity * 0.35,
            }}
          />
          <div
            style={{
              fontSize: 11,
              color: "#4a4a4a",
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

// Scene 3: Stats Display - The core content with perfect rhythm
const StatsScene: React.FC<{ stats: StatsUpdateProps["stats"] }> = ({ stats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene entrance
  const sceneFade = interpolate(frame, [0, fps * 0.1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Header
  const headerOpacity = interpolate(frame, [fps * 0.06, fps * 0.28], [0, 1], {
    extrapolateRight: "clamp",
  });
  const headerY = interpolate(frame, [fps * 0.06, fps * 0.32], [10, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Live indicator - static glow (no pulsing)
  const indicatorOpacity = interpolate(
    frame,
    [fps * 0.1, fps * 0.28],
    [0, 1],
    { extrapolateRight: "clamp" }
  );
  const indicatorGlow = interpolate(
    frame,
    [fps * 0.18, fps * 0.55],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  // Accent lines
  const lineWidth = interpolate(frame, [fps * 0.06, fps * 0.38], [0, 45], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00ff88" intensity={0.025} focusY={38} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 50,
          flexDirection: "column",
          gap: 45,
        }}
      >
        {/* Section header */}
        <div
          style={{
            opacity: headerOpacity,
            transform: `translateY(${headerY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          {/* Left line */}
          <div
            style={{
              width: lineWidth,
              height: 1,
              background: "linear-gradient(270deg, #282828, transparent)",
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
              boxShadow: `0 0 ${6 + 6 * indicatorGlow}px rgba(0, 255, 136, ${0.55 + 0.25 * indicatorGlow})`,
            }}
          />

          <span
            style={{
              fontSize: 11,
              color: "#4a4a4a",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 4.5,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Live Metrics
          </span>

          {/* Right line */}
          <div
            style={{
              width: lineWidth,
              height: 1,
              background: "linear-gradient(90deg, #282828, transparent)",
            }}
          />
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: 26,
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 950,
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

// Scene 4: CTA - Confident, memorable close
const CTAScene: React.FC<{ tagline: string; cta: string }> = ({ tagline, cta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene entrance
  const sceneFade = interpolate(frame, [0, fps * 0.12], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Logo entrance
  const logoProgress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 55 },
  });
  const logoOpacity = interpolate(frame, [0, fps * 0.22], [0, 1], {
    extrapolateRight: "clamp",
  });
  const logoGlow = interpolate(frame, [fps * 0.12, fps * 0.75], [0, 38], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Tagline
  const taglineOpacity = interpolate(frame, [fps * 0.32, fps * 0.58], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const taglineY = interpolate(frame, [fps * 0.32, fps * 0.62], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // CTA button
  const ctaDelay = fps * 0.55;
  const ctaProgress = spring({
    frame: frame - ctaDelay,
    fps,
    config: { damping: 180, stiffness: 75 },
  });
  const ctaOpacity = interpolate(frame, [ctaDelay, ctaDelay + fps * 0.22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ctaY = interpolate(ctaProgress, [0, 1], [20, 0]);
  const ctaGlow = interpolate(frame, [ctaDelay + fps * 0.18, fps * 1.3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Bottom text
  const bottomOpacity = interpolate(frame, [fps * 1.05, fps * 1.45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bottomY = interpolate(frame, [fps * 1.05, fps * 1.5], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00ff88" intensity={0.035} focusY={50} />

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
            filter: `drop-shadow(0 0 ${logoGlow}px rgba(0, 255, 136, 0.5))`,
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
              color: "#555555",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 400,
              letterSpacing: 0.5,
            }}
          >
            {tagline}
          </span>
        </div>

        {/* CTA Button */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px)`,
          }}
        >
          <div
            style={{
              padding: "16px 52px",
              background: "#00ff88",
              borderRadius: 50,
              boxShadow: `
                0 5px 25px rgba(0, 255, 136, ${0.22 + 0.12 * ctaGlow}),
                0 0 ${32 * ctaGlow}px rgba(0, 255, 136, ${0.12 * ctaGlow})
              `,
            }}
          >
            <span
              style={{
                fontSize: 34,
                fontWeight: 900,
                color: "#050505",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -0.5,
              }}
            >
              {cta}
            </span>
          </div>
        </div>

        {/* Bottom proposition */}
        <div
          style={{
            opacity: bottomOpacity,
            transform: `translateY(${bottomY}px)`,
            marginTop: 10,
          }}
        >
          <span
            style={{
              fontSize: 12,
              color: "#3a3a3a",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 3.5,
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

// Main composition - refined timing for 10 second video
export const StatsUpdate: React.FC<StatsUpdateProps> = ({
  headline,
  stats,
  tagline,
  cta,
}) => {
  const { fps } = useVideoConfig();

  // Clean transitions (0.3s)
  const transitionFrames = Math.round(0.3 * fps);

  return (
    <TransitionSeries>
      {/* Intro: 2.2s - Cinematic hook */}
      <TransitionSeries.Sequence durationInFrames={Math.round(2.2 * fps)}>
        <IntroScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* Headline: 1.7s - Bold typography */}
      <TransitionSeries.Sequence durationInFrames={Math.round(1.7 * fps)}>
        <HeadlineScene headline={headline} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* Stats: 3.8s - The core content */}
      <TransitionSeries.Sequence durationInFrames={Math.round(3.8 * fps)}>
        <StatsScene stats={stats} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* CTA: 2.3s - Confident close */}
      <TransitionSeries.Sequence durationInFrames={Math.round(2.3 * fps)}>
        <CTAScene tagline={tagline} cta={cta} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
