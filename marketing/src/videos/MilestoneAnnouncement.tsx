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
  const drift = interpolate(frame, [0, 900], [0, 2], {
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
      <AbsoluteFill style={{ background: "#020202" }} />

      {/* Primary glow - centered, focused */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 50% at 50% ${focusY + drift}%, ${hexToRgba(accentColor, intensity)} 0%, transparent 60%)`,
        }}
      />

      {/* Secondary ambient - subtle top wash */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 100% 20% at 50% 0%, ${hexToRgba(accentColor, intensity * 0.2)} 0%, transparent 45%)`,
        }}
      />

      {/* Cinematic vignette - frames everything */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 85% 75% at 50% 50%, transparent 30%, rgba(0,0,0,0.7) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// Scene 1: The Big Reveal - Clean, Apple-style number reveal with maximum gravitas
const RevealScene: React.FC<{ milestone: string; progress: number }> = ({ milestone, progress }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Opening pulse - draws attention from black
  const pulseOpacity = interpolate(
    frame,
    [0, fps * 0.1, fps * 0.35, fps * 0.7],
    [0, 0.25, 0.12, 0],
    { extrapolateRight: "clamp" }
  );
  const pulseScale = interpolate(
    frame,
    [0, fps * 0.6],
    [0.3, 2.5],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Horizontal accent lines - cinematic stage reveal
  const lineWidth = interpolate(
    frame,
    [fps * 0.2, fps * 0.85],
    [0, 360],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const lineOpacity = interpolate(
    frame,
    [fps * 0.2, fps * 0.5, fps * 2.8, fps * 3.2],
    [0, 0.25, 0.25, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Pre-title - "APPROACHING" sets the tension
  const preDelay = 0.45;
  const preOpacity = interpolate(
    frame,
    [preDelay * fps, (preDelay + 0.25) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const preY = interpolate(
    frame,
    [preDelay * fps, (preDelay + 0.35) * fps],
    [14, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Pulsing indicator dot - adds life
  const dotPulse = frame > fps * 0.6 ? interpolate(
    (frame - fps * 0.6) % (fps * 1.4),
    [0, fps * 0.35, fps * 1.4],
    [0.4, 1, 0.4],
    { extrapolateLeft: "clamp" }
  ) : interpolate(frame, [preDelay * fps, fps * 0.6], [0, 0.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Main milestone "QE2" - THE hero moment with weight
  const heroDelay = 0.85;
  const heroProgress = spring({
    frame: frame - heroDelay * fps,
    fps,
    config: { damping: 180, stiffness: 55, mass: 1.4 },
  });
  const heroOpacity = interpolate(
    frame,
    [heroDelay * fps, (heroDelay + 0.25) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const heroY = interpolate(heroProgress, [0, 1], [45, 0]);
  const heroScale = interpolate(heroProgress, [0, 1], [0.92, 1]);

  // Glow builds majestically after text lands
  const glowIntensity = interpolate(
    frame,
    [fps * 1.3, fps * 2.5],
    [0, 80],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Background glow intensifies with reveal - energy builds
  const bgIntensity = interpolate(
    frame,
    [fps * 0.8, fps * 2.2],
    [0.025, 0.065],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Percentage badge - appears dramatically after milestone
  const percentDelay = 1.6;
  const percentProgress = spring({
    frame: frame - percentDelay * fps,
    fps,
    config: { damping: 150, stiffness: 120 },
  });
  const percentOpacity = interpolate(
    frame,
    [percentDelay * fps, (percentDelay + 0.18) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const percentScale = interpolate(percentProgress, [0, 1], [0.85, 1]);

  // Progress number counts up for drama
  const displayProgress = interpolate(
    frame,
    [(percentDelay + 0.1) * fps, (percentDelay + 0.8) * fps],
    [0, progress],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Badge "lands" with a subtle scale pulse when number finishes
  const badgeLandPulse = displayProgress >= progress - 1 ? interpolate(
    frame,
    [(percentDelay + 0.8) * fps, (percentDelay + 0.95) * fps],
    [1.08, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 1;

  // Badge glow builds
  const percentGlow = interpolate(
    frame,
    [(percentDelay + 0.3) * fps, fps * 2.8],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Underline accent draws elegantly
  const underlineWidth = interpolate(
    frame,
    [fps * 2.0, fps * 2.6],
    [0, 220],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const underlineOpacity = interpolate(
    frame,
    [fps * 2.0, fps * 2.35],
    [0, 0.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Tagline - final beat of anticipation
  const taglineOpacity = interpolate(
    frame,
    [fps * 2.5, fps * 2.85],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const taglineY = interpolate(
    frame,
    [fps * 2.5, fps * 2.95],
    [14, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00ff88" intensity={bgIntensity} focusY={48} />

      {/* Opening pulse - draws attention */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,255,136,0.5) 0%, transparent 60%)",
            opacity: pulseOpacity,
            transform: `scale(${pulseScale})`,
            position: "absolute",
          }}
        />
        {/* Horizontal accent lines */}
        <div
          style={{
            width: lineWidth,
            height: 1,
            background: "linear-gradient(90deg, transparent 0%, rgba(0,255,136,0.4) 25%, rgba(0,255,136,0.55) 50%, rgba(0,255,136,0.4) 75%, transparent 100%)",
            position: "absolute",
            opacity: lineOpacity,
            boxShadow: "0 0 16px rgba(0,255,136,0.2)",
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
        {/* Pre-title - builds tension */}
        <div
          style={{
            opacity: preOpacity,
            transform: `translateY(${preY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#00ff88",
              boxShadow: `0 0 ${12 + 8 * dotPulse}px rgba(0, 255, 136, ${0.5 + 0.3 * dotPulse})`,
              opacity: dotPulse,
            }}
          />
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#4a4a4a",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 6,
              textTransform: "uppercase",
            }}
          >
            Approaching Milestone
          </span>
        </div>

        {/* Hero milestone text - clean, commanding presence */}
        <div
          style={{
            opacity: heroOpacity,
            transform: `translateY(${heroY}px) scale(${heroScale})`,
            filter: `drop-shadow(0 0 ${glowIntensity}px rgba(0, 255, 136, 0.55))`,
            position: "relative",
          }}
        >
          <span
            style={{
              fontSize: 220,
              fontWeight: 900,
              color: "#ffffff",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: -10,
              lineHeight: 0.9,
              textShadow: "0 10px 60px rgba(0, 0, 0, 0.6)",
            }}
          >
            {milestone}
          </span>

          {/* Percentage badge - positioned dramatically */}
          <div
            style={{
              position: "absolute",
              top: -20,
              right: -60,
              opacity: percentOpacity,
              transform: `scale(${percentScale * badgeLandPulse})`,
            }}
          >
            <div
              style={{
                padding: "14px 22px",
                background: "linear-gradient(145deg, #00ff88 0%, #00ffaa 100%)",
                borderRadius: 40,
                boxShadow: `
                  0 6px 24px rgba(0, 255, 136, ${0.35 + 0.2 * percentGlow}),
                  0 0 ${30 * percentGlow}px rgba(0, 255, 136, ${0.2 * percentGlow})
                `,
              }}
            >
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  color: "#020202",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  letterSpacing: -1,
                }}
              >
                {Math.round(displayProgress)}%
              </span>
            </div>
          </div>
        </div>

        {/* Underline accent */}
        <div
          style={{
            width: underlineWidth,
            height: 2,
            background: "linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.55), transparent)",
            marginTop: 40,
            opacity: underlineOpacity,
            borderRadius: 1,
            boxShadow: "0 0 10px rgba(0, 255, 136, 0.2)",
          }}
        />

        {/* Tagline */}
        <div
          style={{
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
            marginTop: 26,
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 500,
              color: "#00ff88",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 2,
              opacity: 0.9,
            }}
          >
            $50,000 distribution target
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 2: Progress Dashboard - satisfying data visualization
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

  // Header with decorative lines
  const headerOpacity = interpolate(
    frame,
    [fps * 0.06, fps * 0.3],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const headerY = interpolate(
    frame,
    [fps * 0.06, fps * 0.38],
    [12, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const lineWidth = interpolate(
    frame,
    [fps * 0.08, fps * 0.5],
    [0, 50],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Hero percentage - dramatic entrance
  const percentDelay = 0.2;
  const percentProgress = spring({
    frame: frame - percentDelay * fps,
    fps,
    config: { damping: 180, stiffness: 70, mass: 1.15 },
  });
  const percentOpacity = interpolate(
    frame,
    [percentDelay * fps, (percentDelay + 0.2) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Percentage counts up with luxurious quintic ease-out
  const displayPercent = interpolate(
    frame,
    [fps * 0.45, fps * 2.4],
    [0, progress],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: (t) => 1 - Math.pow(1 - t, 5),
    }
  );

  // Percentage glow builds as number climbs
  const percentGlow = interpolate(
    frame,
    [fps * 1.5, fps * 2.8],
    [0, 35],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Progress bar - smooth fill with energy
  const barProgress = interpolate(
    frame,
    [fps * 0.6, fps * 2.6],
    [0, progress],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: (t) => 1 - Math.pow(1 - t, 4),
    }
  );

  // Bar glow intensity builds with fill
  const barGlow = interpolate(
    frame,
    [fps * 0.9, fps * 2.3],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Leading edge particle effect - adds energy
  const edgePulse = frame > fps * 0.8 ? interpolate(
    (frame - fps * 0.8) % (fps * 0.6),
    [0, fps * 0.15, fps * 0.6],
    [0.6, 1, 0.6]
  ) : 0.6;

  // Expanding ring effect around leading edge - creates energy burst as bar fills
  const ringCycle = (frame - fps * 0.8) % (fps * 0.9);
  const ringOpacity = barProgress > 10 ? interpolate(
    ringCycle,
    [0, fps * 0.15, fps * 0.6],
    [0.5, 0.25, 0],
    { extrapolateRight: "clamp" }
  ) : 0;
  const ringScale = interpolate(
    ringCycle,
    [0, fps * 0.6],
    [1, 2.5],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Current amount counter
  const currentValue = parseFloat(current.replace(/[$,]/g, "")) || 0;
  const displayCurrent = interpolate(
    frame,
    [fps * 0.6, fps * 2.4],
    [0, currentValue],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: (t) => 1 - Math.pow(1 - t, 5),
    }
  );

  // Stats row with stagger
  const stat1Opacity = interpolate(
    frame,
    [fps * 0.75, fps * 1.05],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const stat1Y = interpolate(
    frame,
    [fps * 0.75, fps * 1.1],
    [16, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  const stat2Opacity = interpolate(
    frame,
    [fps * 0.9, fps * 1.2],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const stat2Y = interpolate(
    frame,
    [fps * 0.9, fps * 1.25],
    [16, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Stat value glows
  const currentGlow = interpolate(
    frame,
    [fps * 1.8, fps * 2.8],
    [0, 18],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Background glow intensifies as numbers climb
  const bgIntensity = interpolate(
    frame,
    [fps * 0.5, fps * 2.2],
    [0.025, 0.055],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity }}>
      <CinematicBackground accentColor="#00ff88" intensity={bgIntensity} focusY={40} />

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
            width: 880,
          }}
        >
          {/* Header */}
          <div
            style={{
              opacity: headerOpacity,
              transform: `translateY(${headerY}px)`,
              marginBottom: 28,
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div style={{ width: lineWidth, height: 1, background: "linear-gradient(270deg, rgba(0,255,136,0.3), transparent)" }} />
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
              QE2 Progress
            </span>
            <div style={{ width: lineWidth, height: 1, background: "linear-gradient(90deg, rgba(0,255,136,0.3), transparent)" }} />
          </div>

          {/* Hero percentage */}
          <div
            style={{
              transform: `scale(${percentProgress})`,
              opacity: percentOpacity,
              marginBottom: 55,
              filter: `drop-shadow(0 0 ${percentGlow}px rgba(0, 255, 136, 0.3))`,
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
              {Math.round(displayPercent)}
            </span>
            <span
              style={{
                fontSize: 80,
                fontWeight: 900,
                color: "#00ff88",
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              %
            </span>
          </div>

          {/* Progress bar - the centerpiece */}
          <div
            style={{
              width: "100%",
              marginBottom: 60,
              position: "relative",
            }}
          >
            {/* Track */}
            <div
              style={{
                width: "100%",
                height: 12,
                background: "rgba(255, 255, 255, 0.03)",
                borderRadius: 6,
                overflow: "visible",
                position: "relative",
                border: "1px solid rgba(255, 255, 255, 0.025)",
              }}
            >
              {/* Fill - rich gradient */}
              <div
                style={{
                  width: `${barProgress}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, rgba(0,255,136,0.4) 0%, rgba(0,255,136,0.7) 40%, #00ff88 85%, #00ffaa 100%)",
                  borderRadius: 6,
                  boxShadow: `
                    0 0 ${25 * barGlow}px rgba(0, 255, 136, 0.45),
                    0 0 ${12 * barGlow}px rgba(0, 255, 136, 0.25),
                    inset 0 1px 0 rgba(255, 255, 255, 0.15)
                  `,
                  position: "relative",
                }}
              >
                {/* Leading edge glow */}
                {barProgress > 5 && (
                  <>
                    {/* Expanding ring effect */}
                    <div
                      style={{
                        position: "absolute",
                        right: -3,
                        top: "50%",
                        transform: `translateY(-50%) scale(${ringScale})`,
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        border: "1px solid rgba(0, 255, 136, 0.4)",
                        opacity: ringOpacity,
                        pointerEvents: "none",
                      }}
                    />
                    {/* Main glow point */}
                    <div
                      style={{
                        position: "absolute",
                        right: -3,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: `radial-gradient(circle, rgba(0,255,220,${0.9 * edgePulse}) 0%, rgba(0,255,136,0.5) 45%, transparent 70%)`,
                        boxShadow: `0 0 ${16 + 10 * barGlow}px rgba(0, 255, 136, ${0.7 * edgePulse})`,
                      }}
                    />
                  </>
                )}
              </div>

              {/* Target marker at 100% */}
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: -8,
                  bottom: -8,
                  width: 2,
                  background: "rgba(255, 255, 255, 0.15)",
                  borderRadius: 1,
                }}
              />
            </div>
          </div>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              padding: "0 30px",
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
                  letterSpacing: 4,
                  textTransform: "uppercase",
                  marginBottom: 14,
                  fontWeight: 500,
                }}
              >
                Distributed
              </div>
              <div
                style={{
                  fontSize: 48,
                  fontWeight: 900,
                  color: "#00ff88",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  letterSpacing: -2,
                  filter: `drop-shadow(0 0 ${currentGlow}px rgba(0, 255, 136, 0.4))`,
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
                  letterSpacing: 4,
                  textTransform: "uppercase",
                  marginBottom: 14,
                  fontWeight: 500,
                }}
              >
                Target
              </div>
              <div
                style={{
                  fontSize: 48,
                  fontWeight: 900,
                  color: "#505050",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  letterSpacing: -2,
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

// Scene 3: CTA - Commanding, memorable close with momentum
const CTAScene: React.FC<{ nextMilestone?: string }> = ({ nextMilestone }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo entrance - hero element with presence
  const logoProgress = spring({
    frame,
    fps,
    config: { damping: 180, stiffness: 80, mass: 1.1 },
  });
  const logoOpacity = interpolate(
    frame,
    [0, fps * 0.22],
    [0, 1],
    { extrapolateRight: "clamp" }
  );
  const logoScale = interpolate(logoProgress, [0, 1], [0.9, 1]);

  // Logo glow builds confidently
  const logoGlow = interpolate(
    frame,
    [fps * 0.15, fps * 0.75],
    [0, 45],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Expanding ring - adds depth and presence
  const ringOpacity = interpolate(
    frame,
    [fps * 0.1, fps * 0.28, fps * 1.0, fps * 1.4],
    [0, 0.28, 0.15, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ringScale = interpolate(
    frame,
    [fps * 0.1, fps * 1.4],
    [0.6, 2.2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // "Almost There" badge - builds excitement
  const badgeOpacity = interpolate(
    frame,
    [fps * 0.3, fps * 0.55],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const badgeY = interpolate(
    frame,
    [fps * 0.3, fps * 0.6],
    [12, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Next milestone section
  const nextOpacity = interpolate(
    frame,
    [fps * 0.5, fps * 0.8],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const nextY = interpolate(
    frame,
    [fps * 0.5, fps * 0.9],
    [16, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Divider line draws
  const lineWidth = interpolate(
    frame,
    [fps * 0.85, fps * 1.25],
    [0, 120],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // CTA button - THE action moment
  const ctaDelay = 1.0;
  const ctaProgress = spring({
    frame: frame - ctaDelay * fps,
    fps,
    config: { damping: 160, stiffness: 90 },
  });
  const ctaOpacity = interpolate(
    frame,
    [ctaDelay * fps, (ctaDelay + 0.2) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ctaY = interpolate(ctaProgress, [0, 1], [22, 0]);
  const ctaScale = interpolate(ctaProgress, [0, 1], [0.95, 1]);

  // CTA glow builds and pulses subtly
  const ctaGlow = interpolate(
    frame,
    [(ctaDelay + 0.15) * fps, fps * 2.0],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const ctaPulse = frame > fps * 1.7 ? interpolate(
    (frame - fps * 1.7) % (fps * 2.0),
    [0, fps * 1.0, fps * 2.0],
    [0.88, 1, 0.88]
  ) : 1;

  // Bottom text - final beat
  const subOpacity = interpolate(
    frame,
    [fps * 1.45, fps * 1.8],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const subY = interpolate(
    frame,
    [fps * 1.45, fps * 1.85],
    [10, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Decorative lines for bottom
  const bottomLineWidth = interpolate(
    frame,
    [fps * 1.6, fps * 2.05],
    [0, 60],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00ff88" intensity={0.045} focusY={50} />

      {/* Additional ambient glow behind CTA */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 55% 45% at 50% 55%, rgba(0, 255, 136, ${0.04 * ctaGlow}) 0%, transparent 60%)`,
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
              width: 140,
              height: 140,
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
            <FedLogo size={95} glow={false} />
          </div>
        </div>

        {/* "Almost There" badge */}
        <div
          style={{
            opacity: badgeOpacity,
            transform: `translateY(${badgeY}px)`,
            padding: "10px 22px",
            background: "rgba(0, 255, 136, 0.08)",
            borderRadius: 30,
            border: "1px solid rgba(0, 255, 136, 0.15)",
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#00ff88",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            Almost There
          </span>
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
              Next Target
            </div>
            <div
              style={{
                fontSize: 38,
                fontWeight: 900,
                color: "#ffffff",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -1.5,
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
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
            marginTop: 6,
            marginBottom: 6,
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
              padding: "18px 56px",
              background: "linear-gradient(145deg, #00ff88 0%, #00ffaa 50%, #00ff88 100%)",
              borderRadius: 50,
              boxShadow: `
                0 8px 32px rgba(0, 255, 136, ${(0.25 + 0.15 * ctaGlow) * ctaPulse}),
                0 0 ${40 * ctaGlow * ctaPulse}px rgba(0, 255, 136, ${0.15 * ctaGlow * ctaPulse}),
                inset 0 2px 0 rgba(255, 255, 255, 0.2),
                inset 0 -1px 0 rgba(0, 0, 0, 0.1)
              `,
            }}
          >
            <span
              style={{
                fontSize: 32,
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

        {/* Bottom text with decorative lines */}
        <div
          style={{
            opacity: subOpacity,
            transform: `translateY(${subY}px)`,
            marginTop: 14,
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <div
            style={{
              width: bottomLineWidth,
              height: 1,
              background: "linear-gradient(270deg, rgba(0, 255, 136, 0.25), transparent)",
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
              background: "linear-gradient(90deg, rgba(0, 255, 136, 0.25), transparent)",
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Main composition - 12 seconds total with cinematic pacing
export const MilestoneAnnouncement: React.FC<MilestoneAnnouncementProps> = ({
  milestone,
  target,
  current,
  progress,
  nextMilestone,
}) => {
  const { fps } = useVideoConfig();

  // Clean, quick fades - 0.25s sweet spot
  const transitionFrames = Math.round(0.25 * fps);

  return (
    <TransitionSeries>
      {/* Reveal: 3.6s - Build anticipation, deliver milestone with percentage badge */}
      <TransitionSeries.Sequence durationInFrames={Math.round(3.6 * fps)}>
        <RevealScene milestone={milestone} progress={progress} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* Progress: 4.6s - Satisfying data visualization with counting */}
      <TransitionSeries.Sequence durationInFrames={Math.round(4.6 * fps)}>
        <ProgressScene target={target} current={current} progress={progress} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* CTA: 3.3s - Confident close with momentum */}
      <TransitionSeries.Sequence durationInFrames={Math.round(3.3 * fps)}>
        <CTAScene nextMilestone={nextMilestone} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
