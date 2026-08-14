// Standalone script — run this on a schedule (real cron, or Windows Task
// Scheduler) to send confirmations for appointments whose 2-minute delay
// has elapsed. This is the reliable, intended mechanism for production —
// equivalent to the original api/cron/send-confirmations.php.
//
// Usage:
//   node scripts/send-confirmations.mjs
//   npm run send-confirmations
//
// Loads .env.local (or .env) from the project root automatically —
// no extra dependency needed.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

function loadEnvFile(filename) {
  const filePath = path.join(rootDir, filename);
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvFile(".env");
loadEnvFile(".env.local");

process.chdir(rootDir);

const { processDueConfirmations } = await import("../lib/confirmationSender.js");

const processed = await processDueConfirmations();
console.log(`Processed ${processed} due confirmation(s).`);
process.exit(0);
