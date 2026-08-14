import { NextResponse } from "next/server";
import { processDueConfirmations } from "@/lib/confirmationSender";

// The original PHP version was CLI-only so it could never be triggered by
// an outside request. An HTTP route can always be reached, so we protect
// it with a shared secret instead — pass it as ?secret=... or as the
// `x-cron-secret` header.
function isAuthorized(request) {
  const configured = process.env.CRON_SECRET;
  if (!configured) return true; // no secret set — open (fine for local dev only)

  const header = request.headers.get("x-cron-secret");
  const query = new URL(request.url).searchParams.get("secret");
  return header === configured || query === configured;
}

async function handle(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

  const processed = await processDueConfirmations();
  return NextResponse.json({
    success: true,
    message: `Processed ${processed} due confirmation(s).`,
  });
}

export async function GET(request) {
  return handle(request);
}

export async function POST(request) {
  return handle(request);
}
