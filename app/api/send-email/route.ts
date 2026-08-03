import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/src/lib/mailer";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const { to, subject, html } = await request.json();

  if (!to || !subject || !html) {
    return NextResponse.json({ error: "Missing to, subject, or html" }, { status: 400 });
  }

  const result = await sendMail({ to, subject, html });
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status || 502 });
  }

  return NextResponse.json({ ok: true });
}
