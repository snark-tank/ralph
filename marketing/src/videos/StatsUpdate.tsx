import {
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
  spring,
  interpolate,
  Easing,
  random,
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

// Premium film grain overlay - adds texture and warmth
const FilmGrain: React.FC<{ opacity?: number }> = ({ opacity = 0.03 }) => {
  const frame = useCurrentFrame();
  // Offset changes every frame for grain effect
  const offsetX = (frame * 17) % 100;
  const offsetY = (frame * 23) % 100;

  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundPosition: `${offsetX}px ${offsetY}px`,
        opacity,
        mixBlendMode: "overlay",
        pointerEvents: "none",
      }}
    />
  );
};

// Subtle scan line effect for CRT aesthetic
const ScanLines: React.FC<{ opacity?: number }> = ({ opacity = 0.015 }) => {
  return (
    <AbsoluteFill
      style={{
        background: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0, 0, 0, ${opacity}) 2px,
          rgba(0, 0, 0, ${opacity}) 4px
        )`,
        pointerEvents: "none",
      }}
    />
  );
};

// Minimal cinematic background - barely perceptible, supremely elegant
const CinematicBackground: React.FC<{
  accentColor?: string;
  intensity?: number;
  focusY?: number;
  showGrain?: boolean;
}> = ({ accentColor = "#00ff88", intensity = 0.02, focusY = 50, showGrain = true }) => {
  const frame = useCurrentFrame();

  // Extremely slow, imperceptible drift - creates subtle life
  const drift = interpolate(frame, [0, 600], [0, 2.5], {
    extrapolateRight: "clamp",
  });

  // Convert hex to rgba
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
      {/* Pure black base - premium foundation */}
      <AbsoluteFill style={{ background: "#050505" }} />

      {/* Subtle noise texture base */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, #080808 0%, #020202 100%)`,
        }}
      />

      {/* Primary glow - whisper-quiet presence, centered */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 85% 50% at 50% ${focusY + drift}%, ${hexToRgba(accentColor, intensity)} 0%, transparent 60%)`,
        }}
      />

      {/* Secondary ambient wash - adds depth without distraction */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 100% 25% at 50% 5%, ${hexToRgba(accentColor, intensity * 0.15)} 0%, transparent 40%)`,
        }}
      />

      {/* Cinematic vignette - frames the content elegantly */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 82% 72% at 50% 50%, transparent 30%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Film grain for texture */}
      {showGrain && <FilmGrain opacity={0.025} />}
    </AbsoluteFill>
  );
};

