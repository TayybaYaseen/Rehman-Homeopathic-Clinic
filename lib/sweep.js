import { getMeta, setMeta } from "./db";
import { processDueConfirmations } from "./confirmationSender";

const THROTTLE_SECONDS = 60;

/**
 * Opportunistically checks for any appointment whose 2-minute delay has
 * already elapsed and sends its confirmation, throttled to at most
 * once/minute so it's cheap to call on every appointment submission.
 *
 * This is the "works with zero cron setup" convenience mechanism.
 * The real mechanism for production is the /api/cron/send-confirmations
 * route (or scripts/send-confirmations.mjs) on a schedule — see README.
 */
export async function maybeRunSweep() {
  const last = await getMeta("lastSweep");

  if (last) {
    const elapsedSeconds = (Date.now() - new Date(last).getTime()) / 1000;
    if (elapsedSeconds < THROTTLE_SECONDS) return;
  }

  await setMeta("lastSweep", new Date().toISOString());

  try {
    await processDueConfirmations();
  } catch (err) {
    console.log(`[sweep] error: ${err.message}`);
  }
}
