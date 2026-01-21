import {
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
  spring,
  interpolate,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import {
  GradientBackground,
  RadialGlow,
  GridOverlay,
  FedLogo,
  ProgressBar,
  Title,
  Subtitle,
  FloatingParticles,
} from "../components/visuals";
import { ScaleIn, SlideIn, FadeIn, GlowPulse } from "../components/animations";

export type MilestoneAnnouncementProps = {
  milestone: string;
  target: string;
  current: string;
  progress: number;
  celebration?: boolean;
  nextMilestone?: string;
};

// Celebration particles
const CelebrationParticles = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const particles = Array.from({ length: 30 }, (_, i) => {
    const seed = i * 97.3;
    const startX = width / 2;
    const startY = height / 2;
    const angle = (seed / 30) * Math.PI * 2;
    const velocity = 3 + (seed % 5);
    const x = startX + Math.cos(angle) * frame * velocity;
    const y = startY + Math.sin(angle) * frame * velocity + frame * frame * 0.05;
    const size = 4 + (seed % 6);
    const hue = (seed * 7) % 360;
    const opacity = Math.max(0, 1 - frame / 90);

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
          background: `hsl(${hue}, 80%, 60%)`,
          opacity,
        }}
      />
    );
  });

  return <AbsoluteFill style={{ overflow: "hidden" }}>{particles}</AbsoluteFill>;
};

// Scene 1: Big reveal
const RevealScene: React.FC<{ milestone: string }> = ({ milestone }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 8, stiffness: 100 },
  });

  const glow = interpolate(frame, [30, 60], [0, 60], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <GradientBackground colors={["#0a0a0a", "#1a0a2a", "#0a0a0a"]} />
      <RadialGlow color="#ffd700" intensity={0.4} />
      <CelebrationParticles />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 30,
        }}
      >
        <FadeIn delay={0}>
          <Subtitle size={42} color="#ffd700">
            MILESTONE ACHIEVED
          </Subtitle>
        </FadeIn>

        <div
          style={{
            transform: `scale(${scale})`,
            filter: `drop-shadow(0 0 ${glow}px #ffd700)`,
          }}
        >
          <Title size={120} color="#ffffff" glow>
            {milestone}
          </Title>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 2: Progress details
const ProgressScene: React.FC<{
  target: string;
  current: string;
  progress: number;
}> = ({ target, current, progress }) => {
  return (
    <AbsoluteFill>
      <GradientBackground colors={["#0a0a0a", "#0a1a0a", "#0a0a0a"]} />
      <RadialGlow color="#00ff88" intensity={0.3} />
      <GridOverlay opacity={0.02} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 80,
          gap: 50,
        }}
      >
        <SlideIn delay={0} direction="top">
          <Title size={56} color="#ffffff">
            Distribution Progress
          </Title>
        </SlideIn>

        <FadeIn delay={0.3}>
          <div style={{ width: 800 }}>
            <ProgressBar progress={progress} delay={0.5} height={40} />
          </div>
        </FadeIn>

        <FadeIn delay={0.8}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: 800,
              marginTop: 20,
            }}
          >
            <div style={{ textAlign: "left" }}>
              <Subtitle size={28} color="#888888">
                DISTRIBUTED
              </Subtitle>
              <Title size={48} color="#00ff88" glow>
                {current}
              </Title>
            </div>
            <div style={{ textAlign: "right" }}>
              <Subtitle size={28} color="#888888">
                TARGET
              </Subtitle>
              <Title size={48} color="#ffffff">
                {target}
              </Title>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={1.2}>
          <Title size={72} color="#00ff88" glow>
            {progress}% COMPLETE
          </Title>
        </FadeIn>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 3: What's next
const NextScene: React.FC<{ nextMilestone?: string }> = ({ nextMilestone }) => {
  const frame = useCurrentFrame();

  const pulse = interpolate(frame % 45, [0, 22, 45], [1, 1.03, 1]);

  return (
    <AbsoluteFill>
      <GradientBackground colors={["#0a0a0a", "#001a1a", "#0a0a0a"]} />
      <RadialGlow color="#00d4ff" intensity={0.35} />
      <FloatingParticles count={15} color="#00d4ff30" />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 40,
        }}
      >
        <ScaleIn delay={0}>
          <FedLogo size={140} glow glowColor="#00d4ff" />
        </ScaleIn>

        {nextMilestone && (
          <FadeIn delay={0.4}>
            <Subtitle size={32} color="#888888">
              NEXT MILESTONE
            </Subtitle>
            <Title size={64} color="#00d4ff" glow>
              {nextMilestone}
            </Title>
          </FadeIn>
        )}

        <FadeIn delay={0.8}>
          <div
            style={{
              padding: "20px 50px",
              background: "linear-gradient(90deg, #00ff88 0%, #00d4ff 100%)",
              borderRadius: 50,
              transform: `scale(${pulse})`,
            }}
          >
            <span
              style={{
                fontSize: 36,
                fontWeight: 900,
                color: "#0a0a0a",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              fed.markets
            </span>
          </div>
        </FadeIn>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const MilestoneAnnouncement: React.FC<MilestoneAnnouncementProps> = ({
  milestone,
  target,
  current,
  progress,
  nextMilestone,
}) => {
  const { fps } = useVideoConfig();

  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={Math.round(3.5 * fps)}>
        <RevealScene milestone={milestone} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: Math.round(0.5 * fps) })}
      />

      <TransitionSeries.Sequence durationInFrames={Math.round(5 * fps)}>
        <ProgressScene target={target} current={current} progress={progress} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: Math.round(0.4 * fps) })}
      />

      <TransitionSeries.Sequence durationInFrames={Math.round(4 * fps)}>
        <NextScene nextMilestone={nextMilestone} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
