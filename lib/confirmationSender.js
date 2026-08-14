import { getAppointmentById, updateAppointment, getDueAppointments } from "./db";
import { sendWhatsApp } from "./whatsapp";
import { sendSms } from "./sms";
import { sendEmail, appointmentPatientEmailHtml } from "./email";

/**
 * Sends the "your appointment is confirmed" message to one patient and
 * records the outcome. Safe to call more than once for the same
 * appointment — if confirmationSent is already true, it's a no-op.
 */
export async function sendPatientConfirmation(appointmentId) {
  const appt = await getAppointmentById(appointmentId);

  if (!appt || appt.confirmationSent) {
    return null; // already handled, or doesn't exist
  }

  const message =
    `Hi ${appt.name}, this is Rehman Homoeopathic Clinic & Store. ` +
    `Your appointment request for ${appt.preferredDate} is confirmed. ` +
    `We look forward to seeing you. For queries call/WhatsApp +92 333 4227123.`;

  const whatsappResult = await sendWhatsApp(appt.phone, message);
  const whatsappStatus = whatsappResult.status;

  // WhatsApp failure triggers an SMS fallback attempt (matches the
  // original spec) — only relevant once real WhatsApp credentials are in
  // place, since with placeholders both will report "failed".
  let smsStatus = "not_applicable";
  if (whatsappStatus !== "sent") {
    smsStatus = await sendSms(appt.phone, message);
  }

  // Email confirmation is only ever attempted if the patient gave one.
  let emailStatus = "not_applicable";
  if (appt.email) {
    emailStatus = await sendEmail(
      appt.email,
      "Your appointment is confirmed — Rehman Homoeopathic Clinic",
      appointmentPatientEmailHtml({
        name: appt.name,
        preferredDate: appt.preferredDate,
      })
    );
  }

  await updateAppointment(appointmentId, {
    confirmationSent: true,
    patientWhatsappStatus: whatsappStatus,
    patientWhatsappMessageId: whatsappResult.messageId,
    patientSmsStatus: smsStatus,
    patientEmailStatus: emailStatus,
    status: "confirmed",
  });

  return { whatsappStatus, smsStatus, emailStatus };
}

/**
 * Processes every appointment whose 2-minute delay has already elapsed
 * and that hasn't been confirmed yet. Used by both the cron route and
 * the opportunistic sweep.
 */
export async function processDueConfirmations() {
  const due = await getDueAppointments();

  let processed = 0;
  for (const appt of due) {
    const result = await sendPatientConfirmation(appt.id);
    if (result) processed += 1;
  }
  return processed;
}
