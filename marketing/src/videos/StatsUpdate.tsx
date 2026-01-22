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

export type StatsUpdateProps = {
  headline: string;
  stats: Array<{
    value: string;
    numericValue?: number;
    prefix?: string;
    suffix?: string;
    label: string;
    color: string;
  }>;
  tagline: string;
  cta: string;
};

// Ultra-minimal film grain - barely visible texture for cinema feel
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

// Premium cinematic background - minimal, elegant
const CinematicBackground: React.FC<{
  accentColor?: string;
  intensity?: number;
  focusY?: number;
}> = ({ accentColor = "#00ff88", intensity = 0.025, focusY = 50 }) => {
  const frame = useCurrentFrame();

  // Imperceptible drift for organic feel
  const drift = interpolate(frame, [0, 600], [0, 1.2], {
    extrapolateRight: "clamp",
  });

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
      {/* Deep black base */}
      <AbsoluteFill style={{ background: "#020202" }} />

      {/* Subtle center gradient - restrained */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 75% 45% at 50% ${focusY + drift}%, ${hexToRgba(accentColor, intensity)} 0%, transparent 50%)`,
        }}
      />

      {/* Deep vignette for focus */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 20%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      <FilmGrain opacity={0.012} />
    </AbsoluteFill>
  );
};

// Scene 1: The Hook - Apple keynote style reveal with premium execution
// Precise timing, deliberate motion, cinematic presence
const IntroScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 0: Darkness to light - controlled, elegant power-on
  const powerOn = interpolate(
    frame,
    [0, fps * 0.08, fps * 0.12, fps * 0.18],
    [0, 0.02, 0.06, 1],
    { extrapolateRight: "clamp" }
  );

  // Phase 1: Soft center bloom - emerges from darkness
  const bloomOpacity = interpolate(
    frame,
    [fps * 0.05, fps * 0.15, fps * 0.4, fps * 0.7],
    [0, 0.7, 0.25, 0],
    { extrapolateRight: "clamp" }
  );
  const bloomScale = interpolate(
    frame,
    [fps * 0.05, fps * 0.7],
    [0.02, 3.5],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Horizontal light line - precise, cinematic reveal
  const lineWidth = interpolate(
    frame,
    [fps * 0.03, fps * 0.35],
    [0, 680],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const lineOpacity = interpolate(
    frame,
    [fps * 0.03, fps * 0.1, fps * 0.5, fps * 0.75],
    [0, 0.7, 0.2, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Logo entrance - confident, weighty appearance
  const logoDelay = 0.22;
  const logoProgress = spring({
    frame: frame - logoDelay * fps,
    fps,
    config: { damping: 200, stiffness: 45, mass: 1.5 },
  });
  const logoOpacity = interpolate(
    frame,
    [logoDelay * fps, (logoDelay + 0.25) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const logoScale = interpolate(logoProgress, [0, 1], [0.75, 1]);
  const logoGlow = interpolate(
    frame,
    [fps * 0.4, fps * 1.0, fps * 1.6],
    [0, 50, 38],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Single elegant ring - less is more
  const ringDelay = 0.4;
  const ringOpacity = interpolate(
    frame,
    [ringDelay * fps, (ringDelay + 0.1) * fps, fps * 1.3, fps * 1.7],
    [0, 0.2, 0.08, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ringScale = interpolate(
    frame,
    [ringDelay * fps, fps * 1.7],
    [0.6, 2.8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // $FED text - unified entrance with gravitas
  const textDelay = 0.52;
  const textProgress = spring({
    frame: frame - textDelay * fps,
    fps,
    config: { damping: 200, stiffness: 55, mass: 1.3 },
  });
  const textOpacity = interpolate(
    frame,
    [textDelay * fps, (textDelay + 0.28) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const textY = interpolate(textProgress, [0, 1], [25, 0]);
  const textScale = interpolate(textProgress, [0, 1], [0.88, 1]);

  // Tagline - refined, appears last
  const tagDelay = 1.0;
  const tagOpacity = interpolate(
    frame,
    [tagDelay * fps, (tagDelay + 0.3) * fps],
    [0, 0.65],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const tagY = interpolate(
    frame,
    [tagDelay * fps, (tagDelay + 0.35) * fps],
    [8, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Background glow - subtle, building
  const bgGlow = interpolate(
    frame,
    [fps * 0.2, fps * 1.2],
    [0.008, 0.035],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ opacity: powerOn }}>
      <CinematicBackground accentColor="#00ff88" intensity={bgGlow} focusY={50} />

      {/* Light effects - cinematic precision */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        {/* Horizontal light line - elegant reveal */}
        <div
          style={{
            width: lineWidth,
            height: 1.5,
            background: "linear-gradient(90deg, transparent 0%, rgba(0,255,136,0.25) 20%, rgba(255,255,255,0.85) 50%, rgba(0,255,136,0.25) 80%, transparent 100%)",
            opacity: lineOpacity,
            position: "absolute",
            boxShadow: "0 0 25px rgba(0, 255, 136, 0.25)",
          }}
        />

        {/* Central bloom - soft, organic */}
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(0,255,136,0.4) 30%, rgba(0,255,136,0.1) 55%, transparent 75%)",
            opacity: bloomOpacity,
            transform: `scale(${bloomScale})`,
            position: "absolute",
          }}
        />

        {/* Single expanding ring - elegant restraint */}
        <div
          style={{
            position: "absolute",
            width: 130,
            height: 130,
            borderRadius: "50%",
            border: "1px solid rgba(0, 255, 136, 0.25)",
            transform: `scale(${ringScale})`,
            opacity: ringOpacity,
          }}
        />
      </AbsoluteFill>

      {/* Main content */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          {/* Logo - commanding */}
          <div
            style={{
              transform: `scale(${logoScale})`,
              opacity: logoOpacity,
              filter: `drop-shadow(0 0 ${logoGlow}px rgba(0, 255, 136, 0.5))`,
            }}
          >
            <FedLogo size={110} glow={false} />
          </div>

          {/* $FED text - bold, unified */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              opacity: textOpacity,
              transform: `translateY(${textY}px) scale(${textScale})`,
            }}
          >
            <span
              style={{
                fontSize: 56,
                fontWeight: 900,
                color: "#00dd77",
                fontFamily: "system-ui, -apple-system, sans-serif",
                textShadow: "0 0 28px rgba(0, 255, 136, 0.4)",
              }}
            >
              $
            </span>
            <span
              style={{
                fontSize: 56,
                fontWeight: 900,
                color: "#ffffff",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -2.5,
                textShadow: "0 5px 35px rgba(0, 0, 0, 0.5)",
              }}
            >
              FED
            </span>
          </div>

          {/* Tagline - whisper quiet, refined */}
          <div
            style={{
              opacity: tagOpacity,
              transform: `translateY(${tagY}px)`,
              marginTop: 2,
            }}
          >
            <span
              style={{
                fontSize: 10,
                color: "#4a4a4a",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: 4,
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              Quantitative Easing for the People
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 2: Headline with powerful BRRR payoff
// Cinematic word reveals, impactful BRRR moment - weight over chaos
const HeadlineScene: React.FC<{ headline: string }> = ({ headline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = headline.split(" ");
  const brrrIndex = words.findIndex(w => w === "BRRR");

  // Scene fade - smooth entrance
  const sceneFade = interpolate(frame, [0, fps * 0.1], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Word timing - measured stagger for rhythm
  const wordStagger = 0.11;
  const brrrDelay = 0.08 + brrrIndex * wordStagger;
  const brrrLandTime = (brrrDelay + 0.08) * fps;

  // Subtle camera push on BRRR - weight without chaos
  const cameraScale = interpolate(
    frame,
    [brrrLandTime - fps * 0.05, brrrLandTime + fps * 0.02, brrrLandTime + fps * 0.15],
    [1, 1.015, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Background glow burst on BRRR - controlled flash
  const bgGlow = interpolate(
    frame,
    [fps * 0.05, brrrLandTime - fps * 0.03, brrrLandTime + fps * 0.03, brrrLandTime + fps * 0.2, fps * 1.2],
    [0.012, 0.02, 0.08, 0.04, 0.035],
    { extrapolateRight: "clamp" }
  );

  // Single elegant shockwave - restraint
  const shockOpacity = interpolate(
    frame,
    [brrrLandTime, brrrLandTime + fps * 0.04, brrrLandTime + fps * 0.35],
    [0.5, 0.2, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const shockScale = interpolate(
    frame,
    [brrrLandTime, brrrLandTime + fps * 0.35],
    [0.3, 2.8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00ff88" intensity={bgGlow} focusY={48} />

      {/* Shockwave - single, elegant */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: "50%",
            border: "1.5px solid rgba(0, 255, 136, 0.5)",
            opacity: shockOpacity,
            transform: `scale(${shockScale})`,
            position: "absolute",
            boxShadow: "0 0 20px rgba(0, 255, 136, 0.2)",
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 70,
          transform: `scale(${cameraScale})`,
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0 22px",
            maxWidth: 980,
          }}
        >
          {words.map((word, index) => {
            const delay = 0.08 + index * wordStagger;
            const wordProgress = spring({
              frame: frame - delay * fps,
              fps,
              config: { damping: 200, stiffness: 80, mass: 1.2 },
            });
            const wordOpacity = interpolate(
              frame,
              [delay * fps, (delay + 0.15) * fps],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const wordY = interpolate(wordProgress, [0, 1], [30, 0]);

            const isBrrr = word === "BRRR";

            // BRRR scale - confident punch, controlled overshoot
            const brrrScale = isBrrr ? interpolate(
              frame,
              [delay * fps, (delay + 0.02) * fps, (delay + 0.08) * fps, (delay + 0.18) * fps],
              [0.6, 1.12, 0.96, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ) : 1;

            // BRRR glow - builds then settles
            const brrrGlow = isBrrr ? interpolate(
              frame,
              [(delay + 0.02) * fps, (delay + 0.06) * fps, (delay + 0.2) * fps, fps * 1.1],
              [0, 65, 35, 25],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ) : 0;

            return (
              <span
                key={index}
                style={{
                  fontSize: isBrrr ? 82 : 68,
                  fontWeight: 900,
                  color: isBrrr ? "#00dd77" : "#ffffff",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  opacity: wordOpacity,
                  transform: `translateY(${wordY}px) scale(${brrrScale})`,
                  display: "inline-block",
                  letterSpacing: -3.5,
                  lineHeight: 1.15,
                  textShadow: isBrrr
                    ? `0 0 ${brrrGlow}px rgba(0, 255, 136, 0.45)`
                    : "0 4px 35px rgba(0, 0, 0, 0.45)",
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Stat card with premium counting animation
// Luxurious easing, refined visual hierarchy, understated elegance
const StatCard: React.FC<{
  stat: StatsUpdateProps["stats"][0];
  delay: number;
  index: number;
}> = ({ stat, delay, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card entrance - smooth, weighty
  const cardProgress = spring({
    frame: frame - delay * fps,
    fps,
    config: { damping: 200, stiffness: 50, mass: 1.4 },
  });

  const cardOpacity = interpolate(
    frame,
    [delay * fps, (delay + 0.22) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const cardY = interpolate(cardProgress, [0, 1], [40, 0]);
  const cardScale = interpolate(cardProgress, [0, 1], [0.92, 1]);

  // Number counting - smooth, satisfying easing curve
  const countDuration = 1.4;
  const countStart = delay + 0.18;
  const numberProgress = interpolate(
    frame,
    [countStart * fps, (countStart + countDuration) * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      // Smooth ease-out with satisfying deceleration
      easing: (t) => 1 - Math.pow(1 - t, 5),
    }
  );

  // Parse value
  const numericValue = stat.numericValue ?? (parseFloat(stat.value.replace(/[^0-9.]/g, "")) || 0);
  const displayValue = Math.floor(numericValue * numberProgress);
  const prefix = stat.prefix ?? (stat.value.startsWith("$") ? "$" : "");
  const suffix = stat.suffix ?? (stat.value.includes("+") ? "+" : "");

  // Landing celebration
  const hasLanded = numberProgress >= 0.98;
  const landTime = (countStart + countDuration) * fps;

  // Scale pulse on landing - subtle, satisfying
  const landPulse = hasLanded ? interpolate(
    frame,
    [landTime - fps * 0.02, landTime + fps * 0.04, landTime + fps * 0.15],
    [1, 1.04, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 1;

  // Number glow - subtle build then settle
  const numberGlow = hasLanded ? interpolate(
    frame,
    [landTime - fps * 0.05, landTime + fps * 0.05, landTime + fps * 0.4],
    [12, 32, 14],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : interpolate(
    frame,
    [(countStart + 0.3) * fps, (countStart + countDuration) * fps],
    [0, 14],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Top accent bar - draws across elegantly
  const accentWidth = interpolate(
    frame,
    [(delay + 0.08) * fps, (delay + 0.4) * fps],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Card border glow - subtle ambient
  const borderOpacity = interpolate(
    frame,
    [(delay + 0.1) * fps, (delay + 0.5) * fps],
    [0.03, 0.06],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Label opacity - fades in with card
  const labelOpacity = interpolate(
    frame,
    [(delay + 0.22) * fps, (delay + 0.4) * fps],
    [0, 0.85],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Color conversion - muted palette
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : "0, 255, 136";
  };
  const accentRgb = hexToRgb(stat.color);

  // Muted color for text - less saturated
  const mutedColor = stat.color === "#00ff88" ? "#00dd77" :
                     stat.color === "#00d4ff" ? "#00bbdd" :
                     stat.color === "#ff6b9d" ? "#dd5588" : stat.color;

  return (
    <div
      style={{
        transform: `translateY(${cardY}px) scale(${cardScale})`,
        opacity: cardOpacity,
        position: "relative",
      }}
    >
      <div
        style={{
          padding: "26px 36px",
          background: `linear-gradient(165deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.008) 100%)`,
          borderRadius: 14,
          minWidth: 265,
          position: "relative",
          overflow: "hidden",
          border: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
          boxShadow: `
            0 20px 50px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.04)
          `,
        }}
      >
        {/* Top accent bar - elegant line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${accentWidth}%`,
            height: 1.5,
            background: `linear-gradient(90deg, ${mutedColor}cc 0%, ${mutedColor}40 75%, transparent 100%)`,
            borderRadius: "14px 0 0 0",
          }}
        />

        {/* Number */}
        <div
          style={{
            fontSize: 50,
            fontWeight: 900,
            color: "#ffffff",
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: -2.5,
            lineHeight: 1,
            marginBottom: 12,
            transform: `scale(${landPulse})`,
            transformOrigin: "left center",
            filter: `drop-shadow(0 0 ${numberGlow}px rgba(${accentRgb}, 0.35))`,
          }}
        >
          <span
            style={{
              color: mutedColor,
            }}
          >
            {prefix}
          </span>
          {displayValue.toLocaleString()}
          <span
            style={{
              color: "#333333",
              fontSize: 20,
              fontWeight: 700,
              marginLeft: 2,
            }}
          >
            {suffix}
          </span>
        </div>

        {/* Label */}
        <div
          style={{
            opacity: labelOpacity,
          }}
        >
          <div
            style={{
              fontSize: 9,
              color: "#4a4a4a",
              fontFamily: "system-ui, -apple-system, sans-serif",
              textTransform: "uppercase",
              letterSpacing: 2.5,
              fontWeight: 600,
            }}
          >
            {stat.label}
          </div>
        </div>
      </div>
    </div>
  );
};

