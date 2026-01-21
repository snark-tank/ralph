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

// Scene 1: The Hook - Logo reveal with dramatic simplicity
const IntroScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Optical line draws from center - creates anticipation
  const lineProgress = interpolate(frame, [fps * 0.15, fps * 0.55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const lineOpacity = interpolate(
    frame,
    [fps * 0.15, fps * 0.35, fps * 0.9, fps * 1.3],
    [0, 0.5, 0.5, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Logo scales in with ultra-smooth damping - slightly delayed for anticipation
  const logoScale = spring({
    frame: frame - fps * 0.35,
    fps,
    config: { damping: 180, stiffness: 70 },
  });
  const logoOpacity = interpolate(frame, [fps * 0.35, fps * 0.55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Outer ring - subtle geometric accent
  const ringScale = spring({
    frame: frame - fps * 0.45,
    fps,
    config: { damping: 160, stiffness: 50 },
  });
  const ringOpacity = interpolate(
    frame,
    [fps * 0.45, fps * 0.75, fps * 1.6],
    [0, 0.15, 0.08],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Logo glow builds gradually - static, not pulsing
  const logoGlow = interpolate(frame, [fps * 0.55, fps * 1.3], [0, 40], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Title reveal - staggered characters with vertical slide
  const titleText = "$FED";
  const titleChars = titleText.split("");

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00ff88" variant="center" />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Optical reveal line */}
        <div
          style={{
            position: "absolute",
            width: 200 * lineProgress,
            height: 1,
            background: "linear-gradient(90deg, transparent, #00ff88, transparent)",
            opacity: lineOpacity,
            top: "50%",
            transform: "translateY(-80px)",
          }}
        />

        {/* Outer geometric ring */}
        <div
          style={{
            position: "absolute",
            width: 260,
            height: 260,
            borderRadius: "50%",
            border: "1px solid #00ff88",
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
            gap: 24,
          }}
        >
          {/* Logo */}
          <div
            style={{
              transform: `scale(${logoScale})`,
              opacity: logoOpacity,
              filter: `drop-shadow(0 0 ${logoGlow}px rgba(0, 255, 136, 0.4))`,
            }}
          >
            <FedLogo size={130} glow={false} />
          </div>

          {/* Title - character stagger */}
          <div
            style={{
              display: "flex",
              gap: 2,
              height: 70,
              overflow: "hidden",
            }}
          >
            {titleChars.map((char, i) => {
              const charDelay = 0.65 + i * 0.08;
              const charOpacity = interpolate(
                frame,
                [charDelay * fps, (charDelay + 0.15) * fps],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              const charY = interpolate(
                frame,
                [charDelay * fps, (charDelay + 0.25) * fps],
                [20, 0],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.out(Easing.cubic),
                }
              );

              return (
                <span
                  key={i}
                  style={{
                    fontSize: 60,
                    fontWeight: 900,
                    color: char === "$" ? "#00ff88" : "#ffffff",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    letterSpacing: -3,
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

// Scene 2: The Headline - Bold typography that commands attention
const HeadlineScene: React.FC<{ headline: string }> = ({ headline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Split into words for staggered reveal
  const words = headline.split(" ");

  // Accent line reveals first
  const lineWidth = interpolate(frame, [fps * 0.1, fps * 0.4], [0, 80], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const lineOpacity = interpolate(frame, [fps * 0.1, fps * 0.3], [0, 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00d4ff" variant="center" />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 80,
          flexDirection: "column",
          gap: 24,
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            width: lineWidth,
            height: 2,
            background: "#00ff88",
            opacity: lineOpacity,
            borderRadius: 1,
            marginBottom: 8,
          }}
        />

        {/* Headline words */}
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
            const delay = 0.2 + index * 0.12;
            const wordOpacity = interpolate(
              frame,
              [delay * fps, (delay + 0.18) * fps],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const wordY = interpolate(
              frame,
              [delay * fps, (delay + 0.28) * fps],
              [30, 0],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
              }
            );
            const wordScale = spring({
              frame: frame - delay * fps,
              fps,
              config: { damping: 180, stiffness: 100 },
            });

            return (
              <span
                key={index}
                style={{
                  fontSize: 76,
                  fontWeight: 900,
                  color: "#ffffff",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  opacity: wordOpacity,
                  transform: `translateY(${wordY}px) scale(${wordScale})`,
                  display: "inline-block",
                  letterSpacing: -2,
                  lineHeight: 1.1,
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
}> = ({ stat, delay, isLast = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card reveals with spring
  const cardProgress = spring({
    frame: frame - delay * fps,
    fps,
    config: { damping: 180, stiffness: 100 },
  });

  // Number counting - eases out for satisfying settle
  const countDuration = 0.7;
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

  // Accent line height animation
  const accentHeight = interpolate(cardProgress, [0, 1], [0, 100]);

  // Card opacity and transform
  const cardOpacity = interpolate(cardProgress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });
  const cardY = interpolate(cardProgress, [0, 1], [40, 0]);

  // Subtle glow that builds after card appears
  const glowOpacity = interpolate(
    frame,
    [(delay + 0.4) * fps, (delay + 0.8) * fps],
    [0, 0.25],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        transform: `translateY(${cardY}px)`,
        opacity: cardOpacity,
      }}
    >
      <div
        style={{
          padding: "32px 40px",
          background: "rgba(255, 255, 255, 0.02)",
          borderRadius: 16,
          minWidth: 280,
          position: "relative",
          overflow: "hidden",
          boxShadow: `0 0 60px rgba(0, 255, 136, ${glowOpacity * 0.15})`,
        }}
      >
        {/* Left accent bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            width: 3,
            height: `${accentHeight}%`,
            background: "linear-gradient(180deg, #00ff88 0%, #00d4aa 100%)",
            borderRadius: 2,
            boxShadow: `0 0 12px rgba(0, 255, 136, ${glowOpacity})`,
          }}
        />

        {/* Number display */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 900,
            color: "#ffffff",
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: -3,
            lineHeight: 1,
            marginBottom: 12,
          }}
        >
          <span style={{ color: "#00ff88" }}>{prefix}</span>
          {displayValue.toLocaleString()}
          <span
            style={{
              color: "#444444",
              fontSize: 32,
              fontWeight: 700,
              marginLeft: 2,
            }}
          >
            {suffix}
          </span>
        </div>

        {/* Label */}
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
  );
};

// Scene 3: Stats Display - Each stat gets its moment
const StatsScene: React.FC<{ stats: StatsUpdateProps["stats"] }> = ({ stats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Section header fades in first
  const headerOpacity = interpolate(frame, [0, fps * 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });
  const headerY = interpolate(frame, [0, fps * 0.35], [10, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Status indicator pulse (subtle, not distracting)
  const indicatorOpacity = interpolate(
    frame,
    [fps * 0.2, fps * 0.4],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00ff88" variant="top" />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 50,
          flexDirection: "column",
          gap: 44,
        }}
      >
        {/* Section header with live indicator */}
        <div
          style={{
            opacity: headerOpacity,
            transform: `translateY(${headerY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          {/* Live indicator dot */}
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              background: "#00ff88",
              opacity: indicatorOpacity,
              boxShadow: "0 0 8px rgba(0, 255, 136, 0.6)",
            }}
          />
          <span
            style={{
              fontSize: 12,
              color: "#555555",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 4,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Protocol Metrics
          </span>
        </div>

        {/* Stats grid - staggered reveal with breathing room */}
        <div
          style={{
            display: "flex",
            gap: 28,
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 1100,
          }}
        >
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              stat={stat}
              delay={0.3 + index * 0.25}
              isLast={index === stats.length - 1}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 4: CTA - Confident close with clear action
const CTAScene: React.FC<{ tagline: string; cta: string }> = ({ tagline, cta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo entrance with elegant timing
  const logoProgress = spring({
    frame,
    fps,
    config: { damping: 160, stiffness: 80 },
  });
  const logoOpacity = interpolate(frame, [0, fps * 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Logo glow builds smoothly then holds with subtle breath
  const baseGlow = interpolate(frame, [fps * 0.25, fps * 0.85], [0, 35], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  // Very subtle glow modulation after settle - barely perceptible life
  const glowBreath = frame > fps * 1.0
    ? interpolate(frame % (fps * 2.5), [0, fps * 1.25, fps * 2.5], [0, 3, 0])
    : 0;
  const logoGlow = baseGlow + glowBreath;

  // Tagline appears
  const taglineOpacity = interpolate(frame, [fps * 0.4, fps * 0.7], [0, 1], {
    extrapolateRight: "clamp",
  });
  const taglineY = interpolate(frame, [fps * 0.4, fps * 0.75], [12, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // CTA text
  const ctaOpacity = interpolate(frame, [fps * 0.75, fps * 1.05], [0, 1], {
    extrapolateRight: "clamp",
  });
  const ctaScale = spring({
    frame: frame - fps * 0.75,
    fps,
    config: { damping: 140, stiffness: 90 },
  });

  // Underline draws elegantly
  const underlineWidth = interpolate(frame, [fps * 1.15, fps * 1.6], [0, 100], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Bottom tagline - subtle appearance
  const bottomOpacity = interpolate(frame, [fps * 1.5, fps * 1.9], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00ff88" variant="center" />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 28,
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
              fontSize: 24,
              color: "#777777",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 400,
              letterSpacing: 0.5,
            }}
          >
            {tagline}
          </span>
        </div>

        {/* CTA with underline */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `scale(${ctaScale})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: "#00ff88",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: -1,
            }}
          >
            {cta}
          </span>
          <div
            style={{
              height: 2,
              width: `${underlineWidth}%`,
              background: "linear-gradient(90deg, transparent, #00ff88, transparent)",
              borderRadius: 1,
              opacity: 0.5,
            }}
          />
        </div>

        {/* Bottom value prop */}
        <div
          style={{
            opacity: bottomOpacity,
            marginTop: 8,
          }}
        >
          <span
            style={{
              fontSize: 13,
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

  return (
    <TransitionSeries>
      {/* Intro: 2s - The hook */}
      <TransitionSeries.Sequence durationInFrames={Math.round(2 * fps)}>
        <IntroScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: Math.round(0.35 * fps) })}
      />

      {/* Headline: 1.8s - Typography moment */}
      <TransitionSeries.Sequence durationInFrames={Math.round(1.8 * fps)}>
        <HeadlineScene headline={headline} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: Math.round(0.35 * fps) })}
      />

      {/* Stats: 3.5s - Let numbers breathe and land */}
      <TransitionSeries.Sequence durationInFrames={Math.round(3.5 * fps)}>
        <StatsScene stats={stats} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: Math.round(0.35 * fps) })}
      />

      {/* CTA: 2.7s - Strong, confident finish */}
      <TransitionSeries.Sequence durationInFrames={Math.round(2.7 * fps)}>
        <CTAScene tagline={tagline} cta={cta} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
