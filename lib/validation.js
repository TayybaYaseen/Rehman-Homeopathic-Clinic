// Strip HTML tags so nothing pasted into a text field can break an
// outgoing email / WhatsApp / SMS message.
function stripTags(value) {
  return String(value ?? "").replace(/<\/?[^>]+(>|$)/g, "").trim();
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates + sanitizes an incoming appointment payload.
 * Email is optional end-to-end: "", missing, or null are all valid.
 * Returns { ok: true, data } or { ok: false, errors }.
 */
export function validateAppointment(payload) {
  const errors = [];

  const name = stripTags(payload?.name);
  const phone = stripTags(payload?.phone);
  const emailRaw = stripTags(payload?.email);
  const preferredDate = stripTags(payload?.preferredDate);
  const healthConcern = stripTags(payload?.healthConcern);

  if (!name) errors.push("Name is required.");
  if (!phone) errors.push("Phone number is required.");
  if (!preferredDate) errors.push("Preferred date is required.");
  if (!healthConcern) errors.push("Health concern is required.");

  // Email is optional — only validated when the patient actually typed one.
  let email = "";
  if (emailRaw) {
    if (!EMAIL_RE.test(emailRaw)) {
      errors.push("Please enter a valid email address, or leave it blank.");
    } else {
      email = emailRaw;
    }
  }

  if (errors.length) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: { name, phone, email, preferredDate, healthConcern },
  };
}