// Scene 3: Stats showcase - refined layout, perfect rhythm
const StatsScene: React.FC<{ stats: StatsUpdateProps["stats"] }> = ({ stats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneFade = interpolate(frame, [0, fps * 0.12], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Card stagger for rhythm
  const cardStagger = 0.25;

  // Header - refined, appears first
  const headerOpacity = interpolate(frame, [fps * 0.04, fps * 0.2], [0, 0.7], {
    extrapolateRight: "clamp",
  });
  const headerY = interpolate(
    frame,
    [fps * 0.04, fps * 0.25],
    [10, 0],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Background glow - subtle, builds with content
  const bgGlow = interpolate(
    frame,
    [fps * 0.1, fps * 2.5],
    [0.012, 0.038],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00ff88" intensity={bgGlow} focusY={48} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 50,
          flexDirection: "column",
          gap: 38,
        }}
      >
        {/* Header - refined */}
        <div
          style={{
            opacity: headerOpacity,
            transform: `translateY(${headerY}px)`,
          }}
        >
          <span
            style={{
              fontSize: 10,
              color: "#4a4a4a",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 4.5,
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            Live Metrics
          </span>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: 26,
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 940,
          }}
        >
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              stat={stat}
              delay={0.15 + index * cardStagger}
              index={index}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 4: CTA - Commanding, confident close
// Premium button design, perfect pacing, memorable exit
const CTAScene: React.FC<{ tagline: string; cta: string }> = ({ tagline, cta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneFade = interpolate(frame, [0, fps * 0.12], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Background glow - subtle, building
  const bgIntensity = interpolate(
    frame,
    [0, fps * 1.2],
    [0.012, 0.04],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Logo entrance - commanding presence
  const logoProgress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 50, mass: 1.3 },
  });
  const logoOpacity = interpolate(frame, [0, fps * 0.2], [0, 1], {
    extrapolateRight: "clamp",
  });
  const logoScale = interpolate(logoProgress, [0, 1], [0.8, 1]);
  const logoGlow = interpolate(
    frame,
    [fps * 0.15, fps * 0.6, fps * 1.0],
    [0, 42, 32],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Single expanding ring - elegant restraint
  const ringOpacity = interpolate(
    frame,
    [fps * 0.08, fps * 0.18, fps * 1.0, fps * 1.5],
    [0, 0.18, 0.06, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ringScale = interpolate(
    frame,
    [fps * 0.08, fps * 1.5],
    [0.5, 2.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Tagline - refined timing
  const taglineOpacity = interpolate(
    frame,
    [fps * 0.28, fps * 0.5],
    [0, 0.85],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const taglineY = interpolate(
    frame,
    [fps * 0.28, fps * 0.55],
    [10, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // CTA button - the hero moment
  const ctaDelay = fps * 0.5;
  const ctaProgress = spring({
    frame: frame - ctaDelay,
    fps,
    config: { damping: 200, stiffness: 60, mass: 1.2 },
  });
  const ctaOpacity = interpolate(
    frame,
    [ctaDelay, ctaDelay + fps * 0.22],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ctaY = interpolate(ctaProgress, [0, 1], [28, 0]);
  const ctaScale = interpolate(ctaProgress, [0, 1], [0.9, 1]);

  // CTA land pulse - subtle, satisfying
  const ctaLandTime = ctaDelay + fps * 0.32;
  const ctaLandPulse = frame > ctaLandTime ? interpolate(
    frame,
    [ctaLandTime, ctaLandTime + fps * 0.08, ctaLandTime + fps * 0.2],
    [1, 1.03, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 1;

  // CTA glow - subtle build
  const ctaGlow = interpolate(
    frame,
    [ctaDelay + fps * 0.15, fps * 1.2, fps * 1.8],
    [0, 0.9, 0.7],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Shimmer - subtle premium sweep
  const ctaShimmerDelay = ctaDelay + fps * 0.4;
  const ctaShimmerProgress = interpolate(
    frame,
    [ctaShimmerDelay, ctaShimmerDelay + fps * 0.5],
    [-30, 130],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const ctaShimmerOpacity = interpolate(
    frame,
    [ctaShimmerDelay, ctaShimmerDelay + fps * 0.1, ctaShimmerDelay + fps * 0.4, ctaShimmerDelay + fps * 0.5],
    [0, 0.35, 0.2, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Bottom text - confident close
  const bottomOpacity = interpolate(
    frame,
    [fps * 1.0, fps * 1.25],
    [0, 0.75],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const bottomY = interpolate(
    frame,
    [fps * 1.0, fps * 1.3],
    [8, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00ff88" intensity={bgIntensity} focusY={50} />

      {/* Subtle ambient glow behind CTA */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 50% 38% at 50% 54%, rgba(0, 220, 120, ${0.03 * ctaGlow}) 0%, transparent 55%)`,
        }}
      />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 22,
          flexDirection: "column",
        }}
      >
        {/* Logo with expanding ring */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 90,
              height: 90,
              borderRadius: "50%",
              border: "1px solid rgba(0, 255, 136, 0.2)",
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
            <FedLogo size={80} glow={false} />
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
          }}
        >
          <span
            style={{
              fontSize: 18,
              color: "#505050",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 400,
              letterSpacing: 0.2,
            }}
          >
            {tagline}
          </span>
        </div>

        {/* CTA Button - sophisticated, muted green */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px) scale(${ctaScale * ctaLandPulse})`,
          }}
        >
          <div
            style={{
              padding: "18px 55px",
              background: "linear-gradient(165deg, #00dd88 0%, #00cc77 50%, #00bb66 100%)",
              borderRadius: 44,
              position: "relative",
              overflow: "hidden",
              boxShadow: `
                0 12px 40px rgba(0, 200, 120, ${0.28 + 0.15 * ctaGlow}),
                0 0 ${35 * ctaGlow}px rgba(0, 200, 120, ${0.08 * ctaGlow}),
                inset 0 1px 0 rgba(255, 255, 255, 0.22)
              `,
            }}
          >
            {/* Shimmer - subtle */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: `${ctaShimmerProgress}%`,
                width: "35%",
                height: "100%",
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)",
                opacity: ctaShimmerOpacity,
                pointerEvents: "none",
              }}
            />
            {/* Inner shine - top edge */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "45%",
                background: "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)",
                borderRadius: "44px 44px 0 0",
                pointerEvents: "none",
              }}
            />
            <span
              style={{
                fontSize: 30,
                fontWeight: 900,
                color: "#020202",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -0.3,
                textShadow: "0 1px 0 rgba(255, 255, 255, 0.25)",
                position: "relative",
              }}
            >
              {cta}
            </span>
          </div>
        </div>

        {/* Bottom text - refined */}
        <div
          style={{
            opacity: bottomOpacity,
            transform: `translateY(${bottomY}px)`,
            marginTop: 10,
          }}
        >
          <span
            style={{
              fontSize: 9,
              color: "#444444",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 4,
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

// Main composition - 10 seconds with perfect scene timing
export const StatsUpdate: React.FC<StatsUpdateProps> = ({
  headline,
  stats,
  tagline,
  cta,
}) => {
  const { fps } = useVideoConfig();

  // Transition timing - quick, seamless
  const transitionFrames = Math.round(0.2 * fps);

  return (
    <TransitionSeries>
      {/* Intro: 1.8s - powerful logo reveal */}
      <TransitionSeries.Sequence durationInFrames={Math.round(1.8 * fps)}>
        <IntroScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* Headline: 1.5s - explosive BRRR moment */}
      <TransitionSeries.Sequence durationInFrames={Math.round(1.5 * fps)}>
        <HeadlineScene headline={headline} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* Stats: 3.9s - numbers breathe and land */}
      <TransitionSeries.Sequence durationInFrames={Math.round(3.9 * fps)}>
        <StatsScene stats={stats} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* CTA: 2.8s - confident, memorable close */}
      <TransitionSeries.Sequence durationInFrames={Math.round(2.8 * fps)}>
        <CTAScene tagline={tagline} cta={cta} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
