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

// Premium cinematic background - deep blacks with subtle depth
const CinematicBackground: React.FC<{
  accentColor?: string;
  variant?: "center" | "top" | "split";
}> = ({ accentColor = "#00ff88", variant = "center" }) => {
  const frame = useCurrentFrame();

  // Very subtle drift - barely perceptible, creates life without distraction
  const drift = interpolate(frame, [0, 600], [0, 4], {
    extrapolateRight: "clamp",
  });

  const gradientPosition = variant === "top" ? 25 : variant === "split" ? 50 : 50;

  return (
    <AbsoluteFill>
      {/* Pure black base */}
      <AbsoluteFill style={{ background: "#080808" }} />

      {/* Primary ambient glow - extremely subtle */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 120% 60% at 50% ${gradientPosition + drift}%, ${accentColor}05 0%, transparent 50%)`,
        }}
      />

      {/* Secondary depth layer - creates subtle dimensionality */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 80% 40% at 50% ${gradientPosition + drift * 0.5}%, rgba(255,255,255,0.008) 0%, transparent 40%)`,
        }}
      />

      {/* Edge vignette - tightens focus to center */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 20%, rgba(0,0,0,0.6) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// Scene 1: The Hook - Dramatic aperture-style reveal
const IntroScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Aperture ring animation - starts small, expands outward
  const apertureScale = interpolate(frame, [0, fps * 0.6], [0.3, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const apertureOpacity = interpolate(
    frame,
    [0, fps * 0.15, fps * 1.4, fps * 1.8],
    [0, 0.25, 0.25, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Inner ring - delayed, creates depth
  const innerRingScale = interpolate(frame, [fps * 0.1, fps * 0.7], [0.2, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const innerRingOpacity = interpolate(
    frame,
    [fps * 0.1, fps * 0.25, fps * 1.3, fps * 1.7],
    [0, 0.15, 0.15, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Logo emerges from the center - the reveal moment
  const logoScale = spring({
    frame: frame - fps * 0.25,
    fps,
    config: { damping: 200, stiffness: 80 },
  });
  const logoOpacity = interpolate(frame, [fps * 0.25, fps * 0.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Logo glow intensifies - the payoff
  const logoGlow = interpolate(frame, [fps * 0.4, fps * 1.2], [0, 50], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Title reveal - bold, confident entrance
  const titleText = "$FED";
  const titleChars = titleText.split("");

  // Horizontal accent lines - frame the logo
  const lineWidth = interpolate(frame, [fps * 0.5, fps * 0.9], [0, 60], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const lineOpacity = interpolate(
    frame,
    [fps * 0.5, fps * 0.7, fps * 1.5, fps * 1.8],
    [0, 0.4, 0.4, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00ff88" variant="center" />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Outer aperture ring */}
        <div
          style={{
            position: "absolute",
            width: 320,
            height: 320,
            borderRadius: "50%",
            border: "1px solid rgba(0, 255, 136, 0.5)",
            opacity: apertureOpacity,
            transform: `scale(${apertureScale})`,
          }}
        />

        {/* Inner ring - creates depth */}
        <div
          style={{
            position: "absolute",
            width: 240,
            height: 240,
            borderRadius: "50%",
            border: "1px solid rgba(0, 255, 136, 0.3)",
            opacity: innerRingOpacity,
            transform: `scale(${innerRingScale})`,
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
            gap: 280,
          }}
        >
          <div
            style={{
              width: lineWidth,
              height: 1,
              background: "linear-gradient(270deg, #00ff88, transparent)",
              opacity: lineOpacity,
            }}
          />
          <div
            style={{
              width: lineWidth,
              height: 1,
              background: "linear-gradient(90deg, #00ff88, transparent)",
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
            gap: 20,
          }}
        >
          {/* Logo */}
          <div
            style={{
              transform: `scale(${logoScale})`,
              opacity: logoOpacity,
              filter: `drop-shadow(0 0 ${logoGlow}px rgba(0, 255, 136, 0.5))`,
            }}
          >
            <FedLogo size={140} glow={false} />
          </div>

          {/* Title - character stagger with scale */}
          <div
            style={{
              display: "flex",
              gap: 4,
              height: 65,
              overflow: "hidden",
            }}
          >
            {titleChars.map((char, i) => {
              const charDelay = 0.55 + i * 0.07;
              const charProgress = spring({
                frame: frame - charDelay * fps,
                fps,
                config: { damping: 180, stiffness: 120 },
              });
              const charOpacity = interpolate(
                frame,
                [charDelay * fps, (charDelay + 0.12) * fps],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              const charY = interpolate(charProgress, [0, 1], [25, 0]);

              return (
                <span
                  key={i}
                  style={{
                    fontSize: 56,
                    fontWeight: 900,
                    color: char === "$" ? "#00ff88" : "#ffffff",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    letterSpacing: -2,
                    opacity: charOpacity,
                    transform: `translateY(${charY}px) scale(${charProgress})`,
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

// Scene 2: The Headline - Bold typography that commands attention
const HeadlineScene: React.FC<{ headline: string }> = ({ headline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Split into words for staggered reveal
  const words = headline.split(" ");

  // Overall scene fade in
  const sceneFade = interpolate(frame, [0, fps * 0.15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Dual accent lines that draw outward from center
  const lineWidth = interpolate(frame, [fps * 0.05, fps * 0.35], [0, 50], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const lineOpacity = interpolate(
    frame,
    [fps * 0.05, fps * 0.2, fps * 1.2, fps * 1.5],
    [0, 0.5, 0.5, 0.3],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Badge appears subtly above headline
  const badgeOpacity = interpolate(frame, [fps * 0.1, fps * 0.35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const badgeY = interpolate(frame, [fps * 0.1, fps * 0.4], [8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00ff88" variant="center" />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 80,
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Badge */}
        <div
          style={{
            opacity: badgeOpacity,
            transform: `translateY(${badgeY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 4,
          }}
        >
          <div
            style={{
              width: lineWidth,
              height: 1,
              background: "linear-gradient(270deg, #00ff88, transparent)",
              opacity: lineOpacity,
            }}
          />
          <span
            style={{
              fontSize: 11,
              color: "#555555",
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
              background: "linear-gradient(90deg, #00ff88, transparent)",
              opacity: lineOpacity,
            }}
          />
        </div>

        {/* Headline words */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0 18px",
            maxWidth: 1000,
          }}
        >
          {words.map((word, index) => {
            const delay = 0.15 + index * 0.1;
            const wordProgress = spring({
              frame: frame - delay * fps,
              fps,
              config: { damping: 200, stiffness: 110 },
            });
            const wordOpacity = interpolate(
              frame,
              [delay * fps, (delay + 0.15) * fps],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const wordY = interpolate(wordProgress, [0, 1], [25, 0]);

            // Color variation: make "BRRR" green for emphasis
            const isEmphasis = word === "BRRR";

            return (
              <span
                key={index}
                style={{
                  fontSize: 72,
                  fontWeight: 900,
                  color: isEmphasis ? "#00ff88" : "#ffffff",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  opacity: wordOpacity,
                  transform: `translateY(${wordY}px)`,
                  display: "inline-block",
                  letterSpacing: -2,
                  lineHeight: 1.15,
                  textShadow: isEmphasis ? "0 0 30px rgba(0, 255, 136, 0.4)" : "none",
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

// Premium stat card with counting animation and visual polish
const StatCard: React.FC<{
  stat: StatsUpdateProps["stats"][0];
  delay: number;
  isLast?: boolean;
  index: number;
}> = ({ stat, delay, isLast = false, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card reveals with spring - high damping for premium feel
  const cardProgress = spring({
    frame: frame - delay * fps,
    fps,
    config: { damping: 200, stiffness: 90 },
  });

  // Number counting - longer duration, smoother ease for satisfying settle
  const countDuration = 0.9;
  const numberProgress = interpolate(
    frame,
    [(delay + 0.1) * fps, (delay + 0.1 + countDuration) * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    }
  );

  // Parse and display value
  const numericValue = stat.numericValue ?? (parseFloat(stat.value.replace(/[^0-9.]/g, "")) || 0);
  const displayValue = Math.floor(numericValue * numberProgress);
  const prefix = stat.prefix ?? (stat.value.startsWith("$") ? "$" : "");
  const suffix = stat.suffix ?? (stat.value.includes("+") ? "+" : "");

  // Card transform
  const cardOpacity = interpolate(cardProgress, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });
  const cardY = interpolate(cardProgress, [0, 1], [35, 0]);
  const cardScale = interpolate(cardProgress, [0, 1], [0.95, 1]);

  // Accent color based on stat index for visual variety
  const accentColors = ["#00ff88", "#00d4ff", "#ff6b9d"];
  const accentColor = accentColors[index % accentColors.length];

  // Accent bar reveal - draws from bottom
  const accentHeight = interpolate(
    frame,
    [(delay + 0.05) * fps, (delay + 0.4) * fps],
    [0, 100],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Subtle glow that builds after card appears
  const glowIntensity = interpolate(
    frame,
    [(delay + 0.3) * fps, (delay + 0.7) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Number scale pulse on complete - subtle emphasis
  const countComplete = numberProgress >= 0.98;
  const numberScale = countComplete
    ? interpolate(
        frame,
        [(delay + 0.1 + countDuration) * fps, (delay + 0.1 + countDuration + 0.15) * fps],
        [1, 1.02],
        { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
      )
    : 1;

  return (
    <div
      style={{
        transform: `translateY(${cardY}px) scale(${cardScale})`,
        opacity: cardOpacity,
      }}
    >
      <div
        style={{
          padding: "28px 36px",
          background: `linear-gradient(135deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.01) 100%)`,
          borderRadius: 16,
          minWidth: 260,
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.04)",
          boxShadow: `
            0 0 0 1px rgba(255, 255, 255, 0.02),
            0 20px 40px rgba(0, 0, 0, 0.3),
            0 0 ${40 * glowIntensity}px rgba(0, 255, 136, ${0.08 * glowIntensity})
          `,
        }}
      >
        {/* Left accent bar - gradient with glow */}
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: 3,
            height: `${accentHeight}%`,
            background: `linear-gradient(0deg, ${accentColor}00 0%, ${accentColor} 30%, ${accentColor} 100%)`,
            borderRadius: "0 2px 2px 0",
            boxShadow: `0 0 ${12 * glowIntensity}px ${accentColor}60`,
          }}
        />

        {/* Number display */}
        <div
          style={{
            fontSize: 48,
            fontWeight: 900,
            color: "#ffffff",
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: -2.5,
            lineHeight: 1,
            marginBottom: 10,
            transform: `scale(${numberScale})`,
            transformOrigin: "left center",
          }}
        >
          <span style={{ color: accentColor }}>{prefix}</span>
          {displayValue.toLocaleString()}
          <span
            style={{
              color: "#3a3a3a",
              fontSize: 28,
              fontWeight: 700,
              marginLeft: 2,
            }}
          >
            {suffix}
          </span>
        </div>

        {/* Label with accent dot */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: accentColor,
              opacity: glowIntensity * 0.6,
            }}
          />
          <div
            style={{
              fontSize: 11,
              color: "#505050",
              fontFamily: "system-ui, -apple-system, sans-serif",
              textTransform: "uppercase",
              letterSpacing: 2,
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

// Scene 3: Stats Display - Each stat gets its moment
const StatsScene: React.FC<{ stats: StatsUpdateProps["stats"] }> = ({ stats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene fade in
  const sceneFade = interpolate(frame, [0, fps * 0.15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Header elements with elegant stagger
  const lineWidth = interpolate(frame, [fps * 0.05, fps * 0.3], [0, 40], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const lineOpacity = interpolate(frame, [fps * 0.05, fps * 0.2], [0, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const headerOpacity = interpolate(frame, [fps * 0.1, fps * 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });
  const headerY = interpolate(frame, [fps * 0.1, fps * 0.35], [8, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Live indicator dot - appears with subtle glow
  const indicatorOpacity = interpolate(
    frame,
    [fps * 0.15, fps * 0.35],
    [0, 1],
    { extrapolateRight: "clamp" }
  );
  const indicatorGlow = interpolate(
    frame,
    [fps * 0.3, fps * 0.6],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00ff88" variant="top" />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 50,
          flexDirection: "column",
          gap: 40,
        }}
      >
        {/* Section header with live indicator and accent lines */}
        <div
          style={{
            opacity: headerOpacity,
            transform: `translateY(${headerY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          {/* Left accent line */}
          <div
            style={{
              width: lineWidth,
              height: 1,
              background: "linear-gradient(270deg, #333333, transparent)",
              opacity: lineOpacity,
            }}
          />

          {/* Live indicator dot */}
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#00ff88",
              opacity: indicatorOpacity,
              boxShadow: `0 0 ${8 * indicatorGlow}px rgba(0, 255, 136, 0.7)`,
            }}
          />

          <span
            style={{
              fontSize: 11,
              color: "#505050",
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
              background: "linear-gradient(90deg, #333333, transparent)",
              opacity: lineOpacity,
            }}
          />
        </div>

        {/* Stats grid - staggered reveal with breathing room */}
        <div
          style={{
            display: "flex",
            gap: 24,
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 1000,
          }}
        >
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              stat={stat}
              delay={0.25 + index * 0.2}
              isLast={index === stats.length - 1}
              index={index}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 4: CTA - Premium finish with confident brand presence
const CTAScene: React.FC<{ tagline: string; cta: string }> = ({ tagline, cta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene fade in
  const sceneFade = interpolate(frame, [0, fps * 0.2], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Logo entrance - starts slightly scaled down, settles into position
  const logoProgress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 90 },
  });
  const logoOpacity = interpolate(frame, [0, fps * 0.25], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Logo glow builds smoothly - static after settling for premium feel
  const logoGlow = interpolate(frame, [fps * 0.2, fps * 0.8], [0, 40], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Tagline appears with subtle slide
  const taglineOpacity = interpolate(frame, [fps * 0.35, fps * 0.6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const taglineY = interpolate(frame, [fps * 0.35, fps * 0.65], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // CTA button - the hero element
  const ctaProgress = spring({
    frame: frame - fps * 0.6,
    fps,
    config: { damping: 180, stiffness: 100 },
  });
  const ctaOpacity = interpolate(frame, [fps * 0.6, fps * 0.85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ctaY = interpolate(ctaProgress, [0, 1], [20, 0]);

  // CTA glow builds for emphasis
  const ctaGlow = interpolate(frame, [fps * 0.8, fps * 1.3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Bottom tagline - subtle appearance
  const bottomOpacity = interpolate(frame, [fps * 1.2, fps * 1.6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bottomY = interpolate(frame, [fps * 1.2, fps * 1.7], [8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00ff88" variant="center" />

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
          <FedLogo size={90} glow={false} />
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
              color: "#666666",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 400,
              letterSpacing: 0.5,
            }}
          >
            {tagline}
          </span>
        </div>

        {/* CTA Button - premium pill style */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px)`,
          }}
        >
          <div
            style={{
              padding: "16px 48px",
              background: "#00ff88",
              borderRadius: 50,
              boxShadow: `
                0 4px 20px rgba(0, 255, 136, ${0.25 * ctaGlow}),
                0 0 ${30 * ctaGlow}px rgba(0, 255, 136, ${0.2 * ctaGlow})
              `,
            }}
          >
            <span
              style={{
                fontSize: 32,
                fontWeight: 900,
                color: "#0a0a0a",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -0.5,
              }}
            >
              {cta}
            </span>
          </div>
        </div>

        {/* Bottom value prop */}
        <div
          style={{
            opacity: bottomOpacity,
            transform: `translateY(${bottomY}px)`,
            marginTop: 8,
          }}
        >
          <span
            style={{
              fontSize: 12,
              color: "#444444",
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

  // Tight, punchy transitions (0.3s)
  const transitionFrames = Math.round(0.3 * fps);

  return (
    <TransitionSeries>
      {/* Intro: 1.9s - The hook - aperture reveal */}
      <TransitionSeries.Sequence durationInFrames={Math.round(1.9 * fps)}>
        <IntroScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* Headline: 1.6s - Typography moment - punchy, not lingering */}
      <TransitionSeries.Sequence durationInFrames={Math.round(1.6 * fps)}>
        <HeadlineScene headline={headline} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* Stats: 3.8s - The meat - let numbers breathe and land */}
      <TransitionSeries.Sequence durationInFrames={Math.round(3.8 * fps)}>
        <StatsScene stats={stats} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* CTA: 2.7s - Strong, confident finish */}
      <TransitionSeries.Sequence durationInFrames={Math.round(2.7 * fps)}>
        <CTAScene tagline={tagline} cta={cta} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
