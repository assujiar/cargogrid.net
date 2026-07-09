/**
 * CargoGrid Supabase data access layer.
 * All mutable application data is read from and written to Supabase tables.
 */

import { supabase } from "./supabase";

export interface Inquiry {
  id: string;
  name: string;
  company: string;
  role: string;
  email: string;
  phone: string;
  companyType: string; // 'forwarder' | '3pl' | 'trucking' | 'inhouse' | 'other'
  shipmentVolume: string; // '<100' | '100-500' | '500-1000' | '1000+'
  biggestPain: string; // 'rfq' | 'tracking' | 'pod' | 'warehouse' | 'billing' | 'margin'
  status: 'Inquiry Masuk' | 'Draft Kuesioner' | 'Kuesioner Selesai' | 'Meeting Scheduled';
  createdAt: string;
  updatedAt: string;
  lang?: 'id' | 'en';
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}

export interface Questionnaire {
  inquiryId: string;
  // Section 1: Profil & Operasional Bisnis
  cargoTypes: string[]; // e.g. ['FCL', 'LCL', 'Bulk', 'Reefer', 'General Cargo']
  primaryRoutes: string;
  fleetSize: string;
  vendorCount: string;
  
  // Section 2: Diagnosa Kendala Utama
  painRfqDetails: string;
  painDispatchDetails: string;
  painTrackingDetails: string;
  painBillingDetails: string;
  
  // Section 3: Kebutuhan Solusi & Integrasi
  desiredModules: string[]; // e.g. ['commercial', 'ops', 'tracking', 'finance', 'warehouse']
  erpSystem: string;
  customRequirements: string;
  
  // Section 4: Preferensi Jadwal Meeting & Koordinasi
  preferredSlots: string[]; // e.g. ['Kamis, 9 Juli - Pagi', 'Jumat, 10 Juli - Siang']
  contactNotes: string;
  
  // NEW: Business Process, Expected Users, and Customer Requests
  existingCustomerFlow?: string; 
  businessProcessSop?: string;
  totalExpectedUsers?: string;
  rolesInvolved?: string[];
  topProblemImpact?: string;
  specificRequests?: string;

  isDraft: boolean;
  currentStep: number; // 1 to 4
  lastSavedAt: string;
  submittedAt?: string;
}

export interface Meeting {
  id: string;
  inquiryId: string;
  scheduledTime: string;
  meetingUrl: string;
  platform: 'Google Meet' | 'Zoom' | 'Microsoft Teams';
  adminNotes: string;
  isInvitationSent: boolean;
  createdAt: string;
}

export interface EmailLog {
  id: string;
  to: string;
  subject: string;
  htmlBody: string;
  sentAt: string;
  type: 'customer_welcome' | 'admin_alert_new' | 'admin_alert_complete' | 'customer_meeting';
}

// Default Seed Data
const DEFAULT_INQUIRIES: Inquiry[] = [
  {
    id: "inq-sinar-mas",
    name: "Andi Wijaya",
    company: "PT Sinar Mas Logistics",
    role: "VP of Supply Chain",
    email: "a.wijaya@sinarmas-logistics.com",
    phone: "08119876543",
    companyType: "3pl",
    shipmentVolume: "500-1000",
    biggestPain: "warehouse",
    status: "Draft Kuesioner",
    createdAt: "2026-07-06T10:30:00Z",
    updatedAt: "2026-07-06T14:20:00Z"
  },
  {
    id: "inq-samudera",
    name: "Joko Susilo",
    company: "PT Samudera Indonesia",
    role: "General Manager Operations",
    email: "joko.susilo@samudera.co.id",
    phone: "08122334455",
    companyType: "forwarder",
    shipmentVolume: "100-500",
    biggestPain: "rfq",
    status: "Inquiry Masuk",
    createdAt: "2026-07-07T09:15:00Z",
    updatedAt: "2026-07-07T09:15:00Z"
  },
  {
    id: "inq-astra",
    name: "Budi Santoso",
    company: "PT Astra Otoparts Tbk",
    role: "Logistics Division Head",
    email: "budi.santoso@astra-otoparts.co.id",
    phone: "081234567890",
    companyType: "inhouse",
    shipmentVolume: "1000+",
    biggestPain: "pod",
    status: "Meeting Scheduled",
    createdAt: "2026-07-05T08:00:00Z",
    updatedAt: "2026-07-06T11:00:00Z"
  }
];

