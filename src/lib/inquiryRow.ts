/**
 * Shape of the `inquiries` row as PostgREST returns it, plus the camelCase
 * mapper. Lives in its own module (no runtime imports) so both the browser data
 * layer and the server-side API route can map rows without either one dragging
 * in the other's Supabase client.
 */

import type { Inquiry } from "./storage";

export type InquiryRow = {
  id: string; name: string; company: string; role: string; email: string; phone: string;
  company_type: string; shipment_volume: string; biggest_pain: string; status: Inquiry["status"];
  lang?: "id" | "en" | null; utm_source?: string | null; utm_medium?: string | null; utm_campaign?: string | null;
  utm_term?: string | null; utm_content?: string | null; created_at: string; updated_at: string;
  first_utm_source?: string | null; first_utm_medium?: string | null; first_utm_campaign?: string | null;
  click_id?: string | null; landing_page?: string | null; referrer?: string | null;
  ga_client_id?: string | null; ga_session_id?: string | null; visit_count?: number | null;
};

export const toInquiry = (row: InquiryRow): Inquiry => ({
  id: row.id, name: row.name, company: row.company, role: row.role, email: row.email, phone: row.phone,
  companyType: row.company_type, shipmentVolume: row.shipment_volume, biggestPain: row.biggest_pain, status: row.status,
  createdAt: row.created_at, updatedAt: row.updated_at, lang: row.lang || undefined,
  utmSource: row.utm_source || undefined, utmMedium: row.utm_medium || undefined, utmCampaign: row.utm_campaign || undefined,
  utmTerm: row.utm_term || undefined, utmContent: row.utm_content || undefined,
  firstUtmSource: row.first_utm_source || undefined, firstUtmMedium: row.first_utm_medium || undefined,
  firstUtmCampaign: row.first_utm_campaign || undefined, clickId: row.click_id || undefined,
  landingPage: row.landing_page || undefined, referrer: row.referrer || undefined,
  gaClientId: row.ga_client_id || undefined, gaSessionId: row.ga_session_id || undefined,
  visitCount: row.visit_count ?? undefined
});
