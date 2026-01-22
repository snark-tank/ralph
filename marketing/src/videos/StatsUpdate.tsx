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

// Minimal film grain - barely perceptible texture
const FilmGrain: React.FC<{ opacity?: number }> = ({ opacity = 0.018 }) => {
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

  // Imperceptible drift
  const drift = interpolate(frame, [0, 600], [0, 1.5], {
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
      {/* Pure black base */}
      <AbsoluteFill style={{ background: "#030303" }} />

      {/* Subtle center gradient */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% ${focusY + drift}%, ${hexToRgba(accentColor, intensity)} 0%, transparent 55%)`,
        }}
      />

      {/* Deep vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 85% 75% at 50% 50%, transparent 25%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      <FilmGrain opacity={0.015} />
    </AbsoluteFill>
  );
};

// Scene 1: The Hook - Dramatic logo reveal with cinematic gravitas
const IntroScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 0: Darkness with subtle, intentional flicker sequence - builds anticipation
  const powerOn = frame < fps * 0.06 ? 0 :
    frame < fps * 0.08 ? 0.03 :
    frame < fps * 0.1 ? 0.01 :
    frame < fps * 0.12 ? 0.08 :
    frame < fps * 0.14 ? 0.02 :
    frame < fps * 0.16 ? 0.15 : 1;

  const contentFade = interpolate(
    frame,
    [fps * 0.16, fps * 0.45],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) * (frame < fps * 0.16 ? powerOn : 1);

  // Primary light burst - radiant, centered
  const burstOpacity = interpolate(
    frame,
    [fps * 0.06, fps * 0.14, fps * 0.4, fps * 0.7],
    [0, 0.85, 0.35, 0],
    { extrapolateRight: "clamp" }
  );
  const burstScale = interpolate(
    frame,
    [fps * 0.06, fps * 0.7],
    [0.02, 3.5],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Secondary outer burst for depth
  const burst2Opacity = interpolate(
    frame,
    [fps * 0.1, fps * 0.2, fps * 0.5, fps * 0.85],
    [0, 0.5, 0.2, 0],
    { extrapolateRight: "clamp" }
  );
  const burst2Scale = interpolate(
    frame,
    [fps * 0.1, fps * 0.85],
    [0.01, 4.2],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Horizontal reveal line - cinematic wipe
  const lineWidth = interpolate(
    frame,
    [fps * 0.04, fps * 0.45],
    [0, 700],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const lineOpacity = interpolate(
    frame,
    [fps * 0.04, fps * 0.12, fps * 0.55, fps * 0.8],
    [0, 0.6, 0.25, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Logo entrance - authoritative, weighty
  const logoDelay = 0.38;
  const logoProgress = spring({
    frame: frame - logoDelay * fps,
    fps,
    config: { damping: 200, stiffness: 45, mass: 1.5 },
  });
  const logoOpacity = interpolate(
    frame,
    [logoDelay * fps, (logoDelay + 0.32) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const logoScale = interpolate(logoProgress, [0, 1], [0.72, 1]);
  const logoGlow = interpolate(
    frame,
    [fps * 0.5, fps * 1.0, fps * 1.5],
    [0, 60, 45],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Dual expanding rings - creates depth
  const ring1Delay = 0.5;
  const ring1Opacity = interpolate(
    frame,
    [ring1Delay * fps, (ring1Delay + 0.15) * fps, fps * 1.4, fps * 1.8],
    [0, 0.25, 0.12, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ring1Scale = interpolate(
    frame,
    [ring1Delay * fps, fps * 1.8],
    [0.6, 2.4],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  const ring2Delay = 0.65;
  const ring2Opacity = interpolate(
    frame,
    [ring2Delay * fps, (ring2Delay + 0.15) * fps, fps * 1.55, fps * 1.85],
    [0, 0.18, 0.08, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ring2Scale = interpolate(
    frame,
    [ring2Delay * fps, fps * 1.85],
    [0.5, 2.8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // $FED text - split animation for visual interest
  const dollarDelay = 0.72;
  const dollarProgress = spring({
    frame: frame - dollarDelay * fps,
    fps,
    config: { damping: 200, stiffness: 90, mass: 0.9 },
  });
  const dollarOpacity = interpolate(
    frame,
    [dollarDelay * fps, (dollarDelay + 0.2) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const dollarScale = interpolate(dollarProgress, [0, 1], [0.7, 1]);

  const fedDelay = 0.8;
  const fedProgress = spring({
    frame: frame - fedDelay * fps,
    fps,
    config: { damping: 200, stiffness: 70, mass: 1.1 },
  });
  const fedOpacity = interpolate(
    frame,
    [fedDelay * fps, (fedDelay + 0.28) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const fedY = interpolate(fedProgress, [0, 1], [18, 0]);

  // Tagline
  const tagDelay = 1.18;
  const tagOpacity = interpolate(
    frame,
    [tagDelay * fps, (tagDelay + 0.32) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const tagY = interpolate(
    frame,
    [tagDelay * fps, (tagDelay + 0.38) * fps],
    [12, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Side lines - draw outward
  const sideLineWidth = interpolate(
    frame,
    [fps * 1.05, fps * 1.45],
    [0, 85],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Background glow builds with content
  const bgGlow = interpolate(
    frame,
    [fps * 0.4, fps * 1.2],
    [0.018, 0.04],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00ff88" intensity={bgGlow} focusY={50} />

      {/* Light burst effects - layered for depth */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        {/* Horizontal reveal line - cinematic wipe */}
        <div
          style={{
            width: lineWidth,
            height: 1,
            background: "linear-gradient(90deg, transparent 0%, rgba(0,255,136,0.55) 20%, rgba(255,255,255,0.9) 50%, rgba(0,255,136,0.55) 80%, transparent 100%)",
            opacity: lineOpacity,
            position: "absolute",
            boxShadow: "0 0 25px rgba(0, 255, 136, 0.35)",
          }}
        />
        {/* Secondary outer burst */}
        <div
          style={{
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,255,136,0.45) 0%, rgba(0,212,255,0.2) 35%, transparent 60%)",
            opacity: burst2Opacity,
            transform: `scale(${burst2Scale})`,
            position: "absolute",
          }}
        />
        {/* Primary burst - brilliant center */}
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(0,255,136,0.6) 25%, rgba(0,255,170,0.2) 50%, transparent 70%)",
            opacity: burstOpacity,
            transform: `scale(${burstScale})`,
            position: "absolute",
          }}
        />
      </AbsoluteFill>

      {/* Expanding rings - depth and sophistication */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        {/* Outer ring */}
        <div
          style={{
            position: "absolute",
            width: 155,
            height: 155,
            borderRadius: "50%",
            border: "1px solid rgba(0, 255, 136, 0.2)",
            transform: `scale(${ring2Scale})`,
            opacity: ring2Opacity,
          }}
        />
        {/* Inner ring */}
        <div
          style={{
            position: "absolute",
            width: 150,
            height: 150,
            borderRadius: "50%",
            border: "1px solid rgba(0, 255, 136, 0.28)",
            transform: `scale(${ring1Scale})`,
            opacity: ring1Opacity,
          }}
        />
      </AbsoluteFill>

      {/* Main content */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: contentFade,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 22,
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
            <FedLogo size={135} glow={false} />
          </div>

          {/* $FED text - split animation */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
            }}
          >
            <span
              style={{
                fontSize: 60,
                fontWeight: 900,
                color: "#00ff88",
                fontFamily: "system-ui, -apple-system, sans-serif",
                textShadow: "0 0 28px rgba(0, 255, 136, 0.45)",
                opacity: dollarOpacity,
                transform: `scale(${dollarScale})`,
                display: "inline-block",
              }}
            >
              $
            </span>
            <span
              style={{
                fontSize: 60,
                fontWeight: 900,
                color: "#ffffff",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -3,
                textShadow: "0 4px 35px rgba(0, 0, 0, 0.5)",
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
              gap: 20,
            }}
          >
            <div
              style={{
                width: sideLineWidth,
                height: 1,
                background: "linear-gradient(270deg, rgba(0, 255, 136, 0.28), transparent)",
              }}
            />
            <span
              style={{
                fontSize: 10,
                color: "#484848",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: 5,
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
                background: "linear-gradient(90deg, rgba(0, 255, 136, 0.28), transparent)",
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
  const sceneFade = interpolate(frame, [0, fps * 0.08], [0, 1], {
    extrapolateRight: "clamp",
  });

  // BRRR timing - THE payoff moment
  const brrrDelay = 0.08 + brrrIndex * 0.12;
  const brrrLandTime = (brrrDelay + 0.08) * fps;

  // Screen shake on BRRR - punchy but controlled
  const shakeIntensity = interpolate(
    frame,
    [brrrLandTime, brrrLandTime + fps * 0.03, brrrLandTime + fps * 0.07, brrrLandTime + fps * 0.12, brrrLandTime + fps * 0.2],
    [0, 5, -3, 1.5, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const shakeX = shakeIntensity * Math.sin(frame * 4.2);
  const shakeY = shakeIntensity * 0.6 * Math.cos(frame * 5.1);

  // Background glow burst on BRRR - dramatic peak then settle
  const bgGlow = interpolate(
    frame,
    [fps * 0.15, brrrLandTime - fps * 0.05, brrrLandTime + fps * 0.05, brrrLandTime + fps * 0.2, fps * 1.3],
    [0.018, 0.022, 0.09, 0.055, 0.04],
    { extrapolateRight: "clamp" }
  );

  // Triple-layered shockwaves for cinematic impact
  const shock1Opacity = interpolate(
    frame,
    [brrrLandTime, brrrLandTime + fps * 0.06, brrrLandTime + fps * 0.35],
    [0.6, 0.35, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const shock1Scale = interpolate(
    frame,
    [brrrLandTime, brrrLandTime + fps * 0.35],
    [0.3, 2.8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  const shock2Opacity = interpolate(
    frame,
    [brrrLandTime + fps * 0.04, brrrLandTime + fps * 0.12, brrrLandTime + fps * 0.45],
    [0, 0.4, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const shock2Scale = interpolate(
    frame,
    [brrrLandTime + fps * 0.04, brrrLandTime + fps * 0.45],
    [0.2, 3.2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  const shock3Opacity = interpolate(
    frame,
    [brrrLandTime + fps * 0.08, brrrLandTime + fps * 0.18, brrrLandTime + fps * 0.55],
    [0, 0.25, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const shock3Scale = interpolate(
    frame,
    [brrrLandTime + fps * 0.08, brrrLandTime + fps * 0.55],
    [0.15, 3.8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // BRRR underline - draws with emphasis
  const underlineWidth = interpolate(
    frame,
    [(brrrDelay + 0.14) * fps, (brrrDelay + 0.35) * fps],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const underlineGlow = interpolate(
    frame,
    [(brrrDelay + 0.2) * fps, (brrrDelay + 0.45) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00ff88" intensity={bgGlow} focusY={48} />

      {/* Triple shockwaves - layered for depth */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        {/* Outermost shockwave */}
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: "50%",
            border: "1px solid rgba(0, 255, 136, 0.35)",
            opacity: shock3Opacity,
            transform: `scale(${shock3Scale})`,
            position: "absolute",
          }}
        />
        {/* Middle shockwave */}
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: "50%",
            border: "1.5px solid rgba(0, 255, 136, 0.45)",
            opacity: shock2Opacity,
            transform: `scale(${shock2Scale})`,
            position: "absolute",
            boxShadow: "0 0 15px rgba(0, 255, 136, 0.2)",
          }}
        />
        {/* Inner shockwave - brightest */}
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: "50%",
            border: "2px solid rgba(0, 255, 136, 0.6)",
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
            gap: "0 30px",
            maxWidth: 1080,
          }}
        >
          {words.map((word, index) => {
            const delay = 0.08 + index * 0.12;
            const wordProgress = spring({
              frame: frame - delay * fps,
              fps,
              config: { damping: 200, stiffness: 90, mass: 1.1 },
            });
            const wordOpacity = interpolate(
              frame,
              [delay * fps, (delay + 0.18) * fps],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const wordY = interpolate(wordProgress, [0, 1], [28, 0]);

            const isBrrr = word === "BRRR";

            // BRRR gets explosive treatment
            const brrrScale = isBrrr ? interpolate(
              frame,
              [delay * fps, (delay + 0.04) * fps, (delay + 0.1) * fps, (delay + 0.18) * fps, (delay + 0.28) * fps],
              [0.65, 1.18, 0.95, 1.04, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ) : 1;

            const brrrGlow = isBrrr ? interpolate(
              frame,
              [(delay + 0.02) * fps, (delay + 0.08) * fps, (delay + 0.2) * fps, fps * 1.3],
              [0, 85, 55, 38],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ) : 0;

            return (
              <span
                key={index}
                style={{
                  fontSize: isBrrr ? 85 : 72,
                  fontWeight: 900,
                  color: isBrrr ? "#00ff88" : "#ffffff",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  opacity: wordOpacity,
                  transform: `translateY(${wordY}px) scale(${brrrScale})`,
                  display: "inline-block",
                  letterSpacing: -3.5,
                  lineHeight: 1.1,
                  textShadow: isBrrr
                    ? `0 0 ${brrrGlow}px rgba(0, 255, 136, 0.55), 0 4px 35px rgba(0, 0, 0, 0.4)`
                    : "0 4px 35px rgba(0, 0, 0, 0.48)",
                  position: "relative",
                }}
              >
                {word}
                {isBrrr && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: -10,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: `${underlineWidth}%`,
                      height: 3,
                      background: "linear-gradient(90deg, transparent 0%, #00ff88 15%, #00ffbb 50%, #00ff88 85%, transparent 100%)",
                      borderRadius: 2,
                      opacity: 0.8,
                      boxShadow: `0 0 ${12 * underlineGlow}px rgba(0, 255, 136, ${0.35 * underlineGlow})`,
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

// Stat card with premium counting animation and celebration effects
const StatCard: React.FC<{
  stat: StatsUpdateProps["stats"][0];
  delay: number;
  index: number;
}> = ({ stat, delay, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card entrance - weighty, confident with subtle rotation for depth
  const cardProgress = spring({
    frame: frame - delay * fps,
    fps,
    config: { damping: 180, stiffness: 55, mass: 1.35 },
  });

  const cardOpacity = interpolate(
    frame,
    [delay * fps, (delay + 0.28) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const cardY = interpolate(cardProgress, [0, 1], [45, 0]);
  const cardScale = interpolate(cardProgress, [0, 1], [0.92, 1]);

  // Subtle rotation on entrance for visual interest
  const cardRotate = interpolate(
    frame,
    [delay * fps, (delay + 0.4) * fps],
    [index === 0 ? -1.5 : index === 2 ? 1.5 : 0, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Number counting - satisfying quintic ease-out with longer duration for drama
  const countDuration = 1.7;
  const countStart = delay + 0.22;
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

  // Landing celebration - THE payoff moment
  const hasLanded = numberProgress >= 0.98;
  const landTime = (countStart + countDuration) * fps;

  // Shimmer effect - sweeps across when number lands for celebration
  const shimmerDelay = countStart + countDuration - 0.15;
  const shimmerProgress = interpolate(
    frame,
    [shimmerDelay * fps, (shimmerDelay + 0.65) * fps],
    [-30, 130],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const shimmerOpacity = interpolate(
    frame,
    [shimmerDelay * fps, (shimmerDelay + 0.1) * fps, (shimmerDelay + 0.5) * fps, (shimmerDelay + 0.65) * fps],
    [0, 0.35, 0.25, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Scale pulse on landing - more dramatic with overshoot
  const landPulse = hasLanded ? interpolate(
    frame,
    [landTime - fps * 0.03, landTime + fps * 0.08, landTime + fps * 0.18, landTime + fps * 0.32],
    [1, 1.12, 0.97, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 1;

  // Number glow builds as it counts, then BURSTS when landing
  const numberGlow = hasLanded ? interpolate(
    frame,
    [landTime - fps * 0.12, landTime, landTime + fps * 0.1, landTime + fps * 0.45],
    [12, 18, 38, 18],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : interpolate(
    frame,
    [(countStart + 0.4) * fps, (countStart + countDuration) * fps],
    [0, 16],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Triple celebration rings when number lands - layered for depth
  const ring1Opacity = hasLanded ? interpolate(
    frame,
    [landTime, landTime + fps * 0.08, landTime + fps * 0.4],
    [0.65, 0.35, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : 0;
  const ring1Scale = hasLanded ? interpolate(
    frame,
    [landTime, landTime + fps * 0.4],
    [0.6, 2.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 0.6;

  const ring2Opacity = hasLanded ? interpolate(
    frame,
    [landTime + fps * 0.05, landTime + fps * 0.15, landTime + fps * 0.5],
    [0, 0.4, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : 0;
  const ring2Scale = hasLanded ? interpolate(
    frame,
    [landTime + fps * 0.05, landTime + fps * 0.5],
    [0.5, 2.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 0.5;

  const ring3Opacity = hasLanded ? interpolate(
    frame,
    [landTime + fps * 0.1, landTime + fps * 0.22, landTime + fps * 0.6],
    [0, 0.25, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : 0;
  const ring3Scale = hasLanded ? interpolate(
    frame,
    [landTime + fps * 0.1, landTime + fps * 0.6],
    [0.4, 3.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 0.4;

  // Accent bars draw elegantly with stagger
  const accentWidth = interpolate(
    frame,
    [(delay + 0.08) * fps, (delay + 0.5) * fps],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  const leftAccentHeight = interpolate(
    frame,
    [(delay + 0.12) * fps, (delay + 0.55) * fps],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Right accent bar - draws down
  const rightAccentHeight = interpolate(
    frame,
    [(delay + 0.2) * fps, (delay + 0.65) * fps],
    [0, 70],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Card glow intensifies and bursts on landing - more dramatic
  const cardGlow = hasLanded ? interpolate(
    frame,
    [(countStart + countDuration - 0.2) * fps, landTime, landTime + fps * 0.12, landTime + fps * 0.5],
    [0.6, 0.8, 1.4, 0.9],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : interpolate(
    frame,
    [(countStart + countDuration - 0.4) * fps, (countStart + countDuration) * fps],
    [0, 0.8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Card background brightness pulses on landing
  const bgBrightness = hasLanded ? interpolate(
    frame,
    [landTime, landTime + fps * 0.1, landTime + fps * 0.35],
    [1, 1.5, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 1;

  // Label opacity
  const labelOpacity = interpolate(
    frame,
    [(delay + 0.25) * fps, (delay + 0.5) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Indicator dot pulse - refined timing with ring expansion
  const dotPulse = hasLanded && frame > landTime + fps * 0.35 ? interpolate(
    (frame - landTime - fps * 0.35) % (fps * 1.6),
    [0, fps * 0.35, fps * 1.6],
    [0.45, 1, 0.45],
    { easing: Easing.inOut(Easing.sin) }
  ) : interpolate(
    frame,
    [(delay + 0.35) * fps, landTime + fps * 0.35],
    [0, cardGlow * 0.9],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Dot ring expansion
  const dotRingScale = hasLanded && frame > landTime + fps * 0.35 ? interpolate(
    (frame - landTime - fps * 0.35) % (fps * 1.6),
    [0, fps * 0.35, fps * 1.6],
    [1, 2.2, 1],
    { easing: Easing.out(Easing.cubic) }
  ) : 1;
  const dotRingOpacity = hasLanded && frame > landTime + fps * 0.35 ? interpolate(
    (frame - landTime - fps * 0.35) % (fps * 1.6),
    [0, fps * 0.3, fps * 1.6],
    [0.6, 0, 0],
    { extrapolateLeft: "clamp" }
  ) : 0;

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
      {/* Triple celebration rings on number landing - layered for depth */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          width: 90,
          height: 90,
          borderRadius: "50%",
          border: `2px solid rgba(${accentRgb}, 0.6)`,
          transform: `translate(-50%, -50%) scale(${ring1Scale})`,
          opacity: ring1Opacity,
          pointerEvents: "none",
          boxShadow: `0 0 15px rgba(${accentRgb}, 0.3)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          width: 95,
          height: 95,
          borderRadius: "50%",
          border: `1.5px solid rgba(${accentRgb}, 0.45)`,
          transform: `translate(-50%, -50%) scale(${ring2Scale})`,
          opacity: ring2Opacity,
          pointerEvents: "none",
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
          border: `1px solid rgba(${accentRgb}, 0.3)`,
          transform: `translate(-50%, -50%) scale(${ring3Scale})`,
          opacity: ring3Opacity,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          padding: "32px 42px",
          background: `linear-gradient(165deg, rgba(255,255,255,${0.045 * bgBrightness}) 0%, rgba(255,255,255,${0.012 * bgBrightness}) 100%)`,
          borderRadius: 18,
          minWidth: 290,
          position: "relative",
          overflow: "hidden",
          border: `1px solid rgba(255, 255, 255, ${0.055 + 0.025 * cardGlow})`,
          boxShadow: `
            0 32px 70px rgba(0, 0, 0, 0.55),
            0 0 ${50 * cardGlow}px rgba(${accentRgb}, ${0.12 * cardGlow}),
            inset 0 1px 0 rgba(255, 255, 255, 0.05)
          `,
        }}
      >
        {/* Shimmer - synced with number landing */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: `${shimmerProgress}%`,
            width: "50%",
            height: "100%",
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
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
            borderRadius: "3px 0 0 0",
            boxShadow: `0 0 ${12 * cardGlow}px ${stat.color}60`,
          }}
        />

        {/* Left accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 3,
            height: `${leftAccentHeight}%`,
            background: `linear-gradient(180deg, ${stat.color} 0%, ${stat.color}60 60%, transparent 100%)`,
            borderRadius: "3px 0 0 0",
            boxShadow: `0 0 ${14 * cardGlow}px ${stat.color}55`,
          }}
        />

        {/* Right accent bar - subtle */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 2,
            height: `${rightAccentHeight}%`,
            background: `linear-gradient(180deg, rgba(${accentRgb}, 0.25) 0%, transparent 100%)`,
            borderRadius: "0 3px 0 0",
          }}
        />

        {/* Number with celebration */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 900,
            color: "#ffffff",
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: -2.5,
            lineHeight: 1,
            marginBottom: 18,
            transform: `scale(${landPulse})`,
            transformOrigin: "left center",
            filter: `drop-shadow(0 0 ${numberGlow}px rgba(${accentRgb}, 0.45))`,
          }}
        >
          <span
            style={{
              color: stat.color,
              textShadow: `0 0 ${16 * cardGlow}px ${stat.color}65`,
            }}
          >
            {prefix}
          </span>
          {displayValue.toLocaleString()}
          <span
            style={{
              color: "#3a3a3a",
              fontSize: 26,
              fontWeight: 700,
              marginLeft: 4,
            }}
          >
            {suffix}
          </span>
        </div>

        {/* Label with pulsing indicator and ring */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            opacity: labelOpacity,
          }}
        >
          <div style={{ position: "relative" }}>
            {/* Dot ring pulse */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 6,
                height: 6,
                borderRadius: "50%",
                border: `1px solid ${stat.color}`,
                transform: `translate(-50%, -50%) scale(${dotRingScale})`,
                opacity: dotRingOpacity,
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: stat.color,
                opacity: 0.4 + dotPulse * 0.55,
                boxShadow: `0 0 ${10 * dotPulse}px ${stat.color}`,
              }}
            />
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#4a4a4a",
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

