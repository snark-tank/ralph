import {
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
  Sequence,
  spring,
  interpolate,
  Easing,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import {
  GradientBackground,
  RadialGlow,
  GridOverlay,
  FedLogo,
  Title,
  Subtitle,
  AccentText,
  FloatingParticles,
} from "../components/visuals";
import { ScaleIn, SlideIn, FadeIn, AnimatedNumber, GlowPulse } from "../components/animations";

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

// Scene 1: Intro with logo - DRAMATIC HOOK in first 2 seconds
const IntroScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Bouncy scale for immediate impact
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 8, stiffness: 150 }, // Bouncier for drama
  });

  // Dramatic glow pulse that intensifies
  const glowIntensity = interpolate(
    frame,
    [0, fps * 0.5, fps * 1.5],
    [0.1, 0.6, 0.4],
    { extrapolateRight: "clamp" }
  );

  // Fast title scale with overshoot
  const titleScale = spring({
    frame: frame - fps * 0.4, // Start after logo
    fps,
    config: { damping: 10, stiffness: 200 },
  });

  // Subtle zoom effect on background
  const bgScale = interpolate(frame, [0, fps * 2], [1.1, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill>
      <div style={{ transform: `scale(${bgScale})`, width: "100%", height: "100%" }}>
        <GradientBackground colors={["#0a0a0a", "#001a0a", "#0a0a0a"]} />
      </div>
      <RadialGlow color="#00ff88" intensity={glowIntensity} />
      <FloatingParticles count={25} color="#00ff8860" />
      <GridOverlay opacity={0.03} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            transform: `scale(${logoScale})`,
            filter: `drop-shadow(0 0 ${30 + glowIntensity * 40}px #00ff88)`,
          }}
        >
          <FedLogo size={200} glow />
        </div>
        <div
          style={{
            transform: `scale(${Math.max(0, titleScale)})`,
            marginTop: 16,
          }}
        >
          <Title size={108} color="#00ff88" glow>
            $FED
          </Title>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 2: Headline with impactful animation
const HeadlineScene: React.FC<{ headline: string }> = ({ headline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scale in with bounce for impact
  const scale = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 180 },
  });

  // Glow intensifies then settles
  const glowIntensity = interpolate(
    frame,
    [0, fps * 0.5, fps * 2],
    [0, 0.5, 0.3],
    { extrapolateRight: "clamp" }
  );

  // Subtle shake effect at impact
  const shake = frame < fps * 0.3
    ? Math.sin(frame * 2) * interpolate(frame, [0, fps * 0.3], [3, 0])
    : 0;

  return (
    <AbsoluteFill>
      <GradientBackground colors={["#0a0a0a", "#0a1a2e", "#0a0a0a"]} />
      <RadialGlow color="#00d4ff" intensity={glowIntensity} x="50%" y="50%" />
      <GridOverlay opacity={0.02} />
      <FloatingParticles count={12} color="#00d4ff40" />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 60,
        }}
      >
        <div
          style={{
            transform: `scale(${scale}) translateX(${shake}px)`,
            textAlign: "center",
          }}
        >
          <Title size={72} color="#ffffff" glow>
            {headline}
          </Title>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Enhanced stat card with animated number