const DEFAULT_QUESTIONNAIRES: Questionnaire[] = [
  {
    inquiryId: "inq-sinar-mas",
    cargoTypes: ["FCL", "Reefer", "General Cargo"],
    primaryRoutes: "Jakarta - Surabaya - Bali (Inter-island & Land)",
    fleetSize: "120 unit CDD & Fuso",
    vendorCount: "15 vendor sub-kontrak",
    painRfqDetails: "Proses penawaran harga masih manual via WhatsApp Group dan Excel, sering selisih rate ketika invoicing.",
    painDispatchDetails: "Pemberian instruksi jalan ke supir lambat karena nunggu surat jalan fisik.",
    painTrackingDetails: "",
    painBillingDetails: "",
    desiredModules: ["commercial", "ops", "warehouse"],
    erpSystem: "SAP B1",
    customRequirements: "Butuh modul rekonsiliasi kasbon supir terintegrasi langsung dengan fleet tracker.",
    preferredSlots: ["Kamis, 9 Juli 2026 (10:00 - 11:30 WIB)", "Jumat, 10 Juli 2026 (14:00 - 15:30 WIB)"],
    contactNotes: "Tolong email draf juga ke staff ops saya ryan@sinarmas-logistics.com",
    existingCustomerFlow: "Customer kirim purchase order (PO) -> Sales buat penawaran manual via excel -> Disetujui -> Tim ops cari armada vendor -> Barang dimuat -> Pengiriman jalan -> Invoice ditagih manual.",
    businessProcessSop: "SOP masih semi-formal. Pencatatan utama di spreadsheet bersama oleh tim komersial dan tim operasional logistik.",
    totalExpectedUsers: "20-50 users",
    rolesInvolved: ["sales", "ops", "finance", "warehouse"],
    topProblemImpact: "Keterlambatan penawaran harga membuat kami kehilangan sekitar 15% tender bulanan, serta kasbon supir sering bocor/selisih rekonsiliasi.",
    specificRequests: "Ingin ada dashboard real-time yang memantau margin keuntungan bersih per pengiriman (margin per job) sebelum invoice diterbitkan.",
    isDraft: true,
    currentStep: 3,
    lastSavedAt: "2026-07-06T14:20:00Z"
  },
  {
    inquiryId: "inq-astra",
    cargoTypes: ["LCL", "General Cargo", "Dangerous Goods"],
    primaryRoutes: "Jabodetabek - Karawang - Cikarang (Intra-city industrial)",
    fleetSize: "250+ truck wingbox",
    vendorCount: "45 vendor trucking aktif",
    painRfqDetails: "Sudah tersentralisasi tapi rekap harian masih makan waktu 4 jam per tim.",
    painDispatchDetails: "Kesulitan monitoring utilisasi truk yang standby di gudang supplier.",
    painTrackingDetails: "Customer sering komplain karena tidak tahu truk sudah sampai gate berapa.",
    painBillingDetails: "Keterlambatan serah terima fisik surat jalan POD mengakibatkan invoice tertahan hingga 45 hari.",
    desiredModules: ["commercial", "ops", "tracking", "finance"],
    erpSystem: "Oracle ERP Cloud",
    customRequirements: "Integrasi via REST API untuk data dispatch agar sinkron otomatis dengan manifest ERP Oracle.",
    preferredSlots: ["Rabu, 8 Juli 2026 (09:00 - 10:30 WIB)"],
    contactNotes: "Pertemuan akan dihadiri juga oleh tim IT Integration head.",
    existingCustomerFlow: "Order masuk otomatis dari sistem internal -> Dispatch admin koordinasi supir via SMS/WhatsApp -> Supir jalan membawa surat jalan rangkap 3 -> Customer tanda tangan POD -> POD fisik dikembalikan supir mingguan -> Tim Finance verifikasi POD -> Cetak & kirim invoice.",
    businessProcessSop: "Sudah memiliki sertifikasi ISO 9001 untuk manajemen mutu. Semua alur terdokumentasi rapi, namun eksekusinya masih manual di lapangan.",
    totalExpectedUsers: "100+ users",
    rolesInvolved: ["sales", "ops", "finance", "driver", "management"],
    topProblemImpact: "Penumpukan cash-flow tertunda (Outstanding Accounts Receivable) mencapai 12 Miliar Rupiah karena POD fisik lambat kembali.",
    specificRequests: "Butuh Driver App yang sangat ringan, bisa upload foto bukti surat jalan bertanda tangan (E-POD) yang langsung sinkron ke modul finance logistik.",
    isDraft: false,
    currentStep: 4,
    lastSavedAt: "2026-07-05T17:00:00Z",
    submittedAt: "2026-07-05T17:15:00Z"
  }
];

const DEFAULT_MEETINGS: Meeting[] = [
  {
    id: "meet-astra",
    inquiryId: "inq-astra",
    scheduledTime: "2026-07-08T09:00:00+07:00",
    meetingUrl: "https://meet.google.com/cgr-jfwz-dfp",
    platform: "Google Meet",
    adminNotes: "Meeting konfirmasi pilot project 30 hari. Tim IT Astra minta didemonstrasikan endpoint REST API docs.",
    isInvitationSent: true,
    createdAt: "2026-07-06T11:00:00Z"
  }
];

