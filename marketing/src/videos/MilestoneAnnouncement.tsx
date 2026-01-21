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

// Premium cinematic background with subtle depth layers
const CinematicBackground: React.FC<{
  accentColor?: string;
  intensity?: number;
  focusY?: number;
  breathing?: boolean;
}> = ({ accentColor = "#00ff88", intensity = 0.03, focusY = 50, breathing = true }) => {
  const frame = useCurrentFrame();

  // Extremely slow drift - creates subtle life without being distracting
  const drift = breathing ? interpolate(frame, [0, 600], [0, 1.5], {
    extrapolateRight: "clamp",
  }) : 0;

  // Subtle breathing on intensity
  const breathe = breathing ? interpolate(
    frame % 180,
    [0, 90, 180],
    [intensity, intensity * 1.15, intensity],
    { extrapolateRight: "clamp" }
  ) : intensity;

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

      {/* Primary glow - whisper-quiet presence, centered */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 45% at 50% ${focusY + drift}%, ${hexToRgba(accentColor, breathe)} 0%, transparent 55%)`,
        }}
      />

      {/* Secondary ambient - very subtle top wash */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 100% 30% at 50% 0%, ${hexToRgba(accentColor, breathe * 0.3)} 0%, transparent 50%)`,
        }}
      />

      {/* Cinematic vignette - frames content elegantly */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 75% 65% at 50% 50%, transparent 20%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Film grain texture - barely perceptible, adds depth */}
      <AbsoluteFill
        style={{
          opacity: 0.015,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </AbsoluteFill>
  );
};

