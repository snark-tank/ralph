use anchor_lang::prelude::*;

declare_id!("HBsfAtXFmgsr5EHDqiDJDyjuGVHhYU7ACWaEhKpVACqz");

#[program]
pub mod fed_program {
    use super::*;

    /// Initialize a new user preferences account
    pub fn initialize_user(ctx: Context<InitializeUser>) -> Result<()> {
        let user_prefs = &mut ctx.accounts.user_preferences;
        user_prefs.owner = ctx.accounts.user.key();
        user_prefs.auto_compound = false;
        user_prefs.time_lock_days = 0;
        user_prefs.lock_start = 0;
        user_prefs.enrolled_at = Clock::get()?.unix_timestamp;
        user_prefs.referrer = None;
        user_prefs.streak_count = 0;
        user_prefs.last_claim_timestamp = 0;
        user_prefs.total_claimed = 0;
        user_prefs.bump = ctx.bumps.user_preferences;

        msg!("User preferences initialized for: {:?}", ctx.accounts.user.key());
        Ok(())
    }

    /// Enroll user in auto-compound feature
    /// When enabled, USD1 distributions are automatically converted to $FED
    pub fn enroll_auto_compound(ctx: Context<UpdateUserPreferences>, enabled: bool) -> Result<()> {
        let user_prefs = &mut ctx.accounts.user_preferences;
        user_prefs.auto_compound = enabled;

        if enabled {
            msg!("Auto-compound ENABLED for user: {:?}", ctx.accounts.user.key());
        } else {
            msg!("Auto-compound DISABLED for user: {:?}", ctx.accounts.user.key());
        }

        emit!(AutoCompoundToggled {
            user: ctx.accounts.user.key(),
            enabled,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// Set a time lock on tokens for bonus multipliers
    /// Longer locks = higher multipliers on distributions
    /// Valid lock periods: 7, 30, 90, 180, 365 days
    pub fn set_time_lock(ctx: Context<UpdateUserPreferences>, days: u16) -> Result<()> {
        // Validate lock period
        require!(
            days == 0 || days == 7 || days == 30 || days == 90 || days == 180 || days == 365,
            FedError::InvalidLockPeriod
        );

        let user_prefs = &mut ctx.accounts.user_preferences;
        let current_time = Clock::get()?.unix_timestamp;

        // Check if user has an active lock that hasn't expired
        if user_prefs.time_lock_days > 0 && user_prefs.lock_start > 0 {
            let lock_end = user_prefs.lock_start + (user_prefs.time_lock_days as i64 * 86400);
            require!(
                current_time >= lock_end,
                FedError::LockNotExpired
            );
        }

        user_prefs.time_lock_days = days;
        user_prefs.lock_start = if days > 0 { current_time } else { 0 };

        let multiplier = get_lock_multiplier(days);

        msg!(
            "Time lock set: {} days ({:.1}x multiplier) for user: {:?}",
            days,
            multiplier as f64 / 100.0,
            ctx.accounts.user.key()
        );

        emit!(TimeLockSet {
            user: ctx.accounts.user.key(),
            days,
            lock_start: user_prefs.lock_start,
            multiplier,
            timestamp: current_time,
        });

        Ok(())
    }

    /// Register a referral relationship
    /// Referrer earns bonus on referee's distributions
    pub fn register_referral(ctx: Context<RegisterReferral>) -> Result<()> {
        let referee_prefs = &mut ctx.accounts.referee_preferences;

        // Can only set referrer once
        require!(
            referee_prefs.referrer.is_none(),
            FedError::ReferrerAlreadySet
        );

        // Cannot refer yourself
        require!(
            ctx.accounts.referrer.key() != ctx.accounts.referee.key(),
            FedError::CannotReferSelf
        );

        referee_prefs.referrer = Some(ctx.accounts.referrer.key());

        msg!(
            "Referral registered: {:?} referred by {:?}",
            ctx.accounts.referee.key(),
            ctx.accounts.referrer.key()
        );

        emit!(ReferralRegistered {
            referee: ctx.accounts.referee.key(),
            referrer: ctx.accounts.referrer.key(),
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// Record a distribution claim (called by distribution script/authority)
    /// Updates streak tracking and total claimed amounts
    pub fn record_claim(
        ctx: Context<RecordClaim>,
        amount: u64,
    ) -> Result<()> {
        let user_prefs = &mut ctx.accounts.user_preferences;
        let current_time = Clock::get()?.unix_timestamp;

        // Update streak - if claimed within 48 hours of last claim, maintain streak
        // Otherwise reset to 1
        let time_since_last = current_time - user_prefs.last_claim_timestamp;
        if time_since_last <= 172800 && user_prefs.last_claim_timestamp > 0 {
            // Within 48 hours - increment streak
            user_prefs.streak_count = user_prefs.streak_count.saturating_add(1);
        } else {
            // Streak broken or first claim
            user_prefs.streak_count = 1;
        }

        user_prefs.last_claim_timestamp = current_time;
        user_prefs.total_claimed = user_prefs.total_claimed.saturating_add(amount);

        msg!(
            "Claim recorded: {} for user {:?} (streak: {})",
            amount,
            user_prefs.owner,
            user_prefs.streak_count
        );

        emit!(ClaimRecorded {
            user: user_prefs.owner,
            amount,
            streak_count: user_prefs.streak_count,
            total_claimed: user_prefs.total_claimed,
            timestamp: current_time,
        });

        Ok(())
    }

    /// Get the user's current multiplier based on all factors
    pub fn get_total_multiplier(ctx: Context<GetMultiplier>) -> Result<u16> {
        let user_prefs = &ctx.accounts.user_preferences;
        let current_time = Clock::get()?.unix_timestamp;

        // Base multiplier: 100 = 1.0x
        let mut total_multiplier: u16 = 100;

        // Time lock multiplier
        if user_prefs.time_lock_days > 0 && user_prefs.lock_start > 0 {
            let lock_end = user_prefs.lock_start + (user_prefs.time_lock_days as i64 * 86400);
            if current_time < lock_end {
                // Lock is still active
                total_multiplier = total_multiplier.saturating_add(get_lock_multiplier(user_prefs.time_lock_days) - 100);
            }
        }

        // Streak multiplier: +1% per streak, max +25%
        let streak_bonus = std::cmp::min(user_prefs.streak_count as u16, 25);
        total_multiplier = total_multiplier.saturating_add(streak_bonus);

        msg!("Total multiplier for {:?}: {}%", user_prefs.owner, total_multiplier);

        Ok(total_multiplier)
    }
}

/// Helper function to get lock multiplier
/// Returns multiplier in basis points (100 = 1.0x)
fn get_lock_multiplier(days: u16) -> u16 {
    match days {
        7 => 105,    // 1.05x
        30 => 115,   // 1.15x
        90 => 130,   // 1.30x
        180 => 150,  // 1.50x
        365 => 200,  // 2.00x
        _ => 100,    // 1.00x (no lock)
    }
}

// ============================================================================
// Account Structures
// ============================================================================

#[account]
#[derive(InitSpace)]
pub struct UserPreferences {
    /// Owner of this preferences account
    pub owner: Pubkey,
    /// Whether auto-compound is enabled (USD1 -> $FED)
    pub auto_compound: bool,
    /// Time lock period in days (0, 7, 30, 90, 180, 365)
    pub time_lock_days: u16,
    /// Unix timestamp when lock started
    pub lock_start: i64,
    /// Unix timestamp when account was created
    pub enrolled_at: i64,
    /// Referrer's public key (if any)
    pub referrer: Option<Pubkey>,
    /// Consecutive distribution claims without missing
    pub streak_count: u32,
    /// Timestamp of last claim
    pub last_claim_timestamp: i64,
    /// Total amount claimed (in base units)
    pub total_claimed: u64,
    /// PDA bump seed
    pub bump: u8,
}

// ============================================================================
// Account Contexts
// ============================================================================

#[derive(Accounts)]
pub struct InitializeUser<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + UserPreferences::INIT_SPACE,
        seeds = [b"user_prefs", user.key().as_ref()],
        bump
    )]
    pub user_preferences: Account<'info, UserPreferences>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateUserPreferences<'info> {
    #[account(
        mut,
        seeds = [b"user_prefs", user.key().as_ref()],
        bump = user_preferences.bump,
        constraint = user_preferences.owner == user.key() @ FedError::Unauthorized
    )]
    pub user_preferences: Account<'info, UserPreferences>,

    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct RegisterReferral<'info> {
    #[account(
        mut,
        seeds = [b"user_prefs", referee.key().as_ref()],
        bump = referee_preferences.bump,
        constraint = referee_preferences.owner == referee.key() @ FedError::Unauthorized
    )]
    pub referee_preferences: Account<'info, UserPreferences>,

