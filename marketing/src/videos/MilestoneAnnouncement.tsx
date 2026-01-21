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

export type MilestoneAnnouncementProps = {
  milestone: string;
  target: string;
  current: string;
  progress: number;
  celebration?: boolean;
  nextMilestone?: string;
};

// Premium cinematic background - depth without distraction
const CinematicBackground: React.FC<{
  accentColor?: string;
  intensity?: number;
  focusY?: number;
}> = ({ accentColor = "#00ff88", intensity = 0.03, focusY = 50 }) => {
  const frame = useCurrentFrame();

  // Extremely slow drift - creates subtle life
  const drift = interpolate(frame, [0, 600], [0, 2], {
    extrapolateRight: "clamp",
  });

  // Convert hex to rgba for gradient
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

      {/* Primary glow - centered, focused */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 65% 45% at 50% ${focusY + drift}%, ${hexToRgba(accentColor, intensity)} 0%, transparent 55%)`,
        }}
      />

      {/* Secondary ambient - subtle top wash */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 100% 25% at 50% 0%, ${hexToRgba(accentColor, intensity * 0.25)} 0%, transparent 50%)`,
        }}
      />

      {/* Cinematic vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 75% 65% at 50% 50%, transparent 20%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// Scene 1: The Reveal - Clean, Apple-style number reveal with gravitas
const RevealScene: React.FC<{ milestone: string }> = ({ milestone }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Opening bloom - draws the eye subtly
  const bloomOpacity = interpolate(
    frame,
    [0, fps * 0.08, fps * 0.25, fps * 0.55],
    [0, 0.15, 0.08, 0],
    { extrapolateRight: "clamp" }
  );
  const bloomScale = interpolate(
    frame,
    [0, fps * 0.4],
    [0.5, 2.0],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Horizontal accent lines - expand from center, creates stage
  const horizonLineWidth = interpolate(
    frame,
    [fps * 0.12, fps * 0.65],
    [0, 280],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const horizonLineOpacity = interpolate(
    frame,
    [fps * 0.12, fps * 0.4, fps * 2.6, fps * 3.0],
    [0, 0.2, 0.2, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Pre-title badge - "Milestone Achieved" sets context
  const badgeOpacity = interpolate(
    frame,
    [fps * 0.35, fps * 0.65],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const badgeY = interpolate(
    frame,
    [fps * 0.35, fps * 0.75],
    [12, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Indicator dot pulse - subtle life
  const dotPulse = frame > fps * 0.75 ? interpolate(
    (frame - fps * 0.8) % (fps * 1.6),
    [0, fps * 0.4, fps * 1.6],
    [0.5, 0.9, 0.5],
    { extrapolateLeft: "clamp" }
  ) : interpolate(frame, [fps * 0.35, fps * 0.65], [0, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Main milestone "QE2" - THE moment, clean single reveal
  const heroDelay = 0.75;
  const heroProgress = spring({
    frame: frame - heroDelay * fps,
    fps,
    config: { damping: 200, stiffness: 65, mass: 1.3 },
  });
  const heroOpacity = interpolate(
    frame,
    [heroDelay * fps, (heroDelay + 0.2) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const heroY = interpolate(heroProgress, [0, 1], [35, 0]);
  const heroScale = interpolate(heroProgress, [0, 1], [0.94, 1]);

  // Glow builds majestically after text appears
  const glowIntensity = interpolate(
    frame,
    [fps * 1.1, fps * 2.2],
    [0, 65],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Background glow intensifies with reveal
  const bgIntensity = interpolate(
    frame,
    [fps * 0.7, fps * 1.8],
    [0.03, 0.055],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Underline accent - draws after text settles
  const underlineWidth = interpolate(
    frame,
    [fps * 1.6, fps * 2.2],
    [0, 160],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const underlineOpacity = interpolate(
    frame,
    [fps * 1.6, fps * 1.9],
    [0, 0.55],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Tagline - final beat of the scene
  const taglineOpacity = interpolate(
    frame,
    [fps * 2.1, fps * 2.5],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const taglineY = interpolate(
    frame,
    [fps * 2.1, fps * 2.55],
    [12, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00ff88" intensity={bgIntensity} focusY={48} />

      {/* Opening bloom - subtle attention draw */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,255,136,0.35) 0%, transparent 55%)",
            opacity: bloomOpacity,
            transform: `scale(${bloomScale})`,
            position: "absolute",
          }}
        />
        {/* Horizontal accent lines - create stage */}
        <div
          style={{
            width: horizonLineWidth,
            height: 1,
            background: "linear-gradient(90deg, transparent 0%, rgba(0,255,136,0.35) 30%, rgba(0,255,136,0.45) 50%, rgba(0,255,136,0.35) 70%, transparent 100%)",
            position: "absolute",
            opacity: horizonLineOpacity,
            boxShadow: "0 0 12px rgba(0,255,136,0.15)",
          }}
        />
      </AbsoluteFill>

      {/* Main content container */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {/* Pre-title badge */}
        <div
          style={{
            opacity: badgeOpacity,
            transform: `translateY(${badgeY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#00ff88",
              boxShadow: "0 0 12px rgba(0, 255, 136, 0.6)",
              opacity: dotPulse,
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
            Milestone Achieved
          </span>
        </div>

        {/* Hero milestone text - clean, single reveal with glow */}
        <div
          style={{
            opacity: heroOpacity,
            transform: `translateY(${heroY}px) scale(${heroScale})`,
            filter: `drop-shadow(0 0 ${glowIntensity}px rgba(0, 255, 136, 0.5))`,
          }}
        >
          <span
            style={{
              fontSize: 200,
              fontWeight: 900,
              color: "#ffffff",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: -8,
              lineHeight: 0.95,
              textShadow: "0 8px 50px rgba(0, 0, 0, 0.5)",
            }}
          >
            {milestone}
          </span>
        </div>

        {/* Underline accent */}
        <div
          style={{
            width: underlineWidth,
            height: 2,
            background: "linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.5), transparent)",
            marginTop: 36,
            opacity: underlineOpacity,
            borderRadius: 1,
          }}
        />

        {/* Tagline */}
        <div
          style={{
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
            marginTop: 22,
          }}
        >
          <span
            style={{
              fontSize: 18,
              fontWeight: 500,
              color: "#00ff88",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 1.5,
              opacity: 0.85,
            }}
          >
            Distribution target reached
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 2: Progress Dashboard - data visualization with satisfying animations
const ProgressScene: React.FC<{
  target: string;
  current: string;
  progress: number;
}> = ({ target, current, progress }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene entrance
  const sceneOpacity = interpolate(
    frame,
    [0, fps * 0.12],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  // QE2 label enters first
  const labelOpacity = interpolate(
    frame,
    [fps * 0.08, fps * 0.32],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const labelY = interpolate(
    frame,
    [fps * 0.08, fps * 0.38],
    [10, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Hero percentage - dramatic entrance
  const percentDelay = 0.18;
  const percentScale = spring({
    frame: frame - percentDelay * fps,
    fps,
    config: { damping: 200, stiffness: 80, mass: 1.1 },
  });
  const percentOpacity = interpolate(
    frame,
    [percentDelay * fps, (percentDelay + 0.18) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Percentage counts up with luxurious quintic ease-out
  const displayPercent = interpolate(
    frame,
    [fps * 0.4, fps * 2.2],
    [0, progress],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: (t) => 1 - Math.pow(1 - t, 5),
    }
  );

  // Progress bar fill with smooth easing
  const barProgress = interpolate(
    frame,
    [fps * 0.5, fps * 2.4],
    [0, progress],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: (t) => 1 - Math.pow(1 - t, 4),
    }
  );

  // Bar glow intensity builds
  const barGlow = interpolate(
    frame,
    [fps * 0.8, fps * 2.0],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Current amount counter
  const currentValue = parseFloat(current.replace(/[$,]/g, "")) || 0;
  const displayCurrent = interpolate(
    frame,
    [fps * 0.55, fps * 2.2],
    [0, currentValue],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: (t) => 1 - Math.pow(1 - t, 5),
    }
  );

  // Stats row stagger
  const stat1Opacity = interpolate(
    frame,
    [fps * 0.65, fps * 0.95],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const stat1Y = interpolate(
    frame,
    [fps * 0.65, fps * 1.0],
    [14, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  const stat2Opacity = interpolate(
    frame,
    [fps * 0.8, fps * 1.1],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const stat2Y = interpolate(
    frame,
    [fps * 0.8, fps * 1.15],
    [14, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Background glow intensifies as numbers count up
  const bgIntensity = interpolate(
    frame,
    [fps * 0.5, fps * 2.0],
    [0.03, 0.05],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Percentage text glow
  const percentGlow = interpolate(
    frame,
    [fps * 1.5, fps * 2.5],
    [0, 25],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity }}>
      <CinematicBackground accentColor="#00ff88" intensity={bgIntensity} focusY={42} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 70,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 820,
          }}
        >
          {/* QE2 Progress label */}
          <div
            style={{
              opacity: labelOpacity,
              transform: `translateY(${labelY}px)`,
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div style={{ width: 32, height: 1, background: "linear-gradient(270deg, #2a2a2a, transparent)" }} />
            <span
              style={{
                fontSize: 12,
                color: "#4a4a4a",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: 4,
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              QE2 Progress
            </span>
            <div style={{ width: 32, height: 1, background: "linear-gradient(90deg, #2a2a2a, transparent)" }} />
          </div>

          {/* Hero percentage */}
          <div
            style={{
              transform: `scale(${percentScale})`,
              opacity: percentOpacity,
              marginBottom: 50,
              filter: `drop-shadow(0 0 ${percentGlow}px rgba(0, 255, 136, 0.25))`,
            }}
          >
            <span
              style={{
                fontSize: 145,
                fontWeight: 900,
                color: "#ffffff",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -7,
                lineHeight: 1,
              }}
            >
              {Math.round(displayPercent)}
            </span>
            <span
              style={{
                fontSize: 72,
                fontWeight: 900,
                color: "#00ff88",
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              %
            </span>
          </div>

          {/* Progress bar - clean and satisfying */}
          <div
            style={{
              width: "100%",
              marginBottom: 55,
            }}
          >
            {/* Track */}
            <div
              style={{
                width: "100%",
                height: 10,
                background: "rgba(255, 255, 255, 0.025)",
                borderRadius: 5,
                overflow: "hidden",
                position: "relative",
                border: "1px solid rgba(255, 255, 255, 0.02)",
              }}
            >
              {/* Fill - smooth gradient */}
              <div
                style={{
                  width: `${barProgress}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, rgba(0,255,136,0.35) 0%, rgba(0,255,136,0.65) 50%, #00ff88 90%, #00ffaa 100%)",
                  borderRadius: 5,
                  boxShadow: `0 0 ${22 * barGlow}px rgba(0, 255, 136, 0.4)`,
                  position: "relative",
                }}
              >
                {/* Leading edge glow */}
                {barProgress > 5 && (
                  <div
                    style={{
                      position: "absolute",
                      right: -2,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: "radial-gradient(circle, rgba(0,255,200,0.95) 0%, rgba(0,255,136,0.5) 50%, transparent 70%)",
                      boxShadow: `0 0 ${12 + 10 * barGlow}px rgba(0, 255, 136, 0.7)`,
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              padding: "0 25px",
            }}
          >
            <div
              style={{
                opacity: stat1Opacity,
                transform: `translateY(${stat1Y}px)`,
                textAlign: "left",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "#3a3a3a",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  marginBottom: 12,
                  fontWeight: 500,
                }}
              >
                Distributed
              </div>
              <div
                style={{
                  fontSize: 44,
                  fontWeight: 900,
                  color: "#00ff88",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  letterSpacing: -1.5,
                }}
              >
                ${Math.floor(displayCurrent).toLocaleString()}
              </div>
            </div>

            <div
              style={{
                opacity: stat2Opacity,
                transform: `translateY(${stat2Y}px)`,
                textAlign: "right",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "#3a3a3a",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  marginBottom: 12,
                  fontWeight: 500,
                }}
              >
                Target
              </div>
              <div
                style={{
                  fontSize: 44,
                  fontWeight: 900,
                  color: "#505050",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  letterSpacing: -1.5,
                }}
              >
                {target}
              </div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 3: CTA - Commanding, memorable close
const CTAScene: React.FC<{ nextMilestone?: string }> = ({ nextMilestone }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo entrance - hero element
  const logoProgress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 90, mass: 1 },
  });
  const logoOpacity = interpolate(
    frame,
    [0, fps * 0.2],
    [0, 1],
    { extrapolateRight: "clamp" }
  );
  const logoScale = interpolate(logoProgress, [0, 1], [0.92, 1]);

  // Logo glow builds confidently
  const logoGlow = interpolate(
    frame,
    [fps * 0.15, fps * 0.7],
    [0, 35],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Expanding ring - adds presence
  const ringOpacity = interpolate(
    frame,
    [fps * 0.12, fps * 0.28, fps * 0.9, fps * 1.3],
    [0, 0.22, 0.12, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ringScale = interpolate(
    frame,
    [fps * 0.12, fps * 1.3],
    [0.65, 2.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Next milestone section
  const nextOpacity = interpolate(
    frame,
    [fps * 0.35, fps * 0.65],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const nextY = interpolate(
    frame,
    [fps * 0.35, fps * 0.75],
    [14, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Divider line draws
  const lineWidth = interpolate(
    frame,
    [fps * 0.75, fps * 1.15],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // CTA button - the action moment
  const ctaDelay = 0.9;
  const ctaProgress = spring({
    frame: frame - ctaDelay * fps,
    fps,
    config: { damping: 180, stiffness: 85 },
  });
  const ctaOpacity = interpolate(
    frame,
    [ctaDelay * fps, (ctaDelay + 0.2) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ctaY = interpolate(ctaProgress, [0, 1], [20, 0]);
  const ctaScale = interpolate(ctaProgress, [0, 1], [0.96, 1]);

  // CTA glow builds and pulses subtly
  const ctaGlow = interpolate(
    frame,
    [(ctaDelay + 0.12) * fps, fps * 1.9],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const ctaPulse = frame > fps * 1.5 ? interpolate(
    (frame - fps * 1.5) % (fps * 2.2),
    [0, fps * 1.1, fps * 2.2],
    [0.9, 1, 0.9]
  ) : 1;

  // Subtext last
  const subOpacity = interpolate(
    frame,
    [fps * 1.35, fps * 1.7],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const subY = interpolate(
    frame,
    [fps * 1.35, fps * 1.75],
    [10, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Decorative lines for bottom text
  const bottomLineWidth = interpolate(
    frame,
    [fps * 1.5, fps * 1.95],
    [0, 55],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00ff88" intensity={0.042} focusY={50} />

      {/* Additional ambient glow behind CTA */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 50% 40% at 50% 55%, rgba(0, 255, 136, ${0.035 * ctaGlow}) 0%, transparent 60%)`,
        }}
      />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 28,
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
              width: 130,
              height: 130,
              borderRadius: "50%",
              border: "1px solid rgba(0, 255, 136, 0.25)",
              transform: `translate(-50%, -50%) scale(${ringScale})`,
              opacity: ringOpacity,
            }}
          />
          <div
            style={{
              transform: `scale(${logoScale})`,
              opacity: logoOpacity,
              filter: `drop-shadow(0 0 ${logoGlow}px rgba(0, 255, 136, 0.45))`,
            }}
          >
            <FedLogo size={90} glow={false} />
          </div>
        </div>

        {/* Next milestone - only if provided */}
        {nextMilestone && (
          <div
            style={{
              opacity: nextOpacity,
              transform: `translateY(${nextY}px)`,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: "#4a4a4a",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: 4,
                textTransform: "uppercase",
                marginBottom: 14,
                fontWeight: 500,
              }}
            >
              Next Milestone
            </div>
            <div
              style={{
                fontSize: 34,
                fontWeight: 900,
                color: "#ffffff",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -1,
              }}
            >
              {nextMilestone}
            </div>
          </div>
        )}

        {/* Divider */}
        <div
          style={{
            width: lineWidth,
            height: 1,
            background: "linear-gradient(90deg, transparent, #2a2a2a, transparent)",
            marginTop: 4,
            marginBottom: 4,
          }}
        />

        {/* CTA button */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px) scale(${ctaScale})`,
          }}
        >
          <div
            style={{
              padding: "17px 52px",
              background: "linear-gradient(140deg, #00ff88 0%, #00ffaa 50%, #00ff88 100%)",
              borderRadius: 50,
              boxShadow: `
                0 7px 30px rgba(0, 255, 136, ${(0.22 + 0.12 * ctaGlow) * ctaPulse}),
                0 0 ${35 * ctaGlow * ctaPulse}px rgba(0, 255, 136, ${0.12 * ctaGlow * ctaPulse}),
                inset 0 1.5px 0 rgba(255, 255, 255, 0.18),
                inset 0 -1px 0 rgba(0, 0, 0, 0.08)
              `,
            }}
          >
            <span
              style={{
                fontSize: 30,
                fontWeight: 900,
                color: "#020202",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -0.5,
                textShadow: "0 1px 0 rgba(255, 255, 255, 0.15)",
              }}
            >
              fed.markets
            </span>
          </div>
        </div>

        {/* Subtext with decorative lines */}
        <div
          style={{
            opacity: subOpacity,
            transform: `translateY(${subY}px)`,
            marginTop: 12,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: bottomLineWidth,
              height: 1,
              background: "linear-gradient(270deg, rgba(0, 255, 136, 0.22), transparent)",
            }}
          />
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
          <div
            style={{
              width: bottomLineWidth,
              height: 1,
              background: "linear-gradient(90deg, rgba(0, 255, 136, 0.22), transparent)",
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Main composition - 11 seconds total with cinematic pacing
export const MilestoneAnnouncement: React.FC<MilestoneAnnouncementProps> = ({
  milestone,
  target,
  current,
  progress,
  nextMilestone,
}) => {
  const { fps } = useVideoConfig();

  // Clean, quick fades
  const transitionFrames = Math.round(0.26 * fps);

  return (
    <TransitionSeries>
      {/* Reveal: 3.4s - Build anticipation, deliver the milestone moment */}
      <TransitionSeries.Sequence durationInFrames={Math.round(3.4 * fps)}>
        <RevealScene milestone={milestone} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* Progress: 4.6s - Data visualization that feels satisfying */}
      <TransitionSeries.Sequence durationInFrames={Math.round(4.6 * fps)}>
        <ProgressScene target={target} current={current} progress={progress} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* CTA: 3.2s - Clean, confident close */}
      <TransitionSeries.Sequence durationInFrames={Math.round(3.2 * fps)}>
        <CTAScene nextMilestone={nextMilestone} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
