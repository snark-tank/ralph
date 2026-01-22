import {
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
  spring,
  interpolate,
  Easing,
  random,
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

// Premium film grain overlay - adds texture like high-end cinema
const FilmGrain: React.FC<{ opacity?: number }> = ({ opacity = 0.025 }) => {
  const frame = useCurrentFrame();
  const offsetX = (frame * 17) % 100;
  const offsetY = (frame * 23) % 100;

  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundPosition: `${offsetX}px ${offsetY}px`,
        opacity,
        mixBlendMode: "overlay",
        pointerEvents: "none",
      }}
    />
  );
};

// Premium cinematic background - barely perceptible, supremely elegant
const CinematicBackground: React.FC<{
  accentColor?: string;
  intensity?: number;
  focusY?: number;
  secondaryColor?: string;
  showGrain?: boolean;
}> = ({ accentColor = "#00ff88", intensity = 0.02, focusY = 50, secondaryColor, showGrain = true }) => {
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
      <AbsoluteFill style={{ background: "#030303" }} />

      {/* Subtle noise texture base for depth */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, #060606 0%, #020202 100%)`,
        }}
      />

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

      {/* Film grain for texture */}
      {showGrain && <FilmGrain opacity={0.022} />}
    </AbsoluteFill>
  );
};

// Scene 1: The Hook - "4.5x" emerges with Apple-keynote gravitas and dramatic light burst
const HookScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 0: Total darkness with a subtle flicker before the reveal - builds anticipation
  const flicker = frame < fps * 0.1 ? 0 :
    frame < fps * 0.12 ? 0.12 :
    frame < fps * 0.14 ? 0.04 :
    frame < fps * 0.16 ? 0.18 :
    frame < fps * 0.18 ? 0.06 : 1;

  const darknessFade = interpolate(
    frame,
    [fps * 0.18, fps * 0.42],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) * (frame < fps * 0.18 ? flicker : 1);

  // Initial light burst - a single bright point that expands with cinematic drama
  const burstOpacity = interpolate(
    frame,
    [fps * 0.1, fps * 0.2, fps * 0.55, fps * 0.85],
    [0, 0.75, 0.28, 0],
    { extrapolateRight: "clamp" }
  );
  const burstScale = interpolate(
    frame,
    [fps * 0.1, fps * 0.85],
    [0.03, 3.8],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Secondary outer burst ring for depth
  const ring2BurstOpacity = interpolate(
    frame,
    [fps * 0.14, fps * 0.25, fps * 0.6, fps * 0.95],
    [0, 0.45, 0.18, 0],
    { extrapolateRight: "clamp" }
  );
  const ring2BurstScale = interpolate(
    frame,
    [fps * 0.14, fps * 0.95],
    [0.02, 4.5],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Horizontal reveal line - cinematic wipe effect
  const revealLineWidth = interpolate(
    frame,
    [fps * 0.08, fps * 0.55],
    [0, 650],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const revealLineOpacity = interpolate(
    frame,
    [fps * 0.08, fps * 0.18, fps * 0.75, fps * 1.1],
    [0, 0.5, 0.25, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Pre-text badge - builds tension before the big number
  const badgeDelay = 0.48;
  const badgeOpacity = interpolate(
    frame,
    [badgeDelay * fps, (badgeDelay + 0.28) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const badgeY = interpolate(
    frame,
    [badgeDelay * fps, (badgeDelay + 0.38) * fps],
    [16, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Pulsing indicator with ring expansion - adds life
  const dotPulse = frame > fps * 0.7 ? interpolate(
    (frame - fps * 0.7) % (fps * 1.5),
    [0, fps * 0.35, fps * 1.5],
    [0.5, 1, 0.5],
    { easing: Easing.inOut(Easing.sin) }
  ) : interpolate(frame, [badgeDelay * fps, fps * 0.7], [0, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Ring pulse around dot
  const dotRingScale = frame > fps * 0.7 ? interpolate(
    (frame - fps * 0.7) % (fps * 1.5),
    [0, fps * 0.35, fps * 1.5],
    [1, 2.0, 1],
    { extrapolateLeft: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 1;
  const dotRingOpacity = frame > fps * 0.7 ? interpolate(
    (frame - fps * 0.7) % (fps * 1.5),
    [0, fps * 0.3, fps * 1.5],
    [0.6, 0, 0],
    { extrapolateLeft: "clamp" }
  ) : 0;

  // Hero "4.5x" - THE cinematic moment with commanding weight
  const heroDelay = 0.88;
  const heroProgress = spring({
    frame: frame - heroDelay * fps,
    fps,
    config: { damping: 180, stiffness: 48, mass: 1.6 },
  });
  const heroOpacity = interpolate(
    frame,
    [heroDelay * fps, (heroDelay + 0.32) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const heroScale = interpolate(heroProgress, [0, 1], [0.85, 1]);
  const heroY = interpolate(heroProgress, [0, 1], [45, 0]);

  // The "x" animates separately - slightly delayed for visual interest with scale pulse
  const xDelay = 1.1;
  const xProgress = spring({
    frame: frame - xDelay * fps,
    fps,
    config: { damping: 160, stiffness: 140, mass: 1.0 },
  });
  const xOpacity = interpolate(
    frame,
    [xDelay * fps, (xDelay + 0.22) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const xScale = interpolate(xProgress, [0, 1], [0.65, 1]);

  // x scale pulse when it lands - satisfying pop
  const xLandTime = (xDelay + 0.35) * fps;
  const xLandPulse = frame > xLandTime ? interpolate(
    frame,
    [xLandTime, xLandTime + fps * 0.1, xLandTime + fps * 0.28],
    [1, 1.12, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 1;

  // Glow builds majestically after hero lands - more dramatic
  const heroGlow = interpolate(
    frame,
    [fps * 1.35, fps * 2.5],
    [0, 85],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Dual concentric rings expanding from hero - creates depth
  const ring1Delay = 1.0;
  const ring1Opacity = interpolate(
    frame,
    [ring1Delay * fps, (ring1Delay + 0.2) * fps, fps * 2.1, fps * 2.6],
    [0, 0.24, 0.12, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ring1Scale = interpolate(
    frame,
    [ring1Delay * fps, fps * 2.6],
    [0.55, 2.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  const ring2Delay = 1.2;
  const ring2Opacity = interpolate(
    frame,
    [ring2Delay * fps, (ring2Delay + 0.2) * fps, fps * 2.4, fps * 2.9],
    [0, 0.18, 0.08, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ring2Scale = interpolate(
    frame,
    [ring2Delay * fps, fps * 2.9],
    [0.45, 3.2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Underline accent draws with purpose - more dramatic
  const underlineWidth = interpolate(
    frame,
    [fps * 1.65, fps * 2.15],
    [0, 290],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const underlineOpacity = interpolate(
    frame,
    [fps * 1.65, fps * 2.0],
    [0, 0.65],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const underlineGlow = interpolate(
    frame,
    [fps * 1.9, fps * 2.4],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Tagline - the payoff context with decorative side lines
  const tagDelay = 2.1;
  const tagOpacity = interpolate(
    frame,
    [tagDelay * fps, (tagDelay + 0.38) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const tagY = interpolate(
    frame,
    [tagDelay * fps, (tagDelay + 0.48) * fps],
    [18, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Decorative side lines
  const sideLineWidth = interpolate(
    frame,
    [(tagDelay + 0.1) * fps, (tagDelay + 0.55) * fps],
    [0, 70],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Background glow intensifies with the reveal
  const bgIntensity = interpolate(
    frame,
    [fps * 0.45, fps * 2.0],
    [0.018, 0.055],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00ff88" intensity={bgIntensity} focusY={48} />

      {/* Opening light burst effects - draws attention from black */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        {/* Horizontal reveal line - cinematic wipe */}
        <div
          style={{
            width: revealLineWidth,
            height: 1,
            background: "linear-gradient(90deg, transparent 0%, rgba(0,255,136,0.55) 20%, rgba(255,255,255,0.88) 50%, rgba(0,255,136,0.55) 80%, transparent 100%)",
            position: "absolute",
            opacity: revealLineOpacity,
            boxShadow: "0 0 25px rgba(0, 255, 136, 0.35)",
          }}
        />
        {/* Secondary outer burst ring */}
        <div
          style={{
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,255,136,0.42) 0%, rgba(0,212,255,0.18) 40%, transparent 60%)",
            opacity: ring2BurstOpacity,
            transform: `scale(${ring2BurstScale})`,
            position: "absolute",
          }}
        />
        {/* Primary light burst */}
        <div
          style={{
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.92) 0%, rgba(0,255,136,0.6) 25%, rgba(0,255,170,0.22) 50%, transparent 70%)",
            opacity: burstOpacity,
            transform: `scale(${burstScale})`,
            position: "absolute",
          }}
        />
      </AbsoluteFill>

      {/* Concentric rings expanding from center - depth and sophistication */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        {/* Outer ring */}
        <div
          style={{
            position: "absolute",
            width: 260,
            height: 260,
            borderRadius: "50%",
            border: "1px solid rgba(0, 255, 136, 0.22)",
            transform: `scale(${ring2Scale})`,
            opacity: ring2Opacity,
          }}
        />
        {/* Inner ring */}
        <div
          style={{
            position: "absolute",
            width: 230,
            height: 230,
            borderRadius: "50%",
            border: "1px solid rgba(0, 255, 136, 0.28)",
            transform: `scale(${ring1Scale})`,
            opacity: ring1Opacity,
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          opacity: darknessFade,
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
            marginBottom: 36,
          }}
        >
          {/* Pulsing indicator with ring */}
          <div style={{ position: "relative" }}>
            {/* Ring pulse */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 8,
                height: 8,
                borderRadius: "50%",
                border: "1px solid #00ff88",
                transform: `translate(-50%, -50%) scale(${dotRingScale})`,
                opacity: dotRingOpacity,
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#00ff88",
                opacity: dotPulse,
                boxShadow: `0 0 ${12 + 10 * dotPulse}px rgba(0, 255, 136, ${0.5 + 0.4 * dotPulse})`,
              }}
            />
          </div>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#505050",
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
              filter: `drop-shadow(0 0 ${heroGlow}px rgba(0, 255, 136, 0.52))`,
            }}
          >
            <span
              style={{
                fontSize: 250,
                fontWeight: 900,
                color: "#ffffff",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -15,
                lineHeight: 0.85,
                textShadow: "0 12px 60px rgba(0, 0, 0, 0.55)",
              }}
            >
              4.5
            </span>
          </div>
          <div
            style={{
              opacity: xOpacity,
              transform: `scale(${xScale * xLandPulse})`,
              marginLeft: 6,
            }}
          >
            <span
              style={{
                fontSize: 120,
                fontWeight: 900,
                color: "#00ff88",
                fontFamily: "system-ui, -apple-system, sans-serif",
                textShadow: `0 0 ${heroGlow * 0.55}px rgba(0, 255, 136, 0.45)`,
              }}
            >
              x
            </span>
          </div>
        </div>

        {/* Underline - draws attention downward with glow */}
        <div
          style={{
            width: underlineWidth,
            height: 2,
            background: "linear-gradient(90deg, transparent 5%, rgba(0, 255, 136, 0.65) 50%, transparent 95%)",
            marginTop: 40,
            opacity: underlineOpacity,
            borderRadius: 1,
            boxShadow: `0 0 ${16 * underlineGlow}px rgba(0, 255, 136, ${0.22 * underlineGlow})`,
          }}
        />

        {/* Tagline - the promise with decorative lines */}
        <div
          style={{
            opacity: tagOpacity,
            transform: `translateY(${tagY}px)`,
            marginTop: 30,
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              width: sideLineWidth,
              height: 1,
              background: "linear-gradient(270deg, rgba(0, 255, 136, 0.3), transparent)",
            }}
          />
          <span
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: "#00ff88",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 2.5,
              opacity: 0.92,
            }}
          >
            Stack rewards. Maximize yield.
          </span>
          <div
            style={{
              width: sideLineWidth,
              height: 1,
              background: "linear-gradient(90deg, rgba(0, 255, 136, 0.3), transparent)",
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Multiplier layer component - premium glass cards with shimmer and satisfying reveals
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
  const delay = 0.35 + index * 0.22;

  const slideProgress = spring({
    frame: frame - delay * fps,
    fps,
    config: { damping: 190, stiffness: 75, mass: 1.15 },
  });

  const opacity = interpolate(
    frame,
    [delay * fps, (delay + 0.25) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Card slides up and in with slight rotation for depth
  const yOffset = interpolate(slideProgress, [0, 1], [40, 0]);
  const scaleIn = interpolate(slideProgress, [0, 1], [0.95, 1]);
  const cardRotate = interpolate(
    frame,
    [delay * fps, (delay + 0.5) * fps],
    [index % 2 === 0 ? -1.5 : 1.5, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Top accent bar draws elegantly
  const accentWidth = interpolate(
    frame,
    [(delay + 0.1) * fps, (delay + 0.55) * fps],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Left accent bar draws elegantly
  const accentHeight = interpolate(
    frame,
    [(delay + 0.15) * fps, (delay + 0.6) * fps],
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
    [(delay + 0.4) * fps, (delay + 1.0) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Shimmer effect - sweeps across the card after it settles
  const shimmerDelay = delay + 0.55;
  const shimmerProgress = interpolate(
    frame,
    [shimmerDelay * fps, (shimmerDelay + 0.75) * fps],
    [-100, 200],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) }
  );
  const shimmerOpacity = interpolate(
    frame,
    [shimmerDelay * fps, (shimmerDelay + 0.2) * fps, (shimmerDelay + 0.55) * fps, (shimmerDelay + 0.75) * fps],
    [0, 0.18, 0.18, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Multiplier number fades in slightly after card
  const numOpacity = interpolate(
    frame,
    [(delay + 0.18) * fps, (delay + 0.42) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Number glow intensifies and BURSTS when shimmer passes
  const numGlow = interpolate(
    frame,
    [(delay + 0.45) * fps, (shimmerDelay + 0.35) * fps, (shimmerDelay + 0.5) * fps, (shimmerDelay + 0.8) * fps],
    [0, 8, 18, 12],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Number scale pulse when shimmer passes
  const numScalePulse = interpolate(
    frame,
    [(shimmerDelay + 0.3) * fps, (shimmerDelay + 0.45) * fps, (shimmerDelay + 0.65) * fps],
    [1, 1.08, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Indicator dot pulse timing
  const dotPulse = frame > (delay + 0.8) * fps ? interpolate(
    (frame - (delay + 0.8) * fps) % (fps * 1.8),
    [0, fps * 0.4, fps * 1.8],
    [0.35, 0.9, 0.35],
    { easing: Easing.inOut(Easing.sin) }
  ) : interpolate(
    frame,
    [(delay + 0.3) * fps, (delay + 0.8) * fps],
    [0, 0.35],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        transform: `translateY(${yOffset}px) scale(${scaleIn}) rotate(${cardRotate}deg)`,
        opacity,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: 440,
          padding: "22px 30px",
          background: "linear-gradient(165deg, rgba(255,255,255,0.032) 0%, rgba(255,255,255,0.008) 100%)",
          borderRadius: 14,
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          boxShadow: `
            0 28px 60px rgba(0, 0, 0, 0.48),
            0 0 ${35 * glowIntensity}px rgba(${colorRgb}, ${0.08 * glowIntensity}),
            inset 0 1px 0 rgba(255, 255, 255, 0.03)
          `,
        }}
      >
        {/* Shimmer overlay - sweeps across on entrance */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: `${shimmerProgress}%`,
            width: "45%",
            height: "100%",
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)",
            opacity: shimmerOpacity,
            pointerEvents: "none",
          }}
        />

        {/* Top accent bar - full width draw */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${accentWidth}%`,
            height: 2,
            background: `linear-gradient(90deg, ${color} 0%, ${color}80 60%, transparent 100%)`,
            borderRadius: "2px 0 0 0",
            boxShadow: `0 0 ${10 * glowIntensity}px ${color}55`,
          }}
        />

        {/* Left accent bar - vertical */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 3,
            height: `${accentHeight}%`,
            background: `linear-gradient(180deg, ${color} 0%, ${color}50 70%, transparent 100%)`,
            borderRadius: "3px 0 0 0",
            boxShadow: `0 0 ${12 * glowIntensity}px ${color}50`,
          }}
        />

        {/* Label with animated indicator dot */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: color,
              opacity: 0.4 + 0.5 * dotPulse,
              boxShadow: `0 0 ${8 * dotPulse}px ${color}`,
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

        {/* Multiplier value with scale pulse */}
        <span
          style={{
            fontSize: 30,
            color: color,
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: 800,
            letterSpacing: -0.5,
            opacity: numOpacity,
            filter: `drop-shadow(0 0 ${numGlow}px ${color}65)`,
            transform: `scale(${numScalePulse})`,
          }}
        >
          {multiplier}
        </span>
      </div>
    </div>
  );
};

// Scene 2: The Stack - Layers build up with premium reveal timing and celebration
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

  // Header - appears first to set context with pulsing indicator
  const headerOpacity = interpolate(
    frame,
    [fps * 0.06, fps * 0.35],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const headerY = interpolate(
    frame,
    [fps * 0.06, fps * 0.42],
    [14, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Live indicator pulse
  const livePulse = frame > fps * 0.35 ? interpolate(
    (frame - fps * 0.35) % (fps * 1.8),
    [0, fps * 0.4, fps * 1.8],
    [0.5, 1, 0.5],
    { easing: Easing.inOut(Easing.sin) }
  ) : interpolate(frame, [fps * 0.1, fps * 0.35], [0, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Decorative lines draw symmetrically
  const lineWidth = interpolate(
    frame,
    [fps * 0.1, fps * 0.52],
    [0, 60],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // "Combined" result appears after all layers - THE payoff
  const combinedDelay = 1.65;
  const combinedProgress = spring({
    frame: frame - combinedDelay * fps,
    fps,
    config: { damping: 170, stiffness: 85, mass: 1.15 },
  });
  const combinedOpacity = interpolate(
    frame,
    [combinedDelay * fps, (combinedDelay + 0.25) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const combinedY = interpolate(combinedProgress, [0, 1], [25, 0]);
  const combinedScale = interpolate(combinedProgress, [0, 1], [0.93, 1]);

  // Combined number counts up satisfyingly
  const countStart = combinedDelay + 0.15;
  const displayMultiplier = interpolate(
    frame,
    [countStart * fps, (countStart + 0.55) * fps],
    [1.0, 4.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 4) }
  );

  // Combined "lands" with a satisfying scale pulse when counting finishes
  const landTime = (countStart + 0.55) * fps;
  const hasLanded = displayMultiplier >= 4.45;
  const combinedLandPulse = hasLanded ? interpolate(
    frame,
    [landTime - fps * 0.05, landTime + fps * 0.1, landTime + fps * 0.28],
    [1, 1.1, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 1;

  // Combined glow builds dramatically and BURSTS when landing
  const combinedGlow = hasLanded ? interpolate(
    frame,
    [(combinedDelay + 0.25) * fps, landTime, landTime + fps * 0.12, landTime + fps * 0.4],
    [0, 0.6, 1.3, 0.9],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : interpolate(
    frame,
    [(combinedDelay + 0.25) * fps, (combinedDelay + 0.65) * fps],
    [0, 0.6],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Divider line between layers and combined
  const dividerWidth = interpolate(
    frame,
    [(combinedDelay - 0.12) * fps, (combinedDelay + 0.05) * fps],
    [0, 200],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const dividerOpacity = interpolate(
    frame,
    [(combinedDelay - 0.12) * fps, (combinedDelay + 0.1) * fps],
    [0, 0.35],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Expanding celebration ring when combined lands
  const ringOpacity = hasLanded ? interpolate(
    frame,
    [landTime, landTime + fps * 0.12, landTime + fps * 0.5],
    [0.45, 0.2, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : 0;
  const ringScale = hasLanded ? interpolate(
    frame,
    [landTime, landTime + fps * 0.5],
    [0.8, 2.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 0.8;

  // Background glow intensifies as layers stack
  const bgIntensity = interpolate(
    frame,
    [fps * 0.4, fps * 2.2],
    [0.025, 0.048],
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
          gap: 20,
          padding: 50,
        }}
      >
        {/* Header with pulsing indicator and decorative lines */}
        <div
          style={{
            opacity: headerOpacity,
            transform: `translateY(${headerY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: lineWidth,
              height: 1,
              background: "linear-gradient(270deg, rgba(0, 255, 136, 0.22), transparent)",
            }}
          />
          <div style={{ position: "relative" }}>
            {/* Pulsing ring */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 6,
                height: 6,
                borderRadius: "50%",
                border: "1px solid #00ff88",
                transform: `translate(-50%, -50%) scale(${1 + livePulse * 0.7})`,
                opacity: 0.55 - livePulse * 0.45,
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#00ff88",
                boxShadow: `0 0 ${10 + 8 * livePulse}px rgba(0, 255, 136, ${0.4 + 0.35 * livePulse})`,
                opacity: livePulse,
              }}
            />
          </div>
          <span
            style={{
              fontSize: 11,
              color: "#505050",
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
              background: "linear-gradient(90deg, rgba(0, 255, 136, 0.22), transparent)",
            }}
          />
        </div>

        {/* Layers - stack with deliberate timing */}
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
              totalLayers={layers.length}
            />
          ))}
        </div>

        {/* Divider line */}
        <div
          style={{
            width: dividerWidth,
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.14), transparent)",
            opacity: dividerOpacity,
            marginTop: 8,
          }}
        />

        {/* Combined result - the payoff moment with celebration */}
        <div style={{ position: "relative" }}>
          {/* Celebration ring */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 150,
              height: 150,
              borderRadius: "50%",
              border: "2px solid rgba(0, 255, 136, 0.5)",
              transform: `translate(-50%, -50%) scale(${ringScale})`,
              opacity: ringOpacity,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              opacity: combinedOpacity,
              transform: `translateY(${combinedY}px) scale(${combinedScale * combinedLandPulse})`,
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "18px 38px",
              background: "linear-gradient(165deg, rgba(0, 255, 136, 0.08) 0%, rgba(0, 255, 136, 0.02) 100%)",
              borderRadius: 50,
              border: "1px solid rgba(0, 255, 136, 0.15)",
              boxShadow: `
                0 18px 50px rgba(0, 0, 0, 0.4),
                0 0 ${45 * combinedGlow}px rgba(0, 255, 136, ${0.14 * combinedGlow})
              `,
            }}
          >
            <span
              style={{
                fontSize: 13,
                color: "#00ff88",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: 3.5,
                textTransform: "uppercase",
                fontWeight: 600,
                opacity: 0.8,
              }}
            >
              Combined
            </span>
            <span
              style={{
                fontSize: 36,
                fontWeight: 900,
                color: "#00ff88",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -1.5,
                filter: `drop-shadow(0 0 ${16 * combinedGlow}px rgba(0, 255, 136, 0.55))`,
              }}
            >
              {displayMultiplier.toFixed(1)}x
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 3: The Comparison - Visual impact of multipliers with dramatic reveal and celebration
const ComparisonScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene fade
  const sceneFade = interpolate(frame, [0, fps * 0.12], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Header - appears first with weight and split animation for "Different"
  const headerProgress = spring({
    frame: frame - fps * 0.08,
    fps,
    config: { damping: 190, stiffness: 75, mass: 1.15 },
  });
  const headerOpacity = interpolate(frame, [fps * 0.08, fps * 0.38], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headerY = interpolate(headerProgress, [0, 1], [22, 0]);

  // "Different" word has its own entrance - slightly delayed for emphasis
  const differentDelay = 0.32;
  const differentOpacity = interpolate(
    frame,
    [differentDelay * fps, (differentDelay + 0.25) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const differentScale = interpolate(
    frame,
    [differentDelay * fps, (differentDelay + 0.2) * fps, (differentDelay + 0.35) * fps],
    [0.8, 1.08, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const differentGlow = interpolate(
    frame,
    [(differentDelay + 0.15) * fps, (differentDelay + 0.6) * fps],
    [0, 25],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // "Base" side - fades in with subtle entrance
  const baseDelay = 0.45;
  const baseProgress = spring({
    frame: frame - baseDelay * fps,
    fps,
    config: { damping: 195, stiffness: 90, mass: 1.1 },
  });
  const baseOpacity = interpolate(
    frame,
    [baseDelay * fps, (baseDelay + 0.28) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const baseY = interpolate(baseProgress, [0, 1], [32, 0]);
  const baseScale = interpolate(baseProgress, [0, 1], [0.96, 1]);

  // Arrow/flow indicator - draws after base with energy particles
  const flowDelay = 0.85;
  const flowOpacity = interpolate(
    frame,
    [flowDelay * fps, (flowDelay + 0.2) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const flowWidth = interpolate(
    frame,
    [flowDelay * fps, (flowDelay + 0.45) * fps],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Flow glow pulses after drawing - more dramatic
  const flowGlow = frame > fps * 1.25 ? interpolate(
    (frame - fps * 1.25) % (fps * 1.5),
    [0, fps * 0.35, fps * 1.5],
    [0.5, 1, 0.5],
    { easing: Easing.inOut(Easing.sin) }
  ) : interpolate(
    frame,
    [(flowDelay + 0.3) * fps, fps * 1.25],
    [0.3, 0.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Energy particles moving along the flow line
  const particle1X = frame > flowDelay * fps ? interpolate(
    (frame - flowDelay * fps) % (fps * 0.6),
    [0, fps * 0.6],
    [0, 110],
    { easing: Easing.out(Easing.quad) }
  ) : 0;
  const particle1Opacity = frame > flowDelay * fps && flowWidth > 60 ? interpolate(
    (frame - flowDelay * fps) % (fps * 0.6),
    [0, fps * 0.15, fps * 0.45, fps * 0.6],
    [0, 0.9, 0.7, 0],
    { extrapolateRight: "clamp" }
  ) : 0;

  const particle2X = frame > (flowDelay + 0.3) * fps ? interpolate(
    (frame - (flowDelay + 0.3) * fps) % (fps * 0.6),
    [0, fps * 0.6],
    [0, 110],
    { easing: Easing.out(Easing.quad) }
  ) : 0;
  const particle2Opacity = frame > (flowDelay + 0.3) * fps && flowWidth > 80 ? interpolate(
    (frame - (flowDelay + 0.3) * fps) % (fps * 0.6),
    [0, fps * 0.15, fps * 0.45, fps * 0.6],
    [0, 0.7, 0.5, 0],
    { extrapolateRight: "clamp" }
  ) : 0;

  // "Boosted" side - THE payoff moment with dramatic entrance
  const boostedDelay = 1.15;
  const boostedProgress = spring({
    frame: frame - boostedDelay * fps,
    fps,
    config: { damping: 175, stiffness: 70, mass: 1.25 },
  });
  const boostedOpacity = interpolate(
    frame,
    [boostedDelay * fps, (boostedDelay + 0.28) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const boostedScale = interpolate(boostedProgress, [0, 1], [0.9, 1]);
  const boostedY = interpolate(boostedProgress, [0, 1], [30, 0]);

  // Count up the "boosted" value - $100 × 4.5 = $450 with satisfying quintic ease-out
  const baseValue = 100;
  const multipliedValue = 450;
  const countStart = boostedDelay + 0.18;
  const displayBoostedValue = interpolate(
    frame,
    [countStart * fps, (countStart + 0.7) * fps],
    [baseValue, multipliedValue],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: (t) => 1 - Math.pow(1 - t, 5),
    }
  );

  // Has the number "landed"?
  const landTime = (countStart + 0.7) * fps;
  const hasLanded = displayBoostedValue >= multipliedValue - 5;

  // Number "lands" with satisfying scale pulse
  const numLandPulse = hasLanded ? interpolate(
    frame,
    [landTime - fps * 0.05, landTime + fps * 0.12, landTime + fps * 0.3],
    [1, 1.08, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 1;

  // Number glow intensifies as it climbs then BURSTS when landing
  const numGlow = hasLanded ? interpolate(
    frame,
    [(countStart + 0.4) * fps, landTime, landTime + fps * 0.15, landTime + fps * 0.45],
    [10, 18, 35, 22],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : interpolate(
    frame,
    [(countStart + 0.2) * fps, (countStart + 0.65) * fps],
    [0, 18],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Glow builds majestically on the boosted card then bursts
  const boostedGlow = hasLanded ? interpolate(
    frame,
    [(boostedDelay + 0.3) * fps, landTime, landTime + fps * 0.15, landTime + fps * 0.5],
    [0, 0.7, 1.2, 0.85],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : interpolate(
    frame,
    [(boostedDelay + 0.3) * fps, (boostedDelay + 0.9) * fps],
    [0, 0.7],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Shimmer effect on boosted card
  const shimmerDelay = boostedDelay + 0.5;
  const shimmerProgress = interpolate(
    frame,
    [shimmerDelay * fps, (shimmerDelay + 0.85) * fps],
    [-100, 200],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) }
  );
  const shimmerOpacity = interpolate(
    frame,
    [shimmerDelay * fps, (shimmerDelay + 0.2) * fps, (shimmerDelay + 0.65) * fps, (shimmerDelay + 0.85) * fps],
    [0, 0.2, 0.2, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Badge pops in after card with bounce
  const badgeDelay = 1.6;
  const badgeProgress = spring({
    frame: frame - badgeDelay * fps,
    fps,
    config: { damping: 140, stiffness: 200, mass: 0.9 },
  });
  const badgeOpacity = interpolate(
    frame,
    [badgeDelay * fps, (badgeDelay + 0.2) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const badgeScale = interpolate(badgeProgress, [0, 1], [0.55, 1]);

  // Badge glow pulses after landing
  const badgeGlow = frame > (badgeDelay + 0.4) * fps ? interpolate(
    (frame - (badgeDelay + 0.4) * fps) % (fps * 2.0),
    [0, fps * 1.0, fps * 2.0],
    [0.9, 1, 0.9],
    { easing: Easing.inOut(Easing.sin) }
  ) : 1;

  // Celebration ring when number lands
  const ringOpacity = hasLanded ? interpolate(
    frame,
    [landTime, landTime + fps * 0.12, landTime + fps * 0.55],
    [0.5, 0.22, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : 0;
  const ringScale = hasLanded ? interpolate(
    frame,
    [landTime, landTime + fps * 0.55],
    [0.7, 2.8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 0.7;

  // Background glow intensifies with the reveal
  const bgIntensity = interpolate(
    frame,
    [fps * 0.6, fps * 2.2],
    [0.022, 0.052],
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
          gap: 58,
          padding: 65,
        }}
      >
        {/* Header - sets the context with split "Different" animation */}
        <div
          style={{
            opacity: headerOpacity,
            transform: `translateY(${headerY}px)`,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: 44,
              fontWeight: 900,
              color: "#ffffff",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: -2,
              textShadow: "0 8px 40px rgba(0, 0, 0, 0.45)",
            }}
          >
            Same distribution.{" "}
            <span
              style={{
                color: "#00ff88",
                opacity: differentOpacity,
                transform: `scale(${differentScale})`,
                display: "inline-block",
                filter: `drop-shadow(0 0 ${differentGlow}px rgba(0, 255, 136, 0.5))`,
              }}
            >
              Different
            </span>{" "}
            rewards.
          </span>
        </div>

        {/* Comparison row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 48,
          }}
        >
          {/* BASE card - understated */}
          <div
            style={{
              opacity: baseOpacity,
              transform: `translateY(${baseY}px) scale(${baseScale})`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
              padding: "40px 60px",
              background: "linear-gradient(165deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.006) 100%)",
              borderRadius: 16,
              border: "1px solid rgba(255, 255, 255, 0.045)",
              boxShadow: "0 25px 55px rgba(0, 0, 0, 0.4)",
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: "#505050",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: 4.5,
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Base Reward
            </span>
            <span
              style={{
                fontSize: 68,
                fontWeight: 900,
                color: "#4a4a4a",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -3.5,
              }}
            >
              $100
            </span>
          </div>

          {/* Flow indicator - animated arrow with energy particles */}
          <div
            style={{
              opacity: flowOpacity,
              display: "flex",
              alignItems: "center",
              gap: 6,
              position: "relative",
            }}
          >
            {/* Energy particles */}
            <div
              style={{
                position: "absolute",
                left: particle1X,
                top: "50%",
                transform: "translateY(-50%)",
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#00ff88",
                opacity: particle1Opacity,
                boxShadow: "0 0 8px rgba(0, 255, 136, 0.8)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: particle2X,
                top: "50%",
                transform: "translateY(-50%)",
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "#00d4ff",
                opacity: particle2Opacity,
                boxShadow: "0 0 6px rgba(0, 212, 255, 0.7)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                width: flowWidth,
                height: 2,
                background: `linear-gradient(90deg, #2a2a2a 0%, rgba(0, 255, 136, ${0.5 + 0.5 * flowGlow}) 100%)`,
                borderRadius: 1,
                boxShadow: `0 0 ${12 * flowGlow}px rgba(0, 255, 136, ${0.35 * flowGlow})`,
              }}
            />
            <div
              style={{
                width: 0,
                height: 0,
                borderTop: "8px solid transparent",
                borderBottom: "8px solid transparent",
                borderLeft: `14px solid rgba(0, 255, 136, ${flowWidth > 75 ? 0.85 + 0.15 * flowGlow : 0})`,
                filter: `drop-shadow(0 0 ${8 * flowGlow}px rgba(0, 255, 136, 0.45))`,
              }}
            />
          </div>

          {/* BOOSTED card - the hero with celebration */}
          <div style={{ position: "relative" }}>
            {/* Celebration ring */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 180,
                height: 180,
                borderRadius: "50%",
                border: "2px solid rgba(0, 255, 136, 0.5)",
                transform: `translate(-50%, -50%) scale(${ringScale})`,
                opacity: ringOpacity,
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                opacity: boostedOpacity,
                transform: `translateY(${boostedY}px) scale(${boostedScale})`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 20,
                padding: "40px 60px",
                background: "linear-gradient(165deg, rgba(0, 255, 136, 0.08) 0%, rgba(0, 255, 136, 0.018) 100%)",
                borderRadius: 16,
                border: "1px solid rgba(0, 255, 136, 0.16)",
                position: "relative",
                overflow: "hidden",
                boxShadow: `
                  0 28px 65px rgba(0, 0, 0, 0.45),
                  0 0 ${55 * boostedGlow}px rgba(0, 255, 136, ${0.12 * boostedGlow}),
                  inset 0 1px 0 rgba(255, 255, 255, 0.035)
                `,
              }}
            >
              {/* Shimmer overlay */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: `${shimmerProgress}%`,
                  width: "45%",
                  height: "100%",
                  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)",
                  opacity: shimmerOpacity,
                  pointerEvents: "none",
                }}
              />

              <span
                style={{
                  fontSize: 11,
                  color: "#00ff88",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  letterSpacing: 4.5,
                  textTransform: "uppercase",
                  fontWeight: 600,
                  opacity: 0.88,
                }}
              >
                With 4.5x Multiplier
              </span>
              <span
                style={{
                  fontSize: 68,
                  fontWeight: 900,
                  color: "#00ff88",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  letterSpacing: -3.5,
                  filter: `drop-shadow(0 0 ${numGlow}px rgba(0, 255, 136, 0.6))`,
                  transform: `scale(${numLandPulse})`,
                }}
              >
                ${Math.round(displayBoostedValue)}
              </span>

              {/* Multiplier badge - floating accent with glow pulse */}
              <div
                style={{
                  position: "absolute",
                  top: -20,
                  right: -20,
                  opacity: badgeOpacity,
                  transform: `scale(${badgeScale})`,
                }}
              >
                <div
                  style={{
                    padding: "12px 18px",
                    background: "linear-gradient(140deg, #00ff88 0%, #00ffaa 100%)",
                    borderRadius: 24,
                    boxShadow: `
                      0 8px 25px rgba(0, 255, 136, ${0.45 + 0.15 * badgeGlow}),
                      0 0 ${20 * badgeGlow}px rgba(0, 255, 136, ${0.15 * badgeGlow}),
                      inset 0 2px 0 rgba(255, 255, 255, 0.22)
                    `,
                  }}
                >
                  <span
                    style={{
                      fontSize: 20,
                      fontWeight: 900,
                      color: "#020202",
                      fontFamily: "system-ui, -apple-system, sans-serif",
                      letterSpacing: -0.5,
                      textShadow: "0 1px 0 rgba(255, 255, 255, 0.15)",
                    }}
                  >
                    4.5x
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 4: CTA - Commanding close with callback to the 4.5x promise and premium polish
const CTAScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo entrance - hero element with powerful presence
  const logoProgress = spring({
    frame,
    fps,
    config: { damping: 175, stiffness: 55, mass: 1.25 },
  });
  const logoOpacity = interpolate(frame, [0, fps * 0.28], [0, 1], {
    extrapolateRight: "clamp",
  });
  const logoScale = interpolate(logoProgress, [0, 1], [0.85, 1]);

  // Logo glow builds confidently then settles
  const logoGlow = interpolate(
    frame,
    [fps * 0.18, fps * 0.65, fps * 0.95],
    [0, 58, 48],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Dual expanding rings - creates depth and sophistication
  const ring1Opacity = interpolate(
    frame,
    [fps * 0.08, fps * 0.26, fps * 0.95, fps * 1.35],
    [0, 0.26, 0.12, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ring1Scale = interpolate(
    frame,
    [fps * 0.08, fps * 1.35],
    [0.6, 2.3],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  const ring2Opacity = interpolate(
    frame,
    [fps * 0.15, fps * 0.35, fps * 1.15, fps * 1.55],
    [0, 0.18, 0.08, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ring2Scale = interpolate(
    frame,
    [fps * 0.15, fps * 1.55],
    [0.5, 2.8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // "4.5x" hero - callback to opening, creating narrative closure with split animation
  const heroDelay = 0.32;
  const heroProgress = spring({
    frame: frame - heroDelay * fps,
    fps,
    config: { damping: 195, stiffness: 85, mass: 1.1 },
  });
  const heroOpacity = interpolate(
    frame,
    [heroDelay * fps, (heroDelay + 0.28) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const heroY = interpolate(heroProgress, [0, 1], [24, 0]);
  const heroScale = interpolate(heroProgress, [0, 1], [0.94, 1]);

  // "x" animates separately - slightly delayed
  const xDelay = 0.48;
  const xProgress = spring({
    frame: frame - xDelay * fps,
    fps,
    config: { damping: 160, stiffness: 140 },
  });
  const xOpacity = interpolate(
    frame,
    [xDelay * fps, (xDelay + 0.22) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const xScale = interpolate(xProgress, [0, 1], [0.7, 1]);

  // Hero glow builds with dramatic peak
  const heroGlow = interpolate(
    frame,
    [fps * 0.55, fps * 1.0, fps * 1.4],
    [0, 45, 35],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Tagline - the value prop summary
  const tagDelay = 0.6;
  const tagOpacity = interpolate(
    frame,
    [tagDelay * fps, (tagDelay + 0.32) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const tagY = interpolate(
    frame,
    [tagDelay * fps, (tagDelay + 0.42) * fps],
    [16, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // CTA button - THE action moment with commanding presence
  const ctaDelay = 0.9;
  const ctaProgress = spring({
    frame: frame - ctaDelay * fps,
    fps,
    config: { damping: 175, stiffness: 78, mass: 1.15 },
  });
  const ctaOpacity = interpolate(
    frame,
    [ctaDelay * fps, (ctaDelay + 0.25) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ctaY = interpolate(ctaProgress, [0, 1], [28, 0]);
  const ctaScale = interpolate(ctaProgress, [0, 1], [0.93, 1]);

  // CTA glow builds dramatically then pulses with refined breathing
  const ctaGlow = interpolate(
    frame,
    [(ctaDelay + 0.22) * fps, fps * 1.6, fps * 2.0],
    [0, 1.15, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const ctaPulse = frame > fps * 1.7 ? interpolate(
    (frame - fps * 1.7) % (fps * 2.4),
    [0, fps * 1.2, fps * 2.4],
    [0.92, 1, 0.92],
    { easing: Easing.inOut(Easing.sin) }
  ) : 1;

  // Inner shine animation on CTA
  const innerPulse = frame > fps * 1.6 ? interpolate(
    (frame - fps * 1.6) % (fps * 2.2),
    [0, fps * 1.1, fps * 2.2],
    [0.18, 0.35, 0.18],
    { easing: Easing.inOut(Easing.sin) }
  ) : 0.18;

  // Bottom text - final beat with decorative lines
  const bottomOpacity = interpolate(
    frame,
    [fps * 1.35, fps * 1.7],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const bottomY = interpolate(
    frame,
    [fps * 1.35, fps * 1.75],
    [12, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Decorative lines - draw outward
  const lineWidth = interpolate(
    frame,
    [fps * 1.5, fps * 1.95],
    [0, 65],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Background glow intensifies throughout
  const bgIntensity = interpolate(
    frame,
    [0, fps * 1.4],
    [0.028, 0.06],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00ff88" intensity={bgIntensity} focusY={50} />

      {/* Ambient glow behind CTA - intensifies with button */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 52% 42% at 50% 55%, rgba(0, 255, 136, ${0.045 * ctaGlow}) 0%, transparent 60%)`,
        }}
      />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 26,
          flexDirection: "column",
        }}
      >
        {/* Logo with dual expanding rings */}
        <div style={{ position: "relative" }}>
          {/* Outer ring */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 130,
              height: 130,
              borderRadius: "50%",
              border: "1px solid rgba(0, 255, 136, 0.2)",
              transform: `translate(-50%, -50%) scale(${ring2Scale})`,
              opacity: ring2Opacity,
            }}
          />
          {/* Inner ring */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 118,
              height: 118,
              borderRadius: "50%",
              border: "1px solid rgba(0, 255, 136, 0.3)",
              transform: `translate(-50%, -50%) scale(${ring1Scale})`,
              opacity: ring1Opacity,
            }}
          />
          <div
            style={{
              transform: `scale(${logoScale})`,
              opacity: logoOpacity,
              filter: `drop-shadow(0 0 ${logoGlow}px rgba(0, 255, 136, 0.52))`,
            }}
          >
            <FedLogo size={95} glow={false} />
          </div>
        </div>

        {/* Hero 4.5x - callback with split animation */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
          }}
        >
          <div
            style={{
              opacity: heroOpacity,
              transform: `translateY(${heroY}px) scale(${heroScale})`,
              filter: `drop-shadow(0 0 ${heroGlow}px rgba(0, 255, 136, 0.45))`,
            }}
          >
            <span
              style={{
                fontSize: 85,
                fontWeight: 900,
                color: "#ffffff",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -5,
                textShadow: "0 8px 45px rgba(0, 0, 0, 0.45)",
              }}
            >
              4.5
            </span>
          </div>
          <div
            style={{
              opacity: xOpacity,
              transform: `scale(${xScale})`,
              marginLeft: 4,
            }}
          >
            <span
              style={{
                fontSize: 52,
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

        {/* Tagline */}
        <div
          style={{
            opacity: tagOpacity,
            transform: `translateY(${tagY}px)`,
          }}
        >
          <span
            style={{
              fontSize: 25,
              color: "#505050",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 400,
              letterSpacing: 0.5,
            }}
          >
            Maximum rewards. Minimum effort.
          </span>
        </div>

        {/* CTA Button - commanding presence with premium styling */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px) scale(${ctaScale})`,
            marginTop: 12,
          }}
        >
          <div
            style={{
              padding: "19px 60px",
              background: "linear-gradient(145deg, #00ff88 0%, #00ffcc 45%, #00ff88 100%)",
              borderRadius: 50,
              position: "relative",
              overflow: "hidden",
              boxShadow: `
                0 9px 35px rgba(0, 255, 136, ${(0.28 + 0.18 * ctaGlow) * ctaPulse}),
                0 0 ${48 * ctaGlow * ctaPulse}px rgba(0, 255, 136, ${0.16 * ctaGlow * ctaPulse}),
                inset 0 2px 0 rgba(255, 255, 255, ${innerPulse}),
                inset 0 -2px 0 rgba(0, 0, 0, 0.08)
              `,
            }}
          >
            {/* Inner shine animation */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "50%",
                background: `linear-gradient(180deg, rgba(255,255,255,${innerPulse * 0.85}) 0%, transparent 100%)`,
                borderRadius: "50px 50px 0 0",
                pointerEvents: "none",
              }}
            />
            <span
              style={{
                fontSize: 36,
                fontWeight: 900,
                color: "#020202",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -0.5,
                textShadow: "0 1px 0 rgba(255, 255, 255, 0.2)",
                position: "relative",
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
            marginTop: 16,
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <div
            style={{
              width: lineWidth,
              height: 1,
              background: "linear-gradient(270deg, rgba(0, 255, 136, 0.28), transparent)",
            }}
          />
          <span
            style={{
              fontSize: 11,
              color: "#3a3a3a",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 4.5,
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
              background: "linear-gradient(90deg, rgba(0, 255, 136, 0.28), transparent)",
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
