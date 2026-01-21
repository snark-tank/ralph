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
  Title,
  Subtitle,
  FloatingParticles,
} from "../components/visuals";
import { ScaleIn, SlideIn, FadeIn } from "../components/animations";

export type FeatureHighlightProps = {
  feature: string;
  description: string;
  benefits: string[];
  icon?: string;
};

// Scene 1: Feature intro
const IntroScene: React.FC<{ feature: string; icon?: string }> = ({ feature, icon }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const iconScale = spring({
    frame,
    fps,
    config: { damping: 10 },
  });

  return (
    <AbsoluteFill>
      <GradientBackground colors={["#0a0a0a", "#1a0a2e", "#0a0a0a"]} />
      <RadialGlow color="#9945FF" intensity={0.35} />
      <GridOverlay opacity={0.03} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 40,
        }}
      >
        {icon && (
          <div
            style={{
              transform: `scale(${iconScale})`,
              fontSize: 100,
            }}
          >
            {icon}
          </div>
        )}

        <FadeIn delay={0.3}>
          <Subtitle size={28} color="#9945FF">
            NEW FEATURE
          </Subtitle>
        </FadeIn>

        <SlideIn delay={0.5} direction="bottom">
          <Title size={72} color="#ffffff">
            {feature}
          </Title>
        </SlideIn>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 2: Description
const DescriptionScene: React.FC<{ description: string }> = ({ description }) => {
  return (
    <AbsoluteFill>
      <GradientBackground colors={["#0a0a0a", "#0a0a1a", "#0a0a0a"]} />
      <RadialGlow color="#00d4ff" intensity={0.25} x="70%" y="30%" />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 100,
        }}
      >
        <SlideIn delay={0} direction="left">
          <p
            style={{
              fontSize: 42,
              color: "#ffffff",
              fontFamily: "system-ui, sans-serif",
              textAlign: "center",
              lineHeight: 1.5,
              maxWidth: 900,
            }}
          >
            {description}
          </p>
        </SlideIn>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 3: Benefits list
const BenefitsScene: React.FC<{ benefits: string[] }> = ({ benefits }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <GradientBackground colors={["#0a0a0a", "#0a1a0a", "#0a0a0a"]} />
      <RadialGlow color="#00ff88" intensity={0.3} />
      <GridOverlay opacity={0.02} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "60px 100px",
        }}
      >
        <FadeIn delay={0}>
          <Title size={48} color="#00ff88">
            Benefits
          </Title>
        </FadeIn>

        <div
          style={{
            marginTop: 50,
            display: "flex",
            flexDirection: "column",
            gap: 30,
          }}
        >
          {benefits.map((benefit, index) => {
            const delay = 0.3 + index * 0.2;
            const progress = spring({
              frame: frame - delay * fps,
              fps,
              config: { damping: 15 },
            });

            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  transform: `translateX(${interpolate(progress, [0, 1], [-50, 0])}px)`,
                  opacity: progress,
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    background: "#00ff88",
                    boxShadow: "0 0 15px #00ff88",
                  }}
                />
                <span
                  style={{
                    fontSize: 36,
                    color: "#ffffff",
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  {benefit}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 4: CTA
const CTAScene = () => {
  const frame = useCurrentFrame();
  const pulse = interpolate(frame % 50, [0, 25, 50], [1, 1.04, 1]);

  return (
    <AbsoluteFill>
      <GradientBackground colors={["#0a0a0a", "#001a0a", "#0a0a0a"]} />
      <RadialGlow color="#00ff88" intensity={0.4} />
      <FloatingParticles count={20} color="#00ff8840" />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 50,
        }}
      >
        <ScaleIn delay={0}>
          <FedLogo size={150} glow />
        </ScaleIn>

        <FadeIn delay={0.4}>
          <Title size={56} color="#ffffff">
            Experience it now
          </Title>
        </FadeIn>

        <FadeIn delay={0.7}>
          <div
            style={{
              padding: "24px 60px",
              background: "linear-gradient(90deg, #00ff88 0%, #00d4ff 100%)",
              borderRadius: 60,
              transform: `scale(${pulse})`,
            }}
          >
            <span
              style={{
                fontSize: 42,
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

export const FeatureHighlight: React.FC<FeatureHighlightProps> = ({
  feature,
  description,
  benefits,
  icon,
}) => {
  const { fps } = useVideoConfig();

  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={Math.round(3 * fps)}>
        <IntroScene feature={feature} icon={icon} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: Math.round(0.4 * fps) })}
      />

      <TransitionSeries.Sequence durationInFrames={Math.round(3.5 * fps)}>
        <DescriptionScene description={description} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: Math.round(0.4 * fps) })}
      />

      <TransitionSeries.Sequence durationInFrames={Math.round(4 * fps)}>
        <BenefitsScene benefits={benefits} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: Math.round(0.4 * fps) })}
      />

      <TransitionSeries.Sequence durationInFrames={Math.round(3.5 * fps)}>
        <CTAScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
