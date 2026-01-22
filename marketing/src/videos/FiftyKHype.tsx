import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

export interface FiftyKHypeProps {
  totalDistributed?: string;
  distributions?: number;
  holders?: number;
  githubUrl?: string;
}

// ============================================================================
// DESIGN SYSTEM - Premium dark theme with refined Apple-style aesthetics
// ============================================================================
const COLORS = {
  // Deep backgrounds
  bgDeep: "#050506",
  bgDark: "#0a0a0c",
  bgMid: "#111114",

  // Terminal
  terminalBg: "#0c0c0e",
  terminalBorder: "#1a1a1e",
  terminalHeaderBg: "#141416",
  terminalText: "#e8e8ec",
  terminalGray: "#6e6e78",
  terminalMuted: "#48484f",

  // Accent colors
  green: "#00d46a",
  greenMuted: "#00b858",
  greenGlow: "rgba(0, 212, 106, 0.5)",
  cyan: "#00c8e8",
  cyanGlow: "rgba(0, 200, 232, 0.4)",
  purple: "#a855f7",
  purpleGlow: "rgba(168, 85, 247, 0.4)",
  orange: "#f59e0b",
  orangeGlow: "rgba(245, 158, 11, 0.4)",
  blue: "#3b82f6",
  blueGlow: "rgba(59, 130, 246, 0.4)",
  red: "#ef4444",

  // Text
  white: "#ffffff",
  offWhite: "#f0f0f4",
  grayLight: "#9898a4",
  grayMid: "#58585f",
};

const hexToRgba = (hex: string, alpha: number) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(0, 212, 106, ${alpha})`;
  return `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`;
};

// ============================================================================
// PREMIUM BACKGROUND - Deep cinematic with subtle atmospheric glow
// ============================================================================
const CinematicBackground: React.FC<{
  intensity?: number;
  focusY?: number;
  color?: string;
}> = ({ intensity = 0.015, focusY = 50, color = COLORS.green }) => {
  const frame = useCurrentFrame();

  const drift = interpolate(frame, [0, 660], [0, 2], {
    extrapolateRight: "extend",
  });

  return (
    <AbsoluteFill>
      {/* Pure deep black base */}
      <AbsoluteFill style={{ background: COLORS.bgDeep }} />

      {/* Subtle noise texture layer */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 120% 80% at 50% 100%, ${COLORS.bgDark} 0%, ${COLORS.bgDeep} 70%)`,
        }}
      />

      {/* Primary ambient glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% ${focusY + drift}%, ${hexToRgba(color, intensity)} 0%, transparent 60%)`,
        }}
      />

      {/* Deep cinematic vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 20%, rgba(0,0,0,0.7) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// ============================================================================
// TERMINAL WINDOW - Premium glass morphism design
// ============================================================================
const TerminalWindow: React.FC<{
  children: React.ReactNode;
  scale?: number;
  opacity?: number;
  width?: number;
  glowIntensity?: number;
  glowColor?: string;
}> = ({
  children,
  scale = 1,
  opacity = 1,
  width = 920,
  glowIntensity = 0,
  glowColor = COLORS.green,
}) => {
  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        width,
        backgroundColor: COLORS.terminalBg,
        borderRadius: 16,
        border: `1px solid ${COLORS.terminalBorder}`,
        boxShadow: `
          0 60px 120px rgba(0, 0, 0, 0.6),
          0 25px 50px rgba(0, 0, 0, 0.4),
          0 0 ${glowIntensity}px ${hexToRgba(glowColor, 0.3)},
          inset 0 1px 0 rgba(255, 255, 255, 0.04)
        `,
        overflow: "hidden",
        fontFamily: "'SF Mono', 'Menlo', 'Monaco', 'Consolas', monospace",
      }}
    >
      {/* Terminal Header - macOS style with subtle glass effect */}
      <div
        style={{
          background: `linear-gradient(180deg, ${COLORS.terminalHeaderBg} 0%, ${COLORS.terminalBg} 100%)`,
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          borderBottom: `1px solid ${COLORS.terminalBorder}`,
        }}
      >
        <div
          style={{
            width: 13,
            height: 13,
            borderRadius: "50%",
            backgroundColor: "#ff5f57",
            boxShadow: "inset 0 -1px 1px rgba(0,0,0,0.2)",
          }}
        />
        <div
          style={{
            width: 13,
            height: 13,
            borderRadius: "50%",
            backgroundColor: "#febc2e",
            boxShadow: "inset 0 -1px 1px rgba(0,0,0,0.2)",
          }}
        />
        <div
          style={{
            width: 13,
            height: 13,
            borderRadius: "50%",
            backgroundColor: "#28c840",
            boxShadow: "inset 0 -1px 1px rgba(0,0,0,0.2)",
          }}
        />
        <span
          style={{
            marginLeft: 16,
            color: COLORS.terminalMuted,
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: 0.3,
          }}
        >
          ralph@fed-mainnet — zsh
        </span>
      </div>

      {/* Terminal Content */}
      <div style={{ padding: "24px 28px", minHeight: 420 }}>{children}</div>
    </div>
  );
};

