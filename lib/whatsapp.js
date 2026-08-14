/**
 * Sends a plain-text WhatsApp message via the Meta Cloud API.
 * Never throws — returns "failed" (and logs why) instead of blocking
 * whatever called it, exactly like the original PHP includes/whatsapp.php.
 */
export async function sendWhatsApp(toNumber, message) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneId || token.startsWith("PLACEHOLDER")) {
    console.log("[whatsapp] WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID not set");
    return { status: "failed", messageId: null };
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v20.0/${phoneId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: toNumber.replace(/[^\d+]/g, ""),
          type: "text",
          text: { body: message },
        }),
      }
    );

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.log(`[whatsapp] send failed: ${res.status} ${body}`);
      return { status: "failed", messageId: null };
    }

    const data = await res.json().catch(() => ({}));
    const messageId = data?.messages?.[0]?.id || null;
    return { status: "sent", messageId };
  } catch (err) {
    console.log(`[whatsapp] send error: ${err.message}`);
    return { status: "failed", messageId: null };
  }
}
