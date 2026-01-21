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

// Minimal cinematic background - whisper-quiet presence
const CinematicBackground: React.FC<{
  accentColor?: string;
  intensity?: number;
  focusY?: number;
}> = ({ accentColor = "#00ff88", intensity = 0.025, focusY = 50 }) => {
  const frame = useCurrentFrame();

  // Extremely slow drift
  const drift = interpolate(frame, [0, 600], [0, 2], {
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
      {/* Pure black base */}
      <AbsoluteFill style={{ background: "#030303" }} />

      {/* Primary glow - subtle */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 85% 50% at 50% ${focusY + drift}%, ${hexToRgba(accentColor, intensity)} 0%, transparent 60%)`,
        }}
      />

      {/* Cinematic vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 25%, rgba(0,0,0,0.6) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// Scene 1: The Hook - "4.5x" emerges with gravitas, no clutter
const HookScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Opening breath - subtle bloom draws the eye
  const bloomOpacity = interpolate(
    frame,
    [0, fps * 0.08, fps * 0.25, fps * 0.5],
    [0, 0.12, 0.06, 0],
    { extrapolateRight: "clamp" }
  );
  const bloomScale = interpolate(
    frame,
    [0, fps * 0.4],
    [0.6, 1.8],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Pre-text badge - builds anticipation
  const badgeOpacity = interpolate(
    frame,
    [fps * 0.3, fps * 0.6],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const badgeY = interpolate(
    frame,
    [fps * 0.3, fps * 0.7],
    [12, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Hero "4.5x" - THE moment
  const heroDelay = 0.65;
  const heroProgress = spring({
    frame: frame - heroDelay * fps,
    fps,
    config: { damping: 200, stiffness: 80, mass: 1.2 },
  });
  const heroOpacity = interpolate(
    frame,
    [heroDelay * fps, (heroDelay + 0.25) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const heroScale = interpolate(heroProgress, [0, 1], [0.92, 1]);

  // Glow builds after hero lands
  const heroGlow = interpolate(
    frame,
    [fps * 1.0, fps * 2.0],
    [0, 60],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Underline accent draws
  const underlineWidth = interpolate(
    frame,
    [fps * 1.4, fps * 1.9],
    [0, 200],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const underlineOpacity = interpolate(
    frame,
    [fps * 1.4, fps * 1.7],
    [0, 0.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Tagline - the context
  const tagDelay = 1.7;
  const tagOpacity = interpolate(
    frame,
    [tagDelay * fps, (tagDelay + 0.3) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const tagY = interpolate(
    frame,
    [tagDelay * fps, (tagDelay + 0.4) * fps],
    [14, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00ff88" intensity={0.035} focusY={48} />

      {/* Opening bloom */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,255,136,0.4) 0%, transparent 60%)",
            opacity: bloomOpacity,
            transform: `scale(${bloomScale})`,
            position: "absolute",
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {/* Pre-text badge */}
        <div
          style={{
            opacity: badgeOpacity,
            transform: `translateY(${badgeY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#00ff88",
              boxShadow: "0 0 10px rgba(0, 255, 136, 0.5)",
            }}
          />
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#4a4a4a",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 5,
              textTransform: "uppercase",
            }}
          >
            Maximum Multiplier
          </span>
        </div>

        {/* Hero "4.5x" */}
        <div
          style={{
            opacity: heroOpacity,
            transform: `scale(${heroScale})`,
            filter: `drop-shadow(0 0 ${heroGlow}px rgba(0, 255, 136, 0.5))`,
            display: "flex",
            alignItems: "baseline",
          }}
        >
          <span
            style={{
              fontSize: 220,
              fontWeight: 900,
              color: "#ffffff",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: -12,
              lineHeight: 0.9,
            }}
          >
            4.5
          </span>
          <span
            style={{
              fontSize: 100,
              fontWeight: 900,
              color: "#00ff88",
              fontFamily: "system-ui, -apple-system, sans-serif",
              marginLeft: 4,
            }}
          >
            x
          </span>
        </div>

        {/* Underline */}
        <div
          style={{
            width: underlineWidth,
            height: 2,
            background: "linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.5), transparent)",
            marginTop: 28,
            opacity: underlineOpacity,
            borderRadius: 1,
          }}
        />

        {/* Tagline */}
        <div
          style={{
            opacity: tagOpacity,
            transform: `translateY(${tagY}px)`,
            marginTop: 24,
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 500,
              color: "#00ff88",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 1.5,
              opacity: 0.85,
            }}
          >
            Stack rewards. Maximize yield.
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Multiplier layer component - refined glass cards
const MultiplierLayer: React.FC<{
  label: string;
  multiplier: string;
  index: number;
  color: string;
}> = ({ label, multiplier, index, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const delay = 0.25 + index * 0.18;

  const slideProgress = spring({
    frame: frame - delay * fps,
    fps,
    config: { damping: 200, stiffness: 100 },
  });

  const opacity = interpolate(
    frame,
    [delay * fps, (delay + 0.18) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Accent line draws from left
  const accentWidth = interpolate(
    frame,
    [(delay + 0.1) * fps, (delay + 0.45) * fps],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  const yOffset = interpolate(slideProgress, [0, 1], [30, 0]);

  // Convert color to RGB for glow
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : "0, 255, 136";
  };
  const colorRgb = hexToRgb(color);

  // Subtle glow builds
  const glowIntensity = interpolate(
    frame,
    [(delay + 0.3) * fps, (delay + 0.7) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        transform: `translateY(${yOffset}px)`,
        opacity,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: 380,
          padding: "18px 26px",
          background: "linear-gradient(165deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.005) 100%)",
          borderRadius: 12,
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.04)",
          boxShadow: `
            0 20px 50px rgba(0, 0, 0, 0.4),
            0 0 ${25 * glowIntensity}px rgba(${colorRgb}, ${0.06 * glowIntensity}),
            inset 0 1px 0 rgba(255, 255, 255, 0.02)
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
            background: `linear-gradient(90deg, ${color} 0%, ${color}50 85%, transparent 100%)`,
            borderRadius: "2px 0 0 0",
          }}
        />

        <span
          style={{
            fontSize: 14,
            color: "#606060",
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: 500,
            letterSpacing: 1,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: 26,
            color: color,
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: 800,
            letterSpacing: -0.5,
          }}
        >
          {multiplier}
        </span>
      </div>
    </div>
  );
};

// Scene 2: The Stack - Layers build up visually
const StackScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const layers = [
    { label: "Holder Tier", multiplier: "1.5x", color: "#00ff88" },
    { label: "Diamond Hands", multiplier: "1.25x", color: "#00d4ff" },
    { label: "Engagement", multiplier: "1.2x", color: "#ff6b9d" },
    { label: "Time Lock", multiplier: "2.0x", color: "#ffc857" },
  ];

  // Scene fade in
  const sceneFade = interpolate(frame, [0, fps * 0.1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Header
  const headerOpacity = interpolate(
    frame,
    [fps * 0.05, fps * 0.28],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const headerY = interpolate(
    frame,
    [fps * 0.05, fps * 0.35],
    [10, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Decorative lines
  const lineWidth = interpolate(
    frame,
    [fps * 0.08, fps * 0.45],
    [0, 45],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // "Stacked" indicator appears after all layers
  const stackedDelay = 1.35;
  const stackedOpacity = interpolate(
    frame,
    [stackedDelay * fps, (stackedDelay + 0.25) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const stackedY = interpolate(
    frame,
    [stackedDelay * fps, (stackedDelay + 0.35) * fps],
    [12, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Glow builds on the combined indicator
  const stackedGlow = interpolate(
    frame,
    [(stackedDelay + 0.2) * fps, (stackedDelay + 0.7) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00ff88" intensity={0.03} focusY={45} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 28,
          padding: 60,
        }}
      >
        {/* Header */}
        <div
          style={{
            opacity: headerOpacity,
            transform: `translateY(${headerY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 10,
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
              color: "#4a4a4a",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 5,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Four Multipliers
          </span>
          <div
            style={{
              width: lineWidth,
              height: 1,
              background: "linear-gradient(90deg, #2a2a2a, transparent)",
            }}
          />
        </div>

        {/* Layers */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
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

        {/* Stacked indicator */}
        <div
          style={{
            opacity: stackedOpacity,
            transform: `translateY(${stackedY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginTop: 10,
            padding: "14px 28px",
            background: "rgba(0, 255, 136, 0.04)",
            borderRadius: 50,
            border: "1px solid rgba(0, 255, 136, 0.1)",
            boxShadow: `0 0 ${30 * stackedGlow}px rgba(0, 255, 136, ${0.15 * stackedGlow})`,
          }}
        >
          <span
            style={{
              fontSize: 14,
              color: "#606060",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 2,
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            Combined
          </span>
          <span
            style={{
              fontSize: 28,
              fontWeight: 900,
              color: "#00ff88",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: -1,
            }}
          >
            4.5x
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 3: The Comparison - Visual before/after that shows the multiplier impact
const ComparisonScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene fade
  const sceneFade = interpolate(frame, [0, fps * 0.1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Header
  const headerOpacity = interpolate(frame, [fps * 0.05, fps * 0.3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headerY = interpolate(frame, [fps * 0.05, fps * 0.35], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // "Without" side - fades in first
  const withoutDelay = 0.3;
  const withoutOpacity = interpolate(
    frame,
    [withoutDelay * fps, (withoutDelay + 0.25) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const withoutY = interpolate(
    frame,
    [withoutDelay * fps, (withoutDelay + 0.35) * fps],
    [20, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Arrow - draws after "without"
  const arrowDelay = 0.7;
  const arrowOpacity = interpolate(
    frame,
    [arrowDelay * fps, (arrowDelay + 0.2) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const arrowWidth = interpolate(
    frame,
    [arrowDelay * fps, (arrowDelay + 0.35) * fps],
    [0, 80],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // "With" side - the payoff
  const withDelay = 1.0;
  const withProgress = spring({
    frame: frame - withDelay * fps,
    fps,
    config: { damping: 180, stiffness: 100 },
  });
  const withOpacity = interpolate(
    frame,
    [withDelay * fps, (withDelay + 0.2) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const withScale = interpolate(withProgress, [0, 1], [0.95, 1]);

  // Glow builds on the "with" number
  const withGlow = interpolate(
    frame,
    [(withDelay + 0.2) * fps, (withDelay + 0.8) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Multiplier badge
  const badgeDelay = 1.5;
  const badgeOpacity = interpolate(
    frame,
    [badgeDelay * fps, (badgeDelay + 0.2) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const badgeScale = spring({
    frame: frame - badgeDelay * fps,
    fps,
    config: { damping: 150, stiffness: 200 },
  });

  // Count up the "with multiplier" value (simulating $100 * 4.5x = $450)
  const baseValue = 100;
  const multipliedValue = 450;
  const displayWithValue = interpolate(
    frame,
    [(withDelay + 0.1) * fps, (withDelay + 0.6) * fps],
    [baseValue, multipliedValue],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00ff88" intensity={0.03} focusY={50} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 50,
          padding: 80,
        }}
      >
        {/* Header */}
        <div
          style={{
            opacity: headerOpacity,
            transform: `translateY(${headerY}px)`,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: 38,
              fontWeight: 900,
              color: "#ffffff",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: -1.5,
            }}
          >
            Same distribution. Different rewards.
          </span>
        </div>

        {/* Comparison row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 50,
          }}
        >
          {/* WITHOUT multiplier */}
          <div
            style={{
              opacity: withoutOpacity,
              transform: `translateY(${withoutY}px)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              padding: "32px 48px",
              background: "linear-gradient(165deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.005) 100%)",
              borderRadius: 16,
              border: "1px solid rgba(255, 255, 255, 0.04)",
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: "#444444",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: 3,
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Base
            </span>
            <span
              style={{
                fontSize: 56,
                fontWeight: 900,
                color: "#505050",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -2,
              }}
            >
              $100
            </span>
          </div>

          {/* Arrow */}
          <div
            style={{
              opacity: arrowOpacity,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: arrowWidth,
                height: 2,
                background: "linear-gradient(90deg, #333333, #00ff88)",
                borderRadius: 1,
              }}
            />
            <div
              style={{
                width: 0,
                height: 0,
                borderTop: "6px solid transparent",
                borderBottom: "6px solid transparent",
                borderLeft: "10px solid #00ff88",
                opacity: arrowWidth > 60 ? 1 : 0,
              }}
            />
          </div>

          {/* WITH multiplier */}
          <div
            style={{
              opacity: withOpacity,
              transform: `scale(${withScale})`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              padding: "32px 48px",
              background: "linear-gradient(165deg, rgba(0, 255, 136, 0.06) 0%, rgba(0, 255, 136, 0.015) 100%)",
              borderRadius: 16,
              border: "1px solid rgba(0, 255, 136, 0.12)",
              position: "relative",
              boxShadow: `0 0 ${40 * withGlow}px rgba(0, 255, 136, ${0.12 * withGlow})`,
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: "#00ff88",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: 3,
                textTransform: "uppercase",
                fontWeight: 600,
                opacity: 0.8,
              }}
            >
              With 4.5x
            </span>
            <span
              style={{
                fontSize: 56,
                fontWeight: 900,
                color: "#00ff88",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -2,
                filter: `drop-shadow(0 0 ${15 * withGlow}px rgba(0, 255, 136, 0.5))`,
              }}
            >
              ${Math.round(displayWithValue)}
            </span>

            {/* Multiplier badge */}
            <div
              style={{
                position: "absolute",
                top: -16,
                right: -16,
                opacity: badgeOpacity,
                transform: `scale(${badgeScale})`,
              }}
            >
              <div
                style={{
                  padding: "8px 14px",
                  background: "#00ff88",
                  borderRadius: 20,
                  boxShadow: "0 4px 16px rgba(0, 255, 136, 0.4)",
                }}
              >
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 900,
                    color: "#030303",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                  }}
                >
                  4.5x
                </span>
              </div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 4: CTA - Confident close with 4.5x callback
const CTAScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo entrance
  const logoProgress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 80 },
  });
  const logoOpacity = interpolate(frame, [0, fps * 0.22], [0, 1], {
    extrapolateRight: "clamp",
  });
  const logoGlow = interpolate(
    frame,
    [fps * 0.15, fps * 0.65],
    [0, 35],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // "4.5x" hero - callback to opening
  const heroOpacity = interpolate(
    frame,
    [fps * 0.25, fps * 0.55],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const heroY = interpolate(
    frame,
    [fps * 0.25, fps * 0.6],
    [16, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const heroGlow = interpolate(
    frame,
    [fps * 0.4, fps * 1.0],
    [0, 30],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Tagline
  const tagOpacity = interpolate(
    frame,
    [fps * 0.55, fps * 0.85],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const tagY = interpolate(
    frame,
    [fps * 0.55, fps * 0.9],
    [12, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // CTA button
  const ctaDelay = 0.9;
  const ctaProgress = spring({
    frame: frame - ctaDelay * fps,
    fps,
    config: { damping: 180, stiffness: 90 },
  });
  const ctaOpacity = interpolate(
    frame,
    [ctaDelay * fps, (ctaDelay + 0.2) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ctaY = interpolate(ctaProgress, [0, 1], [18, 0]);
  const ctaGlow = interpolate(
    frame,
    [(ctaDelay + 0.15) * fps, fps * 1.6],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Bottom text
  const bottomOpacity = interpolate(
    frame,
    [fps * 1.35, fps * 1.7],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const bottomY = interpolate(
    frame,
    [fps * 1.35, fps * 1.75],
    [8, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00ff88" intensity={0.04} focusY={50} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 22,
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
          <FedLogo size={80} glow={false} />
        </div>

        {/* Hero 4.5x */}
        <div
          style={{
            opacity: heroOpacity,
            transform: `translateY(${heroY}px)`,
            filter: `drop-shadow(0 0 ${heroGlow}px rgba(0, 255, 136, 0.4))`,
            display: "flex",
            alignItems: "baseline",
          }}
        >
          <span
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: "#ffffff",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: -3,
            }}
          >
            4.5
          </span>
          <span
            style={{
              fontSize: 44,
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
            opacity: tagOpacity,
            transform: `translateY(${tagY}px)`,
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
            Maximum rewards. Minimum effort.
          </span>
        </div>

        {/* CTA Button */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px)`,
            marginTop: 8,
          }}
        >
          <div
            style={{
              padding: "16px 50px",
              background: "#00ff88",
              borderRadius: 50,
              boxShadow: `
                0 6px 26px rgba(0, 255, 136, ${0.22 + 0.12 * ctaGlow}),
                0 0 ${32 * ctaGlow}px rgba(0, 255, 136, ${0.12 * ctaGlow})
              `,
            }}
          >
            <span
              style={{
                fontSize: 30,
                fontWeight: 900,
                color: "#040404",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -0.5,
              }}
            >
              fed.markets
            </span>
          </div>
        </div>

        {/* Bottom text */}
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
              letterSpacing: 4,
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

export const FeatureHighlight: React.FC<FeatureHighlightProps> = ({
  feature,
  description,
  benefits,
  icon,
}) => {
  const { fps } = useVideoConfig();

  // Clean fades - 0.28s is the sweet spot
  const transitionFrames = Math.round(0.28 * fps);

  return (
    <TransitionSeries>
      {/* Hook: 2.8s - 4.5x reveal with gravitas */}
      <TransitionSeries.Sequence durationInFrames={Math.round(2.8 * fps)}>
        <HookScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* Stack: 2.5s - Layers build visually */}
      <TransitionSeries.Sequence durationInFrames={Math.round(2.5 * fps)}>
        <StackScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* Comparison: 3s - Visual impact of multipliers */}
      <TransitionSeries.Sequence durationInFrames={Math.round(3 * fps)}>
        <ComparisonScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* CTA: 3s - Strong close */}
      <TransitionSeries.Sequence durationInFrames={Math.round(3 * fps)}>
        <CTAScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
