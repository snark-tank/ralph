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

  // Phase 0: Extended darkness, then controlled power-on
  // First few frames are near-black to build tension
  const powerOn = interpolate(
    frame,
    [0, fps * 0.1, fps * 0.18, fps * 0.28],
    [0, 0.02, 0.1, 1],
    { extrapolateRight: "clamp" }
  );

  // Phase 1: Single point of light emerges from center
  const pointLightOpacity = interpolate(
    frame,
    [fps * 0.05, fps * 0.15, fps * 0.4, fps * 0.6],
    [0, 1, 0.55, 0],
    { extrapolateRight: "clamp" }
  );
  const pointLightScale = interpolate(
    frame,
    [fps * 0.05, fps * 0.6],
    [0, 4],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }
  );

  // Horizontal line of light - the "reveal" moment
  const lineWidth = interpolate(
    frame,
    [fps * 0.08, fps * 0.45],
    [0, 800],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const lineOpacity = interpolate(
    frame,
    [fps * 0.08, fps * 0.15, fps * 0.55, fps * 0.8],
    [0, 0.85, 0.25, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const lineThickness = interpolate(
    frame,
    [fps * 0.08, fps * 0.2, fps * 0.5],
    [0.5, 2, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Logo entrance - emerges from the light with weight
  const logoDelay = 0.28;
  const logoProgress = spring({
    frame: frame - logoDelay * fps,
    fps,
    config: { damping: 180, stiffness: 40, mass: 1.6 },
  });
  const logoOpacity = interpolate(
    frame,
    [logoDelay * fps, (logoDelay + 0.18) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const logoScale = interpolate(logoProgress, [0, 1], [0.7, 1]);
  const logoGlow = interpolate(
    frame,
    [fps * 0.35, fps * 0.7, fps * 1.5],
    [0, 45, 30],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // $FED text - unified entrance with gravitas
  const textDelay = 0.55;
  const textProgress = spring({
    frame: frame - textDelay * fps,
    fps,
    config: { damping: 200, stiffness: 50, mass: 1.4 },
  });
  const textOpacity = interpolate(
    frame,
    [textDelay * fps, (textDelay + 0.25) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const textY = interpolate(textProgress, [0, 1], [20, 0]);
  const textScale = interpolate(textProgress, [0, 1], [0.92, 1]);

  // Tagline - refined, appears last
  const tagDelay = 1.05;
  const tagOpacity = interpolate(
    frame,
    [tagDelay * fps, (tagDelay + 0.35) * fps],
    [0, 0.55],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const tagY = interpolate(
    frame,
    [tagDelay * fps, (tagDelay + 0.4) * fps],
    [6, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Background glow - barely perceptible, builds with content
  const bgGlow = interpolate(
    frame,
    [fps * 0.2, fps * 1.4],
    [0.005, 0.028],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ opacity: powerOn }}>
      <CinematicBackground accentColor="#00cc77" intensity={bgGlow} focusY={50} />

      {/* Light effects layer - the "reveal" magic */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        {/* Central point light - the first spark */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(0,210,136,0.5) 25%, rgba(0,180,100,0.15) 50%, transparent 70%)",
            opacity: pointLightOpacity,
            transform: `scale(${pointLightScale})`,
            position: "absolute",
          }}
        />

        {/* Horizontal light line - cinematic reveal bar */}
        <div
          style={{
            width: lineWidth,
            height: lineThickness,
            background: "linear-gradient(90deg, transparent 0%, rgba(0,200,120,0.2) 15%, rgba(255,255,255,0.9) 50%, rgba(0,200,120,0.2) 85%, transparent 100%)",
            opacity: lineOpacity,
            position: "absolute",
            boxShadow: "0 0 30px rgba(0, 200, 120, 0.3), 0 0 60px rgba(0, 180, 100, 0.15)",
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
            gap: 14,
          }}
        >
          {/* Logo - the hero element */}
          <div
            style={{
              transform: `scale(${logoScale})`,
              opacity: logoOpacity,
              filter: `drop-shadow(0 0 ${logoGlow}px rgba(0, 200, 120, 0.55))`,
            }}
          >
            <FedLogo size={105} glow={false} />
          </div>

          {/* $FED wordmark - tight kerning, unified mark */}
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
                fontSize: 54,
                fontWeight: 900,
                color: "#00c872",
                fontFamily: "system-ui, -apple-system, sans-serif",
                textShadow: "0 0 25px rgba(0, 200, 114, 0.45)",
                marginRight: -3,
              }}
            >
              $
            </span>
            <span
              style={{
                fontSize: 54,
                fontWeight: 900,
                color: "#ffffff",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -3,
                textShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
              }}
            >
              FED
            </span>
          </div>

          {/* Tagline - subtle, elegant whisper */}
          <div
            style={{
              opacity: tagOpacity,
              transform: `translateY(${tagY}px)`,
              marginTop: 4,
            }}
          >
            <span
              style={{
                fontSize: 10,
                color: "#3d3d3d",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: 4.5,
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
      <CinematicBackground accentColor="#00c872" intensity={bgGlow} focusY={48} />

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
            border: "1.5px solid rgba(0, 200, 120, 0.45)",
            opacity: shockOpacity,
            transform: `scale(${shockScale})`,
            position: "absolute",
            boxShadow: "0 0 25px rgba(0, 200, 120, 0.2)",
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
                  fontSize: isBrrr ? 80 : 66,
                  fontWeight: 900,
                  color: isBrrr ? "#00c872" : "#ffffff",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  opacity: wordOpacity,
                  transform: `translateY(${wordY}px) scale(${brrrScale})`,
                  display: "inline-block",
                  letterSpacing: -3.5,
                  lineHeight: 1.15,
                  textShadow: isBrrr
                    ? `0 0 ${brrrGlow}px rgba(0, 200, 114, 0.5)`
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

  // Number counting - premium easing with dramatic deceleration
  // Numbers spin fast at first, then slow dramatically as they approach final value
  const countDuration = 1.6;
  const countStart = delay + 0.15;
  const numberProgress = interpolate(
    frame,
    [countStart * fps, (countStart + countDuration) * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      // Custom easing: fast start, dramatic slowdown - the "slot machine landing"
      easing: (t) => {
        // Combination of exponential and cubic for satisfying deceleration
        const exp = 1 - Math.pow(1 - t, 6);
        const cubic = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        return 0.7 * exp + 0.3 * cubic;
      },
    }
  );

  // Parse value
  const numericValue = stat.numericValue ?? (parseFloat(stat.value.replace(/[^0-9.]/g, "")) || 0);
  const displayValue = Math.floor(numericValue * numberProgress);
  const prefix = stat.prefix ?? (stat.value.startsWith("$") ? "$" : "");
  const suffix = stat.suffix ?? (stat.value.includes("+") ? "+" : "");

  // Landing celebration - the moment of payoff
  const hasLanded = numberProgress >= 0.97;
  const landTime = (countStart + countDuration) * fps;

  // Scale pulse on landing - subtle but noticeable
  const landPulse = hasLanded ? interpolate(
    frame,
    [landTime - fps * 0.03, landTime + fps * 0.05, landTime + fps * 0.18],
    [1, 1.035, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 1;

  // Number glow - builds during count, flares on landing, settles elegantly
  const countGlow = interpolate(
    frame,
    [(countStart + 0.2) * fps, (countStart + countDuration * 0.7) * fps, landTime],
    [0, 10, 12],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const landGlow = hasLanded ? interpolate(
    frame,
    [landTime - fps * 0.05, landTime + fps * 0.06, landTime + fps * 0.35],
    [12, 28, 12],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : 0;
  const numberGlow = hasLanded ? landGlow : countGlow;

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

  // Muted color for text - sophisticated, less saturated
  const mutedColor = stat.color === "#00ff88" ? "#00c872" :
                     stat.color === "#00d4ff" ? "#00b8d4" :
                     stat.color === "#ff6b9d" ? "#e85a8a" : stat.color;

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
          padding: "28px 38px",
          background: `linear-gradient(168deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.006) 100%)`,
          borderRadius: 16,
          minWidth: 270,
          position: "relative",
          overflow: "hidden",
          border: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
          boxShadow: `
            0 24px 60px rgba(0, 0, 0, 0.55),
            0 8px 20px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.04)
          `,
        }}
      >
        {/* Top accent bar - elegant line with glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${accentWidth}%`,
            height: 2,
            background: `linear-gradient(90deg, ${mutedColor} 0%, ${mutedColor}80 60%, transparent 100%)`,
            borderRadius: "16px 0 0 0",
            boxShadow: `0 0 12px ${mutedColor}40`,
          }}
        />

        {/* Number - the hero element */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 900,
            color: "#ffffff",
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: -2.8,
            lineHeight: 1,
            marginBottom: 14,
            transform: `scale(${landPulse})`,
            transformOrigin: "left center",
            filter: `drop-shadow(0 0 ${numberGlow}px rgba(${accentRgb}, 0.4))`,
          }}
        >
          <span
            style={{
              color: mutedColor,
              marginRight: -2,
            }}
          >
            {prefix}
          </span>
          {displayValue.toLocaleString()}
          <span
            style={{
              color: "#2a2a2a",
              fontSize: 18,
              fontWeight: 700,
              marginLeft: 3,
            }}
          >
            {suffix}
          </span>
        </div>

        {/* Label - understated elegance */}
        <div
          style={{
            opacity: labelOpacity,
          }}
        >
          <div
            style={{
              fontSize: 9,
              color: "#3a3a3a",
              fontFamily: "system-ui, -apple-system, sans-serif",
              textTransform: "uppercase",
              letterSpacing: 2.8,
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

  const sceneFade = interpolate(frame, [0, fps * 0.1], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Card stagger for rhythm - measured, intentional
  const cardStagger = 0.28;

  // Header - refined, appears first
  const headerOpacity = interpolate(frame, [fps * 0.03, fps * 0.18], [0, 0.6], {
    extrapolateRight: "clamp",
  });
  const headerY = interpolate(
    frame,
    [fps * 0.03, fps * 0.22],
    [8, 0],
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
      <CinematicBackground accentColor="#00c872" intensity={bgGlow} focusY={48} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 50,
          flexDirection: "column",
          gap: 40,
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
              color: "#3a3a3a",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 5,
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
      <CinematicBackground accentColor="#00c872" intensity={bgIntensity} focusY={50} />

      {/* Subtle ambient glow behind CTA - builds dramatically */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 55% 40% at 50% 52%, rgba(0, 200, 114, ${0.025 * ctaGlow}) 0%, transparent 60%)`,
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
        {/* Logo with expanding ring - commanding presence */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 85,
              height: 85,
              borderRadius: "50%",
              border: "1px solid rgba(0, 200, 120, 0.18)",
              transform: `translate(-50%, -50%) scale(${ringScale})`,
              opacity: ringOpacity,
            }}
          />
          <div
            style={{
              transform: `scale(${logoScale})`,
              opacity: logoOpacity,
              filter: `drop-shadow(0 0 ${logoGlow}px rgba(0, 200, 120, 0.5))`,
            }}
          >
            <FedLogo size={75} glow={false} />
          </div>
        </div>

        {/* Tagline - refined, understated */}
        <div
          style={{
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
          }}
        >
          <span
            style={{
              fontSize: 17,
              color: "#454545",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 400,
              letterSpacing: 0.3,
            }}
          >
            {tagline}
          </span>
        </div>

        {/* CTA Button - premium, sophisticated green */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px) scale(${ctaScale * ctaLandPulse})`,
          }}
        >
          <div
            style={{
              padding: "17px 52px",
              background: "linear-gradient(168deg, #00d080 0%, #00c070 45%, #00b065 100%)",
              borderRadius: 50,
              position: "relative",
              overflow: "hidden",
              boxShadow: `
                0 14px 45px rgba(0, 180, 100, ${0.3 + 0.12 * ctaGlow}),
                0 6px 20px rgba(0, 160, 90, ${0.2 + 0.1 * ctaGlow}),
                0 0 ${30 * ctaGlow}px rgba(0, 200, 110, ${0.06 * ctaGlow}),
                inset 0 1px 0 rgba(255, 255, 255, 0.2)
              `,
            }}
          >
            {/* Shimmer - elegant sweep */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: `${ctaShimmerProgress}%`,
                width: "30%",
                height: "100%",
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%)",
                opacity: ctaShimmerOpacity,
                pointerEvents: "none",
              }}
            />
            {/* Inner shine - top edge highlight */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "48%",
                background: "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, transparent 100%)",
                borderRadius: "50px 50px 0 0",
                pointerEvents: "none",
              }}
            />
            <span
              style={{
                fontSize: 28,
                fontWeight: 900,
                color: "#020202",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -0.5,
                textShadow: "0 1px 0 rgba(255, 255, 255, 0.22)",
                position: "relative",
              }}
            >
              {cta}
            </span>
          </div>
        </div>

        {/* Bottom text - confident close */}
        <div
          style={{
            opacity: bottomOpacity,
            transform: `translateY(${bottomY}px)`,
            marginTop: 12,
          }}
        >
          <span
            style={{
              fontSize: 9,
              color: "#3a3a3a",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 4.5,
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
// Total: 2.0 + 1.4 + 4.0 + 2.6 = 10s (transitions overlap so duration adds up)
export const StatsUpdate: React.FC<StatsUpdateProps> = ({
  headline,
  stats,
  tagline,
  cta,
}) => {
  const { fps } = useVideoConfig();

  // Transition timing - quick, elegant
  const transitionFrames = Math.round(0.25 * fps);

  return (
    <TransitionSeries>
      {/* Intro: 2.0s - dramatic logo reveal with breathing room */}
      <TransitionSeries.Sequence durationInFrames={Math.round(2.0 * fps)}>
        <IntroScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* Headline: 1.4s - punchy BRRR moment */}
      <TransitionSeries.Sequence durationInFrames={Math.round(1.4 * fps)}>
        <HeadlineScene headline={headline} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* Stats: 4.0s - numbers count up and land satisfyingly */}
      <TransitionSeries.Sequence durationInFrames={Math.round(4.0 * fps)}>
        <StatsScene stats={stats} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* CTA: 2.6s - confident, memorable close */}
      <TransitionSeries.Sequence durationInFrames={Math.round(2.6 * fps)}>
        <CTAScene tagline={tagline} cta={cta} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