// Helper to generate beautifully styled HTML emails
export function generateHtmlEmailTemplate(type: EmailLog['type'], data: {
  inquiry: Inquiry;
  questionnaire?: Questionnaire;
  meeting?: Meeting;
}): string {
  const { inquiry, questionnaire, meeting } = data;
  const isEn = inquiry.lang === 'en';
  const brandTeal = "#0097b2";
  const brandOrange = "#ff5e14";
  const bgSlate = "#f8fafc";
  
  const headerHtml = `
    <div style="background-color: ${brandTeal}; padding: 24px; text-align: center; border-top-left-radius: 12px; border-top-right-radius: 12px;">
      <h1 style="color: #ffffff; margin: 0; font-family: 'Space Grotesk', 'Helvetica Neue', Arial, sans-serif; font-size: 24px; font-weight: 800; letter-spacing: -0.02em;">
        Cargo<span style="color: #ffffff;">Grid</span> <span style="font-size: 11px; font-weight: 400; letter-spacing: 0.15em; background: rgba(255,255,255,0.2); padding: 3px 8px; border-radius: 4px; vertical-align: middle; margin-left: 8px;">OPERATING SYSTEM</span>
      </h1>
    </div>
  `;

  const footerHtml = isEn ? `
    <div style="background-color: #0f172a; padding: 24px; text-align: center; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px; font-family: 'Inter', Arial, sans-serif; color: #94a3b8; font-size: 11px; line-height: 1.6;">
      <p style="margin: 0 0 8px 0; font-weight: bold; color: #ffffff;">CargoGrid Logistics Enterprise Suite</p>
      <p style="margin: 0 0 12px 0;">Sopo Del Tower 18th Fl, Mega Kuningan, Jakarta, Indonesia</p>
      <p style="margin: 0; border-top: 1px solid #334155; padding-top: 12px;">
        This email was automatically generated by the CargoGrid OS system. Please do not reply directly to this address.
      </p>
    </div>
  ` : `
    <div style="background-color: #0f172a; padding: 24px; text-align: center; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px; font-family: 'Inter', Arial, sans-serif; color: #94a3b8; font-size: 11px; line-height: 1.6;">
      <p style="margin: 0 0 8px 0; font-weight: bold; color: #ffffff;">CargoGrid Logistics Enterprise Suite</p>
      <p style="margin: 0 0 12px 0;">Sopo Del Tower Lt. 18, Mega Kuningan, Jakarta Selatan, Indonesia</p>
      <p style="margin: 0; border-top: 1px solid #334155; padding-top: 12px;">
        Email ini dikirimkan secara otomatis oleh sistem CargoGrid OS. Mohon tidak membalas langsung ke alamat ini.
      </p>
    </div>
  `;

  const containerStyle = `
    background-color: ${bgSlate}; 
    padding: 24px; 
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    color: #334155;
    line-height: 1.6;
    font-size: 14px;
    max-width: 600px;
    margin: 0 auto;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  `;

  switch (type) {
    case 'customer_welcome':
      return isEn ? `
        <div style="${containerStyle}">
          ${headerHtml}
          <div style="background-color: #ffffff; padding: 32px 24px; font-family: sans-serif;">
            <p style="font-size: 16px; font-weight: bold; margin-top: 0; color: #0f172a;">Dear ${inquiry.name},</p>
            <p style="color: #475569; margin-bottom: 24px;">
              Thank you for registering your company for the <strong>Logistics System Audit & 30-Day Working Pilot</strong> program with CargoGrid OS. Your registration has been successfully received.
            </p>
            
            <div style="background-color: #f1f5f9; border-left: 4px solid ${brandTeal}; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
              <h3 style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; tracking-wider; color: #475569;">Initial Data Summary</h3>
              <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
                <tr><td style="padding: 4px 0; color: #64748b; width: 40%;">Company:</td><td style="padding: 4px 0; font-weight: bold; color: #1e293b;">${inquiry.company}</td></tr>
                <tr><td style="padding: 4px 0; color: #64748b;">Monthly Volume:</td><td style="padding: 4px 0; font-weight: bold; color: #1e293b;">${inquiry.shipmentVolume} shipments / month</td></tr>
                <tr><td style="padding: 4px 0; color: #64748b;">Primary Challenge:</td><td style="padding: 4px 0; font-weight: bold; color: #ef4444;">${getPainLabel(inquiry.biggestPain, 'en')}</td></tr>
              </table>
            </div>

            <p style="color: #475569; margin-bottom: 24px;">
              To assist the CargoGrid Logistics Consulting team in analyzing your operational profile in depth prior to our qualification meeting, <strong>please take 5 minutes to complete the detailed requirements questionnaire</strong> via the button below:
            </p>

            <div style="text-align: center; margin: 32px 0;">
              <a href="${window.location.origin}/#questionnaire?id=${inquiry.id}" style="background-color: ${brandOrange}; color: #ffffff; padding: 14px 28px; font-weight: bold; text-decoration: none; border-radius: 9999px; font-size: 14px; display: inline-block; box-shadow: 0 4px 6px rgba(255, 94, 20, 0.25);">
                Complete Detailed Questionnaire &rarr;
              </a>
            </div>

            <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-bottom: 0;">
              The form can be saved as a <strong>Draft</strong> so you can resume editing at any time.
            </p>
          </div>
          ${footerHtml}
        </div>
      ` : `
        <div style="${containerStyle}">
          ${headerHtml}
          <div style="background-color: #ffffff; padding: 32px 24px; font-family: sans-serif;">
            <p style="font-size: 16px; font-weight: bold; margin-top: 0; color: #0f172a;">Halo Bapak/Ibu ${inquiry.name},</p>
            <p style="color: #475569; margin-bottom: 24px;">
              Terima kasih telah mengajukan registrasi untuk program <strong>Audit Sistem Logistik & Pilot Kerja 30 Hari</strong> bersama CargoGrid OS. Registrasi Anda telah kami terima dengan sukses.
            </p>
            
            <div style="background-color: #f1f5f9; border-left: 4px solid ${brandTeal}; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
              <h3 style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; tracking-wider; color: #475569;">Ringkasan Data Awal</h3>
              <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
                <tr><td style="padding: 4px 0; color: #64748b; width: 40%;">Perusahaan:</td><td style="padding: 4px 0; font-weight: bold; color: #1e293b;">${inquiry.company}</td></tr>
                <tr><td style="padding: 4px 0; color: #64748b;">Volume:</td><td style="padding: 4px 0; font-weight: bold; color: #1e293b;">${inquiry.shipmentVolume} shipment / bulan</td></tr>
                <tr><td style="padding: 4px 0; color: #64748b;">Kendala Utama:</td><td style="padding: 4px 0; font-weight: bold; color: #ef4444;">${getPainLabel(inquiry.biggestPain, 'id')}</td></tr>
              </table>
            </div>

            <p style="color: #475569; margin-bottom: 24px;">
              Untuk membantu tim Konsultan Logistik CargoGrid menganalisis profil operasional secara mendalam sebelum meeting konfirmasi, <strong>mohon luangkan waktu 5 menit untuk mengisi Formulir Kuesioner & Kebutuhan Detil</strong> melalui link tombol di bawah ini:
            </p>

            <div style="text-align: center; margin: 32px 0;">
              <a href="${window.location.origin}/#questionnaire?id=${inquiry.id}" style="background-color: ${brandOrange}; color: #ffffff; padding: 14px 28px; font-weight: bold; text-decoration: none; border-radius: 9999px; font-size: 14px; display: inline-block; box-shadow: 0 4px 6px rgba(255, 94, 20, 0.25);">
                Lengkapi Kuesioner Kebutuhan Detail &rarr;
              </a>
            </div>

            <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-bottom: 0;">
              Formulir dapat disimpan sebagai <strong>Draft</strong> untuk dilanjutkan pengisiannya secara bertahap kapan saja.
            </p>
          </div>
          ${footerHtml}
        </div>
      `;
      
    case 'admin_alert_new':
      return `
        <div style="${containerStyle}">
          <div style="background-color: #ef4444; padding: 24px; text-align: center; border-top-left-radius: 12px; border-top-right-radius: 12px;">
            <h1 style="color: #ffffff; margin: 0; font-family: sans-serif; font-size: 20px; font-weight: bold;">
              🚨 ${isEn ? "NEW SYSTEM INQUIRY RECEIVED" : "INQUIRY BARU MASUK"}
            </h1>
          </div>
          <div style="background-color: #ffffff; padding: 32px 24px; font-family: sans-serif;">
            <p style="font-size: 15px; margin-top: 0; color: #0f172a;">Yth. Supreme Admin CargoGrid,</p>
            <p style="color: #475569;">
              ${isEn ? "A new logistics prospect has registered initial system audit details via the Landing Page (English):" : "Sebuah prospek sistem logistik baru saja mendaftarkan data awal audit melalui Landing Page:"}
            </p>

            <table style="width: 100%; font-size: 13px; border-collapse: collapse; margin: 20px 0; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
              <tr style="background-color: #f8fafc;"><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-weight: bold;">${isEn ? "Contact Name" : "Nama Kontak"}</td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #1e293b;">${inquiry.name} (${inquiry.role})</td></tr>
              <tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-weight: bold;">${isEn ? "Company" : "Perusahaan"}</td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #1e293b;">${inquiry.company}</td></tr>
              <tr style="background-color: #f8fafc;"><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-weight: bold;">${isEn ? "WA / Email Info" : "Kontak WA / Email"}</td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-family: monospace; font-weight: bold; color: #1e293b;">${inquiry.phone} / ${inquiry.email}</td></tr>
              <tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-weight: bold;">${isEn ? "Logistics Sector" : "Sektor Logistik"}</td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #1e293b;">${getSektorLabel(inquiry.companyType, isEn ? 'en' : 'id')}</td></tr>
              <tr style="background-color: #f8fafc;"><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-weight: bold;">${isEn ? "Shipment Volume" : "Volume Pengiriman"}</td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #1e293b;">${inquiry.shipmentVolume} shipments / month</td></tr>
              <tr><td style="padding: 10px; color: #64748b; font-weight: bold;">${isEn ? "Core Pain Point" : "Penyebab Masalah"}</td><td style="padding: 10px; font-weight: bold; color: #ef4444;">${getPainLabel(inquiry.biggestPain, isEn ? 'en' : 'id')}</td></tr>
            </table>

            <p style="color: #475569; margin-bottom: 24px;">
              ${isEn ? "The system has sent an English detailed questionnaire email to the customer. Track their progress from the dashboard." : "Sistem telah mengirimkan email kuesioner detail ke customer secara otomatis. Pantau aktivitas prospek melalui panel kontrol admin."}
            </p>

            <div style="text-align: center; margin-top: 24px;">
              <a href="${window.location.origin}/#admin" style="background-color: #0f172a; color: #ffffff; padding: 12px 24px; font-weight: bold; text-decoration: none; border-radius: 8px; font-size: 13px; display: inline-block;">
                ${isEn ? "Open Admin Dashboard &rarr;" : "Buka Super Admin Dashboard &rarr;"}
              </a>
            </div>
          </div>
          ${footerHtml}
        </div>
      `;

    case 'admin_alert_complete':
      return `
        <div style="${containerStyle}">
          <div style="background-color: #10b981; padding: 24px; text-align: center; border-top-left-radius: 12px; border-top-right-radius: 12px;">
            <h1 style="color: #ffffff; margin: 0; font-family: sans-serif; font-size: 20px; font-weight: bold;">
              ✅ ${isEn ? "DETAILED QUESTIONNAIRE COMPLETED" : "KUESIONER KEBUTUHAN SELESAI"}
            </h1>
          </div>
          <div style="background-color: #ffffff; padding: 32px 24px; font-family: sans-serif;">
            <p style="font-size: 15px; margin-top: 0; color: #0f172a;">Yth. Supreme Admin CargoGrid,</p>
            <p style="color: #475569;">
              ${isEn ? `Great news! <strong>${inquiry.company}</strong> has completed all steps of the detailed requirements questionnaire.` : `Kabar baik! Perusahaan <strong>${inquiry.company}</strong> telah melengkapi seluruh tahapan kuesioner kebutuhan secara detail.`}
            </p>

            <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 16px; margin: 20px 0; border-radius: 4px;">
              <h4 style="margin: 0 0 8px 0; color: #065f46; font-size: 13px;">${isEn ? "Requirements Highlights" : "Sorotan Kebutuhan Prospek"}</h4>
              <p style="font-size: 12px; margin: 0 0 8px 0; color: #047857;">
                <strong>${isEn ? "Desired Modules:" : "Modul CargoGrid Diminati:"}</strong> ${(questionnaire?.desiredModules || []).map(m => getModuleLabel(m, isEn ? 'en' : 'id')).join(', ')}
              </p>
              <p style="font-size: 12px; margin: 0 0 8px 0; color: #047857;">
                <strong>ERP System:</strong> ${questionnaire?.erpSystem || 'None'}
              </p>
              <p style="font-size: 12px; margin: 0; color: #047857;">
                <strong>${isEn ? "Preferred Slots:" : "Preferensi Pertemuan:"}</strong> ${(questionnaire?.preferredSlots || []).join(' OR ')}
              </p>
            </div>

            <p style="color: #475569; margin-bottom: 24px;">
              ${isEn ? "Please review their operational draft answers, select one of the preferred slots, attach the meeting URL, and send the official invite." : "Harap segera setujui salah satu jadwal meeting preferensi customer di atas, lampirkan URL link meeting online, dan kirim undangan meeting resmi."}
            </p>

            <div style="text-align: center;">
              <a href="${window.location.origin}/#admin" style="background-color: #10b981; color: #ffffff; padding: 12px 24px; font-weight: bold; text-decoration: none; border-radius: 8px; font-size: 13px; display: inline-block;">
                ${isEn ? "Schedule Consultation Now &rarr;" : "Jadwalkan Pertemuan Sekarang &rarr;"}
              </a>
            </div>
          </div>
          ${footerHtml}
        </div>
      `;

    case 'customer_meeting':
      return isEn ? `
        <div style="${containerStyle}">
          ${headerHtml}
          <div style="background-color: #ffffff; padding: 32px 24px; font-family: sans-serif;">
            <p style="font-size: 16px; font-weight: bold; margin-top: 0; color: #0f172a;">Dear ${inquiry.name},</p>
            <p style="color: #475569; margin-bottom: 24px;">
              We are pleased to inform you that your system audit consultation with CargoGrid's Senior Logistics Consultant has been <strong>Confirmed</strong>.
            </p>

            <div style="border: 2px dashed #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 24px; background-color: #fafafa; text-align: center;">
              <span style="font-size: 11px; font-weight: bold; font-family: monospace; color: ${brandTeal}; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 8px;">CONFIRMED MEETING SCHEDULE</span>
              <h2 style="margin: 0 0 12px 0; font-size: 18px; color: #0f172a; font-weight: 800;">
                ${meeting ? formatDateDisplay(meeting.scheduledTime, 'en') : 'Confirmed'}
              </h2>
              <p style="font-size: 13px; margin: 0 0 16px 0; color: #64748b;">
                Platform: <strong>${meeting?.platform || 'Google Meet'}</strong>
              </p>
              
              <a href="${meeting?.meetingUrl || '#'}" target="_blank" style="background-color: ${brandTeal}; color: #ffffff; padding: 10px 20px; font-weight: bold; text-decoration: none; border-radius: 6px; font-size: 12px; display: inline-block; box-shadow: 0 2px 4px rgba(0, 151, 178, 0.2);">
                Join Online Meeting Room &rarr;
              </a>
            </div>

            <p style="color: #475569; margin-bottom: 12px;">
              <strong>What should you prepare?</strong>
            </p>
            <ul style="color: #475569; font-size: 13px; padding-left: 20px; margin-bottom: 24px;">
              <li style="margin-bottom: 8px;">Current operational workflow drafts for RFQ, dispatch, and POD verification.</li>
              <li style="margin-bottom: 8px;">Examples of delayed or pending invoice cases from the past month.</li>
              <li style="margin-bottom: 8px;">Technical team representatives if you wish to see a live API integration showcase.</li>
            </ul>

            <p style="color: #475569; margin-bottom: 0;">
              For any urgent schedule adjustments, please reply to our Onboarding Partner team via WhatsApp. We look forward to analyzing your operational system!
            </p>
          </div>
          ${footerHtml}
        </div>
      ` : `
        <div style="${containerStyle}">
          ${headerHtml}
          <div style="background-color: #ffffff; padding: 32px 24px; font-family: sans-serif;">
            <p style="font-size: 16px; font-weight: bold; margin-top: 0; color: #0f172a;">Halo Bapak/Ibu ${inquiry.name},</p>
            <p style="color: #475569; margin-bottom: 24px;">
              Kami senang memberi kabar bahwa jadwal pertemuan konsultasi dan audit sistem logistik detail Anda bersama Senior Logistik Konsultan CargoGrid telah <strong>Dikonfirmasi</strong>.
            </p>

            <div style="border: 2px dashed #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 24px; background-color: #fafafa; text-align: center;">
              <span style="font-size: 11px; font-weight: bold; font-family: monospace; color: ${brandTeal}; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 8px;">JADWAL PERTEMUAN RESMI</span>
              <h2 style="margin: 0 0 12px 0; font-size: 18px; color: #0f172a; font-weight: 800;">
                ${meeting ? formatDateDisplay(meeting.scheduledTime, 'id') : 'Dikonfirmasi'}
              </h2>
              <p style="font-size: 13px; margin: 0 0 16px 0; color: #64748b;">
                Platform: <strong>${meeting?.platform || 'Google Meet'}</strong>
              </p>
              
              <a href="${meeting?.meetingUrl || '#'}" target="_blank" style="background-color: ${brandTeal}; color: #ffffff; padding: 10px 20px; font-weight: bold; text-decoration: none; border-radius: 6px; font-size: 12px; display: inline-block; box-shadow: 0 2px 4px rgba(0, 151, 178, 0.2);">
                Masuk ke Ruang Meeting Online &rarr;
              </a>
            </div>

            <p style="color: #475569; margin-bottom: 12px;">
              <strong>Apa yang perlu disiapkan?</strong>
            </p>
            <ul style="color: #475569; font-size: 13px; padding-left: 20px; margin-bottom: 24px;">
              <li style="margin-bottom: 8px;">Draf SOP alur operasional RFQ - Dispatch - POD di tim Anda saat ini.</li>
              <li style="margin-bottom: 8px;">Contoh kendala invoice pending paling lama yang dialami sebulan terakhir.</li>
              <li style="margin-bottom: 8px;">Delegasi dari tim IT jika Anda menginginkan demo API integrasi secara langsung.</li>
            </ul>

            <p style="color: #475569; margin-bottom: 0;">
              Jika ada perubahan jadwal mendadak, silakan hubungi tim Onboarding Partner kami di nomor WhatsApp CargoGrid Support. Sampai bertemu di agenda konsultasi!
            </p>
          </div>
          ${footerHtml}
        </div>
      `;

    default:
      return ``;
  }
}