// ============================================================================
// COMMAND PROMPT WITH REALISTIC TYPING
// ============================================================================
const PromptLine: React.FC<{
  command: string;
  typedChars: number;
  showCursor: boolean;
  cursorBlink: boolean;
}> = ({ command, typedChars, showCursor, cursorBlink }) => {
  const displayed = command.slice(0, typedChars);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: 10,
        fontSize: 15,
        lineHeight: 1.5,
      }}
    >
      <span style={{ color: COLORS.green, marginRight: 10, fontWeight: 600 }}>
        ➜
      </span>
      <span style={{ color: COLORS.cyan, marginRight: 14 }}>~/fed</span>
      <span style={{ color: COLORS.terminalText }}>{displayed}</span>
      {showCursor && (
        <span
          style={{
            display: "inline-block",
            width: 9,
            height: 18,
            backgroundColor: cursorBlink ? COLORS.green : "transparent",
            marginLeft: 2,
            borderRadius: 1,
          }}
        />
      )}
    </div>
  );
};

// ============================================================================
// LOG LINE - Clean terminal output
// ============================================================================
const LogLine: React.FC<{
  text: string;
  color?: string;
  indent?: number;
  opacity?: number;
  prefix?: React.ReactNode;
  prefixColor?: string;
  bold?: boolean;
}> = ({
  text,
  color = COLORS.terminalText,
  indent = 0,
  opacity = 1,
  prefix,
  prefixColor,
  bold = false,
}) => (
  <div
    style={{
      color,
      fontSize: 14,
      marginBottom: 5,
      marginLeft: indent * 20,
      opacity,
      display: "flex",
      alignItems: "center",
      gap: 10,
      fontWeight: bold ? 600 : 400,
      lineHeight: 1.5,
    }}
  >
    {prefix && (
      <span style={{ color: prefixColor || color, minWidth: 20 }}>{prefix}</span>
    )}
    <span>{text}</span>
  </div>
);

// ============================================================================
// ANIMATED SPINNER
// ============================================================================
const Spinner: React.FC<{ frame: number; color?: string }> = ({
  frame,
  color = COLORS.cyan,
}) => {
  const chars = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  const idx = Math.floor(frame / 2) % chars.length;
  return <span style={{ color, fontWeight: 600 }}>{chars[idx]}</span>;
};

// ============================================================================
// PROGRESS BAR - Smooth animated fill
// ============================================================================
const ProgressBar: React.FC<{
  progress: number;
  label: string;
  color?: string;
}> = ({ progress, label, color = COLORS.green }) => {
  const filled = Math.floor((progress / 100) * 24);
  const empty = 24 - filled;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        fontSize: 13,
        marginBottom: 6,
      }}
    >
      <span style={{ color: COLORS.terminalMuted, minWidth: 110 }}>{label}</span>
      <span style={{ color: COLORS.terminalGray }}>▐</span>
      <span style={{ color, letterSpacing: -2, fontWeight: 600 }}>
        {"█".repeat(filled)}
      </span>
      <span style={{ color: COLORS.terminalGray, letterSpacing: -2 }}>
        {"░".repeat(empty)}
      </span>
      <span style={{ color: COLORS.terminalGray }}>▌</span>
      <span style={{ color: COLORS.terminalText, minWidth: 40 }}>
        {progress.toFixed(0)}%
      </span>
    </div>
  );
};

