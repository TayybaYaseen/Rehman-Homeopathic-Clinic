/**
 * Sends a plain-text SMS via Twilio. Used as a fallback when the
 * WhatsApp confirmation to the patient fails. Never throws.
 */
export async function sendSms(toNumber, message) {
  const sid = process.env.SMS_ACCOUNT_SID;
  const authToken = process.env.SMS_AUTH_TOKEN;
  const fromNumber = process.env.SMS_FROM_NUMBER;

  if (!sid || !authToken || !fromNumber || sid.startsWith("PLACEHOLDER")) {
    console.log("[sms] SMS_ACCOUNT_SID / SMS_AUTH_TOKEN / SMS_FROM_NUMBER not set");
    return "failed";
  }

  try {
    const body = new URLSearchParams({
      To: toNumber,
      From: fromNumber,
      Body: message,
    });

    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${sid}:${authToken}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      }
    );

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.log(`[sms] send failed: ${res.status} ${text}`);
      return "failed";
    }

    return "sent";
  } catch (err) {
    console.log(`[sms] send error: ${err.message}`);
    return "failed";
  }
}
