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

// Subtle, refined background with minimal movement
const CinematicBackground: React.FC<{
  accentColor?: string;
  showHorizonLine?: boolean;
}> = ({
  accentColor = "#00ff88",
  showHorizonLine = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Very subtle gradient shift - barely perceptible
  const gradientOffset = interpolate(frame, [0, 300], [0, 8], {
    extrapolateRight: "clamp",
  });

  // Horizon line animation for certain scenes
  const horizonOpacity = showHorizonLine
    ? interpolate(frame, [0, fps * 0.5], [0, 0.08], { extrapolateRight: "clamp" })
    : 0;

  return (
    <AbsoluteFill>
      {/* Base dark background */}
      <AbsoluteFill
        style={{
          background: "#0a0a0a",
        }}
      />
      {/* Subtle radial gradient - static, not pulsing */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 100% 50% at 50% 50%, ${accentColor}06 0%, transparent 60%)`,
          transform: `translateY(${gradientOffset}px)`,
        }}
      />
      {/* Very faint vignette */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 70% at 50% 50%, transparent 40%, rgba(0,0,0,0.4) 100%)`,
        }}
      />
      {/* Optional subtle horizon line */}
      {showHorizonLine && (
        <AbsoluteFill
          style={{
            background: `linear-gradient(180deg, transparent 48%, ${accentColor} 50%, transparent 52%)`,
            opacity: horizonOpacity,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

// Scene 1: Intro with logo - Clean, confident, minimal
const IntroScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Smooth scale with high damping - no bounce
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 100 },
  });

  // Logo opacity fades in slightly before scale completes
  const logoOpacity = interpolate(frame, [0, fps * 0.25], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Title appears after logo settles - character by character reveal
  const titleText = "$FED";
  const titleChars = titleText.split("");

  // Subtle static glow that grows - no pulsing
  const glowSize = interpolate(frame, [fps * 0.3, fps * 1], [0, 40], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Outer ring animation
  const ringScale = spring({
    frame: frame - fps * 0.1,
    fps,
    config: { damping: 150, stiffness: 80 },
  });
  const ringOpacity = interpolate(frame, [fps * 0.1, fps * 0.4, fps * 1.5], [0, 0.15, 0.08], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00ff88" />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Subtle outer ring */}
        <div
          style={{
            position: "absolute",
            width: 280,
            height: 280,
            borderRadius: "50%",
            border: "1px solid #00ff88",
            opacity: ringOpacity,
            transform: `scale(${ringScale})`,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
          }}
        >
          <div
            style={{
              transform: `scale(${logoScale})`,
              opacity: logoOpacity,
              filter: `drop-shadow(0 0 ${glowSize}px rgba(0, 255, 136, 0.35))`,
            }}
          >
            <FedLogo size={140} glow={false} />
          </div>
          <div
            style={{
              display: "flex",
              gap: 4,
            }}
          >
            {titleChars.map((char, i) => {
              const charDelay = 0.5 + i * 0.06;
              const charOpacity = interpolate(
                frame,
                [charDelay * fps, (charDelay + 0.2) * fps],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              const charY = interpolate(
                frame,
                [charDelay * fps, (charDelay + 0.25) * fps],
                [12, 0],
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
                    fontSize: 64,
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

// Scene 2: Headline - Typography focused, elegant
const HeadlineScene: React.FC<{ headline: string }> = ({ headline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Words reveal one by one with stagger
  const words = headline.split(" ");

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00d4ff" />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 80,
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0 24px",
            maxWidth: 1000,
          }}
        >
          {words.map((word, index) => {
            const delay = index * 0.08;
            const wordOpacity = interpolate(
              frame,
              [delay * fps, (delay + 0.3) * fps],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const wordY = interpolate(
              frame,
              [delay * fps, (delay + 0.4) * fps],
              [30, 0],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
              }
            );

            return (
              <span
                key={index}
                style={{
                  fontSize: 80,
                  fontWeight: 900,
                  color: "#ffffff",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  opacity: wordOpacity,
                  transform: `translateY(${wordY}px)`,
                  display: "inline-block",
                  letterSpacing: -1,
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

// Minimal, sophisticated stat card
const StatCard: React.FC<{
  stat: StatsUpdateProps["stats"][0];
  delay: number;
  index: number;
}> = ({ stat, delay, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Smooth reveal with high damping
  const progress = spring({
    frame: frame - delay * fps,
    fps,
    config: { damping: 200, stiffness: 100 },
  });

  // Number counting animation - eases out smoothly
  const numberProgress = interpolate(
    frame,
    [(delay + 0.1) * fps, (delay + 0.9) * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic)
    }
  );

  // Parse numeric value
  const numericValue = stat.numericValue ?? (parseFloat(stat.value.replace(/[^0-9.]/g, "")) || 0);
  const displayValue = Math.floor(numericValue * numberProgress);
  const prefix = stat.prefix ?? (stat.value.startsWith("$") ? "$" : "");
  const suffix = stat.suffix ?? (stat.value.includes("+") ? "+" : "");

  // Left border animates in
  const borderHeight = interpolate(progress, [0, 1], [0, 100]);

  return (
    <div
      style={{
        transform: `translateY(${interpolate(progress, [0, 1], [30, 0])}px)`,
        opacity: progress,
      }}
    >
      <div
        style={{
          padding: "28px 36px",
          background: "rgba(255, 255, 255, 0.015)",
          borderRadius: 12,
          minWidth: 260,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated left border */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            width: 3,
            height: `${borderHeight}%`,
            background: "#00ff88",
            borderRadius: 2,
          }}
        />

        <div
          style={{
            fontSize: 48,
            fontWeight: 900,
            color: "#ffffff",
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: -2,
            lineHeight: 1,
          }}
        >
          <span style={{ color: "#00ff88" }}>{prefix}</span>
          {displayValue.toLocaleString()}
          <span style={{ color: "#555555", fontSize: 32, fontWeight: 700 }}>{suffix}</span>
        </div>
        <div
          style={{
            fontSize: 12,
            color: "#555555",
            fontFamily: "system-ui, -apple-system, sans-serif",
            marginTop: 10,
            textTransform: "uppercase",
            letterSpacing: 2,
            fontWeight: 500,
          }}
        >
          {stat.label}
        </div>
      </div>
    </div>
  );
};

// Scene 3: Stats display - Clean grid, elegant reveals
const StatsScene: React.FC<{ stats: StatsUpdateProps["stats"] }> = ({ stats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Subtle header that fades in first
  const headerOpacity = interpolate(frame, [0, fps * 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00ff88" showHorizonLine />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 50,
          flexDirection: "column",
          gap: 40,
        }}
      >
        {/* Minimal header */}
        <div
          style={{
            opacity: headerOpacity,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              background: "#00ff88",
            }}
          />
          <span
            style={{
              fontSize: 14,
              color: "#666666",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 4,
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            Live Protocol Stats
          </span>
        </div>

        {/* Stats grid */}
        <div
          style={{
            display: "flex",
            gap: 20,
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 1200,
          }}
        >
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              stat={stat}
              delay={0.2 + index * 0.1}
              index={index}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 4: CTA - Confident, minimal, no gimmicks
const CTAScene: React.FC<{ tagline: string; cta: string }> = ({ tagline, cta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo entrance - smooth and confident
  const logoProgress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 100 },
  });

  // Glow that builds subtly
  const logoGlow = interpolate(frame, [fps * 0.2, fps * 0.8], [0, 25], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Tagline fades in
  const taglineOpacity = interpolate(frame, [fps * 0.35, fps * 0.7], [0, 1], {
    extrapolateRight: "clamp",
  });
  const taglineY = interpolate(frame, [fps * 0.35, fps * 0.8], [12, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // CTA appears
  const ctaOpacity = interpolate(frame, [fps * 0.7, fps * 1.1], [0, 1], {
    extrapolateRight: "clamp",
  });
  const ctaY = interpolate(frame, [fps * 0.7, fps * 1.2], [15, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Underline draws in
  const underlineWidth = interpolate(frame, [fps * 1.2, fps * 1.7], [0, 100], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Subtext appears last
  const subOpacity = interpolate(frame, [fps * 1.4, fps * 1.8], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00ff88" />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 32,
          flexDirection: "column",
        }}
      >
        <div
          style={{
            transform: `scale(${logoProgress})`,
            opacity: logoProgress,
            filter: `drop-shadow(0 0 ${logoGlow}px rgba(0, 255, 136, 0.4))`,
          }}
        >
          <FedLogo size={90} glow={false} />
        </div>

        <div
          style={{
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: 26,
              color: "#888888",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 400,
            }}
          >
            {tagline}
          </span>
        </div>

        <div
          style={{
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span
            style={{
              fontSize: 44,
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
              background: "#00ff88",
              borderRadius: 1,
              opacity: 0.6,
            }}
          />
        </div>

        <div
          style={{
            opacity: subOpacity,
            marginTop: 4,
          }}
        >
          <span
            style={{
              fontSize: 14,
              color: "#555555",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            Real yield. Every 2 minutes.
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Main video composition - tightened timing for ~10 second video
export const StatsUpdate: React.FC<StatsUpdateProps> = ({
  headline,
  stats,
  tagline,
  cta,
}) => {
  const { fps } = useVideoConfig();

  return (
    <TransitionSeries>
      {/* Intro: 2s - Clean, confident hook */}
      <TransitionSeries.Sequence durationInFrames={Math.round(2 * fps)}>
        <IntroScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: Math.round(0.4 * fps) })}
      />

      {/* Headline: 2s - Typography moment */}
      <TransitionSeries.Sequence durationInFrames={Math.round(2 * fps)}>
        <HeadlineScene headline={headline} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: Math.round(0.4 * fps) })}
      />

      {/* Stats: 4s - Let numbers breathe */}
      <TransitionSeries.Sequence durationInFrames={Math.round(4 * fps)}>
        <StatsScene stats={stats} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: Math.round(0.4 * fps) })}
      />

      {/* CTA: 3s - Strong, clean finish */}
      <TransitionSeries.Sequence durationInFrames={Math.round(3 * fps)}>
        <CTAScene tagline={tagline} cta={cta} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
