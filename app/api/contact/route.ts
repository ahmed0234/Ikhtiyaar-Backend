import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { buildEmailHtml, type ContactFormData } from "@/lib/email-template";

/* ── Resend client (initialised once per cold start) ─────── */
const resend = new Resend(process.env.RESEND_API_KEY);

/* ── Destination — your business inbox ──────────────────── */
const BUSINESS_EMAIL = "hassankiller@gmail.com";

/* ── CORS headers ────────────────────────────────────────── */
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? "*";

const corsHeaders = {
  "Access-Control-Allow-Origin":  ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

/* ── Preflight handler ───────────────────────────────────── */
export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

/* ── Field-level validation ──────────────────────────────── */
function validateField(key: string, value: unknown): string | null {
  if (typeof value !== "string") return `${key} must be a string`;
  const v = value.trim();

  switch (key) {
    case "firstName":
    case "lastName":
      if (!v) return `${key === "firstName" ? "First" : "Last"} name is required`;
      if (v.length > 80) return `${key} is too long`;
      return null;

    case "email":
      if (!v) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Invalid email address";
      if (v.length > 254) return "Email is too long";
      return null;

    case "subject":
      if (!v) return "Subject is required";
      if (v.length > 200) return "Subject is too long";
      return null;

    case "phone":
      if (!v) return "Phone is required";
      if (v.replace(/\D/g, "").length < 7) return "Invalid phone number";
      if (v.length > 30) return "Phone number is too long";
      return null;

    case "website":
      if (v && !/^https?:\/\/.+/.test(v)) return "Website must start with http:// or https://";
      if (v.length > 500) return "Website URL is too long";
      return null;

    case "message":
      if (!v) return "Message is required";
      if (v.length < 20) return "Message must be at least 20 characters";
      if (v.length > 5000) return "Message is too long (max 5000 characters)";
      return null;

    default:
      return null;
  }
}

function validateBody(body: Record<string, unknown>): {
  data: ContactFormData | null;
  errors: Record<string, string>;
} {
  const requiredKeys = ["firstName", "lastName", "email", "subject", "phone", "message"];
  const optionalKeys = ["website"];
  const allKeys = [...requiredKeys, ...optionalKeys];

  const errors: Record<string, string> = {};

  for (const key of requiredKeys) {
    if (!(key in body)) {
      errors[key] = `${key} is required`;
    }
  }

  for (const key of allKeys) {
    if (key in body) {
      const error = validateField(key, body[key]);
      if (error) errors[key] = error;
    }
  }

  if (Object.keys(errors).length > 0) return { data: null, errors };

  const data: ContactFormData = {
    firstName: (body.firstName as string).trim(),
    lastName:  (body.lastName  as string).trim(),
    email:     (body.email     as string).trim().toLowerCase(),
    subject:   (body.subject   as string).trim(),
    phone:     (body.phone     as string).trim(),
    website:   typeof body.website === "string" ? body.website.trim() : undefined,
    message:   (body.message   as string).trim(),
  };

  return { data, errors: {} };
}

/* ── POST handler ────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  /* 1. Parse body */
  let rawBody: Record<string, unknown>;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request body. Expected JSON." },
      { status: 400, headers: corsHeaders }
    );
  }

  /* 2. Validate */
  const { data, errors } = validateBody(rawBody);

  if (!data) {
    return NextResponse.json(
      { ok: false, message: "Validation failed.", errors },
      { status: 422, headers: corsHeaders }
    );
  }

  /* 3. Guard — ensure env vars are configured */
  if (!process.env.RESEND_API_KEY) {
    console.error("[contact] RESEND_API_KEY is not set");
    return NextResponse.json(
      { ok: false, message: "Server configuration error. Please try again later." },
      { status: 500, headers: corsHeaders }
    );
  }

  if (!BUSINESS_EMAIL) {
    console.error("[contact] BUSINESS_EMAIL is not set");
    return NextResponse.json(
      { ok: false, message: "Server configuration error. Please try again later." },
      { status: 500, headers: corsHeaders }
    );
  }

  /* 4. Build and send email */
  try {
    const { error } = await resend.emails.send({
      from:     "support@ikhtiyaar.com",   // swap for your verified domain later
      to:       [BUSINESS_EMAIL],
      replyTo:  data.email,
      subject:  `New inquiry: ${data.subject} — ${data.firstName} ${data.lastName}`,
      html:     buildEmailHtml(data),
    });

    if (error) {
      console.error("[contact] Resend error:", error);
      return NextResponse.json(
        { ok: false, message: "Failed to send email. Please try again." },
        { status: 502, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { ok: true, message: "Message received. We'll be in touch soon." },
      { status: 200, headers: corsHeaders }
    );

  } catch (err) {
    console.error("[contact] Unexpected error:", err);
    return NextResponse.json(
      { ok: false, message: "An unexpected error occurred. Please try again later." },
      { status: 500, headers: corsHeaders }
    );
  }
}