// Scene 1: The Reveal - Apple keynote "one more thing" moment
const RevealScene: React.FC<{ milestone: string }> = ({ milestone }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Subtle opening bloom - draws the eye immediately without being cheesy
  const bloomOpacity = interpolate(
    frame,
    [0, fps * 0.06, fps * 0.2, fps * 0.45],
    [0, 0.1, 0.05, 0],
    { extrapolateRight: "clamp" }
  );
  const bloomScale = interpolate(
    frame,
    [0, fps * 0.35],
    [0.4, 1.8],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Horizontal accent line that expands - subtle tech keynote feel
  const horizonLineWidth = interpolate(
    frame,
    [fps * 0.15, fps * 0.7],
    [0, 320],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const horizonLineOpacity = interpolate(
    frame,
    [fps * 0.15, fps * 0.4, fps * 2.0, fps * 2.5],
    [0, 0.25, 0.25, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Soft reveal - content emerges naturally (removed mechanical clip-path)
  const revealOpacity = interpolate(
    frame,
    [fps * 0.5, fps * 0.85],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Pre-title badge - appears after horizon line starts, builds anticipation
  const badgeOpacity = interpolate(
    frame,
    [fps * 0.4, fps * 0.7],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const badgeY = interpolate(
    frame,
    [fps * 0.4, fps * 0.8],
    [10, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Indicator dot pulse - adds life without being distracting
  const dotPulse = interpolate(
    (frame - fps * 0.8) % 60,
    [0, 30, 60],
    [0.5, 0.8, 0.5],
    { extrapolateLeft: "clamp" }
  );

  // Main milestone text - THE moment of impact
  const chars = milestone.split("");

  // Each character emerges with precise spring physics
  const charElements = chars.map((char, i) => {
    const charDelay = 0.7 + i * 0.08; // Tighter stagger for better rhythm
    const charProgress = spring({
      frame: frame - charDelay * fps,
      fps,
      config: { damping: 180, stiffness: 200, mass: 1 }, // Higher damping for smoother settle
    });
    const charOpacity = interpolate(
      frame,
      [charDelay * fps, (charDelay + 0.12) * fps],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Characters rise up with subtle scaling
    const charY = interpolate(charProgress, [0, 1], [30, 0]);
    const charScale = interpolate(charProgress, [0, 1], [0.95, 1]);

    return (
      <span
        key={i}
        style={{
          fontSize: 200,
          fontWeight: 900,
          color: "#ffffff",
          fontFamily: "system-ui, -apple-system, sans-serif",
          letterSpacing: -10,
          lineHeight: 1,
          display: "inline-block",
          transform: `translateY(${charY}px) scale(${charScale})`,
          opacity: charOpacity,
          textShadow: "0 8px 50px rgba(0, 0, 0, 0.5)",
        }}
      >
        {char}
      </span>
    );
  });

  // Glow builds smoothly after text appears
  const glowIntensity = interpolate(
    frame,
    [fps * 1.2, fps * 2.2],
    [0, 60],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Underline accent - draws after text settles
  const underlineWidth = interpolate(
    frame,
    [fps * 1.8, fps * 2.4],
    [0, 180],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const underlineOpacity = interpolate(
    frame,
    [fps * 1.8, fps * 2.1],
    [0, 0.6],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Tagline - final beat of the scene
  const taglineOpacity = interpolate(
    frame,
    [fps * 2.3, fps * 2.65],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const taglineY = interpolate(
    frame,
    [fps * 2.3, fps * 2.75],
    [10, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00ff88" intensity={0.045} focusY={48} />

      {/* Opening bloom - subtle but immediate attention */}
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
            background: "radial-gradient(circle, rgba(0,255,136,0.35) 0%, transparent 55%)",
            opacity: bloomOpacity,
            transform: `scale(${bloomScale})`,
            position: "absolute",
          }}
        />
        {/* Horizontal accent line - creates depth and anticipation */}
        <div
          style={{
            width: horizonLineWidth,
            height: 1,
            background: "linear-gradient(90deg, transparent 0%, rgba(0,255,136,0.4) 30%, rgba(0,255,136,0.5) 50%, rgba(0,255,136,0.4) 70%, transparent 100%)",
            position: "absolute",
            opacity: horizonLineOpacity,
            boxShadow: "0 0 15px rgba(0,255,136,0.2)",
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
            marginBottom: 28,
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#00ff88",
              boxShadow: "0 0 12px rgba(0, 255, 136, 0.6)",
              opacity: frame > fps * 0.8 ? dotPulse : badgeOpacity * 0.6,
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

        {/* Hero milestone text with glow */}
        <div
          style={{
            display: "flex",
            gap: 6,
            filter: `drop-shadow(0 0 ${glowIntensity}px rgba(0, 255, 136, 0.5))`,
            opacity: revealOpacity,
          }}
        >
          {charElements}
        </div>

        {/* Underline accent */}
        <div
          style={{
            width: underlineWidth,
            height: 2,
            background: "linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.5), transparent)",
            marginTop: 32,
            opacity: underlineOpacity,
            borderRadius: 1,
          }}
        />

        {/* Tagline */}
        <div
          style={{
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
            marginTop: 20,
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

// Scene 2: Progress Dashboard - sleek data visualization with satisfying animations
const ProgressScene: React.FC<{
  target: string;
  current: string;
  progress: number;
}> = ({ target, current, progress }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene entrance - smooth fade
  const sceneOpacity = interpolate(
    frame,
    [0, fps * 0.12],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  // QE2 label enters first
  const labelOpacity = interpolate(
    frame,
    [fps * 0.08, fps * 0.35],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const labelY = interpolate(
    frame,
    [fps * 0.08, fps * 0.4],
    [8, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Hero percentage - dramatic entrance
  const percentDelay = 0.15;
  const percentScale = spring({
    frame: frame - percentDelay * fps,
    fps,
    config: { damping: 200, stiffness: 90, mass: 1.1 },
  });
  const percentOpacity = interpolate(
    frame,
    [percentDelay * fps, (percentDelay + 0.2) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Percentage counts up with satisfying ease-out
  const displayPercent = interpolate(
    frame,
    [fps * 0.35, fps * 2.0],
    [0, progress],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Progress bar fill with smooth easing
  const barProgress = interpolate(
    frame,
    [fps * 0.45, fps * 2.2],
    [0, progress],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Bar glow intensity builds
  const barGlow = interpolate(
    frame,
    [fps * 0.6, fps * 1.8],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Current amount counter
  const currentValue = parseFloat(current.replace(/[$,]/g, "")) || 0;
  const displayCurrent = interpolate(
    frame,
    [fps * 0.5, fps * 2.0],
    [0, currentValue],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Stats row stagger - left stat first
  const stat1Opacity = interpolate(
    frame,
    [fps * 0.6, fps * 0.9],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const stat1Y = interpolate(
    frame,
    [fps * 0.6, fps * 1.0],
    [12, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Right stat slightly after
  const stat2Opacity = interpolate(
    frame,
    [fps * 0.75, fps * 1.05],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const stat2Y = interpolate(
    frame,
    [fps * 0.75, fps * 1.15],
    [12, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity }}>
      <CinematicBackground accentColor="#00ff88" intensity={0.035} focusY={42} />

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
            width: 800,
          }}
        >
          {/* QE2 Progress label */}
          <div
            style={{
              opacity: labelOpacity,
              transform: `translateY(${labelY}px)`,
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div style={{ width: 28, height: 1, background: "#2a2a2a" }} />
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
            <div style={{ width: 28, height: 1, background: "#2a2a2a" }} />
          </div>

          {/* Hero percentage */}
          <div
            style={{
              transform: `scale(${percentScale})`,
              opacity: percentOpacity,
              marginBottom: 50,
              filter: `drop-shadow(0 0 ${25 * barGlow}px rgba(0, 255, 136, 0.2))`,
            }}
          >
            <span
              style={{
                fontSize: 140,
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
                fontSize: 70,
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
                height: 8,
                background: "rgba(255, 255, 255, 0.03)",
                borderRadius: 4,
                overflow: "hidden",
                position: "relative",
                border: "1px solid rgba(255, 255, 255, 0.02)",
              }}
            >
              {/* Fill - smooth gradient without oversized leading edge */}
              <div
                style={{
                  width: `${barProgress}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, rgba(0,255,136,0.4) 0%, rgba(0,255,136,0.7) 50%, #00ff88 90%, #00ffaa 100%)",
                  borderRadius: 4,
                  boxShadow: `0 0 ${20 * barGlow}px rgba(0, 255, 136, 0.35)`,
                  position: "relative",
                }}
              >
                {/* Subtle leading glow - not oversized */}
                {barProgress > 5 && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: "radial-gradient(circle, rgba(0,255,200,0.9) 0%, rgba(0,255,136,0.5) 50%, transparent 70%)",
                      boxShadow: `0 0 ${10 + 8 * barGlow}px rgba(0, 255, 136, 0.7)`,
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
              padding: "0 20px",
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
                  marginBottom: 10,
                  fontWeight: 500,
                }}
              >
                Distributed
              </div>
              <div
                style={{
                  fontSize: 42,
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
                  marginBottom: 10,
                  fontWeight: 500,
                }}
              >
                Target
              </div>
              <div
                style={{
                  fontSize: 42,
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

// Scene 3: CTA - Confident, minimal close that sticks in memory
const CTAScene: React.FC<{ nextMilestone?: string }> = ({ nextMilestone }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo entrance - the hero element
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 100, mass: 1 },
  });
  const logoOpacity = interpolate(
    frame,
    [0, fps * 0.2],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  // Logo glow builds confidently
  const logoGlow = interpolate(
    frame,
    [fps * 0.15, fps * 0.65],
    [0, 30],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Next milestone section
  const nextOpacity = interpolate(
    frame,
    [fps * 0.3, fps * 0.6],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const nextY = interpolate(
    frame,
    [fps * 0.3, fps * 0.7],
    [12, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Divider line draws
  const lineWidth = interpolate(
    frame,
    [fps * 0.7, fps * 1.1],
    [0, 90],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // CTA button - the action moment
  const ctaDelay = 0.85;
  const ctaProgress = spring({
    frame: frame - ctaDelay * fps,
    fps,
    config: { damping: 180, stiffness: 90 },
  });
  const ctaOpacity = interpolate(
    frame,
    [ctaDelay * fps, (ctaDelay + 0.18) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ctaY = interpolate(ctaProgress, [0, 1], [18, 0]);

  // CTA glow builds
  const ctaGlow = interpolate(
    frame,
    [(ctaDelay + 0.1) * fps, fps * 1.8],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Subtext last
  const subOpacity = interpolate(
    frame,
    [fps * 1.25, fps * 1.6],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const subY = interpolate(
    frame,
    [fps * 1.25, fps * 1.65],
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
          gap: 26,
          flexDirection: "column",
        }}
      >
        {/* Logo - scaled entrance */}
        <div
          style={{
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
            filter: `drop-shadow(0 0 ${logoGlow}px rgba(0, 255, 136, 0.4))`,
          }}
        >
          <FedLogo size={85} glow={false} />
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
                marginBottom: 12,
                fontWeight: 500,
              }}
            >
              Next Milestone
            </div>
            <div
              style={{
                fontSize: 32,
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
            transform: `translateY(${ctaY}px)`,
          }}
        >
          <div
            style={{
              padding: "16px 46px",
              background: "linear-gradient(135deg, #00ff88 0%, #00ffaa 100%)",
              borderRadius: 50,
              boxShadow: `
                0 6px 28px rgba(0, 255, 136, ${0.2 + 0.15 * ctaGlow}),
                0 0 ${30 * ctaGlow}px rgba(0, 255, 136, ${0.12 * ctaGlow}),
                inset 0 1px 0 rgba(255, 255, 255, 0.15)
              `,
            }}
          >
            <span
              style={{
                fontSize: 28,
                fontWeight: 900,
                color: "#020202",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -0.5,
              }}
            >
              fed.markets
            </span>
          </div>
        </div>

        {/* Subtext - final beat */}
        <div
          style={{
            opacity: subOpacity,
            transform: `translateY(${subY}px)`,
          }}
        >
          <span
            style={{
              fontSize: 12,
              color: "#3a3a3a",
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

// Main composition - 11 seconds total with cinematic pacing
export const MilestoneAnnouncement: React.FC<MilestoneAnnouncementProps> = ({
  milestone,
  target,
  current,
  progress,
  nextMilestone,
}) => {
  const { fps } = useVideoConfig();

  // Clean, quick fades - not too fast, not too slow
  const transitionFrames = Math.round(0.28 * fps);

  return (
    <TransitionSeries>
      {/* Reveal: 3.3s - Build anticipation, deliver the milestone moment */}
      <TransitionSeries.Sequence durationInFrames={Math.round(3.3 * fps)}>
        <RevealScene milestone={milestone} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* Progress: 4.4s - Data visualization that feels satisfying */}
      <TransitionSeries.Sequence durationInFrames={Math.round(4.4 * fps)}>
        <ProgressScene target={target} current={current} progress={progress} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* CTA: 3s - Clean, confident close */}
      <TransitionSeries.Sequence durationInFrames={Math.round(3 * fps)}>
        <CTAScene nextMilestone={nextMilestone} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
