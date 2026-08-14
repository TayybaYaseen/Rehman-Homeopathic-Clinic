"use client";

import { useState } from "react";

export default function AppointmentForm() {
  const [values, setValues] = useState({
    name: "",
    phone: "",
    email: "",
    preferredDate: "",
    healthConcern: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // { message, isError } | null

  function update(field) {
    return (e) => setValues((v) => ({ ...v, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return; // guard against double-click / duplicate submits

    const payload = {
      name: values.name.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      preferredDate: values.preferredDate,
      healthConcern: values.healthConcern.trim(),
    };

    if (!payload.name || !payload.phone || !payload.preferredDate || !payload.healthConcern) {
      setStatus({
        message: "Please fill in your name, phone number, preferred date, and health concern.",
        isError: true,
      });
      return;
    }

    setSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setStatus({
          message:
            "Thank you! Your appointment request has been submitted successfully. We will contact you within 24 hours to confirm your appointment.",
          isError: false,
        });
        setValues({ name: "", phone: "", email: "", preferredDate: "", healthConcern: "" });
      } else if (res.status === 429) {
        setStatus({
          message:
            data.message ||
            "You have already submitted a request recently. Please wait a few minutes before trying again.",
          isError: true,
        });
      } else {
        setStatus({
          message:
            data.message ||
            "Sorry, something went wrong while submitting your request. Please call or WhatsApp us directly at +92 333 4227123.",
          isError: true,
        });
      }
    } catch {
      setStatus({
        message:
          "Network error. Please check your connection or WhatsApp us directly at +92 333 4227123.",
        isError: true,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="form" id="appointmentForm" noValidate onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="apName">♙ &nbsp;Full Name *</label>
        <input
          required
          name="name"
          id="apName"
          placeholder="Enter your name"
          value={values.name}
          onChange={update("name")}
        />
      </div>
      <div className="field">
        <label htmlFor="apPhone">☎ &nbsp;Phone Number *</label>
        <input
          required
          name="phone"
          id="apPhone"
          placeholder="+92 XXX XXXXXXX"
          value={values.phone}
          onChange={update("phone")}
        />
      </div>
      <div className="field">
        <label htmlFor="apEmail">✉ &nbsp;Email (Optional)</label>
        <input
          type="email"
          name="email"
          id="apEmail"
          placeholder="your@email.com"
          value={values.email}
          onChange={update("email")}
        />
      </div>
      <div className="field">
        <label htmlFor="apDate">▣ &nbsp;Preferred Date *</label>
        <input
          required
          type="date"
          name="preferredDate"
          id="apDate"
          value={values.preferredDate}
          onChange={update("preferredDate")}
        />
      </div>
      <div className="field">
        <label htmlFor="apConcern">▢ &nbsp;Health Concern *</label>
        <textarea
          required
          name="healthConcern"
          id="apConcern"
          placeholder="Briefly describe your health concern..."
          value={values.healthConcern}
          onChange={update("healthConcern")}
        />
      </div>
      <button className="submit" id="apSubmitBtn" type="submit" disabled={submitting}>
        {submitting ? "Submitting…" : "➤ \u00A0 Submit Appointment Request"}
      </button>
      {!status && (
        <p className="note" id="apNote">
          We&apos;ll contact you within 24 hours to confirm your appointment
        </p>
      )}
      {status && (
        <p
          className="note"
          id="apStatus"
          role="status"
          aria-live="polite"
          style={{ fontWeight: 700, color: status.isError ? "#ff8080" : "#7CFFB2" }}
        >
          {status.message}
        </p>
      )}
    </form>
  );
}
