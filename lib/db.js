import fs from "fs";
import path from "path";

// Plain JSON-file storage — zero native dependencies, so `npm install`
// never needs a C++ build toolchain. Works out of the box on GitHub,
// Vercel, Railway, Render, a VPS, or cPanel Node hosting.
//
// Good enough for a single clinic's appointment volume. If you outgrow
// this (high concurrent traffic, multiple server instances), swap the
// functions below for a real database (Postgres, MySQL, etc.) — every
// other file in lib/ and app/api/ only calls the functions exported
// here, so that's the only file you'd need to change.

const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.cwd(), process.env.DATA_DIR)
  : path.resolve(process.cwd(), "data");

const APPOINTMENTS_FILE = path.join(DATA_DIR, "appointments.json");
const RATE_LIMITS_FILE = path.join(DATA_DIR, "rate-limits.json");
const META_FILE = path.join(DATA_DIR, "meta.json");

function ensureDataDir() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJson(file, fallback) {
  ensureDataDir();
  if (!fs.existsSync(file)) return fallback;
  try {
    const raw = fs.readFileSync(file, "utf-8");
    if (!raw.trim()) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.log(`[db] failed to read ${file}: ${err.message}`);
    return fallback;
  }
}

// Writes are atomic (write to a temp file, then rename) so a crash or a
// concurrent read can never see a half-written file.
function writeJson(file, data) {
  ensureDataDir();
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, file);
}

// A tiny in-process mutex so two requests handled by the same server
// instance can't interleave read-modify-write cycles on the same file.
let queue = Promise.resolve();
function withLock(fn) {
  const run = queue.then(fn, fn);
  queue = run.catch(() => {});
  return run;
}

// ---------------------------------------------------------------------------
// Appointments
// ---------------------------------------------------------------------------

export async function insertAppointment(fields) {
  return withLock(() => {
    const list = readJson(APPOINTMENTS_FILE, []);
    const nextId = list.length ? Math.max(...list.map((a) => a.id)) + 1 : 1;
    const now = new Date().toISOString();

    const appointment = {
      id: nextId,
      name: fields.name,
      phone: fields.phone,
      email: fields.email || null,
      preferredDate: fields.preferredDate,
      healthConcern: fields.healthConcern,
      status: "pending",

      adminWhatsappStatus: "pending",
      adminEmailStatus: "pending",

      confirmationSent: false,
      confirmationDueAt: new Date(Date.now() + fields.delaySeconds * 1000).toISOString(),

      patientWhatsappStatus: "pending",
      patientWhatsappMessageId: null,
      patientSmsStatus: "not_applicable",
      patientEmailStatus: fields.email ? "pending" : "not_applicable",

      createdAt: now,
      updatedAt: now,
    };

    list.push(appointment);
    writeJson(APPOINTMENTS_FILE, list);
    return appointment.id;
  });
}

export async function updateAppointment(id, patch) {
  return withLock(() => {
    const list = readJson(APPOINTMENTS_FILE, []);
    const idx = list.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...patch, updatedAt: new Date().toISOString() };
    writeJson(APPOINTMENTS_FILE, list);
    return list[idx];
  });
}

export async function getAppointmentById(id) {
  const list = readJson(APPOINTMENTS_FILE, []);
  return list.find((a) => a.id === id) || null;
}

export async function getAppointmentByWhatsappMessageId(messageId) {
  const list = readJson(APPOINTMENTS_FILE, []);
  return list.find((a) => a.patientWhatsappMessageId === messageId) || null;
}

export async function getDueAppointments() {
  const list = readJson(APPOINTMENTS_FILE, []);
  const now = Date.now();
  return list.filter((a) => !a.confirmationSent && new Date(a.confirmationDueAt).getTime() <= now);
}

// ---------------------------------------------------------------------------
// Rate limiting (keyed by phone number)
// ---------------------------------------------------------------------------

export async function checkAndSetRateLimit(key, windowSeconds) {
  return withLock(() => {
    const map = readJson(RATE_LIMITS_FILE, {});
    const last = map[key];
    const now = Date.now();

    if (last) {
      const elapsedSeconds = (now - new Date(last).getTime()) / 1000;
      if (elapsedSeconds < windowSeconds) {
        return { allowed: false, retryAfterSeconds: Math.ceil(windowSeconds - elapsedSeconds) };
      }
    }

    map[key] = new Date(now).toISOString();
    writeJson(RATE_LIMITS_FILE, map);
    return { allowed: true };
  });
}

// ---------------------------------------------------------------------------
// Misc key/value (used for the sweep throttle)
// ---------------------------------------------------------------------------

export async function getMeta(key) {
  const meta = readJson(META_FILE, {});
  return meta[key] ?? null;
}

export async function setMeta(key, value) {
  return withLock(() => {
    const meta = readJson(META_FILE, {});
    meta[key] = value;
    writeJson(META_FILE, meta);
  });
}
