import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

// Scoped to the only two routes that actually touch Supabase: `/` (hosts the
// #admin / #questionnaire hash-gated views, which need a fresh auth cookie)
// and `/kontak` (the lead capture form). Every other route is pure marketing
// content with no auth/session dependency, so it skips this Edge Function
// entirely — cutting a round-trip of middleware execution off every
// navigation to /tantangan, /solusi, /paket, /faq, /simulator-roi, and the
// two legal pages.
export const config = {
  matcher: ["/", "/kontak"],
};
