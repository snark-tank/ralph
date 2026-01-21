'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useFedProgram, UserPreferences } from '../../lib/useFedProgram';

const LOCK_OPTIONS = [
  { days: 0, label: 'No Lock', multiplier: '1.00x' },
  { days: 7, label: '7 Days', multiplier: '1.05x' },
  { days: 30, label: '30 Days', multiplier: '1.15x' },
  { days: 90, label: '90 Days', multiplier: '1.30x' },
  { days: 180, label: '180 Days', multiplier: '1.50x' },
  { days: 365, label: '365 Days', multiplier: '2.00x' },
];

export default function PreferencesPanel() {
  const { publicKey } = useWallet();
  const {
    loading,
    error,
    connected,
    fetchUserPreferences,
    initializeUser,
    enrollAutoCompound,
    setTimeLock,
  } = useFedProgram();

  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [txStatus, setTxStatus] = useState<string | null>(null);

  const loadPreferences = useCallback(async () => {
    if (!connected) return;
    const prefs = await fetchUserPreferences();
    setPreferences(prefs);
    setInitialized(prefs !== null);
  }, [connected, fetchUserPreferences]);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  const handleInitialize = async () => {
    setTxStatus('Initializing account...');
    const success = await initializeUser();
    if (success) {
      setTxStatus('Account initialized!');
      await loadPreferences();
    } else {
      setTxStatus(`Error: ${error}`);
    }
    setTimeout(() => setTxStatus(null), 3000);
  };

  const handleAutoCompound = async (enabled: boolean) => {
    setTxStatus(enabled ? 'Enabling auto-compound...' : 'Disabling auto-compound...');
    const success = await enrollAutoCompound(enabled);
    if (success) {
      setTxStatus(enabled ? 'Auto-compound enabled!' : 'Auto-compound disabled!');
      await loadPreferences();
    } else {
      setTxStatus(`Error: ${error}`);
    }
    setTimeout(() => setTxStatus(null), 3000);
  };

  const handleSetLock = async (days: number) => {
    setTxStatus(`Setting ${days} day lock...`);
    const success = await setTimeLock(days);
    if (success) {
      setTxStatus(`Lock set to ${days} days!`);
      await loadPreferences();
    } else {
      setTxStatus(`Error: ${error}`);
    }
    setTimeout(() => setTxStatus(null), 3000);
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const calculateLockEnd = () => {
    if (!preferences?.lockStart || !preferences?.timeLockDays) return null;
    const lockEnd = preferences.lockStart + (preferences.timeLockDays * 86400);
    return new Date(lockEnd * 1000);
  };

  const isLockActive = () => {
    const lockEnd = calculateLockEnd();
    if (!lockEnd) return false;
    return lockEnd > new Date();
  };

  if (!connected) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <h3 className="text-xl font-bold text-white mb-4">Your Preferences</h3>
        <p className="text-gray-400 mb-4">Connect your wallet to manage your $FED preferences on-chain.</p>
        <WalletMultiButton />
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <h3 className="text-xl font-bold text-white mb-4">Your Preferences</h3>

      {txStatus && (
        <div className={`mb-4 p-3 rounded-lg ${txStatus.includes('Error') ? 'bg-red-900/50 text-red-200' : 'bg-green-900/50 text-green-200'}`}>
          {txStatus}
        </div>
      )}

      {!initialized ? (
        <div className="text-center py-8">
          <p className="text-gray-400 mb-4">
            You haven&apos;t set up your preferences yet. Initialize your account to get started.
          </p>
          <button
            onClick={handleInitialize}
            disabled={loading}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg font-semibold text-white transition-colors"
          >
            {loading ? 'Initializing...' : 'Initialize Account'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Wallet Address */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Connected:</span>
            <span className="text-white font-mono">{publicKey?.toBase58().slice(0, 4)}...{publicKey?.toBase58().slice(-4)}</span>
          </div>

          {/* Auto-Compound Toggle */}
          <div className="border-t border-gray-800 pt-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h4 className="text-white font-semibold">Auto-Compound</h4>
                <p className="text-gray-400 text-sm">Automatically convert USD1 distributions to $FED</p>
              </div>
              <button
                onClick={() => handleAutoCompound(!preferences?.autoCompound)}
                disabled={loading}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  preferences?.autoCompound
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                {preferences?.autoCompound ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Time Lock */}
          <div className="border-t border-gray-800 pt-4">
            <h4 className="text-white font-semibold mb-2">Time Lock Commitment</h4>
            <p className="text-gray-400 text-sm mb-3">Lock for longer = higher distribution multiplier</p>

            {isLockActive() && (
              <div className="mb-3 p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg">
                <p className="text-yellow-200 text-sm">
                  Active lock: {preferences?.timeLockDays} days | Expires: {calculateLockEnd()?.toLocaleDateString()}
                </p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-2">
              {LOCK_OPTIONS.map((option) => (
                <button
                  key={option.days}
                  onClick={() => handleSetLock(option.days)}
                  disabled={loading || (isLockActive() && option.days !== 0)}
                  className={`p-3 rounded-lg text-center transition-colors ${
                    preferences?.timeLockDays === option.days
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  <div className="font-semibold">{option.label}</div>
                  <div className="text-xs text-gray-400">{option.multiplier}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="border-t border-gray-800 pt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Streak:</span>
              <span className="text-white ml-2">{preferences?.streakCount || 0} claims</span>
            </div>
            <div>
              <span className="text-gray-400">Total Claimed:</span>
              <span className="text-white ml-2">{preferences?.totalClaimed || 0}</span>
            </div>
            <div>
              <span className="text-gray-400">Enrolled:</span>
              <span className="text-white ml-2">{formatDate(preferences?.enrolledAt || 0)}</span>
            </div>
            <div>
              <span className="text-gray-400">Last Claim:</span>
              <span className="text-white ml-2">{formatDate(preferences?.lastClaimTimestamp || 0)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
