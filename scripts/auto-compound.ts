/**
 * Auto-Compound Preference Manager for $FED
 *
 * Manages holder preferences for auto-compounding USD1 rewards back into $FED.
 * When enabled, a holder's USD1 distribution will be swapped to $FED instead.
 *
 * Features:
 * - Register/unregister addresses for auto-compound
 * - View all registered addresses
 * - Verify address ownership (future: signature verification)
 * - Statistics on auto-compound usage
 * - API-ready JSON output
 *
 * Usage:
 *   npx ts-node auto-compound.ts --register <address>     # Enable auto-compound for address
 *   npx ts-node auto-compound.ts --unregister <address>   # Disable auto-compound
 *   npx ts-node auto-compound.ts --check <address>        # Check if address is registered
 *   npx ts-node auto-compound.ts --list                   # List all registered addresses
 *   npx ts-node auto-compound.ts --stats                  # Show auto-compound statistics
 *   npx ts-node auto-compound.ts --json                   # Output as JSON
 *
 * @author Ralph, The Federal Reserve Agent
 * @version 1.0.0
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { PublicKey } from '@solana/web3.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data file for storing preferences
const PREFERENCES_FILE = path.join(__dirname, 'auto-compound-preferences.json');

// Types
interface AutoCompoundPreference {
    address: string;
    enabled: boolean;
    registeredAt: string;
    lastCompoundedAt?: string;
    totalCompounded?: number;
    compoundCount?: number;
    notes?: string;
}

interface AutoCompoundData {
    version: string;
    lastUpdated: string;
    preferences: Record<string, AutoCompoundPreference>;
    stats: {
        totalRegistered: number;
        activeCount: number;
        totalCompoundedUSD1: number;
        totalCompoundedFED: number;
        lastCompoundRun?: string;
    };
    settings: {
        minCompoundAmount: number;  // Minimum USD1 to trigger compound
        maxSlippage: number;        // Max slippage for swaps (%)
        compoundEnabled: boolean;   // Master switch for auto-compound
    };
}

// Initialize empty data structure
function initializeData(): AutoCompoundData {
    return {
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        preferences: {},
        stats: {
            totalRegistered: 0,
            activeCount: 0,
            totalCompoundedUSD1: 0,
            totalCompoundedFED: 0,
        },
        settings: {
            minCompoundAmount: 0.10,   // Minimum $0.10 USD1 to compound
            maxSlippage: 1.0,          // 1% max slippage
            compoundEnabled: true,     // System enabled by default
        }
    };
}

// Load preferences from file
function loadPreferences(): AutoCompoundData {
    try {
        if (fs.existsSync(PREFERENCES_FILE)) {
            const data = JSON.parse(fs.readFileSync(PREFERENCES_FILE, 'utf-8'));
            return data as AutoCompoundData;
        }
    } catch (error) {
        console.warn('⚠️ Could not load preferences, creating new file');
    }
    return initializeData();
}

// Save preferences to file
function savePreferences(data: AutoCompoundData): void {
    data.lastUpdated = new Date().toISOString();

    // Recalculate stats
    const prefs = Object.values(data.preferences);
    data.stats.totalRegistered = prefs.length;
    data.stats.activeCount = prefs.filter(p => p.enabled).length;

    fs.writeFileSync(PREFERENCES_FILE, JSON.stringify(data, null, 2));
}

// Validate Solana address
function isValidSolanaAddress(address: string): boolean {
    try {
        new PublicKey(address);
        return true;
    } catch {
        return false;
    }
}

// Register an address for auto-compound
function registerAddress(address: string, data: AutoCompoundData): { success: boolean; message: string } {
    if (!isValidSolanaAddress(address)) {
        return { success: false, message: 'Invalid Solana address format' };
    }

    const existing = data.preferences[address];
    if (existing && existing.enabled) {
        return { success: false, message: 'Address is already registered for auto-compound' };
    }

    data.preferences[address] = {
        address,
        enabled: true,
        registeredAt: new Date().toISOString(),
        totalCompounded: existing?.totalCompounded || 0,
        compoundCount: existing?.compoundCount || 0,
    };

    savePreferences(data);
    return { success: true, message: `Successfully registered ${address.slice(0, 8)}...${address.slice(-4)} for auto-compound` };
}

// Unregister an address from auto-compound
function unregisterAddress(address: string, data: AutoCompoundData): { success: boolean; message: string } {
    if (!isValidSolanaAddress(address)) {
        return { success: false, message: 'Invalid Solana address format' };
    }

    const existing = data.preferences[address];
    if (!existing || !existing.enabled) {
        return { success: false, message: 'Address is not registered for auto-compound' };
    }

    // Keep the record but disable it (preserve history)
    data.preferences[address].enabled = false;

    savePreferences(data);
    return { success: true, message: `Disabled auto-compound for ${address.slice(0, 8)}...${address.slice(-4)}` };
}

// Check if an address is registered
function checkAddress(address: string, data: AutoCompoundData): AutoCompoundPreference | null {
    if (!isValidSolanaAddress(address)) {
        return null;
    }
    return data.preferences[address] || null;
}

// Get all active addresses
function getActiveAddresses(data: AutoCompoundData): string[] {
    return Object.values(data.preferences)
        .filter(p => p.enabled)
        .map(p => p.address);
}

// Format duration
function formatDuration(ms: number): string {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h`;
    return '<1h';
}

// Print statistics
function printStats(data: AutoCompoundData, jsonOutput: boolean): void {
    if (jsonOutput) {
        console.log(JSON.stringify({
            stats: data.stats,
            settings: data.settings,
            lastUpdated: data.lastUpdated,
            version: data.version
        }, null, 2));
        return;
    }

    console.log('\n╔══════════════════════════════════════════════════════════════════╗');
    console.log('║               🔄 AUTO-COMPOUND STATISTICS 🔄                      ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝\n');

    console.log('📊 REGISTRATION STATS:');
    console.log(`   Total Registered:    ${data.stats.totalRegistered} addresses`);
    console.log(`   Currently Active:    ${data.stats.activeCount} addresses`);
    console.log(`   Inactive/Disabled:   ${data.stats.totalRegistered - data.stats.activeCount} addresses`);

    console.log('\n💰 COMPOUND HISTORY:');
    console.log(`   Total USD1 Compounded: $${data.stats.totalCompoundedUSD1.toFixed(2)}`);
    console.log(`   Total $FED Received:   ${data.stats.totalCompoundedFED.toLocaleString()} $FED`);
    if (data.stats.lastCompoundRun) {
        console.log(`   Last Compound Run:     ${data.stats.lastCompoundRun}`);
    }

    console.log('\n⚙️ SETTINGS:');
    console.log(`   System Enabled:      ${data.settings.compoundEnabled ? '✅ Yes' : '❌ No'}`);
    console.log(`   Min Compound Amount: $${data.settings.minCompoundAmount.toFixed(2)} USD1`);
    console.log(`   Max Slippage:        ${data.settings.maxSlippage}%`);

    console.log('\n📝 DATA:');
    console.log(`   Last Updated:        ${data.lastUpdated}`);
    console.log(`   Data Version:        ${data.version}`);
    console.log(`   File Location:       ${PREFERENCES_FILE}`);

    console.log('\n' + '═'.repeat(68));
}

// Print list of registered addresses
function printList(data: AutoCompoundData, jsonOutput: boolean): void {
    const activePrefs = Object.values(data.preferences).filter(p => p.enabled);

    if (jsonOutput) {
        console.log(JSON.stringify({
            count: activePrefs.length,
            addresses: activePrefs.map(p => ({
                address: p.address,
                registeredAt: p.registeredAt,
                totalCompounded: p.totalCompounded || 0,
                compoundCount: p.compoundCount || 0,
            }))
        }, null, 2));
        return;
    }

    console.log('\n╔══════════════════════════════════════════════════════════════════╗');
    console.log('║              📋 AUTO-COMPOUND REGISTERED ADDRESSES 📋             ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝\n');

    if (activePrefs.length === 0) {
        console.log('   No addresses registered for auto-compound yet.\n');
        console.log('   Use --register <address> to enable auto-compound for an address.');
        return;
    }

    console.log(`Found ${activePrefs.length} active registrations:\n`);
    console.log('┌────┬──────────────────────────┬────────────────┬───────────────┐');
    console.log('│ #  │ Address                  │ Registered     │ Compounded    │');
    console.log('├────┼──────────────────────────┼────────────────┼───────────────┤');

    activePrefs.forEach((pref, index) => {
        const shortAddr = `${pref.address.slice(0, 10)}...${pref.address.slice(-6)}`;
        const regDate = new Date(pref.registeredAt);
        const daysSince = Math.floor((Date.now() - regDate.getTime()) / (1000 * 60 * 60 * 24));
        const regStr = daysSince === 0 ? 'Today' : `${daysSince}d ago`;
        const compoundStr = `$${(pref.totalCompounded || 0).toFixed(2)}`;

        console.log(`│ ${(index + 1).toString().padStart(2)} │ ${shortAddr.padEnd(24)} │ ${regStr.padEnd(14)} │ ${compoundStr.padEnd(13)} │`);
    });

    console.log('└────┴──────────────────────────┴────────────────┴───────────────┘');
    console.log(`\nTotal Active: ${activePrefs.length} addresses`);
}

// Check a specific address and print info
function printAddressInfo(address: string, data: AutoCompoundData, jsonOutput: boolean): void {
    const pref = checkAddress(address, data);

    if (jsonOutput) {
        console.log(JSON.stringify({
            found: pref !== null,
            preference: pref
        }, null, 2));
        return;
    }

    console.log('\n╔══════════════════════════════════════════════════════════════════╗');
    console.log('║                  🔍 ADDRESS LOOKUP RESULT 🔍                      ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝\n');

    if (!pref) {
        console.log(`   Address: ${address.slice(0, 12)}...${address.slice(-8)}`);
        console.log(`   Status:  ❌ NOT REGISTERED for auto-compound\n`);
        console.log('   To enable auto-compound, run:');
        console.log(`   npx ts-node auto-compound.ts --register ${address}`);
        return;
    }

    console.log(`   Address:           ${address.slice(0, 12)}...${address.slice(-8)}`);
    console.log(`   Full Address:      ${address}`);
    console.log(`   Status:            ${pref.enabled ? '✅ ACTIVE' : '❌ DISABLED'}`);
    console.log(`   Registered At:     ${pref.registeredAt}`);

    if (pref.totalCompounded && pref.totalCompounded > 0) {
        console.log(`   Total Compounded:  $${pref.totalCompounded.toFixed(2)} USD1`);
        console.log(`   Compound Events:   ${pref.compoundCount || 0}`);
    }

    if (pref.lastCompoundedAt) {
        console.log(`   Last Compounded:   ${pref.lastCompoundedAt}`);
    }

    if (pref.notes) {
        console.log(`   Notes:             ${pref.notes}`);
    }
}

// Print help
function printHelp(): void {
    console.log(`
╔══════════════════════════════════════════════════════════════════╗
║             🔄 $FED AUTO-COMPOUND PREFERENCE MANAGER 🔄           ║
║                                                                  ║
║   Manage your preference for auto-compounding USD1 rewards       ║
║   back into $FED tokens instead of receiving USD1 directly.      ║
╚══════════════════════════════════════════════════════════════════╝

COMMANDS:

  --register <address>     Enable auto-compound for a wallet address
                          Your USD1 rewards will be swapped to $FED

  --unregister <address>   Disable auto-compound for a wallet address
                          You'll receive USD1 directly again

  --check <address>        Check if an address has auto-compound enabled

  --list                   List all addresses with auto-compound enabled

  --stats                  Show auto-compound system statistics

  --json                   Output results in JSON format (for API use)

  --help                   Show this help message

EXAMPLES:

  # Enable auto-compound for your wallet
  npx ts-node auto-compound.ts --register 4Br5iKfRkYMk8WMj6w8YASynuq7Eoas16rkyvWsAdL4P

  # Check your auto-compound status
  npx ts-node auto-compound.ts --check 4Br5iKfRkYMk8WMj6w8YASynuq7Eoas16rkyvWsAdL4P

  # Disable auto-compound
  npx ts-node auto-compound.ts --unregister 4Br5iKfRkYMk8WMj6w8YASynuq7Eoas16rkyvWsAdL4P

  # View all registered addresses
  npx ts-node auto-compound.ts --list

  # Get JSON output for integration
  npx ts-node auto-compound.ts --stats --json

HOW IT WORKS:

  1. Register your address with --register
  2. During distributions, instead of receiving USD1, your portion
     will be swapped to $FED via Jupiter/Meteora
  3. You receive $FED tokens, growing your position automatically
  4. Compound rewards compound! More $FED = higher tier = more rewards

BENEFITS:

  • 🔄 Automatic position growth without manual swaps
  • 💎 Compounds your tier multiplier over time
  • 💰 Reduces gas costs (one swap vs many small ones)
  • 📈 Creates $FED buy pressure (good for price)
  • 🏛️ Move up tiers faster (Citizen → Member → Director → ...)

Note: Auto-compound uses market swaps with configured slippage protection.
      Small amounts may be batched for gas efficiency.

    `);
}

// Main execution
async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
        printHelp();
        return;
    }

    const jsonOutput = args.includes('--json');
    const data = loadPreferences();

    // Handle commands
    if (args.includes('--register')) {
        const addressIndex = args.indexOf('--register') + 1;
        const address = args[addressIndex];

        if (!address || address.startsWith('-')) {
            console.error('❌ Please provide an address: --register <address>');
            process.exit(1);
        }

        const result = registerAddress(address, data);
        if (jsonOutput) {
            console.log(JSON.stringify(result, null, 2));
        } else {
            console.log(result.success ? `✅ ${result.message}` : `❌ ${result.message}`);
            if (result.success) {
                console.log('\n   Your USD1 rewards will now be auto-compounded to $FED!');
                console.log('   To disable, use --unregister <address>');
            }
        }
        return;
    }

    if (args.includes('--unregister')) {
        const addressIndex = args.indexOf('--unregister') + 1;
        const address = args[addressIndex];

        if (!address || address.startsWith('-')) {
            console.error('❌ Please provide an address: --unregister <address>');
            process.exit(1);
        }

        const result = unregisterAddress(address, data);
        if (jsonOutput) {
            console.log(JSON.stringify(result, null, 2));
        } else {
            console.log(result.success ? `✅ ${result.message}` : `❌ ${result.message}`);
            if (result.success) {
                console.log('\n   You will now receive USD1 directly from distributions.');
            }
        }
        return;
    }

    if (args.includes('--check')) {
        const addressIndex = args.indexOf('--check') + 1;
        const address = args[addressIndex];

        if (!address || address.startsWith('-')) {
            console.error('❌ Please provide an address: --check <address>');
            process.exit(1);
        }

        if (!isValidSolanaAddress(address)) {
            console.error('❌ Invalid Solana address format');
            process.exit(1);
        }

        printAddressInfo(address, data, jsonOutput);
        return;
    }

    if (args.includes('--list')) {
        printList(data, jsonOutput);
        return;
    }

    if (args.includes('--stats')) {
        printStats(data, jsonOutput);
        return;
    }

    // Unknown command
    console.error('❌ Unknown command. Use --help to see available commands.');
    process.exit(1);
}

// Export functions for use in other scripts
export {
    loadPreferences,
    savePreferences,
    registerAddress,
    unregisterAddress,
    checkAddress,
    getActiveAddresses,
};

// Export types separately for ESM compatibility
export type { AutoCompoundData, AutoCompoundPreference };

// Only run main() when executed directly, not when imported
const isMainModule = process.argv[1]?.includes('auto-compound');
if (isMainModule) {
    main().catch((error) => {
        console.error('❌ Error:', error.message);
        process.exit(1);
    });
}
