import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  AbsoluteFill,
  Img,
  staticFile,
} from "remotion";
import React from "react";

// Animated gradient background
export const GradientBackground: React.FC<{
  colors?: string[];
  angle?: number;
  animate?: boolean;
}> = ({ colors = ["#0a0a0a", "#1a1a2e", "#0a0a0a"], angle = 180, animate = true }) => {
  const frame = useCurrentFrame();

  const animatedAngle = animate
    ? interpolate(frame % 300, [0, 150, 300], [angle, angle + 30, angle])
    : angle;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${animatedAngle}deg, ${colors.join(", ")})`,
      }}
    />
  );
};

// Radial glow background
export const RadialGlow: React.FC<{
  color?: string;
  intensity?: number;
  x?: string;
  y?: string;
}> = ({ color = "#00ff88", intensity = 0.4, x = "50%", y = "50%" }) => {
  const frame = useCurrentFrame();

  const pulse = interpolate(frame % 90, [0, 45, 90], [intensity * 0.7, intensity, intensity * 0.7]);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at ${x} ${y}, ${color}${Math.round(pulse * 255).toString(16).padStart(2, "0")} 0%, transparent 60%)`,
      }}
    />
  );
};

// Grid pattern overlay
export const GridOverlay: React.FC<{
  size?: number;
  color?: string;
  opacity?: number;
}> = ({ size = 50, color = "#ffffff", opacity = 0.03 }) => {
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `
          linear-gradient(${color} 1px, transparent 1px),
          linear-gradient(90deg, ${color} 1px, transparent 1px)
        `,
        backgroundSize: `${size}px ${size}px`,
        opacity,
      }}
    />
  );
};

// Logo component
export const FedLogo: React.FC<{
  size?: number;
  glow?: boolean;
  glowColor?: string;
}> = ({ size = 200, glow = true, glowColor = "#00ff88" }) => {
  const frame = useCurrentFrame();

  const glowIntensity = glow
    ? interpolate(frame % 60, [0, 30, 60], [20, 40, 20])
    : 0;

  return (
    <div
      style={{
        filter: `drop-shadow(0 0 ${glowIntensity}px ${glowColor})`,
      }}
    >
      <Img
        src={staticFile("logo.png")}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
        }}
      />
    </div>
  );
};

// Stat card component
export const StatCard: React.FC<{
  value: string;
  label: string;
  color?: string;
  width?: number;
}> = ({ value, label, color = "#00ff88", width = 300 }) => {
  return (
    <div
      style={{
        width,
        padding: "24px 32px",
        background: `linear-gradient(135deg, ${color}15 0%, transparent 100%)`,
        borderLeft: `4px solid ${color}`,
        borderRadius: 12,
      }}
    >
      <div
        style={{
          fontSize: 48,
          fontWeight: 900,
          color,
          fontFamily: "system-ui, -apple-system, sans-serif",
          textShadow: `0 0 20px ${color}50`,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 18,
          color: "#888888",
          fontFamily: "system-ui, -apple-system, sans-serif",
          marginTop: 8,
          textTransform: "uppercase",
          letterSpacing: 2,
        }}
      >
        {label}
      </div>
    </div>
  );
};

// Progress bar
export const ProgressBar: React.FC<{
  progress: number; // 0-100
  delay?: number;
  height?: number;
  colors?: string[];
}> = ({ progress, delay = 0, height = 24, colors = ["#00ff88", "#00d4ff"] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const animatedProgress = interpolate(
    frame,
    [delay * fps, (delay + 1.5) * fps],
    [0, progress],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        width: "100%",
        height,
        background: "#1a1a2e",
        borderRadius: height / 2,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${animatedProgress}%`,
          height: "100%",
          background: `linear-gradient(90deg, ${colors.join(", ")})`,
          borderRadius: height / 2,
          boxShadow: `0 0 20px ${colors[0]}50`,
        }}
      />
    </div>
  );
};

// Title text component
export const Title: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  glow?: boolean;
}> = ({ children, size = 72, color = "#ffffff", glow = false }) => {
  return (
    <h1
      style={{
        fontSize: size,
        fontWeight: 900,
        color,
        fontFamily: "system-ui, -apple-system, sans-serif",
        margin: 0,
        textShadow: glow ? `0 0 40px ${color}50` : "none",
        lineHeight: 1.1,
      }}
    >
      {children}
    </h1>
  );
};

// Subtitle text
export const Subtitle: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
}> = ({ children, size = 32, color = "#888888" }) => {
  return (
    <p
      style={{
        fontSize: size,
        color,
        fontFamily: "system-ui, -apple-system, sans-serif",
        margin: 0,
        letterSpacing: 2,
      }}
    >
      {children}
    </p>
  );
};

// Accent text (for highlights)
export const AccentText: React.FC<{
  children: React.ReactNode;
  color?: string;
  size?: number;
}> = ({ children, color = "#00ff88", size = 48 }) => {
  return (
    <span
      style={{
        fontSize: size,
        fontWeight: 900,
        color,
        fontFamily: "system-ui, -apple-system, sans-serif",
        textShadow: `0 0 30px ${color}50`,
      }}
    >
      {children}
    </span>
  );
};

// Floating particles effect
export const FloatingParticles: React.FC<{
  count?: number;
  color?: string;
}> = ({ count = 20, color = "#00ff88" }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const particles = Array.from({ length: count }, (_, i) => {
    const seed = i * 137.5;
    const x = ((seed * 7) % width);
    const baseY = ((seed * 13) % height);
    const size = 2 + (seed % 4);
    const speed = 0.3 + (seed % 10) / 20;
    const y = (baseY - frame * speed) % height;

    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: x,
          top: y < 0 ? height + y : y,
          width: size,
          height: size,
          borderRadius: "50%",
          background: color,
          opacity: 0.3 + (seed % 5) / 10,
        }}
      />
    );
  });

  return <AbsoluteFill style={{ overflow: "hidden" }}>{particles}</AbsoluteFill>;
};