// Internal labels mapping
export function getPainLabel(key: string, lang: 'id' | 'en' = 'id'): string {
  const isEn = lang === 'en';
  if (isEn) {
    const map: Record<string, string> = {
      rfq: "Slow RFQ & scattered rates",
      tracking: "Tracking status updates to customers",
      pod: "Delayed & misplaced proof of delivery (POD)",
      warehouse: "Inaccurate warehouse stock levels",
      billing: "Finance & billing issues",
      margin: "Unclear profit margin per job"
    };
    return map[key] || key;
  } else {
    const map: Record<string, string> = {
      rfq: "RFQ lambat & rate tersebar",
      tracking: "Update status tracking ke customer",
      pod: "Bukti POD terlambat & tercecer",
      warehouse: "Stok gudang tidak akurat",
      billing: "Keuangan & Invoice bermasalah",
      margin: "Margin keuntungan per job gelap"
    };
    return map[key] || key;
  }
}

export function getSektorLabel(key: string, lang: 'id' | 'en' = 'id'): string {
  const isEn = lang === 'en';
  if (isEn) {
    const map: Record<string, string> = {
      forwarder: "Freight Forwarding",
      '3pl': "3PL Warehouse",
      trucking: "Trucking Company",
      inhouse: "In-house Logistics (Shipper)",
      other: "Other"
    };
    return map[key] || key;
  } else {
    const map: Record<string, string> = {
      forwarder: "Freight Forwarding",
      '3pl': "3PL Warehouse",
      trucking: "Trucking Company",
      inhouse: "In-house Logistics (Shipper)",
      other: "Lainnya"
    };
    return map[key] || key;
  }
}

