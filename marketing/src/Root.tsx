import { Composition, Folder } from "remotion";
import { StatsUpdate, StatsUpdateProps } from "./videos/StatsUpdate";
import { MilestoneAnnouncement, MilestoneAnnouncementProps } from "./videos/MilestoneAnnouncement";
import { FeatureHighlight, FeatureHighlightProps } from "./videos/FeatureHighlight";

// Twitter Desktop optimal: 1280x720 (16:9)
const TWITTER_WIDTH = 1280;
const TWITTER_HEIGHT = 720;
const FPS = 30;

// Default props for each video type - Updated with latest stats (2026-01-22 02:00)
const defaultStatsProps: StatsUpdateProps = {
  headline: "THE MONEY PRINTER GOES BRRR",
  stats: [
    { value: "$49,077+", numericValue: 49077, prefix: "$", suffix: "+", label: "USD1 Distributed", color: "#00ff88" },
    { value: "314+", numericValue: 314, suffix: "+", label: "Distributions", color: "#00d4ff" },
    { value: "1,077+", numericValue: 1077, suffix: "+", label: "Holders Earning", color: "#ff6b9d" },
  ],
  tagline: "Real yield from real trading fees",
  cta: "fed.markets",
};

const defaultMilestoneProps: MilestoneAnnouncementProps = {
  milestone: "QE2",
  target: "$50,000",
  current: "$49,077",
  progress: 98,
  nextMilestone: "QE3 - $100,000",
};

const defaultFeatureProps: FeatureHighlightProps = {
  feature: "4-Layer Multiplier Stack",
  description: "Stack multipliers from holder tiers, diamond hands streaks, engagement scores, and time-lock commitments for up to 4.5x rewards.",
  benefits: [
    "Hold more = earn more (1.5x)",
    "Hold longer = earn more (1.25x)",
    "Engage more = earn more (1.2x)",
    "Lock longer = earn more (2.0x)",
  ],
  icon: "x4.5",
};

export const RemotionRoot = () => {
  return (
    <>
      <Folder name="Marketing">
        <Composition
          id="StatsUpdate"
          component={StatsUpdate}
          durationInFrames={10 * FPS}
          fps={FPS}
          width={TWITTER_WIDTH}
          height={TWITTER_HEIGHT}
          defaultProps={defaultStatsProps}
        />

        <Composition
          id="MilestoneAnnouncement"
          component={MilestoneAnnouncement}
          durationInFrames={12 * FPS}
          fps={FPS}
          width={TWITTER_WIDTH}
          height={TWITTER_HEIGHT}
          defaultProps={defaultMilestoneProps}
        />

        <Composition
          id="FeatureHighlight"
          component={FeatureHighlight}
          durationInFrames={13 * FPS}
          fps={FPS}
          width={TWITTER_WIDTH}
          height={TWITTER_HEIGHT}
          defaultProps={defaultFeatureProps}
        />
      </Folder>
    </>
  );
};
