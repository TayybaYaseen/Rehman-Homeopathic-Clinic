/**
 * Sends an HTML email via the Brevo (Sendinblue) transactional email API.
 * Never throws — returns "failed" (and logs why) instead of blocking
 * whatever called it.
 */
export async function sendEmail(toEmail, subject, html) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || "Rehman Homoeopathic Clinic";

  if (!apiKey || !senderEmail || apiKey.startsWith("PLACEHOLDER")) {
    console.log("[email] BREVO_API_KEY or BREVO_SENDER_EMAIL not set");
    return "failed";
  }

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: { email: senderEmail, name: senderName },
        to: [{ email: toEmail }],
        subject,
        htmlContent: html,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.log(`[email] send failed: ${res.status} ${body}`);
      return "failed";
    }

    return "sent";
  } catch (err) {
    console.log(`[email] send error: ${err.message}`);
    return "failed";
  }
}

export function appointmentAdminEmailHtml(appt) {
  return `
    <h2>New Appointment Request</h2>
    <p><b>Name:</b> ${appt.name}</p>
    <p><b>Phone:</b> ${appt.phone}</p>
    <p><b>Email:</b> ${appt.email || "(not provided)"}</p>
    <p><b>Preferred Date:</b> ${appt.preferredDate}</p>
    <p><b>Health Concern:</b> ${appt.healthConcern}</p>
  `;
}

export function appointmentPatientEmailHtml(appt) {
  return `
    <h2>Your appointment request has been received</h2>
    <p>Dear ${appt.name},</p>
    <p>Thank you for requesting an appointment at Rehman Homoeopathic Clinic &amp; Store.
    We will contact you within 24 hours to confirm your appointment for
    <b>${appt.preferredDate}</b>.</p>
    <p>If you need to reach us sooner, WhatsApp us at
    <a href="https://wa.me/923334227123">+92 333 4227123</a>.</p>
  `;
}
