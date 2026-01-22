import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
  Sequence,
} from "remotion";
import { FedLogo } from "../components/visuals";

export interface FiftyKHypeProps {
  totalDistributed?: string;
  distributions?: number;
  holders?: number;
  githubUrl?: string;
}

// ============================================================================
// DESIGN SYSTEM - Premium palette matching StatsUpdate quality
// ============================================================================
const COLORS = {
  // Backgrounds - deep blacks
  black: "#000000",
  nearBlack: "#030303",
  darkGray: "#080808",

  // Primary - FED green (refined)
  primary: "#00d070",
  primaryMuted: "#00a858",
  primaryGlow: "rgba(0, 208, 112, 0.45)",

  // Secondary - cyan
  secondary: "#00b8d4",

  // Accent - amber for Claude branding
  amber: "#f59e0b",
  amberMuted: "#d97706",

  // Text
  white: "#ffffff",
  offWhite: "#f5f5f5",
  grayLight: "#909090",
  grayMid: "#606060",
  grayDark: "#404040",
};

// Utility to convert hex to rgba
const hexToRgba = (hex: string, alpha: number) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(0, 216, 120, ${alpha})`;
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// ============================================================================
// FILM GRAIN - Ultra-subtle texture
// ============================================================================
const FilmGrain: React.FC<{ opacity?: number }> = ({ opacity = 0.012 }) => {
  const frame = useCurrentFrame();
  const offsetX = (frame * 17) % 100;
  const offsetY = (frame * 23) % 100;

  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundPosition: `${offsetX}px ${offsetY}px`,
        opacity,
        mixBlendMode: "overlay",
        pointerEvents: "none",
      }}
    />
  );
};

// ============================================================================
// CINEMATIC BACKGROUND - Deep, refined, atmospheric
// ============================================================================
const CinematicBackground: React.FC<{
  intensity?: number;
  focusY?: number;
  color?: string;
}> = ({ intensity = 0.025, focusY = 50, color = COLORS.primary }) => {
  const frame = useCurrentFrame();

  const drift = interpolate(frame, [0, 600], [0, 1.2], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: COLORS.black }} />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 100% 100% at 50% 50%, ${COLORS.nearBlack} 0%, ${COLORS.black} 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 68% 48% at 50% ${focusY + drift}%, ${hexToRgba(color, intensity)} 0%, transparent 52%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 90% 16% at 50% 0%, ${hexToRgba(color, intensity * 0.1)} 0%, transparent 38%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 82% 72% at 50% 50%, transparent 22%, rgba(0,0,0,0.75) 100%)",
        }}
      />
      <FilmGrain opacity={0.006} />
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 1: TERMINAL BOOT - Cinematic, minimal, elegant
// ============================================================================
const TerminalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene fade in
  const sceneFade = interpolate(frame, [0, fps * 0.15], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Terminal window animation - premium spring
  const terminalProgress = spring({
    frame,
    fps,
    config: { damping: 180, stiffness: 80, mass: 1.2 },
  });
  const terminalScale = interpolate(terminalProgress, [0, 1], [0.92, 1]);
  const terminalOpacity = interpolate(frame, [0, fps * 0.2], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Terminal glow builds
  const terminalGlow = interpolate(
    frame,
    [fps * 0.2, fps * 1.5, fps * 3],
    [0, 35, 25],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Typing animation - refined timing
  const command = "./ralph-fed.sh";
  const typingStart = fps * 0.5;
  const typingSpeed = 0.12; // chars per frame
  const typedChars = Math.min(
    command.length,
    Math.max(0, Math.floor((frame - typingStart) * typingSpeed))
  );
  const displayedCommand = command.slice(0, typedChars);

  // Cursor blink - elegant timing
  const cursorVisible =
    Math.floor((frame * 1.8) / fps) % 2 === 0 ||
    frame < typingStart + command.length / typingSpeed;

  // Enter timing
  const enterFrame = typingStart + command.length / typingSpeed + fps * 0.4;
  const enterPressed = frame >= enterFrame;

  // Output animation
  const outputOpacity = interpolate(
    frame,
    [enterFrame, enterFrame + fps * 0.15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const outputY = interpolate(
    frame,
    [enterFrame, enterFrame + fps * 0.25],
    [8, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Processing indicator
  const dotsFrame = frame - enterFrame;
  const dotCount = enterPressed ? Math.floor((dotsFrame / fps) * 3) % 4 : 0;
  const dots = ".".repeat(dotCount);

  // Background glow
  const bgGlow = interpolate(
    frame,
    [0, fps * 1, fps * 3],
    [0.008, 0.025, 0.02],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground intensity={bgGlow} focusY={50} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "'SF Mono', 'Menlo', 'Monaco', monospace",
        }}
      >
        {/* Terminal Window */}
        <div
          style={{
            opacity: terminalOpacity,
            transform: `scale(${terminalScale})`,
            width: 720,
            backgroundColor: "rgba(10, 10, 15, 0.95)",
            borderRadius: 16,
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: `
              0 50px 100px rgba(0, 0, 0, 0.6),
              0 20px 40px rgba(0, 0, 0, 0.4),
              0 0 ${terminalGlow}px ${hexToRgba(COLORS.primary, 0.25)},
              inset 0 1px 0 rgba(255, 255, 255, 0.06)
            `,
            overflow: "hidden",
          }}
        >
          {/* Terminal Header - macOS style */}
          <div
            style={{
              background:
                "linear-gradient(180deg, rgba(60, 60, 70, 0.9) 0%, rgba(40, 40, 50, 0.95) 100%)",
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              borderBottom: "1px solid rgba(0, 0, 0, 0.3)",
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#ff5f57",
                boxShadow: "inset 0 -1px 1px rgba(0,0,0,0.2)",
              }}
            />
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#ffbd2e",
                boxShadow: "inset 0 -1px 1px rgba(0,0,0,0.2)",
              }}
            />
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#28ca41",
                boxShadow: "inset 0 -1px 1px rgba(0,0,0,0.2)",
              }}
            />
            <span
              style={{
                marginLeft: 14,
                color: COLORS.grayMid,
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              ralph@fed — zsh
            </span>
          </div>

          {/* Terminal Content */}
          <div style={{ padding: "28px 24px", minHeight: 180 }}>
            {/* Command line */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <span
                style={{
                  color: COLORS.primary,
                  marginRight: 10,
                  fontSize: 15,
                }}
              >
                ➜
              </span>
              <span
                style={{
                  color: COLORS.secondary,
                  marginRight: 14,
                  fontSize: 14,
                }}
              >
                ~/fed
              </span>
              <span style={{ color: COLORS.white, fontSize: 14 }}>
                {displayedCommand}
              </span>
              {!enterPressed && cursorVisible && (
                <span
                  style={{
                    display: "inline-block",
                    width: 8,
                    height: 18,
                    backgroundColor: COLORS.primary,
                    marginLeft: 2,
                    opacity: 0.85,
                  }}
                />
              )}
            </div>

            {/* Output */}
            {enterPressed && (
              <div
                style={{
                  opacity: outputOpacity,
                  transform: `translateY(${outputY}px)`,
                }}
              >
                <div
                  style={{
                    color: COLORS.primary,
                    fontSize: 13,
                    marginBottom: 12,
                    fontWeight: 500,
                  }}
                >
                  [RALPH] Initializing Federal Reserve System{dots}
                </div>
                <div
                  style={{
                    color: COLORS.grayMid,
                    fontSize: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      backgroundColor: COLORS.amber,
                      display: "inline-block",
                    }}
                  />
                  Powered by Claude Opus 4.5
                </div>
              </div>
            )}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 2: AGENT BOOT - Premium card design, refined animations
// ============================================================================
interface AgentCardProps {
  name: string;
  icon: React.ReactNode;
  color: string;
  delay: number;
}

const AgentCard: React.FC<AgentCardProps> = ({ name, icon, color, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entry animation - smooth spring
  const entryProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 180, stiffness: 70, mass: 1.2 },
  });

  const scale = interpolate(entryProgress, [0, 1], [0.85, 1]);
  const opacity = interpolate(
    frame,
    [delay, delay + fps * 0.15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const y = interpolate(entryProgress, [0, 1], [25, 0]);

  // Online state
  const onlineDelay = delay + fps * 0.5;
  const isOnline = frame > onlineDelay;

  // Status pulse - subtle
  const pulseFrame = frame - onlineDelay;
  const pulse = isOnline
    ? 1 +
      0.15 *
        Math.sin((pulseFrame / fps) * Math.PI * 2) *
        interpolate(pulseFrame, [0, fps * 0.5], [1, 0.3], {
          extrapolateRight: "clamp",
        })
    : 1;

  // Border glow transition
  const borderOpacity = interpolate(
    frame,
    [onlineDelay, onlineDelay + fps * 0.2],
    [0.06, 0.2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Card glow
  const cardGlow = isOnline
    ? interpolate(
        frame,
        [onlineDelay, onlineDelay + fps * 0.15, onlineDelay + fps * 0.4],
        [0, 25, 12],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 0;

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale}) translateY(${y}px)`,
      }}
    >
      <div
        style={{
          background: `linear-gradient(165deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.018) 35%, rgba(255,255,255,0.006) 100%)`,
          border: `1px solid ${hexToRgba(isOnline ? color : "#ffffff", borderOpacity)}`,
          borderRadius: 14,
          padding: "18px 22px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          minWidth: 185,
          boxShadow: `
            0 20px 50px rgba(0, 0, 0, 0.4),
            0 8px 20px rgba(0, 0, 0, 0.25),
            ${isOnline ? `0 0 ${cardGlow}px ${hexToRgba(color, 0.3)}` : ""},
            inset 0 1px 0 rgba(255, 255, 255, 0.06)
          `,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: isOnline ? "100%" : "0%",
            height: 1.5,
            background: `linear-gradient(90deg, ${color} 0%, ${hexToRgba(color, 0.5)} 60%, transparent 100%)`,
            transition: "width 0.3s ease-out",
          }}
        />

        {/* Icon container */}
        <div
          style={{
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isOnline
              ? hexToRgba(color, 0.15)
              : "rgba(255,255,255,0.05)",
            borderRadius: 10,
            fontSize: 18,
            transition: "background-color 0.3s",
          }}
        >
          {icon}
        </div>

        {/* Info */}
        <div>
          <div
            style={{
              color: COLORS.white,
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 4,
              letterSpacing: -0.3,
            }}
          >
            {name}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: isOnline ? color : COLORS.grayDark,
                transform: `scale(${pulse})`,
                boxShadow: isOnline ? `0 0 8px ${color}` : "none",
                transition: "background-color 0.2s",
              }}
            />
            <span
              style={{
                color: isOnline ? color : COLORS.grayDark,
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: 1.5,
                transition: "color 0.2s",
              }}
            >
              {isOnline ? "ONLINE" : "BOOTING"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// SVG Icons for agents (cleaner than emojis)
const TreasuryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={COLORS.primary}>
    <path d="M4 10V21H8V14H16V21H20V10L12 3L4 10ZM12 6L18 11V19H18V12H6V11L12 6Z" />
    <rect x="10" y="16" width="4" height="5" />
  </svg>
);

const MarketingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#ff6b9d">
    <path d="M18 11V8L21 5V19L18 16V13H14V11H18ZM5 9V15H8L13 20V4L8 9H5ZM11 8.83V15.17L9.17 13H7V11H9.17L11 8.83Z" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={COLORS.secondary}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const WebsiteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#a855f7">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 19.93C7.05 19.44 4 16.08 4 12C4 11.38 4.08 10.79 4.21 10.21L9 15V16C9 17.1 9.9 18 11 18V19.93ZM17.9 17.39C17.64 16.58 16.9 16 16 16H15V13C15 12.45 14.55 12 14 12H8V10H10C10.55 10 11 9.55 11 9V7H13C14.1 7 15 6.1 15 5V4.59C17.93 5.78 20 8.65 20 12C20 14.08 19.2 15.97 17.9 17.39Z" />
  </svg>
);

const EconomistIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={COLORS.amber}>
    <path d="M3.5 18.49L9.5 12.48L13.5 16.48L22 6.92L20.59 5.51L13.5 13.48L9.5 9.48L2 16.99L3.5 18.49Z" />
  </svg>
);

const AgentBootScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const agents = [
    { name: "Treasury", icon: <TreasuryIcon />, color: COLORS.primary, delay: 0 },
    { name: "Marketing", icon: <MarketingIcon />, color: "#ff6b9d", delay: fps * 0.18 },
    { name: "Twitter/X", icon: <TwitterIcon />, color: COLORS.secondary, delay: fps * 0.36 },
    { name: "Website", icon: <WebsiteIcon />, color: "#a855f7", delay: fps * 0.54 },
    { name: "Economist", icon: <EconomistIcon />, color: COLORS.amber, delay: fps * 0.72 },
  ];

  // Scene fade
  const sceneFade = interpolate(frame, [0, fps * 0.1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Title animation
  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 180, stiffness: 60, mass: 1.2 },
  });
  const titleOpacity = interpolate(frame, [0, fps * 0.15], [0, 1], {
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(titleProgress, [0, 1], [15, 0]);

  // Background glow - builds as agents come online
  const bgGlow = interpolate(
    frame,
    [0, fps * 1.5, fps * 3],
    [0.01, 0.035, 0.028],
    { extrapolateRight: "clamp" }
  );

  // Claude badge
  const badgeOpacity = interpolate(
    frame,
    [fps * 1.2, fps * 1.5],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const badgeY = interpolate(
    frame,
    [fps * 1.2, fps * 1.6],
    [10, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground intensity={bgGlow} focusY={48} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Title */}
        <div
          style={{
            position: "absolute",
            top: 85,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              color: COLORS.primary,
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: 4,
              marginBottom: 10,
            }}
          >
            INITIALIZING
          </div>
          <div
            style={{
              color: COLORS.white,
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: -1,
            }}
          >
            Ralph Agent Network
          </div>
        </div>

        {/* Agent Grid */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            justifyContent: "center",
            maxWidth: 820,
            marginTop: 35,
          }}
        >
          {agents.map((agent) => (
            <AgentCard
              key={agent.name}
              name={agent.name}
              icon={agent.icon}
              color={agent.color}
              delay={agent.delay}
            />
          ))}
        </div>

        {/* Claude Badge */}
        <div
          style={{
            position: "absolute",
            bottom: 65,
            display: "flex",
            alignItems: "center",
            gap: 10,
            opacity: badgeOpacity,
            transform: `translateY(${badgeY}px)`,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: `linear-gradient(135deg, ${COLORS.amberMuted} 0%, ${COLORS.amber} 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 4px 12px ${hexToRgba(COLORS.amber, 0.3)}`,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#000">
              <circle cx="12" cy="12" r="10" />
              <circle cx="8" cy="10" r="1.5" fill="#fff" />
              <circle cx="16" cy="10" r="1.5" fill="#fff" />
              <path
                d="M8 15C8 15 9.5 17 12 17C14.5 17 16 15 16 15"
                stroke="#fff"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span style={{ color: COLORS.grayMid, fontSize: 12 }}>
            Powered by{" "}
            <span style={{ color: COLORS.amber, fontWeight: 600 }}>
              Claude Opus 4.5
            </span>
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 3: PHASE TRANSITION - Cinematic, momentous
// ============================================================================
const PhaseTransitionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene fade
  const sceneFade = interpolate(frame, [0, fps * 0.1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Phase 1 - enters and holds
  const phase1Opacity = interpolate(
    frame,
    [0, fps * 0.25, fps * 1.4, fps * 1.8],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp" }
  );
  const phase1Scale = interpolate(
    frame,
    [fps * 1.4, fps * 1.8],
    [1, 0.9],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) }
  );
  const phase1X = interpolate(
    frame,
    [fps * 1.4, fps * 1.8],
    [0, -80],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) }
  );

  // Transition flash
  const flashOpacity = interpolate(
    frame,
    [fps * 1.7, fps * 1.85, fps * 2.1],
    [0, 0.8, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Phase 2 - enters with power
  const phase2Start = fps * 2.0;
  const phase2Progress = spring({
    frame: frame - phase2Start,
    fps,
    config: { damping: 150, stiffness: 60, mass: 1.3 },
  });
  const phase2Opacity = interpolate(
    frame,
    [phase2Start, phase2Start + fps * 0.2],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const phase2Scale = interpolate(phase2Progress, [0, 1], [1.15, 1]);

  // Phase 2 glow - builds majestically
  const phase2Glow = interpolate(
    frame,
    [phase2Start, phase2Start + fps * 0.3, phase2Start + fps * 1],
    [0, 80, 45],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Background intensity
  const bgGlow = interpolate(
    frame,
    [0, fps * 1.5, fps * 1.85, fps * 2.2, fps * 3.5],
    [0.015, 0.02, 0.08, 0.055, 0.04],
    { extrapolateRight: "clamp" }
  );

  // Expanding ring on Phase 2 reveal
  const ringOpacity = interpolate(
    frame,
    [phase2Start, phase2Start + fps * 0.1, phase2Start + fps * 0.6],
    [0, 0.6, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ringScale = interpolate(
    frame,
    [phase2Start, phase2Start + fps * 0.6],
    [0.5, 4],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Subtitle fade in
  const subtitleOpacity = interpolate(
    frame,
    [phase2Start + fps * 0.5, phase2Start + fps * 0.8],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const subtitleY = interpolate(
    frame,
    [phase2Start + fps * 0.5, phase2Start + fps * 0.9],
    [10, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground intensity={bgGlow} focusY={50} />

      {/* Transition flash */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle, ${hexToRgba(COLORS.primary, 0.9)} 0%, transparent 70%)`,
          opacity: flashOpacity,
          pointerEvents: "none",
        }}
      />

      {/* Expanding ring */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            border: `2px solid ${hexToRgba(COLORS.primary, 0.5)}`,
            opacity: ringOpacity,
            transform: `scale(${ringScale})`,
            boxShadow: `0 0 30px ${hexToRgba(COLORS.primary, 0.3)}`,
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Phase 1 */}
        <div
          style={{
            position: "absolute",
            opacity: phase1Opacity,
            transform: `translateX(${phase1X}px) scale(${phase1Scale})`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              color: COLORS.grayDark,
              fontSize: 11,
              letterSpacing: 4,
              marginBottom: 16,
              fontWeight: 600,
            }}
          >
            COMPLETED
          </div>
          <div
            style={{
              fontSize: 68,
              fontWeight: 800,
              color: COLORS.grayDark,
              letterSpacing: -3,
            }}
          >
            PHASE 1
          </div>
          <div
            style={{
              color: COLORS.grayDark,
              fontSize: 16,
              marginTop: 14,
              fontWeight: 400,
            }}
          >
            $0 → $25,000 Distributed
          </div>
        </div>

        {/* Phase 2 */}
        <div
          style={{
            position: "absolute",
            opacity: phase2Opacity,
            transform: `scale(${phase2Scale})`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              color: COLORS.primary,
              fontSize: 11,
              letterSpacing: 4,
              marginBottom: 16,
              fontWeight: 600,
            }}
          >
            NOW ENTERING
          </div>
          <div
            style={{
              fontSize: 78,
              fontWeight: 800,
              background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: -3,
              filter: `drop-shadow(0 0 ${phase2Glow}px ${hexToRgba(COLORS.primary, 0.4)})`,
            }}
          >
            PHASE 2
          </div>
          <div
            style={{
              color: COLORS.grayLight,
              fontSize: 16,
              marginTop: 16,
              fontWeight: 400,
              opacity: subtitleOpacity,
              transform: `translateY(${subtitleY}px)`,
            }}
          >
            $50,000+ Distributed • Full Autonomy
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 4: STATS SHOWCASE - Premium counters with satisfying animations
// ============================================================================
interface StatItemProps {
  value: string;
  numericValue: number;
  prefix?: string;
  suffix?: string;
  label: string;
  color: string;
  delay: number;
}

const StatItem: React.FC<StatItemProps> = ({
  numericValue,
  prefix = "",
  suffix = "",
  label,
  color,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card entry
  const entryProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 180, stiffness: 55, mass: 1.3 },
  });
  const opacity = interpolate(
    frame,
    [delay, delay + fps * 0.18],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const y = interpolate(entryProgress, [0, 1], [35, 0]);
  const scale = interpolate(entryProgress, [0, 1], [0.9, 1]);

  // Number counting - premium easing
  const countDuration = 1.2;
  const countStart = delay + fps * 0.1;
  const numberProgress = interpolate(
    frame,
    [countStart, countStart + countDuration * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: (t) => {
        if (t < 0.1) return t * t * 10;
        if (t < 0.8) return 0.1 + (t - 0.1) * 1.286;
        const x = (t - 0.8) / 0.2;
        return 1 - Math.pow(1 - x, 4) * 0.1;
      },
    }
  );

  const displayValue =
    numberProgress > 0.995
      ? numericValue
      : Math.floor(numericValue * numberProgress);

  // Landing state
  const hasLanded = numberProgress >= 0.995;
  const landTime = countStart + countDuration * fps;

  // Land pulse
  const landPulse = hasLanded
    ? interpolate(
        frame,
        [landTime, landTime + fps * 0.05, landTime + fps * 0.12, landTime + fps * 0.22],
        [1, 1.05, 0.98, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 1;

  // Number glow
  const numberGlow = hasLanded
    ? interpolate(
        frame,
        [landTime, landTime + fps * 0.06, landTime + fps * 0.3],
        [8, 35, 15],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : interpolate(
        frame,
        [countStart + fps * 0.1, landTime],
        [0, 8],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px) scale(${scale})`,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 52,
          fontWeight: 800,
          color: COLORS.white,
          letterSpacing: -2.5,
          marginBottom: 10,
          transform: `scale(${landPulse})`,
          filter: `drop-shadow(0 0 ${numberGlow}px ${hexToRgba(color, 0.5)})`,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <span style={{ color, marginRight: -2 }}>{prefix}</span>
        {displayValue.toLocaleString()}
        <span style={{ color: COLORS.grayMid, fontSize: 20, fontWeight: 700, marginLeft: 2 }}>
          {suffix}
        </span>
      </div>
      <div
        style={{
          color: COLORS.grayMid,
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: 2.5,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </div>
  );
};

const StatsShowcaseScene: React.FC<{
  totalDistributed: string;
  distributions: number;
  holders: number;
}> = ({ totalDistributed, distributions, holders }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Parse the total distributed value
  const numericTotal = parseFloat(totalDistributed.replace(/[^0-9.]/g, "")) || 50000;

  // Scene fade
  const sceneFade = interpolate(frame, [0, fps * 0.08], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Title
  const titleOpacity = interpolate(frame, [fps * 0.02, fps * 0.15], [0, 1], {
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(
    frame,
    [fps * 0.02, fps * 0.2],
    [12, 0],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Background
  const bgGlow = interpolate(
    frame,
    [0, fps * 1.5, fps * 3],
    [0.012, 0.04, 0.032],
    { extrapolateRight: "clamp" }
  );

  // Bottom line
  const lineWidth = interpolate(
    frame,
    [fps * 1.2, fps * 2],
    [0, 550],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const lineOpacity = interpolate(
    frame,
    [fps * 1.2, fps * 1.5],
    [0, 0.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground intensity={bgGlow} focusY={48} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
          flexDirection: "column",
        }}
      >
        {/* Title */}
        <div
          style={{
            position: "absolute",
            top: 95,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              color: COLORS.primary,
              fontSize: 10,
              letterSpacing: 4.5,
              marginBottom: 12,
              fontWeight: 600,
            }}
          >
            MILESTONE ACHIEVED
          </div>
          <div
            style={{
              color: COLORS.white,
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: -1,
            }}
          >
            The Numbers Speak
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: 70,
            marginTop: 30,
          }}
        >
          <StatItem
            value={totalDistributed}
            numericValue={numericTotal}
            prefix="$"
            suffix="+"
            label="USD1 Distributed"
            color={COLORS.primary}
            delay={fps * 0.2}
          />
          <StatItem
            value={`${distributions}+`}
            numericValue={distributions}
            suffix="+"
            label="Distributions"
            color={COLORS.secondary}
            delay={fps * 0.4}
          />
          <StatItem
            value={`${holders.toLocaleString()}+`}
            numericValue={holders}
            suffix="+"
            label="Holders Earning"
            color="#ff6b9d"
            delay={fps * 0.6}
          />
        </div>

        {/* Bottom line */}
        <div
          style={{
            position: "absolute",
            bottom: 140,
            width: lineWidth,
            height: 1.5,
            background: `linear-gradient(90deg, transparent, ${COLORS.primary}, ${COLORS.secondary}, transparent)`,
            opacity: lineOpacity,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 5: CTA - Commanding, confident close
// ============================================================================
const CTAScene: React.FC<{ githubUrl: string }> = ({ githubUrl }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene fade
  const sceneFade = interpolate(frame, [0, fps * 0.1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Main content
  const mainProgress = spring({
    frame,
    fps,
    config: { damping: 180, stiffness: 55, mass: 1.3 },
  });
  const mainOpacity = interpolate(frame, [0, fps * 0.18], [0, 1], {
    extrapolateRight: "clamp",
  });
  const mainScale = interpolate(mainProgress, [0, 1], [0.95, 1]);

  // Verified badge
  const badgeDelay = fps * 0.3;
  const badgeProgress = spring({
    frame: frame - badgeDelay,
    fps,
    config: { damping: 150, stiffness: 100, mass: 1 },
  });
  const badgeOpacity = interpolate(
    frame,
    [badgeDelay, badgeDelay + fps * 0.15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const badgeScale = interpolate(badgeProgress, [0, 1], [0.8, 1]);

  // Badge glow pulse
  const badgeGlow = interpolate(
    frame,
    [badgeDelay + fps * 0.15, badgeDelay + fps * 0.4, badgeDelay + fps * 1],
    [0, 20, 12],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Headline
  const headlineDelay = fps * 0.5;
  const headlineOpacity = interpolate(
    frame,
    [headlineDelay, headlineDelay + fps * 0.2],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const headlineY = interpolate(
    frame,
    [headlineDelay, headlineDelay + fps * 0.3],
    [20, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // CTA button
  const ctaDelay = fps * 1.0;
  const ctaProgress = spring({
    frame: frame - ctaDelay,
    fps,
    config: { damping: 150, stiffness: 70, mass: 1.2 },
  });
  const ctaOpacity = interpolate(
    frame,
    [ctaDelay, ctaDelay + fps * 0.18],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ctaY = interpolate(ctaProgress, [0, 1], [15, 0]);
  const ctaScale = interpolate(ctaProgress, [0, 1], [0.95, 1]);

  // CTA glow
  const ctaGlow = interpolate(
    frame,
    [ctaDelay + fps * 0.2, ctaDelay + fps * 0.6, ctaDelay + fps * 1.5],
    [0, 35, 25],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // GitHub
  const githubDelay = ctaDelay + fps * 0.4;
  const githubOpacity = interpolate(
    frame,
    [githubDelay, githubDelay + fps * 0.2],
    [0, 0.6],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const githubY = interpolate(
    frame,
    [githubDelay, githubDelay + fps * 0.25],
    [8, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Background
  const bgGlow = interpolate(
    frame,
    [0, fps * 1, fps * 2.5],
    [0.015, 0.045, 0.035],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground intensity={bgGlow} focusY={50} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            opacity: mainOpacity,
            transform: `scale(${mainScale})`,
            textAlign: "center",
          }}
        >
          {/* Verified Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              backgroundColor: hexToRgba(COLORS.primary, 0.1),
              border: `1px solid ${hexToRgba(COLORS.primary, 0.3)}`,
              borderRadius: 100,
              padding: "10px 22px",
              marginBottom: 28,
              opacity: badgeOpacity,
              transform: `scale(${badgeScale})`,
              boxShadow: `0 0 ${badgeGlow}px ${hexToRgba(COLORS.primary, 0.3)}`,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={COLORS.primary}>
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            </svg>
            <span
              style={{
                color: COLORS.primary,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 2,
              }}
            >
              100% AI-OPERATED
            </span>
          </div>

          {/* Headline */}
          <div
            style={{
              opacity: headlineOpacity,
              transform: `translateY(${headlineY}px)`,
            }}
          >
            <div
              style={{
                fontSize: 46,
                fontWeight: 800,
                color: COLORS.white,
                marginBottom: 8,
                lineHeight: 1.15,
                letterSpacing: -1.5,
              }}
            >
              The First AI-Run
            </div>
            <div
              style={{
                fontSize: 46,
                fontWeight: 800,
                background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: -1.5,
              }}
            >
              Token Project
            </div>
            <div
              style={{
                color: COLORS.grayMid,
                fontSize: 16,
                marginTop: 14,
                fontWeight: 400,
              }}
            >
              Built, operated, and distributed by Ralph
            </div>
          </div>

          {/* CTA */}
          <div
            style={{
              marginTop: 36,
              opacity: ctaOpacity,
              transform: `translateY(${ctaY}px) scale(${ctaScale})`,
            }}
          >
            <div
              style={{
                display: "inline-block",
                background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryMuted} 100%)`,
                color: COLORS.black,
                fontSize: 18,
                fontWeight: 700,
                padding: "14px 42px",
                borderRadius: 12,
                boxShadow: `0 0 ${ctaGlow}px ${hexToRgba(COLORS.primary, 0.4)}, 0 8px 25px rgba(0, 0, 0, 0.3)`,
                letterSpacing: -0.3,
              }}
            >
              fed.markets
            </div>
          </div>

          {/* GitHub */}
          <div
            style={{
              marginTop: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              opacity: githubOpacity,
              transform: `translateY(${githubY}px)`,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={COLORS.grayMid}>
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span style={{ color: COLORS.grayMid, fontSize: 13 }}>
              Verify on GitHub
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============================================================================
// MAIN COMPOSITION - 22 seconds with refined scene timing
// ============================================================================
export const FiftyKHype: React.FC<FiftyKHypeProps> = ({
  totalDistributed = "$50,000+",
  distributions = 400,
  holders = 1800,
  githubUrl = "github.com/anthropics/fed",
}) => {
  const { fps } = useVideoConfig();

  // Scene timing (total 22 seconds)
  // Scene 1: Terminal (0-3.5s)
  // Scene 2: Agent Boot (3-7.5s) - overlaps for smooth transition
  // Scene 3: Phase Transition (7-12s)
  // Scene 4: Stats (11.5-17s)
  // Scene 5: CTA (16.5-22s)

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black }}>
      {/* Scene 1: Terminal (0-3.5s) */}
      <Sequence from={0} durationInFrames={Math.round(3.5 * fps)}>
        <TerminalScene />
      </Sequence>

      {/* Scene 2: Agent Boot (3-7.5s) */}
      <Sequence from={Math.round(3 * fps)} durationInFrames={Math.round(4.5 * fps)}>
        <AgentBootScene />
      </Sequence>

      {/* Scene 3: Phase Transition (7-12s) */}
      <Sequence from={Math.round(7 * fps)} durationInFrames={Math.round(5 * fps)}>
        <PhaseTransitionScene />
      </Sequence>

      {/* Scene 4: Stats Showcase (11.5-17s) */}
      <Sequence from={Math.round(11.5 * fps)} durationInFrames={Math.round(5.5 * fps)}>
        <StatsShowcaseScene
          totalDistributed={totalDistributed}
          distributions={distributions}
          holders={holders}
        />
      </Sequence>

      {/* Scene 5: CTA (16.5-22s) */}
      <Sequence from={Math.round(16.5 * fps)} durationInFrames={Math.round(5.5 * fps)}>
        <CTAScene githubUrl={githubUrl} />
      </Sequence>
    </AbsoluteFill>
  );
};