// Scene 3: Stats showcase - premium data visualization
const StatsScene: React.FC<{ stats: StatsUpdateProps["stats"] }> = ({ stats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneFade = interpolate(frame, [0, fps * 0.12], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Scene scale entrance - subtle zoom in
  const sceneScale = interpolate(
    frame,
    [0, fps * 0.18],
    [0.985, 1],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Header entrance
  const headerOpacity = interpolate(frame, [fps * 0.04, fps * 0.32], [0, 0.85], {
    extrapolateRight: "clamp",
  });
  const headerY = interpolate(
    frame,
    [fps * 0.04, fps * 0.35],
    [12, 0],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Live indicator pulse - refined timing with ring expansion
  const pulseBase = interpolate(
    (frame - fps * 0.35) % (fps * 1.8),
    [0, fps * 0.4, fps * 1.8],
    [0.5, 1, 0.5],
    { extrapolateLeft: "clamp", easing: Easing.inOut(Easing.sin) }
  );
  const indicatorOpacity = frame > fps * 0.3 ? pulseBase : interpolate(
    frame,
    [fps * 0.1, fps * 0.3],
    [0, 0.5],
    { extrapolateRight: "clamp" }
  );

  // Pulsing ring around indicator - dual rings for depth
  const ring1Scale = frame > fps * 0.35 ? interpolate(
    (frame - fps * 0.35) % (fps * 1.8),
    [0, fps * 0.4, fps * 1.8],
    [1, 2.0, 1],
    { easing: Easing.out(Easing.cubic) }
  ) : 1;
  const ring1Opacity = frame > fps * 0.35 ? interpolate(
    (frame - fps * 0.35) % (fps * 1.8),
    [0, fps * 0.35, fps * 1.8],
    [0.55, 0, 0],
    { extrapolateLeft: "clamp" }
  ) : 0;

  const ring2Scale = frame > fps * 0.5 ? interpolate(
    (frame - fps * 0.5) % (fps * 1.8),
    [0, fps * 0.4, fps * 1.8],
    [1, 2.5, 1],
    { easing: Easing.out(Easing.cubic) }
  ) : 1;
  const ring2Opacity = frame > fps * 0.5 ? interpolate(
    (frame - fps * 0.5) % (fps * 1.8),
    [0, fps * 0.35, fps * 1.8],
    [0.35, 0, 0],
    { extrapolateLeft: "clamp" }
  ) : 0;

  // Side lines - draw outward with glow
  const lineWidth = interpolate(
    frame,
    [fps * 0.06, fps * 0.5],
    [0, 65],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const lineGlow = interpolate(
    frame,
    [fps * 0.3, fps * 0.7],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Background glow intensifies as numbers climb - more dramatic
  const bgGlow = interpolate(
    frame,
    [fps * 0.3, fps * 2.5],
    [0.02, 0.055],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Ambient pulse when stats are counting - subtle but adds energy
  const ambientPulse = frame > fps * 0.8 && frame < fps * 2.8 ? interpolate(
    (frame - fps * 0.8) % (fps * 0.5),
    [0, fps * 0.15, fps * 0.5],
    [0, 0.015, 0],
    { easing: Easing.inOut(Easing.sin) }
  ) : 0;

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00ff88" intensity={bgGlow + ambientPulse} focusY={44} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 50,
          flexDirection: "column",
          gap: 48,
          transform: `scale(${sceneScale})`,
        }}
      >
        {/* Header with live indicator */}
        <div
          style={{
            opacity: headerOpacity,
            transform: `translateY(${headerY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: lineWidth,
              height: 1,
              background: "linear-gradient(270deg, rgba(0, 255, 136, 0.25), transparent)",
              boxShadow: `0 0 ${8 * lineGlow}px rgba(0, 255, 136, ${0.15 * lineGlow})`,
            }}
          />
          <div style={{ position: "relative" }}>
            {/* Outer pulsing ring */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 6,
                height: 6,
                borderRadius: "50%",
                border: "1px solid #00ff88",
                transform: `translate(-50%, -50%) scale(${ring2Scale})`,
                opacity: ring2Opacity,
                pointerEvents: "none",
              }}
            />
            {/* Inner pulsing ring */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 6,
                height: 6,
                borderRadius: "50%",
                border: "1px solid #00ff88",
                transform: `translate(-50%, -50%) scale(${ring1Scale})`,
                opacity: ring1Opacity,
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#00ff88",
                opacity: indicatorOpacity,
                boxShadow: `0 0 ${10 + 7 * indicatorOpacity}px rgba(0, 255, 136, ${0.4 + 0.3 * indicatorOpacity})`,
              }}
            />
          </div>
          <span
            style={{
              fontSize: 11,
              color: "#4a4a4a",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 5,
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
              background: "linear-gradient(90deg, rgba(0, 255, 136, 0.25), transparent)",
              boxShadow: `0 0 ${8 * lineGlow}px rgba(0, 255, 136, ${0.15 * lineGlow})`,
            }}
          />
        </div>

        {/* Stats row - premium spacing */}
        <div
          style={{
            display: "flex",
            gap: 32,
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 1000,
          }}
        >
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              stat={stat}
              delay={0.16 + index * 0.24}
              index={index}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 4: CTA - Commanding, memorable close
const CTAScene: React.FC<{ tagline: string; cta: string }> = ({ tagline, cta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneFade = interpolate(frame, [0, fps * 0.12], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Scene scale - subtle zoom in for energy
  const sceneScale = interpolate(
    frame,
    [0, fps * 0.2],
    [0.985, 1],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Background glow builds with CTA - more dramatic
  const bgIntensity = interpolate(
    frame,
    [0, fps * 1.6],
    [0.025, 0.07],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Logo entrance - hero element with commanding presence
  const logoProgress = spring({
    frame,
    fps,
    config: { damping: 175, stiffness: 50, mass: 1.3 },
  });
  const logoOpacity = interpolate(frame, [0, fps * 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });
  const logoScale = interpolate(logoProgress, [0, 1], [0.8, 1]);
  const logoGlow = interpolate(
    frame,
    [fps * 0.15, fps * 0.7, fps * 1.1],
    [0, 60, 52],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Triple expanding rings - more depth and sophistication
  const ring1Opacity = interpolate(
    frame,
    [fps * 0.06, fps * 0.22, fps * 0.95, fps * 1.35],
    [0, 0.3, 0.14, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ring1Scale = interpolate(
    frame,
    [fps * 0.06, fps * 1.35],
    [0.55, 2.2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  const ring2Opacity = interpolate(
    frame,
    [fps * 0.12, fps * 0.3, fps * 1.1, fps * 1.5],
    [0, 0.22, 0.1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ring2Scale = interpolate(
    frame,
    [fps * 0.12, fps * 1.5],
    [0.48, 2.7],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  const ring3Opacity = interpolate(
    frame,
    [fps * 0.18, fps * 0.38, fps * 1.25, fps * 1.65],
    [0, 0.15, 0.06, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ring3Scale = interpolate(
    frame,
    [fps * 0.18, fps * 1.65],
    [0.42, 3.2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Tagline - the value proposition with more emphasis
  const taglineOpacity = interpolate(
    frame,
    [fps * 0.32, fps * 0.58],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const taglineY = interpolate(
    frame,
    [fps * 0.32, fps * 0.62],
    [14, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // CTA button - THE action moment with dramatic entrance
  const ctaDelay = fps * 0.58;
  const ctaProgress = spring({
    frame: frame - ctaDelay,
    fps,
    config: { damping: 165, stiffness: 70, mass: 1.2 },
  });
  const ctaOpacity = interpolate(
    frame,
    [ctaDelay, ctaDelay + fps * 0.28],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ctaY = interpolate(ctaProgress, [0, 1], [32, 0]);
  const ctaScale = interpolate(ctaProgress, [0, 1], [0.9, 1]);

  // CTA lands with a satisfying scale pulse
  const ctaLandTime = ctaDelay + fps * 0.4;
  const ctaLandPulse = frame > ctaLandTime ? interpolate(
    frame,
    [ctaLandTime, ctaLandTime + fps * 0.1, ctaLandTime + fps * 0.25],
    [1, 1.06, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 1;

  // CTA glow builds dramatically then pulses with refined breathing - more dramatic
  const ctaGlow = interpolate(
    frame,
    [ctaDelay + fps * 0.15, fps * 1.4, fps * 1.8],
    [0, 1.25, 1.05],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const ctaPulse = frame > fps * 1.55 ? interpolate(
    (frame - fps * 1.55) % (fps * 2.2),
    [0, fps * 1.1, fps * 2.2],
    [0.94, 1, 0.94],
    { easing: Easing.inOut(Easing.sin) }
  ) : 1;

  // Inner shine animation on CTA - more visible
  const innerPulse = frame > fps * 1.5 ? interpolate(
    (frame - fps * 1.5) % (fps * 2.0),
    [0, fps * 1.0, fps * 2.0],
    [0.2, 0.4, 0.2],
    { easing: Easing.inOut(Easing.sin) }
  ) : 0.2;

  // Shimmer effect on CTA button when it lands
  const ctaShimmerDelay = ctaDelay + fps * 0.35;
  const ctaShimmerProgress = interpolate(
    frame,
    [ctaShimmerDelay, ctaShimmerDelay + fps * 0.55],
    [-30, 130],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const ctaShimmerOpacity = interpolate(
    frame,
    [ctaShimmerDelay, ctaShimmerDelay + fps * 0.1, ctaShimmerDelay + fps * 0.45, ctaShimmerDelay + fps * 0.55],
    [0, 0.4, 0.3, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Bottom text - final beat with better timing
  const bottomOpacity = interpolate(
    frame,
    [fps * 1.1, fps * 1.4],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const bottomY = interpolate(
    frame,
    [fps * 1.1, fps * 1.48],
    [12, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Decorative side lines - draw outward with glow
  const lineWidth = interpolate(
    frame,
    [fps * 1.25, fps * 1.7],
    [0, 70],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const lineGlow = interpolate(
    frame,
    [fps * 1.45, fps * 1.85],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00ff88" intensity={bgIntensity} focusY={50} />

      {/* Ambient glow behind CTA - intensifies with button */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 55% 45% at 50% 54%, rgba(0, 255, 136, ${0.055 * ctaGlow}) 0%, transparent 60%)`,
        }}
      />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 28,
          flexDirection: "column",
          transform: `scale(${sceneScale})`,
        }}
      >
        {/* Logo with triple expanding rings */}
        <div style={{ position: "relative" }}>
          {/* Outermost ring */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 115,
              height: 115,
              borderRadius: "50%",
              border: "1px solid rgba(0, 255, 136, 0.15)",
              transform: `translate(-50%, -50%) scale(${ring3Scale})`,
              opacity: ring3Opacity,
            }}
          />
          {/* Middle ring */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 110,
              height: 110,
              borderRadius: "50%",
              border: "1px solid rgba(0, 255, 136, 0.22)",
              transform: `translate(-50%, -50%) scale(${ring2Scale})`,
              opacity: ring2Opacity,
            }}
          />
          {/* Inner ring */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 105,
              height: 105,
              borderRadius: "50%",
              border: "1.5px solid rgba(0, 255, 136, 0.3)",
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
            <FedLogo size={100} glow={false} />
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
              fontSize: 24,
              color: "#4a4a4a",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 400,
              letterSpacing: 0.8,
            }}
          >
            {tagline}
          </span>
        </div>

        {/* CTA Button - commanding presence with premium styling and shimmer */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px) scale(${ctaScale * ctaLandPulse})`,
          }}
        >
          <div
            style={{
              padding: "20px 62px",
              background: "linear-gradient(145deg, #00ff88 0%, #00ffcc 45%, #00ff88 100%)",
              borderRadius: 50,
              position: "relative",
              overflow: "hidden",
              boxShadow: `
                0 10px 38px rgba(0, 255, 136, ${(0.32 + 0.2 * ctaGlow) * ctaPulse}),
                0 0 ${52 * ctaGlow * ctaPulse}px rgba(0, 255, 136, ${0.16 * ctaGlow * ctaPulse}),
                inset 0 2px 0 rgba(255, 255, 255, ${innerPulse}),
                inset 0 -2px 0 rgba(0, 0, 0, 0.08)
              `,
            }}
          >
            {/* Shimmer on entrance */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: `${ctaShimmerProgress}%`,
                width: "40%",
                height: "100%",
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)",
                opacity: ctaShimmerOpacity,
                pointerEvents: "none",
              }}
            />
            {/* Inner shine animation */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "50%",
                background: `linear-gradient(180deg, rgba(255,255,255,${innerPulse * 0.9}) 0%, transparent 100%)`,
                borderRadius: "50px 50px 0 0",
                pointerEvents: "none",
              }}
            />
            <span
              style={{
                fontSize: 36,
                fontWeight: 900,
                color: "#020202",
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

        {/* Bottom text with decorative lines and glow */}
        <div
          style={{
            opacity: bottomOpacity,
            transform: `translateY(${bottomY}px)`,
            marginTop: 16,
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <div
            style={{
              width: lineWidth,
              height: 1,
              background: "linear-gradient(270deg, rgba(0, 255, 136, 0.3), transparent)",
              boxShadow: `0 0 ${8 * lineGlow}px rgba(0, 255, 136, ${0.15 * lineGlow})`,
            }}
          />
          <span
            style={{
              fontSize: 11,
              color: "#3a3a3a",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 5,
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
              background: "linear-gradient(90deg, rgba(0, 255, 136, 0.3), transparent)",
              boxShadow: `0 0 ${8 * lineGlow}px rgba(0, 255, 136, ${0.15 * lineGlow})`,
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

  const transitionFrames = Math.round(0.18 * fps);

  return (
    <TransitionSeries>
      {/* Intro: 1.85s */}
      <TransitionSeries.Sequence durationInFrames={Math.round(1.85 * fps)}>
        <IntroScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* Headline: 1.65s */}
      <TransitionSeries.Sequence durationInFrames={Math.round(1.65 * fps)}>
        <HeadlineScene headline={headline} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* Stats: 3.65s */}
      <TransitionSeries.Sequence durationInFrames={Math.round(3.65 * fps)}>
        <StatsScene stats={stats} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* CTA: 2.85s */}
      <TransitionSeries.Sequence durationInFrames={Math.round(2.85 * fps)}>
        <CTAScene tagline={tagline} cta={cta} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
