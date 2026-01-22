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

// Scene 1: The Hook - Dramatic logo reveal with single powerful burst
const IntroScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Power-on sequence - darkness then reveal
  const powerOn = frame < fps * 0.08 ? 0 :
    frame < fps * 0.1 ? 0.05 :
    frame < fps * 0.12 ? 0.02 :
    frame < fps * 0.14 ? 0.12 : 1;

  const contentFade = interpolate(
    frame,
    [fps * 0.14, fps * 0.4],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) * (frame < fps * 0.14 ? powerOn : 1);

  // Single clean light burst
  const burstOpacity = interpolate(
    frame,
    [fps * 0.08, fps * 0.14, fps * 0.35, fps * 0.6],
    [0, 0.7, 0.3, 0],
    { extrapolateRight: "clamp" }
  );
  const burstScale = interpolate(
    frame,
    [fps * 0.08, fps * 0.6],
    [0.01, 3],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Horizontal reveal line
  const lineWidth = interpolate(
    frame,
    [fps * 0.06, fps * 0.4],
    [0, 600],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const lineOpacity = interpolate(
    frame,
    [fps * 0.06, fps * 0.12, fps * 0.5, fps * 0.7],
    [0, 0.5, 0.2, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Logo entrance - confident, weighty
  const logoDelay = 0.35;
  const logoProgress = spring({
    frame: frame - logoDelay * fps,
    fps,
    config: { damping: 200, stiffness: 50, mass: 1.4 },
  });
  const logoOpacity = interpolate(
    frame,
    [logoDelay * fps, (logoDelay + 0.3) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const logoScale = interpolate(logoProgress, [0, 1], [0.75, 1]);
  const logoGlow = interpolate(
    frame,
    [fps * 0.5, fps * 1.0, fps * 1.5],
    [0, 55, 40],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Single expanding ring
  const ringDelay = 0.5;
  const ringOpacity = interpolate(
    frame,
    [ringDelay * fps, (ringDelay + 0.15) * fps, fps * 1.4, fps * 1.8],
    [0, 0.2, 0.1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ringScale = interpolate(
    frame,
    [ringDelay * fps, fps * 1.8],
    [0.6, 2.2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // $FED text
  const fedDelay = 0.75;
  const fedProgress = spring({
    frame: frame - fedDelay * fps,
    fps,
    config: { damping: 200, stiffness: 80, mass: 1 },
  });
  const fedOpacity = interpolate(
    frame,
    [fedDelay * fps, (fedDelay + 0.25) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const fedY = interpolate(fedProgress, [0, 1], [15, 0]);

  // Tagline
  const tagDelay = 1.15;
  const tagOpacity = interpolate(
    frame,
    [tagDelay * fps, (tagDelay + 0.3) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const tagY = interpolate(
    frame,
    [tagDelay * fps, (tagDelay + 0.35) * fps],
    [10, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Side lines
  const sideLineWidth = interpolate(
    frame,
    [fps * 1.0, fps * 1.4],
    [0, 80],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Background glow
  const bgGlow = interpolate(
    frame,
    [fps * 0.4, fps * 1.2],
    [0.015, 0.035],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00ff88" intensity={bgGlow} focusY={50} />

      {/* Light burst */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        {/* Horizontal line */}
        <div
          style={{
            width: lineWidth,
            height: 1,
            background: "linear-gradient(90deg, transparent 0%, rgba(0,255,136,0.5) 20%, rgba(255,255,255,0.85) 50%, rgba(0,255,136,0.5) 80%, transparent 100%)",
            opacity: lineOpacity,
            position: "absolute",
            boxShadow: "0 0 20px rgba(0, 255, 136, 0.3)",
          }}
        />
        {/* Burst */}
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(0,255,136,0.5) 25%, transparent 60%)",
            opacity: burstOpacity,
            transform: `scale(${burstScale})`,
            position: "absolute",
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
            gap: 20,
          }}
        >
          {/* Logo with ring */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 150,
                height: 150,
                borderRadius: "50%",
                border: "1px solid rgba(0, 255, 136, 0.25)",
                transform: `translate(-50%, -50%) scale(${ringScale})`,
                opacity: ringOpacity,
              }}
            />
            <div
              style={{
                transform: `scale(${logoScale})`,
                opacity: logoOpacity,
                filter: `drop-shadow(0 0 ${logoGlow}px rgba(0, 255, 136, 0.5))`,
              }}
            >
              <FedLogo size={130} glow={false} />
            </div>
          </div>

          {/* $FED text */}
          <div
            style={{
              opacity: fedOpacity,
              transform: `translateY(${fedY}px)`,
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
                textShadow: "0 0 25px rgba(0, 255, 136, 0.4)",
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
                textShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
              }}
            >
              FED
            </span>
          </div>

          {/* Tagline with lines */}
          <div
            style={{
              opacity: tagOpacity,
              transform: `translateY(${tagY}px)`,
              display: "flex",
              alignItems: "center",
              gap: 18,
            }}
          >
            <div
              style={{
                width: sideLineWidth,
                height: 1,
                background: "linear-gradient(270deg, rgba(0, 255, 136, 0.25), transparent)",
              }}
            />
            <span
              style={{
                fontSize: 10,
                color: "#454545",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: 4.5,
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
                background: "linear-gradient(90deg, rgba(0, 255, 136, 0.25), transparent)",
              }}
            />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 2: Headline with BRRR payoff
const HeadlineScene: React.FC<{ headline: string }> = ({ headline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = headline.split(" ");
  const brrrIndex = words.findIndex(w => w === "BRRR");

  // Scene fade
  const sceneFade = interpolate(frame, [0, fps * 0.08], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Screen shake on BRRR
  const brrrDelay = 0.08 + brrrIndex * 0.1;
  const shakeIntensity = interpolate(
    frame,
    [(brrrDelay + 0.05) * fps, (brrrDelay + 0.08) * fps, (brrrDelay + 0.18) * fps],
    [0, 4, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const shakeX = shakeIntensity * Math.sin(frame * 3);
  const shakeY = shakeIntensity * Math.cos(frame * 4);

  // Background glow burst on BRRR
  const bgGlow = interpolate(
    frame,
    [fps * 0.2, (brrrDelay + 0.08) * fps, (brrrDelay + 0.25) * fps, fps * 1.2],
    [0.02, 0.025, 0.08, 0.04],
    { extrapolateRight: "clamp" }
  );

  // Shockwave on BRRR
  const shockwaveOpacity = interpolate(
    frame,
    [(brrrDelay + 0.04) * fps, (brrrDelay + 0.1) * fps, (brrrDelay + 0.35) * fps],
    [0, 0.4, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const shockwaveScale = interpolate(
    frame,
    [(brrrDelay + 0.04) * fps, (brrrDelay + 0.35) * fps],
    [0.2, 2.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // BRRR underline
  const underlineWidth = interpolate(
    frame,
    [(brrrDelay + 0.12) * fps, (brrrDelay + 0.3) * fps],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00ff88" intensity={bgGlow} focusY={48} />

      {/* Shockwave */}
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
            border: "2px solid rgba(0, 255, 136, 0.5)",
            opacity: shockwaveOpacity,
            transform: `scale(${shockwaveScale})`,
            position: "absolute",
            boxShadow: "0 0 20px rgba(0, 255, 136, 0.25)",
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
            const delay = 0.08 + index * 0.1;
            const wordProgress = spring({
              frame: frame - delay * fps,
              fps,
              config: { damping: 200, stiffness: 100 },
            });
            const wordOpacity = interpolate(
              frame,
              [delay * fps, (delay + 0.15) * fps],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const wordY = interpolate(wordProgress, [0, 1], [25, 0]);

            const isBrrr = word === "BRRR";

            // BRRR gets special treatment
            const brrrScale = isBrrr ? interpolate(
              frame,
              [delay * fps, (delay + 0.06) * fps, (delay + 0.12) * fps, (delay + 0.22) * fps],
              [0.7, 1.12, 0.98, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ) : 1;

            const brrrGlow = isBrrr ? interpolate(
              frame,
              [(delay + 0.04) * fps, (delay + 0.1) * fps, fps * 1.2],
              [0, 70, 35],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ) : 0;

            return (
              <span
                key={index}
                style={{
                  fontSize: isBrrr ? 80 : 70,
                  fontWeight: 900,
                  color: isBrrr ? "#00ff88" : "#ffffff",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  opacity: wordOpacity,
                  transform: `translateY(${wordY}px) scale(${brrrScale})`,
                  display: "inline-block",
                  letterSpacing: -3,
                  lineHeight: 1.1,
                  textShadow: isBrrr
                    ? `0 0 ${brrrGlow}px rgba(0, 255, 136, 0.5)`
                    : "0 4px 30px rgba(0, 0, 0, 0.45)",
                  position: "relative",
                }}
              >
                {word}
                {isBrrr && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: -8,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: `${underlineWidth}%`,
                      height: 3,
                      background: "linear-gradient(90deg, transparent 0%, #00ff88 20%, #00ffaa 50%, #00ff88 80%, transparent 100%)",
                      borderRadius: 2,
                      opacity: 0.75,
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

// Stat card with counting animation
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
    config: { damping: 200, stiffness: 70, mass: 1.2 },
  });

  const cardOpacity = interpolate(
    frame,
    [delay * fps, (delay + 0.2) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const cardY = interpolate(cardProgress, [0, 1], [35, 0]);
  const cardScale = interpolate(cardProgress, [0, 1], [0.95, 1]);

  // Number counting
  const countDuration = 1.6;
  const countStart = delay + 0.15;
  const numberProgress = interpolate(
    frame,
    [countStart * fps, (countStart + countDuration) * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: (t) => 1 - Math.pow(1 - t, 5), // Quintic ease-out
    }
  );

  // Parse value
  const numericValue = stat.numericValue ?? (parseFloat(stat.value.replace(/[^0-9.]/g, "")) || 0);
  const displayValue = Math.floor(numericValue * numberProgress);
  const prefix = stat.prefix ?? (stat.value.startsWith("$") ? "$" : "");
  const suffix = stat.suffix ?? (stat.value.includes("+") ? "+" : "");

  // Shimmer effect
  const shimmerDelay = delay + 0.45;
  const shimmerProgress = interpolate(
    frame,
    [shimmerDelay * fps, (shimmerDelay + 0.7) * fps],
    [-100, 200],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) }
  );
  const shimmerOpacity = interpolate(
    frame,
    [shimmerDelay * fps, (shimmerDelay + 0.15) * fps, (shimmerDelay + 0.55) * fps, (shimmerDelay + 0.7) * fps],
    [0, 0.15, 0.15, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Landing celebration
  const hasLanded = numberProgress >= 0.98;
  const landTime = (countStart + countDuration) * fps;

  const landPulse = hasLanded ? interpolate(
    frame,
    [landTime - fps * 0.03, landTime + fps * 0.08, landTime + fps * 0.18],
    [1, 1.06, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : 1;

  // Glow builds and bursts
  const numberGlow = hasLanded ? interpolate(
    frame,
    [landTime - fps * 0.2, landTime, landTime + fps * 0.1, landTime + fps * 0.35],
    [8, 12, 25, 14],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : interpolate(
    frame,
    [(countStart + 0.5) * fps, (countStart + countDuration) * fps],
    [0, 12],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Accent line draws
  const accentWidth = interpolate(
    frame,
    [(delay + 0.08) * fps, (delay + 0.4) * fps],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Card glow
  const cardGlow = interpolate(
    frame,
    [(countStart + countDuration - 0.3) * fps, (countStart + countDuration + 0.4) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Label opacity
  const labelOpacity = interpolate(
    frame,
    [(delay + 0.2) * fps, (delay + 0.4) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Indicator dot pulse
  const dotPulse = hasLanded && frame > landTime + fps * 0.25 ? interpolate(
    (frame - landTime - fps * 0.25) % (fps * 1.6),
    [0, fps * 0.35, fps * 1.6],
    [0.4, 0.9, 0.4]
  ) : cardGlow * 0.8;

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
      }}
    >
      <div
        style={{
          padding: "28px 36px",
          background: "linear-gradient(165deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
          borderRadius: 14,
          minWidth: 270,
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          boxShadow: `
            0 28px 60px rgba(0, 0, 0, 0.5),
            0 0 ${40 * cardGlow}px rgba(${accentRgb}, ${0.08 * cardGlow}),
            inset 0 1px 0 rgba(255, 255, 255, 0.04)
          `,
        }}
      >
        {/* Shimmer */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: `${shimmerProgress}%`,
            width: "45%",
            height: "100%",
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
            opacity: shimmerOpacity,
            pointerEvents: "none",
          }}
        />

        {/* Top accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${accentWidth}%`,
            height: 2,
            background: `linear-gradient(90deg, ${stat.color} 0%, ${stat.color}70 60%, transparent 100%)`,
            borderRadius: "2px 0 0 0",
          }}
        />

        {/* Number */}
        <div
          style={{
            fontSize: 50,
            fontWeight: 900,
            color: "#ffffff",
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: -2,
            lineHeight: 1,
            marginBottom: 14,
            transform: `scale(${landPulse})`,
            transformOrigin: "left center",
            filter: `drop-shadow(0 0 ${numberGlow}px rgba(${accentRgb}, 0.35))`,
          }}
        >
          <span
            style={{
              color: stat.color,
              textShadow: `0 0 ${12 * cardGlow}px ${stat.color}55`,
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
              marginLeft: 2,
            }}
          >
            {suffix}
          </span>
        </div>

        {/* Label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            opacity: labelOpacity,
          }}
        >
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: stat.color,
              opacity: 0.35 + dotPulse * 0.5,
              boxShadow: `0 0 ${6 * dotPulse}px ${stat.color}`,
            }}
          />
          <div
            style={{
              fontSize: 10,
              color: "#484848",
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

// Scene 3: Stats showcase
const StatsScene: React.FC<{ stats: StatsUpdateProps["stats"] }> = ({ stats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneFade = interpolate(frame, [0, fps * 0.08], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Header
  const headerOpacity = interpolate(frame, [fps * 0.04, fps * 0.25], [0, 0.75], {
    extrapolateRight: "clamp",
  });
  const headerY = interpolate(
    frame,
    [fps * 0.04, fps * 0.28],
    [8, 0],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Live indicator pulse
  const pulseBase = interpolate(
    (frame - fps * 0.3) % (fps * 1.8),
    [0, fps * 0.4, fps * 1.8],
    [0.45, 1, 0.45],
    { extrapolateLeft: "clamp", easing: Easing.inOut(Easing.sin) }
  );
  const indicatorOpacity = frame > fps * 0.25 ? pulseBase : interpolate(
    frame,
    [fps * 0.08, fps * 0.25],
    [0, 0.45],
    { extrapolateRight: "clamp" }
  );

  // Side lines
  const lineWidth = interpolate(
    frame,
    [fps * 0.06, fps * 0.38],
    [0, 40],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Background glow
  const bgGlow = interpolate(
    frame,
    [fps * 0.4, fps * 2.5],
    [0.022, 0.04],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00ff88" intensity={bgGlow} focusY={45} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 45,
          flexDirection: "column",
          gap: 42,
        }}
      >
        {/* Header */}
        <div
          style={{
            opacity: headerOpacity,
            transform: `translateY(${headerY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: lineWidth,
              height: 1,
              background: "linear-gradient(270deg, rgba(0, 255, 136, 0.15), transparent)",
            }}
          />
          <div
            style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: "#00ff88",
              opacity: indicatorOpacity,
              boxShadow: `0 0 ${6 + 5 * indicatorOpacity}px rgba(0, 255, 136, ${0.3 + 0.2 * indicatorOpacity})`,
            }}
          />
          <span
            style={{
              fontSize: 9,
              color: "#454545",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 4,
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
              background: "linear-gradient(90deg, rgba(0, 255, 136, 0.15), transparent)",
            }}
          />
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: 24,
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 920,
          }}
        >
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              stat={stat}
              delay={0.15 + index * 0.2}
              index={index}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 4: CTA
const CTAScene: React.FC<{ tagline: string; cta: string }> = ({ tagline, cta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneFade = interpolate(frame, [0, fps * 0.08], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Background glow
  const bgIntensity = interpolate(
    frame,
    [0, fps * 1.6],
    [0.025, 0.055],
    { extrapolateRight: "clamp" }
  );

  // Logo entrance
  const logoProgress = spring({
    frame,
    fps,
    config: { damping: 180, stiffness: 60, mass: 1.2 },
  });
  const logoOpacity = interpolate(frame, [0, fps * 0.25], [0, 1], {
    extrapolateRight: "clamp",
  });
  const logoScale = interpolate(logoProgress, [0, 1], [0.85, 1]);
  const logoGlow = interpolate(
    frame,
    [fps * 0.15, fps * 0.7, fps * 1.1],
    [0, 50, 42],
    { extrapolateRight: "clamp" }
  );

  // Ring
  const ringOpacity = interpolate(
    frame,
    [fps * 0.08, fps * 0.22, fps * 0.9, fps * 1.3],
    [0, 0.22, 0.1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ringScale = interpolate(
    frame,
    [fps * 0.08, fps * 1.3],
    [0.6, 2.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Tagline
  const taglineOpacity = interpolate(
    frame,
    [fps * 0.32, fps * 0.55],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const taglineY = interpolate(
    frame,
    [fps * 0.32, fps * 0.58],
    [10, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // CTA button
  const ctaDelay = fps * 0.58;
  const ctaProgress = spring({
    frame: frame - ctaDelay,
    fps,
    config: { damping: 180, stiffness: 80, mass: 1.1 },
  });
  const ctaOpacity = interpolate(
    frame,
    [ctaDelay, ctaDelay + fps * 0.22],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ctaY = interpolate(ctaProgress, [0, 1], [25, 0]);
  const ctaScale = interpolate(ctaProgress, [0, 1], [0.93, 1]);

  // CTA glow
  const ctaGlow = interpolate(
    frame,
    [ctaDelay + fps * 0.15, fps * 1.4, fps * 1.8],
    [0, 1.1, 0.95],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ctaPulse = frame > fps * 1.5 ? interpolate(
    (frame - fps * 1.5) % (fps * 2.4),
    [0, fps * 1.2, fps * 2.4],
    [0.94, 1, 0.94],
    { easing: Easing.inOut(Easing.sin) }
  ) : 1;

  // Bottom text
  const bottomOpacity = interpolate(
    frame,
    [fps * 1.05, fps * 1.35],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const bottomY = interpolate(
    frame,
    [fps * 1.05, fps * 1.4],
    [8, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Side lines
  const lineWidth = interpolate(
    frame,
    [fps * 1.2, fps * 1.65],
    [0, 50],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00ff88" intensity={bgIntensity} focusY={50} />

      {/* Ambient glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 50% 40% at 50% 54%, rgba(0, 255, 136, ${0.04 * ctaGlow}) 0%, transparent 55%)`,
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
        {/* Logo with ring */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 105,
              height: 105,
              borderRadius: "50%",
              border: "1px solid rgba(0, 255, 136, 0.25)",
              transform: `translate(-50%, -50%) scale(${ringScale})`,
              opacity: ringOpacity,
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
              fontSize: 22,
              color: "#4a4a4a",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 400,
              letterSpacing: 0.5,
            }}
          >
            {tagline}
          </span>
        </div>

        {/* CTA Button */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px) scale(${ctaScale})`,
          }}
        >
          <div
            style={{
              padding: "16px 52px",
              background: "linear-gradient(145deg, #00ff88 0%, #00ffcc 45%, #00ff88 100%)",
              borderRadius: 50,
              boxShadow: `
                0 8px 28px rgba(0, 255, 136, ${(0.25 + 0.15 * ctaGlow) * ctaPulse}),
                0 0 ${40 * ctaGlow * ctaPulse}px rgba(0, 255, 136, ${0.12 * ctaGlow * ctaPulse}),
                inset 0 2px 0 rgba(255, 255, 255, 0.2)
              `,
            }}
          >
            <span
              style={{
                fontSize: 32,
                fontWeight: 900,
                color: "#020202",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -0.5,
                textShadow: "0 1px 0 rgba(255, 255, 255, 0.15)",
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
            marginTop: 10,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: lineWidth,
              height: 1,
              background: "linear-gradient(270deg, rgba(0, 255, 136, 0.22), transparent)",
            }}
          />
          <span
            style={{
              fontSize: 10,
              color: "#3a3a3a",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 4,
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
              background: "linear-gradient(90deg, rgba(0, 255, 136, 0.22), transparent)",
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
