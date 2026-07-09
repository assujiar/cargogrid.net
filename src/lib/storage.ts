/**
 * CargoGrid Persistent Storage & Email Simulation Engine
 * Uses localStorage to persist inquiries, draft/final questionnaires, meetings, and email outbox logs.
 */

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

// Storage helpers
function getStorageItem<T>(key: string, defaultValue: T): T {
  const val = localStorage.getItem(key);
  if (!val) return defaultValue;
  try {
    return JSON.parse(val) as T;
  } catch (e) {
    return defaultValue;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function initializeStorage() {
  if (!localStorage.getItem("cargogrid_inquiries")) {
    setStorageItem("cargogrid_inquiries", DEFAULT_INQUIRIES);
  }
  if (!localStorage.getItem("cargogrid_questionnaires")) {
    setStorageItem("cargogrid_questionnaires", DEFAULT_QUESTIONNAIRES);
  }
  if (!localStorage.getItem("cargogrid_meetings")) {
    setStorageItem("cargogrid_meetings", DEFAULT_MEETINGS);
  }
  if (!localStorage.getItem("cargogrid_emails")) {
    // Generate initial emails for the pre-seeded inquiries
    const inquiries = getStorageItem<Inquiry[]>("cargogrid_inquiries", []);
    const questionnaires = getStorageItem<Questionnaire[]>("cargogrid_questionnaires", []);
    const meetings = getStorageItem<Meeting[]>("cargogrid_meetings", []);
    
    const seededEmails: EmailLog[] = [];
    
    // Welcome email for Sinar Mas
    const smInq = inquiries.find(i => i.id === "inq-sinar-mas")!;
    seededEmails.push({
      id: "email-sm-welcome",
      to: smInq.email,
      subject: "[CargoGrid OS] Registrasi Audit Sistem Berhasil - Lengkapi Kuesioner Kebutuhan Anda",
      htmlBody: generateHtmlEmailTemplate("customer_welcome", { inquiry: smInq }),
      sentAt: "2026-07-06T10:35:00Z",
      type: "customer_welcome"
    });
    
    // New Inquiry Alert for Samudera
    const samInq = inquiries.find(i => i.id === "inq-samudera")!;
    seededEmails.push({
      id: "email-sam-new-alert",
      to: "service@cargogrid.net",
      subject: "🚨 [CargoGrid ALERT] Inquiry Baru Masuk - PT Samudera Indonesia",
      htmlBody: generateHtmlEmailTemplate("admin_alert_new", { inquiry: samInq }),
      sentAt: "2026-07-07T09:16:00Z",
      type: "admin_alert_new"
    });

    // Welcome email for Samudera
    seededEmails.push({
      id: "email-sam-welcome",
      to: samInq.email,
      subject: "[CargoGrid OS] Registrasi Audit Sistem Berhasil - Lengkapi Kuesioner Kebutuhan Anda",
      htmlBody: generateHtmlEmailTemplate("customer_welcome", { inquiry: samInq }),
      sentAt: "2026-07-07T09:17:00Z",
      type: "customer_welcome"
    });

    // Astra welcome, admin alerts & meeting
    const astraInq = inquiries.find(i => i.id === "inq-astra")!;
    const astraQuest = questionnaires.find(q => q.inquiryId === "inq-astra")!;
    const astraMeet = meetings.find(m => m.inquiryId === "inq-astra")!;

    seededEmails.push({
      id: "email-astra-welcome",
      to: astraInq.email,
      subject: "[CargoGrid OS] Registrasi Audit Sistem Berhasil - Lengkapi Kuesioner Kebutuhan Anda",
      htmlBody: generateHtmlEmailTemplate("customer_welcome", { inquiry: astraInq }),
      sentAt: "2026-07-05T08:05:00Z",
      type: "customer_welcome"
    });

    seededEmails.push({
      id: "email-astra-new-alert",
      to: "service@cargogrid.net",
      subject: "🚨 [CargoGrid ALERT] Inquiry Baru Masuk - PT Astra Otoparts Tbk",
      htmlBody: generateHtmlEmailTemplate("admin_alert_new", { inquiry: astraInq }),
      sentAt: "2026-07-05T08:06:00Z",
      type: "admin_alert_new"
    });

    seededEmails.push({
      id: "email-astra-complete-alert",
      to: "service@cargogrid.net",
      subject: "✅ [CargoGrid ALERT] Kuesioner Selesai Diisi - PT Astra Otoparts Tbk",
      htmlBody: generateHtmlEmailTemplate("admin_alert_complete", { inquiry: astraInq, questionnaire: astraQuest }),
      sentAt: "2026-07-05T17:16:00Z",
      type: "admin_alert_complete"
    });

    seededEmails.push({
      id: "email-astra-meeting",
      to: astraInq.email,
      subject: "📅 [CargoGrid OS] Undangan Meeting Konfirmasi Audit Sistem - PT Astra Otoparts Tbk",
      htmlBody: generateHtmlEmailTemplate("customer_meeting", { inquiry: astraInq, meeting: astraMeet }),
      sentAt: "2026-07-06T11:05:00Z",
      type: "customer_meeting"
    });

    setStorageItem("cargogrid_emails", seededEmails);
  }
}

// API Methods
export function getInquiries(): Inquiry[] {
  initializeStorage();
  return getStorageItem<Inquiry[]>("cargogrid_inquiries", []).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getInquiry(id: string): Inquiry | undefined {
  return getInquiries().find(i => i.id === id);
}

export function addInquiry(inquiryData: Omit<Inquiry, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Inquiry {
  initializeStorage();
  const inquiries = getStorageItem<Inquiry[]>("cargogrid_inquiries", []);
  
  const newInquiry: Inquiry = {
    ...inquiryData,
    id: `inq-${Math.random().toString(36).substr(2, 9)}`,
    status: 'Inquiry Masuk',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  inquiries.push(newInquiry);
  setStorageItem("cargogrid_inquiries", inquiries);

  // Send initial simulated emails
  // 1. Welcome to Customer with link
  const welcomeHtml = generateHtmlEmailTemplate("customer_welcome", { inquiry: newInquiry });
  addEmailLog(newInquiry.email, "[CargoGrid OS] Registrasi Audit Sistem Berhasil - Lengkapi Kuesioner Kebutuhan Anda", welcomeHtml, "customer_welcome");

  // 2. Alert to Admin
  const adminHtml = generateHtmlEmailTemplate("admin_alert_new", { inquiry: newInquiry });
  addEmailLog("service@cargogrid.net", `🚨 [CargoGrid ALERT] Inquiry Baru Masuk - ${newInquiry.company}`, adminHtml, "admin_alert_new");

  return newInquiry;
}

export function updateInquiryStatus(id: string, status: Inquiry['status']) {
  initializeStorage();
  const inquiries = getStorageItem<Inquiry[]>("cargogrid_inquiries", []);
  const idx = inquiries.findIndex(i => i.id === id);
  if (idx !== -1) {
    inquiries[idx].status = status;
    inquiries[idx].updatedAt = new Date().toISOString();
    setStorageItem("cargogrid_inquiries", inquiries);
  }
}

export function getQuestionnaires(): Questionnaire[] {
  initializeStorage();
  return getStorageItem<Questionnaire[]>("cargogrid_questionnaires", []);
}

export function getQuestionnaireByInquiryId(inquiryId: string): Questionnaire | undefined {
  return getQuestionnaires().find(q => q.inquiryId === inquiryId);
}

export function saveQuestionnaireDraft(inquiryId: string, qData: Partial<Questionnaire> & { currentStep: number }) {
  initializeStorage();
  const questionnaires = getStorageItem<Questionnaire[]>("cargogrid_questionnaires", []);
  const idx = questionnaires.findIndex(q => q.inquiryId === inquiryId);
  
  const existing = idx !== -1 ? questionnaires[idx] : {
    inquiryId,
    cargoTypes: [],
    primaryRoutes: "",
    fleetSize: "",
    vendorCount: "",
    painRfqDetails: "",
    painDispatchDetails: "",
    painTrackingDetails: "",
    painBillingDetails: "",
    desiredModules: [],
    erpSystem: "",
    customRequirements: "",
    preferredSlots: [],
    contactNotes: "",
    isDraft: true,
    currentStep: qData.currentStep,
    lastSavedAt: new Date().toISOString()
  };

  const updated: Questionnaire = {
    ...existing,
    ...qData,
    isDraft: true,
    lastSavedAt: new Date().toISOString()
  };

  if (idx !== -1) {
    questionnaires[idx] = updated;
  } else {
    questionnaires.push(updated);
  }

  setStorageItem("cargogrid_questionnaires", questionnaires);
  updateInquiryStatus(inquiryId, "Draft Kuesioner");
  return updated;
}

export function submitQuestionnaire(inquiryId: string, qData: Partial<Questionnaire>) {
  initializeStorage();
  const questionnaires = getStorageItem<Questionnaire[]>("cargogrid_questionnaires", []);
  const idx = questionnaires.findIndex(q => q.inquiryId === inquiryId);
  
  const existing = idx !== -1 ? questionnaires[idx] : {
    inquiryId,
    cargoTypes: [],
    primaryRoutes: "",
    fleetSize: "",
    vendorCount: "",
    painRfqDetails: "",
    painDispatchDetails: "",
    painTrackingDetails: "",
    painBillingDetails: "",
    desiredModules: [],
    erpSystem: "",
    customRequirements: "",
    preferredSlots: [],
    contactNotes: "",
    isDraft: false,
    currentStep: 4,
    lastSavedAt: new Date().toISOString()
  };

  const updated: Questionnaire = {
    ...existing,
    ...qData,
    isDraft: false,
    currentStep: 4,
    lastSavedAt: new Date().toISOString(),
    submittedAt: new Date().toISOString()
  };

  if (idx !== -1) {
    questionnaires[idx] = updated;
  } else {
    questionnaires.push(updated);
  }

  setStorageItem("cargogrid_questionnaires", questionnaires);
  updateInquiryStatus(inquiryId, "Kuesioner Selesai");

  // Send Alert email to Supreme Admin that questionnaire is completed
  const inquiry = getInquiry(inquiryId);
  if (inquiry) {
    const completeHtml = generateHtmlEmailTemplate("admin_alert_complete", { inquiry, questionnaire: updated });
    addEmailLog("service@cargogrid.net", `✅ [CargoGrid ALERT] Kuesioner Selesai Diisi - ${inquiry.company}`, completeHtml, "admin_alert_complete");
  }

  return updated;
}

export function getMeetings(): Meeting[] {
  initializeStorage();
  return getStorageItem<Meeting[]>("cargogrid_meetings", []);
}

export function scheduleMeeting(inquiryId: string, meetData: {
  scheduledTime: string;
  meetingUrl: string;
  platform: Meeting['platform'];
  adminNotes: string;
}): Meeting {
  initializeStorage();
  const meetings = getStorageItem<Meeting[]>("cargogrid_meetings", []);
  const idx = meetings.findIndex(m => m.inquiryId === inquiryId);

  const newMeeting: Meeting = {
    id: idx !== -1 ? meetings[idx].id : `meet-${Math.random().toString(36).substr(2, 9)}`,
    inquiryId,
    scheduledTime: meetData.scheduledTime,
    meetingUrl: meetData.meetingUrl,
    platform: meetData.platform,
    adminNotes: meetData.adminNotes,
    isInvitationSent: true,
    createdAt: idx !== -1 ? meetings[idx].createdAt : new Date().toISOString()
  };

  if (idx !== -1) {
    meetings[idx] = newMeeting;
  } else {
    meetings.push(newMeeting);
  }

  setStorageItem("cargogrid_meetings", meetings);
  updateInquiryStatus(inquiryId, "Meeting Scheduled");

  // Send Invitation Email to Customer with Google Meet/Zoom Link
  const inquiry = getInquiry(inquiryId);
  if (inquiry) {
    const inviteHtml = generateHtmlEmailTemplate("customer_meeting", { inquiry, meeting: newMeeting });
    addEmailLog(inquiry.email, `📅 [CargoGrid OS] Undangan Meeting Konfirmasi Audit Sistem - ${inquiry.company}`, inviteHtml, "customer_meeting");
  }

  return newMeeting;
}

export function getEmailLogs(): EmailLog[] {
  initializeStorage();
  return getStorageItem<EmailLog[]>("cargogrid_emails", []).sort((a, b) => 
    new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
  );
}

export function addEmailLog(to: string, subject: string, htmlBody: string, type: EmailLog['type']) {
  initializeStorage();
  const emails = getStorageItem<EmailLog[]>("cargogrid_emails", []);
  
  const newEmail: EmailLog = {
    id: `email-${Math.random().toString(36).substr(2, 9)}`,
    to,
    subject,
    htmlBody,
    sentAt: new Date().toISOString(),
    type
  };

  emails.push(newEmail);
  setStorageItem("cargogrid_emails", emails);
  return newEmail;
}
