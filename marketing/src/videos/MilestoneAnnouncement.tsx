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

export type MilestoneAnnouncementProps = {
  milestone: string;
  target: string;
  current: string;
  progress: number;
  celebration?: boolean;
  nextMilestone?: string;
};

// Premium film grain overlay - adds texture and warmth like high-end cinema
const FilmGrain: React.FC<{ opacity?: number }> = ({ opacity = 0.025 }) => {
  const frame = useCurrentFrame();
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

// Premium cinematic background - depth without distraction
const CinematicBackground: React.FC<{
  accentColor?: string;
  intensity?: number;
  focusY?: number;
  showGrain?: boolean;
}> = ({ accentColor = "#00ff88", intensity = 0.03, focusY = 50, showGrain = true }) => {
  const frame = useCurrentFrame();

  // Extremely slow drift - creates subtle life
  const drift = interpolate(frame, [0, 900], [0, 2], {
    extrapolateRight: "clamp",
  });

  // Convert hex to rgba for gradient
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
      <AbsoluteFill style={{ background: "#030303" }} />

      {/* Subtle noise texture base for depth */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, #060606 0%, #020202 100%)`,
        }}
      />

      {/* Primary glow - centered, focused */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 50% at 50% ${focusY + drift}%, ${hexToRgba(accentColor, intensity)} 0%, transparent 60%)`,
        }}
      />

      {/* Secondary ambient - subtle top wash */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 100% 20% at 50% 0%, ${hexToRgba(accentColor, intensity * 0.15)} 0%, transparent 45%)`,
        }}
      />

      {/* Cinematic vignette - frames everything elegantly */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 82% 72% at 50% 50%, transparent 30%, rgba(0,0,0,0.65) 100%)",
        }}
      />

      {/* Film grain for texture */}
      {showGrain && <FilmGrain opacity={0.02} />}
    </AbsoluteFill>
  );
};

