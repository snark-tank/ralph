/**
 * Tweet Utility for Ralph - Federal Reserve Chairman
 *
 * Usage:
 *   npx tsx tweet.ts "Your tweet text here"
 *   npx tsx tweet.ts --report '{"action":"DISTRIBUTE","amount":100,"recipients":1230}'
 *   npx tsx tweet.ts --test
 *
 * Or import and use programmatically:
 *   import { sendTweet, sendThread, sendFedReport } from './tweet.ts';
 */

import { TwitterApi } from 'twitter-api-v2';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(import.meta.dirname || __dirname, '.env') });

const {
    TWITTER_API_KEY,
    TWITTER_API_SECRET,
    TWITTER_ACCESS_TOKEN,
    TWITTER_ACCESS_TOKEN_SECRET,
} = process.env;

// Validate credentials
function validateCredentials(): boolean {
    if (!TWITTER_API_KEY || !TWITTER_API_SECRET || !TWITTER_ACCESS_TOKEN || !TWITTER_ACCESS_TOKEN_SECRET) {
        console.error('❌ Missing Twitter API credentials in .env file');
        console.error('Required: TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET');
        return false;
    }
    return true;
}

// Create Twitter client
function getClient(): TwitterApi | null {
    if (!validateCredentials()) return null;

    return new TwitterApi({
        appKey: TWITTER_API_KEY!,
        appSecret: TWITTER_API_SECRET!,
        accessToken: TWITTER_ACCESS_TOKEN!,
        accessSecret: TWITTER_ACCESS_TOKEN_SECRET!,
    });
}

/**
 * Send a single tweet
 */
export async function sendTweet(text: string, replyToId?: string): Promise<string | null> {
    const client = getClient();
    if (!client) return null;

    if (text.length > 280) {
        console.warn(`⚠️ Tweet too long (${text.length} chars), truncating to 280`);
        text = text.slice(0, 277) + '...';
    }

    try {
        const options: any = {};
        if (replyToId) {
            options.reply = { in_reply_to_tweet_id: replyToId };
        }
        const tweet = await client.v2.tweet(text, options);
        console.log(`✅ Tweet posted: https://x.com/fed_USD1/status/${tweet.data.id}`);
        return tweet.data.id;
    } catch (error: any) {
        console.error('❌ Failed to post tweet:', error.message);
        if (error.data) {
            console.error('Error details:', JSON.stringify(error.data, null, 2));
        }
        return null;
    }
}

/**
 * Send a thread of tweets
 */
export async function sendThread(tweets: string[]): Promise<string[]> {
    const tweetIds: string[] = [];
    let lastId: string | undefined;

    for (const text of tweets) {
        const id = await sendTweet(text, lastId);
        if (id) {
            tweetIds.push(id);
            lastId = id;
        } else {
            console.error('❌ Thread broken - stopping');
            break;
        }
        // Small delay between tweets
        await new Promise(r => setTimeout(r, 1000));
    }

    return tweetIds;
}

export interface FedReportParams {
    action: 'DISTRIBUTE' | 'BUYBACK' | 'COLLECT_ONLY' | 'HOLD';
    amount?: number;
    recipients?: number;
    price?: number;
    priceChange1h?: number;
    priceChange24h?: number;
    totalDistributed?: number;
    reason?: string;
    txHash?: string;
    tierBreakdown?: {
        governors?: { count: number; amount: number };
        directors?: { count: number; amount: number };
        members?: { count: number; amount: number };
        citizens?: { count: number; amount: number };
    };
}

/**
 * Generate Fed Chairman report as a thread
 */
