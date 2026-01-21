'use client';

import { useMemo, useState, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import idl from './idl/fed_program.json';

const PROGRAM_ID = new PublicKey('HBsfAtXFmgsr5EHDqiDJDyjuGVHhYU7ACWaEhKpVACqz');

export interface UserPreferences {
  owner: PublicKey;
  autoCompound: boolean;
  timeLockDays: number;
  lockStart: number;
  enrolledAt: number;
  referrer: PublicKey | null;
  streakCount: number;
  lastClaimTimestamp: number;
  totalClaimed: number;
  bump: number;
}

export function useFedProgram() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const program = useMemo(() => {
    if (!wallet.publicKey || !wallet.signTransaction) return null;

    const provider = new AnchorProvider(
      connection,
      wallet as any,
      { commitment: 'confirmed' }
    );

    return new Program(idl as Idl, provider);
  }, [connection, wallet]);

  const getUserPreferencesPDA = useCallback((user: PublicKey) => {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('user_prefs'), user.toBuffer()],
      PROGRAM_ID
    )[0];
  }, []);

  const fetchUserPreferences = useCallback(async (): Promise<UserPreferences | null> => {
    if (!program || !wallet.publicKey) return null;

    try {
      const pda = getUserPreferencesPDA(wallet.publicKey);
      // Use type assertion since IDL types are dynamically generated
      const account = await (program.account as any).userPreferences.fetch(pda);
      return account as unknown as UserPreferences;
    } catch (e) {
      // Account doesn't exist yet
      return null;
    }
  }, [program, wallet.publicKey, getUserPreferencesPDA]);

  const initializeUser = useCallback(async () => {
    if (!program || !wallet.publicKey) {
      setError('Wallet not connected');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const pda = getUserPreferencesPDA(wallet.publicKey);

      await program.methods
        .initializeUser()
        .accounts({
          userPreferences: pda,
          user: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return true;
    } catch (e: any) {
      setError(e.message || 'Failed to initialize user');
      return false;
    } finally {
      setLoading(false);
    }
  }, [program, wallet.publicKey, getUserPreferencesPDA]);

  const enrollAutoCompound = useCallback(async (enabled: boolean) => {
    if (!program || !wallet.publicKey) {
      setError('Wallet not connected');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const pda = getUserPreferencesPDA(wallet.publicKey);

      await program.methods
        .enrollAutoCompound(enabled)
        .accounts({
          userPreferences: pda,
          user: wallet.publicKey,
        })
        .rpc();

      return true;
    } catch (e: any) {
      setError(e.message || 'Failed to update auto-compound');
      return false;
    } finally {
      setLoading(false);
    }
  }, [program, wallet.publicKey, getUserPreferencesPDA]);

  const setTimeLock = useCallback(async (days: number) => {
    if (!program || !wallet.publicKey) {
      setError('Wallet not connected');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const pda = getUserPreferencesPDA(wallet.publicKey);

      await program.methods
        .setTimeLock(days)
        .accounts({
          userPreferences: pda,
          user: wallet.publicKey,
        })
        .rpc();

      return true;
    } catch (e: any) {
      setError(e.message || 'Failed to set time lock');
      return false;
    } finally {
      setLoading(false);
    }
  }, [program, wallet.publicKey, getUserPreferencesPDA]);

  const registerReferral = useCallback(async (referrer: PublicKey) => {
    if (!program || !wallet.publicKey) {
      setError('Wallet not connected');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const pda = getUserPreferencesPDA(wallet.publicKey);

      await program.methods
        .registerReferral()
        .accounts({
          refereePreferences: pda,
          referrer: referrer,
          referee: wallet.publicKey,
        })
        .rpc();

      return true;
    } catch (e: any) {
      setError(e.message || 'Failed to register referral');
      return false;
    } finally {
      setLoading(false);
    }
  }, [program, wallet.publicKey, getUserPreferencesPDA]);

  return {
    program,
    loading,
    error,
    connected: !!wallet.publicKey,
    publicKey: wallet.publicKey,
    fetchUserPreferences,
    initializeUser,
    enrollAutoCompound,
    setTimeLock,
    registerReferral,
    getUserPreferencesPDA,
  };
}