// ============================================================================
// AGENT STATUS ROW - With animated entrance and glow
// ============================================================================
const AgentStatus: React.FC<{
  name: string;
  status: "booting" | "online" | "ready";
  icon: string;
  color: string;
  opacity?: number;
  scale?: number;
  glowIntensity?: number;
}> = ({ name, status, icon, color, opacity = 1, scale = 1, glowIntensity = 0 }) => {
  const statusText = {
    booting: "INIT",
    online: "SYNC",
    ready: "READY",
  }[status];

  const statusColor = {
    booting: COLORS.orange,
    online: COLORS.cyan,
    ready: COLORS.green,
  }[status];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        fontSize: 14,
        opacity,
        transform: `scale(${scale})`,
        marginBottom: 8,
        padding: "6px 0",
      }}
    >
      <span style={{ color: COLORS.terminalGray }}>│</span>
      <span
        style={{
          minWidth: 28,
          filter: glowIntensity > 0 ? `drop-shadow(0 0 ${glowIntensity}px ${color})` : "none",
        }}
      >
        {icon}
      </span>
      <span style={{ color, minWidth: 110, fontWeight: 500 }}>{name}</span>
      <span style={{ color: COLORS.terminalMuted }}>···</span>
      <span
        style={{
          color: statusColor,
          fontWeight: 700,
          letterSpacing: 1,
          fontSize: 11,
          padding: "2px 8px",
          borderRadius: 4,
          backgroundColor: hexToRgba(statusColor, 0.12),
          border: `1px solid ${hexToRgba(statusColor, 0.25)}`,
        }}
      >
        {statusText}
      </span>
    </div>
  );
};

// ============================================================================
// STAT CARD - Premium glass morphism with glow and counting animation
// ============================================================================
const StatCard: React.FC<{
  label: string;
  value: string;
  numericValue: number;
  prefix?: string;
  suffix?: string;
  color: string;
  opacity: number;
  scale: number;
  glowIntensity: number;
  countProgress: number;
}> = ({
  label,
  numericValue,
  prefix = "",
  suffix = "",
  color,
  opacity,
  scale,
  glowIntensity,
  countProgress,
}) => {
  // Cinematic counting with elegant ease-out
  const easedProgress =
    countProgress < 0.1
      ? countProgress * countProgress * 10 // Smooth start
      : countProgress < 0.75
      ? 0.1 + (countProgress - 0.1) * 1.38 // Fast middle
      : (() => {
          // Luxurious deceleration at the end
          const x = (countProgress - 0.75) / 0.25;
          return 0.997 + (1 - Math.pow(1 - x, 5)) * 0.003;
        })();

  const displayValue =
    easedProgress >= 0.99
      ? numericValue
      : Math.floor(numericValue * Math.min(easedProgress, 1));

  // Landing pulse effect
  const landPulse =
    countProgress >= 0.99
      ? 1 + Math.max(0, 0.05 * (1 - (countProgress - 0.99) * 50))
      : 1;

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        padding: "16px 24px",
        backgroundColor: hexToRgba(color, 0.06),
        borderRadius: 12,
        border: `1px solid ${hexToRgba(color, 0.15)}`,
        minWidth: 160,
        boxShadow: `0 0 ${glowIntensity}px ${hexToRgba(color, 0.3)}`,
      }}
    >
      <div
        style={{
          color: COLORS.terminalMuted,
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: 1.5,
          marginBottom: 6,
          fontWeight: 500,
        }}
      >
        {label}
      </div>
      <div
        style={{
          color,
          fontSize: 26,
          fontWeight: 700,
          fontFamily: "system-ui, -apple-system, sans-serif",
          letterSpacing: -1,
          filter: `drop-shadow(0 0 ${glowIntensity * 0.5}px ${color})`,
          transform: `scale(${landPulse})`,
          transformOrigin: "left center",
        }}
      >
        <span style={{ opacity: 0.9 }}>{prefix}</span>
        {displayValue.toLocaleString()}
        <span style={{ opacity: 0.6, fontSize: 18, marginLeft: 2 }}>{suffix}</span>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPOSITION - Cinematic terminal boot sequence
