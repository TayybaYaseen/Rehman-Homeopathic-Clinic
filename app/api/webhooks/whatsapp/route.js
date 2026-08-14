import { NextResponse } from "next/server";
import crypto from "crypto";
import { getAppointmentByWhatsappMessageId, updateAppointment } from "@/lib/db";
import { sendSms } from "@/lib/sms";

// --- GET: Meta's webhook verification handshake ---------------------------
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const expected = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;

  if (mode === "subscribe" && expected && token === expected) {
    return new Response(challenge, { status: 200 });
  }
  return NextResponse.json({ success: false }, { status: 403 });
}

function verifySignature(rawBody, signatureHeader) {
  const appSecret = process.env.WHATSAPP_APP_SECRET;
  if (!appSecret) {
    // Matches the PHP version: signature checking only kicks in once
    // WHATSAPP_APP_SECRET is actually set.
    return true;
  }
  if (!signatureHeader) return false;

  const expected =
    "sha256=" +
    crypto.createHmac("sha256", appSecret).update(rawBody).digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(signatureHeader)
    );
  } catch {
    return false; // length mismatch etc.
  }
}

// --- POST: delivery-status events ------------------------------------------
export async function POST(request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-hub-signature-256");

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ success: false, message: "Invalid signature." }, { status: 401 });
  }

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON." }, { status: 400 });
  }

  try {
    const entries = payload?.entry || [];
    for (const entry of entries) {
      for (const change of entry?.changes || []) {
        const statuses = change?.value?.statuses || [];
        for (const status of statuses) {
          // status.status is one of: sent | delivered | read | failed
          // status.id is the WhatsApp message id (wamid) we stored when sending.
          if (status.status === "failed" && status.id) {
            const appt = await getAppointmentByWhatsappMessageId(status.id);
            if (appt) {
              await updateAppointment(appt.id, { patientWhatsappStatus: "failed" });

              // Fall back to SMS for this specific patient now that we
              // know for certain their WhatsApp delivery failed.
              const smsStatus = await sendSms(
                appt.phone,
                "Your appointment with Rehman Homoeopathic Clinic & Store is confirmed. For queries call/WhatsApp +92 333 4227123."
              );
              await updateAppointment(appt.id, { patientSmsStatus: smsStatus });
            }
          }
        }
      }
    }
  } catch (err) {
    console.log(`[whatsapp webhook] error: ${err.message}`);
  }

  return NextResponse.json({ success: true });
}