const AnimatedStatCard: React.FC<{
  stat: StatsUpdateProps["stats"][0];
  delay: number;
}> = ({ stat, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Bouncier reveal animation
  const progress = spring({
    frame: frame - delay * fps,
    fps,
    config: { damping: 10, stiffness: 150 }, // Bouncier
  });

  // Scale bounce for emphasis
  const scale = spring({
    frame: frame - delay * fps,
    fps,
    config: { damping: 8 }, // Very bouncy
  });

  // Glow pulse after card appears
  const glowFrame = Math.max(0, frame - (delay + 0.5) * fps);
  const glow = interpolate(glowFrame % 45, [0, 22, 45], [15, 30, 15]);

  // Number animation starts after card appears
  const numberDelay = delay + 0.2;
  const numberProgress = interpolate(
    frame,
    [numberDelay * fps, (numberDelay + 0.8) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Parse numeric value if available
  const numericValue = stat.numericValue ?? (parseFloat(stat.value.replace(/[^0-9.]/g, "")) || 0);
  const displayValue = Math.floor(numericValue * numberProgress);
  const prefix = stat.prefix ?? (stat.value.startsWith("$") ? "$" : "");
  const suffix = stat.suffix ?? (stat.value.includes("+") ? "+" : "");

  return (
    <div
      style={{
        transform: `translateY(${interpolate(progress, [0, 1], [80, 0])}px) scale(${Math.min(scale, 1.05)})`,
        opacity: progress,
      }}
    >
      <div
        style={{
          width: 320,
          padding: "28px 36px",
          background: `linear-gradient(135deg, ${stat.color}18 0%, ${stat.color}08 100%)`,
          borderLeft: `5px solid ${stat.color}`,
          borderRadius: 16,
          boxShadow: `0 0 ${glow}px ${stat.color}40`,
        }}
      >
        <div
          style={{
            fontSize: 52,
            fontWeight: 900,
            color: stat.color,
            fontFamily: "system-ui, -apple-system, sans-serif",
            textShadow: `0 0 25px ${stat.color}60`,
            lineHeight: 1,
          }}
        >
          {prefix}{displayValue.toLocaleString()}{suffix}
        </div>
        <div
          style={{
            fontSize: 16,
            color: "#999999",
            fontFamily: "system-ui, -apple-system, sans-serif",
            marginTop: 10,
            textTransform: "uppercase",
            letterSpacing: 3,
            fontWeight: 600,
          }}
        >
          {stat.label}
        </div>
      </div>
    </div>
  );
};

// Scene 3: Stats display with animated numbers
const StatsScene: React.FC<{ stats: StatsUpdateProps["stats"] }> = ({ stats }) => {
  return (
    <AbsoluteFill>
      <GradientBackground colors={["#0a0a0a", "#0a1a1a", "#0a0a0a"]} />
      <FloatingParticles count={15} color="#00ff8840" />
      <GridOverlay opacity={0.02} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 50,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 32,
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 1150,
          }}
        >
          {stats.map((stat, index) => (
            <AnimatedStatCard
              key={stat.label}
              stat={stat}
              delay={index * 0.15} // Faster stagger
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 4: CTA with enhanced animations
const CTAScene: React.FC<{ tagline: string; cta: string }> = ({ tagline, cta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Faster, snappier pulse
  const pulse = interpolate(frame % 40, [0, 20, 40], [1, 1.08, 1]);

  // CTA button glow
  const ctaGlow = interpolate(frame % 50, [0, 25, 50], [10, 25, 10]);

  // Logo entrance with bounce
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 180 },
  });

  return (
    <AbsoluteFill>
      <GradientBackground colors={["#0a0a0a", "#001a0a", "#0a0a0a"]} />
      <RadialGlow color="#00ff88" intensity={0.4} />
      <FloatingParticles count={25} color="#00ff8850" />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 32,
          flexDirection: "column",
        }}
      >
        <div style={{ transform: `scale(${logoScale})` }}>
          <FedLogo size={100} glow />
        </div>

        <FadeIn delay={0.2} duration={0.3}>
          <Subtitle size={34} color="#ffffff">
            {tagline}
          </Subtitle>
        </FadeIn>

        <FadeIn delay={0.4} duration={0.3}>
          <div
            style={{
              padding: "18px 48px",
              background: "linear-gradient(90deg, #00ff88 0%, #00d4ff 100%)",
              borderRadius: 50,
              transform: `scale(${pulse})`,
              boxShadow: `0 0 ${ctaGlow}px #00ff88, 0 0 ${ctaGlow * 2}px #00ff8840`,
            }}
          >
            <span
              style={{
                fontSize: 38,
                fontWeight: 900,
                color: "#0a0a0a",
                fontFamily: "system-ui, sans-serif",
                letterSpacing: 1,
              }}
            >
              {cta}
            </span>
          </div>
        </FadeIn>

        <FadeIn delay={0.6} duration={0.3}>
          <div style={{ textAlign: "center" }}>
            <Subtitle size={22} color="#00ff88">
              Real yield. Every 2 minutes.
            </Subtitle>
          </div>
        </FadeIn>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Main video composition - tightened timing for ~10 second video
export const StatsUpdate: React.FC<StatsUpdateProps> = ({
  headline,
  stats,
  tagline,
  cta,
}) => {
  const { fps } = useVideoConfig();

  return (
    <TransitionSeries>
      {/* Intro: 2s - Quick, impactful hook */}
      <TransitionSeries.Sequence durationInFrames={Math.round(2 * fps)}>
        <IntroScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: Math.round(0.3 * fps) })}
      />

      {/* Headline: 2s - Fast, punchy */}
      <TransitionSeries.Sequence durationInFrames={Math.round(2 * fps)}>
        <HeadlineScene headline={headline} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: Math.round(0.3 * fps) })}
      />

      {/* Stats: 3.5s - Let numbers count up */}
      <TransitionSeries.Sequence durationInFrames={Math.round(3.5 * fps)}>
        <StatsScene stats={stats} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: Math.round(0.3 * fps) })}
      />

      {/* CTA: 3s - Strong finish */}
      <TransitionSeries.Sequence durationInFrames={Math.round(3 * fps)}>
        <CTAScene tagline={tagline} cta={cta} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
