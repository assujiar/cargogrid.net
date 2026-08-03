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
};

export const toInquiry = (row: InquiryRow): Inquiry => ({
  id: row.id, name: row.name, company: row.company, role: row.role, email: row.email, phone: row.phone,
  companyType: row.company_type, shipmentVolume: row.shipment_volume, biggestPain: row.biggest_pain, status: row.status,
  createdAt: row.created_at, updatedAt: row.updated_at, lang: row.lang || undefined,
  utmSource: row.utm_source || undefined, utmMedium: row.utm_medium || undefined, utmCampaign: row.utm_campaign || undefined,
  utmTerm: row.utm_term || undefined, utmContent: row.utm_content || undefined
});
