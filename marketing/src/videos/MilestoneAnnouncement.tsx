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

// Refined cinematic background - no pulsing, subtle and sophisticated
const CinematicBackground: React.FC<{
  accentColor?: string;
  intensity?: number;
}> = ({ accentColor = "#00ff88", intensity = 0.04 }) => {
  const frame = useCurrentFrame();

  // Very subtle vertical shift - barely noticeable
  const gradientY = interpolate(frame, [0, 300], [48, 52], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Deep dark base */}
      <AbsoluteFill style={{ background: "#0a0a0a" }} />

      {/* Subtle centered radial - no animation */}
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

// Scene 1: Build anticipation, then reveal the milestone - Apple keynote style
const RevealScene: React.FC<{ milestone: string }> = ({ milestone }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Horizontal reveal line draws first - creates anticipation, then fades as text appears
  const revealLineWidth = interpolate(frame, [fps * 0.2, fps * 0.7], [0, 140], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const revealLineOpacity = interpolate(
    frame,
    [fps * 0.2, fps * 0.4, fps * 0.9, fps * 1.3],
    [0, 0.5, 0.5, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Pre-title badge fades in after line
  const badgeOpacity = interpolate(frame, [fps * 0.5, fps * 0.8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const badgeY = interpolate(frame, [fps * 0.5, fps * 0.9], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Main milestone number - character by character reveal for drama
  const chars = milestone.split("");

  // Subtle glow that builds (not pulses) - stays static after reaching max
  const glowSize = interpolate(frame, [fps * 1.4, fps * 2.5], [0, 60], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Tagline appears last
  const taglineOpacity = interpolate(frame, [fps * 2.2, fps * 2.7], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const taglineY = interpolate(frame, [fps * 2.2, fps * 2.8], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

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
        {/* Reveal line - anticipation builder */}
        <div
          style={{
            width: revealLineWidth,
            height: 1,
            background: "linear-gradient(90deg, transparent, #00ff88, transparent)",
            opacity: revealLineOpacity,
            marginBottom: 30,
          }}
        />

        {/* Pre-title badge */}
        <div
          style={{
            opacity: badgeOpacity,
            transform: `translateY(${badgeY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 20,
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
              fontSize: 13,
              fontWeight: 600,
              color: "#555555",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 5,
              textTransform: "uppercase",
            }}
          >
            Milestone Achieved
          </span>
        </div>

        {/* Main milestone - character by character */}
        <div
          style={{
            display: "flex",
            gap: 4,
            filter: `drop-shadow(0 0 ${glowSize}px rgba(0, 255, 136, 0.5))`,
          }}
        >
          {chars.map((char, i) => {
            const charDelay = 0.9 + i * 0.08;
            const charScale = spring({
              frame: frame - charDelay * fps,
              fps,
              config: { damping: 200, stiffness: 120 },
            });
            const charOpacity = interpolate(
              frame,
              [charDelay * fps, (charDelay + 0.15) * fps],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            return (
              <span
                key={i}
                style={{
                  fontSize: 180,
                  fontWeight: 900,
                  color: "#ffffff",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  letterSpacing: -8,
                  lineHeight: 1,
                  display: "inline-block",
                  transform: `scale(${charScale})`,
                  opacity: charOpacity,
                }}
              >
                {char}
              </span>
            );
          })}
        </div>

        {/* Subtle tagline */}
        <div
          style={{
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
            marginTop: 36,
          }}
        >
          <span
            style={{
              fontSize: 18,
              fontWeight: 400,
              color: "#00ff88",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 1,
            }}
          >
            Distribution target reached
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 2: Progress visualization - refined dashboard aesthetic
const ProgressScene: React.FC<{
  target: string;
  current: string;
  progress: number;
}> = ({ target, current, progress }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Container card fades in
  const containerOpacity = interpolate(frame, [0, fps * 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });
  const containerScale = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 100 },
  });

  // Progress bar fill - smooth ease out
  const barProgress = interpolate(frame, [fps * 0.4, fps * 2.8], [0, progress], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Current amount counter
  const currentValue = parseFloat(current.replace(/[$,]/g, "")) || 0;
  const displayCurrent = interpolate(frame, [fps * 0.4, fps * 2.8], [0, currentValue], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Big percentage - hero element
  const percentOpacity = interpolate(frame, [fps * 0.2, fps * 0.6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Progress indicator glow
  const indicatorGlow = interpolate(frame, [fps * 0.5, fps * 2], [0, 25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Stats reveal with stagger
  const stat1Opacity = interpolate(frame, [fps * 0.6, fps * 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const stat2Opacity = interpolate(frame, [fps * 0.8, fps * 1.2], [0, 1], {
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
          padding: 60,
        }}
      >
        <div
          style={{
            opacity: containerOpacity,
            transform: `scale(${containerScale})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 900,
          }}
        >
          {/* Hero percentage - the main focus */}
          <div
            style={{
              opacity: percentOpacity,
              marginBottom: 50,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 140,
                fontWeight: 900,
                color: "#ffffff",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -6,
                lineHeight: 1,
              }}
            >
              {Math.round(barProgress)}
              <span style={{ color: "#00ff88", fontSize: 100 }}>%</span>
            </div>
            <div
              style={{
                fontSize: 14,
                color: "#555555",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: 4,
                textTransform: "uppercase",
                marginTop: 12,
              }}
            >
              QE2 Progress
            </div>
          </div>

          {/* Progress bar - sleek, minimal */}
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
                height: 8,
                background: "rgba(255, 255, 255, 0.04)",
                borderRadius: 4,
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* Fill */}
              <div
                style={{
                  width: `${barProgress}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #00ff88 0%, #00ff88 90%, #00ffaa 100%)",
                  borderRadius: 4,
                  boxShadow: `0 0 ${indicatorGlow}px rgba(0, 255, 136, 0.5)`,
                  position: "relative",
                }}
              >
                {/* Leading edge glow */}
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 16,
                    height: 16,
                    borderRadius: 8,
                    background: "#00ff88",
                    boxShadow: `0 0 20px rgba(0, 255, 136, 0.8)`,
                    opacity: barProgress > 2 ? 1 : 0,
                  }}
                />
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
                textAlign: "left",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "#444444",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginBottom: 10,
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
                  letterSpacing: -1,
                }}
              >
                ${Math.floor(displayCurrent).toLocaleString()}
              </div>
            </div>

            <div
              style={{
                opacity: stat2Opacity,
                textAlign: "right",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "#444444",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Target
              </div>
              <div
                style={{
                  fontSize: 42,
                  fontWeight: 900,
                  color: "#666666",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  letterSpacing: -1,
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

// Scene 3: CTA - confident, minimal
const CTAScene: React.FC<{ nextMilestone?: string }> = ({ nextMilestone }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo entrance
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 100 },
  });
  const logoOpacity = interpolate(frame, [0, fps * 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Static glow that builds (no pulsing)
  const logoGlow = interpolate(frame, [fps * 0.2, fps * 0.8], [0, 30], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Next milestone text
  const nextOpacity = interpolate(frame, [fps * 0.4, fps * 0.8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const nextY = interpolate(frame, [fps * 0.4, fps * 0.9], [15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // CTA button
  const ctaOpacity = interpolate(frame, [fps * 1, fps * 1.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ctaY = interpolate(frame, [fps * 1, fps * 1.5], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00ff88" intensity={0.04} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 36,
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
                fontSize: 12,
                color: "#555555",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: 3,
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Next Milestone
            </div>
            <div
              style={{
                fontSize: 36,
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

        {/* CTA */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px)`,
          }}
        >
          <div
            style={{
              padding: "16px 40px",
              background: "#00ff88",
              borderRadius: 50,
            }}
          >
            <span
              style={{
                fontSize: 28,
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
            opacity: interpolate(frame, [fps * 1.4, fps * 1.8], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
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

export const MilestoneAnnouncement: React.FC<MilestoneAnnouncementProps> = ({
  milestone,
  target,
  current,
  progress,
  nextMilestone,
}) => {
  const { fps } = useVideoConfig();

  return (
    <TransitionSeries>
      {/* Reveal: 3.5s - Build anticipation, big moment */}
      <TransitionSeries.Sequence durationInFrames={Math.round(3.5 * fps)}>
        <RevealScene milestone={milestone} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: Math.round(0.4 * fps) })}
      />

      {/* Progress: 5s - Data visualization */}
      <TransitionSeries.Sequence durationInFrames={Math.round(5 * fps)}>
        <ProgressScene target={target} current={current} progress={progress} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: Math.round(0.4 * fps) })}
      />

      {/* CTA: 3.5s - Clean close */}
      <TransitionSeries.Sequence durationInFrames={Math.round(3.5 * fps)}>
        <CTAScene nextMilestone={nextMilestone} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