export function getModuleLabel(key: string, lang: 'id' | 'en' = 'id'): string {
  const isEn = lang === 'en';
  if (isEn) {
    const map: Record<string, string> = {
      commercial: "Commercial (RFQ, CRM)",
      ops: "Operations (TMS, Dispatch)",
      tracking: "Tracking (Visibility, Real-time)",
      finance: "Finance (Invoicing, Profitability)",
      warehouse: "Warehouse (WMS, Inventory)"
    };
    return map[key] || key;
  } else {
    const map: Record<string, string> = {
      commercial: "Commercial (RFQ, CRM)",
      ops: "Operations (TMS, Dispatch)",
      tracking: "Tracking (Visibility, Real-time)",
      finance: "Finance (Invoicing, Profitability)",
      warehouse: "Warehouse (WMS, Inventory)"
    };
    return map[key] || key;
  }
}

export function formatDateDisplay(isoString: string, lang: 'id' | 'en' = 'id'): string {
  try {
    const d = new Date(isoString);
    if (lang === 'en') {
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const hours = d.getHours();
      const mins = String(d.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} at ${formattedHours}:${mins} ${ampm}`;
    } else {
      const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
      const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
      return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} pkl ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} WIB`;
    }
  } catch (e) {
    return isoString;
  }
}

