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
}> = ({ accentColor = "#00ff88", intensity = 0.04 }) => {
  const frame = useCurrentFrame();

  // Very subtle shift - barely perceptible
  const gradientY = interpolate(frame, [0, 300], [48, 52], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Deep dark base */}
      <AbsoluteFill style={{ background: "#0a0a0a" }} />

      {/* Subtle centered radial */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% ${gradientY}%, ${accentColor}${Math.round(intensity * 255).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
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

// Scene 1: Feature intro - Hook that demands attention
const IntroScene: React.FC<{ feature: string; icon?: string }> = ({ feature, icon }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Outer ring that expands and fades
  const ringScale = spring({
    frame: frame - fps * 0.1,
    fps,
    config: { damping: 200, stiffness: 60 },
  });
  const ringOpacity = interpolate(
    frame,
    [fps * 0.1, fps * 0.4, fps * 1.5],
    [0, 0.15, 0.05],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Badge fades in
  const badgeOpacity = interpolate(frame, [fps * 0.3, fps * 0.6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const badgeY = interpolate(frame, [fps * 0.3, fps * 0.7], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Hero multiplier - dramatic entrance
  const iconScale = spring({
    frame: frame - fps * 0.5,
    fps,
    config: { damping: 200, stiffness: 100 },
  });
  const iconOpacity = interpolate(frame, [fps * 0.5, fps * 0.75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Glow builds (no pulsing) - more dramatic
  const glowSize = interpolate(frame, [fps * 0.6, fps * 1.6], [0, 60], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Feature title - word by word
  const words = feature.split(" ");

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00ff88" intensity={0.06} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {/* Outer ring - subtle, sophisticated */}
        <div
          style={{
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: "50%",
            border: "1px solid #00ff88",
            opacity: ringOpacity,
            transform: `scale(${ringScale})`,
          }}
        />

        {/* Badge */}
        <div
          style={{
            opacity: badgeOpacity,
            transform: `translateY(${badgeY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 28,
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
              fontSize: 12,
              fontWeight: 600,
              color: "#555555",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 5,
              textTransform: "uppercase",
            }}
          >
            New Feature
          </span>
        </div>

        {/* Hero multiplier - BIG and dramatic */}
        {icon && (
          <div
            style={{
              transform: `scale(${iconScale})`,
              opacity: iconOpacity,
              filter: `drop-shadow(0 0 ${glowSize}px rgba(0, 255, 136, 0.5))`,
              marginBottom: 20,
            }}
          >
            <span
              style={{
                fontSize: 120,
                fontWeight: 900,
                color: "#00ff88",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -6,
              }}
            >
              {icon}
            </span>
          </div>
        )}

        {/* Feature title - word by word */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0 16px",
            maxWidth: 900,
          }}
        >
          {words.map((word, index) => {
            const delay = 1.0 + index * 0.07;
            const wordOpacity = interpolate(
              frame,
              [delay * fps, (delay + 0.2) * fps],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const wordY = interpolate(
              frame,
              [delay * fps, (delay + 0.3) * fps],
              [20, 0],
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
                  fontSize: 56,
                  fontWeight: 900,
                  color: "#ffffff",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  opacity: wordOpacity,
                  transform: `translateY(${wordY}px)`,
                  display: "inline-block",
                  letterSpacing: -1,
                  lineHeight: 1.2,
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

// Scene 2: Description - Clean typography, let it breathe
const DescriptionScene: React.FC<{ description: string }> = ({ description }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Container fades in
  const containerOpacity = interpolate(frame, [0, fps * 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Description text reveal
  const textOpacity = interpolate(frame, [fps * 0.2, fps * 0.6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textY = interpolate(frame, [fps * 0.2, fps * 0.7], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Accent line draws from center outward (top and bottom)
  const lineHeight = interpolate(frame, [fps * 0.15, fps * 0.8], [0, 160], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Line glow builds
  const lineGlow = interpolate(frame, [fps * 0.4, fps * 1], [0, 12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00d4ff" intensity={0.04} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 100,
          opacity: containerOpacity,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 48,
            maxWidth: 1000,
          }}
        >
          {/* Accent line - fixed height, reveals from center */}
          <div
            style={{
              width: 3,
              height: lineHeight,
              background: "linear-gradient(180deg, transparent 0%, #00d4ff 30%, #00ff88 70%, transparent 100%)",
              borderRadius: 2,
              flexShrink: 0,
              boxShadow: `0 0 ${lineGlow}px rgba(0, 212, 255, 0.5)`,
            }}
          />

          {/* Description text */}
          <p
            style={{
              fontSize: 36,
              color: "#ffffff",
              fontFamily: "system-ui, -apple-system, sans-serif",
              lineHeight: 1.6,
              fontWeight: 400,
              margin: 0,
              opacity: textOpacity,
              transform: `translateY(${textY}px)`,
            }}
          >
            {description}
          </p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Benefit item component - clean and minimal with multiplier highlight
const BenefitItem: React.FC<{
  benefit: string;
  index: number;
  totalBenefits: number;
}> = ({ benefit, index, totalBenefits }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const delay = 0.3 + index * 0.18;

  // Smooth entrance with high damping
  const progress = spring({
    frame: frame - delay * fps,
    fps,
    config: { damping: 200, stiffness: 100 },
  });

  // Dot scales in
  const dotScale = spring({
    frame: frame - (delay + 0.05) * fps,
    fps,
    config: { damping: 150, stiffness: 200 },
  });

  // Subtle glow on dot
  const dotGlow = interpolate(
    frame,
    [(delay + 0.1) * fps, (delay + 0.4) * fps],
    [0, 8],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Parse the multiplier from the benefit text (e.g., "(1.5x)")
  const multiplierMatch = benefit.match(/\(([0-9.]+x)\)/);
  const multiplier = multiplierMatch ? multiplierMatch[1] : null;
  const textWithoutMultiplier = multiplier ? benefit.replace(/\s*\([0-9.]+x\)/, "") : benefit;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        transform: `translateX(${interpolate(progress, [0, 1], [-30, 0])}px)`,
        opacity: progress,
      }}
    >
      {/* Dot indicator */}
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          background: "#00ff88",
          transform: `scale(${dotScale})`,
          flexShrink: 0,
          boxShadow: `0 0 ${dotGlow}px rgba(0, 255, 136, 0.6)`,
        }}
      />

      {/* Benefit text with highlighted multiplier */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span
          style={{
            fontSize: 30,
            color: "#ffffff",
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: 400,
          }}
        >
          {textWithoutMultiplier}
        </span>
        {multiplier && (
          <span
            style={{
              fontSize: 28,
              color: "#00ff88",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 700,
            }}
          >
            {multiplier}
          </span>
        )}
      </div>
    </div>
  );
};

// Scene 3: Benefits list - Clean, scannable
const BenefitsScene: React.FC<{ benefits: string[] }> = ({ benefits }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Header fades in first
  const headerOpacity = interpolate(frame, [0, fps * 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });
  const headerY = interpolate(frame, [0, fps * 0.4], [15, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00ff88" intensity={0.04} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "80px 120px",
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
            marginBottom: 50,
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
              fontSize: 14,
              color: "#00ff88",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 4,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Why It Matters
          </span>
        </div>

        {/* Benefits list */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          {benefits.map((benefit, index) => (
            <BenefitItem
              key={index}
              benefit={benefit}
              index={index}
              totalBenefits={benefits.length}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 4: CTA - Confident, minimal, no gimmicks
const CTAScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo entrance - smooth and confident
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 100 },
  });
  const logoOpacity = interpolate(frame, [0, fps * 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Static glow that builds (no pulsing)
  const logoGlow = interpolate(frame, [fps * 0.2, fps * 0.9], [0, 30], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Tagline
  const taglineOpacity = interpolate(frame, [fps * 0.4, fps * 0.8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const taglineY = interpolate(frame, [fps * 0.4, fps * 0.9], [15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // CTA button - appears smoothly
  const ctaOpacity = interpolate(frame, [fps * 0.9, fps * 1.3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ctaY = interpolate(frame, [fps * 0.9, fps * 1.4], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Subtext last
  const subOpacity = interpolate(frame, [fps * 1.3, fps * 1.7], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00ff88" intensity={0.04} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 32,
          flexDirection: "column",
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
          <FedLogo size={100} glow={false} />
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
              fontSize: 26,
              color: "#888888",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 400,
            }}
          >
            Stack your multipliers. Maximize your yield.
          </span>
        </div>

        {/* CTA button - static, no pulsing */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px)`,
          }}
        >
          <div
            style={{
              padding: "16px 44px",
              background: "#00ff88",
              borderRadius: 50,
            }}
          >
            <span
              style={{
                fontSize: 30,
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
            marginTop: 4,
          }}
        >
          <span
            style={{
              fontSize: 13,
              color: "#444444",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 2,
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
      {/* Intro: 2.5s - Hook with feature title */}
      <TransitionSeries.Sequence durationInFrames={Math.round(2.5 * fps)}>
        <IntroScene feature={feature} icon={icon} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: Math.round(0.4 * fps) })}
      />

      {/* Description: 3s - Let the message land */}
      <TransitionSeries.Sequence durationInFrames={Math.round(3 * fps)}>
        <DescriptionScene description={description} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: Math.round(0.4 * fps) })}
      />

      {/* Benefits: 4s - Scannable list */}
      <TransitionSeries.Sequence durationInFrames={Math.round(4 * fps)}>
        <BenefitsScene benefits={benefits} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: Math.round(0.4 * fps) })}
      />

      {/* CTA: 3s - Clean close */}
      <TransitionSeries.Sequence durationInFrames={Math.round(3 * fps)}>
        <CTAScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