// Scene 1: The Hook - Apple-keynote style dramatic reveal
const IntroScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 0: Total darkness with a subtle flicker before the reveal
  const flicker = frame < fps * 0.12 ? 0 :
    frame < fps * 0.14 ? 0.15 :
    frame < fps * 0.16 ? 0.05 :
    frame < fps * 0.18 ? 0.2 : 1;

  const darknessFade = interpolate(
    frame,
    [fps * 0.18, fps * 0.4],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) * (frame < fps * 0.18 ? flicker : 1);

  // Initial light burst - a single bright point that expands
  const burstOpacity = interpolate(
    frame,
    [fps * 0.12, fps * 0.22, fps * 0.55, fps * 0.85],
    [0, 0.7, 0.25, 0],
    { extrapolateRight: "clamp" }
  );
  const burstScale = interpolate(
    frame,
    [fps * 0.12, fps * 0.8],
    [0.05, 3.5],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Secondary burst ring for depth
  const ring2BurstOpacity = interpolate(
    frame,
    [fps * 0.18, fps * 0.28, fps * 0.6, fps * 0.9],
    [0, 0.4, 0.15, 0],
    { extrapolateRight: "clamp" }
  );
  const ring2BurstScale = interpolate(
    frame,
    [fps * 0.18, fps * 0.9],
    [0.02, 4.0],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Logo emerges from the burst - THE moment
  const logoDelay = 0.35;
  const logoProgress = spring({
    frame: frame - logoDelay * fps,
    fps,
    config: { damping: 180, stiffness: 55, mass: 1.3 },
  });

  const logoOpacity = interpolate(
    frame,
    [logoDelay * fps, (logoDelay + 0.35) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const logoScale = interpolate(logoProgress, [0, 1], [0.75, 1]);

  // Dual concentric rings - expands creating depth and sophistication
  const ring1Delay = 0.45;
  const ring1Opacity = interpolate(
    frame,
    [ring1Delay * fps, (ring1Delay + 0.18) * fps, fps * 1.5, fps * 1.85],
    [0, 0.22, 0.12, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ring1Scale = interpolate(
    frame,
    [ring1Delay * fps, fps * 1.85],
    [0.65, 2.2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  const ring2Delay = 0.6;
  const ring2Opacity = interpolate(
    frame,
    [ring2Delay * fps, (ring2Delay + 0.18) * fps, fps * 1.7, fps * 2.0],
    [0, 0.15, 0.08, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ring2Scale = interpolate(
    frame,
    [ring2Delay * fps, fps * 2.0],
    [0.5, 2.8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Logo glow builds majestically - peaks then settles
  const logoGlow = interpolate(
    frame,
    [fps * 0.5, fps * 1.0, fps * 1.8],
    [0, 65, 45],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // $FED text - appears with measured confidence after logo lands
  const fedDelay = 0.85;
  const fedProgress = spring({
    frame: frame - fedDelay * fps,
    fps,
    config: { damping: 200, stiffness: 85 },
  });
  const fedOpacity = interpolate(
    frame,
    [fedDelay * fps, (fedDelay + 0.25) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const fedY = interpolate(fedProgress, [0, 1], [14, 0]);

  // $ sign gets a subtle scale pulse when it appears
  const dollarPulse = interpolate(
    frame,
    [fedDelay * fps, (fedDelay + 0.15) * fps, (fedDelay + 0.35) * fps],
    [0.9, 1.08, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Tagline - final beat, elegant fade
  const tagDelay = 1.2;
  const tagOpacity = interpolate(
    frame,
    [tagDelay * fps, (tagDelay + 0.32) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const tagY = interpolate(
    frame,
    [tagDelay * fps, (tagDelay + 0.38) * fps],
    [8, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Decorative side lines - frame the composition symmetrically
  const lineWidth = interpolate(
    frame,
    [fps * 1.0, fps * 1.5],
    [0, 85],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Horizontal reveal line - cinematic wipe effect
  const revealLineWidth = interpolate(
    frame,
    [fps * 0.08, fps * 0.5],
    [0, 600],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const revealLineOpacity = interpolate(
    frame,
    [fps * 0.08, fps * 0.2, fps * 0.7, fps * 1.0],
    [0, 0.4, 0.2, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Background glow intensifies with logo
  const bgGlow = interpolate(
    frame,
    [fps * 0.4, fps * 1.2],
    [0.015, 0.032],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00ff88" intensity={bgGlow} focusY={50} />

      {/* Initial light burst - draws the eye */}
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
            width: revealLineWidth,
            height: 1,
            background: "linear-gradient(90deg, transparent 0%, rgba(0,255,136,0.6) 25%, rgba(255,255,255,0.8) 50%, rgba(0,255,136,0.6) 75%, transparent 100%)",
            opacity: revealLineOpacity,
            position: "absolute",
            boxShadow: "0 0 20px rgba(0, 255, 136, 0.3)",
          }}
        />
        {/* Secondary outer burst - creates depth */}
        <div
          style={{
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,255,136,0.35) 0%, rgba(0,212,255,0.15) 40%, transparent 60%)",
            opacity: ring2BurstOpacity,
            transform: `scale(${ring2BurstScale})`,
            position: "absolute",
          }}
        />
        {/* Primary burst */}
        <div
          style={{
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(0,255,136,0.6) 25%, rgba(0,255,180,0.2) 50%, transparent 70%)",
            opacity: burstOpacity,
            transform: `scale(${burstScale})`,
            position: "absolute",
          }}
        />
      </AbsoluteFill>

      {/* Content container */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: darknessFade,
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
          {/* Logo container with concentric rings */}
          <div style={{ position: "relative" }}>
            {/* Outer ring */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 180,
                height: 180,
                borderRadius: "50%",
                border: "1px solid rgba(0, 255, 136, 0.2)",
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
                width: 165,
                height: 165,
                borderRadius: "50%",
                border: "1px solid rgba(0, 255, 136, 0.25)",
                transform: `translate(-50%, -50%) scale(${ring1Scale})`,
                opacity: ring1Opacity,
              }}
            />
            {/* Logo */}
            <div
              style={{
                transform: `scale(${logoScale})`,
                opacity: logoOpacity,
                filter: `drop-shadow(0 0 ${logoGlow}px rgba(0, 255, 136, 0.55))`,
              }}
            >
              <FedLogo size={150} glow={false} />
            </div>
          </div>

          {/* $FED text with sophisticated typography */}
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
                fontSize: 62,
                fontWeight: 900,
                color: "#00ff88",
                fontFamily: "system-ui, -apple-system, sans-serif",
                transform: `scale(${dollarPulse})`,
                display: "inline-block",
                textShadow: "0 0 35px rgba(0, 255, 136, 0.4)",
              }}
            >
              $
            </span>
            <span
              style={{
                fontSize: 62,
                fontWeight: 900,
                color: "#ffffff",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -3,
                textShadow: "0 4px 40px rgba(0, 0, 0, 0.5)",
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
                width: lineWidth,
                height: 1,
                background: "linear-gradient(270deg, rgba(0, 255, 136, 0.3), transparent)",
              }}
            />
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
              Quantitative Easing for the People
            </span>
            <div
              style={{
                width: lineWidth,
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

// Scene 2: Headline - Typography with explosive BRRR payoff
const HeadlineScene: React.FC<{ headline: string }> = ({ headline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = headline.split(" ");

  // Scene builds in
  const sceneFade = interpolate(frame, [0, fps * 0.1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Find BRRR for special timing
  const brrrWordIndex = words.findIndex(w => w === "BRRR");
  const brrrDelay = 0.1 + brrrWordIndex * 0.1;

  // Screen shake when BRRR lands - adds impact
  const shakeIntensity = interpolate(
    frame,
    [(brrrDelay + 0.08) * fps, (brrrDelay + 0.12) * fps, (brrrDelay + 0.25) * fps],
    [0, 4, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const shakeX = shakeIntensity * Math.sin(frame * 2.5);
  const shakeY = shakeIntensity * Math.cos(frame * 3.2);

  // Background glow EXPLODES when BRRR lands
  const bgGlow = interpolate(
    frame,
    [fps * 0.3, (brrrDelay + 0.15) * fps, (brrrDelay + 0.35) * fps, fps * 1.5],
    [0.02, 0.025, 0.08, 0.04],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Shockwave effect when BRRR lands
  const shockwaveOpacity = interpolate(
    frame,
    [(brrrDelay + 0.12) * fps, (brrrDelay + 0.25) * fps, (brrrDelay + 0.55) * fps],
    [0, 0.4, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const shockwaveScale = interpolate(
    frame,
    [(brrrDelay + 0.12) * fps, (brrrDelay + 0.55) * fps],
    [0.3, 2.8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // BRRR underline - rapid draw that hits hard
  const brrrUnderline = interpolate(
    frame,
    [(brrrDelay + 0.18) * fps, (brrrDelay + 0.45) * fps],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const underlineGlow = interpolate(
    frame,
    [(brrrDelay + 0.25) * fps, (brrrDelay + 0.6) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00ff88" intensity={bgGlow} focusY={48} />

      {/* Shockwave effect behind BRRR */}
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
            border: "2px solid rgba(0, 255, 136, 0.5)",
            opacity: shockwaveOpacity,
            transform: `scale(${shockwaveScale})`,
            position: "absolute",
            boxShadow: "0 0 30px rgba(0, 255, 136, 0.3)",
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 80,
          flexDirection: "column",
          transform: `translate(${shakeX}px, ${shakeY}px)`,
        }}
      >
        {/* Headline - word by word with perfect rhythm */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0 30px",
            maxWidth: 1100,
            position: "relative",
          }}
        >
          {words.map((word, index) => {
            // Tighter stagger - builds momentum to BRRR
            const delay = 0.1 + index * 0.1;
            const wordProgress = spring({
              frame: frame - delay * fps,
              fps,
              config: { damping: 180, stiffness: 120, mass: 0.9 },
            });
            const wordOpacity = interpolate(
              frame,
              [delay * fps, (delay + 0.15) * fps],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const wordY = interpolate(wordProgress, [0, 1], [25, 0]);
            const wordScale = interpolate(wordProgress, [0, 1], [0.97, 1]);

            // BRRR gets EXPLOSIVE treatment - it's THE payoff moment
            const isEmphasis = word === "BRRR";

            // BRRR has a bigger, more dramatic entrance
            const emphasisScale = isEmphasis ? interpolate(
              frame,
              [delay * fps, (delay + 0.12) * fps, (delay + 0.25) * fps],
              [0.7, 1.12, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
            ) : wordScale;

            // BRRR Y offset - it SLAMS down
            const emphasisY = isEmphasis ? interpolate(
              frame,
              [delay * fps, (delay + 0.12) * fps],
              [-20, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
            ) : wordY;

            // Glow EXPLODES on BRRR then settles
            const emphasisGlow = isEmphasis ? interpolate(
              frame,
              [(delay + 0.08) * fps, (delay + 0.2) * fps, fps * 1.5],
              [0, 75, 40],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
            ) : 0;

            // Letter spacing expands slightly on BRRR for impact
            const emphasisSpacing = isEmphasis ? interpolate(
              frame,
              [delay * fps, (delay + 0.15) * fps],
              [-8, 4],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
            ) : -3.5;

            return (
              <span
                key={index}
                style={{
                  fontSize: isEmphasis ? 88 : 78,
                  fontWeight: 900,
                  color: isEmphasis ? "#00ff88" : "#ffffff",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  opacity: wordOpacity,
                  transform: `translateY(${isEmphasis ? emphasisY : wordY}px) scale(${emphasisScale})`,
                  display: "inline-block",
                  letterSpacing: emphasisSpacing,
                  lineHeight: 1.1,
                  textShadow: isEmphasis
                    ? `0 0 ${emphasisGlow}px rgba(0, 255, 136, 0.6), 0 8px 40px rgba(0, 0, 0, 0.5)`
                    : "0 5px 35px rgba(0, 0, 0, 0.5)",
                  position: "relative",
                }}
              >
                {word}
                {/* Dramatic underline accent for BRRR - draws fast */}
                {isEmphasis && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: -10,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: `${brrrUnderline}%`,
                      height: 4,
                      background: "linear-gradient(90deg, transparent 0%, #00ff88 20%, #00ffaa 50%, #00ff88 80%, transparent 100%)",
                      borderRadius: 2,
                      opacity: 0.85,
                      boxShadow: `0 0 ${20 * underlineGlow}px rgba(0, 255, 136, ${0.6 * underlineGlow})`,
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

// Stat card - Premium glass morphism with satisfying number counting and landing celebration
const StatCard: React.FC<{
  stat: StatsUpdateProps["stats"][0];
  delay: number;
  index: number;
}> = ({ stat, delay, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card entrance - deliberate, weighty spring with slight rotation for depth
  const cardProgress = spring({
    frame: frame - delay * fps,
    fps,
    config: { damping: 200, stiffness: 70, mass: 1.2 },
  });

  // Slight rotation that settles
  const cardRotate = interpolate(
    frame,
    [delay * fps, (delay + 0.5) * fps],
    [index % 2 === 0 ? -2 : 2, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Number counting with exponential deceleration for maximum satisfaction
  const countDuration = 1.6;
  const countStart = delay + 0.18;
  const numberProgress = interpolate(
    frame,
    [countStart * fps, (countStart + countDuration) * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      // Quintic ease-out for that "slowing to a stop" feel
      easing: (t) => 1 - Math.pow(1 - t, 5),
    }
  );

  // Shimmer effect - sweeps across the card after it settles
  const shimmerDelay = delay + 0.6;
  const shimmerProgress = interpolate(
    frame,
    [shimmerDelay * fps, (shimmerDelay + 0.8) * fps],
    [-100, 200],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) }
  );
  const shimmerOpacity = interpolate(
    frame,
    [shimmerDelay * fps, (shimmerDelay + 0.2) * fps, (shimmerDelay + 0.6) * fps, (shimmerDelay + 0.8) * fps],
    [0, 0.15, 0.15, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Parse value
  const numericValue =
    stat.numericValue ?? (parseFloat(stat.value.replace(/[^0-9.]/g, "")) || 0);
  const displayValue = Math.floor(numericValue * numberProgress);
  const prefix = stat.prefix ?? (stat.value.startsWith("$") ? "$" : "");
  const suffix = stat.suffix ?? (stat.value.includes("+") ? "+" : "");

  const cardOpacity = interpolate(cardProgress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });
  const cardY = interpolate(cardProgress, [0, 1], [40, 0]);
  const cardScale = interpolate(cardProgress, [0, 1], [0.94, 1]);

  // Color system - FED brand palette
  const accentColors = ["#00ff88", "#00d4ff", "#ff6b9d"];
  const accentColor = stat.color || accentColors[index % accentColors.length];

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : "0, 255, 136";
  };
  const accentRgb = hexToRgb(accentColor);

  // Top accent line draws elegantly
  const accentWidth = interpolate(
    frame,
    [(delay + 0.1) * fps, (delay + 0.5) * fps],
    [0, 100],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Left border glow builds with count
  const borderGlow = interpolate(
    frame,
    [(delay + 0.2) * fps, (delay + 1.0) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Determine if number has "landed" (finished counting)
  const hasLanded = numberProgress >= 0.98;
  const landTime = (countStart + countDuration) * fps;

  // Number "lands" with a satisfying scale pulse - THE celebration moment
  const landedPulse = hasLanded ? interpolate(
    frame,
    [landTime - fps * 0.05, landTime + fps * 0.08, landTime + fps * 0.2],
    [1, 1.06, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 1;

  // Card gets a subtle lift and glow burst when number lands
  const landGlowBurst = hasLanded ? interpolate(
    frame,
    [landTime, landTime + fps * 0.1, landTime + fps * 0.4],
    [0, 1, 0.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : 0;

  // Continuous ambient glow after landing
  const cardGlow = interpolate(
    frame,
    [(countStart + countDuration - 0.3) * fps, (countStart + countDuration + 0.5) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Number glow intensifies as it approaches final value, bursts when landing
  const numberGlow = hasLanded ? interpolate(
    frame,
    [landTime - fps * 0.2, landTime, landTime + fps * 0.1, landTime + fps * 0.35],
    [8, 12, 28, 16],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : interpolate(
    frame,
    [(countStart + 0.5) * fps, (countStart + countDuration) * fps],
    [0, 12],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Prefix color brightens on land
  const prefixBrightness = hasLanded ? interpolate(
    frame,
    [landTime, landTime + fps * 0.1, landTime + fps * 0.3],
    [1, 1.15, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : 1;

  // Label fades in after card settles
  const labelOpacity = interpolate(
    frame,
    [(delay + 0.25) * fps, (delay + 0.5) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Indicator dot pulses gently after landing
  const dotPulse = hasLanded && frame > landTime + fps * 0.3 ? interpolate(
    (frame - landTime - fps * 0.3) % (fps * 1.8),
    [0, fps * 0.4, fps * 1.8],
    [0.5, 1, 0.5]
  ) : cardGlow * 0.9;

  return (
    <div
      style={{
        transform: `translateY(${cardY}px) scale(${cardScale}) rotate(${cardRotate}deg)`,
        opacity: cardOpacity,
      }}
    >
      <div
        style={{
          padding: "28px 38px",
          background:
            "linear-gradient(165deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.008) 100%)",
          borderRadius: 16,
          minWidth: 280,
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          boxShadow: `
            0 30px 65px rgba(0, 0, 0, 0.5),
            0 0 ${45 * cardGlow + 35 * landGlowBurst}px rgba(${accentRgb}, ${0.08 * cardGlow + 0.15 * landGlowBurst}),
            inset 0 1px 0 rgba(255, 255, 255, 0.05)
          `,
        }}
      >
        {/* Shimmer overlay - sweeps across on entrance */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: `${shimmerProgress}%`,
            width: "50%",
            height: "100%",
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)",
            opacity: shimmerOpacity,
            pointerEvents: "none",
          }}
        />

        {/* Top accent line - full width draw */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${accentWidth}%`,
            height: 2,
            background: `linear-gradient(90deg, ${accentColor} 0%, ${accentColor}80 60%, transparent 100%)`,
            borderRadius: "2px 0 0 0",
            boxShadow: `0 0 ${12 * borderGlow}px ${accentColor}66`,
          }}
        />

        {/* Left accent bar - vertical */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 3,
            height: "100%",
            background: `linear-gradient(180deg, ${accentColor} 0%, ${accentColor}40 60%, transparent 100%)`,
            opacity: borderGlow * 0.7,
            boxShadow: `0 0 ${14 * borderGlow}px ${accentColor}55`,
          }}
        />

        {/* Hero number with glow - THE main attraction */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 900,
            color: "#ffffff",
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: -2.5,
            lineHeight: 1,
            marginBottom: 16,
            transform: `scale(${landedPulse})`,
            transformOrigin: "left center",
            filter: `drop-shadow(0 0 ${numberGlow}px rgba(${accentRgb}, 0.35))`,
          }}
        >
          <span
            style={{
              color: accentColor,
              textShadow: `0 0 ${14 * cardGlow}px ${accentColor}66`,
              filter: `brightness(${prefixBrightness})`,
            }}
          >
            {prefix}
          </span>
          {displayValue.toLocaleString()}
          <span
            style={{
              color: "#3a3a3a",
              fontSize: 28,
              fontWeight: 700,
              marginLeft: 3,
            }}
          >
            {suffix}
          </span>
        </div>

        {/* Label with animated indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 11,
            opacity: labelOpacity,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: accentColor,
              opacity: 0.4 + dotPulse * 0.5,
              boxShadow: `0 0 ${8 * dotPulse}px ${accentColor}`,
            }}
          />
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

// Scene 3: Stats - The showcase with compelling number reveals
const StatsScene: React.FC<{ stats: StatsUpdateProps["stats"] }> = ({ stats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene builds in smoothly
  const sceneFade = interpolate(frame, [0, fps * 0.1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Section header - smaller, less competing with cards
  const headerOpacity = interpolate(frame, [fps * 0.05, fps * 0.28], [0, 0.8], {
    extrapolateRight: "clamp",
  });
  const headerY = interpolate(
    frame,
    [fps * 0.05, fps * 0.32],
    [8, 0],
    {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Live indicator with elegant pulse - refined timing
  const pulseBase = interpolate(
    (frame - fps * 0.35) % (fps * 2.0),
    [0, fps * 0.5, fps * 2.0],
    [0.5, 1, 0.5],
    { extrapolateLeft: "clamp", easing: Easing.inOut(Easing.sin) }
  );
  const indicatorOpacity = frame > fps * 0.3 ? pulseBase : interpolate(
    frame,
    [fps * 0.1, fps * 0.3],
    [0, 0.5],
    { extrapolateRight: "clamp" }
  );

  // Subtle ring around the live indicator
  const ringPulse = frame > fps * 0.35 ? interpolate(
    (frame - fps * 0.35) % (fps * 2.0),
    [0, fps * 0.5, fps * 2.0],
    [1, 1.5, 1],
    { extrapolateLeft: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 1;
  const ringOpacity = frame > fps * 0.35 ? interpolate(
    (frame - fps * 0.35) % (fps * 2.0),
    [0, fps * 0.3, fps * 2.0],
    [0.5, 0, 0],
    { extrapolateLeft: "clamp" }
  ) : 0;

  // Accent lines - draw outward symmetrically (subtle)
  const lineWidth = interpolate(
    frame,
    [fps * 0.08, fps * 0.45],
    [0, 45],
    {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Background glow intensifies as numbers count up - creates energy
  const bgGlowIntensity = interpolate(
    frame,
    [fps * 0.5, fps * 2.8],
    [0.02, 0.045],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00ff88" intensity={bgGlowIntensity} focusY={45} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 50,
          flexDirection: "column",
          gap: 50,
        }}
      >
        {/* Header - minimal, doesn't compete with the cards */}
        <div
          style={{
            opacity: headerOpacity,
            transform: `translateY(${headerY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: lineWidth,
              height: 1,
              background: "linear-gradient(270deg, rgba(0, 255, 136, 0.18), transparent)",
            }}
          />

          {/* Live indicator with glow and pulsing ring */}
          <div style={{ position: "relative" }}>
            {/* Pulsing ring */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 5,
                height: 5,
                borderRadius: "50%",
                border: "1px solid #00ff88",
                transform: `translate(-50%, -50%) scale(${ringPulse})`,
                opacity: ringOpacity,
                pointerEvents: "none",
              }}
            />
            {/* Main dot */}
            <div
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#00ff88",
                opacity: indicatorOpacity,
                boxShadow: `0 0 ${8 + 6 * indicatorOpacity}px rgba(0, 255, 136, ${0.35 + 0.25 * indicatorOpacity})`,
              }}
            />
          </div>

          <span
            style={{
              fontSize: 9,
              color: "#484848",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 4.5,
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
              background: "linear-gradient(90deg, rgba(0, 255, 136, 0.18), transparent)",
            }}
          />
        </div>

        {/* Stats row - THE main attraction, deliberate stagger */}
        <div
          style={{
            display: "flex",
            gap: 28,
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 980,
          }}
        >
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              stat={stat}
              delay={0.18 + index * 0.22}
              index={index}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 4: CTA - Commanding, memorable close with confident presence
const CTAScene: React.FC<{ tagline: string; cta: string }> = ({ tagline, cta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene builds from darkness
  const sceneFade = interpolate(frame, [0, fps * 0.12], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Background glow intensifies throughout - builds energy
  const bgIntensity = interpolate(
    frame,
    [0, fps * 1.8],
    [0.022, 0.06],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Logo - powerful entrance with weight
  const logoProgress = spring({
    frame,
    fps,
    config: { damping: 180, stiffness: 60, mass: 1.15 },
  });
  const logoOpacity = interpolate(frame, [0, fps * 0.25], [0, 1], {
    extrapolateRight: "clamp",
  });
  const logoScale = interpolate(logoProgress, [0, 1], [0.85, 1]);
  const logoGlow = interpolate(
    frame,
    [fps * 0.18, fps * 0.85],
    [0, 55],
    {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Dual concentric rings - creates depth and premium feel
  const ring1Opacity = interpolate(
    frame,
    [fps * 0.1, fps * 0.28, fps * 1.0, fps * 1.4],
    [0, 0.22, 0.12, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ring1Scale = interpolate(
    frame,
    [fps * 0.1, fps * 1.4],
    [0.7, 2.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  const ring2Opacity = interpolate(
    frame,
    [fps * 0.2, fps * 0.38, fps * 1.2, fps * 1.6],
    [0, 0.15, 0.08, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ring2Scale = interpolate(
    frame,
    [fps * 0.2, fps * 1.6],
    [0.55, 2.6],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Tagline - confident timing
  const taglineOpacity = interpolate(
    frame,
    [fps * 0.38, fps * 0.65],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const taglineY = interpolate(
    frame,
    [fps * 0.38, fps * 0.68],
    [10, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // CTA button - THE action moment, slightly delayed for impact
  const ctaDelay = fps * 0.65;
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
  const ctaScale = interpolate(ctaProgress, [0, 1], [0.94, 1]);

  // CTA glow builds dramatically then settles
  const ctaGlow = interpolate(
    frame,
    [ctaDelay + fps * 0.15, fps * 1.4, fps * 2.0],
    [0, 1.2, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Subtle pulsing glow on CTA after it settles - refined breathing effect
  const ctaPulse = frame > fps * 1.5 ? interpolate(
    (frame - fps * 1.5) % (fps * 3.0),
    [0, fps * 1.5, fps * 3.0],
    [0.95, 1, 0.95],
    { easing: Easing.inOut(Easing.sin) }
  ) : 1;

  // Inner glow pulse - creates depth
  const innerPulse = frame > fps * 1.5 ? interpolate(
    (frame - fps * 1.5) % (fps * 2.5),
    [0, fps * 1.25, fps * 2.5],
    [0.2, 0.35, 0.2],
    { easing: Easing.inOut(Easing.sin) }
  ) : 0.2;

  // Bottom text - final beat with gravitas
  const bottomOpacity = interpolate(
    frame,
    [fps * 1.15, fps * 1.5],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const bottomY = interpolate(
    frame,
    [fps * 1.15, fps * 1.55],
    [8, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Decorative lines frame the bottom text
  const lineWidth = interpolate(
    frame,
    [fps * 1.35, fps * 1.85],
    [0, 55],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00ff88" intensity={bgIntensity} focusY={50} />

      {/* Ambient glow behind CTA - intensifies with button */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 52% 42% at 50% 54%, rgba(0, 255, 136, ${0.04 * ctaGlow}) 0%, transparent 55%)`,
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
        {/* Logo with concentric rings */}
        <div style={{ position: "relative" }}>
          {/* Outer ring */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 125,
              height: 125,
              borderRadius: "50%",
              border: "1px solid rgba(0, 255, 136, 0.2)",
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
              width: 110,
              height: 110,
              borderRadius: "50%",
              border: "1px solid rgba(0, 255, 136, 0.28)",
              transform: `translate(-50%, -50%) scale(${ring1Scale})`,
              opacity: ring1Opacity,
            }}
          />
          <div
            style={{
              transform: `scale(${logoScale})`,
              opacity: logoOpacity,
              filter: `drop-shadow(0 0 ${logoGlow}px rgba(0, 255, 136, 0.5))`,
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
              color: "#505050",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 400,
              letterSpacing: 0.5,
            }}
          >
            {tagline}
          </span>
        </div>

        {/* CTA Button - THE destination, commanding presence */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px) scale(${ctaScale})`,
          }}
        >
          <div
            style={{
              padding: "18px 58px",
              background: "linear-gradient(145deg, #00ff88 0%, #00ffdd 45%, #00ff88 100%)",
              borderRadius: 50,
              position: "relative",
              overflow: "hidden",
              boxShadow: `
                0 8px 32px rgba(0, 255, 136, ${(0.28 + 0.18 * ctaGlow) * ctaPulse}),
                0 0 ${45 * ctaGlow * ctaPulse}px rgba(0, 255, 136, ${0.15 * ctaGlow * ctaPulse}),
                inset 0 2px 0 rgba(255, 255, 255, ${innerPulse}),
                inset 0 -2px 0 rgba(0, 0, 0, 0.08)
              `,
            }}
          >
            {/* Inner shine animation */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "50%",
                background: `linear-gradient(180deg, rgba(255,255,255,${innerPulse * 0.8}) 0%, transparent 100%)`,
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
                textShadow: "0 1px 0 rgba(255, 255, 255, 0.2)",
                position: "relative",
              }}
            >
              {cta}
            </span>
          </div>
        </div>

        {/* Bottom proposition - final authority */}
        <div
          style={{
            opacity: bottomOpacity,
            transform: `translateY(${bottomY}px)`,
            marginTop: 12,
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
            }}
          />
          <span
            style={{
              fontSize: 11,
              color: "#3a3a3a",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 4.5,
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
              background: "linear-gradient(90deg, rgba(0, 255, 136, 0.25), transparent)",
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Main composition - 10 second video with cinematic pacing
export const StatsUpdate: React.FC<StatsUpdateProps> = ({
  headline,
  stats,
  tagline,
  cta,
}) => {
  const { fps } = useVideoConfig();

  // Clean, professional fades (0.22s - smooth but purposeful)
  const transitionFrames = Math.round(0.22 * fps);

  return (
    <TransitionSeries>
      {/* Intro: 2.0s - Logo hook with dramatic light burst, let it breathe */}
      <TransitionSeries.Sequence durationInFrames={Math.round(2.0 * fps)}>
        <IntroScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* Headline: 1.8s - BRRR lands explosively, needs to breathe */}
      <TransitionSeries.Sequence durationInFrames={Math.round(1.8 * fps)}>
        <HeadlineScene headline={headline} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* Stats: 3.8s - The meat with satisfying counting and landing celebrations */}
      <TransitionSeries.Sequence durationInFrames={Math.round(3.8 * fps)}>
        <StatsScene stats={stats} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* CTA: 2.4s - Strong, confident close with commanding presence */}
      <TransitionSeries.Sequence durationInFrames={Math.round(2.4 * fps)}>
        <CTAScene tagline={tagline} cta={cta} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