// Supabase row mapping helpers
type InquiryRow = {
  id: string; name: string; company: string; role: string; email: string; phone: string;
  company_type: string; shipment_volume: string; biggest_pain: string; status: Inquiry["status"];
  lang?: "id" | "en" | null; utm_source?: string | null; utm_medium?: string | null; utm_campaign?: string | null;
  utm_term?: string | null; utm_content?: string | null; created_at: string; updated_at: string;
};

type QuestionnaireRow = {
  inquiry_id: string; cargo_types?: string[] | null; primary_routes?: string | null; fleet_size?: string | null;
  vendor_count?: string | null; pain_rfq_details?: string | null; pain_dispatch_details?: string | null;
  pain_tracking_details?: string | null; pain_billing_details?: string | null; desired_modules?: string[] | null;
  erp_system?: string | null; custom_requirements?: string | null; preferred_slots?: string[] | null; contact_notes?: string | null;
  existing_customer_flow?: string | null; business_process_sop?: string | null; total_expected_users?: string | null;
  roles_involved?: string[] | null; top_problem_impact?: string | null; specific_requests?: string | null;
  is_draft?: boolean | null; current_step?: number | null; last_saved_at?: string | null; submitted_at?: string | null;
};

type MeetingRow = {
  id: string; inquiry_id: string; scheduled_time: string; meeting_url?: string | null; platform?: Meeting["platform"] | null;
  admin_notes?: string | null; is_invitation_sent?: boolean | null; created_at: string;
};

