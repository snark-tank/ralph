#!/bin/bash

# =============================================================================
# Ralph Marketing Video Agent
# =============================================================================
# Runs Claude Code to continuously generate and iterate on FED marketing videos
# Usage:
#   ./ralph-remotion.sh          # Run continuous loop
#   ./ralph-remotion.sh --once   # Run single iteration
#   ./ralph-remotion.sh --render # Just render current videos
# =============================================================================

set -e

PROJECT_DIR="/home/ubuntu/keystone/ralph/fed_project"
MARKETING_DIR="$PROJECT_DIR/marketing"
RENDERS_DIR="$MARKETING_DIR/renders"
LOG_FILE="$MARKETING_DIR/ralph-video.log"

mkdir -p "$RENDERS_DIR"

# Logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Auto-commit renders to git
auto_commit() {
    cd "$PROJECT_DIR"

    # Add all marketing files (gitignore handles node_modules)
    git add marketing/

    if [[ -n $(git status --porcelain marketing/) ]]; then
        local msg="marketing: video generation $(date '+%Y-%m-%d %H:%M')"
        git commit -m "$msg

Co-Authored-By: Ralph <ralph@fed.markets>" || true
        log "Committed changes to git"
    else
        log "No changes to commit"
    fi
}

# Push to remote
push_remote() {
    cd "$PROJECT_DIR"
    log "Pushing to GitHub..."
    if git push origin main; then
        log "Pushed to remote successfully"
    else
        log "Push failed - will retry next iteration"
    fi
}

# Render all videos with timestamps
render_videos() {
    cd "$MARKETING_DIR"
    local timestamp=$(date '+%Y%m%d-%H%M')

    log "Rendering StatsUpdate..."
    npx remotion render StatsUpdate "renders/stats-$timestamp.mp4" 2>&1 | tail -3

    log "Rendering MilestoneAnnouncement..."
    npx remotion render MilestoneAnnouncement "renders/milestone-$timestamp.mp4" 2>&1 | tail -3

    log "Rendering FeatureHighlight..."
    npx remotion render FeatureHighlight "renders/feature-$timestamp.mp4" 2>&1 | tail -3

    log "All videos rendered"
}

# Run Claude agent to improve videos
run_claude_agent() {
    cd "$MARKETING_DIR"

    local PROMPT="You are Ralph, the FED marketing video agent working in $MARKETING_DIR

CRITICAL: Your goal is to create IMMACULATE, PROFESSIONAL quality videos. Think Apple keynote, Stripe demo, Linear launch video quality. NOT generic AI slop. These videos represent \$FED and must look world-class.

Your task for this iteration:
1. Review the current video code in src/videos/ - understand what exists
2. Pick ONE video to perfect (StatsUpdate, MilestoneAnnouncement, or FeatureHighlight)
3. Make SUBSTANTIAL improvements - don't just tweak, actually elevate the quality
4. Render it: npx remotion render [CompositionId] renders/[name].mp4
5. If it's not perfect yet, KEEP ITERATING on the same video. Quality > quantity.

Quality standards you MUST hit:
- Buttery smooth 60fps-feeling animations (use spring with careful damping tuning)
- Perfect timing - each element should breathe, not feel rushed or draggy
- Sophisticated color palette - dark mode with tasteful accent colors, no garish neon
- Typography that commands attention - proper hierarchy, spacing, weight
- Cinematic transitions - not cheesy fades, but purposeful motion
- The first 2 seconds must HOOK - dramatic, intriguing, professional
- Every frame should look like it belongs in a tech company's launch video

What makes videos look like AI slop (AVOID):
- Generic gradient backgrounds
- Cheesy particle effects
- Over-animated everything
- Bad timing/pacing
- Inconsistent visual language
- Looking like a template

What makes videos look professional (DO THIS):
- Restraint and intentionality in animation
- Consistent design system
- Perfect easing curves
- Breathing room between elements
- Confident, minimal aesthetic
- Motion that serves the content

Read CLAUDE.md for technical details. Take your time. Make it perfect."

    log "Running Claude Code agent..."
    echo "$PROMPT" | claude --dangerously-skip-permissions 2>&1 | tee -a "$LOG_FILE"
}

# Main continuous loop
main_loop() {
    log "=========================================="
    log "Starting Ralph Marketing Video Agent Loop"
    log "=========================================="

    local iteration=1

    while true; do
        log "=== Iteration $iteration ==="

        # Run the agent
        run_claude_agent

        # Commit and push after every iteration
        auto_commit
        push_remote

        iteration=$((iteration + 1))

        log "Sleeping 5 minutes before next iteration..."
        sleep 300
    done
}

# Handle arguments
case "${1:-}" in
    --once)
        log "Running single iteration..."
        run_claude_agent
        auto_commit
        push_remote
        log "Done!"
        ;;
    --render)
        log "Rendering all videos..."
        render_videos
        auto_commit
        ;;
    --commit)
        auto_commit
        push_remote
        ;;
    *)
        main_loop
        ;;
esac
