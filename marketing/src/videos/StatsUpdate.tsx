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

// Scene 1: The Hook - Clean, sophisticated logo reveal (Apple keynote style)
const IntroScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: Dramatic light bloom from center - the "ignition" moment
  const bloomOpacity = interpolate(
    frame,
    [0, fps * 0.06, fps * 0.12, fps * 0.38, fps * 0.75],
    [0, 0.85, 0.95, 0.4, 0],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const bloomScale = interpolate(
    frame,
    [0, fps * 0.75],
    [0.01, 4.0],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Secondary bloom for depth
  const bloom2Opacity = interpolate(
    frame,
    [fps * 0.03, fps * 0.1, fps * 0.45, fps * 0.85],
    [0, 0.55, 0.22, 0],
    { extrapolateRight: "clamp" }
  );
  const bloom2Scale = interpolate(
    frame,
    [fps * 0.03, fps * 0.85],
    [0.005, 5.0],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Horizontal light line - premium wipe effect
  const lineWidth = interpolate(
    frame,
    [fps * 0.02, fps * 0.45],
    [0, 750],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const lineOpacity = interpolate(
    frame,
    [fps * 0.02, fps * 0.12, fps * 0.55, fps * 0.8],
    [0, 0.75, 0.25, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Logo entrance - weighty, authoritative
  const logoDelay = 0.3;
  const logoProgress = spring({
    frame: frame - logoDelay * fps,
    fps,
    config: { damping: 200, stiffness: 45, mass: 1.5 },
  });
  const logoOpacity = interpolate(
    frame,
    [logoDelay * fps, (logoDelay + 0.35) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const logoScale = interpolate(logoProgress, [0, 1], [0.7, 1]);
  const logoGlow = interpolate(
    frame,
    [fps * 0.45, fps * 1.0, fps * 1.5],
    [0, 50, 38],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Elegant expanding ring
  const ringDelay = 0.55;
  const ringOpacity = interpolate(
    frame,
    [ringDelay * fps, (ringDelay + 0.12) * fps, fps * 1.5, fps * 1.9],
    [0, 0.2, 0.08, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ringScale = interpolate(
    frame,
    [ringDelay * fps, fps * 1.9],
    [0.6, 2.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // $FED text - staggered reveal
  const dollarDelay = 0.68;
  const dollarProgress = spring({
    frame: frame - dollarDelay * fps,
    fps,
    config: { damping: 220, stiffness: 80, mass: 0.95 },
  });
  const dollarOpacity = interpolate(
    frame,
    [dollarDelay * fps, (dollarDelay + 0.22) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const dollarScale = interpolate(dollarProgress, [0, 1], [0.65, 1]);

  const fedDelay = 0.78;
  const fedProgress = spring({
    frame: frame - fedDelay * fps,
    fps,
    config: { damping: 220, stiffness: 65, mass: 1.1 },
  });
  const fedOpacity = interpolate(
    frame,
    [fedDelay * fps, (fedDelay + 0.3) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const fedY = interpolate(fedProgress, [0, 1], [16, 0]);

  // Tagline with decorative lines
  const tagDelay = 1.15;
  const tagOpacity = interpolate(
    frame,
    [tagDelay * fps, (tagDelay + 0.35) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const tagY = interpolate(
    frame,
    [tagDelay * fps, (tagDelay + 0.4) * fps],
    [10, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Side lines
  const sideLineWidth = interpolate(
    frame,
    [fps * 1.0, fps * 1.5],
    [0, 90],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Background glow builds
  const bgGlow = interpolate(
    frame,
    [fps * 0.3, fps * 1.2],
    [0.015, 0.038],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00ff88" intensity={bgGlow} focusY={50} />

      {/* Light effects */}
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
            background: "linear-gradient(90deg, transparent 0%, rgba(0,255,136,0.45) 15%, rgba(255,255,255,0.95) 50%, rgba(0,255,136,0.45) 85%, transparent 100%)",
            opacity: lineOpacity,
            position: "absolute",
            boxShadow: "0 0 30px rgba(0, 255, 136, 0.3)",
          }}
        />

        {/* Outer bloom for depth */}
        <div
          style={{
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,255,136,0.35) 0%, rgba(0,212,255,0.15) 40%, transparent 70%)",
            opacity: bloom2Opacity,
            transform: `scale(${bloom2Scale})`,
            position: "absolute",
          }}
        />

        {/* Center bloom - brilliant white core */}
        <div
          style={{
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.98) 0%, rgba(0,255,136,0.55) 25%, rgba(0,255,170,0.2) 50%, transparent 70%)",
            opacity: bloomOpacity,
            transform: `scale(${bloomScale})`,
            position: "absolute",
          }}
        />
      </AbsoluteFill>

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
            position: "absolute",
            width: 140,
            height: 140,
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
            gap: 24,
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
            <FedLogo size={130} glow={false} />
          </div>

          {/* $FED text */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
            }}
          >
            <span
              style={{
                fontSize: 58,
                fontWeight: 900,
                color: "#00ff88",
                fontFamily: "system-ui, -apple-system, sans-serif",
                textShadow: "0 0 30px rgba(0, 255, 136, 0.45)",
                opacity: dollarOpacity,
                transform: `scale(${dollarScale})`,
                display: "inline-block",
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
                letterSpacing: -2,
                textShadow: "0 4px 40px rgba(0, 0, 0, 0.5)",
                opacity: fedOpacity,
                transform: `translateY(${fedY}px)`,
                display: "inline-block",
              }}
            >
              FED
            </span>
          </div>

          {/* Tagline with decorative lines */}
          <div
            style={{
              opacity: tagOpacity,
              transform: `translateY(${tagY}px)`,
              display: "flex",
              alignItems: "center",
              gap: 22,
            }}
          >
            <div
              style={{
                width: sideLineWidth,
                height: 1,
                background: "linear-gradient(270deg, rgba(0, 255, 136, 0.3), transparent)",
              }}
            />
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
              Quantitative Easing for the People
            </span>
            <div
              style={{
                width: sideLineWidth,
                height: 1,
                background: "linear-gradient(90deg, rgba(0, 255, 136, 0.3), transparent)",
              }}
            />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 2: Headline with explosive BRRR payoff
const HeadlineScene: React.FC<{ headline: string }> = ({ headline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = headline.split(" ");
  const brrrIndex = words.findIndex(w => w === "BRRR");

  // Scene fade
  const sceneFade = interpolate(frame, [0, fps * 0.1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // BRRR timing - THE payoff moment
  const brrrDelay = 0.1 + brrrIndex * 0.13;
  const brrrLandTime = (brrrDelay + 0.08) * fps;

  // Screen shake on BRRR - impactful thud
  const shakeIntensity = interpolate(
    frame,
    [brrrLandTime, brrrLandTime + fps * 0.02, brrrLandTime + fps * 0.06, brrrLandTime + fps * 0.12, brrrLandTime + fps * 0.2],
    [0, 10, -5, 2.5, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const shakeX = shakeIntensity * Math.sin(frame * 4.5 + 0.5);
  const shakeY = shakeIntensity * 0.5 * Math.cos(frame * 5.3 + 1.1);

  // Background glow burst on BRRR
  const bgGlow = interpolate(
    frame,
    [fps * 0.1, brrrLandTime - fps * 0.05, brrrLandTime + fps * 0.05, brrrLandTime + fps * 0.2, fps * 1.3],
    [0.012, 0.018, 0.1, 0.055, 0.04],
    { extrapolateRight: "clamp" }
  );

  // Shockwaves on BRRR
  const shock1Opacity = interpolate(
    frame,
    [brrrLandTime, brrrLandTime + fps * 0.04, brrrLandTime + fps * 0.35],
    [0.7, 0.35, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const shock1Scale = interpolate(
    frame,
    [brrrLandTime, brrrLandTime + fps * 0.35],
    [0.2, 3.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  const shock2Opacity = interpolate(
    frame,
    [brrrLandTime + fps * 0.04, brrrLandTime + fps * 0.1, brrrLandTime + fps * 0.45],
    [0, 0.4, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const shock2Scale = interpolate(
    frame,
    [brrrLandTime + fps * 0.04, brrrLandTime + fps * 0.45],
    [0.15, 3.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // BRRR underline
  const underlineWidth = interpolate(
    frame,
    [(brrrDelay + 0.15) * fps, (brrrDelay + 0.38) * fps],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const underlineGlow = interpolate(
    frame,
    [(brrrDelay + 0.2) * fps, (brrrDelay + 0.48) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00ff88" intensity={bgGlow} focusY={48} />

      {/* Shockwaves */}
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
            border: "1.5px solid rgba(0, 255, 136, 0.5)",
            opacity: shock2Opacity,
            transform: `scale(${shock2Scale})`,
            position: "absolute",
          }}
        />
        <div
          style={{
            width: 170,
            height: 170,
            borderRadius: "50%",
            border: "2px solid rgba(0, 255, 136, 0.65)",
            opacity: shock1Opacity,
            transform: `scale(${shock1Scale})`,
            position: "absolute",
            boxShadow: "0 0 25px rgba(0, 255, 136, 0.35)",
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
            gap: "0 32px",
            maxWidth: 1100,
          }}
        >
          {words.map((word, index) => {
            const delay = 0.1 + index * 0.13;
            const wordProgress = spring({
              frame: frame - delay * fps,
              fps,
              config: { damping: 220, stiffness: 85, mass: 1.1 },
            });
            const wordOpacity = interpolate(
              frame,
              [delay * fps, (delay + 0.2) * fps],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const wordY = interpolate(wordProgress, [0, 1], [30, 0]);

            const isBrrr = word === "BRRR";

            // BRRR explosive entrance
            const brrrScale = isBrrr ? interpolate(
              frame,
              [delay * fps, (delay + 0.025) * fps, (delay + 0.08) * fps, (delay + 0.14) * fps, (delay + 0.22) * fps],
              [0.5, 1.3, 0.92, 1.05, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
            ) : 1;

            const brrrGlow = isBrrr ? interpolate(
              frame,
              [(delay + 0.02) * fps, (delay + 0.07) * fps, (delay + 0.2) * fps, fps * 1.25],
              [0, 95, 50, 32],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ) : 0;

            return (
              <span
                key={index}
                style={{
                  fontSize: isBrrr ? 88 : 74,
                  fontWeight: 900,
                  color: isBrrr ? "#00ff88" : "#ffffff",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  opacity: wordOpacity,
                  transform: `translateY(${wordY}px) scale(${brrrScale})`,
                  display: "inline-block",
                  letterSpacing: -4,
                  lineHeight: 1.1,
                  textShadow: isBrrr
                    ? `0 0 ${brrrGlow}px rgba(0, 255, 136, 0.55), 0 4px 40px rgba(0, 0, 0, 0.4)`
                    : "0 4px 40px rgba(0, 0, 0, 0.5)",
                  position: "relative",
                }}
              >
                {word}
                {isBrrr && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: -12,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: `${underlineWidth}%`,
                      height: 3.5,
                      background: "linear-gradient(90deg, transparent 0%, #00ff88 10%, #00ffbb 50%, #00ff88 90%, transparent 100%)",
                      borderRadius: 2,
                      opacity: 0.85,
                      boxShadow: `0 0 ${14 * underlineGlow}px rgba(0, 255, 136, ${0.4 * underlineGlow})`,
                    }}
                  />
                )}
              </span>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Stat card with premium counting animation
const StatCard: React.FC<{
  stat: StatsUpdateProps["stats"][0];
  delay: number;
  index: number;
}> = ({ stat, delay, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card entrance
  const cardProgress = spring({
    frame: frame - delay * fps,
    fps,
    config: { damping: 200, stiffness: 50, mass: 1.4 },
  });

  const cardOpacity = interpolate(
    frame,
    [delay * fps, (delay + 0.3) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const cardY = interpolate(cardProgress, [0, 1], [50, 0]);
  const cardScale = interpolate(cardProgress, [0, 1], [0.9, 1]);

  // Subtle rotation
  const cardRotate = interpolate(
    frame,
    [delay * fps, (delay + 0.45) * fps],
    [index === 0 ? -1.2 : index === 2 ? 1.2 : 0, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Number counting - cinematic easing
  const countDuration = 1.8;
  const countStart = delay + 0.25;
  const numberProgress = interpolate(
    frame,
    [countStart * fps, (countStart + countDuration) * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
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

  // Shimmer effect
  const shimmerDelay = countStart + countDuration - 0.1;
  const shimmerProgress = interpolate(
    frame,
    [shimmerDelay * fps, (shimmerDelay + 0.55) * fps],
    [-35, 140],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const shimmerOpacity = interpolate(
    frame,
    [shimmerDelay * fps, (shimmerDelay + 0.08) * fps, (shimmerDelay + 0.4) * fps, (shimmerDelay + 0.55) * fps],
    [0, 0.55, 0.35, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Scale pulse on landing - satisfying "snap" with quick settle
  const landPulse = hasLanded ? interpolate(
    frame,
    [landTime - fps * 0.01, landTime + fps * 0.04, landTime + fps * 0.1, landTime + fps * 0.18, landTime + fps * 0.28],
    [1, 1.16, 0.94, 1.02, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 1;

  // Number glow
  const numberGlow = hasLanded ? interpolate(
    frame,
    [landTime - fps * 0.08, landTime, landTime + fps * 0.1, landTime + fps * 0.45],
    [12, 18, 45, 18],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : interpolate(
    frame,
    [(countStart + 0.4) * fps, (countStart + countDuration) * fps],
    [0, 16],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Celebration rings
  const ring1Opacity = hasLanded ? interpolate(
    frame,
    [landTime, landTime + fps * 0.05, landTime + fps * 0.38],
    [0.75, 0.4, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : 0;
  const ring1Scale = hasLanded ? interpolate(
    frame,
    [landTime, landTime + fps * 0.38],
    [0.5, 2.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 0.5;

  const ring2Opacity = hasLanded ? interpolate(
    frame,
    [landTime + fps * 0.05, landTime + fps * 0.12, landTime + fps * 0.5],
    [0, 0.45, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : 0;
  const ring2Scale = hasLanded ? interpolate(
    frame,
    [landTime + fps * 0.05, landTime + fps * 0.5],
    [0.4, 2.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 0.4;

  // Accent bar draws
  const accentWidth = interpolate(
    frame,
    [(delay + 0.1) * fps, (delay + 0.55) * fps],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  const leftAccentHeight = interpolate(
    frame,
    [(delay + 0.15) * fps, (delay + 0.6) * fps],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Card glow
  const cardGlow = hasLanded ? interpolate(
    frame,
    [(countStart + countDuration - 0.25) * fps, landTime, landTime + fps * 0.12, landTime + fps * 0.55],
    [0.5, 0.75, 1.5, 0.85],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : interpolate(
    frame,
    [(countStart + countDuration - 0.45) * fps, (countStart + countDuration) * fps],
    [0, 0.75],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Card background brightness
  const bgBrightness = hasLanded ? interpolate(
    frame,
    [landTime, landTime + fps * 0.12, landTime + fps * 0.4],
    [1, 1.6, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 1;

  // Label opacity
  const labelOpacity = interpolate(
    frame,
    [(delay + 0.28) * fps, (delay + 0.55) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Indicator dot pulse
  const dotPulse = hasLanded && frame > landTime + fps * 0.4 ? interpolate(
    (frame - landTime - fps * 0.4) % (fps * 1.7),
    [0, fps * 0.4, fps * 1.7],
    [0.4, 1, 0.4],
    { easing: Easing.inOut(Easing.sin) }
  ) : interpolate(
    frame,
    [(delay + 0.4) * fps, landTime + fps * 0.4],
    [0, cardGlow * 0.85],
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
        transform: `translateY(${cardY}px) scale(${cardScale}) rotate(${cardRotate}deg)`,
        opacity: cardOpacity,
        position: "relative",
      }}
    >
      {/* Celebration rings */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          width: 95,
          height: 95,
          borderRadius: "50%",
          border: `2px solid rgba(${accentRgb}, 0.6)`,
          transform: `translate(-50%, -50%) scale(${ring1Scale})`,
          opacity: ring1Opacity,
          pointerEvents: "none",
          boxShadow: `0 0 18px rgba(${accentRgb}, 0.35)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          width: 100,
          height: 100,
          borderRadius: "50%",
          border: `1.5px solid rgba(${accentRgb}, 0.4)`,
          transform: `translate(-50%, -50%) scale(${ring2Scale})`,
          opacity: ring2Opacity,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          padding: "34px 44px",
          background: `linear-gradient(165deg, rgba(255,255,255,${0.042 * bgBrightness}) 0%, rgba(255,255,255,${0.01 * bgBrightness}) 100%)`,
          borderRadius: 20,
          minWidth: 295,
          position: "relative",
          overflow: "hidden",
          border: `1px solid rgba(255, 255, 255, ${0.05 + 0.028 * cardGlow})`,
          boxShadow: `
            0 35px 75px rgba(0, 0, 0, 0.55),
            0 0 ${55 * cardGlow}px rgba(${accentRgb}, ${0.12 * cardGlow}),
            inset 0 1px 0 rgba(255, 255, 255, 0.045)
          `,
        }}
      >
        {/* Shimmer */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: `${shimmerProgress}%`,
            width: "48%",
            height: "100%",
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)",
            opacity: shimmerOpacity,
            pointerEvents: "none",
          }}
        />

        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${accentWidth}%`,
            height: 2.5,
            background: `linear-gradient(90deg, ${stat.color} 0%, ${stat.color}80 50%, transparent 100%)`,
            borderRadius: "4px 0 0 0",
            boxShadow: `0 0 ${14 * cardGlow}px ${stat.color}60`,
          }}
        />

        {/* Left accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 3.5,
            height: `${leftAccentHeight}%`,
            background: `linear-gradient(180deg, ${stat.color} 0%, ${stat.color}55 60%, transparent 100%)`,
            borderRadius: "4px 0 0 0",
            boxShadow: `0 0 ${16 * cardGlow}px ${stat.color}50`,
          }}
        />

        {/* Number */}
        <div
          style={{
            fontSize: 58,
            fontWeight: 900,
            color: "#ffffff",
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: -2.5,
            lineHeight: 1,
            marginBottom: 20,
            transform: `scale(${landPulse})`,
            transformOrigin: "left center",
            filter: `drop-shadow(0 0 ${numberGlow}px rgba(${accentRgb}, 0.45))`,
          }}
        >
          <span
            style={{
              color: stat.color,
              textShadow: `0 0 ${18 * cardGlow}px ${stat.color}65`,
            }}
          >
            {prefix}
          </span>
          {displayValue.toLocaleString()}
          <span
            style={{
              color: "#383838",
              fontSize: 26,
              fontWeight: 700,
              marginLeft: 4,
            }}
          >
            {suffix}
          </span>
        </div>

        {/* Label with indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            opacity: labelOpacity,
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: stat.color,
              opacity: 0.35 + dotPulse * 0.6,
              boxShadow: `0 0 ${12 * dotPulse}px ${stat.color}`,
            }}
          />
          <div
            style={{
              fontSize: 11,
              color: "#484848",
              fontFamily: "system-ui, -apple-system, sans-serif",
              textTransform: "uppercase",
              letterSpacing: 3.8,
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

// Scene 3: Stats showcase
const StatsScene: React.FC<{ stats: StatsUpdateProps["stats"] }> = ({ stats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneFade = interpolate(frame, [0, fps * 0.12], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Scene scale entrance
  const sceneScale = interpolate(
    frame,
    [0, fps * 0.18],
    [0.985, 1],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Calculate when all stats have landed
  const allStatsLandTime = (0.2 + (stats.length - 1) * 0.3 + 0.25 + 1.8) * fps;
  const allStatsLanded = frame >= allStatsLandTime;

  // Screen shake when final stat lands
  const finalShakeIntensity = allStatsLanded ? interpolate(
    frame,
    [allStatsLandTime, allStatsLandTime + fps * 0.025, allStatsLandTime + fps * 0.07, allStatsLandTime + fps * 0.14],
    [0, 4.5, -2.5, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 0;
  const shakeX = finalShakeIntensity * Math.sin(frame * 4.2 + 0.4);
  const shakeY = finalShakeIntensity * 0.5 * Math.cos(frame * 4.9 + 0.8);

  // Header
  const headerOpacity = interpolate(frame, [fps * 0.05, fps * 0.3], [0, 0.9], {
    extrapolateRight: "clamp",
  });
  const headerY = interpolate(
    frame,
    [fps * 0.05, fps * 0.35],
    [12, 0],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Live indicator pulse
  const pulseBase = interpolate(
    (frame - fps * 0.4) % (fps * 1.9),
    [0, fps * 0.45, fps * 1.9],
    [0.45, 1, 0.45],
    { extrapolateLeft: "clamp", easing: Easing.inOut(Easing.sin) }
  );
  const indicatorOpacity = frame > fps * 0.35 ? pulseBase : interpolate(
    frame,
    [fps * 0.12, fps * 0.35],
    [0, 0.45],
    { extrapolateRight: "clamp" }
  );

  // Side lines
  const lineWidth = interpolate(
    frame,
    [fps * 0.08, fps * 0.55],
    [0, 70],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Background glow
  const bgGlow = allStatsLanded ? interpolate(
    frame,
    [fps * 0.3, allStatsLandTime - fps * 0.2, allStatsLandTime, allStatsLandTime + fps * 0.1, allStatsLandTime + fps * 0.5],
    [0.015, 0.04, 0.05, 0.11, 0.065],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : interpolate(
    frame,
    [fps * 0.3, fps * 2.5],
    [0.015, 0.05],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Celebration ring
  const celebrationRingOpacity = allStatsLanded ? interpolate(
    frame,
    [allStatsLandTime, allStatsLandTime + fps * 0.08, allStatsLandTime + fps * 0.55],
    [0.65, 0.3, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : 0;
  const celebrationRingScale = allStatsLanded ? interpolate(
    frame,
    [allStatsLandTime, allStatsLandTime + fps * 0.55],
    [0.35, 3.8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 0.35;

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00ff88" intensity={bgGlow} focusY={44} />

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
            width: 200,
            height: 200,
            borderRadius: "50%",
            border: "2px solid rgba(0, 255, 136, 0.55)",
            transform: `scale(${celebrationRingScale})`,
            opacity: celebrationRingOpacity,
            boxShadow: "0 0 30px rgba(0, 255, 136, 0.35)",
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 50,
          flexDirection: "column",
          gap: 52,
          transform: `scale(${sceneScale}) translate(${shakeX}px, ${shakeY}px)`,
        }}
      >
        {/* Header */}
        <div
          style={{
            opacity: headerOpacity,
            transform: `translateY(${headerY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <div
            style={{
              width: lineWidth,
              height: 1,
              background: "linear-gradient(270deg, rgba(0, 255, 136, 0.28), transparent)",
            }}
          />
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#00ff88",
              opacity: indicatorOpacity,
              boxShadow: `0 0 ${12 + 8 * indicatorOpacity}px rgba(0, 255, 136, ${0.35 + 0.35 * indicatorOpacity})`,
            }}
          />
          <span
            style={{
              fontSize: 11,
              color: "#525252",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 6,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Live Metrics
          </span>
          <div
            style={{
              width: lineWidth,
              height: 1,
              background: "linear-gradient(90deg, rgba(0, 255, 136, 0.28), transparent)",
            }}
          />
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: 38,
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 1030,
          }}
        >
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              stat={stat}
              delay={0.2 + index * 0.3}
              index={index}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Subtle floating sparkles - premium ambient effect
const PremiumSparkles: React.FC<{ count?: number; color?: string }> = ({
  count = 8,
  color = "#00ff88"
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // Generate sparkle positions deterministically
  const sparkles = Array.from({ length: count }, (_, i) => {
    const seed = i * 137.508;
    const x = 200 + ((seed * 7) % (width - 400));
    const baseY = 150 + ((seed * 13) % (height - 300));
    const size = 2 + (seed % 3);
    const speed = 0.15 + (seed % 8) / 40;
    const phase = (seed % 10) / 10;

    // Gentle floating motion
    const y = baseY + Math.sin((frame / fps + phase) * 0.8) * 15;

    // Pulse opacity
    const pulse = interpolate(
      (frame + seed) % (fps * 2.5),
      [0, fps * 0.8, fps * 2.5],
      [0.15, 0.55, 0.15],
      { easing: Easing.inOut(Easing.sin) }
    );

    // Delayed entrance
    const entranceOpacity = interpolate(
      frame,
      [fps * 0.8 + i * fps * 0.12, fps * 1.2 + i * fps * 0.12],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: "50%",
          background: color,
          opacity: pulse * entranceOpacity,
          boxShadow: `0 0 ${6 + pulse * 8}px ${color}`,
          pointerEvents: "none",
        }}
      />
    );
  });

  return <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>{sparkles}</AbsoluteFill>;
};

// Scene 4: CTA - Commanding close
const CTAScene: React.FC<{ tagline: string; cta: string }> = ({ tagline, cta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneFade = interpolate(frame, [0, fps * 0.14], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Scene scale
  const sceneScale = interpolate(
    frame,
    [0, fps * 0.22],
    [0.982, 1],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Background glow
  const bgIntensity = interpolate(
    frame,
    [0, fps * 1.6],
    [0.02, 0.06],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Logo entrance
  const logoProgress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 48, mass: 1.3 },
  });
  const logoOpacity = interpolate(frame, [0, fps * 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });
  const logoScale = interpolate(logoProgress, [0, 1], [0.78, 1]);
  const logoGlow = interpolate(
    frame,
    [fps * 0.15, fps * 0.7, fps * 1.1],
    [0, 52, 42],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Expanding rings
  const ring1Opacity = interpolate(
    frame,
    [fps * 0.08, fps * 0.24, fps * 1.0, fps * 1.4],
    [0, 0.25, 0.1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ring1Scale = interpolate(
    frame,
    [fps * 0.08, fps * 1.4],
    [0.55, 2.3],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  const ring2Opacity = interpolate(
    frame,
    [fps * 0.15, fps * 0.32, fps * 1.15, fps * 1.55],
    [0, 0.18, 0.08, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ring2Scale = interpolate(
    frame,
    [fps * 0.15, fps * 1.55],
    [0.45, 2.8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Tagline
  const taglineOpacity = interpolate(
    frame,
    [fps * 0.35, fps * 0.62],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const taglineY = interpolate(
    frame,
    [fps * 0.35, fps * 0.68],
    [12, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // CTA button
  const ctaDelay = fps * 0.62;
  const ctaProgress = spring({
    frame: frame - ctaDelay,
    fps,
    config: { damping: 180, stiffness: 65, mass: 1.25 },
  });
  const ctaOpacity = interpolate(
    frame,
    [ctaDelay, ctaDelay + fps * 0.3],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ctaY = interpolate(ctaProgress, [0, 1], [35, 0]);
  const ctaScale = interpolate(ctaProgress, [0, 1], [0.88, 1]);

  // CTA land pulse
  const ctaLandTime = ctaDelay + fps * 0.38;
  const ctaLandPulse = frame > ctaLandTime ? interpolate(
    frame,
    [ctaLandTime, ctaLandTime + fps * 0.1, ctaLandTime + fps * 0.22],
    [1, 1.1, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 1;

  // CTA glow
  const ctaGlow = interpolate(
    frame,
    [ctaDelay + fps * 0.15, fps * 1.4, fps * 1.8],
    [0, 1.25, 1.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Gentle pulse
  const ctaPulse = frame > fps * 1.6 ? interpolate(
    (frame - fps * 1.6) % (fps * 2.5),
    [0, fps * 1.25, fps * 2.5],
    [0.94, 1, 0.94],
    { easing: Easing.inOut(Easing.sin) }
  ) : 1;

  // Inner shine
  const innerPulse = frame > fps * 1.5 ? interpolate(
    (frame - fps * 1.5) % (fps * 2.3),
    [0, fps * 1.15, fps * 2.3],
    [0.15, 0.35, 0.15],
    { easing: Easing.inOut(Easing.sin) }
  ) : 0.15;

  // Shimmer on CTA
  const ctaShimmerDelay = ctaDelay + fps * 0.38;
  const ctaShimmerProgress = interpolate(
    frame,
    [ctaShimmerDelay, ctaShimmerDelay + fps * 0.58],
    [-35, 135],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const ctaShimmerOpacity = interpolate(
    frame,
    [ctaShimmerDelay, ctaShimmerDelay + fps * 0.12, ctaShimmerDelay + fps * 0.48, ctaShimmerDelay + fps * 0.58],
    [0, 0.45, 0.3, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Bottom text
  const bottomOpacity = interpolate(
    frame,
    [fps * 1.15, fps * 1.45],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const bottomY = interpolate(
    frame,
    [fps * 1.15, fps * 1.52],
    [10, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Decorative side lines
  const lineWidth = interpolate(
    frame,
    [fps * 1.28, fps * 1.75],
    [0, 75],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00ff88" intensity={bgIntensity} focusY={50} />

      {/* Premium sparkles - subtle ambient polish */}
      <PremiumSparkles count={7} color="#00ff88" />

      {/* Ambient glow behind CTA */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 55% 45% at 50% 54%, rgba(0, 255, 136, ${0.05 * ctaGlow}) 0%, transparent 60%)`,
        }}
      />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 30,
          flexDirection: "column",
          transform: `scale(${sceneScale})`,
        }}
      >
        {/* Logo with expanding rings */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 110,
              height: 110,
              borderRadius: "50%",
              border: "1px solid rgba(0, 255, 136, 0.2)",
              transform: `translate(-50%, -50%) scale(${ring2Scale})`,
              opacity: ring2Opacity,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 105,
              height: 105,
              borderRadius: "50%",
              border: "1.5px solid rgba(0, 255, 136, 0.28)",
              transform: `translate(-50%, -50%) scale(${ring1Scale})`,
              opacity: ring1Opacity,
              boxShadow: "0 0 15px rgba(0, 255, 136, 0.1)",
            }}
          />
          <div
            style={{
              transform: `scale(${logoScale})`,
              opacity: logoOpacity,
              filter: `drop-shadow(0 0 ${logoGlow}px rgba(0, 255, 136, 0.55))`,
            }}
          >
            <FedLogo size={98} glow={false} />
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
              fontSize: 23,
              color: "#484848",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 400,
              letterSpacing: 0.6,
            }}
          >
            {tagline}
          </span>
        </div>

        {/* CTA Button */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px) scale(${ctaScale * ctaLandPulse})`,
          }}
        >
          <div
            style={{
              padding: "24px 72px",
              background: "linear-gradient(155deg, #00ff99 0%, #00ffbb 35%, #00ff88 70%, #00ff99 100%)",
              borderRadius: 56,
              position: "relative",
              overflow: "hidden",
              boxShadow: `
                0 14px 48px rgba(0, 255, 136, ${(0.35 + 0.25 * ctaGlow) * ctaPulse}),
                0 0 ${62 * ctaGlow * ctaPulse}px rgba(0, 255, 136, ${0.18 * ctaGlow * ctaPulse}),
                inset 0 2px 0 rgba(255, 255, 255, ${innerPulse * 1.15}),
                inset 0 -2px 0 rgba(0, 0, 0, 0.055)
              `,
            }}
          >
            {/* Shimmer */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: `${ctaShimmerProgress}%`,
                width: "42%",
                height: "100%",
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.75) 50%, transparent 100%)",
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
                background: `linear-gradient(180deg, rgba(255,255,255,${innerPulse * 0.95}) 0%, transparent 100%)`,
                borderRadius: "56px 56px 0 0",
                pointerEvents: "none",
              }}
            />
            <span
              style={{
                fontSize: 40,
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

        {/* Bottom text */}
        <div
          style={{
            opacity: bottomOpacity,
            transform: `translateY(${bottomY}px)`,
            marginTop: 18,
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              width: lineWidth,
              height: 1,
              background: "linear-gradient(270deg, rgba(0, 255, 136, 0.32), transparent)",
            }}
          />
          <span
            style={{
              fontSize: 11,
              color: "#383838",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 5.5,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Real yield. Every 2 minutes.
          </span>
          <div
            style={{
              width: lineWidth,
              height: 1,
              background: "linear-gradient(90deg, rgba(0, 255, 136, 0.32), transparent)",
            }}
          />
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
