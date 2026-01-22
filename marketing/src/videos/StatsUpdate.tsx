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

// Scene 1: The Hook - Refined Apple keynote style reveal
// Tighter timing, more deliberate pacing, cleaner visual hierarchy
const IntroScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: Single point of light ignites - simpler, more focused
  const ignitionTime = fps * 0.08;
  const bloomOpacity = interpolate(
    frame,
    [ignitionTime, ignitionTime + fps * 0.05, fps * 0.35, fps * 0.6],
    [0, 0.9, 0.35, 0],
    { extrapolateRight: "clamp" }
  );
  const bloomScale = interpolate(
    frame,
    [ignitionTime, fps * 0.6],
    [0.02, 3.5],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Horizontal light line - faster, more decisive
  const lineWidth = interpolate(
    frame,
    [fps * 0.03, fps * 0.35],
    [0, 680],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const lineOpacity = interpolate(
    frame,
    [fps * 0.03, fps * 0.1, fps * 0.45, fps * 0.65],
    [0, 0.7, 0.2, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Logo entrance - earlier, more commanding
  const logoDelay = 0.22;
  const logoProgress = spring({
    frame: frame - logoDelay * fps,
    fps,
    config: { damping: 180, stiffness: 55, mass: 1.3 },
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
    [fps * 0.4, fps * 0.9, fps * 1.4],
    [0, 55, 42],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Single elegant expanding ring - simpler
  const ringDelay = 0.45;
  const ringOpacity = interpolate(
    frame,
    [ringDelay * fps, (ringDelay + 0.1) * fps, fps * 1.3, fps * 1.7],
    [0, 0.22, 0.08, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ringScale = interpolate(
    frame,
    [ringDelay * fps, fps * 1.7],
    [0.55, 2.8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // $FED text - unified entrance, not split
  const textDelay = 0.55;
  const textProgress = spring({
    frame: frame - textDelay * fps,
    fps,
    config: { damping: 200, stiffness: 70, mass: 1.1 },
  });
  const textOpacity = interpolate(
    frame,
    [textDelay * fps, (textDelay + 0.28) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const textY = interpolate(textProgress, [0, 1], [25, 0]);
  const textScale = interpolate(textProgress, [0, 1], [0.88, 1]);

  // Tagline - simpler, cleaner
  const tagDelay = 1.0;
  const tagOpacity = interpolate(
    frame,
    [tagDelay * fps, (tagDelay + 0.3) * fps],
    [0, 0.85],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const tagY = interpolate(
    frame,
    [tagDelay * fps, (tagDelay + 0.35) * fps],
    [8, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Background glow
  const bgGlow = interpolate(
    frame,
    [fps * 0.2, fps * 1.0],
    [0.012, 0.035],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00ff88" intensity={bgGlow} focusY={50} />

      {/* Light effects - simplified */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        {/* Horizontal light line */}
        <div
          style={{
            width: lineWidth,
            height: 1.5,
            background: "linear-gradient(90deg, transparent 0%, rgba(0,255,136,0.4) 20%, rgba(255,255,255,0.9) 50%, rgba(0,255,136,0.4) 80%, transparent 100%)",
            opacity: lineOpacity,
            position: "absolute",
            boxShadow: "0 0 25px rgba(0, 255, 136, 0.25)",
          }}
        />

        {/* Single bloom - cleaner */}
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(0,255,136,0.5) 30%, transparent 65%)",
            opacity: bloomOpacity,
            transform: `scale(${bloomScale})`,
            position: "absolute",
          }}
        />

        {/* Expanding ring */}
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
            gap: 20,
          }}
        >
          {/* Logo */}
          <div
            style={{
              transform: `scale(${logoScale})`,
              opacity: logoOpacity,
              filter: `drop-shadow(0 0 ${logoGlow}px rgba(0, 255, 136, 0.5))`,
            }}
          >
            <FedLogo size={120} glow={false} />
          </div>

          {/* $FED text - unified */}
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
                color: "#00ff88",
                fontFamily: "system-ui, -apple-system, sans-serif",
                textShadow: "0 0 28px rgba(0, 255, 136, 0.45)",
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
                letterSpacing: -2,
                textShadow: "0 4px 35px rgba(0, 0, 0, 0.5)",
              }}
            >
              FED
            </span>
          </div>

          {/* Tagline - cleaner, no decorative lines */}
          <div
            style={{
              opacity: tagOpacity,
              transform: `translateY(${tagY}px)`,
              marginTop: 6,
            }}
          >
            <span
              style={{
                fontSize: 10,
                color: "#4a4a4a",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: 5,
                textTransform: "uppercase",
                fontWeight: 600,
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
// Tighter word timing, more impactful BRRR moment
const HeadlineScene: React.FC<{ headline: string }> = ({ headline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = headline.split(" ");
  const brrrIndex = words.findIndex(w => w === "BRRR");

  // Scene fade - faster
  const sceneFade = interpolate(frame, [0, fps * 0.08], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Word timing - faster stagger for better rhythm
  const wordStagger = 0.11;
  const brrrDelay = 0.08 + brrrIndex * wordStagger;
  const brrrLandTime = (brrrDelay + 0.06) * fps;

  // Screen shake on BRRR - tighter, more impactful
  const shakeIntensity = interpolate(
    frame,
    [brrrLandTime, brrrLandTime + fps * 0.02, brrrLandTime + fps * 0.05, brrrLandTime + fps * 0.1],
    [0, 8, -4, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const shakeX = shakeIntensity * Math.sin(frame * 5);
  const shakeY = shakeIntensity * 0.4;

  // Background glow burst on BRRR - more dramatic burst
  const bgGlow = interpolate(
    frame,
    [fps * 0.05, brrrLandTime - fps * 0.03, brrrLandTime + fps * 0.03, brrrLandTime + fps * 0.15, fps * 1.2],
    [0.01, 0.015, 0.09, 0.045, 0.035],
    { extrapolateRight: "clamp" }
  );

  // Single shockwave - cleaner
  const shockOpacity = interpolate(
    frame,
    [brrrLandTime, brrrLandTime + fps * 0.03, brrrLandTime + fps * 0.3],
    [0.65, 0.3, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const shockScale = interpolate(
    frame,
    [brrrLandTime, brrrLandTime + fps * 0.3],
    [0.25, 2.8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00ff88" intensity={bgGlow} focusY={48} />

      {/* Single shockwave - cleaner */}
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
            border: "2px solid rgba(0, 255, 136, 0.6)",
            opacity: shockOpacity,
            transform: `scale(${shockScale})`,
            position: "absolute",
            boxShadow: "0 0 20px rgba(0, 255, 136, 0.3)",
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 80,
          transform: `translate(${shakeX}px, ${shakeY}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0 28px",
            maxWidth: 1050,
          }}
        >
          {words.map((word, index) => {
            const delay = 0.08 + index * wordStagger;
            const wordProgress = spring({
              frame: frame - delay * fps,
              fps,
              config: { damping: 200, stiffness: 100, mass: 1.0 },
            });
            const wordOpacity = interpolate(
              frame,
              [delay * fps, (delay + 0.15) * fps],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const wordY = interpolate(wordProgress, [0, 1], [25, 0]);

            const isBrrr = word === "BRRR";

            // BRRR scale punch - tighter timing
            const brrrScale = isBrrr ? interpolate(
              frame,
              [delay * fps, (delay + 0.02) * fps, (delay + 0.06) * fps, (delay + 0.12) * fps],
              [0.6, 1.2, 0.95, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ) : 1;

            // BRRR glow - brighter burst, faster settle
            const brrrGlow = isBrrr ? interpolate(
              frame,
              [(delay + 0.01) * fps, (delay + 0.05) * fps, (delay + 0.15) * fps, fps * 1.1],
              [0, 85, 45, 28],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ) : 0;

            return (
              <span
                key={index}
                style={{
                  fontSize: isBrrr ? 82 : 68,
                  fontWeight: 900,
                  color: isBrrr ? "#00ff88" : "#ffffff",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  opacity: wordOpacity,
                  transform: `translateY(${wordY}px) scale(${brrrScale})`,
                  display: "inline-block",
                  letterSpacing: -3,
                  lineHeight: 1.15,
                  textShadow: isBrrr
                    ? `0 0 ${brrrGlow}px rgba(0, 255, 136, 0.5)`
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
// Refined timing, cleaner visual hierarchy, more satisfying celebrations
const StatCard: React.FC<{
  stat: StatsUpdateProps["stats"][0];
  delay: number;
  index: number;
}> = ({ stat, delay, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card entrance - faster, snappier
  const cardProgress = spring({
    frame: frame - delay * fps,
    fps,
    config: { damping: 180, stiffness: 65, mass: 1.2 },
  });

  const cardOpacity = interpolate(
    frame,
    [delay * fps, (delay + 0.22) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const cardY = interpolate(cardProgress, [0, 1], [40, 0]);
  const cardScale = interpolate(cardProgress, [0, 1], [0.92, 1]);

  // Number counting - faster, punchier easing
  const countDuration = 1.4;
  const countStart = delay + 0.18;
  const numberProgress = interpolate(
    frame,
    [countStart * fps, (countStart + countDuration) * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: (t) => 1 - Math.pow(1 - t, 4),
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

  // Scale pulse on landing - tighter, more satisfying
  const landPulse = hasLanded ? interpolate(
    frame,
    [landTime - fps * 0.02, landTime + fps * 0.04, landTime + fps * 0.12],
    [1, 1.12, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : 1;

  // Number glow - cleaner
  const numberGlow = hasLanded ? interpolate(
    frame,
    [landTime - fps * 0.05, landTime + fps * 0.06, landTime + fps * 0.35],
    [12, 40, 16],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : interpolate(
    frame,
    [(countStart + 0.3) * fps, (countStart + countDuration) * fps],
    [0, 14],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Single celebration ring - simpler
  const ringOpacity = hasLanded ? interpolate(
    frame,
    [landTime, landTime + fps * 0.04, landTime + fps * 0.3],
    [0.6, 0.3, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : 0;
  const ringScale = hasLanded ? interpolate(
    frame,
    [landTime, landTime + fps * 0.3],
    [0.6, 1.8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 0.6;

  // Top accent bar
  const accentWidth = interpolate(
    frame,
    [(delay + 0.08) * fps, (delay + 0.4) * fps],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Card glow
  const cardGlow = hasLanded ? interpolate(
    frame,
    [(countStart + countDuration - 0.2) * fps, landTime + fps * 0.08, landTime + fps * 0.4],
    [0.5, 1.3, 0.75],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : interpolate(
    frame,
    [(countStart + countDuration - 0.35) * fps, (countStart + countDuration) * fps],
    [0, 0.6],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Label opacity
  const labelOpacity = interpolate(
    frame,
    [(delay + 0.2) * fps, (delay + 0.4) * fps],
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
          top: "35%",
          left: "50%",
          width: 85,
          height: 85,
          borderRadius: "50%",
          border: `2px solid rgba(${accentRgb}, 0.5)`,
          transform: `translate(-50%, -50%) scale(${ringScale})`,
          opacity: ringOpacity,
          pointerEvents: "none",
          boxShadow: `0 0 15px rgba(${accentRgb}, 0.3)`,
        }}
      />

      <div
        style={{
          padding: "30px 40px",
          background: `linear-gradient(165deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)`,
          borderRadius: 16,
          minWidth: 280,
          position: "relative",
          overflow: "hidden",
          border: `1px solid rgba(255, 255, 255, ${0.05 + 0.02 * cardGlow})`,
          boxShadow: `
            0 30px 65px rgba(0, 0, 0, 0.5),
            0 0 ${45 * cardGlow}px rgba(${accentRgb}, ${0.1 * cardGlow}),
            inset 0 1px 0 rgba(255, 255, 255, 0.04)
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
            background: `linear-gradient(90deg, ${stat.color} 0%, ${stat.color}70 60%, transparent 100%)`,
            borderRadius: "4px 0 0 0",
            boxShadow: `0 0 ${12 * cardGlow}px ${stat.color}50`,
          }}
        />

        {/* Number */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 900,
            color: "#ffffff",
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: -2,
            lineHeight: 1,
            marginBottom: 16,
            transform: `scale(${landPulse})`,
            transformOrigin: "left center",
            filter: `drop-shadow(0 0 ${numberGlow}px rgba(${accentRgb}, 0.4))`,
          }}
        >
          <span
            style={{
              color: stat.color,
              textShadow: `0 0 ${16 * cardGlow}px ${stat.color}55`,
            }}
          >
            {prefix}
          </span>
          {displayValue.toLocaleString()}
          <span
            style={{
              color: "#3a3a3a",
              fontSize: 24,
              fontWeight: 700,
              marginLeft: 3,
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
              color: "#505050",
              fontFamily: "system-ui, -apple-system, sans-serif",
              textTransform: "uppercase",
              letterSpacing: 3.5,
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

// Scene 3: Stats showcase - cleaner layout, better rhythm
const StatsScene: React.FC<{ stats: StatsUpdateProps["stats"] }> = ({ stats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneFade = interpolate(frame, [0, fps * 0.1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Faster card stagger for better rhythm
  const cardStagger = 0.25;
  const allStatsLandTime = (0.15 + (stats.length - 1) * cardStagger + 0.18 + 1.4) * fps;
  const allStatsLanded = frame >= allStatsLandTime;

  // Subtle shake on final land
  const finalShakeIntensity = allStatsLanded ? interpolate(
    frame,
    [allStatsLandTime, allStatsLandTime + fps * 0.02, allStatsLandTime + fps * 0.06],
    [0, 3.5, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : 0;
  const shakeX = finalShakeIntensity * Math.sin(frame * 5);

  // Header - simpler
  const headerOpacity = interpolate(frame, [fps * 0.03, fps * 0.22], [0, 0.85], {
    extrapolateRight: "clamp",
  });
  const headerY = interpolate(
    frame,
    [fps * 0.03, fps * 0.25],
    [10, 0],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Background glow
  const bgGlow = allStatsLanded ? interpolate(
    frame,
    [fps * 0.2, allStatsLandTime - fps * 0.15, allStatsLandTime + fps * 0.08, allStatsLandTime + fps * 0.4],
    [0.012, 0.035, 0.08, 0.055],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : interpolate(
    frame,
    [fps * 0.2, fps * 2.0],
    [0.012, 0.04],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Celebration ring - faster, cleaner
  const celebrationRingOpacity = allStatsLanded ? interpolate(
    frame,
    [allStatsLandTime, allStatsLandTime + fps * 0.05, allStatsLandTime + fps * 0.4],
    [0.55, 0.25, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : 0;
  const celebrationRingScale = allStatsLanded ? interpolate(
    frame,
    [allStatsLandTime, allStatsLandTime + fps * 0.4],
    [0.4, 3.2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 0.4;

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00ff88" intensity={bgGlow} focusY={46} />

      {/* Celebration ring */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: 180,
            height: 180,
            borderRadius: "50%",
            border: "2px solid rgba(0, 255, 136, 0.5)",
            transform: `scale(${celebrationRingScale})`,
            opacity: celebrationRingOpacity,
            boxShadow: "0 0 25px rgba(0, 255, 136, 0.3)",
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 50,
          flexDirection: "column",
          gap: 45,
          transform: `translate(${shakeX}px, 0)`,
        }}
      >
        {/* Header - cleaner */}
        <div
          style={{
            opacity: headerOpacity,
            transform: `translateY(${headerY}px)`,
          }}
        >
          <span
            style={{
              fontSize: 10,
              color: "#505050",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 5.5,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Live Metrics
          </span>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: 32,
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 980,
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

// Remove sparkles for cleaner aesthetic - less is more

// Scene 4: CTA - Commanding, confident close
// Cleaner, more focused with better pacing
const CTAScene: React.FC<{ tagline: string; cta: string }> = ({ tagline, cta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneFade = interpolate(frame, [0, fps * 0.1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Background glow - simpler
  const bgIntensity = interpolate(
    frame,
    [0, fps * 1.2],
    [0.018, 0.05],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Logo entrance - faster
  const logoProgress = spring({
    frame,
    fps,
    config: { damping: 180, stiffness: 60, mass: 1.1 },
  });
  const logoOpacity = interpolate(frame, [0, fps * 0.22], [0, 1], {
    extrapolateRight: "clamp",
  });
  const logoScale = interpolate(logoProgress, [0, 1], [0.82, 1]);
  const logoGlow = interpolate(
    frame,
    [fps * 0.12, fps * 0.55, fps * 0.9],
    [0, 48, 38],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Single expanding ring
  const ringOpacity = interpolate(
    frame,
    [fps * 0.06, fps * 0.2, fps * 0.9, fps * 1.3],
    [0, 0.22, 0.08, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ringScale = interpolate(
    frame,
    [fps * 0.06, fps * 1.3],
    [0.5, 2.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Tagline - earlier
  const taglineOpacity = interpolate(
    frame,
    [fps * 0.28, fps * 0.5],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const taglineY = interpolate(
    frame,
    [fps * 0.28, fps * 0.55],
    [10, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // CTA button - the hero element
  const ctaDelay = fps * 0.5;
  const ctaProgress = spring({
    frame: frame - ctaDelay,
    fps,
    config: { damping: 160, stiffness: 75, mass: 1.1 },
  });
  const ctaOpacity = interpolate(
    frame,
    [ctaDelay, ctaDelay + fps * 0.22],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ctaY = interpolate(ctaProgress, [0, 1], [28, 0]);
  const ctaScale = interpolate(ctaProgress, [0, 1], [0.9, 1]);

  // CTA land pulse - tighter
  const ctaLandTime = ctaDelay + fps * 0.3;
  const ctaLandPulse = frame > ctaLandTime ? interpolate(
    frame,
    [ctaLandTime, ctaLandTime + fps * 0.08, ctaLandTime + fps * 0.18],
    [1, 1.08, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : 1;

  // CTA glow
  const ctaGlow = interpolate(
    frame,
    [ctaDelay + fps * 0.12, fps * 1.1, fps * 1.5],
    [0, 1.15, 0.9],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Shimmer - faster
  const ctaShimmerDelay = ctaDelay + fps * 0.32;
  const ctaShimmerProgress = interpolate(
    frame,
    [ctaShimmerDelay, ctaShimmerDelay + fps * 0.45],
    [-30, 130],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const ctaShimmerOpacity = interpolate(
    frame,
    [ctaShimmerDelay, ctaShimmerDelay + fps * 0.1, ctaShimmerDelay + fps * 0.35, ctaShimmerDelay + fps * 0.45],
    [0, 0.4, 0.25, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Bottom text - earlier
  const bottomOpacity = interpolate(
    frame,
    [fps * 0.95, fps * 1.2],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const bottomY = interpolate(
    frame,
    [fps * 0.95, fps * 1.25],
    [8, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00ff88" intensity={bgIntensity} focusY={50} />

      {/* Ambient glow behind CTA */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 50% 40% at 50% 55%, rgba(0, 255, 136, ${0.04 * ctaGlow}) 0%, transparent 55%)`,
        }}
      />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 26,
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
              width: 100,
              height: 100,
              borderRadius: "50%",
              border: "1.5px solid rgba(0, 255, 136, 0.25)",
              transform: `translate(-50%, -50%) scale(${ringScale})`,
              opacity: ringOpacity,
              boxShadow: "0 0 12px rgba(0, 255, 136, 0.1)",
            }}
          />
          <div
            style={{
              transform: `scale(${logoScale})`,
              opacity: logoOpacity,
              filter: `drop-shadow(0 0 ${logoGlow}px rgba(0, 255, 136, 0.5))`,
            }}
          >
            <FedLogo size={90} glow={false} />
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
              fontSize: 21,
              color: "#505050",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 400,
              letterSpacing: 0.5,
            }}
          >
            {tagline}
          </span>
        </div>

        {/* CTA Button - the star */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px) scale(${ctaScale * ctaLandPulse})`,
          }}
        >
          <div
            style={{
              padding: "22px 65px",
              background: "linear-gradient(160deg, #00ff99 0%, #00ffaa 40%, #00ff88 100%)",
              borderRadius: 50,
              position: "relative",
              overflow: "hidden",
              boxShadow: `
                0 12px 42px rgba(0, 255, 136, ${0.32 + 0.2 * ctaGlow}),
                0 0 ${50 * ctaGlow}px rgba(0, 255, 136, ${0.15 * ctaGlow}),
                inset 0 1.5px 0 rgba(255, 255, 255, 0.25)
              `,
            }}
          >
            {/* Shimmer */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: `${ctaShimmerProgress}%`,
                width: "40%",
                height: "100%",
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.65) 50%, transparent 100%)",
                opacity: ctaShimmerOpacity,
                pointerEvents: "none",
              }}
            />
            {/* Inner shine */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "50%",
                background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)",
                borderRadius: "50px 50px 0 0",
                pointerEvents: "none",
              }}
            />
            <span
              style={{
                fontSize: 36,
                fontWeight: 900,
                color: "#010101",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -0.5,
                textShadow: "0 1px 0 rgba(255, 255, 255, 0.25)",
                position: "relative",
              }}
            >
              {cta}
            </span>
          </div>
        </div>

        {/* Bottom text - simpler */}
        <div
          style={{
            opacity: bottomOpacity,
            transform: `translateY(${bottomY}px)`,
            marginTop: 14,
          }}
        >
          <span
            style={{
              fontSize: 10,
              color: "#404040",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 5,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Real yield. Every 2 minutes.
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Main composition - 10 seconds
export const StatsUpdate: React.FC<StatsUpdateProps> = ({
  headline,
  stats,
  tagline,
  cta,
}) => {
  const { fps } = useVideoConfig();

  // Transition timing
  const transitionFrames = Math.round(0.24 * fps);

  return (
    <TransitionSeries>
      {/* Intro: 1.85s - clean logo reveal */}
      <TransitionSeries.Sequence durationInFrames={Math.round(1.85 * fps)}>
        <IntroScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* Headline: 1.55s - BRRR moment */}
      <TransitionSeries.Sequence durationInFrames={Math.round(1.55 * fps)}>
        <HeadlineScene headline={headline} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* Stats: 3.8s - numbers breathe */}
      <TransitionSeries.Sequence durationInFrames={Math.round(3.8 * fps)}>
        <StatsScene stats={stats} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* CTA: 2.8s - confident close */}
      <TransitionSeries.Sequence durationInFrames={Math.round(2.8 * fps)}>
        <CTAScene tagline={tagline} cta={cta} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
