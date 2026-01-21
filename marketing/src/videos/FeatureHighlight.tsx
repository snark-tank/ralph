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

export type FeatureHighlightProps = {
  feature: string;
  description: string;
  benefits: string[];
  icon?: string;
};

// Refined cinematic background - consistent with other videos
const CinematicBackground: React.FC<{
  accentColor?: string;
  intensity?: number;
  variant?: "center" | "top" | "bottom";
}> = ({ accentColor = "#00ff88", intensity = 0.04, variant = "center" }) => {
  const frame = useCurrentFrame();

  // Very subtle shift - barely perceptible
  const gradientY = interpolate(frame, [0, 300], [48, 52], {
    extrapolateRight: "clamp",
  });

  const yPosition = variant === "top" ? 30 : variant === "bottom" ? 70 : gradientY;

  return (
    <AbsoluteFill>
      {/* Deep dark base */}
      <AbsoluteFill style={{ background: "#0a0a0a" }} />

      {/* Subtle centered radial */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% ${yPosition}%, ${accentColor}${Math.round(intensity * 255).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
        }}
      />

      {/* Vignette for cinematic feel */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, rgba(0,0,0,0.5) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// Multiplier layer component - the visual metaphor for stacking rewards
const MultiplierLayer: React.FC<{
  label: string;
  multiplier: string;
  index: number;
  color: string;
}> = ({ label, multiplier, index, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Each layer slides in from below with stagger
  const delay = 0.3 + index * 0.15;

  const slideProgress = spring({
    frame: frame - delay * fps,
    fps,
    config: { damping: 180, stiffness: 120 },
  });

  const opacity = interpolate(
    frame,
    [delay * fps, (delay + 0.2) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Subtle glow that builds per layer
  const glowOpacity = interpolate(
    frame,
    [(delay + 0.2) * fps, (delay + 0.5) * fps],
    [0, 0.4],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  const yOffset = interpolate(slideProgress, [0, 1], [40, 0]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: 400,
        padding: "14px 24px",
        background: `linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.04) 100%)`,
        borderRadius: 8,
        borderLeft: `3px solid ${color}`,
        transform: `translateY(${yOffset}px)`,
        opacity,
        boxShadow: `0 0 30px rgba(${color === "#00ff88" ? "0,255,136" : color === "#00d4ff" ? "0,212,255" : color === "#ff6b9d" ? "255,107,157" : "255,200,87"},${glowOpacity * 0.3})`,
      }}
    >
      <span
        style={{
          fontSize: 15,
          color: "#888888",
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontWeight: 500,
          letterSpacing: 1,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 22,
          color: color,
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontWeight: 800,
          letterSpacing: -0.5,
        }}
      >
        {multiplier}
      </span>
    </div>
  );
};

// Scene 1: Feature intro - Dramatic visual of layers stacking
const IntroScene: React.FC<{ feature: string; icon?: string }> = ({ feature }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // The layers that stack
  const layers = [
    { label: "Holder Tier", multiplier: "1.5x", color: "#00ff88" },
    { label: "Diamond Hands", multiplier: "1.25x", color: "#00d4ff" },
    { label: "Engagement", multiplier: "1.2x", color: "#ff6b9d" },
    { label: "Time Lock", multiplier: "2.0x", color: "#ffc857" },
  ];

  // Badge appears first
  const badgeOpacity = interpolate(frame, [fps * 0.1, fps * 0.35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const badgeY = interpolate(frame, [fps * 0.1, fps * 0.4], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Hero multiplier appears after layers stack - the payoff
  const heroDelay = 1.2;
  const heroScale = spring({
    frame: frame - heroDelay * fps,
    fps,
    config: { damping: 120, stiffness: 90 },
  });
  const heroOpacity = interpolate(
    frame,
    [heroDelay * fps, (heroDelay + 0.2) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Glow builds dramatically on the hero number
  const heroGlow = interpolate(
    frame,
    [(heroDelay + 0.15) * fps, (heroDelay + 0.7) * fps],
    [0, 55],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Equals sign animation - scales in from center
  const equalsDelay = heroDelay - 0.2;
  const equalsScale = spring({
    frame: frame - equalsDelay * fps,
    fps,
    config: { damping: 180, stiffness: 150 },
  });
  const equalsOpacity = interpolate(
    frame,
    [equalsDelay * fps, (equalsDelay + 0.15) * fps],
    [0, 0.4],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Subtitle appears last
  const subtitleOpacity = interpolate(frame, [fps * 1.8, fps * 2.1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subtitleY = interpolate(frame, [fps * 1.8, fps * 2.2], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00ff88" intensity={0.05} />

      <AbsoluteFill
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 80,
          padding: "0 80px",
        }}
      >
        {/* Left side: Stacking layers */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {/* Badge above layers */}
          <div
            style={{
              opacity: badgeOpacity,
              transform: `translateY(${badgeY}px)`,
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                background: "#00ff88",
              }}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#555555",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: 4,
                textTransform: "uppercase",
              }}
            >
              Multiplier Stack
            </span>
          </div>

          {/* The layers */}
          {layers.map((layer, index) => (
            <MultiplierLayer
              key={layer.label}
              label={layer.label}
              multiplier={layer.multiplier}
              index={index}
              color={layer.color}
            />
          ))}
        </div>

        {/* Equals sign - scales in purposefully */}
        <div
          style={{
            opacity: equalsOpacity,
            transform: `scale(${equalsScale})`,
            fontSize: 60,
            color: "#333333",
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: 300,
          }}
        >
          =
        </div>

        {/* Right side: Hero multiplier result */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transform: `scale(${heroScale})`,
            opacity: heroOpacity,
          }}
        >
          <div
            style={{
              filter: `drop-shadow(0 0 ${heroGlow}px rgba(0, 255, 136, 0.6))`,
            }}
          >
            <span
              style={{
                fontSize: 160,
                fontWeight: 900,
                color: "#ffffff",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -8,
                lineHeight: 1,
              }}
            >
              4.5
            </span>
            <span
              style={{
                fontSize: 80,
                fontWeight: 900,
                color: "#00ff88",
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              x
            </span>
          </div>
          <div
            style={{
              opacity: subtitleOpacity,
              transform: `translateY(${subtitleY}px)`,
              marginTop: 12,
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
              Maximum Rewards
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 2: Description - Emphasis on key phrases with staggered reveal
const DescriptionScene: React.FC<{ description: string }> = ({ description }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Split description into segments for emphasis
  // "Stack multipliers from holder tiers, diamond hands streaks, engagement scores, and time-lock commitments for up to 4.5x rewards."
  const segments = [
    { text: "Stack multipliers", highlight: true },
    { text: " from ", highlight: false },
    { text: "holder tiers", highlight: true },
    { text: ", ", highlight: false },
    { text: "diamond hands", highlight: true },
    { text: ", ", highlight: false },
    { text: "engagement", highlight: true },
    { text: ", and ", highlight: false },
    { text: "time-locks", highlight: true },
  ];

  // Top line draws in
  const topLineWidth = interpolate(frame, [fps * 0.1, fps * 0.6], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Final CTA line
  const ctaOpacity = interpolate(frame, [fps * 1.8, fps * 2.2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ctaY = interpolate(frame, [fps * 1.8, fps * 2.3], [15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00ff88" intensity={0.03} variant="center" />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "60px 100px",
          flexDirection: "column",
          gap: 40,
        }}
      >
        {/* Top decorative line */}
        <div
          style={{
            width: `${topLineWidth}px`,
            height: 1,
            background: "linear-gradient(90deg, transparent, #333333, transparent)",
          }}
        />

        {/* Main description with highlighted segments */}
        <div
          style={{
            textAlign: "center",
            maxWidth: 900,
            lineHeight: 1.7,
          }}
        >
          {segments.map((segment, index) => {
            const delay = 0.2 + index * 0.08;
            const segmentOpacity = interpolate(
              frame,
              [delay * fps, (delay + 0.25) * fps],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const segmentY = segment.highlight
              ? interpolate(
                  frame,
                  [delay * fps, (delay + 0.3) * fps],
                  [8, 0],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.out(Easing.cubic),
                  }
                )
              : 0;

            return (
              <span
                key={index}
                style={{
                  fontSize: segment.highlight ? 38 : 34,
                  fontWeight: segment.highlight ? 700 : 400,
                  color: segment.highlight ? "#ffffff" : "#666666",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  opacity: segmentOpacity,
                  transform: `translateY(${segmentY}px)`,
                  display: "inline",
                }}
              >
                {segment.text}
              </span>
            );
          })}
        </div>

        {/* Final payoff line */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 40,
              height: 2,
              background: "#00ff88",
              borderRadius: 1,
            }}
          />
          <span
            style={{
              fontSize: 20,
              color: "#00ff88",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 600,
              letterSpacing: 1,
            }}
          >
            Up to 4.5x rewards
          </span>
          <div
            style={{
              width: 40,
              height: 2,
              background: "#00ff88",
              borderRadius: 1,
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Individual benefit card with progress bar visualization
const BenefitCard: React.FC<{
  label: string;
  multiplier: string;
  color: string;
  index: number;
  maxMultiplier: number;
}> = ({ label, multiplier, color, index, maxMultiplier }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const delay = 0.25 + index * 0.2;

  // Card slides in
  const slideProgress = spring({
    frame: frame - delay * fps,
    fps,
    config: { damping: 180, stiffness: 100 },
  });

  const opacity = interpolate(
    frame,
    [delay * fps, (delay + 0.2) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Parse multiplier value for bar width
  const multiplierValue = parseFloat(multiplier.replace("x", ""));
  const barWidthPercent = (multiplierValue / maxMultiplier) * 100;

  // Bar fills after card appears
  const barWidth = interpolate(
    frame,
    [(delay + 0.15) * fps, (delay + 0.6) * fps],
    [0, barWidthPercent],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Multiplier number counts up
  const displayMultiplier = interpolate(
    frame,
    [(delay + 0.15) * fps, (delay + 0.5) * fps],
    [0, multiplierValue],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  const yOffset = interpolate(slideProgress, [0, 1], [30, 0]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        transform: `translateY(${yOffset}px)`,
        opacity,
      }}
    >
      {/* Label */}
      <div
        style={{
          width: 140,
          fontSize: 15,
          color: "#666666",
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontWeight: 500,
          textAlign: "right",
        }}
      >
        {label}
      </div>

      {/* Bar container */}
      <div
        style={{
          flex: 1,
          maxWidth: 400,
          height: 28,
          background: "rgba(255,255,255,0.03)",
          borderRadius: 6,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Fill bar - using unified green with colored accent at end */}
        <div
          style={{
            width: `${barWidth}%`,
            height: "100%",
            background: `linear-gradient(90deg, rgba(0,255,136,0.4) 0%, ${color}90 80%, ${color} 100%)`,
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingRight: 10,
          }}
        >
          {barWidth > 20 && (
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#0a0a0a",
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              {displayMultiplier.toFixed(1)}x
            </span>
          )}
        </div>
      </div>

      {/* Multiplier badge */}
      <div
        style={{
          width: 70,
          textAlign: "left",
        }}
      >
        <span
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: color,
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          {displayMultiplier.toFixed(1)}x
        </span>
      </div>
    </div>
  );
};

// Scene 3: Benefits as visual chart - shows relative power of each multiplier
const BenefitsScene: React.FC<{ benefits: string[] }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Structured benefit data
  const benefitData = [
    { label: "Hold More", multiplier: "1.5x", color: "#00ff88" },
    { label: "Hold Longer", multiplier: "1.25x", color: "#00d4ff" },
    { label: "Engage More", multiplier: "1.2x", color: "#ff6b9d" },
    { label: "Lock Longer", multiplier: "2.0x", color: "#ffc857" },
  ];

  const maxMultiplier = 2.0;

  // Header fades in first
  const headerOpacity = interpolate(frame, [0, fps * 0.25], [0, 1], {
    extrapolateRight: "clamp",
  });
  const headerY = interpolate(frame, [0, fps * 0.35], [12, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Total multiplier appears at the end
  const totalDelay = 1.2;
  const totalOpacity = interpolate(
    frame,
    [totalDelay * fps, (totalDelay + 0.3) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const totalScale = spring({
    frame: frame - totalDelay * fps,
    fps,
    config: { damping: 150, stiffness: 100 },
  });

  // Calculate running total
  const totalMultiplier = interpolate(
    frame,
    [totalDelay * fps, (totalDelay + 0.5) * fps],
    [1, 4.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00ff88" intensity={0.03} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "60px 80px",
          flexDirection: "column",
          gap: 36,
        }}
      >
        {/* Section header */}
        <div
          style={{
            opacity: headerOpacity,
            transform: `translateY(${headerY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div style={{ width: 30, height: 1, background: "#333333" }} />
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
            Four Ways to Boost
          </span>
          <div style={{ width: 30, height: 1, background: "#333333" }} />
        </div>

        {/* Benefits chart */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            width: "100%",
            maxWidth: 700,
          }}
        >
          {benefitData.map((benefit, index) => (
            <BenefitCard
              key={benefit.label}
              label={benefit.label}
              multiplier={benefit.multiplier}
              color={benefit.color}
              index={index}
              maxMultiplier={maxMultiplier}
            />
          ))}
        </div>

        {/* Total multiplier summary */}
        <div
          style={{
            opacity: totalOpacity,
            transform: `scale(${totalScale})`,
            display: "flex",
            alignItems: "baseline",
            gap: 12,
            marginTop: 20,
            padding: "16px 32px",
            background: "rgba(0,255,136,0.05)",
            borderRadius: 12,
            border: "1px solid rgba(0,255,136,0.15)",
          }}
        >
          <span
            style={{
              fontSize: 14,
              color: "#666666",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Combined Max
          </span>
          <span
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: "#00ff88",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: -2,
            }}
          >
            {totalMultiplier.toFixed(1)}x
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 4: CTA - Bold, confident finish with multiplier callback
const CTAScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "4.5x" hero number appears first - callback to intro
  const heroScale = spring({
    frame,
    fps,
    config: { damping: 180, stiffness: 100 },
  });
  const heroOpacity = interpolate(frame, [0, fps * 0.25], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Hero glow
  const heroGlow = interpolate(frame, [fps * 0.1, fps * 0.6], [0, 40], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Tagline below hero
  const taglineOpacity = interpolate(frame, [fps * 0.3, fps * 0.6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const taglineY = interpolate(frame, [fps * 0.3, fps * 0.65], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Divider line draws
  const lineWidth = interpolate(frame, [fps * 0.7, fps * 1.1], [0, 120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Logo and CTA appear together
  const ctaOpacity = interpolate(frame, [fps * 1.0, fps * 1.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ctaY = interpolate(frame, [fps * 1.0, fps * 1.5], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Logo glow
  const logoGlow = interpolate(frame, [fps * 1.2, fps * 1.8], [0, 25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Subtext last
  const subOpacity = interpolate(frame, [fps * 1.6, fps * 2.0], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00ff88" intensity={0.05} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 24,
          flexDirection: "column",
        }}
      >
        {/* Hero multiplier - the payoff */}
        <div
          style={{
            transform: `scale(${heroScale})`,
            opacity: heroOpacity,
            filter: `drop-shadow(0 0 ${heroGlow}px rgba(0, 255, 136, 0.5))`,
            display: "flex",
            alignItems: "baseline",
          }}
        >
          <span
            style={{
              fontSize: 100,
              fontWeight: 900,
              color: "#ffffff",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: -4,
            }}
          >
            4.5
          </span>
          <span
            style={{
              fontSize: 60,
              fontWeight: 900,
              color: "#00ff88",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            x
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: 22,
              color: "#666666",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 400,
              letterSpacing: 1,
            }}
          >
            Maximum multiplier. Maximum rewards.
          </span>
        </div>

        {/* Divider */}
        <div
          style={{
            width: lineWidth,
            height: 1,
            background: "linear-gradient(90deg, transparent, #333333, transparent)",
            marginTop: 12,
            marginBottom: 12,
          }}
        />

        {/* Logo and CTA */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              filter: `drop-shadow(0 0 ${logoGlow}px rgba(0, 255, 136, 0.4))`,
            }}
          >
            <FedLogo size={56} glow={false} />
          </div>
          <div
            style={{
              padding: "12px 32px",
              background: "#00ff88",
              borderRadius: 50,
            }}
          >
            <span
              style={{
                fontSize: 24,
                fontWeight: 900,
                color: "#0a0a0a",
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              fed.markets
            </span>
          </div>
        </div>

        {/* Subtle subtext */}
        <div
          style={{
            opacity: subOpacity,
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
            }}
          >
            Real yield. Every 2 minutes.
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const FeatureHighlight: React.FC<FeatureHighlightProps> = ({
  feature,
  description,
  benefits,
  icon,
}) => {
  const { fps } = useVideoConfig();

  return (
    <TransitionSeries>
      {/* Intro: 3s - Visual hook with stacking layers and 4.5x reveal */}
      <TransitionSeries.Sequence durationInFrames={Math.round(3 * fps)}>
        <IntroScene feature={feature} icon={icon} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: Math.round(0.35 * fps) })}
      />

      {/* Description: 2.5s - Quick but impactful */}
      <TransitionSeries.Sequence durationInFrames={Math.round(2.5 * fps)}>
        <DescriptionScene description={description} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: Math.round(0.35 * fps) })}
      />

      {/* Benefits: 4s - Visual chart of multipliers */}
      <TransitionSeries.Sequence durationInFrames={Math.round(4 * fps)}>
        <BenefitsScene benefits={benefits} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: Math.round(0.35 * fps) })}
      />

      {/* CTA: 3s - Strong finish with 4.5x callback */}
      <TransitionSeries.Sequence durationInFrames={Math.round(3 * fps)}>
        <CTAScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