export function formatFedReport(params: FedReportParams): string[] {
    const { action, amount, recipients, price, priceChange1h, priceChange24h, totalDistributed, reason, txHash, tierBreakdown } = params;

    const tweets: string[] = [];

    // Tweet 1: Main announcement
    const actionEmoji = {
        'DISTRIBUTE': '💸',
        'BUYBACK': '🔄',
        'COLLECT_ONLY': '📥',
        'HOLD': '⏸️'
    }[action];

    const actionVerb = {
        'DISTRIBUTE': 'distributed rewards to',
        'BUYBACK': 'executed a buyback for',
        'COLLECT_ONLY': 'collected fees (holding)',
        'HOLD': 'held treasury funds'
    }[action];

    let tweet1 = `🏛️ FEDERAL RESERVE CHAIRMAN REPORT\n\n`;
    tweet1 += `${actionEmoji} The Fed has ${actionVerb}`;

    if (action === 'DISTRIBUTE' && amount && recipients) {
        tweet1 += ` ${recipients.toLocaleString()} $FED holders.\n\n`;
        tweet1 += `💵 Amount: $${amount.toFixed(2)} USD1\n`;
    } else if (action === 'BUYBACK' && amount) {
        tweet1 += ` price support.\n\n`;
        tweet1 += `💵 Buyback: $${amount.toFixed(2)} USD1 → $FED\n`;
    } else if (action === 'COLLECT_ONLY' && amount) {
        tweet1 += `\n\n💵 Collected: $${amount.toFixed(2)} USD1\n`;
    } else {
        tweet1 += `\n\n`;
    }

    if (totalDistributed) {
        tweet1 += `📈 All-time: $${totalDistributed.toLocaleString()} USD1\n`;
    }

    tweets.push(tweet1.trim());

    // Tweet 2: Market conditions + reasoning
    let tweet2 = `📊 MARKET CONDITIONS\n\n`;

    if (price) {
        tweet2 += `$FED Price: $${price.toFixed(6)}\n`;
    }
    if (priceChange1h !== undefined) {
        const arrow1h = priceChange1h >= 0 ? '📈' : '📉';
        tweet2 += `${arrow1h} 1h: ${priceChange1h >= 0 ? '+' : ''}${priceChange1h.toFixed(2)}%\n`;
    }
    if (priceChange24h !== undefined) {
        const arrow24h = priceChange24h >= 0 ? '📈' : '📉';
        tweet2 += `${arrow24h} 24h: ${priceChange24h >= 0 ? '+' : ''}${priceChange24h.toFixed(2)}%\n`;
    }

    if (reason) {
        tweet2 += `\n💭 Rationale: ${reason}\n`;
    }

    tweet2 += `\n#FED #Solana`;
    tweets.push(tweet2.trim());

    // Tweet 3 (optional): Tier breakdown
    if (tierBreakdown && action === 'DISTRIBUTE') {
        let tweet3 = `🏆 DISTRIBUTION BY TIER\n\n`;

        if (tierBreakdown.governors) {
            tweet3 += `👑 Governors (1.25x): ${tierBreakdown.governors.count} → $${tierBreakdown.governors.amount.toFixed(2)}\n`;
        }
        if (tierBreakdown.directors) {
            tweet3 += `🎖️ Directors (1.1x): ${tierBreakdown.directors.count} → $${tierBreakdown.directors.amount.toFixed(2)}\n`;
        }
        if (tierBreakdown.members) {
            tweet3 += `📊 Members (1.05x): ${tierBreakdown.members.count} → $${tierBreakdown.members.amount.toFixed(2)}\n`;
        }
        if (tierBreakdown.citizens) {
            tweet3 += `🗳️ Citizens (1x): ${tierBreakdown.citizens.count} → $${tierBreakdown.citizens.amount.toFixed(2)}\n`;
        }

        tweets.push(tweet3.trim());
    }

    // Final tweet: Links
    let finalTweet = `🔗 VERIFY ON-CHAIN\n\n`;
    if (txHash) {
        finalTweet += `TX: solscan.io/tx/${txHash.slice(0, 20)}...\n\n`;
    }
    finalTweet += `🌐 fed.markets\n`;
    finalTweet += `📊 Dashboard: fed.markets/dashboard\n\n`;
    finalTweet += `The money printer goes BRRR 🖨️💵`;

    tweets.push(finalTweet.trim());

    return tweets;
}

/**
 * Send a complete Fed Chairman report as a thread
 */
export async function sendFedReport(params: FedReportParams): Promise<string[]> {
    const tweets = formatFedReport(params);
    console.log(`\n📝 Posting ${tweets.length}-tweet thread:\n`);
    tweets.forEach((t, i) => {
        console.log(`--- Tweet ${i + 1} (${t.length}/280 chars) ---`);
        console.log(t);
        console.log('');
    });

    return sendThread(tweets);
}

// CLI usage
async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('Usage:');
        console.log('  npx tsx tweet.ts "Your tweet text"');
        console.log('  npx tsx tweet.ts --report \'{"action":"DISTRIBUTE","amount":100,"recipients":1230}\'');
        console.log('  npx tsx tweet.ts --test');
        process.exit(1);
    }

    if (args[0] === '--test') {
        const tweets = formatFedReport({
            action: 'DISTRIBUTE',
            amount: 102.06,
            recipients: 1230,
            price: 0.00042,
            priceChange1h: -1.2,
            priceChange24h: 2.5,
            totalDistributed: 32058,
            reason: 'Price stable, rewarding diamond hands',
            txHash: '4VmaSTarzJRNi6fukSCmmUn7XcG2cyvSrSrWhKCZRZ1oDKuPsNuEZzbu7J2iVj8H',
            tierBreakdown: {
                governors: { count: 19, amount: 34.36 },
                directors: { count: 161, amount: 51.71 },
                members: { count: 376, amount: 14.44 },
                citizens: { count: 718, amount: 1.55 }
            }
        });

        console.log('📝 Test Fed Chairman Report Thread (not posting):\n');
        tweets.forEach((t, i) => {
            console.log(`--- Tweet ${i + 1} (${t.length}/280 chars) ---`);
            console.log(t);
            console.log('');
        });
        return;
    }

    if (args[0] === '--report' && args[1]) {
        const params = JSON.parse(args[1]);
        await sendFedReport(params);
        return;
    }

    // Single tweet
    const tweetText = args.join(' ');
    await sendTweet(tweetText);
}

// Run if called directly
const isMainModule = process.argv[1]?.includes('tweet');
if (isMainModule) {
    main().catch(console.error);
}
