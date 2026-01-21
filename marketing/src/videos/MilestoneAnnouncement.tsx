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

// Refined cinematic background - ultra minimal, premium feel
const CinematicBackground: React.FC<{
  accentColor?: string;
  intensity?: number;
  focusY?: number;
}> = ({ accentColor = "#00ff88", intensity = 0.03, focusY = 50 }) => {
  const frame = useCurrentFrame();

  // Extremely slow drift - almost imperceptible
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

      {/* Primary glow - whisper-quiet presence */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 85% 50% at 50% ${focusY + drift}%, ${hexToRgba(accentColor, intensity)} 0%, transparent 60%)`,
        }}
      />

      {/* Cinematic vignette - frames content elegantly */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 75% 65% at 50% 50%, transparent 20%, rgba(0,0,0,0.6) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// Scene 1: The Reveal - Apple keynote moment
const RevealScene: React.FC<{ milestone: string }> = ({ milestone }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Initial subtle flash - draws the eye immediately
  const flashOpacity = interpolate(
    frame,
    [0, fps * 0.05, fps * 0.15, fps * 0.4],
    [0, 0.12, 0.06, 0],
    { extrapolateRight: "clamp" }
  );
  const flashScale = interpolate(
    frame,
    [0, fps * 0.3],
    [0.6, 1.8],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Converging lines - build tension before reveal
  const lineProgress = interpolate(
    frame,
    [fps * 0.15, fps * 0.65],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const lineOpacity = interpolate(
    frame,
    [fps * 0.15, fps * 0.35, fps * 1.2, fps * 1.6],
    [0, 0.6, 0.6, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const lineWidth = interpolate(lineProgress, [0, 1], [200, 50]);
  const lineGap = interpolate(lineProgress, [0, 1], [400, 60]);

  // Pre-title badge - subtle context
  const badgeOpacity = interpolate(
    frame,
    [fps * 0.6, fps * 0.9],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const badgeY = interpolate(
    frame,
    [fps * 0.6, fps * 1.0],
    [14, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Main milestone - THE MOMENT
  const chars = milestone.split("");

  // Glow that builds with the reveal, then holds
  const glowSize = interpolate(
    frame,
    [fps * 1.3, fps * 2.4],
    [0, 70],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Celebration accent - subtle horizontal lines after reveal
  const accentLineWidth = interpolate(
    frame,
    [fps * 2.0, fps * 2.6],
    [0, 90],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const accentLineOpacity = interpolate(
    frame,
    [fps * 2.0, fps * 2.4],
    [0, 0.4],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Tagline last
  const taglineOpacity = interpolate(
    frame,
    [fps * 2.3, fps * 2.7],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const taglineY = interpolate(
    frame,
    [fps * 2.3, fps * 2.8],
    [12, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00ff88" intensity={0.05} focusY={48} />

      {/* Initial flash - immediate attention grab */}
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
            background: "radial-gradient(circle, rgba(0,255,136,0.5) 0%, transparent 65%)",
            opacity: flashOpacity,
            transform: `scale(${flashScale})`,
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
        {/* Converging lines - builds anticipation */}
        <div
          style={{
            position: "absolute",
            display: "flex",
            alignItems: "center",
            gap: lineGap,
            opacity: lineOpacity,
          }}
        >
          <div
            style={{
              width: lineWidth,
              height: 2,
              background: "linear-gradient(270deg, #00ff88, rgba(0, 255, 136, 0.3), transparent)",
              borderRadius: 1,
              boxShadow: "0 0 10px rgba(0, 255, 136, 0.3)",
            }}
          />
          <div
            style={{
              width: lineWidth,
              height: 2,
              background: "linear-gradient(90deg, #00ff88, rgba(0, 255, 136, 0.3), transparent)",
              borderRadius: 1,
              boxShadow: "0 0 10px rgba(0, 255, 136, 0.3)",
            }}
          />
        </div>

        {/* Pre-title badge */}
        <div
          style={{
            opacity: badgeOpacity,
            transform: `translateY(${badgeY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              background: "#00ff88",
              boxShadow: "0 0 12px rgba(0, 255, 136, 0.6)",
            }}
          />
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#505050",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 5,
              textTransform: "uppercase",
            }}
          >
            Milestone Achieved
          </span>
        </div>

        {/* Main milestone - character by character with springs */}
        <div
          style={{
            display: "flex",
            gap: 8,
            filter: `drop-shadow(0 0 ${glowSize}px rgba(0, 255, 136, 0.55))`,
          }}
        >
          {chars.map((char, i) => {
            const charDelay = 0.85 + i * 0.1;
            const charScale = spring({
              frame: frame - charDelay * fps,
              fps,
              config: { damping: 150, stiffness: 180 },
            });
            const charOpacity = interpolate(
              frame,
              [charDelay * fps, (charDelay + 0.1) * fps],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            // Subtle Y offset that settles
            const charY = interpolate(charScale, [0, 1], [25, 0]);

            return (
              <span
                key={i}
                style={{
                  fontSize: 220,
                  fontWeight: 900,
                  color: "#ffffff",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  letterSpacing: -12,
                  lineHeight: 1,
                  display: "inline-block",
                  transform: `scale(${charScale}) translateY(${charY}px)`,
                  opacity: charOpacity,
                  textShadow: "0 10px 60px rgba(0, 0, 0, 0.6)",
                }}
              >
                {char}
              </span>
            );
          })}
        </div>

        {/* Celebration accent lines */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginTop: 32,
            opacity: accentLineOpacity,
          }}
        >
          <div
            style={{
              width: accentLineWidth,
              height: 1,
              background: "linear-gradient(270deg, rgba(0, 255, 136, 0.5), transparent)",
            }}
          />
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#00ff88",
              boxShadow: "0 0 10px rgba(0, 255, 136, 0.5)",
            }}
          />
          <div
            style={{
              width: accentLineWidth,
              height: 1,
              background: "linear-gradient(90deg, rgba(0, 255, 136, 0.5), transparent)",
            }}
          />
        </div>

        {/* Tagline */}
        <div
          style={{
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
            marginTop: 24,
          }}
        >
          <span
            style={{
              fontSize: 18,
              fontWeight: 500,
              color: "#00ff88",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 1,
              opacity: 0.9,
            }}
          >
            Distribution target reached
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 2: Progress Dashboard - sleek data visualization
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
    [0, fps * 0.15],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  // Hero percentage - this is THE number
  const percentDelay = 0.1;
  const percentScale = spring({
    frame: frame - percentDelay * fps,
    fps,
    config: { damping: 200, stiffness: 80 },
  });
  const percentOpacity = interpolate(
    frame,
    [percentDelay * fps, (percentDelay + 0.25) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Percentage counts up with satisfying ease-out
  const displayPercent = interpolate(
    frame,
    [fps * 0.25, fps * 2.2],
    [0, progress],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Progress bar fill
  const barProgress = interpolate(
    frame,
    [fps * 0.35, fps * 2.4],
    [0, progress],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Progress bar glow intensity builds
  const barGlow = interpolate(
    frame,
    [fps * 0.5, fps * 2.0],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Current amount counter
  const currentValue = parseFloat(current.replace(/[$,]/g, "")) || 0;
  const displayCurrent = interpolate(
    frame,
    [fps * 0.4, fps * 2.2],
    [0, currentValue],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Stats row stagger
  const stat1Opacity = interpolate(
    frame,
    [fps * 0.5, fps * 0.85],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const stat1Y = interpolate(
    frame,
    [fps * 0.5, fps * 0.9],
    [15, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  const stat2Opacity = interpolate(
    frame,
    [fps * 0.7, fps * 1.05],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const stat2Y = interpolate(
    frame,
    [fps * 0.7, fps * 1.1],
    [15, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // QE2 label
  const labelOpacity = interpolate(
    frame,
    [fps * 0.2, fps * 0.5],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const labelY = interpolate(
    frame,
    [fps * 0.2, fps * 0.55],
    [10, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity }}>
      <CinematicBackground accentColor="#00ff88" intensity={0.035} focusY={40} />

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
            width: 850,
          }}
        >
          {/* QE2 Progress label */}
          <div
            style={{
              opacity: labelOpacity,
              transform: `translateY(${labelY}px)`,
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div style={{ width: 25, height: 1, background: "#2a2a2a" }} />
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
            <div style={{ width: 25, height: 1, background: "#2a2a2a" }} />
          </div>

          {/* Hero percentage */}
          <div
            style={{
              transform: `scale(${percentScale})`,
              opacity: percentOpacity,
              marginBottom: 45,
              filter: `drop-shadow(0 0 ${30 * barGlow}px rgba(0, 255, 136, 0.25))`,
            }}
          >
            <span
              style={{
                fontSize: 150,
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

          {/* Progress bar */}
          <div
            style={{
              width: "100%",
              marginBottom: 50,
            }}
          >
            {/* Track */}
            <div
              style={{
                width: "100%",
                height: 10,
                background: "rgba(255, 255, 255, 0.03)",
                borderRadius: 5,
                overflow: "hidden",
                position: "relative",
                border: "1px solid rgba(255, 255, 255, 0.03)",
              }}
            >
              {/* Fill */}
              <div
                style={{
                  width: `${barProgress}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, rgba(0,255,136,0.5) 0%, rgba(0,255,136,0.8) 60%, #00ff88 95%, #00ffcc 100%)",
                  borderRadius: 5,
                  boxShadow: `0 0 ${25 * barGlow}px rgba(0, 255, 136, 0.45)`,
                  position: "relative",
                }}
              >
                {/* Trailing glow effect */}
                {barProgress > 15 && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 0,
                      width: Math.min(barProgress * 2, 120),
                      height: "100%",
                      background: "linear-gradient(90deg, transparent, rgba(0,255,200,0.3))",
                      borderRadius: 5,
                    }}
                  />
                )}
                {/* Leading edge indicator */}
                {barProgress > 5 && (
                  <div
                    style={{
                      position: "absolute",
                      right: -2,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      background: "radial-gradient(circle, #00ffcc 0%, #00ff88 60%)",
                      boxShadow: `
                        0 0 ${18 + 12 * barGlow}px rgba(0, 255, 136, 0.9),
                        0 0 ${35 * barGlow}px rgba(0, 255, 136, 0.5)
                      `,
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
                  marginBottom: 10,
                  fontWeight: 500,
                }}
              >
                Target
              </div>
              <div
                style={{
                  fontSize: 44,
                  fontWeight: 900,
                  color: "#555555",
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

// Scene 3: CTA - Confident, minimal close
const CTAScene: React.FC<{ nextMilestone?: string }> = ({ nextMilestone }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo entrance
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 90 },
  });
  const logoOpacity = interpolate(
    frame,
    [0, fps * 0.25],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  // Logo glow builds
  const logoGlow = interpolate(
    frame,
    [fps * 0.15, fps * 0.7],
    [0, 35],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Next milestone text
  const nextOpacity = interpolate(
    frame,
    [fps * 0.35, fps * 0.7],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const nextY = interpolate(
    frame,
    [fps * 0.35, fps * 0.8],
    [16, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Divider line
  const lineWidth = interpolate(
    frame,
    [fps * 0.8, fps * 1.2],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // CTA button
  const ctaDelay = 0.9;
  const ctaProgress = spring({
    frame: frame - ctaDelay * fps,
    fps,
    config: { damping: 180, stiffness: 80 },
  });
  const ctaOpacity = interpolate(
    frame,
    [ctaDelay * fps, (ctaDelay + 0.2) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ctaY = interpolate(ctaProgress, [0, 1], [20, 0]);

  // CTA glow builds
  const ctaGlow = interpolate(
    frame,
    [(ctaDelay + 0.15) * fps, fps * 2],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Subtext last
  const subOpacity = interpolate(
    frame,
    [fps * 1.3, fps * 1.7],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const subY = interpolate(
    frame,
    [fps * 1.3, fps * 1.75],
    [10, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00ff88" intensity={0.04} focusY={50} />

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
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
            filter: `drop-shadow(0 0 ${logoGlow}px rgba(0, 255, 136, 0.45))`,
          }}
        >
          <FedLogo size={90} glow={false} />
        </div>

        {/* Next milestone */}
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

        {/* CTA */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px) scale(${1 + 0.02 * ctaGlow})`,
          }}
        >
          <div
            style={{
              padding: "18px 50px",
              background: "linear-gradient(135deg, #00ff88 0%, #00ffaa 100%)",
              borderRadius: 50,
              boxShadow: `
                0 8px 32px rgba(0, 255, 136, ${0.22 + 0.18 * ctaGlow}),
                0 0 ${35 * ctaGlow}px rgba(0, 255, 136, ${0.15 * ctaGlow}),
                inset 0 1px 0 rgba(255, 255, 255, 0.2)
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
              }}
            >
              fed.markets
            </span>
          </div>
        </div>

        {/* Subtext */}
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

// Main composition - 11 seconds, tighter pacing
export const MilestoneAnnouncement: React.FC<MilestoneAnnouncementProps> = ({
  milestone,
  target,
  current,
  progress,
  nextMilestone,
}) => {
  const { fps } = useVideoConfig();

  // Clean, quick fades
  const transitionFrames = Math.round(0.3 * fps);

  return (
    <TransitionSeries>
      {/* Reveal: 3.2s - Build anticipation, big moment */}
      <TransitionSeries.Sequence durationInFrames={Math.round(3.2 * fps)}>
        <RevealScene milestone={milestone} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* Progress: 4.5s - Data visualization */}
      <TransitionSeries.Sequence durationInFrames={Math.round(4.5 * fps)}>
        <ProgressScene target={target} current={current} progress={progress} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* CTA: 3s - Clean close */}
      <TransitionSeries.Sequence durationInFrames={Math.round(3 * fps)}>
        <CTAScene nextMilestone={nextMilestone} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