type EmailLogRow = {
  id: string; to_address: string; subject: string; html_body: string; sent_at: string; type: EmailLog["type"];
};

const toInquiry = (row: InquiryRow): Inquiry => ({
  id: row.id, name: row.name, company: row.company, role: row.role, email: row.email, phone: row.phone,
  companyType: row.company_type, shipmentVolume: row.shipment_volume, biggestPain: row.biggest_pain, status: row.status,
  createdAt: row.created_at, updatedAt: row.updated_at, lang: row.lang || undefined,
  utmSource: row.utm_source || undefined, utmMedium: row.utm_medium || undefined, utmCampaign: row.utm_campaign || undefined,
  utmTerm: row.utm_term || undefined, utmContent: row.utm_content || undefined
});

const toQuestionnaire = (row: QuestionnaireRow): Questionnaire => ({
  inquiryId: row.inquiry_id, cargoTypes: row.cargo_types || [], primaryRoutes: row.primary_routes || "",
  fleetSize: row.fleet_size || "", vendorCount: row.vendor_count || "", painRfqDetails: row.pain_rfq_details || "",
  painDispatchDetails: row.pain_dispatch_details || "", painTrackingDetails: row.pain_tracking_details || "",
  painBillingDetails: row.pain_billing_details || "", desiredModules: row.desired_modules || [], erpSystem: row.erp_system || "None",
  customRequirements: row.custom_requirements || "", preferredSlots: row.preferred_slots || [], contactNotes: row.contact_notes || "",
  existingCustomerFlow: row.existing_customer_flow || "", businessProcessSop: row.business_process_sop || "",
  totalExpectedUsers: row.total_expected_users || "", rolesInvolved: row.roles_involved || [], topProblemImpact: row.top_problem_impact || "",
  specificRequests: row.specific_requests || "", isDraft: row.is_draft ?? true, currentStep: row.current_step || 1,
  lastSavedAt: row.last_saved_at || new Date().toISOString(), submittedAt: row.submitted_at || undefined
});

const toMeeting = (row: MeetingRow): Meeting => ({
  id: row.id, inquiryId: row.inquiry_id, scheduledTime: row.scheduled_time, meetingUrl: row.meeting_url || "",
  platform: row.platform || "Google Meet", adminNotes: row.admin_notes || "", isInvitationSent: row.is_invitation_sent ?? false,
  createdAt: row.created_at
});

const toEmailLog = (row: EmailLogRow): EmailLog => ({
  id: row.id, to: row.to_address, subject: row.subject, htmlBody: row.html_body, sentAt: row.sent_at, type: row.type
});

const toQuestionnaireRow = (inquiryId: string, qData: Partial<Questionnaire>, isDraft: boolean) => ({
  inquiry_id: inquiryId, cargo_types: qData.cargoTypes || [], primary_routes: qData.primaryRoutes || "", fleet_size: qData.fleetSize || "",
  vendor_count: qData.vendorCount || "", pain_rfq_details: qData.painRfqDetails || "", pain_dispatch_details: qData.painDispatchDetails || "",
  pain_tracking_details: qData.painTrackingDetails || "", pain_billing_details: qData.painBillingDetails || "", desired_modules: qData.desiredModules || [],
  erp_system: qData.erpSystem || "None", custom_requirements: qData.customRequirements || "", preferred_slots: qData.preferredSlots || [],
  contact_notes: qData.contactNotes || "", existing_customer_flow: qData.existingCustomerFlow || "", business_process_sop: qData.businessProcessSop || "",
  total_expected_users: qData.totalExpectedUsers || "", roles_involved: qData.rolesInvolved || [], top_problem_impact: qData.topProblemImpact || "",
  specific_requests: qData.specificRequests || "", is_draft: isDraft, current_step: qData.currentStep || (isDraft ? 1 : 4),
  last_saved_at: new Date().toISOString(), submitted_at: isDraft ? qData.submittedAt || null : new Date().toISOString()
});

function throwSupabaseError(error: unknown): never {
  const message = error instanceof Error ? error.message : "Supabase request failed";
  throw new Error(message);
}

// API Methods
export async function getInquiries(): Promise<Inquiry[]> {
  const { data, error } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false });
  if (error) throwSupabaseError(error);
  return ((data || []) as InquiryRow[]).map(toInquiry);
}

export async function getInquiry(id: string): Promise<Inquiry | undefined> {
  const { data, error } = await supabase.from("inquiries").select("*").eq("id", id).maybeSingle();
  if (error) throwSupabaseError(error);
  return data ? toInquiry(data as InquiryRow) : undefined;
}