    /// CHECK: Referrer's account - just need the pubkey
    pub referrer: AccountInfo<'info>,

    #[account(mut)]
    pub referee: Signer<'info>,
}

#[derive(Accounts)]
pub struct RecordClaim<'info> {
    #[account(
        mut,
        seeds = [b"user_prefs", user_preferences.owner.as_ref()],
        bump = user_preferences.bump,
    )]
    pub user_preferences: Account<'info, UserPreferences>,

    /// Authority that can record claims (distribution script wallet)
    #[account(mut)]
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct GetMultiplier<'info> {
    #[account(
        seeds = [b"user_prefs", user_preferences.owner.as_ref()],
        bump = user_preferences.bump,
    )]
    pub user_preferences: Account<'info, UserPreferences>,
}

// ============================================================================
// Events
// ============================================================================

#[event]
pub struct AutoCompoundToggled {
    pub user: Pubkey,
    pub enabled: bool,
    pub timestamp: i64,
}

#[event]
pub struct TimeLockSet {
    pub user: Pubkey,
    pub days: u16,
    pub lock_start: i64,
    pub multiplier: u16,
    pub timestamp: i64,
}

#[event]
pub struct ReferralRegistered {
    pub referee: Pubkey,
    pub referrer: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct ClaimRecorded {
    pub user: Pubkey,
    pub amount: u64,
    pub streak_count: u32,
    pub total_claimed: u64,
    pub timestamp: i64,
}

// ============================================================================
// Errors
// ============================================================================

#[error_code]
pub enum FedError {
    #[msg("Unauthorized access")]
    Unauthorized,
    #[msg("Invalid lock period. Valid periods: 0, 7, 30, 90, 180, 365 days")]
    InvalidLockPeriod,
    #[msg("Cannot modify lock until current lock expires")]
    LockNotExpired,
    #[msg("Referrer already set - cannot change")]
    ReferrerAlreadySet,
    #[msg("Cannot refer yourself")]
    CannotReferSelf,
}
