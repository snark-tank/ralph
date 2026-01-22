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

  // Phase 1: Light ignition - precise, controlled bloom
  const ignitionTime = fps * 0.06;
  const bloomOpacity = interpolate(
    frame,
    [ignitionTime, ignitionTime + fps * 0.04, fps * 0.28, fps * 0.55],
    [0, 0.95, 0.4, 0],
    { extrapolateRight: "clamp" }
  );
  const bloomScale = interpolate(
    frame,
    [ignitionTime, fps * 0.55],
    [0.01, 4.0],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.exp) }
  );

  // Horizontal light line - razor sharp, cinematic wipe
  const lineWidth = interpolate(
    frame,
    [fps * 0.02, fps * 0.32],
    [0, 750],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.exp) }
  );
  const lineOpacity = interpolate(
    frame,
    [fps * 0.02, fps * 0.08, fps * 0.4, fps * 0.6],
    [0, 0.85, 0.25, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Logo entrance - powerful, commanding presence
  const logoDelay = 0.18;
  const logoProgress = spring({
    frame: frame - logoDelay * fps,
    fps,
    config: { damping: 200, stiffness: 50, mass: 1.4 },
  });
  const logoOpacity = interpolate(
    frame,
    [logoDelay * fps, (logoDelay + 0.2) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const logoScale = interpolate(logoProgress, [0, 1], [0.7, 1]);
  const logoGlow = interpolate(
    frame,
    [fps * 0.35, fps * 0.85, fps * 1.5],
    [0, 60, 45],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Dual expanding rings - layered depth
  const ring1Delay = 0.38;
  const ring1Opacity = interpolate(
    frame,
    [ring1Delay * fps, (ring1Delay + 0.08) * fps, fps * 1.2, fps * 1.6],
    [0, 0.28, 0.1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ring1Scale = interpolate(
    frame,
    [ring1Delay * fps, fps * 1.6],
    [0.5, 2.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  const ring2Delay = 0.52;
  const ring2Opacity = interpolate(
    frame,
    [ring2Delay * fps, (ring2Delay + 0.08) * fps, fps * 1.4, fps * 1.8],
    [0, 0.18, 0.06, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ring2Scale = interpolate(
    frame,
    [ring2Delay * fps, fps * 1.8],
    [0.4, 3.2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // $FED text - unified entrance with gravitas
  const textDelay = 0.48;
  const textProgress = spring({
    frame: frame - textDelay * fps,
    fps,
    config: { damping: 180, stiffness: 60, mass: 1.2 },
  });
  const textOpacity = interpolate(
    frame,
    [textDelay * fps, (textDelay + 0.22) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const textY = interpolate(textProgress, [0, 1], [30, 0]);
  const textScale = interpolate(textProgress, [0, 1], [0.85, 1]);

  // Tagline - refined, minimal
  const tagDelay = 0.95;
  const tagOpacity = interpolate(
    frame,
    [tagDelay * fps, (tagDelay + 0.25) * fps],
    [0, 0.75],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const tagY = interpolate(
    frame,
    [tagDelay * fps, (tagDelay + 0.3) * fps],
    [10, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Background glow - subtle, building
  const bgGlow = interpolate(
    frame,
    [fps * 0.15, fps * 1.0],
    [0.01, 0.04],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00ff88" intensity={bgGlow} focusY={50} />

      {/* Light effects - cinematic precision */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        {/* Horizontal light line - razor sharp */}
        <div
          style={{
            width: lineWidth,
            height: 1,
            background: "linear-gradient(90deg, transparent 0%, rgba(0,255,136,0.35) 15%, rgba(255,255,255,0.95) 50%, rgba(0,255,136,0.35) 85%, transparent 100%)",
            opacity: lineOpacity,
            position: "absolute",
            boxShadow: "0 0 30px rgba(0, 255, 136, 0.3), 0 0 60px rgba(0, 255, 136, 0.15)",
          }}
        />

        {/* Central bloom - soft, powerful */}
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(0,255,136,0.6) 25%, rgba(0,255,136,0.2) 50%, transparent 70%)",
            opacity: bloomOpacity,
            transform: `scale(${bloomScale})`,
            position: "absolute",
          }}
        />

        {/* Expanding rings - layered */}
        <div
          style={{
            position: "absolute",
            width: 140,
            height: 140,
            borderRadius: "50%",
            border: "1.5px solid rgba(0, 255, 136, 0.3)",
            transform: `scale(${ring1Scale})`,
            opacity: ring1Opacity,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 120,
            height: 120,
            borderRadius: "50%",
            border: "1px solid rgba(0, 255, 136, 0.2)",
            transform: `scale(${ring2Scale})`,
            opacity: ring2Opacity,
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
            gap: 18,
          }}
        >
          {/* Logo - commanding */}
          <div
            style={{
              transform: `scale(${logoScale})`,
              opacity: logoOpacity,
              filter: `drop-shadow(0 0 ${logoGlow}px rgba(0, 255, 136, 0.55))`,
            }}
          >
            <FedLogo size={115} glow={false} />
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
                fontSize: 58,
                fontWeight: 900,
                color: "#00ff88",
                fontFamily: "system-ui, -apple-system, sans-serif",
                textShadow: "0 0 32px rgba(0, 255, 136, 0.5)",
              }}
            >
              $
            </span>
            <span
              style={{
                fontSize: 58,
                fontWeight: 900,
                color: "#ffffff",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -3,
                textShadow: "0 6px 40px rgba(0, 0, 0, 0.55)",
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
              marginTop: 4,
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: "#555555",
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

// Scene 2: Headline with explosive BRRR payoff
// Cinematic word reveals, impactful BRRR moment with controlled chaos
const HeadlineScene: React.FC<{ headline: string }> = ({ headline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = headline.split(" ");
  const brrrIndex = words.findIndex(w => w === "BRRR");

  // Scene fade - instant
  const sceneFade = interpolate(frame, [0, fps * 0.06], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Word timing - tight stagger for rhythm
  const wordStagger = 0.095;
  const brrrDelay = 0.06 + brrrIndex * wordStagger;
  const brrrLandTime = (brrrDelay + 0.05) * fps;

  // Screen shake on BRRR - controlled impact
  const shakeIntensity = interpolate(
    frame,
    [brrrLandTime, brrrLandTime + fps * 0.015, brrrLandTime + fps * 0.04, brrrLandTime + fps * 0.08],
    [0, 10, -5, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const shakeX = shakeIntensity * Math.sin(frame * 6);
  const shakeY = shakeIntensity * 0.5;

  // Background glow burst on BRRR - dramatic flash
  const bgGlow = interpolate(
    frame,
    [fps * 0.04, brrrLandTime - fps * 0.02, brrrLandTime + fps * 0.02, brrrLandTime + fps * 0.12, fps * 1.1],
    [0.01, 0.018, 0.12, 0.05, 0.04],
    { extrapolateRight: "clamp" }
  );

  // Dual shockwaves for depth
  const shock1Opacity = interpolate(
    frame,
    [brrrLandTime, brrrLandTime + fps * 0.025, brrrLandTime + fps * 0.25],
    [0.75, 0.35, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const shock1Scale = interpolate(
    frame,
    [brrrLandTime, brrrLandTime + fps * 0.25],
    [0.2, 2.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.exp) }
  );

  const shock2Opacity = interpolate(
    frame,
    [brrrLandTime + fps * 0.03, brrrLandTime + fps * 0.06, brrrLandTime + fps * 0.35],
    [0, 0.4, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const shock2Scale = interpolate(
    frame,
    [brrrLandTime + fps * 0.03, brrrLandTime + fps * 0.35],
    [0.15, 3.2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00ff88" intensity={bgGlow} focusY={48} />

      {/* Shockwaves - dual layer depth */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: "50%",
            border: "2.5px solid rgba(0, 255, 136, 0.7)",
            opacity: shock1Opacity,
            transform: `scale(${shock1Scale})`,
            position: "absolute",
            boxShadow: "0 0 25px rgba(0, 255, 136, 0.4)",
          }}
        />
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: "50%",
            border: "1.5px solid rgba(0, 255, 136, 0.5)",
            opacity: shock2Opacity,
            transform: `scale(${shock2Scale})`,
            position: "absolute",
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 70,
          transform: `translate(${shakeX}px, ${shakeY}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0 24px",
            maxWidth: 1000,
          }}
        >
          {words.map((word, index) => {
            const delay = 0.06 + index * wordStagger;
            const wordProgress = spring({
              frame: frame - delay * fps,
              fps,
              config: { damping: 180, stiffness: 90, mass: 1.1 },
            });
            const wordOpacity = interpolate(
              frame,
              [delay * fps, (delay + 0.12) * fps],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const wordY = interpolate(wordProgress, [0, 1], [35, 0]);

            const isBrrr = word === "BRRR";

            // BRRR scale punch - explosive entrance
            const brrrScale = isBrrr ? interpolate(
              frame,
              [delay * fps, (delay + 0.015) * fps, (delay + 0.045) * fps, (delay + 0.1) * fps],
              [0.5, 1.25, 0.92, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ) : 1;

            // BRRR glow - intense burst
            const brrrGlow = isBrrr ? interpolate(
              frame,
              [(delay + 0.01) * fps, (delay + 0.04) * fps, (delay + 0.12) * fps, fps * 1.0],
              [0, 95, 50, 32],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ) : 0;

            return (
              <span
                key={index}
                style={{
                  fontSize: isBrrr ? 88 : 72,
                  fontWeight: 900,
                  color: isBrrr ? "#00ff88" : "#ffffff",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  opacity: wordOpacity,
                  transform: `translateY(${wordY}px) scale(${brrrScale})`,
                  display: "inline-block",
                  letterSpacing: -4,
                  lineHeight: 1.1,
                  textShadow: isBrrr
                    ? `0 0 ${brrrGlow}px rgba(0, 255, 136, 0.55)`
                    : "0 5px 40px rgba(0, 0, 0, 0.5)",
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
// Luxurious easing, refined visual hierarchy, satisfying celebrations
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
    config: { damping: 200, stiffness: 55, mass: 1.3 },
  });

  const cardOpacity = interpolate(
    frame,
    [delay * fps, (delay + 0.18) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const cardY = interpolate(cardProgress, [0, 1], [50, 0]);
  const cardScale = interpolate(cardProgress, [0, 1], [0.9, 1]);

  // Number counting - smooth, satisfying easing curve
  const countDuration = 1.3;
  const countStart = delay + 0.15;
  const numberProgress = interpolate(
    frame,
    [countStart * fps, (countStart + countDuration) * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      // Smooth ease-out with a slight deceleration feel
      easing: (t) => 1 - Math.pow(1 - t, 4.5),
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

  // Scale pulse on landing - satisfying pop
  const landPulse = hasLanded ? interpolate(
    frame,
    [landTime - fps * 0.015, landTime + fps * 0.03, landTime + fps * 0.1],
    [1, 1.08, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 1;

  // Number glow - builds then bursts
  const numberGlow = hasLanded ? interpolate(
    frame,
    [landTime - fps * 0.04, landTime + fps * 0.04, landTime + fps * 0.3],
    [15, 45, 18],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : interpolate(
    frame,
    [(countStart + 0.25) * fps, (countStart + countDuration) * fps],
    [0, 16],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Celebration ring - clean, expanding
  const ringOpacity = hasLanded ? interpolate(
    frame,
    [landTime, landTime + fps * 0.03, landTime + fps * 0.25],
    [0.65, 0.35, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : 0;
  const ringScale = hasLanded ? interpolate(
    frame,
    [landTime, landTime + fps * 0.25],
    [0.5, 2.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.exp) }
  ) : 0.5;

  // Top accent bar - draws across
  const accentWidth = interpolate(
    frame,
    [(delay + 0.06) * fps, (delay + 0.35) * fps],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.exp) }
  );

  // Card glow - subtle ambient
  const cardGlow = hasLanded ? interpolate(
    frame,
    [(countStart + countDuration - 0.15) * fps, landTime + fps * 0.06, landTime + fps * 0.35],
    [0.4, 1.2, 0.7],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : interpolate(
    frame,
    [(countStart + countDuration - 0.3) * fps, (countStart + countDuration) * fps],
    [0, 0.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Label opacity - fades in with card
  const labelOpacity = interpolate(
    frame,
    [(delay + 0.18) * fps, (delay + 0.35) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Color conversion
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : "0, 255, 136";
  };
  const accentRgb = hexToRgb(stat.color);

  return (
    <div
      style={{
        transform: `translateY(${cardY}px) scale(${cardScale})`,
        opacity: cardOpacity,
        position: "relative",
      }}
    >
      {/* Celebration ring */}
      <div
        style={{
          position: "absolute",
          top: "32%",
          left: "50%",
          width: 90,
          height: 90,
          borderRadius: "50%",
          border: `2px solid rgba(${accentRgb}, 0.6)`,
          transform: `translate(-50%, -50%) scale(${ringScale})`,
          opacity: ringOpacity,
          pointerEvents: "none",
          boxShadow: `0 0 18px rgba(${accentRgb}, 0.35)`,
        }}
      />

      <div
        style={{
          padding: "28px 38px",
          background: `linear-gradient(168deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.012) 100%)`,
          borderRadius: 16,
          minWidth: 275,
          position: "relative",
          overflow: "hidden",
          border: `1px solid rgba(255, 255, 255, ${0.045 + 0.025 * cardGlow})`,
          boxShadow: `
            0 25px 60px rgba(0, 0, 0, 0.55),
            0 0 ${40 * cardGlow}px rgba(${accentRgb}, ${0.08 * cardGlow}),
            inset 0 1px 0 rgba(255, 255, 255, 0.05)
          `,
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${accentWidth}%`,
            height: 2,
            background: `linear-gradient(90deg, ${stat.color} 0%, ${stat.color}60 70%, transparent 100%)`,
            borderRadius: "4px 0 0 0",
            boxShadow: `0 0 ${14 * cardGlow}px ${stat.color}45`,
          }}
        />

        {/* Number */}
        <div
          style={{
            fontSize: 54,
            fontWeight: 900,
            color: "#ffffff",
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: -3,
            lineHeight: 1,
            marginBottom: 14,
            transform: `scale(${landPulse})`,
            transformOrigin: "left center",
            filter: `drop-shadow(0 0 ${numberGlow}px rgba(${accentRgb}, 0.45))`,
          }}
        >
          <span
            style={{
              color: stat.color,
              textShadow: `0 0 ${18 * cardGlow}px ${stat.color}50`,
            }}
          >
            {prefix}
          </span>
          {displayValue.toLocaleString()}
          <span
            style={{
              color: "#3a3a3a",
              fontSize: 22,
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
              fontSize: 10,
              color: "#555555",
              fontFamily: "system-ui, -apple-system, sans-serif",
              textTransform: "uppercase",
              letterSpacing: 3,
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

  const sceneFade = interpolate(frame, [0, fps * 0.08], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Card stagger for rhythm
  const cardStagger = 0.22;
  const allStatsLandTime = (0.12 + (stats.length - 1) * cardStagger + 0.15 + 1.3) * fps;
  const allStatsLanded = frame >= allStatsLandTime;

  // Subtle pulse on final land
  const finalPulse = allStatsLanded ? interpolate(
    frame,
    [allStatsLandTime, allStatsLandTime + fps * 0.015, allStatsLandTime + fps * 0.05],
    [0, 4, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : 0;
  const shakeX = finalPulse * Math.sin(frame * 6);

  // Header - refined
  const headerOpacity = interpolate(frame, [fps * 0.02, fps * 0.18], [0, 0.8], {
    extrapolateRight: "clamp",
  });
  const headerY = interpolate(
    frame,
    [fps * 0.02, fps * 0.2],
    [12, 0],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Background glow - builds with content
  const bgGlow = allStatsLanded ? interpolate(
    frame,
    [fps * 0.15, allStatsLandTime - fps * 0.1, allStatsLandTime + fps * 0.06, allStatsLandTime + fps * 0.35],
    [0.01, 0.038, 0.09, 0.055],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : interpolate(
    frame,
    [fps * 0.15, fps * 1.8],
    [0.01, 0.042],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Dual celebration rings - layered depth
  const celebrationRing1Opacity = allStatsLanded ? interpolate(
    frame,
    [allStatsLandTime, allStatsLandTime + fps * 0.04, allStatsLandTime + fps * 0.35],
    [0.6, 0.28, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : 0;
  const celebrationRing1Scale = allStatsLanded ? interpolate(
    frame,
    [allStatsLandTime, allStatsLandTime + fps * 0.35],
    [0.35, 2.8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.exp) }
  ) : 0.35;

  const celebrationRing2Opacity = allStatsLanded ? interpolate(
    frame,
    [allStatsLandTime + fps * 0.02, allStatsLandTime + fps * 0.08, allStatsLandTime + fps * 0.45],
    [0, 0.35, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : 0;
  const celebrationRing2Scale = allStatsLanded ? interpolate(
    frame,
    [allStatsLandTime + fps * 0.02, allStatsLandTime + fps * 0.45],
    [0.3, 3.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 0.3;

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00ff88" intensity={bgGlow} focusY={46} />

      {/* Celebration rings - dual layer */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: 190,
            height: 190,
            borderRadius: "50%",
            border: "2px solid rgba(0, 255, 136, 0.55)",
            transform: `scale(${celebrationRing1Scale})`,
            opacity: celebrationRing1Opacity,
            position: "absolute",
            boxShadow: "0 0 28px rgba(0, 255, 136, 0.35)",
          }}
        />
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: "50%",
            border: "1.5px solid rgba(0, 255, 136, 0.4)",
            transform: `scale(${celebrationRing2Scale})`,
            opacity: celebrationRing2Opacity,
            position: "absolute",
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 45,
          flexDirection: "column",
          gap: 40,
          transform: `translate(${shakeX}px, 0)`,
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
              fontSize: 11,
              color: "#555555",
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
            gap: 28,
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 960,
          }}
        >
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              stat={stat}
              delay={0.12 + index * cardStagger}
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

  const sceneFade = interpolate(frame, [0, fps * 0.08], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Background glow - building energy
  const bgIntensity = interpolate(
    frame,
    [0, fps * 1.0],
    [0.015, 0.055],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Logo entrance - commanding presence
  const logoProgress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 55, mass: 1.2 },
  });
  const logoOpacity = interpolate(frame, [0, fps * 0.18], [0, 1], {
    extrapolateRight: "clamp",
  });
  const logoScale = interpolate(logoProgress, [0, 1], [0.78, 1]);
  const logoGlow = interpolate(
    frame,
    [fps * 0.1, fps * 0.5, fps * 0.85],
    [0, 52, 42],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Dual expanding rings
  const ring1Opacity = interpolate(
    frame,
    [fps * 0.05, fps * 0.15, fps * 0.85, fps * 1.2],
    [0, 0.25, 0.1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ring1Scale = interpolate(
    frame,
    [fps * 0.05, fps * 1.2],
    [0.45, 2.3],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  const ring2Opacity = interpolate(
    frame,
    [fps * 0.12, fps * 0.22, fps * 1.0, fps * 1.4],
    [0, 0.18, 0.06, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ring2Scale = interpolate(
    frame,
    [fps * 0.12, fps * 1.4],
    [0.38, 2.8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Tagline - refined timing
  const taglineOpacity = interpolate(
    frame,
    [fps * 0.25, fps * 0.45],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const taglineY = interpolate(
    frame,
    [fps * 0.25, fps * 0.5],
    [12, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // CTA button - the hero moment
  const ctaDelay = fps * 0.45;
  const ctaProgress = spring({
    frame: frame - ctaDelay,
    fps,
    config: { damping: 180, stiffness: 65, mass: 1.15 },
  });
  const ctaOpacity = interpolate(
    frame,
    [ctaDelay, ctaDelay + fps * 0.18],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ctaY = interpolate(ctaProgress, [0, 1], [32, 0]);
  const ctaScale = interpolate(ctaProgress, [0, 1], [0.88, 1]);

  // CTA land pulse - satisfying settle
  const ctaLandTime = ctaDelay + fps * 0.28;
  const ctaLandPulse = frame > ctaLandTime ? interpolate(
    frame,
    [ctaLandTime, ctaLandTime + fps * 0.06, ctaLandTime + fps * 0.15],
    [1, 1.06, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 1;

  // CTA glow - builds confidence
  const ctaGlow = interpolate(
    frame,
    [ctaDelay + fps * 0.1, fps * 1.0, fps * 1.4],
    [0, 1.2, 0.95],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Shimmer - premium sweep
  const ctaShimmerDelay = ctaDelay + fps * 0.3;
  const ctaShimmerProgress = interpolate(
    frame,
    [ctaShimmerDelay, ctaShimmerDelay + fps * 0.4],
    [-35, 135],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const ctaShimmerOpacity = interpolate(
    frame,
    [ctaShimmerDelay, ctaShimmerDelay + fps * 0.08, ctaShimmerDelay + fps * 0.32, ctaShimmerDelay + fps * 0.4],
    [0, 0.45, 0.28, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Bottom text - confident close
  const bottomOpacity = interpolate(
    frame,
    [fps * 0.9, fps * 1.15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const bottomY = interpolate(
    frame,
    [fps * 0.9, fps * 1.2],
    [10, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00ff88" intensity={bgIntensity} focusY={50} />

      {/* Ambient glow behind CTA */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 55% 42% at 50% 54%, rgba(0, 255, 136, ${0.045 * ctaGlow}) 0%, transparent 58%)`,
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
        {/* Logo with expanding rings */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 95,
              height: 95,
              borderRadius: "50%",
              border: "1.5px solid rgba(0, 255, 136, 0.28)",
              transform: `translate(-50%, -50%) scale(${ring1Scale})`,
              opacity: ring1Opacity,
              boxShadow: "0 0 14px rgba(0, 255, 136, 0.12)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 85,
              height: 85,
              borderRadius: "50%",
              border: "1px solid rgba(0, 255, 136, 0.2)",
              transform: `translate(-50%, -50%) scale(${ring2Scale})`,
              opacity: ring2Opacity,
            }}
          />
          <div
            style={{
              transform: `scale(${logoScale})`,
              opacity: logoOpacity,
              filter: `drop-shadow(0 0 ${logoGlow}px rgba(0, 255, 136, 0.55))`,
            }}
          >
            <FedLogo size={85} glow={false} />
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
              fontSize: 20,
              color: "#555555",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 400,
              letterSpacing: 0.3,
            }}
          >
            {tagline}
          </span>
        </div>

        {/* CTA Button - premium design */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px) scale(${ctaScale * ctaLandPulse})`,
          }}
        >
          <div
            style={{
              padding: "20px 60px",
              background: "linear-gradient(165deg, #00ff99 0%, #00ff99 35%, #00ff88 100%)",
              borderRadius: 48,
              position: "relative",
              overflow: "hidden",
              boxShadow: `
                0 14px 45px rgba(0, 255, 136, ${0.35 + 0.18 * ctaGlow}),
                0 0 ${55 * ctaGlow}px rgba(0, 255, 136, ${0.12 * ctaGlow}),
                inset 0 1.5px 0 rgba(255, 255, 255, 0.28)
              `,
            }}
          >
            {/* Shimmer */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: `${ctaShimmerProgress}%`,
                width: "38%",
                height: "100%",
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)",
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
                height: "48%",
                background: "linear-gradient(180deg, rgba(255,255,255,0.22) 0%, transparent 100%)",
                borderRadius: "48px 48px 0 0",
                pointerEvents: "none",
              }}
            />
            <span
              style={{
                fontSize: 34,
                fontWeight: 900,
                color: "#010101",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -0.5,
                textShadow: "0 1px 0 rgba(255, 255, 255, 0.3)",
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
            marginTop: 12,
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
