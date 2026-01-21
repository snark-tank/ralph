const anchor = require("@coral-xyz/anchor");
const { PublicKey, SystemProgram } = require("@solana/web3.js");
const assert = require("assert");

describe("fed_program", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.fedProgram;
  const user = provider.wallet.publicKey;

  // Derive the user preferences PDA
  const [userPreferencesPda, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("user_prefs"), user.toBuffer()],
    program.programId
  );

  it("Initializes user preferences", async () => {
    // Check if account already exists (from previous test runs)
    let existingAccount = null;
    try {
      existingAccount = await program.account.userPreferences.fetch(userPreferencesPda);
    } catch (e) {
      // Account doesn't exist, we can initialize
    }

    if (existingAccount) {
      console.log("User preferences already exist, verifying state...");
      assert.ok(existingAccount.owner.equals(user));
      console.log("User preferences verified (already initialized)!");
    } else {
      const tx = await program.methods
        .initializeUser()
        .accounts({
          userPreferences: userPreferencesPda,
          user: user,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      console.log("Initialize user tx:", tx);

      // Fetch the account and verify
      const account = await program.account.userPreferences.fetch(userPreferencesPda);
      assert.ok(account.owner.equals(user));
      assert.equal(account.autoCompound, false);
      assert.equal(account.timeLockDays, 0);
      assert.equal(account.streakCount, 0);
      assert.equal(account.referrer, null);
      console.log("User preferences initialized successfully!");
    }
  });

  it("Enables auto-compound", async () => {
    const tx = await program.methods
      .enrollAutoCompound(true)
      .accounts({
        userPreferences: userPreferencesPda,
        user: user,
      })
      .rpc();
    console.log("Enable auto-compound tx:", tx);

    // Verify
    const account = await program.account.userPreferences.fetch(userPreferencesPda);
    assert.equal(account.autoCompound, true);
    console.log("Auto-compound enabled!");
  });

  it("Disables auto-compound", async () => {
    const tx = await program.methods
      .enrollAutoCompound(false)
      .accounts({
        userPreferences: userPreferencesPda,
        user: user,
      })
      .rpc();
    console.log("Disable auto-compound tx:", tx);

    // Verify
    const account = await program.account.userPreferences.fetch(userPreferencesPda);
    assert.equal(account.autoCompound, false);
    console.log("Auto-compound disabled!");
  });

  it("Sets 7-day time lock or verifies existing lock", async () => {
    // Check current lock state
    const account = await program.account.userPreferences.fetch(userPreferencesPda);
    const currentTime = Math.floor(Date.now() / 1000);
    const lockEnd = account.lockStart.toNumber() + (account.timeLockDays * 86400);

    if (account.timeLockDays > 0 && currentTime < lockEnd) {
      // Lock is still active, just verify it
      console.log(`Active ${account.timeLockDays}-day lock found, expires in ${Math.floor((lockEnd - currentTime) / 86400)} days`);
      assert.ok(account.timeLockDays > 0);
      console.log("Time lock verified (already active)!");
    } else {
      // No lock or lock expired, set new lock
      const tx = await program.methods
        .setTimeLock(7)
        .accounts({
          userPreferences: userPreferencesPda,
          user: user,
        })
        .rpc();
      console.log("Set 7-day lock tx:", tx);

      // Verify
      const updatedAccount = await program.account.userPreferences.fetch(userPreferencesPda);
      assert.equal(updatedAccount.timeLockDays, 7);
      assert.ok(updatedAccount.lockStart.toNumber() > 0);
      console.log("7-day time lock set!");
    }
  });

  it("Fails to set invalid lock period", async () => {
    try {
      await program.methods
        .setTimeLock(15) // Invalid - not 0, 7, 30, 90, 180, or 365
        .accounts({
          userPreferences: userPreferencesPda,
          user: user,
        })
        .rpc();
      assert.fail("Should have thrown error for invalid lock period");
    } catch (err) {
      assert.ok(err.message.includes("InvalidLockPeriod") || err.toString().includes("6000"));
      console.log("Correctly rejected invalid lock period");
    }
  });

  it("Gets total multiplier", async () => {
    const multiplier = await program.methods
      .getTotalMultiplier()
      .accounts({
        userPreferences: userPreferencesPda,
      })
      .view();

    console.log("Total multiplier:", multiplier, "% (", multiplier / 100, "x)");
    // With a 7-day lock, should be at least 105 (1.05x)
    assert.ok(multiplier >= 105);
  });

  // Note: Referral test requires a second user
  it("Cannot self-refer", async () => {
    try {
      await program.methods
        .registerReferral()
        .accounts({
          refereePreferences: userPreferencesPda,
          referrer: user, // Same as referee
          referee: user,
        })
        .rpc();
      assert.fail("Should have thrown error for self-referral");
    } catch (err) {
      assert.ok(err.message.includes("CannotReferSelf") || err.toString().includes("6004"));
      console.log("Correctly rejected self-referral");
    }
  });
});