// Scene 1: The Big Reveal - Apple-keynote style dramatic reveal with cinematic energy
const RevealScene: React.FC<{ milestone: string; progress: number }> = ({ milestone, progress }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 0: Total darkness with subtle flicker before reveal - builds anticipation
  const flicker = frame < fps * 0.1 ? 0 :
    frame < fps * 0.12 ? 0.1 :
    frame < fps * 0.14 ? 0.03 :
    frame < fps * 0.16 ? 0.15 :
    frame < fps * 0.18 ? 0.05 : 1;

  const darknessFade = interpolate(
    frame,
    [fps * 0.18, fps * 0.45],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) * (frame < fps * 0.18 ? flicker : 1);

  // Initial light burst - a single bright point that expands with more drama
  const burstOpacity = interpolate(
    frame,
    [fps * 0.1, fps * 0.18, fps * 0.55, fps * 0.85],
    [0, 0.75, 0.25, 0],
    { extrapolateRight: "clamp" }
  );
  const burstScale = interpolate(
    frame,
    [fps * 0.1, fps * 0.8],
    [0.03, 3.5],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Secondary outer burst ring for depth
  const ring2BurstOpacity = interpolate(
    frame,
    [fps * 0.14, fps * 0.24, fps * 0.6, fps * 0.9],
    [0, 0.4, 0.15, 0],
    { extrapolateRight: "clamp" }
  );
  const ring2BurstScale = interpolate(
    frame,
    [fps * 0.14, fps * 0.9],
    [0.02, 4.2],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Horizontal reveal line - cinematic wipe effect
  const revealLineWidth = interpolate(
    frame,
    [fps * 0.08, fps * 0.5],
    [0, 620],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const revealLineOpacity = interpolate(
    frame,
    [fps * 0.08, fps * 0.16, fps * 0.7, fps * 1.0],
    [0, 0.5, 0.22, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Pre-title - "APPROACHING" sets the tension
  const preDelay = 0.48;
  const preOpacity = interpolate(
    frame,
    [preDelay * fps, (preDelay + 0.25) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const preY = interpolate(
    frame,
    [preDelay * fps, (preDelay + 0.35) * fps],
    [14, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Pulsing indicator dot - adds life with ring expansion
  const dotPulse = frame > fps * 0.68 ? interpolate(
    (frame - fps * 0.68) % (fps * 1.5),
    [0, fps * 0.35, fps * 1.5],
    [0.5, 1, 0.5],
    { extrapolateLeft: "clamp" }
  ) : interpolate(frame, [preDelay * fps, fps * 0.68], [0, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Ring pulse around dot
  const dotRingScale = frame > fps * 0.68 ? interpolate(
    (frame - fps * 0.68) % (fps * 1.5),
    [0, fps * 0.35, fps * 1.5],
    [1, 2.0, 1],
    { extrapolateLeft: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 1;
  const dotRingOpacity = frame > fps * 0.68 ? interpolate(
    (frame - fps * 0.68) % (fps * 1.5),
    [0, fps * 0.3, fps * 1.5],
    [0.55, 0, 0],
    { extrapolateLeft: "clamp" }
  ) : 0;

  // Main milestone "QE2" - THE hero moment with commanding weight
  const heroDelay = 0.85;
  const heroProgress = spring({
    frame: frame - heroDelay * fps,
    fps,
    config: { damping: 180, stiffness: 45, mass: 1.6 },
  });
  const heroOpacity = interpolate(
    frame,
    [heroDelay * fps, (heroDelay + 0.3) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const heroY = interpolate(heroProgress, [0, 1], [55, 0]);
  const heroScale = interpolate(heroProgress, [0, 1], [0.88, 1]);

  // Q and E animate separately from 2 for visual interest
  const qeDelay = heroDelay;
  const numDelay = heroDelay + 0.12;
  const numProgress = spring({
    frame: frame - numDelay * fps,
    fps,
    config: { damping: 160, stiffness: 100, mass: 1.2 },
  });
  const numOpacity = interpolate(
    frame,
    [numDelay * fps, (numDelay + 0.25) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const numScale = interpolate(numProgress, [0, 1], [0.8, 1]);

  // Glow builds majestically after text lands - more dramatic intensity
  const glowIntensity = interpolate(
    frame,
    [fps * 1.3, fps * 2.2, fps * 3.2],
    [0, 95, 75],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Dual concentric rings expanding from milestone - creates depth
  const ring1Delay = 0.95;
  const ring1Opacity = interpolate(
    frame,
    [ring1Delay * fps, (ring1Delay + 0.18) * fps, fps * 2.0, fps * 2.5],
    [0, 0.22, 0.12, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ring1Scale = interpolate(
    frame,
    [ring1Delay * fps, fps * 2.5],
    [0.55, 2.6],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  const ring2Delay = 1.15;
  const ring2Opacity = interpolate(
    frame,
    [ring2Delay * fps, (ring2Delay + 0.18) * fps, fps * 2.3, fps * 2.8],
    [0, 0.16, 0.08, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ring2Scale = interpolate(
    frame,
    [ring2Delay * fps, fps * 2.8],
    [0.45, 3.2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Background glow intensifies with reveal - energy builds
  const bgIntensity = interpolate(
    frame,
    [fps * 0.45, fps * 2.2],
    [0.015, 0.07],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Percentage badge - appears dramatically after milestone with celebration energy
  const percentDelay = 1.6;
  const percentProgress = spring({
    frame: frame - percentDelay * fps,
    fps,
    config: { damping: 140, stiffness: 150, mass: 0.9 },
  });
  const percentOpacity = interpolate(
    frame,
    [percentDelay * fps, (percentDelay + 0.18) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const percentScale = interpolate(percentProgress, [0, 1], [0.7, 1]);

  // Progress number counts up with satisfying quintic ease-out
  const displayProgress = interpolate(
    frame,
    [(percentDelay + 0.1) * fps, (percentDelay + 0.75) * fps],
    [0, progress],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 5) }
  );

  // Badge "lands" with a satisfying scale pulse when number finishes
  const badgeLandTime = (percentDelay + 0.75) * fps;
  const hasLanded = displayProgress >= progress - 1;
  const badgeLandPulse = hasLanded ? interpolate(
    frame,
    [badgeLandTime - fps * 0.04, badgeLandTime + fps * 0.1, badgeLandTime + fps * 0.28],
    [1, 1.15, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 1;

  // Badge glow bursts on landing then settles
  const percentGlow = hasLanded ? interpolate(
    frame,
    [badgeLandTime - fps * 0.15, badgeLandTime, badgeLandTime + fps * 0.12, badgeLandTime + fps * 0.45],
    [0.3, 0.6, 1.4, 0.9],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : interpolate(
    frame,
    [(percentDelay + 0.25) * fps, (percentDelay + 0.7) * fps],
    [0, 0.6],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Underline accent draws elegantly
  const underlineWidth = interpolate(
    frame,
    [fps * 2.1, fps * 2.65],
    [0, 280],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const underlineOpacity = interpolate(
    frame,
    [fps * 2.1, fps * 2.4],
    [0, 0.6],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const underlineGlow = interpolate(
    frame,
    [fps * 2.3, fps * 2.8],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Tagline - final beat of anticipation
  const taglineOpacity = interpolate(
    frame,
    [fps * 2.55, fps * 2.9],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const taglineY = interpolate(
    frame,
    [fps * 2.55, fps * 3.0],
    [14, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Decorative side lines - frame the tagline
  const sideLineWidth = interpolate(
    frame,
    [fps * 2.7, fps * 3.1],
    [0, 65],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00ff88" intensity={bgIntensity} focusY={48} />

      {/* Opening pulse and light burst - draws attention from black */}
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
            background: "linear-gradient(90deg, transparent 0%, rgba(0,255,136,0.5) 20%, rgba(255,255,255,0.85) 50%, rgba(0,255,136,0.5) 80%, transparent 100%)",
            position: "absolute",
            opacity: revealLineOpacity,
            boxShadow: "0 0 22px rgba(0, 255, 136, 0.35)",
          }}
        />
        {/* Secondary outer burst ring */}
        <div
          style={{
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,255,136,0.4) 0%, rgba(0,212,255,0.15) 40%, transparent 60%)",
            opacity: ring2BurstOpacity,
            transform: `scale(${ring2BurstScale})`,
            position: "absolute",
          }}
        />
        {/* Primary light burst */}
        <div
          style={{
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.92) 0%, rgba(0,255,136,0.6) 25%, rgba(0,255,170,0.2) 50%, transparent 70%)",
            opacity: burstOpacity,
            transform: `scale(${burstScale})`,
            position: "absolute",
          }}
        />
      </AbsoluteFill>

      {/* Concentric rings expanding from center - depth and sophistication */}
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
            width: 220,
            height: 220,
            borderRadius: "50%",
            border: "1px solid rgba(0, 255, 136, 0.22)",
            transform: `scale(${ring2Scale})`,
            opacity: ring2Opacity,
          }}
        />
        {/* Inner ring */}
        <div
          style={{
            position: "absolute",
            width: 195,
            height: 195,
            borderRadius: "50%",
            border: "1px solid rgba(0, 255, 136, 0.28)",
            transform: `scale(${ring1Scale})`,
            opacity: ring1Opacity,
          }}
        />
      </AbsoluteFill>

      {/* Main content container */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          opacity: darknessFade,
        }}
      >
        {/* Pre-title - builds tension */}
        <div
          style={{
            opacity: preOpacity,
            transform: `translateY(${preY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 36,
          }}
        >
          {/* Pulsing indicator with ring */}
          <div style={{ position: "relative" }}>
            {/* Ring pulse */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 8,
                height: 8,
                borderRadius: "50%",
                border: "1px solid #00ff88",
                transform: `translate(-50%, -50%) scale(${dotRingScale})`,
                opacity: dotRingOpacity,
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#00ff88",
                boxShadow: `0 0 ${14 + 10 * dotPulse}px rgba(0, 255, 136, ${0.55 + 0.4 * dotPulse})`,
                opacity: dotPulse,
              }}
            />
          </div>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#505050",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 6,
              textTransform: "uppercase",
            }}
          >
            Approaching Milestone
          </span>
        </div>

        {/* Hero milestone text - clean, commanding presence with split animation */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "baseline",
          }}
        >
          {/* QE part */}
          <div
            style={{
              opacity: heroOpacity,
              transform: `translateY(${heroY}px) scale(${heroScale})`,
              filter: `drop-shadow(0 0 ${glowIntensity}px rgba(0, 255, 136, 0.55))`,
            }}
          >
            <span
              style={{
                fontSize: 230,
                fontWeight: 900,
                color: "#ffffff",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -10,
                lineHeight: 0.88,
                textShadow: "0 14px 70px rgba(0, 0, 0, 0.55)",
              }}
            >
              QE
            </span>
          </div>
          {/* 2 part - slightly delayed for visual interest */}
          <div
            style={{
              opacity: numOpacity,
              transform: `scale(${numScale})`,
              filter: `drop-shadow(0 0 ${glowIntensity * 0.8}px rgba(0, 255, 136, 0.45))`,
              marginLeft: -8,
            }}
          >
            <span
              style={{
                fontSize: 230,
                fontWeight: 900,
                color: "#00ff88",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -10,
                lineHeight: 0.88,
                textShadow: `0 14px 70px rgba(0, 0, 0, 0.55), 0 0 ${glowIntensity * 0.4}px rgba(0, 255, 136, 0.4)`,
              }}
            >
              2
            </span>
          </div>

          {/* Percentage badge - positioned dramatically with landing animation */}
          <div
            style={{
              position: "absolute",
              top: -18,
              right: -75,
              opacity: percentOpacity,
              transform: `scale(${percentScale * badgeLandPulse})`,
            }}
          >
            <div
              style={{
                padding: "14px 22px",
                background: "linear-gradient(145deg, #00ff88 0%, #00ffbb 100%)",
                borderRadius: 40,
                boxShadow: `
                  0 8px 30px rgba(0, 255, 136, ${0.4 + 0.3 * percentGlow}),
                  0 0 ${40 * percentGlow}px rgba(0, 255, 136, ${0.25 * percentGlow}),
                  inset 0 2px 0 rgba(255, 255, 255, 0.22)
                `,
              }}
            >
              <span
                style={{
                  fontSize: 32,
                  fontWeight: 900,
                  color: "#020202",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  letterSpacing: -1,
                  textShadow: "0 1px 0 rgba(255, 255, 255, 0.18)",
                }}
              >
                {Math.round(displayProgress)}%
              </span>
            </div>
          </div>
        </div>

        {/* Underline accent */}
        <div
          style={{
            width: underlineWidth,
            height: 2,
            background: "linear-gradient(90deg, transparent 5%, rgba(0, 255, 136, 0.6) 50%, transparent 95%)",
            marginTop: 40,
            opacity: underlineOpacity,
            borderRadius: 1,
            boxShadow: `0 0 ${16 * underlineGlow}px rgba(0, 255, 136, ${0.22 * underlineGlow})`,
          }}
        />

        {/* Tagline with decorative lines */}
        <div
          style={{
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
            marginTop: 26,
            display: "flex",
            alignItems: "center",
            gap: 18,
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
              fontSize: 20,
              fontWeight: 600,
              color: "#00ff88",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 3,
              opacity: 0.95,
            }}
          >
            $50,000 distribution target
          </span>
          <div
            style={{
              width: sideLineWidth,
              height: 1,
              background: "linear-gradient(90deg, rgba(0, 255, 136, 0.3), transparent)",
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Floating particle for progress bar energy effect
const ProgressParticle: React.FC<{
  index: number;
  barProgress: number;
  barWidth: number;
}> = ({ index, barProgress, barWidth }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Each particle has unique timing based on its index
  const seed = index * 137.5;
  const cycleTime = fps * (1.2 + random(`cycle-${seed}`) * 0.6);
  const startOffset = random(`offset-${seed}`) * cycleTime;
  const cycleFrame = ((frame + startOffset) % cycleTime);

  // Particle rises from the bar
  const particleY = interpolate(
    cycleFrame,
    [0, cycleTime],
    [0, -45 - random(`height-${seed}`) * 30],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Particle drifts slightly sideways
  const particleX = interpolate(
    cycleFrame,
    [0, cycleTime],
    [0, (random(`drift-${seed}`) - 0.5) * 20],
    { extrapolateRight: "clamp" }
  );

  // Fade in then out
  const particleOpacity = interpolate(
    cycleFrame,
    [0, cycleTime * 0.15, cycleTime * 0.5, cycleTime],
    [0, 0.7, 0.5, 0],
    { extrapolateRight: "clamp" }
  );

  // Scale animation
  const particleScale = interpolate(
    cycleFrame,
    [0, cycleTime * 0.2, cycleTime],
    [0.4, 1, 0.3],
    { extrapolateRight: "clamp" }
  );

  // Position along the bar's leading edge area
  const baseX = (barProgress / 100) * barWidth - 15 + (random(`pos-${seed}`) - 0.5) * 25;

  // Only show particles when bar is advancing
  if (barProgress < 10 || frame < fps * 0.9) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: baseX,
        top: "50%",
        transform: `translate(${particleX}px, calc(-50% + ${particleY}px)) scale(${particleScale})`,
        width: 4 + random(`size-${seed}`) * 3,
        height: 4 + random(`size-${seed}`) * 3,
        borderRadius: "50%",
        background: random(`color-${seed}`) > 0.7
          ? "rgba(0, 212, 255, 0.8)"
          : "rgba(0, 255, 136, 0.9)",
        boxShadow: `0 0 8px rgba(0, 255, 136, 0.5)`,
        opacity: particleOpacity,
        pointerEvents: "none",
      }}
    />
  );
};

// Scene 2: Progress Dashboard - premium data visualization with particles and satisfying animations
const ProgressScene: React.FC<{
  target: string;
  current: string;
  progress: number;
}> = ({ target, current, progress }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene entrance with subtle scale
  const sceneOpacity = interpolate(
    frame,
    [0, fps * 0.1],
    [0, 1],
    { extrapolateRight: "clamp" }
  );
  const sceneScale = interpolate(
    frame,
    [0, fps * 0.16],
    [0.988, 1],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Header with decorative lines - pulsing indicator
  const headerOpacity = interpolate(
    frame,
    [fps * 0.04, fps * 0.25],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const headerY = interpolate(
    frame,
    [fps * 0.04, fps * 0.32],
    [12, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const lineWidth = interpolate(
    frame,
    [fps * 0.05, fps * 0.42],
    [0, 60],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Live indicator pulse - refined timing
  const livePulse = frame > fps * 0.32 ? interpolate(
    (frame - fps * 0.32) % (fps * 1.8),
    [0, fps * 0.4, fps * 1.8],
    [0.5, 1, 0.5],
    { easing: Easing.inOut(Easing.sin) }
  ) : interpolate(frame, [fps * 0.08, fps * 0.32], [0, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Hero percentage - dramatic entrance with weight
  const percentDelay = 0.16;
  const percentProgress = spring({
    frame: frame - percentDelay * fps,
    fps,
    config: { damping: 180, stiffness: 60, mass: 1.25 },
  });
  const percentOpacity = interpolate(
    frame,
    [percentDelay * fps, (percentDelay + 0.2) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Percentage counts up with luxurious quintic ease-out
  const displayPercent = interpolate(
    frame,
    [fps * 0.38, fps * 2.5],
    [0, progress],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: (t) => 1 - Math.pow(1 - t, 5),
    }
  );

  // Has the percentage finished counting?
  const hasFinishedCounting = displayPercent >= progress - 0.5;
  const countEndTime = fps * 2.5;

  // Percentage glow builds as number climbs, then BURSTS when landing
  const percentGlow = hasFinishedCounting ? interpolate(
    frame,
    [countEndTime - fps * 0.25, countEndTime, countEndTime + fps * 0.15, countEndTime + fps * 0.55],
    [30, 40, 70, 45],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : interpolate(
    frame,
    [fps * 1.0, fps * 2.4],
    [0, 40],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Percentage scale pulse on landing - more celebratory
  const percentLandPulse = hasFinishedCounting ? interpolate(
    frame,
    [countEndTime - fps * 0.04, countEndTime + fps * 0.12, countEndTime + fps * 0.32],
    [1, 1.06, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 1;

  // Percentage symbol animates slightly separately for visual interest
  const percentSymbolGlow = hasFinishedCounting ? interpolate(
    frame,
    [countEndTime, countEndTime + fps * 0.18, countEndTime + fps * 0.5],
    [0.5, 1.2, 0.8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : interpolate(
    frame,
    [fps * 1.5, fps * 2.4],
    [0.3, 0.6],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Progress bar - smooth fill with energy
  const barProgress = interpolate(
    frame,
    [fps * 0.5, fps * 2.7],
    [0, progress],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: (t) => 1 - Math.pow(1 - t, 4),
    }
  );

  // Bar glow intensity builds with fill - more dramatic
  const barGlow = interpolate(
    frame,
    [fps * 0.7, fps * 2.4],
    [0, 1.2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Leading edge particle effect - adds energy
  const edgePulse = frame > fps * 0.7 ? interpolate(
    (frame - fps * 0.7) % (fps * 0.5),
    [0, fps * 0.12, fps * 0.5],
    [0.7, 1, 0.7]
  ) : 0.7;

  // Multiple expanding ring effects for more energy
  const ringCycle1 = (frame - fps * 0.7) % (fps * 0.7);
  const ringCycle2 = (frame - fps * 0.7 + fps * 0.35) % (fps * 0.7);

  const ringOpacity1 = barProgress > 10 ? interpolate(
    ringCycle1,
    [0, fps * 0.1, fps * 0.5],
    [0.6, 0.22, 0],
    { extrapolateRight: "clamp" }
  ) : 0;
  const ringScale1 = interpolate(
    ringCycle1,
    [0, fps * 0.5],
    [1, 3.0],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  const ringOpacity2 = barProgress > 15 ? interpolate(
    ringCycle2,
    [0, fps * 0.1, fps * 0.5],
    [0.4, 0.14, 0],
    { extrapolateRight: "clamp" }
  ) : 0;
  const ringScale2 = interpolate(
    ringCycle2,
    [0, fps * 0.5],
    [1, 2.4],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Current amount counter
  const currentValue = parseFloat(current.replace(/[$,]/g, "")) || 0;
  const displayCurrent = interpolate(
    frame,
    [fps * 0.5, fps * 2.5],
    [0, currentValue],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: (t) => 1 - Math.pow(1 - t, 5),
    }
  );

  // Stats row with stagger - slide up with bounce
  const stat1Progress = spring({
    frame: frame - fps * 0.65,
    fps,
    config: { damping: 200, stiffness: 95 },
  });
  const stat1Opacity = interpolate(
    frame,
    [fps * 0.65, fps * 0.9],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const stat1Y = interpolate(stat1Progress, [0, 1], [20, 0]);

  const stat2Progress = spring({
    frame: frame - fps * 0.8,
    fps,
    config: { damping: 200, stiffness: 95 },
  });
  const stat2Opacity = interpolate(
    frame,
    [fps * 0.8, fps * 1.05],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const stat2Y = interpolate(stat2Progress, [0, 1], [20, 0]);

  // Current value glow intensifies and BURSTS on landing
  const currentHasLanded = displayCurrent >= currentValue - 100;
  const currentGlow = currentHasLanded ? interpolate(
    frame,
    [fps * 2.45, fps * 2.55, fps * 2.75, fps * 3.1],
    [18, 30, 45, 25],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : interpolate(
    frame,
    [fps * 1.5, fps * 2.4],
    [0, 18],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Current value scale pulse on landing - more satisfying
  const currentLandPulse = currentHasLanded ? interpolate(
    frame,
    [fps * 2.48, fps * 2.65, fps * 2.88],
    [1, 1.045, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 1;

  // Background glow intensifies as numbers climb
  const bgIntensity = interpolate(
    frame,
    [fps * 0.35, fps * 2.2],
    [0.02, 0.065],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Progress bar shimmer effect - more dramatic sweep
  const shimmerDelay = 1.1;
  const shimmerProgress = interpolate(
    frame,
    [shimmerDelay * fps, (shimmerDelay + 1.4) * fps],
    [-25, 125],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) }
  );
  const shimmerOpacity = interpolate(
    frame,
    [shimmerDelay * fps, (shimmerDelay + 0.25) * fps, (shimmerDelay + 1.1) * fps, (shimmerDelay + 1.4) * fps],
    [0, 0.25, 0.25, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const barWidthPx = 840; // Approximate width for particle positioning

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity }}>
      <CinematicBackground accentColor="#00ff88" intensity={bgIntensity} focusY={40} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 60,
          transform: `scale(${sceneScale})`,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 920,
          }}
        >
          {/* Header with live indicator */}
          <div
            style={{
              opacity: headerOpacity,
              transform: `translateY(${headerY}px)`,
              marginBottom: 28,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div style={{ width: lineWidth, height: 1, background: "linear-gradient(270deg, rgba(0,255,136,0.28), transparent)" }} />
            <div style={{ position: "relative" }}>
              {/* Pulsing ring */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  border: "1px solid #00ff88",
                  transform: `translate(-50%, -50%) scale(${1 + livePulse * 0.7})`,
                  opacity: 0.55 - livePulse * 0.45,
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#00ff88",
                  boxShadow: `0 0 ${10 + 8 * livePulse}px rgba(0, 255, 136, ${0.4 + 0.35 * livePulse})`,
                  opacity: livePulse,
                }}
              />
            </div>
            <span
              style={{
                fontSize: 11,
                color: "#505050",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: 5.5,
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              QE2 Progress
            </span>
            <div style={{ width: lineWidth, height: 1, background: "linear-gradient(90deg, rgba(0,255,136,0.28), transparent)" }} />
          </div>

          {/* Hero percentage with landing celebration */}
          <div
            style={{
              transform: `scale(${percentProgress * percentLandPulse})`,
              opacity: percentOpacity,
              marginBottom: 48,
              filter: `drop-shadow(0 0 ${percentGlow}px rgba(0, 255, 136, 0.38))`,
              display: "flex",
              alignItems: "baseline",
            }}
          >
            <span
              style={{
                fontSize: 180,
                fontWeight: 900,
                color: "#ffffff",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -10,
                lineHeight: 1,
                textShadow: "0 10px 55px rgba(0, 0, 0, 0.45)",
              }}
            >
              {Math.round(displayPercent)}
            </span>
            <span
              style={{
                fontSize: 90,
                fontWeight: 900,
                color: "#00ff88",
                fontFamily: "system-ui, -apple-system, sans-serif",
                textShadow: `0 0 ${percentGlow * percentSymbolGlow}px rgba(0, 255, 136, 0.5)`,
                marginLeft: 4,
              }}
            >
              %
            </span>
          </div>

          {/* Progress bar - the centerpiece with particles */}
          <div
            style={{
              width: "100%",
              marginBottom: 52,
              position: "relative",
            }}
          >
            {/* Track */}
            <div
              style={{
                width: "100%",
                height: 16,
                background: "linear-gradient(180deg, rgba(255, 255, 255, 0.018) 0%, rgba(255, 255, 255, 0.04) 100%)",
                borderRadius: 8,
                overflow: "visible",
                position: "relative",
                border: "1px solid rgba(255, 255, 255, 0.035)",
                boxShadow: "inset 0 2px 10px rgba(0, 0, 0, 0.35)",
              }}
            >
              {/* Fill - rich gradient with inner glow */}
              <div
                style={{
                  width: `${barProgress}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, rgba(0,255,136,0.3) 0%, rgba(0,255,136,0.6) 30%, #00ff88 75%, #00ffaa 100%)",
                  borderRadius: 8,
                  boxShadow: `
                    0 0 ${32 * barGlow}px rgba(0, 255, 136, 0.55),
                    0 0 ${16 * barGlow}px rgba(0, 255, 136, 0.35),
                    inset 0 2px 0 rgba(255, 255, 255, 0.2),
                    inset 0 -1px 0 rgba(0, 0, 0, 0.12)
                  `,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Shimmer overlay */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: `${shimmerProgress}%`,
                    width: "35%",
                    height: "100%",
                    background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)",
                    opacity: shimmerOpacity,
                    pointerEvents: "none",
                  }}
                />

                {/* Leading edge glow with multiple rings */}
                {barProgress > 5 && (
                  <>
                    {/* Outer expanding ring */}
                    <div
                      style={{
                        position: "absolute",
                        right: -5,
                        top: "50%",
                        transform: `translateY(-50%) scale(${ringScale2})`,
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        border: "1px solid rgba(0, 255, 136, 0.4)",
                        opacity: ringOpacity2,
                        pointerEvents: "none",
                      }}
                    />
                    {/* Inner expanding ring */}
                    <div
                      style={{
                        position: "absolute",
                        right: -5,
                        top: "50%",
                        transform: `translateY(-50%) scale(${ringScale1})`,
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        border: "1px solid rgba(0, 255, 136, 0.5)",
                        opacity: ringOpacity1,
                        pointerEvents: "none",
                      }}
                    />
                    {/* Main glow point */}
                    <div
                      style={{
                        position: "absolute",
                        right: -5,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: `radial-gradient(circle, rgba(0,255,230,${0.95 * edgePulse}) 0%, rgba(0,255,136,0.6) 40%, transparent 70%)`,
                        boxShadow: `0 0 ${20 + 14 * barGlow}px rgba(0, 255, 136, ${0.8 * edgePulse})`,
                      }}
                    />
                  </>
                )}
              </div>

              {/* Floating particles - energy effect */}
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <ProgressParticle
                  key={i}
                  index={i}
                  barProgress={barProgress}
                  barWidth={barWidthPx}
                />
              ))}

              {/* Target marker at 100% */}
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: -12,
                  bottom: -12,
                  width: 2,
                  background: "linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
                  borderRadius: 1,
                }}
              />
            </div>
          </div>

          {/* Stats row with landing animations */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              padding: "0 20px",
            }}
          >
            <div
              style={{
                opacity: stat1Opacity,
                transform: `translateY(${stat1Y}px)`,
                textAlign: "left",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "#3a3a3a",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  letterSpacing: 5,
                  textTransform: "uppercase",
                  marginBottom: 12,
                  fontWeight: 600,
                }}
              >
                Distributed
              </div>
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 900,
                  color: "#00ff88",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  letterSpacing: -2.5,
                  filter: `drop-shadow(0 0 ${currentGlow}px rgba(0, 255, 136, 0.5))`,
                  transform: `scale(${currentLandPulse})`,
                  transformOrigin: "left center",
                }}
              >
                ${Math.floor(displayCurrent).toLocaleString()}
              </div>
            </div>

            <div
              style={{
                opacity: stat2Opacity,
                transform: `translateY(${stat2Y}px)`,
                textAlign: "right",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "#3a3a3a",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  letterSpacing: 5,
                  textTransform: "uppercase",
                  marginBottom: 12,
                  fontWeight: 600,
                }}
              >
                Target
              </div>
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 900,
                  color: "#4a4a4a",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  letterSpacing: -2.5,
                }}
              >
                {target}
              </div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 3: CTA - Commanding, memorable close with celebration energy
const CTAScene: React.FC<{ nextMilestone?: string }> = ({ nextMilestone }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene scale and fade
  const sceneFade = interpolate(
    frame,
    [0, fps * 0.1],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  // Logo entrance - hero element with powerful presence
  const logoProgress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 70, mass: 1.15 },
  });
  const logoOpacity = interpolate(
    frame,
    [0, fps * 0.24],
    [0, 1],
    { extrapolateRight: "clamp" }
  );
  const logoScale = interpolate(logoProgress, [0, 1], [0.85, 1]);

  // Logo glow builds confidently then settles
  const logoGlow = interpolate(
    frame,
    [fps * 0.12, fps * 0.55, fps * 0.9],
    [0, 55, 45],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Dual expanding rings - creates depth and sophistication
  const ring1Opacity = interpolate(
    frame,
    [fps * 0.08, fps * 0.25, fps * 0.9, fps * 1.3],
    [0, 0.25, 0.12, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ring1Scale = interpolate(
    frame,
    [fps * 0.08, fps * 1.3],
    [0.65, 2.3],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  const ring2Opacity = interpolate(
    frame,
    [fps * 0.15, fps * 0.32, fps * 1.1, fps * 1.5],
    [0, 0.18, 0.08, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ring2Scale = interpolate(
    frame,
    [fps * 0.15, fps * 1.5],
    [0.55, 2.8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // "Almost There" badge - builds excitement with glow
  const badgeDelay = 0.28;
  const badgeProgress = spring({
    frame: frame - badgeDelay * fps,
    fps,
    config: { damping: 180, stiffness: 120 },
  });
  const badgeOpacity = interpolate(
    frame,
    [badgeDelay * fps, (badgeDelay + 0.2) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const badgeY = interpolate(badgeProgress, [0, 1], [15, 0]);
  const badgeScale = interpolate(badgeProgress, [0, 1], [0.92, 1]);

  // Badge glow pulses gently
  const badgeGlow = interpolate(
    frame,
    [(badgeDelay + 0.15) * fps, fps * 1.0],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const badgePulse = frame > fps * 0.9 ? interpolate(
    (frame - fps * 0.9) % (fps * 2.2),
    [0, fps * 1.1, fps * 2.2],
    [0.9, 1, 0.9],
    { easing: Easing.inOut(Easing.sin) }
  ) : 1;

  // Next milestone section - dramatic entrance
  const nextDelay = 0.48;
  const nextProgress = spring({
    frame: frame - nextDelay * fps,
    fps,
    config: { damping: 180, stiffness: 90, mass: 1.1 },
  });
  const nextOpacity = interpolate(
    frame,
    [nextDelay * fps, (nextDelay + 0.22) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const nextY = interpolate(nextProgress, [0, 1], [20, 0]);
  const nextScale = interpolate(nextProgress, [0, 1], [0.95, 1]);

  // Next milestone glow
  const nextGlow = interpolate(
    frame,
    [(nextDelay + 0.2) * fps, fps * 1.2],
    [0, 20],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Divider line draws elegantly
  const lineWidth = interpolate(
    frame,
    [fps * 0.8, fps * 1.2],
    [0, 140],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // CTA button - THE action moment with commanding presence
  const ctaDelay = 0.95;
  const ctaProgress = spring({
    frame: frame - ctaDelay * fps,
    fps,
    config: { damping: 180, stiffness: 85, mass: 1.1 },
  });
  const ctaOpacity = interpolate(
    frame,
    [ctaDelay * fps, (ctaDelay + 0.22) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ctaY = interpolate(ctaProgress, [0, 1], [25, 0]);
  const ctaScale = interpolate(ctaProgress, [0, 1], [0.93, 1]);

  // CTA glow builds dramatically then pulses with confidence
  const ctaGlow = interpolate(
    frame,
    [(ctaDelay + 0.15) * fps, fps * 1.8, fps * 2.2],
    [0, 1.15, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const ctaPulse = frame > fps * 1.7 ? interpolate(
    (frame - fps * 1.7) % (fps * 2.4),
    [0, fps * 1.2, fps * 2.4],
    [0.92, 1, 0.92],
    { easing: Easing.inOut(Easing.sin) }
  ) : 1;

  // Inner shine animation on CTA
  const innerPulse = frame > fps * 1.6 ? interpolate(
    (frame - fps * 1.6) % (fps * 2.2),
    [0, fps * 1.1, fps * 2.2],
    [0.18, 0.32, 0.18],
    { easing: Easing.inOut(Easing.sin) }
  ) : 0.18;

  // Bottom text - final beat with decorative lines
  const subDelay = 1.4;
  const subOpacity = interpolate(
    frame,
    [subDelay * fps, (subDelay + 0.3) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const subY = interpolate(
    frame,
    [subDelay * fps, (subDelay + 0.4) * fps],
    [12, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Decorative lines for bottom - draw outward
  const bottomLineWidth = interpolate(
    frame,
    [(subDelay + 0.1) * fps, (subDelay + 0.5) * fps],
    [0, 65],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Background glow intensifies throughout
  const bgIntensity = interpolate(
    frame,
    [0, fps * 1.5],
    [0.025, 0.055],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ opacity: sceneFade }}>
      <CinematicBackground accentColor="#00ff88" intensity={bgIntensity} focusY={50} />

      {/* Additional ambient glow behind CTA - intensifies with button */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 52% 42% at 50% 55%, rgba(0, 255, 136, ${0.045 * ctaGlow}) 0%, transparent 58%)`,
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
        {/* Logo with dual expanding rings */}
        <div style={{ position: "relative" }}>
          {/* Outer ring */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 130,
              height: 130,
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
              width: 120,
              height: 120,
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
              filter: `drop-shadow(0 0 ${logoGlow}px rgba(0, 255, 136, 0.52))`,
            }}
          >
            <FedLogo size={100} glow={false} />
          </div>
        </div>

        {/* "Almost There" badge with glow */}
        <div
          style={{
            opacity: badgeOpacity,
            transform: `translateY(${badgeY}px) scale(${badgeScale * badgePulse})`,
            padding: "11px 24px",
            background: "linear-gradient(165deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 255, 136, 0.04) 100%)",
            borderRadius: 32,
            border: "1px solid rgba(0, 255, 136, 0.18)",
            boxShadow: `0 0 ${22 * badgeGlow}px rgba(0, 255, 136, ${0.1 * badgeGlow})`,
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#00ff88",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 4.5,
              textTransform: "uppercase",
            }}
          >
            Almost There
          </span>
        </div>

        {/* Next milestone - only if provided, with dramatic reveal */}
        {nextMilestone && (
          <div
            style={{
              opacity: nextOpacity,
              transform: `translateY(${nextY}px) scale(${nextScale})`,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: "#454545",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: 4.5,
                textTransform: "uppercase",
                marginBottom: 14,
                fontWeight: 600,
              }}
            >
              Next Target
            </div>
            <div
              style={{
                fontSize: 42,
                fontWeight: 900,
                color: "#ffffff",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -2,
                filter: `drop-shadow(0 0 ${nextGlow}px rgba(255, 255, 255, 0.15))`,
                textShadow: "0 5px 30px rgba(0, 0, 0, 0.4)",
              }}
            >
              {nextMilestone}
            </div>
          </div>
        )}

        {/* Divider line */}
        <div
          style={{
            width: lineWidth,
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)",
            marginTop: 8,
            marginBottom: 8,
          }}
        />

        {/* CTA button - commanding presence with premium styling */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px) scale(${ctaScale})`,
          }}
        >
          <div
            style={{
              padding: "19px 60px",
              background: "linear-gradient(145deg, #00ff88 0%, #00ffcc 45%, #00ff88 100%)",
              borderRadius: 50,
              position: "relative",
              overflow: "hidden",
              boxShadow: `
                0 9px 35px rgba(0, 255, 136, ${(0.28 + 0.18 * ctaGlow) * ctaPulse}),
                0 0 ${48 * ctaGlow * ctaPulse}px rgba(0, 255, 136, ${0.16 * ctaGlow * ctaPulse}),
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
                background: `linear-gradient(180deg, rgba(255,255,255,${innerPulse * 0.85}) 0%, transparent 100%)`,
                borderRadius: "50px 50px 0 0",
                pointerEvents: "none",
              }}
            />
            <span
              style={{
                fontSize: 34,
                fontWeight: 900,
                color: "#020202",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -0.5,
                textShadow: "0 1px 0 rgba(255, 255, 255, 0.2)",
                position: "relative",
              }}
            >
              fed.markets
            </span>
          </div>
        </div>

        {/* Bottom text with decorative lines */}
        <div
          style={{
            opacity: subOpacity,
            transform: `translateY(${subY}px)`,
            marginTop: 16,
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <div
            style={{
              width: bottomLineWidth,
              height: 1,
              background: "linear-gradient(270deg, rgba(0, 255, 136, 0.28), transparent)",
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
              width: bottomLineWidth,
              height: 1,
              background: "linear-gradient(90deg, rgba(0, 255, 136, 0.28), transparent)",
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Main composition - 12 seconds total with cinematic pacing
export const MilestoneAnnouncement: React.FC<MilestoneAnnouncementProps> = ({
  milestone,
  target,
  current,
  progress,
  nextMilestone,
}) => {
  const { fps } = useVideoConfig();

  // Clean, quick fades - 0.25s sweet spot
  const transitionFrames = Math.round(0.25 * fps);

  return (
    <TransitionSeries>
      {/* Reveal: 3.6s - Build anticipation, deliver milestone with percentage badge */}
      <TransitionSeries.Sequence durationInFrames={Math.round(3.6 * fps)}>
        <RevealScene milestone={milestone} progress={progress} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* Progress: 4.6s - Satisfying data visualization with counting */}
      <TransitionSeries.Sequence durationInFrames={Math.round(4.6 * fps)}>
        <ProgressScene target={target} current={current} progress={progress} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* CTA: 3.3s - Confident close with momentum */}
      <TransitionSeries.Sequence durationInFrames={Math.round(3.3 * fps)}>
        <CTAScene nextMilestone={nextMilestone} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