export async function addInquiry(inquiryData: Omit<Inquiry, "id" | "status" | "createdAt" | "updatedAt">): Promise<Inquiry> {
  const { data, error } = await supabase.from("inquiries").insert({
    name: inquiryData.name, company: inquiryData.company, role: inquiryData.role, email: inquiryData.email, phone: inquiryData.phone,
    company_type: inquiryData.companyType, shipment_volume: inquiryData.shipmentVolume, biggest_pain: inquiryData.biggestPain,
    lang: inquiryData.lang || "id", utm_source: inquiryData.utmSource, utm_medium: inquiryData.utmMedium,
    utm_campaign: inquiryData.utmCampaign, utm_term: inquiryData.utmTerm, utm_content: inquiryData.utmContent
  }).select("*").single();
  if (error) throwSupabaseError(error);
  const newInquiry = toInquiry(data as InquiryRow);
  await addEmailLog(newInquiry.email, "[CargoGrid OS] Registrasi Audit Sistem Berhasil - Lengkapi Kuesioner Kebutuhan Anda", generateHtmlEmailTemplate("customer_welcome", { inquiry: newInquiry }), "customer_welcome");
  await addEmailLog("service@cargogrid.net", `🚨 [CargoGrid ALERT] Inquiry Baru Masuk - ${newInquiry.company}`, generateHtmlEmailTemplate("admin_alert_new", { inquiry: newInquiry }), "admin_alert_new");
  return newInquiry;
}

export async function updateInquiryStatus(id: string, status: Inquiry["status"]): Promise<void> {
  const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
  if (error) throwSupabaseError(error);
}

export async function getQuestionnaires(): Promise<Questionnaire[]> {
  const { data, error } = await supabase.from("questionnaires").select("*");
  if (error) throwSupabaseError(error);
  return ((data || []) as QuestionnaireRow[]).map(toQuestionnaire);
}

export async function getQuestionnaireByInquiryId(inquiryId: string): Promise<Questionnaire | undefined> {
  const { data, error } = await supabase.from("questionnaires").select("*").eq("inquiry_id", inquiryId).maybeSingle();
  if (error) throwSupabaseError(error);
  return data ? toQuestionnaire(data as QuestionnaireRow) : undefined;
}

export async function saveQuestionnaireDraft(inquiryId: string, qData: Partial<Questionnaire> & { currentStep: number }): Promise<Questionnaire> {
  const { data, error } = await supabase.from("questionnaires").upsert(toQuestionnaireRow(inquiryId, qData, true), { onConflict: "inquiry_id" }).select("*").single();
  if (error) throwSupabaseError(error);
  await updateInquiryStatus(inquiryId, "Draft Kuesioner");
  return toQuestionnaire(data as QuestionnaireRow);
}

export async function submitQuestionnaire(inquiryId: string, qData: Partial<Questionnaire>): Promise<Questionnaire> {
  const { data, error } = await supabase.from("questionnaires").upsert(toQuestionnaireRow(inquiryId, { ...qData, currentStep: 4 }, false), { onConflict: "inquiry_id" }).select("*").single();
  if (error) throwSupabaseError(error);
  const updated = toQuestionnaire(data as QuestionnaireRow);
  await updateInquiryStatus(inquiryId, "Kuesioner Selesai");
  const inquiry = await getInquiry(inquiryId);
  if (inquiry) await addEmailLog("service@cargogrid.net", `✅ [CargoGrid ALERT] Kuesioner Selesai Diisi - ${inquiry.company}`, generateHtmlEmailTemplate("admin_alert_complete", { inquiry, questionnaire: updated }), "admin_alert_complete");
  return updated;
}

export async function getMeetings(): Promise<Meeting[]> {
  const { data, error } = await supabase.from("meetings").select("*").order("created_at", { ascending: false });
  if (error) throwSupabaseError(error);
  return ((data || []) as MeetingRow[]).map(toMeeting);
}

export async function scheduleMeeting(inquiryId: string, meetData: { scheduledTime: string; meetingUrl: string; platform: Meeting["platform"]; adminNotes: string; }): Promise<Meeting> {
  const { data, error } = await supabase.from("meetings").upsert({
    inquiry_id: inquiryId, scheduled_time: meetData.scheduledTime, meeting_url: meetData.meetingUrl, platform: meetData.platform,
    admin_notes: meetData.adminNotes, is_invitation_sent: true
  }, { onConflict: "inquiry_id" }).select("*").single();
  if (error) throwSupabaseError(error);
  const meeting = toMeeting(data as MeetingRow);
  await updateInquiryStatus(inquiryId, "Meeting Scheduled");
  const inquiry = await getInquiry(inquiryId);
  if (inquiry) await addEmailLog(inquiry.email, `📅 [CargoGrid OS] Undangan Meeting Konfirmasi Audit Sistem - ${inquiry.company}`, generateHtmlEmailTemplate("customer_meeting", { inquiry, meeting }), "customer_meeting");
  return meeting;
}

export async function getEmailLogs(): Promise<EmailLog[]> {
  const { data, error } = await supabase.from("email_logs").select("*").order("sent_at", { ascending: false });
  if (error) throwSupabaseError(error);
  return ((data || []) as EmailLogRow[]).map(toEmailLog);
}

export async function addEmailLog(to: string, subject: string, htmlBody: string, type: EmailLog["type"]): Promise<EmailLog> {
  const { data, error } = await supabase.from("email_logs").insert({ to_address: to, subject, html_body: htmlBody, type }).select("*").single();
  if (error) throwSupabaseError(error);
  return toEmailLog(data as EmailLogRow);
}
