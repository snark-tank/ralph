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

// Premium cinematic background - barely perceptible, supremely elegant
const CinematicBackground: React.FC<{
  accentColor?: string;
  intensity?: number;
  focusY?: number;
  secondaryColor?: string;
}> = ({ accentColor = "#00ff88", intensity = 0.02, focusY = 50, secondaryColor }) => {
  const frame = useCurrentFrame();

  // Extremely slow, imperceptible drift - creates subtle life
  const drift = interpolate(frame, [0, 900], [0, 2.5], {
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
          background: `radial-gradient(ellipse 70% 45% at 50% ${focusY + drift}%, ${hexToRgba(accentColor, intensity)} 0%, transparent 55%)`,
        }}
      />

      {/* Secondary ambient if provided */}
      {secondaryColor && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 50% 30% at 30% 70%, ${hexToRgba(secondaryColor, intensity * 0.4)} 0%, transparent 50%)`,
          }}
        />
      )}

      {/* Deep vignette - frames the content cinematically */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 85% 75% at 50% 50%, transparent 30%, rgba(0,0,0,0.7) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// Scene 1: The Hook - "4.5x" emerges with Apple-keynote gravitas
const HookScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: The Darkness - dramatic pause before anything happens
  // Then a single point of light expands into the reveal

  // Opening pulse - single point expands outward, draws the eye
  const pulseOpacity = interpolate(
    frame,
    [fps * 0.1, fps * 0.2, fps * 0.45, fps * 0.7],
    [0, 0.35, 0.15, 0],
    { extrapolateRight: "clamp" }
  );
  const pulseScale = interpolate(
    frame,
    [fps * 0.1, fps * 0.65],
    [0.2, 2.8],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Horizontal accent line - cinematic reveal
  const lineWidth = interpolate(
    frame,
    [fps * 0.25, fps * 0.8],
    [0, 400],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const lineOpacity = interpolate(
    frame,
    [fps * 0.25, fps * 0.5, fps * 2.2, fps * 2.6],
    [0, 0.3, 0.3, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Pre-text badge - builds tension before the big number
  const badgeDelay = 0.45;
  const badgeOpacity = interpolate(
    frame,
    [badgeDelay * fps, (badgeDelay + 0.25) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const badgeY = interpolate(
    frame,
    [badgeDelay * fps, (badgeDelay + 0.35) * fps],
    [14, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Pulsing indicator - adds life
  const dotPulse = frame > fps * 0.65 ? interpolate(
    (frame - fps * 0.65) % (fps * 1.5),
    [0, fps * 0.35, fps * 1.5],
    [0.45, 1, 0.45]
  ) : interpolate(frame, [badgeDelay * fps, fps * 0.65], [0, 0.45], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Hero "4.5x" - THE cinematic moment with weight
  const heroDelay = 0.85;
  const heroProgress = spring({
    frame: frame - heroDelay * fps,
    fps,
    config: { damping: 180, stiffness: 50, mass: 1.5 },
  });
  const heroOpacity = interpolate(
    frame,
    [heroDelay * fps, (heroDelay + 0.3) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const heroScale = interpolate(heroProgress, [0, 1], [0.88, 1]);
  const heroY = interpolate(heroProgress, [0, 1], [35, 0]);

  // The "x" animates separately - slightly delayed for visual interest
  const xDelay = 1.05;
  const xProgress = spring({
    frame: frame - xDelay * fps,
    fps,
    config: { damping: 200, stiffness: 120 },
  });
  const xOpacity = interpolate(
    frame,
    [xDelay * fps, (xDelay + 0.2) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const xScale = interpolate(xProgress, [0, 1], [0.7, 1]);

  // Glow builds majestically after hero lands
  const heroGlow = interpolate(
    frame,
    [fps * 1.3, fps * 2.4],
    [0, 70],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Underline accent draws with purpose
  const underlineWidth = interpolate(
    frame,
    [fps * 1.6, fps * 2.1],
    [0, 260],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const underlineOpacity = interpolate(
    frame,
    [fps * 1.6, fps * 1.9],
    [0, 0.55],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Tagline - the payoff context
  const tagDelay = 2.0;
  const tagOpacity = interpolate(
    frame,
    [tagDelay * fps, (tagDelay + 0.35) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const tagY = interpolate(
    frame,
    [tagDelay * fps, (tagDelay + 0.45) * fps],
    [16, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Background glow intensifies with the reveal
  const bgIntensity = interpolate(
    frame,
    [fps * 0.5, fps * 1.8],
    [0.02, 0.045],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00ff88" intensity={bgIntensity} focusY={48} />

      {/* Opening pulse - single expanding circle */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,255,136,0.5) 0%, transparent 55%)",
            opacity: pulseOpacity,
            transform: `scale(${pulseScale})`,
            position: "absolute",
          }}
        />
        {/* Horizontal accent line */}
        <div
          style={{
            width: lineWidth,
            height: 1,
            background: "linear-gradient(90deg, transparent 0%, rgba(0,255,136,0.45) 25%, rgba(0,255,136,0.6) 50%, rgba(0,255,136,0.45) 75%, transparent 100%)",
            position: "absolute",
            opacity: lineOpacity,
            boxShadow: "0 0 14px rgba(0,255,136,0.2)",
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
        {/* Pre-text badge - creates anticipation */}
        <div
          style={{
            opacity: badgeOpacity,
            transform: `translateY(${badgeY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#00ff88",
              opacity: dotPulse,
              boxShadow: `0 0 ${10 + 6 * dotPulse}px rgba(0, 255, 136, ${0.4 + 0.3 * dotPulse})`,
            }}
          />
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#454545",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 6,
              textTransform: "uppercase",
            }}
          >
            Maximum Multiplier
          </span>
        </div>

        {/* Hero "4.5x" - with separated x for visual interest */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            position: "relative",
          }}
        >
          <div
            style={{
              opacity: heroOpacity,
              transform: `translateY(${heroY}px) scale(${heroScale})`,
              filter: `drop-shadow(0 0 ${heroGlow}px rgba(0, 255, 136, 0.5))`,
            }}
          >
            <span
              style={{
                fontSize: 240,
                fontWeight: 900,
                color: "#ffffff",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -14,
                lineHeight: 0.85,
                textShadow: "0 10px 50px rgba(0, 0, 0, 0.5)",
              }}
            >
              4.5
            </span>
          </div>
          <div
            style={{
              opacity: xOpacity,
              transform: `scale(${xScale})`,
              marginLeft: 6,
            }}
          >
            <span
              style={{
                fontSize: 110,
                fontWeight: 900,
                color: "#00ff88",
                fontFamily: "system-ui, -apple-system, sans-serif",
                textShadow: `0 0 ${heroGlow * 0.5}px rgba(0, 255, 136, 0.4)`,
              }}
            >
              x
            </span>
          </div>
        </div>

        {/* Underline - draws attention downward */}
        <div
          style={{
            width: underlineWidth,
            height: 2,
            background: "linear-gradient(90deg, transparent 5%, rgba(0, 255, 136, 0.55) 50%, transparent 95%)",
            marginTop: 36,
            opacity: underlineOpacity,
            borderRadius: 1,
            boxShadow: "0 0 12px rgba(0, 255, 136, 0.15)",
          }}
        />

        {/* Tagline - the promise */}
        <div
          style={{
            opacity: tagOpacity,
            transform: `translateY(${tagY}px)`,
            marginTop: 28,
          }}
        >
          <span
            style={{
              fontSize: 22,
              fontWeight: 500,
              color: "#00ff88",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 2,
              opacity: 0.9,
            }}
          >
            Stack rewards. Maximize yield.
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Multiplier layer component - premium glass cards with sophisticated animation
const MultiplierLayer: React.FC<{
  label: string;
  multiplier: string;
  index: number;
  color: string;
  totalLayers: number;
}> = ({ label, multiplier, index, color, totalLayers }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Stagger with deliberate timing - each card gets its moment
  const delay = 0.35 + index * 0.2;

  const slideProgress = spring({
    frame: frame - delay * fps,
    fps,
    config: { damping: 200, stiffness: 80, mass: 1.1 },
  });

  const opacity = interpolate(
    frame,
    [delay * fps, (delay + 0.22) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Card slides up and in
  const yOffset = interpolate(slideProgress, [0, 1], [35, 0]);
  const scaleIn = interpolate(slideProgress, [0, 1], [0.96, 1]);

  // Left accent bar draws elegantly
  const accentHeight = interpolate(
    frame,
    [(delay + 0.1) * fps, (delay + 0.55) * fps],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Convert color to RGB for glow
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : "0, 255, 136";
  };
  const colorRgb = hexToRgb(color);

  // Glow builds after card settles
  const glowIntensity = interpolate(
    frame,
    [(delay + 0.35) * fps, (delay + 0.9) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Multiplier number fades in slightly after card
  const numOpacity = interpolate(
    frame,
    [(delay + 0.15) * fps, (delay + 0.38) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Number glow intensifies
  const numGlow = interpolate(
    frame,
    [(delay + 0.4) * fps, (delay + 0.9) * fps],
    [0, 12],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <div
      style={{
        transform: `translateY(${yOffset}px) scale(${scaleIn})`,
        opacity,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: 420,
          padding: "20px 28px",
          background: "linear-gradient(160deg, rgba(255,255,255,0.028) 0%, rgba(255,255,255,0.006) 100%)",
          borderRadius: 14,
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.045)",
          boxShadow: `
            0 25px 55px rgba(0, 0, 0, 0.45),
            0 0 ${28 * glowIntensity}px rgba(${colorRgb}, ${0.07 * glowIntensity}),
            inset 0 1px 0 rgba(255, 255, 255, 0.025)
          `,
        }}
      >
        {/* Left accent bar - vertical */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 3,
            height: `${accentHeight}%`,
            background: `linear-gradient(180deg, ${color} 0%, ${color}60 75%, transparent 100%)`,
            borderRadius: "3px 0 0 0",
            boxShadow: `0 0 ${10 * glowIntensity}px ${color}50`,
          }}
        />

        {/* Label with small indicator dot */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: color,
              opacity: 0.35 + 0.35 * glowIntensity,
              boxShadow: `0 0 ${6 * glowIntensity}px ${color}`,
            }}
          />
          <span
            style={{
              fontSize: 15,
              color: "#5a5a5a",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 500,
              letterSpacing: 0.8,
            }}
          >
            {label}
          </span>
        </div>

        {/* Multiplier value */}
        <span
          style={{
            fontSize: 28,
            color: color,
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: 800,
            letterSpacing: -0.5,
            opacity: numOpacity,
            filter: `drop-shadow(0 0 ${numGlow}px ${color}60)`,
          }}
        >
          {multiplier}
        </span>
      </div>
    </div>
  );
};

// Scene 2: The Stack - Layers build up with premium reveal timing
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
  const sceneFade = interpolate(frame, [0, fps * 0.12], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Header - appears first to set context
  const headerOpacity = interpolate(
    frame,
    [fps * 0.06, fps * 0.32],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const headerY = interpolate(
    frame,
    [fps * 0.06, fps * 0.4],
    [12, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Decorative lines draw symmetrically
  const lineWidth = interpolate(
    frame,
    [fps * 0.1, fps * 0.5],
    [0, 55],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // "Combined" result appears after all layers - THE payoff
  const combinedDelay = 1.55;
  const combinedProgress = spring({
    frame: frame - combinedDelay * fps,
    fps,
    config: { damping: 180, stiffness: 90, mass: 1.1 },
  });
  const combinedOpacity = interpolate(
    frame,
    [combinedDelay * fps, (combinedDelay + 0.22) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const combinedY = interpolate(combinedProgress, [0, 1], [20, 0]);
  const combinedScale = interpolate(combinedProgress, [0, 1], [0.95, 1]);

  // Combined glow builds dramatically
  const combinedGlow = interpolate(
    frame,
    [(combinedDelay + 0.2) * fps, (combinedDelay + 0.8) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Divider line between layers and combined
  const dividerWidth = interpolate(
    frame,
    [(combinedDelay - 0.1) * fps, combinedDelay * fps],
    [0, 180],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const dividerOpacity = interpolate(
    frame,
    [(combinedDelay - 0.1) * fps, (combinedDelay + 0.1) * fps],
    [0, 0.3],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Background glow intensifies as layers stack
  const bgIntensity = interpolate(
    frame,
    [fps * 0.4, fps * 2.0],
    [0.025, 0.04],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00ff88" intensity={bgIntensity} focusY={42} secondaryColor="#00d4ff" />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 22,
          padding: 55,
        }}
      >
        {/* Header with decorative lines */}
        <div
          style={{
            opacity: headerOpacity,
            transform: `translateY(${headerY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 18,
            marginBottom: 14,
          }}
        >
          <div
            style={{
              width: lineWidth,
              height: 1,
              background: "linear-gradient(270deg, rgba(0, 255, 136, 0.2), transparent)",
            }}
          />
          <span
            style={{
              fontSize: 11,
              color: "#484848",
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
              background: "linear-gradient(90deg, rgba(0, 255, 136, 0.2), transparent)",
            }}
          />
        </div>

        {/* Layers - stack with deliberate timing */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 11,
          }}
        >
          {layers.map((layer, index) => (
            <MultiplierLayer
              key={layer.label}
              label={layer.label}
              multiplier={layer.multiplier}
              index={index}
              color={layer.color}
              totalLayers={layers.length}
            />
          ))}
        </div>

        {/* Divider line */}
        <div
          style={{
            width: dividerWidth,
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12), transparent)",
            opacity: dividerOpacity,
            marginTop: 6,
          }}
        />

        {/* Combined result - the payoff moment */}
        <div
          style={{
            opacity: combinedOpacity,
            transform: `translateY(${combinedY}px) scale(${combinedScale})`,
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "16px 32px",
            background: "linear-gradient(160deg, rgba(0, 255, 136, 0.06) 0%, rgba(0, 255, 136, 0.015) 100%)",
            borderRadius: 50,
            border: "1px solid rgba(0, 255, 136, 0.12)",
            boxShadow: `
              0 15px 45px rgba(0, 0, 0, 0.35),
              0 0 ${35 * combinedGlow}px rgba(0, 255, 136, ${0.12 * combinedGlow})
            `,
          }}
        >
          <span
            style={{
              fontSize: 13,
              color: "#00ff88",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 3,
              textTransform: "uppercase",
              fontWeight: 600,
              opacity: 0.75,
            }}
          >
            Combined
          </span>
          <span
            style={{
              fontSize: 32,
              fontWeight: 900,
              color: "#00ff88",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: -1,
              filter: `drop-shadow(0 0 ${12 * combinedGlow}px rgba(0, 255, 136, 0.5))`,
            }}
          >
            4.5x
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 3: The Comparison - Visual impact of multipliers with dramatic reveal
const ComparisonScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene fade
  const sceneFade = interpolate(frame, [0, fps * 0.12], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Header - appears first with weight
  const headerProgress = spring({
    frame: frame - fps * 0.08,
    fps,
    config: { damping: 200, stiffness: 80, mass: 1.1 },
  });
  const headerOpacity = interpolate(frame, [fps * 0.08, fps * 0.35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headerY = interpolate(headerProgress, [0, 1], [18, 0]);

  // "Base" side - fades in with subtle entrance
  const baseDelay = 0.4;
  const baseProgress = spring({
    frame: frame - baseDelay * fps,
    fps,
    config: { damping: 200, stiffness: 100 },
  });
  const baseOpacity = interpolate(
    frame,
    [baseDelay * fps, (baseDelay + 0.25) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const baseY = interpolate(baseProgress, [0, 1], [28, 0]);

  // Arrow/flow indicator - draws after base
  const flowDelay = 0.8;
  const flowOpacity = interpolate(
    frame,
    [flowDelay * fps, (flowDelay + 0.18) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const flowWidth = interpolate(
    frame,
    [flowDelay * fps, (flowDelay + 0.4) * fps],
    [0, 90],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Flow glow pulses after drawing
  const flowGlow = frame > fps * 1.2 ? interpolate(
    (frame - fps * 1.2) % (fps * 1.6),
    [0, fps * 0.35, fps * 1.6],
    [0.5, 1, 0.5]
  ) : 0.5;

  // "Boosted" side - THE payoff moment with dramatic entrance
  const boostedDelay = 1.1;
  const boostedProgress = spring({
    frame: frame - boostedDelay * fps,
    fps,
    config: { damping: 180, stiffness: 75, mass: 1.2 },
  });
  const boostedOpacity = interpolate(
    frame,
    [boostedDelay * fps, (boostedDelay + 0.25) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const boostedScale = interpolate(boostedProgress, [0, 1], [0.92, 1]);
  const boostedY = interpolate(boostedProgress, [0, 1], [25, 0]);

  // Glow builds majestically on the boosted card
  const boostedGlow = interpolate(
    frame,
    [(boostedDelay + 0.25) * fps, (boostedDelay + 1.0) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Badge pops in after card
  const badgeDelay = 1.55;
  const badgeProgress = spring({
    frame: frame - badgeDelay * fps,
    fps,
    config: { damping: 160, stiffness: 180 },
  });
  const badgeOpacity = interpolate(
    frame,
    [badgeDelay * fps, (badgeDelay + 0.18) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const badgeScale = interpolate(badgeProgress, [0, 1], [0.6, 1]);

  // Count up the "boosted" value - $100 × 4.5 = $450 with satisfying ease-out
  const baseValue = 100;
  const multipliedValue = 450;
  const displayBoostedValue = interpolate(
    frame,
    [(boostedDelay + 0.15) * fps, (boostedDelay + 0.75) * fps],
    [baseValue, multipliedValue],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: (t) => 1 - Math.pow(1 - t, 4),
    }
  );

  // Number glow intensifies as it climbs
  const numGlow = interpolate(
    frame,
    [(boostedDelay + 0.5) * fps, (boostedDelay + 0.9) * fps],
    [0, 18],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Background glow intensifies with the reveal
  const bgIntensity = interpolate(
    frame,
    [fps * 0.6, fps * 2.0],
    [0.025, 0.045],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00ff88" intensity={bgIntensity} focusY={50} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 55,
          padding: 70,
        }}
      >
        {/* Header - sets the context */}
        <div
          style={{
            opacity: headerOpacity,
            transform: `translateY(${headerY}px)`,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: 42,
              fontWeight: 900,
              color: "#ffffff",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: -2,
              textShadow: "0 6px 35px rgba(0, 0, 0, 0.4)",
            }}
          >
            Same distribution. <span style={{ color: "#00ff88" }}>Different</span> rewards.
          </span>
        </div>

        {/* Comparison row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 45,
          }}
        >
          {/* BASE card - understated */}
          <div
            style={{
              opacity: baseOpacity,
              transform: `translateY(${baseY}px)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 18,
              padding: "36px 55px",
              background: "linear-gradient(165deg, rgba(255,255,255,0.022) 0%, rgba(255,255,255,0.005) 100%)",
              borderRadius: 16,
              border: "1px solid rgba(255, 255, 255, 0.04)",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.35)",
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: "#484848",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: 4,
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Base Reward
            </span>
            <span
              style={{
                fontSize: 62,
                fontWeight: 900,
                color: "#4a4a4a",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -3,
              }}
            >
              $100
            </span>
          </div>

          {/* Flow indicator - animated arrow */}
          <div
            style={{
              opacity: flowOpacity,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <div
              style={{
                width: flowWidth,
                height: 2,
                background: `linear-gradient(90deg, #2a2a2a, rgba(0, 255, 136, ${0.6 + 0.4 * flowGlow}))`,
                borderRadius: 1,
                boxShadow: `0 0 ${8 * flowGlow}px rgba(0, 255, 136, ${0.3 * flowGlow})`,
              }}
            />
            <div
              style={{
                width: 0,
                height: 0,
                borderTop: "7px solid transparent",
                borderBottom: "7px solid transparent",
                borderLeft: `12px solid rgba(0, 255, 136, ${flowWidth > 70 ? 0.8 + 0.2 * flowGlow : 0})`,
                filter: `drop-shadow(0 0 ${6 * flowGlow}px rgba(0, 255, 136, 0.4))`,
                transition: "border-left-color 0.1s",
              }}
            />
          </div>

          {/* BOOSTED card - the hero */}
          <div
            style={{
              opacity: boostedOpacity,
              transform: `translateY(${boostedY}px) scale(${boostedScale})`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 18,
              padding: "36px 55px",
              background: "linear-gradient(165deg, rgba(0, 255, 136, 0.07) 0%, rgba(0, 255, 136, 0.015) 100%)",
              borderRadius: 16,
              border: "1px solid rgba(0, 255, 136, 0.14)",
              position: "relative",
              boxShadow: `
                0 25px 60px rgba(0, 0, 0, 0.4),
                0 0 ${50 * boostedGlow}px rgba(0, 255, 136, ${0.1 * boostedGlow}),
                inset 0 1px 0 rgba(255, 255, 255, 0.03)
              `,
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: "#00ff88",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: 4,
                textTransform: "uppercase",
                fontWeight: 600,
                opacity: 0.85,
              }}
            >
              With 4.5x Multiplier
            </span>
            <span
              style={{
                fontSize: 62,
                fontWeight: 900,
                color: "#00ff88",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -3,
                filter: `drop-shadow(0 0 ${numGlow}px rgba(0, 255, 136, 0.55))`,
              }}
            >
              ${Math.round(displayBoostedValue)}
            </span>

            {/* Multiplier badge - floating accent */}
            <div
              style={{
                position: "absolute",
                top: -18,
                right: -18,
                opacity: badgeOpacity,
                transform: `scale(${badgeScale})`,
              }}
            >
              <div
                style={{
                  padding: "10px 16px",
                  background: "linear-gradient(135deg, #00ff88 0%, #00ffaa 100%)",
                  borderRadius: 22,
                  boxShadow: `
                    0 6px 20px rgba(0, 255, 136, 0.45),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2)
                  `,
                }}
              >
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 900,
                    color: "#020202",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    letterSpacing: -0.5,
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

// Scene 4: CTA - Commanding close with callback to the 4.5x promise
const CTAScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo entrance - hero element with presence
  const logoProgress = spring({
    frame,
    fps,
    config: { damping: 180, stiffness: 60, mass: 1.2 },
  });
  const logoOpacity = interpolate(frame, [0, fps * 0.25], [0, 1], {
    extrapolateRight: "clamp",
  });
  const logoScale = interpolate(logoProgress, [0, 1], [0.88, 1]);

  // Logo glow builds confidently
  const logoGlow = interpolate(
    frame,
    [fps * 0.2, fps * 0.8],
    [0, 50],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Expanding ring - adds depth and presence
  const ringOpacity = interpolate(
    frame,
    [fps * 0.1, fps * 0.28, fps * 0.9, fps * 1.3],
    [0, 0.25, 0.12, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ringScale = interpolate(
    frame,
    [fps * 0.1, fps * 1.3],
    [0.6, 2.2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // "4.5x" hero - callback to opening, creating narrative closure
  const heroDelay = 0.3;
  const heroProgress = spring({
    frame: frame - heroDelay * fps,
    fps,
    config: { damping: 200, stiffness: 90 },
  });
  const heroOpacity = interpolate(
    frame,
    [heroDelay * fps, (heroDelay + 0.25) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const heroY = interpolate(heroProgress, [0, 1], [20, 0]);
  const heroGlow = interpolate(
    frame,
    [fps * 0.5, fps * 1.2],
    [0, 35],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Tagline - the value prop summary
  const tagDelay = 0.55;
  const tagOpacity = interpolate(
    frame,
    [tagDelay * fps, (tagDelay + 0.28) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const tagY = interpolate(
    frame,
    [tagDelay * fps, (tagDelay + 0.38) * fps],
    [14, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // CTA button - THE action moment
  const ctaDelay = 0.85;
  const ctaProgress = spring({
    frame: frame - ctaDelay * fps,
    fps,
    config: { damping: 180, stiffness: 80, mass: 1.1 },
  });
  const ctaOpacity = interpolate(
    frame,
    [ctaDelay * fps, (ctaDelay + 0.22) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ctaY = interpolate(ctaProgress, [0, 1], [22, 0]);
  const ctaScale = interpolate(ctaProgress, [0, 1], [0.95, 1]);

  // CTA glow builds and pulses subtly
  const ctaGlow = interpolate(
    frame,
    [(ctaDelay + 0.2) * fps, fps * 1.8],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const ctaPulse = frame > fps * 1.5 ? interpolate(
    (frame - fps * 1.5) % (fps * 2.0),
    [0, fps * 1.0, fps * 2.0],
    [0.88, 1, 0.88]
  ) : 1;

  // Bottom text - final beat with decorative lines
  const bottomOpacity = interpolate(
    frame,
    [fps * 1.3, fps * 1.65],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const bottomY = interpolate(
    frame,
    [fps * 1.3, fps * 1.7],
    [10, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Decorative lines
  const lineWidth = interpolate(
    frame,
    [fps * 1.45, fps * 1.9],
    [0, 55],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Background glow
  const bgIntensity = interpolate(
    frame,
    [0, fps * 1.2],
    [0.03, 0.055],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00ff88" intensity={bgIntensity} focusY={50} />

      {/* Ambient glow behind CTA */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 50% 40% at 50% 55%, rgba(0, 255, 136, ${0.04 * ctaGlow}) 0%, transparent 60%)`,
        }}
      />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 24,
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
            <FedLogo size={90} glow={false} />
          </div>
        </div>

        {/* Hero 4.5x - callback */}
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
              fontSize: 78,
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
              fontSize: 48,
              fontWeight: 900,
              color: "#00ff88",
              fontFamily: "system-ui, -apple-system, sans-serif",
              marginLeft: 3,
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
              fontSize: 24,
              color: "#505050",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 400,
              letterSpacing: 0.5,
            }}
          >
            Maximum rewards. Minimum effort.
          </span>
        </div>

        {/* CTA Button - commanding presence */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px) scale(${ctaScale})`,
            marginTop: 10,
          }}
        >
          <div
            style={{
              padding: "18px 56px",
              background: "linear-gradient(140deg, #00ff88 0%, #00ffaa 50%, #00ff88 100%)",
              borderRadius: 50,
              boxShadow: `
                0 8px 32px rgba(0, 255, 136, ${(0.25 + 0.15 * ctaGlow) * ctaPulse}),
                0 0 ${40 * ctaGlow * ctaPulse}px rgba(0, 255, 136, ${0.12 * ctaGlow * ctaPulse}),
                inset 0 2px 0 rgba(255, 255, 255, 0.2),
                inset 0 -1px 0 rgba(0, 0, 0, 0.1)
              `,
            }}
          >
            <span
              style={{
                fontSize: 34,
                fontWeight: 900,
                color: "#020202",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -0.5,
                textShadow: "0 1px 0 rgba(255, 255, 255, 0.18)",
              }}
            >
              fed.markets
            </span>
          </div>
        </div>

        {/* Bottom proposition with decorative lines */}
        <div
          style={{
            opacity: bottomOpacity,
            transform: `translateY(${bottomY}px)`,
            marginTop: 14,
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

export const FeatureHighlight: React.FC<FeatureHighlightProps> = ({
  feature,
  description,
  benefits,
  icon,
}) => {
  const { fps } = useVideoConfig();

  // Clean, professional fades - 0.25s sweet spot
  const transitionFrames = Math.round(0.25 * fps);

  return (
    <TransitionSeries>
      {/* Hook: 3.0s - 4.5x reveal with gravitas, let it breathe */}
      <TransitionSeries.Sequence durationInFrames={Math.round(3.0 * fps)}>
        <HookScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* Stack: 2.8s - Layers build visually with stagger */}
      <TransitionSeries.Sequence durationInFrames={Math.round(2.8 * fps)}>
        <StackScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* Comparison: 3.2s - Visual impact of multipliers */}
      <TransitionSeries.Sequence durationInFrames={Math.round(3.2 * fps)}>
        <ComparisonScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* CTA: 3.0s - Strong, confident close */}
      <TransitionSeries.Sequence durationInFrames={Math.round(3.0 * fps)}>
        <CTAScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