// ============================================================================
export const FiftyKHype: React.FC<FiftyKHypeProps> = ({
  totalDistributed = "$51,000",
  distributions = 400,
  holders = 1828,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ========== TIMING CONSTANTS ==========
  const POWER_ON_DURATION = fps * 0.6;
  const TYPING_START = fps * 0.8;
  const TYPING_SPEED = 0.22; // chars per frame - slightly faster for snappier feel
  const COMMAND = "./ralph-fed.sh";
  const ENTER_FRAME = TYPING_START + COMMAND.length / TYPING_SPEED + fps * 0.4;

  // Boot sequence timing
  const BOOT_START = ENTER_FRAME + fps * 0.4;
  const AGENT_INTERVAL = fps * 0.65; // Tighter interval for more energy

  // Stats display timing
  const STATS_START = BOOT_START + 5 * AGENT_INTERVAL + fps * 0.8;

  // Final message timing
  const FINAL_START = STATS_START + fps * 3.2;

  // ========== POWER ON SEQUENCE ==========
  // Cinematic flicker like a monitor turning on
  const flicker =
    frame < fps * 0.05 ? 0 :
    frame < fps * 0.08 ? 0.15 :
    frame < fps * 0.12 ? 0.03 :
    frame < fps * 0.16 ? 0.4 :
    frame < fps * 0.2 ? 0.08 :
    frame < fps * 0.25 ? 0.7 : 1;

  const powerOnOpacity = interpolate(
    frame,
    [fps * 0.25, POWER_ON_DURATION],
    [0.7, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) * flicker;

  // ========== TERMINAL ANIMATIONS ==========
  const terminalProgress = spring({
    frame: frame - fps * 0.15,
    fps,
    config: { damping: 120, stiffness: 90, mass: 1.1 },
  });
  const terminalScale = interpolate(terminalProgress, [0, 1], [0.92, 1]);
  const terminalOpacity = interpolate(frame, [fps * 0.2, fps * 0.5], [0, 1], {
    extrapolateRight: "clamp",
  }) * powerOnOpacity;

  // Terminal glow pulses during boot
  const terminalGlow = frame >= BOOT_START
    ? interpolate(
        frame,
        [BOOT_START, BOOT_START + fps * 2, STATS_START, STATS_START + fps * 1],
        [0, 25, 25, 40],
        { extrapolateRight: "clamp" }
      )
    : 0;

  // Typing animation with realistic variation
  const baseTypedChars = Math.max(0, (frame - TYPING_START) * TYPING_SPEED);
  const typedChars = Math.min(COMMAND.length, Math.floor(baseTypedChars));
  const cursorBlink = Math.floor(frame / 12) % 2 === 0;
  const showCursor = frame >= TYPING_START - fps * 0.2 && frame < ENTER_FRAME + fps * 0.3;

  const enterPressed = frame >= ENTER_FRAME;

  // Agent data
  const agents = [
    { name: "Treasury", icon: "🏦", color: COLORS.green },
    { name: "Marketing", icon: "📢", color: COLORS.purple },
    { name: "Twitter/X", icon: "𝕏", color: COLORS.cyan },
    { name: "Website", icon: "🌐", color: COLORS.blue },
    { name: "Economist", icon: "📊", color: COLORS.orange },
  ];

  // Agent status calculations with spring animations
  const getAgentStatus = (index: number): "booting" | "online" | "ready" => {
    const agentStart = BOOT_START + index * AGENT_INTERVAL;
    const onlineFrame = agentStart + fps * 0.35;
    const readyFrame = agentStart + fps * 0.55;

    if (frame < agentStart) return "booting";
    if (frame < onlineFrame) return "booting";
    if (frame < readyFrame) return "online";
    return "ready";
  };

  const getAgentAnimations = (index: number) => {
    const agentStart = BOOT_START + index * AGENT_INTERVAL;

    const progress = spring({
      frame: frame - agentStart,
      fps,
      config: { damping: 80, stiffness: 120, mass: 0.8 },
    });

    const opacity = interpolate(progress, [0, 0.5], [0, 1], {
      extrapolateRight: "clamp",
    });

    const scale = interpolate(progress, [0, 1], [0.9, 1]);

    const status = getAgentStatus(index);
    const glowIntensity = status === "ready" ? 8 : status === "online" ? 4 : 0;

    return { opacity, scale, glowIntensity };
  };

  // Progress bars
  const systemProgress = interpolate(
    frame,
    [BOOT_START, BOOT_START + fps * 1.8],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  const networkProgress = interpolate(
    frame,
    [BOOT_START + fps * 0.3, BOOT_START + fps * 2.2],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // All agents ready
  const allReady = frame >= BOOT_START + 5 * AGENT_INTERVAL + fps * 0.55;

  // Stats animations
  const statsProgress = spring({
    frame: frame - STATS_START,
    fps,
    config: { damping: 100, stiffness: 80, mass: 1 },
  });

  const statsOpacity = interpolate(statsProgress, [0, 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Parse numeric value from totalDistributed string (e.g., "$51,000" -> 51000)
  const parsedTotal = parseInt(totalDistributed.replace(/[^0-9]/g, ""), 10) || 51000;

  const statCards = [
    {
      label: "Total Distributed",
      numericValue: parsedTotal,
      prefix: "$",
      suffix: "+",
      color: COLORS.green,
    },
    {
      label: "Distributions",
      numericValue: distributions,
      prefix: "",
      suffix: "+",
      color: COLORS.cyan,
    },
    {
      label: "Holders Earning",
      numericValue: holders,
      prefix: "",
      suffix: "+",
      color: COLORS.purple,
    },
  ];

  const getStatAnimation = (index: number) => {
    const delay = 0.18 * index; // Slightly longer stagger for breathing room
    const progress = spring({
      frame: frame - STATS_START - delay * fps,
      fps,
      config: { damping: 80, stiffness: 100, mass: 0.9 },
    });

    const opacity = interpolate(progress, [0, 0.5], [0, 1], {
      extrapolateRight: "clamp",
    });

    const scale = interpolate(progress, [0, 1], [0.85, 1]);

    // Count animation - starts after card appears, runs for 1.2 seconds
    const countStart = STATS_START + delay * fps + fps * 0.2;
    const countDuration = fps * 1.2;
    const countProgress = interpolate(
      frame,
      [countStart, countStart + countDuration],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Glow pulse intensifies as count completes
    const landFrame = countStart + countDuration;
    const glowIntensity =
      frame > landFrame - fps * 0.1
        ? interpolate(
            frame,
            [landFrame - fps * 0.1, landFrame + fps * 0.1, landFrame + fps * 0.6],
            [5, 25, 10],
            { extrapolateRight: "clamp" }
          )
        : interpolate(
            frame,
            [STATS_START + delay * fps, countStart],
            [0, 5],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

    return { opacity, scale, glowIntensity, countProgress };
  };

  // Final message animation
  const finalProgress = spring({
    frame: frame - FINAL_START,
    fps,
    config: { damping: 100, stiffness: 70, mass: 1.1 },
  });

  const finalOpacity = interpolate(finalProgress, [0, 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  const finalScale = interpolate(finalProgress, [0, 1], [0.95, 1]);

  // Background color shift during stats reveal
  const bgColor = frame >= STATS_START
    ? COLORS.green
    : COLORS.cyan;

  const bgIntensity = interpolate(
    frame,
    [0, BOOT_START, STATS_START, FINAL_START],
    [0.008, 0.015, 0.025, 0.02],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill>
      <CinematicBackground intensity={bgIntensity} focusY={55} color={bgColor} />

      {/* Subtle scan line effect */}
      <AbsoluteFill
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.02) 2px,
            rgba(0, 0, 0, 0.02) 4px
          )`,
          pointerEvents: "none",
          opacity: 0.5,
        }}
      />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TerminalWindow
          scale={terminalScale}
          opacity={terminalOpacity}
          width={900}
          glowIntensity={terminalGlow}
          glowColor={bgColor}
        >
          {/* Command prompt */}
          <PromptLine
            command={COMMAND}
            typedChars={typedChars}
            showCursor={showCursor}
            cursorBlink={cursorBlink}
          />

          {/* After enter - boot sequence */}
          {enterPressed && (
            <>
              {/* Initial boot message with dramatic reveal */}
              <div style={{ marginTop: 18, marginBottom: 18 }}>
                <LogLine
                  text="Federal Reserve System v2.0"
                  color={COLORS.green}
                  prefix="[RALPH]"
                  prefixColor={COLORS.cyan}
                  bold
                />
                <LogLine
                  text="Powered by Claude Opus 4.5 • Autonomous Protocol"
                  color={COLORS.terminalMuted}
                  indent={1}
                />
              </div>

              {/* System initialization */}
              {frame >= BOOT_START && (
                <div style={{ marginBottom: 18 }}>
                  <LogLine
                    text="Initializing core subsystems..."
                    color={COLORS.terminalText}
                    prefix={
                      systemProgress < 100 ? (
                        <Spinner frame={frame} />
                      ) : (
                        "✓"
                      )
                    }
                    prefixColor={
                      systemProgress < 100 ? COLORS.cyan : COLORS.green
                    }
                  />
                  <div style={{ marginLeft: 30, marginTop: 10 }}>
                    <ProgressBar
                      progress={systemProgress}
                      label="Core engine"
                      color={COLORS.green}
                    />
                    <ProgressBar
                      progress={networkProgress}
                      label="Network sync"
                      color={COLORS.cyan}
                    />
                  </div>
                </div>
              )}

              {/* Agent boot sequence */}
              {frame >= BOOT_START + fps * 0.8 && (
                <div style={{ marginTop: 22, marginBottom: 18 }}>
                  <LogLine
                    text="Spawning autonomous agents..."
                    color={COLORS.terminalText}
                    prefix={allReady ? "✓" : <Spinner frame={frame} color={COLORS.purple} />}
                    prefixColor={allReady ? COLORS.green : COLORS.purple}
                  />
                  <div style={{ marginTop: 14, marginLeft: 10 }}>
                    {agents.map((agent, i) => {
                      const anim = getAgentAnimations(i);
                      return (
                        <AgentStatus
                          key={agent.name}
                          name={agent.name}
                          icon={agent.icon}
                          color={agent.color}
                          status={getAgentStatus(i)}
                          opacity={anim.opacity}
                          scale={anim.scale}
                          glowIntensity={anim.glowIntensity}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Stats display */}
              {frame >= STATS_START && (
                <div style={{ marginTop: 26, opacity: statsOpacity }}>
                  <LogLine
                    text="Treasury state loaded successfully"
                    color={COLORS.green}
                    prefix="✓"
                    prefixColor={COLORS.green}
                    bold
                  />
                  <div
                    style={{
                      marginTop: 16,
                      display: "flex",
                      gap: 16,
                      justifyContent: "flex-start",
                    }}
                  >
                    {statCards.map((stat, i) => {
                      const anim = getStatAnimation(i);
                      return (
                        <StatCard
                          key={stat.label}
                          label={stat.label}
                          numericValue={stat.numericValue}
                          prefix={stat.prefix}
                          suffix={stat.suffix}
                          color={stat.color}
                          opacity={anim.opacity}
                          scale={anim.scale}
                          glowIntensity={anim.glowIntensity}
                          countProgress={anim.countProgress}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Final ready message - triumphant conclusion */}
              {frame >= FINAL_START && (
                <div
                  style={{
                    marginTop: 28,
                    opacity: finalOpacity,
                    transform: `scale(${finalScale})`,
                  }}
                >
                  <div
                    style={{
                      padding: "20px 28px",
                      backgroundColor: hexToRgba(COLORS.green, 0.1),
                      borderRadius: 14,
                      border: `1px solid ${hexToRgba(COLORS.green, 0.25)}`,
                      boxShadow: `
                        0 0 40px ${hexToRgba(COLORS.green, 0.2)},
                        inset 0 1px 0 ${hexToRgba(COLORS.green, 0.1)}
                      `,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 14,
                      }}
                    >
                      <span style={{ fontSize: 20 }}>🏛️</span>
                      <span
                        style={{
                          color: COLORS.green,
                          fontSize: 16,
                          fontWeight: 700,
                          letterSpacing: 0.3,
                        }}
                      >
                        All systems operational
                      </span>
                    </div>
                    <div
                      style={{
                        marginLeft: 32,
                        color: COLORS.terminalText,
                        fontSize: 15,
                        fontWeight: 500,
                        marginBottom: 16,
                      }}
                    >
                      The money printer is ready.
                    </div>
                    <div
                      style={{
                        marginLeft: 32,
                        display: "flex",
                        gap: 24,
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "6px 12px",
                          backgroundColor: hexToRgba(COLORS.purple, 0.12),
                          borderRadius: 6,
                          border: `1px solid ${hexToRgba(COLORS.purple, 0.2)}`,
                        }}
                      >
                        <span style={{ fontSize: 12 }}>🤖</span>
                        <span
                          style={{
                            color: COLORS.purple,
                            fontSize: 11,
                            fontWeight: 600,
                            letterSpacing: 0.8,
                            textTransform: "uppercase",
                          }}
                        >
                          100% AI-operated
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "6px 12px",
                          backgroundColor: hexToRgba(COLORS.cyan, 0.12),
                          borderRadius: 6,
                          border: `1px solid ${hexToRgba(COLORS.cyan, 0.2)}`,
                        }}
                      >
                        <span style={{ fontSize: 12 }}>⚡</span>
                        <span
                          style={{
                            color: COLORS.cyan,
                            fontSize: 11,
                            fontWeight: 600,
                            letterSpacing: 0.8,
                            textTransform: "uppercase",
                          }}
                        >
                          Verifiable on GitHub
                        </span>
                      </div>
                      <span
                        style={{
                          color: COLORS.white,
                          fontSize: 16,
                          fontWeight: 700,
                          letterSpacing: -0.3,
                          textShadow: `0 0 20px ${hexToRgba(COLORS.green, 0.4)}`,
                        }}
                      >
                        fed.markets
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </TerminalWindow>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
