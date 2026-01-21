import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from "remotion";
import React from "react";

// Reusable spring configs
export const SPRING_CONFIGS = {
  smooth: { damping: 200 },
  snappy: { damping: 20, stiffness: 200 },
  bouncy: { damping: 8 },
  heavy: { damping: 15, stiffness: 80, mass: 2 },
};

// Fade In component
export const FadeIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}> = ({ children, delay = 0, duration = 0.5 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(
    frame,
    [delay * fps, (delay + duration) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return <div style={{ opacity }}>{children}</div>;
};

// Scale In with spring
export const ScaleIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  config?: keyof typeof SPRING_CONFIGS;
}> = ({ children, delay = 0, config = "snappy" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - delay * fps,
    fps,
    config: SPRING_CONFIGS[config],
  });

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: "center" }}>
      {children}
    </div>
  );
};

// Slide In from direction
export const SlideIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  direction?: "left" | "right" | "top" | "bottom";
  distance?: number;
}> = ({ children, delay = 0, direction = "bottom", distance = 100 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay * fps,
    fps,
    config: SPRING_CONFIGS.smooth,
  });

  const transforms = {
    left: `translateX(${interpolate(progress, [0, 1], [-distance, 0])}px)`,
    right: `translateX(${interpolate(progress, [0, 1], [distance, 0])}px)`,
    top: `translateY(${interpolate(progress, [0, 1], [-distance, 0])}px)`,
    bottom: `translateY(${interpolate(progress, [0, 1], [distance, 0])}px)`,
  };

  return (
    <div style={{ transform: transforms[direction], opacity: progress }}>
      {children}
    </div>
  );
};

// Typewriter effect
export const Typewriter: React.FC<{
  text: string;
  delay?: number;
  speed?: number; // chars per second
  style?: React.CSSProperties;
}> = ({ text, delay = 0, speed = 20, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const startFrame = delay * fps;
  const charsPerFrame = speed / fps;
  const visibleChars = Math.floor((frame - startFrame) * charsPerFrame);
  const displayText = text.slice(0, Math.max(0, visibleChars));

  return <span style={style}>{displayText}</span>;
};

// Counter animation
export const AnimatedNumber: React.FC<{
  value: number;
  delay?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  style?: React.CSSProperties;
}> = ({ value, delay = 0, duration = 1, prefix = "", suffix = "", style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = interpolate(
    frame,
    [delay * fps, (delay + duration) * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  const displayValue = Math.floor(value * progress);

  return (
    <span style={style}>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
};

// Glow pulse effect
export const GlowPulse: React.FC<{
  children: React.ReactNode;
  color?: string;
  intensity?: number;
}> = ({ children, color = "#00ff88", intensity = 30 }) => {
  const frame = useCurrentFrame();

  const glow = interpolate(frame % 60, [0, 30, 60], [intensity * 0.5, intensity, intensity * 0.5]);

  return (
    <div style={{ filter: `drop-shadow(0 0 ${glow}px ${color})` }}>
      {children}
    </div>
  );
};

// 3D tilt effect
export const Tilt3D: React.FC<{
  children: React.ReactNode;
  rotateX?: number;
  rotateY?: number;
  perspective?: number;
}> = ({ children, rotateX = 0, rotateY = 0, perspective = 1000 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const animatedRotateY = interpolate(
    frame,
    [0, durationInFrames],
    [rotateY, -rotateY]
  );

  return (
    <div style={{ perspective }}>
      <div
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${animatedRotateY}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </div>
    </div>
  );
};
