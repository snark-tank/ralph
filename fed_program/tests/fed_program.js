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

  it("Sets 7-day time lock", async () => {
    const tx = await program.methods
      .setTimeLock(7)
      .accounts({
        userPreferences: userPreferencesPda,
        user: user,
      })
      .rpc();
    console.log("Set 7-day lock tx:", tx);

    // Verify
    const account = await program.account.userPreferences.fetch(userPreferencesPda);
    assert.equal(account.timeLockDays, 7);
    assert.ok(account.lockStart > 0);
    console.log("7-day time lock set!");
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
