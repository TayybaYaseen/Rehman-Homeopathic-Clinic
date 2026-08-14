import { NextResponse } from "next/server";
import { insertAppointment, updateAppointment } from "@/lib/db";
import { validateAppointment } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rateLimit";
import { sendWhatsApp } from "@/lib/whatsapp";
import { sendEmail, appointmentAdminEmailHtml } from "@/lib/email";
import { maybeRunSweep } from "@/lib/sweep";

const CONFIRMATION_DELAY_SECONDS = 120; // 2 minutes

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body." },
      { status: 400 }
    );
  }

  const validation = validateAppointment(payload);
  if (!validation.ok) {
    return NextResponse.json(
      { success: false, message: validation.errors[0] },
      { status: 422 }
    );
  }

  const { name, phone, email, preferredDate, healthConcern } = validation.data;

  const rate = await checkRateLimit(phone);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        success: false,
        message:
          "You have already submitted a request recently. Please wait a few minutes before trying again.",
      },
      { status: 429 }
    );
  }

  const appointmentId = await insertAppointment({
    name,
    phone,
    email,
    preferredDate,
    healthConcern,
    delaySeconds: CONFIRMATION_DELAY_SECONDS,
  });

  // Notify the clinic admin — a provider failure here must never lose
  // the appointment, so both calls are best-effort and independent.
  const adminWhatsapp = process.env.ADMIN_WHATSAPP_NUMBER;
  const adminEmail = process.env.ADMIN_EMAIL;

  const adminWhatsappResult = adminWhatsapp
    ? await sendWhatsApp(
        adminWhatsapp,
        `New appointment request from ${name} (${phone}) for ${preferredDate}. Concern: ${healthConcern}`
      )
    : { status: "not_applicable" };

  const adminEmailStatus = adminEmail
    ? await sendEmail(
        adminEmail,
        `New appointment request — ${name}`,
        appointmentAdminEmailHtml({ name, phone, email, preferredDate, healthConcern })
      )
    : "not_applicable";

  await updateAppointment(appointmentId, {
    adminWhatsappStatus: adminWhatsappResult.status,
    adminEmailStatus,
  });

  // Convenience mechanism: opportunistically process any other
  // appointment whose 2-minute delay has already elapsed.
  await maybeRunSweep();

  return NextResponse.json({ success: true, id: appointmentId });
}
