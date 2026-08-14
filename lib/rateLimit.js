import { checkAndSetRateLimit } from "./db";

const WINDOW_SECONDS = 120; // block a second submission within 2 minutes

/**
 * Keyed by phone number — mirrors the original PHP file-based limiter.
 * Returns { allowed: true } or { allowed: false, retryAfterSeconds }.
 */
export async function checkRateLimit(key) {
  return checkAndSetRateLimit(key, WINDOW_SECONDS);
}
