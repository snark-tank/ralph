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
const FilmGrain: React.FC<{ opacity?: number }> = ({ opacity = 0.02 }) => {
  const frame = useCurrentFrame();
  // Slower, more organic movement
  const offsetX = (frame * 13) % 100;
  const offsetY = (frame * 19) % 100;

  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundPosition: `${offsetX}px ${offsetY}px`,
        opacity,
        mixBlendMode: "overlay",
        pointerEvents: "none",
      }}
    />
  );
};

// Subtle scanline effect - refined and less distracting
const ScanlineOverlay: React.FC<{ opacity?: number; speed?: number }> = ({ opacity = 0.06, speed = 2.0 }) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();

  // Scanline moves down the screen - slower for more elegance
  const scanlineY = (frame * speed) % (height + 60);

  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {/* Very subtle horizontal lines - almost imperceptible */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 3px,
            rgba(0, 0, 0, ${opacity * 0.35}) 3px,
            rgba(0, 0, 0, ${opacity * 0.35}) 4px
          )`,
          opacity: 0.45,
        }}
      />
      {/* Moving highlight scanline - subtle glow effect */}
      <div
        style={{
          position: "absolute",
          top: scanlineY - 30,
          left: 0,
          right: 0,
          height: 60,
          background: `linear-gradient(180deg,
            transparent 0%,
            rgba(0, 255, 136, ${opacity * 0.25}) 35%,
            rgba(255, 255, 255, ${opacity * 0.4}) 50%,
            rgba(0, 255, 136, ${opacity * 0.25}) 65%,
            transparent 100%)`,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

// Premium cinematic background - depth without distraction
const CinematicBackground: React.FC<{
  accentColor?: string;
  intensity?: number;
  focusY?: number;
  showGrain?: boolean;
  urgency?: number; // 0-1, adds pulsing urgency for high-progress states
}> = ({ accentColor = "#00ff88", intensity = 0.03, focusY = 50, showGrain = true, urgency = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Extremely slow drift - creates subtle life
  const drift = interpolate(frame, [0, 900], [0, 2], {
    extrapolateRight: "clamp",
  });

  // Urgency breathing - subtle pulse that adds tension
  const urgencyPulse = urgency > 0 ? interpolate(
    frame % (fps * 1.5),
    [0, fps * 0.75, fps * 1.5],
    [0, urgency * 0.015, 0],
    { easing: Easing.inOut(Easing.sin) }
  ) : 0;

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
      <AbsoluteFill style={{ background: "#020202" }} />

      {/* Subtle noise texture base for depth */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, #050505 0%, #010101 100%)`,
        }}
      />

      {/* Primary glow - centered, focused with urgency breathing */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 65% 45% at 50% ${focusY + drift}%, ${hexToRgba(accentColor, intensity + urgencyPulse)} 0%, transparent 55%)`,
        }}
      />

      {/* Secondary ambient - subtle top wash */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 90% 18% at 50% 0%, ${hexToRgba(accentColor, intensity * 0.12)} 0%, transparent 40%)`,
        }}
      />

      {/* Bottom subtle glow - grounds the composition */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 80% 25% at 50% 100%, ${hexToRgba(accentColor, intensity * 0.08)} 0%, transparent 50%)`,
        }}
      />

      {/* Cinematic vignette - frames everything elegantly */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 85% 75% at 50% 50%, transparent 25%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Film grain for texture */}
      {showGrain && <FilmGrain opacity={0.018} />}
    </AbsoluteFill>
  );
};

// Scene 1: The Big Reveal - Apple-keynote style dramatic reveal with cinematic energy
const RevealScene: React.FC<{ milestone: string; progress: number; current?: string; target?: string }> = ({ milestone, progress, current, target }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Is this a HIGH progress milestone (>90%)? Add extra urgency
  const isNearComplete = progress >= 90;
  // Even more urgent when nearly done
  const isAlmostThere = progress >= 95;
  // Critical urgency at 98%+
  const isCritical = progress >= 98;
  // IMMINENT - 99%+ is THE moment, maximum drama
  const isImminent = progress >= 99;

  // Phase 0: Total darkness with refined flicker timing - organic, not mechanical
  // The flicker creates anticipation like a projector warming up
  const flicker = frame < fps * 0.05 ? 0 :
    frame < fps * 0.065 ? 0.03 :
    frame < fps * 0.08 ? 0.008 :
    frame < fps * 0.095 ? 0.06 :
    frame < fps * 0.11 ? 0.015 :
    frame < fps * 0.125 ? 0.12 :
    frame < fps * 0.14 ? 0.04 :
    frame < fps * 0.155 ? 0.2 :
    frame < fps * 0.17 ? 0.08 : 1;

  const darknessFade = interpolate(
    frame,
    [fps * 0.17, fps * 0.42],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) * (frame < fps * 0.17 ? flicker : 1);

  // Scanline visibility - only during power-on phase, subtle
  const scanlineOpacity = interpolate(
    frame,
    [0, fps * 0.12, fps * 0.5, fps * 0.75],
    [0, 0.08, 0.04, 0],
    { extrapolateRight: "clamp" }
  );

  // Initial light burst - a brilliant point that expands cinematically
  const burstOpacity = interpolate(
    frame,
    [fps * 0.06, fps * 0.14, fps * 0.45, fps * 0.72],
    [0, 0.75, 0.25, 0],
    { extrapolateRight: "clamp" }
  );
  const burstScale = interpolate(
    frame,
    [fps * 0.06, fps * 0.72],
    [0.015, 3.5],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Secondary outer burst ring - layered depth
  const ring2BurstOpacity = interpolate(
    frame,
    [fps * 0.1, fps * 0.2, fps * 0.5, fps * 0.8],
    [0, 0.45, 0.15, 0],
    { extrapolateRight: "clamp" }
  );
  const ring2BurstScale = interpolate(
    frame,
    [fps * 0.1, fps * 0.8],
    [0.01, 4.2],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Horizontal reveal line - cinematic wipe effect
  const revealLineWidth = interpolate(
    frame,
    [fps * 0.04, fps * 0.4],
    [0, 720],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const revealLineOpacity = interpolate(
    frame,
    [fps * 0.04, fps * 0.12, fps * 0.55, fps * 0.85],
    [0, 0.55, 0.2, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Pre-title - text varies based on how close we are to milestone
  const preText = isImminent ? "One Percent Away" : isCritical ? "The Final Push" : isAlmostThere ? "Almost There" : isNearComplete ? "Final Stretch" : "Approaching Milestone";
  const preDelay = 0.38;
  const preOpacity = interpolate(
    frame,
    [preDelay * fps, (preDelay + 0.2) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const preY = interpolate(
    frame,
    [preDelay * fps, (preDelay + 0.28) * fps],
    [14, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Pulsing indicator dot - faster pulse when near complete for urgency
  const pulseSpeed = isImminent ? 0.55 : isCritical ? 0.7 : isNearComplete ? 0.9 : 1.4;
  const dotPulse = frame > fps * 0.6 ? interpolate(
    (frame - fps * 0.6) % (fps * pulseSpeed),
    [0, fps * pulseSpeed * 0.25, fps * pulseSpeed],
    [0.45, 1, 0.45],
    { extrapolateLeft: "clamp", easing: Easing.inOut(Easing.sin) }
  ) : interpolate(frame, [preDelay * fps, fps * 0.6], [0, 0.45], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Ring pulse around dot - sophisticated expansion
  const dotRingScale = frame > fps * 0.6 ? interpolate(
    (frame - fps * 0.6) % (fps * pulseSpeed),
    [0, fps * pulseSpeed * 0.25, fps * pulseSpeed],
    [1, 2.4, 1],
    { extrapolateLeft: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 1;
  const dotRingOpacity = frame > fps * 0.6 ? interpolate(
    (frame - fps * 0.6) % (fps * pulseSpeed),
    [0, fps * pulseSpeed * 0.22, fps * pulseSpeed],
    [0.65, 0, 0],
    { extrapolateLeft: "clamp" }
  ) : 0;

  // Main milestone "QE2" - THE hero moment with commanding weight
  const heroDelay = 0.72;
  const heroProgress = spring({
    frame: frame - heroDelay * fps,
    fps,
    config: { damping: 180, stiffness: 45, mass: 1.6 },
  });
  const heroOpacity = interpolate(
    frame,
    [heroDelay * fps, (heroDelay + 0.25) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const heroY = interpolate(heroProgress, [0, 1], [55, 0]);
  const heroScale = interpolate(heroProgress, [0, 1], [0.88, 1]);

  // Q and E animate separately from 2 for visual interest - the "2" pops
  const numDelay = heroDelay + 0.12;
  const numProgress = spring({
    frame: frame - numDelay * fps,
    fps,
    config: { damping: 140, stiffness: 130, mass: 1.0 },
  });
  const numOpacity = interpolate(
    frame,
    [numDelay * fps, (numDelay + 0.2) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const numScale = interpolate(numProgress, [0, 1], [0.7, 1]);

  // "2" lands with a satisfying scale pulse - bigger for high progress
  const numLandTime = (numDelay + 0.32) * fps;
  const numLandPulse = frame > numLandTime ? interpolate(
    frame,
    [numLandTime, numLandTime + fps * 0.07, numLandTime + fps * 0.2],
    [1, isImminent ? 1.18 : isCritical ? 1.12 : 1.08, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 1;

  // Glow builds majestically after text lands - more dramatic intensity
  const glowIntensity = interpolate(
    frame,
    [fps * 1.1, fps * 1.8, fps * 2.8],
    [0, isImminent ? 130 : isCritical ? 110 : 90, isImminent ? 100 : isCritical ? 85 : 70],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Triple concentric rings expanding from milestone - creates depth
  const ring1Delay = 0.85;
  const ring1Opacity = interpolate(
    frame,
    [ring1Delay * fps, (ring1Delay + 0.14) * fps, fps * 1.8, fps * 2.3],
    [0, 0.28, 0.14, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ring1Scale = interpolate(
    frame,
    [ring1Delay * fps, fps * 2.3],
    [0.5, 2.6],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  const ring2Delay = 1.0;
  const ring2Opacity = interpolate(
    frame,
    [ring2Delay * fps, (ring2Delay + 0.14) * fps, fps * 2.1, fps * 2.6],
    [0, 0.2, 0.1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ring2Scale = interpolate(
    frame,
    [ring2Delay * fps, fps * 2.6],
    [0.4, 3.2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Third ring for extra depth at critical progress
  const ring3Delay = 1.15;
  const ring3Opacity = isCritical ? interpolate(
    frame,
    [ring3Delay * fps, (ring3Delay + 0.14) * fps, fps * 2.4, fps * 2.9],
    [0, 0.15, 0.06, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : 0;
  const ring3Scale = interpolate(
    frame,
    [ring3Delay * fps, fps * 2.9],
    [0.35, 3.8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Background glow intensifies with reveal - energy builds
  const bgIntensity = interpolate(
    frame,
    [fps * 0.35, fps * 1.8],
    [0.015, isImminent ? 0.1 : isCritical ? 0.08 : 0.065],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Urgency pulse for critical progress
  const urgencyFactor = isImminent ? 1.3 : isCritical ? 1 : isAlmostThere ? 0.6 : isNearComplete ? 0.3 : 0;

  // Percentage badge - appears dramatically after milestone with celebration energy
  // For high progress, make this more dramatic with a bigger scale effect
  const percentDelay = 1.4;
  const percentProgress = spring({
    frame: frame - percentDelay * fps,
    fps,
    config: { damping: isImminent ? 80 : isCritical ? 100 : isNearComplete ? 120 : 130, stiffness: isImminent ? 250 : isCritical ? 220 : isNearComplete ? 200 : 180, mass: 0.8 },
  });
  const percentOpacity = interpolate(
    frame,
    [percentDelay * fps, (percentDelay + 0.14) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const percentScale = interpolate(percentProgress, [0, 1], [isImminent ? 0.45 : isCritical ? 0.5 : isNearComplete ? 0.55 : 0.65, 1]);

  // Progress number counts up with luxurious ease-out - faster for critical to build excitement
  const countDuration = isCritical ? 0.55 : 0.65;
  const displayProgress = interpolate(
    frame,
    [(percentDelay + 0.06) * fps, (percentDelay + countDuration) * fps],
    [0, progress],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 4.5) }
  );

  // Badge "lands" with a satisfying scale pulse when number finishes - bigger pulse for high progress
  const badgeLandTime = (percentDelay + countDuration) * fps;
  const hasLanded = displayProgress >= progress - 1;
  const badgeLandPulse = hasLanded ? interpolate(
    frame,
    [badgeLandTime - fps * 0.02, badgeLandTime + fps * 0.07, badgeLandTime + fps * 0.22],
    [1, isImminent ? 1.4 : isCritical ? 1.3 : isNearComplete ? 1.22 : 1.15, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 1;

  // Badge glow bursts on landing then settles - more dramatic for high progress
  const percentGlow = hasLanded ? interpolate(
    frame,
    [badgeLandTime - fps * 0.1, badgeLandTime, badgeLandTime + fps * 0.08, badgeLandTime + fps * 0.35],
    [0.35, 0.75, isImminent ? 2.5 : isCritical ? 2.0 : isNearComplete ? 1.7 : 1.4, isImminent ? 1.5 : isCritical ? 1.2 : isNearComplete ? 1.0 : 0.85],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : interpolate(
    frame,
    [(percentDelay + 0.18) * fps, (percentDelay + countDuration - 0.08) * fps],
    [0, 0.65],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Dual celebration rings for high progress milestones - inner brighter, outer softer
  const extraRingOpacity = isNearComplete && hasLanded ? interpolate(
    frame,
    [badgeLandTime, badgeLandTime + fps * 0.06, badgeLandTime + fps * 0.45],
    [isCritical ? 0.8 : 0.65, isCritical ? 0.45 : 0.35, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : 0;
  const extraRingScale = isNearComplete && hasLanded ? interpolate(
    frame,
    [badgeLandTime, badgeLandTime + fps * 0.45],
    [0.55, isCritical ? 3.2 : 2.8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 0.55;

  // Second outer ring for critical progress
  const extraRing2Opacity = isCritical && hasLanded ? interpolate(
    frame,
    [badgeLandTime + fps * 0.04, badgeLandTime + fps * 0.14, badgeLandTime + fps * 0.55],
    [0, 0.35, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : 0;
  const extraRing2Scale = isCritical && hasLanded ? interpolate(
    frame,
    [badgeLandTime + fps * 0.04, badgeLandTime + fps * 0.55],
    [0.5, 3.8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 0.5;

  // Underline accent draws elegantly - tighter timing
  const underlineWidth = interpolate(
    frame,
    [fps * 2.0, fps * 2.5],
    [0, 300],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const underlineOpacity = interpolate(
    frame,
    [fps * 2.0, fps * 2.3],
    [0, 0.65],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const underlineGlow = interpolate(
    frame,
    [fps * 2.2, fps * 2.7],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Tagline - final beat of anticipation - tighter timing
  const taglineOpacity = interpolate(
    frame,
    [fps * 2.45, fps * 2.75],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const taglineY = interpolate(
    frame,
    [fps * 2.45, fps * 2.85],
    [14, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Decorative side lines - frame the tagline
  const sideLineWidth = interpolate(
    frame,
    [fps * 2.6, fps * 3.0],
    [0, 70],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Calculate remaining amount for urgency display (only for critical progress)
  const targetValue = target ? parseFloat(target.replace(/[$,]/g, "")) : 50000;
  const currentValue = current ? parseFloat(current.replace(/[$,]/g, "")) : targetValue * (progress / 100);
  const remainingAmount = Math.max(0, targetValue - currentValue);

  // "Only $X to go!" - dramatic urgency counter for critical progress
  const remainingDelay = 2.85;
  const remainingOpacity = isCritical ? interpolate(
    frame,
    [remainingDelay * fps, (remainingDelay + 0.2) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : 0;
  const remainingY = interpolate(
    frame,
    [remainingDelay * fps, (remainingDelay + 0.3) * fps],
    [12, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  // Remaining amount counts DOWN dramatically
  const displayRemaining = interpolate(
    frame,
    [(remainingDelay + 0.05) * fps, (remainingDelay + 0.4) * fps],
    [remainingAmount * 1.8, remainingAmount],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3.5) }
  );
  // Remaining glow pulses with urgency
  const remainingGlow = isCritical && frame > (remainingDelay + 0.25) * fps ? interpolate(
    (frame - (remainingDelay + 0.25) * fps) % (fps * 0.8),
    [0, fps * 0.2, fps * 0.8],
    [0.7, 1.2, 0.7],
    { easing: Easing.inOut(Easing.sin) }
  ) : 0.7;

  // Screen shake effect when the "2" lands - adds weight and impact
  const shakeTime = numLandTime;
  const shakeX = frame > shakeTime && frame < shakeTime + fps * 0.18 ? interpolate(
    frame,
    [shakeTime, shakeTime + fps * 0.04, shakeTime + fps * 0.08, shakeTime + fps * 0.12, shakeTime + fps * 0.18],
    [0, 3, -2, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : 0;
  const shakeY = frame > shakeTime && frame < shakeTime + fps * 0.18 ? interpolate(
    frame,
    [shakeTime, shakeTime + fps * 0.04, shakeTime + fps * 0.08, shakeTime + fps * 0.12, shakeTime + fps * 0.18],
    [0, -2, 1, -0.5, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : 0;

  // Celebration ring on badge land - adds celebration energy
  const badgeRingOpacity = hasLanded ? interpolate(
    frame,
    [badgeLandTime, badgeLandTime + fps * 0.1, badgeLandTime + fps * 0.45],
    [0.6, 0.25, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) : 0;
  const badgeRingScale = hasLanded ? interpolate(
    frame,
    [badgeLandTime, badgeLandTime + fps * 0.45],
    [0.8, 2.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 0.8;

  return (
    <AbsoluteFill>
      <CinematicBackground accentColor="#00ff88" intensity={bgIntensity} focusY={48} urgency={urgencyFactor} />

      {/* Scanline overlay - subtle power-on aesthetic */}
      {scanlineOpacity > 0 && <ScanlineOverlay opacity={scanlineOpacity} speed={2.5} />}

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
        {/* Outermost ring - only for critical progress */}
        {isCritical && (
          <div
            style={{
              position: "absolute",
              width: 250,
              height: 250,
              borderRadius: "50%",
              border: "1px solid rgba(0, 255, 136, 0.15)",
              transform: `scale(${ring3Scale})`,
              opacity: ring3Opacity,
            }}
          />
        )}
        {/* Outer ring */}
        <div
          style={{
            position: "absolute",
            width: 210,
            height: 210,
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
            width: 185,
            height: 185,
            borderRadius: "50%",
            border: "1.5px solid rgba(0, 255, 136, 0.28)",
            transform: `scale(${ring1Scale})`,
            opacity: ring1Opacity,
            boxShadow: "0 0 12px rgba(0, 255, 136, 0.1)",
          }}
        />
      </AbsoluteFill>

      {/* Main content container with subtle shake on landing */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          opacity: darknessFade,
          transform: `translate(${shakeX}px, ${shakeY}px)`,
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
              fontSize: isImminent ? 14 : isCritical ? 13 : 12,
              fontWeight: isImminent ? 900 : isCritical ? 800 : 700,
              color: isImminent ? "#00ff88" : isCritical ? "#00ff88" : isNearComplete ? "#00ff88" : "#505050",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: isImminent ? 8 : isCritical ? 7 : 6,
              textTransform: "uppercase",
              textShadow: isImminent
                ? "0 0 35px rgba(0, 255, 136, 0.6)"
                : isCritical
                ? "0 0 25px rgba(0, 255, 136, 0.45)"
                : isNearComplete
                ? "0 0 18px rgba(0, 255, 136, 0.3)"
                : "none",
            }}
          >
            {preText}
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
                fontSize: 240,
                fontWeight: 900,
                color: "#ffffff",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -12,
                lineHeight: 0.85,
                textShadow: "0 16px 80px rgba(0, 0, 0, 0.55)",
              }}
            >
              QE
            </span>
          </div>
          {/* 2 part - slightly delayed with satisfying land pulse */}
          <div
            style={{
              opacity: numOpacity,
              transform: `scale(${numScale * numLandPulse})`,
              filter: `drop-shadow(0 0 ${glowIntensity * 0.85}px rgba(0, 255, 136, 0.5))`,
              marginLeft: -10,
            }}
          >
            <span
              style={{
                fontSize: 240,
                fontWeight: 900,
                color: "#00ff88",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -12,
                lineHeight: 0.85,
                textShadow: `0 16px 80px rgba(0, 0, 0, 0.55), 0 0 ${glowIntensity * 0.45}px rgba(0, 255, 136, 0.45)`,
              }}
            >
              2
            </span>
          </div>

          {/* Percentage badge - positioned dramatically with landing animation */}
          <div
            style={{
              position: "absolute",
              top: -20,
              right: -80,
              opacity: percentOpacity,
              transform: `scale(${percentScale * badgeLandPulse})`,
            }}
          >
            {/* Second outer celebration ring for critical progress */}
            {isCritical && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: 95,
                  height: 95,
                  borderRadius: "50%",
                  border: "1px solid rgba(0, 255, 136, 0.3)",
                  transform: `translate(-50%, -50%) scale(${extraRing2Scale})`,
                  opacity: extraRing2Opacity,
                  pointerEvents: "none",
                }}
              />
            )}
            {/* Extra celebration ring for high progress */}
            {isNearComplete && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: 88,
                  height: 88,
                  borderRadius: "50%",
                  border: `${isCritical ? 2 : 1.5}px solid rgba(0, 255, 136, ${isCritical ? 0.5 : 0.4})`,
                  transform: `translate(-50%, -50%) scale(${extraRingScale})`,
                  opacity: extraRingOpacity,
                  pointerEvents: "none",
                  boxShadow: isCritical ? "0 0 15px rgba(0, 255, 136, 0.25)" : "none",
                }}
              />
            )}
            {/* Inner celebration ring on landing */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 78,
                height: 78,
                borderRadius: "50%",
                border: `${isCritical ? 2.5 : 2}px solid rgba(0, 255, 136, ${isCritical ? 0.7 : 0.6})`,
                transform: `translate(-50%, -50%) scale(${badgeRingScale})`,
                opacity: badgeRingOpacity,
                pointerEvents: "none",
                boxShadow: isCritical ? "0 0 18px rgba(0, 255, 136, 0.35)" : "0 0 10px rgba(0, 255, 136, 0.2)",
              }}
            />
            <div
              style={{
                padding: isImminent ? "18px 28px" : isCritical ? "15px 24px" : "14px 22px",
                background: isImminent
                  ? "linear-gradient(145deg, #00ff88 0%, #00ffdd 40%, #00ffcc 70%, #00ff88 100%)"
                  : isCritical
                  ? "linear-gradient(145deg, #00ff88 0%, #00ffcc 50%, #00ff88 100%)"
                  : "linear-gradient(145deg, #00ff88 0%, #00ffbb 100%)",
                borderRadius: 40,
                boxShadow: `
                  0 ${isImminent ? 12 : isCritical ? 10 : 8}px ${isImminent ? 42 : isCritical ? 35 : 30}px rgba(0, 255, 136, ${0.4 + 0.35 * percentGlow}),
                  0 0 ${(isImminent ? 65 : isCritical ? 50 : 40) * percentGlow}px rgba(0, 255, 136, ${(isImminent ? 0.38 : isCritical ? 0.3 : 0.25) * percentGlow}),
                  inset 0 2px 0 rgba(255, 255, 255, ${isImminent ? 0.32 : isCritical ? 0.28 : 0.22})
                `,
              }}
            >
              <span
                style={{
                  fontSize: isImminent ? 38 : isCritical ? 34 : 32,
                  fontWeight: 900,
                  color: "#010101",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  letterSpacing: -1,
                  textShadow: "0 1px 0 rgba(255, 255, 255, 0.2)",
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

        {/* "Only $X to go!" urgency counter - only shows for critical progress */}
        {isCritical && (
          <div
            style={{
              opacity: remainingOpacity,
              transform: `translateY(${remainingY}px) scale(${0.98 + 0.04 * remainingGlow})`,
              marginTop: 22,
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 28px",
              background: "linear-gradient(165deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
              borderRadius: 40,
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: `0 0 ${25 * remainingGlow}px rgba(0, 255, 136, ${0.1 * remainingGlow})`,
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#555555",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              Only
            </span>
            <span
              style={{
                fontSize: 32,
                fontWeight: 900,
                color: "#00ff88",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -1.5,
                textShadow: `0 0 ${25 * remainingGlow}px rgba(0, 255, 136, ${0.5 * remainingGlow})`,
              }}
            >
              ${Math.round(displayRemaining).toLocaleString()}
            </span>
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#555555",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              to go
            </span>
          </div>
        )}
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

  // Is this a HIGH progress milestone (>90%)? Add extra urgency
  const isNearComplete = progress >= 90;
  // Even more urgent at 95%+
  const isAlmostThere = progress >= 95;
  // Critical at 98%+
  const isCritical = progress >= 98;
  // IMMINENT - 99%+ is THE moment, maximum drama
  const isImminent = progress >= 99;

  // Scene entrance with subtle scale
  const sceneOpacity = interpolate(
    frame,
    [0, fps * 0.08],
    [0, 1],
    { extrapolateRight: "clamp" }
  );
  const sceneScale = interpolate(
    frame,
    [0, fps * 0.14],
    [0.985, 1],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Ambient "tension" pulse when almost there - the whole scene subtly breathes
  // More intense for critical progress, maximum for imminent
  const tensionPulseSpeed = isImminent ? 0.5 : isCritical ? 0.65 : 0.8;
  const tensionPulseIntensity = isImminent ? 0.028 : isCritical ? 0.02 : 0.015;
  const tensionPulse = isAlmostThere && frame > fps * 1.8 ? interpolate(
    (frame - fps * 1.8) % (fps * tensionPulseSpeed),
    [0, fps * tensionPulseSpeed * 0.5, fps * tensionPulseSpeed],
    [0, tensionPulseIntensity, 0],
    { easing: Easing.inOut(Easing.sin) }
  ) : 0;

  // Header with decorative lines - pulsing indicator
  const headerOpacity = interpolate(
    frame,
    [fps * 0.03, fps * 0.22],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const headerY = interpolate(
    frame,
    [fps * 0.03, fps * 0.28],
    [14, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const lineWidth = interpolate(
    frame,
    [fps * 0.04, fps * 0.38],
    [0, 65],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Live indicator pulse - faster when near complete, even faster at critical, maximum for imminent
  const indicatorPulseSpeed = isImminent ? 0.55 : isCritical ? 0.75 : isNearComplete ? 1.0 : 1.6;
  const livePulse = frame > fps * 0.25 ? interpolate(
    (frame - fps * 0.25) % (fps * indicatorPulseSpeed),
    [0, fps * indicatorPulseSpeed * 0.25, fps * indicatorPulseSpeed],
    [0.45, 1, 0.45],
    { easing: Easing.inOut(Easing.sin) }
  ) : interpolate(frame, [fps * 0.05, fps * 0.25], [0, 0.45], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Hero percentage - dramatic entrance with weight
  const percentDelay = 0.12;
  const percentProgress = spring({
    frame: frame - percentDelay * fps,
    fps,
    config: { damping: 200, stiffness: 55, mass: 1.3 },
  });
  const percentOpacity = interpolate(
    frame,
    [percentDelay * fps, (percentDelay + 0.18) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Percentage counts up with luxurious quintic ease-out - tighter timing
  const displayPercent = interpolate(
    frame,
    [fps * 0.32, fps * 2.3],
    [0, progress],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: (t) => 1 - Math.pow(1 - t, 5),
    }
  );

  // Has the percentage finished counting?
  const hasFinishedCounting = displayPercent >= progress - 0.5;
  const countEndTime = fps * 2.3;

  // Percentage glow builds as number climbs, then BURSTS when landing - bigger burst for high progress
  const percentGlow = hasFinishedCounting ? interpolate(
    frame,
    [countEndTime - fps * 0.2, countEndTime, countEndTime + fps * 0.12, countEndTime + fps * 0.5],
    [35, 45, isImminent ? 130 : isNearComplete ? 100 : 80, isImminent ? 80 : isNearComplete ? 60 : 50],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : interpolate(
    frame,
    [fps * 0.9, fps * 2.2],
    [0, 45],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Percentage scale pulse on landing - more celebratory for high progress
  const percentLandPulse = hasFinishedCounting ? interpolate(
    frame,
    [countEndTime - fps * 0.03, countEndTime + fps * 0.1, countEndTime + fps * 0.28],
    [1, isImminent ? 1.18 : isNearComplete ? 1.12 : 1.08, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 1;

  // Percentage symbol animates slightly separately for visual interest
  const percentSymbolGlow = hasFinishedCounting ? interpolate(
    frame,
    [countEndTime, countEndTime + fps * 0.15, countEndTime + fps * 0.45],
    [0.5, 1.3, 0.85],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : interpolate(
    frame,
    [fps * 1.3, fps * 2.2],
    [0.3, 0.65],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Progress bar - smooth fill with energy - tighter timing
  const barProgress = interpolate(
    frame,
    [fps * 0.4, fps * 2.5],
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
    [fps * 0.6, fps * 2.2],
    [0, 1.4],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Leading edge particle effect - adds energy
  const edgePulse = frame > fps * 0.6 ? interpolate(
    (frame - fps * 0.6) % (fps * 0.45),
    [0, fps * 0.1, fps * 0.45],
    [0.7, 1, 0.7]
  ) : 0.7;

  // Multiple expanding ring effects for more energy - faster cycles
  const ringCycle1 = (frame - fps * 0.6) % (fps * 0.6);
  const ringCycle2 = (frame - fps * 0.6 + fps * 0.3) % (fps * 0.6);

  const ringOpacity1 = barProgress > 10 ? interpolate(
    ringCycle1,
    [0, fps * 0.08, fps * 0.45],
    [0.7, 0.25, 0],
    { extrapolateRight: "clamp" }
  ) : 0;
  const ringScale1 = interpolate(
    ringCycle1,
    [0, fps * 0.45],
    [1, 3.2],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  const ringOpacity2 = barProgress > 15 ? interpolate(
    ringCycle2,
    [0, fps * 0.08, fps * 0.45],
    [0.5, 0.16, 0],
    { extrapolateRight: "clamp" }
  ) : 0;
  const ringScale2 = interpolate(
    ringCycle2,
    [0, fps * 0.45],
    [1, 2.6],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Current amount counter - tighter timing
  const currentValue = parseFloat(current.replace(/[$,]/g, "")) || 0;
  const displayCurrent = interpolate(
    frame,
    [fps * 0.4, fps * 2.3],
    [0, currentValue],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: (t) => 1 - Math.pow(1 - t, 5),
    }
  );

  // Stats row with stagger - slide up with bounce - faster entrances
  const stat1Progress = spring({
    frame: frame - fps * 0.55,
    fps,
    config: { damping: 190, stiffness: 100 },
  });
  const stat1Opacity = interpolate(
    frame,
    [fps * 0.55, fps * 0.78],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const stat1Y = interpolate(stat1Progress, [0, 1], [22, 0]);

  const stat2Progress = spring({
    frame: frame - fps * 0.7,
    fps,
    config: { damping: 190, stiffness: 100 },
  });
  const stat2Opacity = interpolate(
    frame,
    [fps * 0.7, fps * 0.93],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const stat2Y = interpolate(stat2Progress, [0, 1], [22, 0]);

  // Current value glow intensifies and BURSTS on landing
  const currentHasLanded = displayCurrent >= currentValue - 100;
  const currentGlow = currentHasLanded ? interpolate(
    frame,
    [fps * 2.25, fps * 2.35, fps * 2.55, fps * 2.9],
    [20, 35, 55, 30],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : interpolate(
    frame,
    [fps * 1.3, fps * 2.2],
    [0, 22],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Current value scale pulse on landing - more satisfying
  const currentLandPulse = currentHasLanded ? interpolate(
    frame,
    [fps * 2.28, fps * 2.45, fps * 2.68],
    [1, 1.055, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  ) : 1;

  // Background glow intensifies as numbers climb
  const bgIntensity = interpolate(
    frame,
    [fps * 0.3, fps * 2.0],
    [0.02, 0.07],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Progress bar shimmer effect - more dramatic sweep - tighter timing
  const shimmerDelay = 0.9;
  const shimmerProgress = interpolate(
    frame,
    [shimmerDelay * fps, (shimmerDelay + 1.2) * fps],
    [-25, 125],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) }
  );
  const shimmerOpacity = interpolate(
    frame,
    [shimmerDelay * fps, (shimmerDelay + 0.2) * fps, (shimmerDelay + 0.95) * fps, (shimmerDelay + 1.2) * fps],
    [0, 0.3, 0.3, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const barWidthPx = 860; // Approximate width for particle positioning

  // Heartbeat pulse timing for high-progress dramatic effect
  const heartbeatPhase = isAlmostThere && frame > fps * 2.0 ?
    (frame - fps * 2.0) % (fps * 1.2) : 0;
  const heartbeatPulse = isAlmostThere ? interpolate(
    heartbeatPhase,
    [0, fps * 0.08, fps * 0.2, fps * 0.5, fps * 1.2],
    [0, 0.25, 0.08, 0, 0],
    { easing: Easing.out(Easing.cubic) }
  ) : 0;

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity }}>
      <CinematicBackground accentColor="#00ff88" intensity={bgIntensity} focusY={40} />

      {/* Heartbeat ambient vignette pulse when almost complete */}
      {isAlmostThere && frame > fps * 2.0 && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 60% 50% at 50% 50%, transparent 0%, transparent 70%, rgba(0, 255, 136, ${heartbeatPulse * 0.1}) 100%)`,
            pointerEvents: "none",
          }}
        />
      )}

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 60,
          transform: `scale(${sceneScale + tensionPulse})`,
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
                fontSize: isImminent ? 13 : isCritical ? 12 : 11,
                color: isNearComplete ? "#00ff88" : "#505050",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: isImminent ? 7 : isCritical ? 6.5 : isAlmostThere ? 6 : 5.5,
                textTransform: "uppercase",
                fontWeight: isImminent ? 900 : isCritical ? 800 : isAlmostThere ? 700 : 600,
                textShadow: isImminent
                  ? "0 0 32px rgba(0, 255, 136, 0.7)"
                  : isCritical
                  ? "0 0 25px rgba(0, 255, 136, 0.6)"
                  : isAlmostThere
                  ? "0 0 20px rgba(0, 255, 136, 0.5)"
                  : isNearComplete
                  ? "0 0 15px rgba(0, 255, 136, 0.3)"
                  : "none",
              }}
            >
              {isImminent ? "One Percent Away" : isCritical ? "The Final Push" : isAlmostThere ? "Almost There" : isNearComplete ? "Nearly Done" : "QE2 Progress"}
            </span>
            <div style={{ width: lineWidth, height: 1, background: "linear-gradient(90deg, rgba(0,255,136,0.28), transparent)" }} />
          </div>

          {/* Hero percentage with landing celebration */}
          <div
            style={{
              transform: `scale(${percentProgress * percentLandPulse})`,
              opacity: percentOpacity,
              marginBottom: 45,
              filter: `drop-shadow(0 0 ${percentGlow}px rgba(0, 255, 136, 0.42))`,
              display: "flex",
              alignItems: "baseline",
            }}
          >
            <span
              style={{
                fontSize: 195,
                fontWeight: 900,
                color: "#ffffff",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -12,
                lineHeight: 1,
                textShadow: "0 12px 60px rgba(0, 0, 0, 0.5)",
              }}
            >
              {Math.round(displayPercent)}
            </span>
            <span
              style={{
                fontSize: 95,
                fontWeight: 900,
                color: "#00ff88",
                fontFamily: "system-ui, -apple-system, sans-serif",
                textShadow: `0 0 ${percentGlow * percentSymbolGlow}px rgba(0, 255, 136, 0.55)`,
                marginLeft: 5,
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
            {/* Outer anticipation glow when almost complete - pulses with urgency */}
            {isAlmostThere && barProgress > 88 && (
              <div
                style={{
                  position: "absolute",
                  top: -10,
                  left: -10,
                  right: -10,
                  bottom: -10,
                  borderRadius: 19,
                  background: `radial-gradient(ellipse 100% 250% at ${barProgress}% 50%, rgba(0, 255, 136, ${isCritical ? 0.12 : 0.08} + ${tensionPulse * 2.5}) 0%, transparent 55%)`,
                  pointerEvents: "none",
                }}
              />
            )}
            {/* Track */}
            <div
              style={{
                width: "100%",
                height: isImminent ? 22 : isCritical ? 20 : 18,
                background: "linear-gradient(180deg, rgba(255, 255, 255, 0.012) 0%, rgba(255, 255, 255, 0.035) 100%)",
                borderRadius: isImminent ? 11 : isCritical ? 10 : 9,
                overflow: "visible",
                position: "relative",
                border: isImminent
                  ? `2px solid rgba(0, 255, 136, ${0.18 + tensionPulse * 5})`
                  : isCritical
                  ? `1.5px solid rgba(0, 255, 136, ${0.12 + tensionPulse * 4})`
                  : isAlmostThere
                  ? `1px solid rgba(0, 255, 136, ${0.08 + tensionPulse * 3})`
                  : "1px solid rgba(255, 255, 255, 0.04)",
                boxShadow: isImminent
                  ? `inset 0 2px 16px rgba(0, 0, 0, 0.4), 0 0 ${40 + tensionPulse * 150}px rgba(0, 255, 136, ${0.28 + tensionPulse * 1.5})`
                  : isCritical
                  ? `inset 0 2px 14px rgba(0, 0, 0, 0.4), 0 0 ${30 + tensionPulse * 120}px rgba(0, 255, 136, ${0.2 + tensionPulse * 1.2})`
                  : isAlmostThere
                  ? `inset 0 2px 12px rgba(0, 0, 0, 0.4), 0 0 ${25 + tensionPulse * 100}px rgba(0, 255, 136, ${0.15 + tensionPulse})`
                  : "inset 0 2px 12px rgba(0, 0, 0, 0.4)",
              }}
            >
              {/* Fill - rich gradient with inner glow */}
              <div
                style={{
                  width: `${barProgress}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, rgba(0,255,136,0.25) 0%, rgba(0,255,136,0.55) 25%, #00ff88 65%, #00ffcc 90%, #00ffdd 100%)",
                  borderRadius: 9,
                  boxShadow: `
                    0 0 ${38 * barGlow}px rgba(0, 255, 136, 0.6),
                    0 0 ${18 * barGlow}px rgba(0, 255, 136, 0.4),
                    inset 0 2px 0 rgba(255, 255, 255, 0.25),
                    inset 0 -1px 0 rgba(0, 0, 0, 0.1)
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

              {/* Electric arc sparks between bar edge and 100% marker for critical progress */}
              {isCritical && barProgress > 92 && (
                <>
                  {/* Arc 1 - vertical zigzag */}
                  <div
                    style={{
                      position: "absolute",
                      right: Math.max(2, (100 - barProgress) / 100 * barWidthPx - 4),
                      top: -8,
                      width: 2,
                      height: 16 + 8 * Math.sin(frame * 0.35),
                      background: `linear-gradient(180deg, rgba(0, 255, 136, ${0.6 + 0.4 * Math.sin(frame * 0.5)}) 0%, rgba(0, 255, 230, 0.95) 50%, rgba(0, 255, 136, ${0.6 + 0.4 * Math.cos(frame * 0.4)}) 100%)`,
                      borderRadius: 1,
                      opacity: 0.6 + 0.4 * Math.sin(frame * 0.7 + 1),
                      filter: `blur(${0.5 + 0.5 * Math.sin(frame * 0.4)}px)`,
                      boxShadow: `0 0 ${8 + 4 * Math.sin(frame * 0.6)}px rgba(0, 255, 136, 0.8)`,
                      pointerEvents: "none",
                    }}
                  />
                  {/* Arc 2 - offset timing */}
                  <div
                    style={{
                      position: "absolute",
                      right: Math.max(3, (100 - barProgress) / 100 * barWidthPx - 2),
                      bottom: -6,
                      width: 1.5,
                      height: 12 + 6 * Math.cos(frame * 0.45 + 2),
                      background: `linear-gradient(180deg, rgba(0, 212, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 50%, rgba(0, 212, 255, 0.9) 100%)`,
                      borderRadius: 1,
                      opacity: 0.5 + 0.5 * Math.sin(frame * 0.55 + 1.5),
                      filter: `blur(${0.3 + 0.3 * Math.cos(frame * 0.5)}px)`,
                      boxShadow: `0 0 ${6 + 3 * Math.cos(frame * 0.5)}px rgba(0, 212, 255, 0.7)`,
                      pointerEvents: "none",
                    }}
                  />
                  {/* Arc 3 - horizontal spark */}
                  <div
                    style={{
                      position: "absolute",
                      right: Math.max(1, (100 - barProgress) / 100 * barWidthPx - 8),
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 10 + 6 * Math.sin(frame * 0.38),
                      height: 1.5,
                      background: `linear-gradient(90deg, rgba(0, 255, 136, 0.3), rgba(255, 255, 255, ${0.85 + 0.15 * Math.sin(frame * 0.4)}), rgba(0, 255, 230, 0.6))`,
                      borderRadius: 1,
                      opacity: (frame % 8 < 5) ? 0.7 + 0.3 * Math.sin(frame * 0.8) : 0.2,
                      boxShadow: `0 0 ${5 + 3 * Math.sin(frame * 0.6)}px rgba(0, 255, 200, 0.6)`,
                      pointerEvents: "none",
                    }}
                  />
                </>
              )}

              {/* Target marker at 100% - pulses with anticipation for high progress */}
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: isAlmostThere ? -16 : -12,
                  bottom: isAlmostThere ? -16 : -12,
                  width: isAlmostThere ? 4 : isNearComplete ? 3 : 2,
                  background: isAlmostThere
                    ? `linear-gradient(180deg, transparent 5%, rgba(0, 255, 136, ${0.6 + 0.3 * (Math.sin((frame - fps * 0.6) * 0.18) * 0.5 + 0.5)}) 50%, transparent 95%)`
                    : isNearComplete
                    ? `linear-gradient(180deg, transparent, rgba(0, 255, 136, ${0.4 + 0.3 * (barProgress > 50 ? Math.sin((frame - fps * 0.6) * 0.15) * 0.5 + 0.5 : 0)}), transparent)`
                    : "linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
                  borderRadius: 2,
                  boxShadow: isAlmostThere && barProgress > 90
                    ? `0 0 ${22 + 15 * (Math.sin((frame - fps * 0.6) * 0.18) * 0.5 + 0.5)}px rgba(0, 255, 136, ${0.45 + 0.25 * (Math.sin((frame - fps * 0.6) * 0.18) * 0.5 + 0.5)})`
                    : isNearComplete && barProgress > 85
                    ? `0 0 ${15 + 10 * (Math.sin((frame - fps * 0.6) * 0.15) * 0.5 + 0.5)}px rgba(0, 255, 136, ${0.3 + 0.2 * (Math.sin((frame - fps * 0.6) * 0.15) * 0.5 + 0.5)})`
                    : "none",
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
              padding: "0 25px",
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
                  fontSize: 11,
                  color: "#404040",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  letterSpacing: 5.5,
                  textTransform: "uppercase",
                  marginBottom: 14,
                  fontWeight: 600,
                }}
              >
                Distributed
              </div>
              <div
                style={{
                  fontSize: 62,
                  fontWeight: 900,
                  color: "#00ff88",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  letterSpacing: -3,
                  filter: `drop-shadow(0 0 ${currentGlow}px rgba(0, 255, 136, 0.55))`,
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
                  fontSize: 11,
                  color: "#404040",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  letterSpacing: 5.5,
                  textTransform: "uppercase",
                  marginBottom: 14,
                  fontWeight: 600,
                }}
              >
                Target
              </div>
              <div
                style={{
                  fontSize: 62,
                  fontWeight: 900,
                  color: "#4a4a4a",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  letterSpacing: -3,
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
const CTAScene: React.FC<{ nextMilestone?: string; progress?: number }> = ({ nextMilestone, progress = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Is this a HIGH progress milestone? Makes CTA more urgent
  const isNearComplete = progress >= 90;
  // Even more urgent at 95%+
  const isAlmostThere = progress >= 95;
  // Critical urgency at 98%+
  const isCritical = progress >= 98;
  // IMMINENT - 99%+ is THE moment, maximum drama
  const isImminent = progress >= 99;

  // Scene scale and fade
  const sceneFade = interpolate(
    frame,
    [0, fps * 0.08],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  // Logo entrance - hero element with powerful presence
  const logoProgress = spring({
    frame,
    fps,
    config: { damping: 190, stiffness: 75, mass: 1.1 },
  });
  const logoOpacity = interpolate(
    frame,
    [0, fps * 0.22],
    [0, 1],
    { extrapolateRight: "clamp" }
  );
  const logoScale = interpolate(logoProgress, [0, 1], [0.82, 1]);

  // Logo glow builds confidently then settles
  const logoGlow = interpolate(
    frame,
    [fps * 0.1, fps * 0.5, fps * 0.85],
    [0, 60, 50],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Dual expanding rings - creates depth and sophistication
  const ring1Opacity = interpolate(
    frame,
    [fps * 0.06, fps * 0.22, fps * 0.85, fps * 1.2],
    [0, 0.28, 0.12, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ring1Scale = interpolate(
    frame,
    [fps * 0.06, fps * 1.2],
    [0.6, 2.4],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  const ring2Opacity = interpolate(
    frame,
    [fps * 0.12, fps * 0.28, fps * 1.0, fps * 1.4],
    [0, 0.2, 0.08, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ring2Scale = interpolate(
    frame,
    [fps * 0.12, fps * 1.4],
    [0.5, 3.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Badge text varies based on progress - more urgency at higher %
  const badgeText = isImminent ? "History in the Making!" : isCritical ? "The Final Push!" : isAlmostThere ? "So Close!" : isNearComplete ? "Almost There!" : "Almost There";

  // "Almost There" / "So Close!" / "The Final Push!" / "History in the Making!" badge - builds excitement with glow - more intense for high progress
  const badgeDelay = 0.22;
  const badgeProgress = spring({
    frame: frame - badgeDelay * fps,
    fps,
    config: { damping: isImminent ? 100 : isCritical ? 120 : isNearComplete ? 150 : 170, stiffness: isImminent ? 240 : isCritical ? 200 : isNearComplete ? 160 : 130 },
  });
  const badgeOpacity = interpolate(
    frame,
    [badgeDelay * fps, (badgeDelay + 0.16) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const badgeY = interpolate(badgeProgress, [0, 1], [16, 0]);
  const badgeScale = interpolate(badgeProgress, [0, 1], [isImminent ? 0.75 : isCritical ? 0.8 : isNearComplete ? 0.85 : 0.9, 1]);

  // Badge glow pulses more energetically for high progress
  const badgeGlow = interpolate(
    frame,
    [(badgeDelay + 0.1) * fps, fps * 0.85],
    [0, isImminent ? 1.8 : isCritical ? 1.5 : isNearComplete ? 1.3 : 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const badgePulseSpeed = isImminent ? 0.9 : isCritical ? 1.1 : isNearComplete ? 1.4 : 2.0;
  const badgePulse = frame > fps * 0.8 ? interpolate(
    (frame - fps * 0.8) % (fps * badgePulseSpeed),
    [0, fps * badgePulseSpeed * 0.5, fps * badgePulseSpeed],
    [isImminent ? 0.88 : isCritical ? 0.9 : 0.92, 1, isImminent ? 0.88 : isCritical ? 0.9 : 0.92],
    { easing: Easing.inOut(Easing.sin) }
  ) : 1;

  // Next milestone section - dramatic entrance
  const nextDelay = 0.42;
  const nextProgress = spring({
    frame: frame - nextDelay * fps,
    fps,
    config: { damping: 175, stiffness: 95, mass: 1.05 },
  });
  const nextOpacity = interpolate(
    frame,
    [nextDelay * fps, (nextDelay + 0.2) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const nextY = interpolate(nextProgress, [0, 1], [22, 0]);
  const nextScale = interpolate(nextProgress, [0, 1], [0.94, 1]);

  // Next milestone glow
  const nextGlow = interpolate(
    frame,
    [(nextDelay + 0.18) * fps, fps * 1.1],
    [0, 22],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Divider line draws elegantly
  const lineWidth = interpolate(
    frame,
    [fps * 0.7, fps * 1.05],
    [0, 150],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // CTA button - THE action moment with commanding presence
  const ctaDelay = 0.82;
  const ctaProgress = spring({
    frame: frame - ctaDelay * fps,
    fps,
    config: { damping: isImminent ? 130 : isCritical ? 150 : 175, stiffness: isImminent ? 130 : isCritical ? 110 : 90, mass: 1.05 },
  });
  const ctaOpacity = interpolate(
    frame,
    [ctaDelay * fps, (ctaDelay + 0.18) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ctaY = interpolate(ctaProgress, [0, 1], [28, 0]);
  const ctaScale = interpolate(ctaProgress, [0, 1], [isImminent ? 0.85 : isCritical ? 0.88 : 0.92, 1]);

  // CTA glow builds dramatically then pulses with confidence - more dramatic for critical
  const ctaGlow = interpolate(
    frame,
    [(ctaDelay + 0.1) * fps, fps * 1.5, fps * 1.9],
    [0, isImminent ? 1.7 : isCritical ? 1.4 : 1.2, isImminent ? 1.3 : isCritical ? 1.1 : 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const ctaPulseSpeed = isImminent ? 1.5 : isCritical ? 1.8 : 2.2;
  const ctaPulse = frame > fps * 1.5 ? interpolate(
    (frame - fps * 1.5) % (fps * ctaPulseSpeed),
    [0, fps * ctaPulseSpeed * 0.5, fps * ctaPulseSpeed],
    [isImminent ? 0.89 : isCritical ? 0.91 : 0.93, 1, isImminent ? 0.89 : isCritical ? 0.91 : 0.93],
    { easing: Easing.inOut(Easing.sin) }
  ) : 1;

  // Inner shine animation on CTA
  const innerPulse = frame > fps * 1.5 ? interpolate(
    (frame - fps * 1.5) % (fps * 2.0),
    [0, fps * 1.0, fps * 2.0],
    [0.18, 0.35, 0.18],
    { easing: Easing.inOut(Easing.sin) }
  ) : 0.18;

  // Bottom text - final beat with decorative lines
  const subDelay = 1.25;
  const subOpacity = interpolate(
    frame,
    [subDelay * fps, (subDelay + 0.28) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const subY = interpolate(
    frame,
    [subDelay * fps, (subDelay + 0.35) * fps],
    [12, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Decorative lines for bottom - draw outward
  const bottomLineWidth = interpolate(
    frame,
    [(subDelay + 0.08) * fps, (subDelay + 0.42) * fps],
    [0, 70],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Background glow intensifies throughout
  const bgIntensity = interpolate(
    frame,
    [0, fps * 1.4],
    [0.025, 0.06],
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

        {/* "Almost There" / "So Close!" / "The Final Push!" / "History in the Making!" badge with glow */}
        <div
          style={{
            opacity: badgeOpacity,
            transform: `translateY(${badgeY}px) scale(${badgeScale * badgePulse})`,
            padding: isImminent ? "18px 42px" : isCritical ? "16px 36px" : isAlmostThere ? "14px 32px" : isNearComplete ? "12px 28px" : "11px 24px",
            background: isImminent
              ? "linear-gradient(165deg, rgba(0, 255, 136, 0.35) 0%, rgba(0, 255, 200, 0.18) 50%, rgba(0, 255, 136, 0.12) 100%)"
              : isCritical
              ? "linear-gradient(165deg, rgba(0, 255, 136, 0.28) 0%, rgba(0, 255, 136, 0.1) 100%)"
              : isAlmostThere
              ? "linear-gradient(165deg, rgba(0, 255, 136, 0.22) 0%, rgba(0, 255, 136, 0.08) 100%)"
              : isNearComplete
              ? "linear-gradient(165deg, rgba(0, 255, 136, 0.15) 0%, rgba(0, 255, 136, 0.06) 100%)"
              : "linear-gradient(165deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 255, 136, 0.04) 100%)",
            borderRadius: 34,
            border: isImminent
              ? "3px solid rgba(0, 255, 136, 0.6)"
              : isCritical
              ? "2.5px solid rgba(0, 255, 136, 0.5)"
              : isAlmostThere
              ? "2px solid rgba(0, 255, 136, 0.4)"
              : isNearComplete
              ? "1.5px solid rgba(0, 255, 136, 0.28)"
              : "1px solid rgba(0, 255, 136, 0.18)",
            boxShadow: `0 0 ${(isImminent ? 55 : isCritical ? 42 : isAlmostThere ? 35 : isNearComplete ? 28 : 22) * badgeGlow}px rgba(0, 255, 136, ${(isImminent ? 0.32 : isCritical ? 0.25 : isAlmostThere ? 0.2 : isNearComplete ? 0.15 : 0.1) * badgeGlow})`,
          }}
        >
          <span
            style={{
              fontSize: isImminent ? 20 : isCritical ? 18 : isAlmostThere ? 16 : isNearComplete ? 14 : 12,
              fontWeight: 900,
              color: "#00ff88",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: isImminent ? 7 : isCritical ? 6 : isAlmostThere ? 5.5 : isNearComplete ? 5 : 4.5,
              textTransform: "uppercase",
              textShadow: isImminent
                ? "0 0 38px rgba(0, 255, 136, 0.75)"
                : isCritical
                ? "0 0 30px rgba(0, 255, 136, 0.65)"
                : isAlmostThere
                ? "0 0 25px rgba(0, 255, 136, 0.55)"
                : isNearComplete
                ? "0 0 15px rgba(0, 255, 136, 0.4)"
                : "none",
            }}
          >
            {badgeText}
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
            position: "relative",
          }}
        >
          {/* Pulsing energy ring behind CTA for critical/imminent progress */}
          {(isCritical || isImminent) && frame > fps * 1.2 && (
            <>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: 280,
                  height: 65,
                  borderRadius: 50,
                  border: "1.5px solid rgba(0, 255, 136, 0.25)",
                  transform: `translate(-50%, -50%) scale(${1 + 0.15 * ((frame - fps * 1.2) % (fps * 1.5) / (fps * 1.5))})`,
                  opacity: Math.max(0, 0.5 - 0.5 * ((frame - fps * 1.2) % (fps * 1.5) / (fps * 1.5))),
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: 280,
                  height: 65,
                  borderRadius: 50,
                  border: "1px solid rgba(0, 255, 136, 0.18)",
                  transform: `translate(-50%, -50%) scale(${1 + 0.12 * (((frame - fps * 1.2) + fps * 0.5) % (fps * 1.5) / (fps * 1.5))})`,
                  opacity: Math.max(0, 0.35 - 0.35 * (((frame - fps * 1.2) + fps * 0.5) % (fps * 1.5) / (fps * 1.5))),
                  pointerEvents: "none",
                }}
              />
            </>
          )}
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

  // Clean, quick fades - 0.22s for snappy but smooth transitions
  const transitionFrames = Math.round(0.22 * fps);

  return (
    <TransitionSeries>
      {/* Reveal: 3.4s - Build anticipation, deliver milestone with percentage badge */}
      <TransitionSeries.Sequence durationInFrames={Math.round(3.4 * fps)}>
        <RevealScene milestone={milestone} progress={progress} current={current} target={target} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* Progress: 4.4s - Satisfying data visualization with counting */}
      <TransitionSeries.Sequence durationInFrames={Math.round(4.4 * fps)}>
        <ProgressScene target={target} current={current} progress={progress} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />

      {/* CTA: 3.8s - Confident close with momentum and breathing room */}
      <TransitionSeries.Sequence durationInFrames={Math.round(3.8 * fps)}>
        <CTAScene nextMilestone={nextMilestone} progress={progress} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
