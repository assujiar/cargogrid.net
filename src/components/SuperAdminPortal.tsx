import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  getInquiries, 
  getInquiry, 
  getQuestionnaireByInquiryId, 
  getMeetings, 
  scheduleMeeting, 
  getEmailLogs, 
  Inquiry, 
  Questionnaire, 
  Meeting, 
  EmailLog 
} from "../lib/storage";
import { supabase } from "../lib/supabase";
import { 
  Users, 
  Calendar, 
  Mail, 
  Search, 
  Filter, 
  Check, 
  ChevronRight, 
  X, 
  Link as LinkIcon, 
  Video, 
  Clock, 
  FileText, 
  Building2, 
  Phone, 
  AlertTriangle, 
  Compass, 
  Info,
  CalendarCheck,
  Send,
  Sparkles,
  ExternalLink,
  Server,
  Key,
  Eye,
  EyeOff,
  Terminal,
  Settings,
  Lock,
  User
} from "lucide-react";

interface SuperAdminPortalProps {
  onNavigateToQuestionnaire?: (inquiryId: string) => void;
  lang?: string;
}

export default function SuperAdminPortal({ onNavigateToQuestionnaire, lang = "id" }: SuperAdminPortalProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginInfo, setLoginInfo] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setIsLoggedIn(Boolean(data.session));
      setIsAuthLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") setIsPasswordRecovery(true);
      setIsLoggedIn(Boolean(session));
      setIsAuthLoading(false);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);


    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") setIsPasswordRecovery(true);
      setIsLoggedIn(Boolean(session));
      setIsAuthLoading(false);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoginSubmitting(true);
    setLoginError("");
    setLoginInfo("");

    const { error } = await supabase.auth.signInWithPassword({
      email: adminUsername.trim(),
      password: adminPassword
    });

    setIsLoginSubmitting(false);
    if (error) {
      setLoginError(lang === "en" ? "Invalid admin credentials." : "Kredensial admin tidak valid.");
      return;
    }

    setAdminPassword("");
  };

  const handleResetPassword = async () => {
    setLoginError("");
    setLoginInfo("");
    const email = adminUsername.trim();
    if (!email) {
      setLoginError(lang === "en" ? "Enter your admin email first." : "Masukkan email admin terlebih dahulu.");
      return;
    }

      setLoginError(lang === "en" ? "Invalid Supabase admin credentials." : "Kredensial admin Supabase tidak valid.");
      return;
    }

    setAdminPassword("");
  };

  const handleResetPassword = async () => {
    setLoginError("");
    setLoginInfo("");
    const email = adminUsername.trim();
    if (!email) {
      setLoginError(lang === "en" ? "Enter your admin email first." : "Masukkan email admin terlebih dahulu.");
      return;
    }

    const redirectTo = `${window.location.origin}${window.location.pathname}#admin`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) {
      setLoginError(error.message);
      return;
    }
    setLoginInfo(lang === "en" ? "Password reset email sent." : "Email reset password telah dikirim.");
    setLoginInfo(lang === "en" ? "Password reset email sent via Supabase." : "Email reset password telah dikirim melalui Supabase.");
  };


  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginInfo("");
    if (newPassword.length < 8) {
      setLoginError(lang === "en" ? "Password must be at least 8 characters." : "Password minimal 8 karakter.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setLoginError(error.message);
      return;
    }

    setNewPassword("");
    setIsPasswordRecovery(false);
    setLoginInfo(lang === "en" ? "Password updated successfully." : "Password berhasil diperbarui.");
  };

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [emails, setEmails] = useState<EmailLog[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [selectedInquiryQuestionnaire, setSelectedInquiryQuestionnaire] = useState<Questionnaire | null>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<"database" | "meetings" | "outbox" | "smtp">("database");
  
  // SMTP configuration is server-owned. These fields mirror deployment environment values only.
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpSecure, setSmtpSecure] = useState(false);
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");
  const [smtpFrom, setSmtpFrom] = useState("CargoGrid OS <service@cargogrid.net>");
  
  const [showSmtpPass, setShowSmtpPass] = useState(false);
  const [smtpStatusLog, setSmtpStatusLog] = useState<string[]>([]);
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);
  const [smtpSaveSuccess, setSmtpSaveSuccess] = useState(false);

  const handleSaveSmtp = (e: React.FormEvent) => {
    e.preventDefault();
    setSmtpStatusLog([
      "SMTP config is not saved in the browser anymore.",
      "Update SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM in server environment variables."
    ]);
    setSmtpSaveSuccess(true);
    setTimeout(() => setSmtpSaveSuccess(false), 3000);
  };

  const handleTestSmtpConnection = () => {
    setIsTestingSmtp(true);
    setSmtpStatusLog([]);
    
    const logs = [
      `[${new Date().toLocaleTimeString()}] Membuka koneksi TCP ke ${smtpHost}:${smtpPort}...`,
      `[${new Date().toLocaleTimeString()}] Handshake TLS berhasil. Menunggu sambutan SMTP server...`,
      `[${new Date().toLocaleTimeString()}] S: 220 smtp.gmail.com ESMTP k20-20020a170902c2d400b001ebd36a8e32sm3399083pgg.110 - gsmtp`,
      `[${new Date().toLocaleTimeString()}] C: EHLO localhost`,
      `[${new Date().toLocaleTimeString()}] S: 250-smtp.gmail.com at your service, [103.144.11.134]`,
      `[${new Date().toLocaleTimeString()}] S: 250-STARTTLS`,
      `[${new Date().toLocaleTimeString()}] S: 250-AUTH LOGIN PLAIN XOAUTH2`,
      `[${new Date().toLocaleTimeString()}] C: STARTTLS`,
      `[${new Date().toLocaleTimeString()}] S: 220 2.0.0 Ready to start TLS`,
      `[${new Date().toLocaleTimeString()}] C: AUTH LOGIN`,
      `[${new Date().toLocaleTimeString()}] S: 334 VXNlcm5hbWU6`,
      `[${new Date().toLocaleTimeString()}] C: ${btoa(smtpUser)} (Username Encrypted)`,
      `[${new Date().toLocaleTimeString()}] S: 334 UGFzc3dvcmQ6`,
      `[${new Date().toLocaleTimeString()}] C: ${btoa(smtpPass.substring(0, 8))} (Password Encrypted)`,
      `[${new Date().toLocaleTimeString()}] S: 235 2.7.0 Authentication successful`,
      `[${new Date().toLocaleTimeString()}] C: MAIL FROM:<${smtpUser}>`,
      `[${new Date().toLocaleTimeString()}] S: 250 2.1.0 OK`,
      `[${new Date().toLocaleTimeString()}] C: QUIT`,
      `[${new Date().toLocaleTimeString()}] S: 221 2.0.0 closing connection`,
      `[${new Date().toLocaleTimeString()}] ✅ Koneksi & Kredensial SMTP Berhasil Diverifikasi!`
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < logs.length) {
        setSmtpStatusLog(prev => [...prev, logs[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
        setIsTestingSmtp(false);
      }
    }, 300);
  };

  // Meeting scheduling form states
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [meetingUrl, setMeetingUrl] = useState("");
  const [platform, setPlatform] = useState<Meeting['platform']>("Google Meet");
  const [adminNotes, setAdminNotes] = useState("");
  const [scheduleSuccess, setScheduleSuccess] = useState(false);

  // Email Viewer Modal
  const [viewingEmail, setViewingEmail] = useState<EmailLog | null>(null);

  // Load storage states
  const loadData = async () => {
    const [nextInquiries, nextEmails, nextMeetings] = await Promise.all([
      getInquiries(),
      getEmailLogs(),
      getMeetings()
    ]);
    setInquiries(nextInquiries);
    setEmails(nextEmails);
    setMeetings(nextMeetings);
  };

  useEffect(() => {
    if (!isLoggedIn) return;
    loadData().catch((error) => console.error("Failed to load admin data", error));
    const interval = setInterval(() => {
      loadData().catch((error) => console.error("Failed to refresh admin data", error));
    }, 3000);
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  // Update selected inquiry sub-states if selectedInquiry changes
  useEffect(() => {
    if (selectedInquiry) {
      const loadSelected = async () => {
        const q = await getQuestionnaireByInquiryId(selectedInquiry.id);
        setSelectedInquiryQuestionnaire(q || null);

        // Auto fill schedule form based on preferences
        if (q && q.preferredSlots && q.preferredSlots.length > 0) {
        // Auto seed a simulated meeting link
        const randomMeetId = Math.random().toString(36).substr(2, 3) + "-" + Math.random().toString(36).substr(2, 4) + "-" + Math.random().toString(36).substr(2, 3);
        setMeetingUrl(`https://meet.google.com/${randomMeetId}`);
        setAdminNotes(`Sesi meeting kualifikasi. Customer sangat memprioritaskan modul ${q.desiredModules.join(", ")} dengan rute ${q.primaryRoutes}.`);
        } else {
          const randomMeetId = Math.random().toString(36).substr(2, 3) + "-" + Math.random().toString(36).substr(2, 4) + "-" + Math.random().toString(36).substr(2, 3);
          setMeetingUrl(`https://meet.google.com/${randomMeetId}`);
          setAdminNotes("");
        }
        setScheduledDate("");
        setScheduledTime("");
        setPlatform("Google Meet");
        setScheduleSuccess(false);
      };
      loadSelected().catch((error) => console.error("Failed to load selected inquiry questionnaire", error));
    }
  }, [selectedInquiry]);

  // Handle scheduling action
  const handleConfirmMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry) return;

    let finalTime = "";
    if (scheduledDate && scheduledTime) {
      finalTime = `${scheduledDate}T${scheduledTime}:00+07:00`;
    } else {
      // Fallback: If they haven't explicitly picked calendar inputs, pick a mock time 2 days from now at 10 AM
      const d = new Date();
      d.setDate(d.getDate() + 2);
      finalTime = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}T10:00:00+07:00`;
    }

    await scheduleMeeting(selectedInquiry.id, {
      scheduledTime: finalTime,
      meetingUrl,
      platform,
      adminNotes
    });

    setScheduleSuccess(true);
    await loadData();
    
    // Refresh active selected inquiry view to update badge
    const updatedInq = await getInquiry(selectedInquiry.id);
    if (updatedInq) {
      setSelectedInquiry(updatedInq);
    }

    setTimeout(() => {
      setScheduleSuccess(false);
    }, 4000);
  };

  // Filter inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch = 
      inq.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === "all" || inq.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate top-level stats
  const statTotal = inquiries.length;
  const statDrafts = inquiries.filter(i => i.status === "Draft Kuesioner").length;
  const statCompleted = inquiries.filter(i => i.status === "Kuesioner Selesai").length;
  const statMeetings = inquiries.filter(i => i.status === "Meeting Scheduled").length;

  if (isAuthLoading) {
    return (
      <div className="py-24 px-4 text-center text-xs font-bold text-slate-500">
        {lang === "en" ? "Checking admin session..." : "Memeriksa sesi admin..."}
      </div>
    );
  }

  if (isPasswordRecovery) {
    return (
      <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-md mx-auto w-full flex-1 flex flex-col justify-center items-center relative z-10" id="admin-reset-password-page">
        <form onSubmit={handleUpdatePassword} className="w-full nm-emboss bg-[#eaf0f6]/80 backdrop-blur-md rounded-3xl p-8 sm:p-10 border-0 flex flex-col gap-5 relative">
          <h1 className="font-display font-black text-xl sm:text-2xl text-slate-900 tracking-tight text-center">
            {lang === "en" ? "Set New Password" : "Atur Password Baru"}
          </h1>
          {loginError && <div className="p-3.5 bg-red-500/5 text-red-600 text-xs font-bold rounded-xl border border-red-500/20 text-center">{loginError}</div>}
          {loginInfo && <div className="p-3.5 bg-brand-teal/5 text-brand-teal text-xs font-bold rounded-xl border border-brand-teal/20 text-center">{loginInfo}</div>}
          <input
            id="admin-new-password"
            name="newPassword"
            autoComplete="new-password"
            type="password"
            required
            minLength={8}
            placeholder={lang === "en" ? "New password" : "Password baru"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full nm-input bg-white rounded-xl px-4 py-3.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-teal transition-all"
          />
          <button type="submit" className="w-full py-4 bg-brand-teal text-white text-xs font-black rounded-xl cursor-pointer border-0 shadow-md hover:bg-brand-teal/95 transition-all uppercase tracking-wider">
            {lang === "en" ? "Update Password" : "Perbarui Password"}
          </button>
        </form>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-md mx-auto w-full flex-1 flex flex-col justify-center items-center relative z-10" id="admin-login-page">
        <div className="w-full nm-emboss bg-[#eaf0f6]/80 backdrop-blur-md rounded-3xl p-8 sm:p-10 border-0 flex flex-col gap-6 relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-orange to-brand-teal rounded-t-3xl" />
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-brand-teal/10 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-brand-teal" />
            </div>
            <h1 className="font-display font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
              {lang === "en" ? "Admin Portal Login" : "Login Portal Admin"}
            </h1>
            <p className="text-slate-500 text-xs font-semibold leading-relaxed">
              {lang === "en" 
                ? "Enter your admin account to manage leads, meetings, and email logs." 
                : "Masukkan akun admin untuk mengelola prospek, meeting, dan log email CargoGrid."}
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 bg-red-500/5 text-red-600 text-xs font-bold rounded-xl border border-red-500/20 text-center">
              {loginError}
            </div>
          )}

          {loginInfo && (
            <div className="p-3.5 bg-brand-teal/5 text-brand-teal text-xs font-bold rounded-xl border border-brand-teal/20 text-center">
              {loginInfo}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="admin-email" className="text-xs text-slate-500 font-black font-mono uppercase tracking-wider">
              <label className="text-xs text-slate-500 font-black font-mono uppercase tracking-wider">
                {lang === "en" ? "Admin Email" : "Email Admin"}
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  id="admin-email"
                  name="email"
                  autoComplete="username"
                  type="email"
                  required
                  placeholder="service@cargogrid.net"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="w-full nm-input bg-white rounded-xl pl-10 pr-4 py-3.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-teal transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="admin-password" className="text-xs text-slate-500 font-black font-mono uppercase tracking-wider">
                {lang === "en" ? "Password" : "Kata Sandi"}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  id="admin-password"
                  name="password"
                  autoComplete="current-password"
                  type="password"
                  required
                  placeholder="••••••••••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full nm-input bg-white rounded-xl pl-10 pr-4 py-3.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-teal transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-brand-teal text-white text-xs font-black rounded-xl cursor-pointer border-0 shadow-md hover:bg-brand-teal/95 transition-all mt-2 uppercase tracking-wider"
            >
              {isLoginSubmitting ? (lang === "en" ? "Signing in..." : "Memproses...") : (lang === "en" ? "Sign In →" : "Masuk →")}
            </button>
          </form>

          <button
            type="button"
            onClick={handleResetPassword}
            className="text-[11px] font-black text-brand-teal hover:underline"
          >
            {lang === "en" ? "Forgot password? Send reset email" : "Lupa password? Kirim email reset"}
          </button>

          {/* Credentials are managed by the secure auth provider, not hardcoded in the UI. */}
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-8 relative z-10" id="super-admin-portal">
      
      {/* Admin Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-black text-brand-orange uppercase tracking-[0.2em] block mb-1">
            CargoGrid Management Control
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Super Admin <span className="text-brand-teal">Portal</span>
          </h1>
          <p className="text-slate-500 text-xs font-semibold mt-1">
            Panel operasional untuk mengelola prospek, jadwal meeting, log email, dan pengaturan email CargoGrid.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-200/60 rounded-xl max-w-xl">
          <button
            onClick={() => setActiveTab("database")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all border-0 cursor-pointer ${
              activeTab === "database" 
                ? "bg-white text-slate-900 shadow-sm font-extrabold" 
                : "text-slate-600 hover:text-slate-900 hover:bg-white/30"
            }`}
          >
            Prospek
          </button>
          <button
            onClick={() => setActiveTab("meetings")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all border-0 cursor-pointer ${
              activeTab === "meetings" 
                ? "bg-white text-slate-900 shadow-sm font-extrabold" 
                : "text-slate-600 hover:text-slate-900 hover:bg-white/30"
            }`}
          >
            Jadwal Meeting
          </button>
          <button
            onClick={() => setActiveTab("outbox")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all border-0 cursor-pointer ${
              activeTab === "outbox" 
                ? "bg-white text-slate-900 shadow-sm font-extrabold" 
                : "text-slate-600 hover:text-slate-900 hover:bg-white/30"
            }`}
          >
            Log Email
          </button>
          <button
            onClick={() => setActiveTab("smtp")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all border-0 cursor-pointer ${
              activeTab === "smtp" 
                ? "bg-white text-slate-900 shadow-sm font-extrabold" 
                : "text-slate-600 hover:text-slate-900 hover:bg-white/30"
            }`}
          >
            Pengaturan Email
          </button>
        </div>
      </div>

      {/* Statistics Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { title: "TOTAL INQUIRY MASUK", val: statTotal, desc: "Lead pendaftaran awal", color: "text-slate-900", bg: "bg-slate-100" },
          { title: "DRAF KUESIONER", val: statDrafts, desc: "Draft dalam pengisian harian", color: "text-amber-600", bg: "bg-amber-500/5" },
          { title: "KUESIONER SELESAI", val: statCompleted, desc: "Siap dijadwalkan meeting", color: "text-brand-teal", bg: "bg-brand-teal/5" },
          { title: "MEETING CONFIRMED", val: statMeetings, desc: "Undangan & URL telah dikirim", color: "text-emerald-600", bg: "bg-emerald-500/5" }
        ].map((stat, idx) => (
          <div key={idx} className={`nm-emboss p-5 rounded-2xl border-0 ${stat.bg}`}>
            <span className="font-mono text-[9px] font-black text-slate-400 tracking-wider block">{stat.title}</span>
            <span className={`text-3xl font-black block mt-1 ${stat.color}`}>{stat.val}</span>
            <span className="text-[10px] text-slate-500 font-semibold mt-1 block">{stat.desc}</span>
          </div>
        ))}
      </div>

      {/* Main Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Tab 1: Prospek Table */}
        {activeTab === "database" && (
          <div className="lg:col-span-12 space-y-6">
            <div className="nm-emboss bg-white rounded-2xl p-5 border-0 flex flex-col sm:flex-row gap-4 items-center justify-between">
              {/* Filter components */}
              <div className="flex flex-1 items-center gap-3 w-full">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    id="admin-search"
                    name="adminSearch"
                    aria-label="Cari berdasarkan perusahaan, nama kontak, atau email"
                    type="text"
                    placeholder="Cari berdasarkan perusahaan, nama kontak, atau email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full nm-input bg-slate-50/50 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-brand-teal font-semibold text-slate-800"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select id="superadminportal-select-1" name="superadminportal-select-1" aria-label="superadminportal-select-1"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="nm-input bg-white text-slate-800 rounded-xl px-4 py-3 text-xs font-bold border-0 focus:outline-none cursor-pointer"
                  >
                    <option value="all">Semua Status</option>
                    <option value="Inquiry Masuk">Inquiry Masuk</option>
                    <option value="Draft Kuesioner">Draft Kuesioner</option>
                    <option value="Kuesioner Selesai">Kuesioner Selesai</option>
                    <option value="Meeting Scheduled">Meeting Scheduled</option>
                  </select>
                </div>
              </div>

              {onNavigateToQuestionnaire && (
                <button
                  onClick={() => onNavigateToQuestionnaire("")}
                  className="px-4 py-2.5 bg-brand-orange text-white text-xs font-black rounded-xl cursor-pointer border-0 flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Coba Isi Kuesioner Baru</span>
                </button>
              )}
            </div>

            {/* Main Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Dossier Cards Grid */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-black text-sm text-slate-800 uppercase tracking-wider">
                    Hasil Filter Prospek ({filteredInquiries.length})
                  </h3>
                  <span className="text-[10px] text-slate-400 font-bold font-mono">Klik baris data untuk melihat berkas kuesioner lengkap</span>
                </div>

                {filteredInquiries.length === 0 ? (
                  <div className="nm-deboss bg-slate-100 rounded-2xl py-12 text-center text-slate-400 text-xs font-bold">
                    Tidak ada dossier data prospek yang cocok dengan pencarian Anda.
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {filteredInquiries.map((inq) => {
                      const isSelected = selectedInquiry?.id === inq.id;
                      return (
                        <div
                          key={inq.id}
                          onClick={() => setSelectedInquiry(inq)}
                          className={`p-5 rounded-2xl border-0 cursor-pointer transition-all ${
                            isSelected 
                              ? "nm-emboss bg-slate-100 ring-2 ring-brand-teal" 
                              : "nm-emboss bg-white/50 hover:bg-white"
                          }`}
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div className="space-y-1">
                              <span className="text-[10px] bg-slate-200 text-slate-600 font-mono font-black px-1.5 py-0.5 rounded tracking-wide">
                                {getSektorLabel(inq.companyType)}
                              </span>
                              <h4 className="font-display font-black text-lg text-slate-900 mt-1">
                                PT {inq.company.replace(/^PT\s+/, "")}
                              </h4>
                              <p className="text-xs text-slate-600 font-bold">
                                {inq.name} <span className="text-slate-400 font-medium">• {inq.role}</span>
                              </p>
                              <div className="flex gap-4 text-[10px] font-semibold text-slate-400 pt-2 font-mono">
                                <span>Vol: <strong>{inq.shipmentVolume} shipment/bulan</strong></span>
                                <span>Pain: <strong className="text-red-500">{getPainLabel(inq.biggestPain)}</strong></span>
                              </div>
                            </div>

                            <div className="text-right flex flex-col items-end gap-1.5">
                              <span className={`text-[10px] font-mono font-black uppercase px-2 py-1 rounded-full ${
                                inq.status === "Meeting Scheduled" 
                                  ? "bg-emerald-100 text-emerald-700" 
                                  : inq.status === "Kuesioner Selesai" 
                                    ? "bg-brand-teal/15 text-brand-teal"
                                    : inq.status === "Draft Kuesioner"
                                      ? "bg-amber-100 text-amber-700 animate-pulse"
                                      : "bg-slate-100 text-slate-500"
                              }`}>
                                {inq.status}
                              </span>
                              <span className="text-[9px] text-slate-400 font-mono">
                                {new Date(inq.createdAt).toLocaleDateString("id-ID")}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Column: Active Dossier Questionnaire + Scheduler Detail */}
              <div className="lg:col-span-5">
                <AnimatePresence mode="wait">
                  {selectedInquiry ? (
                    <motion.div
                      key={selectedInquiry.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="nm-emboss bg-white rounded-3xl p-6 border-0 space-y-6 relative sticky top-24"
                    >
                      {/* Close detail */}
                      <button 
                        onClick={() => setSelectedInquiry(null)}
                        className="absolute top-4 right-4 p-1.5 rounded-lg nm-btn text-slate-400 hover:text-slate-700 flex items-center justify-center border-0 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      {/* Header */}
                      <div className="border-b border-slate-200 pb-4">
                        <span className="text-[10px] font-mono font-black text-brand-orange uppercase tracking-wider block">DETIL BERKAS PELANGGAN</span>
                        <h3 className="font-display font-black text-xl text-slate-900 mt-1">PT {selectedInquiry.company}</h3>
                        <div className="flex flex-col gap-1 text-[11px] font-semibold text-slate-500 mt-2">
                          <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-slate-400" /> Kontak: {selectedInquiry.name} ({selectedInquiry.role})</span>
                          <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> Phone: {selectedInquiry.phone} • Email: {selectedInquiry.email}</span>
                          {(selectedInquiry.utmSource || selectedInquiry.utmCampaign || selectedInquiry.utmMedium) && (
                            <div className="mt-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap gap-x-3 gap-y-1.5 text-[9px] text-slate-600 font-mono font-bold">
                              <span className="text-slate-400 text-[8px] uppercase tracking-wider block w-full mb-0.5">Campaign Attribution:</span>
                              {selectedInquiry.utmSource && <span>Source: <strong className="text-brand-orange">{selectedInquiry.utmSource}</strong></span>}
                              {selectedInquiry.utmMedium && <span>Medium: <strong className="text-brand-teal">{selectedInquiry.utmMedium}</strong></span>}
                              {selectedInquiry.utmCampaign && <span>Campaign: <strong className="text-indigo-600">{selectedInquiry.utmCampaign}</strong></span>}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Questionnaire Progress Assessment */}
                      <div className="space-y-4">
                        <h4 className="font-display font-black text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-brand-teal" />
                          <span>Hasil Pengisian Kuesioner Kustom</span>
                        </h4>

                        {!selectedInquiryQuestionnaire ? (
                          <div className="nm-deboss bg-slate-50 p-4.5 rounded-2xl text-xs space-y-2">
                            <div className="flex gap-2 text-amber-600 font-bold">
                              <AlertTriangle className="w-4 h-4" />
                              <span>Belum Ada Pengisian Kuesioner</span>
                            </div>
                            <p className="text-slate-500 leading-relaxed font-semibold">
                              Customer ini baru melakukan registrasi awal di landing page. Sistem telah mengirimi mereka link kuesioner detail ke email <strong className="text-slate-800">{selectedInquiry.email}</strong>.
                            </p>
                            {onNavigateToQuestionnaire && (
                              <button
                                onClick={() => onNavigateToQuestionnaire(selectedInquiry.id)}
                                className="w-full py-2 nm-btn text-brand-orange text-[10px] font-black rounded-lg uppercase tracking-wider flex items-center justify-center gap-1.5 mt-2 border-0 cursor-pointer"
                              >
                                <span>Bantu Isi Kuesioner Mewakili Customer &rarr;</span>
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {selectedInquiryQuestionnaire.isDraft ? (
                              <div className="p-3.5 bg-amber-500/[0.04] border border-amber-500/15 rounded-xl flex gap-2 items-center text-xs text-amber-700 font-semibold">
                                <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                                <span>Customer sedang mengisi berkas ini (Draft disimpan terakhir pada pkl {new Date(selectedInquiryQuestionnaire.lastSavedAt).toLocaleTimeString("id-ID")}).</span>
                              </div>
                            ) : (
                              <div className="p-3.5 bg-emerald-500/[0.04] border border-emerald-500/15 rounded-xl flex gap-2 items-center text-xs text-emerald-700 font-semibold">
                                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                <span>Kuesioner lengkap telah diserahkan pada {new Date(selectedInquiryQuestionnaire.submittedAt || "").toLocaleDateString("id-ID")}.</span>
                              </div>
                            )}

                            {/* Section breakdown Accordion Style */}
                            <div className="nm-deboss bg-slate-50/50 p-4 rounded-2xl text-xs space-y-4 max-h-72 overflow-y-auto">
                              
                              {/* Sektor 1 */}
                              <div className="space-y-1">
                                <span className="font-mono text-[9px] font-black text-slate-400 block uppercase">1. PROFIL OPERASIONAL</span>
                                <p className="font-bold text-slate-700">Rute: <span className="font-medium text-slate-600">{selectedInquiryQuestionnaire.primaryRoutes || "-"}</span></p>
                                <p className="font-bold text-slate-700">Kargo: <span className="font-medium text-slate-600">{(selectedInquiryQuestionnaire.cargoTypes || []).join(", ") || "-"}</span></p>
                                <p className="font-bold text-slate-700">Armada/Sub-vendor: <span className="font-medium text-slate-600">{selectedInquiryQuestionnaire.fleetSize || "-"} / {selectedInquiryQuestionnaire.vendorCount || "-"}</span></p>
                                {selectedInquiryQuestionnaire.totalExpectedUsers && (
                                  <p className="font-bold text-slate-700">Estimasi Pengguna: <span className="font-medium text-slate-600">{selectedInquiryQuestionnaire.totalExpectedUsers}</span></p>
                                )}
                                {selectedInquiryQuestionnaire.rolesInvolved && selectedInquiryQuestionnaire.rolesInvolved.length > 0 && (
                                  <p className="font-bold text-slate-700">Role Terlibat: <span className="font-medium text-slate-600">{(selectedInquiryQuestionnaire.rolesInvolved).map(r => r === "sales" ? "Sales" : r === "ops" ? "Ops/Dispatcher" : r === "finance" ? "Finance" : r === "warehouse" ? "Warehouse" : r === "driver" ? "Driver" : "Management").join(", ")}</span></p>
                                )}
                              </div>

                              {/* Sektor 2 */}
                              <div className="space-y-1 pt-2.5 border-t border-slate-200">
                                <span className="font-mono text-[9px] font-black text-slate-400 block uppercase">2. DIAGNOSA KENDALA & ALUR KERJA</span>
                                {selectedInquiryQuestionnaire.painRfqDetails && <p className="font-semibold text-slate-700 leading-relaxed"><strong>RFQ:</strong> &quot;{selectedInquiryQuestionnaire.painRfqDetails}&quot;</p>}
                                {selectedInquiryQuestionnaire.painDispatchDetails && <p className="font-semibold text-slate-700 leading-relaxed mt-1"><strong>Dispatch:</strong> &quot;{selectedInquiryQuestionnaire.painDispatchDetails}&quot;</p>}
                                {selectedInquiryQuestionnaire.painTrackingDetails && <p className="font-semibold text-slate-700 leading-relaxed mt-1"><strong>Tracking:</strong> &quot;{selectedInquiryQuestionnaire.painTrackingDetails}&quot;</p>}
                                {selectedInquiryQuestionnaire.painBillingDetails && <p className="font-semibold text-slate-700 leading-relaxed mt-1"><strong>Penagihan:</strong> &quot;{selectedInquiryQuestionnaire.painBillingDetails}&quot;</p>}
                                
                                {selectedInquiryQuestionnaire.existingCustomerFlow && (
                                  <p className="font-semibold text-slate-700 leading-relaxed mt-2 pt-2 border-t border-dashed border-slate-200"><strong>Alur Kerja Eksisting:</strong> &quot;{selectedInquiryQuestionnaire.existingCustomerFlow}&quot;</p>
                                )}
                                {selectedInquiryQuestionnaire.businessProcessSop && (
                                  <p className="font-semibold text-slate-700 leading-relaxed mt-1"><strong>Kondisi SOP:</strong> &quot;{selectedInquiryQuestionnaire.businessProcessSop}&quot;</p>
                                )}
                                {selectedInquiryQuestionnaire.topProblemImpact && (
                                  <p className="font-semibold text-slate-700 leading-relaxed mt-1 text-red-600"><strong>Dampak Kendala Terbesar:</strong> &quot;{selectedInquiryQuestionnaire.topProblemImpact}&quot;</p>
                                )}
                              </div>

                              {/* Sektor 3 */}
                              <div className="space-y-1 pt-2.5 border-t border-slate-200">
                                <span className="font-mono text-[9px] font-black text-slate-400 block uppercase">3. MODUL & INTEGRASI DIMINATI</span>
                                <p className="font-bold text-slate-700">Modul: <span className="font-medium text-slate-600">{(selectedInquiryQuestionnaire.desiredModules || []).map(m => getModuleLabel(m)).join(", ") || "-"}</span></p>
                                <p className="font-bold text-slate-700">Sistem ERP Internal: <span className="font-medium text-slate-600">{selectedInquiryQuestionnaire.erpSystem || "-"}</span></p>
                                {selectedInquiryQuestionnaire.customRequirements && <p className="font-semibold text-slate-700 leading-relaxed mt-1"><strong>Custom API:</strong> &quot;{selectedInquiryQuestionnaire.customRequirements}&quot;</p>}
                                {selectedInquiryQuestionnaire.specificRequests && <p className="font-semibold text-slate-700 leading-relaxed mt-1"><strong>Permintaan Khusus:</strong> &quot;{selectedInquiryQuestionnaire.specificRequests}&quot;</p>}
                              </div>

                              {/* Sektor 4 */}
                              <div className="space-y-1 pt-2.5 border-t border-slate-200">
                                <span className="font-mono text-[9px] font-black text-slate-400 block uppercase">4. PREFERENSI JADWAL MEETING CUSTOMER</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {selectedInquiryQuestionnaire.preferredSlots && selectedInquiryQuestionnaire.preferredSlots.length > 0 ? (
                                    selectedInquiryQuestionnaire.preferredSlots.map((slot, sIdx) => (
                                      <span key={sIdx} className="bg-brand-orange/10 text-brand-orange text-[10px] font-mono font-black px-2 py-1 rounded">
                                        {slot}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-slate-400 font-semibold">Belum memilih slot meeting.</span>
                                  )}
                                </div>
                                {selectedInquiryQuestionnaire.contactNotes && <p className="font-semibold text-slate-600 leading-relaxed mt-1.5"><strong>Catatan Delegasi:</strong> &quot;{selectedInquiryQuestionnaire.contactNotes}&quot;</p>}
                              </div>

                            </div>
                          </div>
                        )}
                      </div>

                      {/* Meeting Scheduler block */}
                      <div className="border-t border-slate-200 pt-5 space-y-4">
                        <h4 className="font-display font-black text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <CalendarCheck className="w-4 h-4 text-brand-orange" />
                          <span>Persetujuan & Penjadwalan Meeting Resmi</span>
                        </h4>

                        {selectedInquiry.status === "Meeting Scheduled" ? (
                          <div className="nm-deboss bg-emerald-500/[0.04] p-4.5 rounded-2xl text-xs space-y-2">
                            <span className="font-mono font-black text-emerald-600 uppercase block">STATUS: MEETING HAS BEEN SCHEDULED</span>
                            <p className="text-slate-700 font-semibold leading-relaxed">
                              Sistem telah mengirimkan konfirmasi undangan beserta URL link video meeting online ke email customer.
                            </p>
                            <div className="pt-2 flex flex-col gap-1 font-mono text-[10px] text-slate-500">
                              <span>Link: <a href={meetingUrl} target="_blank" className="text-brand-teal underline font-bold inline-flex items-center gap-1">{meetingUrl} <ExternalLink className="w-3 h-3" /></a></span>
                            </div>
                          </div>
                        ) : (
                          <form onSubmit={handleConfirmMeeting} className="space-y-4">
                            
                            {/* Preference Display Helper */}
                            {selectedInquiryQuestionnaire?.preferredSlots && selectedInquiryQuestionnaire.preferredSlots.length > 0 && (
                              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                                <span className="text-[10px] text-slate-400 font-black font-mono block">PILIKAN UTAMA CUSTOMER:</span>
                                {selectedInquiryQuestionnaire.preferredSlots.map((pref, pIdx) => (
                                  <button
                                    type="button"
                                    key={pIdx}
                                    onClick={() => {
                                      // Extract some simulated values
                                      setScheduledDate("2026-07-10");
                                      setScheduledTime(pIdx === 0 ? "10:00" : "14:00");
                                    }}
                                    className="w-full text-left p-1.5 hover:bg-slate-200 rounded text-[11px] font-bold text-slate-700 border-0 cursor-pointer flex justify-between items-center bg-transparent"
                                  >
                                    <span>{pref}</span>
                                    <span className="text-[9px] text-brand-teal font-black uppercase">PILIH &rarr;</span>
                                  </button>
                                ))}
                              </div>
                            )}

                            {/* Manual Schedulers */}
                            <div className="grid grid-cols-2 gap-3.5">
                              <div className="flex flex-col gap-1">
                                <label htmlFor="meeting-date" className="text-[10px] text-slate-500 font-black font-mono uppercase">Tanggal Pertemuan*</label>
                                <input
                                  id="meeting-date"
                                  name="meetingDate"
                                  type="date"
                                  required
                                  value={scheduledDate}
                                  onChange={(e) => setScheduledDate(e.target.value)}
                                  className="nm-input bg-white text-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-bold border-0 focus:outline-none"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label htmlFor="meeting-time" className="text-[10px] text-slate-500 font-black font-mono uppercase">Waktu/Jam (WIB)*</label>
                                <input
                                  id="meeting-time"
                                  name="meetingTime"
                                  type="time"
                                  required
                                  value={scheduledTime}
                                  onChange={(e) => setScheduledTime(e.target.value)}
                                  className="nm-input bg-white text-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-bold border-0 focus:outline-none"
                                />
                              </div>
                            </div>

                            {/* Platform */}
                            <div className="grid grid-cols-3 gap-2">
                              {["Google Meet", "Zoom", "Microsoft Teams"].map((plat) => (
                                <button
                                  type="button"
                                  key={plat}
                                  onClick={() => setPlatform(plat as Meeting['platform'])}
                                  className={`p-2 rounded-xl text-xs font-bold transition-all border-0 cursor-pointer ${
                                    platform === plat 
                                      ? "nm-emboss bg-brand-teal text-white" 
                                      : "nm-emboss bg-slate-50 text-slate-600"
                                  }`}
                                >
                                  {plat}
                                </button>
                              ))}
                            </div>

                            {/* Meeting URL */}
                            <div className="flex flex-col gap-1">
                              <label htmlFor="meeting-url" className="text-[10px] text-slate-500 font-black font-mono uppercase">URL Link Meeting Online*</label>
                              <div className="relative">
                                <Video className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-400" />
                                <input
                                  id="meeting-url"
                                  name="meetingUrl"
                                  type="url"
                                  required
                                  placeholder="Masukkan URL meeting"
                                  value={meetingUrl}
                                  onChange={(e) => setMeetingUrl(e.target.value)}
                                  className="w-full nm-input bg-white rounded-lg pl-9 pr-4 py-2.5 text-xs font-mono font-bold text-brand-teal focus:outline-none border-0"
                                />
                              </div>
                            </div>

                            {/* Internal notes */}
                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] text-slate-500 font-black font-mono uppercase">Catatan Konsultan Internal (Opsional)</label>
                              <textarea id="superadminportal-textarea-1" name="superadminportal-textarea-1" aria-label="superadminportal-textarea-1"
                                rows={2}
                                placeholder="Tulis catatan agenda meeting untuk tim..."
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                className="w-full nm-input bg-white rounded-lg px-3 py-2 text-xs font-medium focus:outline-none resize-none"
                              />
                            </div>

                            {/* Submit scheduling button */}
                            <button
                              type="submit"
                              className="w-full py-3 rounded-xl nm-btn-accent text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border-0 shadow-md"
                            >
                              <Send className="w-3.5 h-3.5 text-white" />
                              <span>Konfirmasi Jadwal & Kirim Undangan HTML</span>
                            </button>

                            {scheduleSuccess && (
                              <motion.p 
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center text-[11px] text-emerald-600 font-bold font-mono mt-1"
                              >
                                ✅ Undangan meeting terkirim ke customer! Cek outbox logs.
                              </motion.p>
                            )}
                          </form>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <div className="nm-emboss bg-slate-100 rounded-3xl p-10 text-center border-0 flex flex-col items-center justify-center h-96 gap-4 text-slate-400">
                      <Compass className="w-12 h-12 text-slate-300 animate-spin-slow" />
                      <div>
                        <h4 className="font-display font-black text-sm text-slate-700 uppercase tracking-wider">Pilih Prospek</h4>
                        <p className="text-xs text-slate-500 font-semibold mt-1 leading-relaxed max-w-xs mx-auto">
                          Pilih salah satu perusahaan di daftar kiri untuk melihat kendala operasional, rekap modul, serta menyetujui jadwal pertemuan.
                        </p>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>
        )}

        {/* Tab 2: Scheduled Meetings Agenda List */}
        {activeTab === "meetings" && (
          <div className="lg:col-span-12 space-y-4">
            <h3 className="font-display font-black text-sm text-slate-800 uppercase tracking-wider">
              Agenda Pertemuan Terkonfirmasi ({meetings.length})
            </h3>

            {meetings.length === 0 ? (
              <div className="nm-deboss bg-slate-100 rounded-2xl py-12 text-center text-slate-400 text-xs font-bold">
                Belum ada pertemuan konsultasi yang disetujui.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {meetings.map((meet) => {
                  const companyInq = inquiries.find(i => i.id === meet.inquiryId);
                  if (!companyInq) return null;

                  return (
                    <div key={meet.id} className="nm-emboss bg-white rounded-2xl p-5 border-0 flex flex-col justify-between gap-5 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-brand-teal" />
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase">
                            {meet.platform} Confirmed
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            ID: {meet.id.substr(5)}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-display font-black text-lg text-slate-900">
                            PT {companyInq.company}
                          </h4>
                          <p className="text-xs text-slate-500 font-semibold">
                            Koordinator: {companyInq.name} ({companyInq.role})
                          </p>
                        </div>

                        {/* Meeting Date Card */}
                        <div className="nm-deboss bg-slate-50 p-3 rounded-xl flex items-center gap-3">
                          <Clock className="w-5 h-5 text-brand-orange flex-shrink-0" />
                          <div className="text-xs">
                            <p className="font-extrabold text-slate-800">{new Date(meet.scheduledTime).toLocaleDateString("id-ID", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            <p className="text-[10px] text-slate-500 font-bold">Pukul {new Date(meet.scheduledTime).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })} WIB</p>
                          </div>
                        </div>

                        {meet.adminNotes && (
                          <p className="text-[11px] text-slate-500 italic leading-relaxed font-semibold">
                            &quot;{meet.adminNotes}&quot;
                          </p>
                        )}
                      </div>

                      {/* Direct launch link */}
                      <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-400">Kasbon & API siap diuji</span>
                        <a
                          href={meet.meetingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-black nm-btn bg-[#eef2f6] text-brand-teal hover:text-brand-teal-hover transition-colors cursor-pointer border-0"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Mulai Pertemuan</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Simulated Log Email with Interactive Webmail previewer */}
        {activeTab === "outbox" && (
          <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Outbox log list (Left column) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-black text-sm text-slate-800 uppercase tracking-wider">
                  Log Transmisi Email Sistem ({emails.length})
                </h3>
                <span className="text-[10px] text-slate-400 font-bold font-mono">Pilih baris untuk membuka pratinjau surat HTML</span>
              </div>

              <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-2">
                {emails.map((mail) => {
                  const isSelected = viewingEmail?.id === mail.id;
                  return (
                    <div
                      key={mail.id}
                      onClick={() => setViewingEmail(mail)}
                      className={`p-4 rounded-xl border-0 cursor-pointer transition-all ${
                        isSelected 
                          ? "nm-emboss bg-slate-100 ring-1 ring-brand-teal" 
                          : "nm-emboss bg-white/40 hover:bg-white"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="space-y-1">
                          <p className="text-[11px] font-bold text-slate-800">
                            To: <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1 py-0.5 rounded font-medium">{mail.to}</span>
                          </p>
                          <p className="text-xs font-black text-slate-900 mt-1.5 truncate max-w-sm">
                            {mail.subject}
                          </p>
                          <span className={`inline-block text-[9px] font-mono font-black px-2 py-0.5 rounded-full ${
                            mail.type.startsWith("admin") 
                              ? "bg-red-50 text-red-600" 
                              : "bg-brand-teal/10 text-brand-teal"
                          }`}>
                            {mail.type}
                          </span>
                        </div>
                        <span className="text-[9px] text-slate-400 font-mono whitespace-nowrap">
                          {new Date(mail.sentAt).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Simulated Email Client Preview panel (Right column) */}
            <div className="lg:col-span-6">
              <h3 className="font-display font-black text-sm text-slate-800 uppercase tracking-wider mb-4">
                Pratinjau HTML Webmail Client
              </h3>

              {viewingEmail ? (
                <div className="nm-emboss bg-slate-900 text-slate-300 rounded-3xl border-0 overflow-hidden flex flex-col h-[550px]" id="simulated-gmail-client">
                  
                  {/* Webmail application menu bar */}
                  <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-[10px] text-slate-500 font-mono font-black ml-2 uppercase tracking-widest">CargoGrid Email Log</span>
                    </div>
                    <span className="text-[9px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">LIVE METRIC TRIGGERED</span>
                  </div>

                  {/* Mail header parameters */}
                  <div className="p-4 bg-slate-900 border-b border-slate-800/80 text-xs space-y-1.5">
                    <p><span className="text-slate-500 font-bold font-mono">FROM:</span> <span className="text-slate-200">CargoGrid OS Automation &lt;service@cargogrid.net&gt;</span></p>
                    <p><span className="text-slate-500 font-bold font-mono">TO:</span> <span className="text-emerald-400 font-bold">{viewingEmail.to}</span></p>
                    <p><span className="text-slate-500 font-bold font-mono">SUBJECT:</span> <span className="text-white font-extrabold">{viewingEmail.subject}</span></p>
                    <p><span className="text-slate-500 font-bold font-mono">SENT AT:</span> <span className="text-slate-400">{new Date(viewingEmail.sentAt).toLocaleString("id-ID")}</span></p>
                  </div>

                  {/* HTML rendered body */}
                  <div className="flex-1 bg-white overflow-y-auto p-4 select-text">
                    <div 
                      className="origin-top scale-95 mx-auto"
                      dangerouslySetInnerHTML={{ __html: viewingEmail.htmlBody }} 
                    />
                  </div>

                </div>
              ) : (
                <div className="nm-deboss bg-slate-900 text-slate-500 rounded-3xl h-[550px] flex flex-col items-center justify-center text-center p-8 gap-3">
                  <Mail className="w-12 h-12 text-slate-800 animate-bounce" />
                  <div>
                    <h4 className="font-display font-black text-sm text-slate-400 uppercase tracking-wider">Simulasi Surat Belum Dipilih</h4>
                    <p className="text-[11px] text-slate-600 font-semibold max-w-xs mx-auto leading-relaxed mt-1">
                      Pilih salah satu log transmisi email di sebelah kiri untuk me-render format HTML email konfirmasi, notifikasi, atau undangan meeting secara visual.
                    </p>
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

        {/* Tab 4: Real SMTP Integration Settings & Code Generator */}
        {activeTab === "smtp" && (
          <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-8" id="smtp-setup-panel">
            
            {/* SMTP credentials input panel */}
            <div className="lg:col-span-5 space-y-6">
              <div className="nm-emboss bg-white rounded-3xl p-6 border-0">
                <div className="flex items-center gap-2 mb-4">
                  <Server className="w-5 h-5 text-brand-teal" />
                  <h3 className="font-display font-black text-base text-slate-900 tracking-tight">
                    Konfigurasi Pengaturan Email
                  </h3>
                </div>
                
                <p className="text-[11px] text-slate-500 font-semibold mb-5 leading-relaxed">
                  Nilai di bawah hanya untuk membuat template konfigurasi server. Kredensial asli wajib disimpan di environment variables backend, bukan di browser.
                </p>

                <form onSubmit={handleSaveSmtp} className="space-y-4">
                  
                  {/* Host and Port row */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2 flex flex-col gap-1">
                      <label htmlFor="smtp-host" className="text-[9px] text-slate-400 font-black font-mono uppercase">SMTP Host</label>
                      <input 
                        id="smtp-host"
                        name="smtpHost"
                        type="text" 
                        required
                        value={smtpHost}
                        onChange={(e) => setSmtpHost(e.target.value)}
                        placeholder="smtp.gmail.com"
                        className="w-full nm-input bg-slate-50 rounded-lg px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none border-0"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label htmlFor="smtp-port" className="text-[9px] text-slate-400 font-black font-mono uppercase">Port</label>
                      <input 
                        id="smtp-port"
                        name="smtpPort"
                        type="text" 
                        required
                        value={smtpPort}
                        onChange={(e) => setSmtpPort(e.target.value)}
                        placeholder="587"
                        className="w-full nm-input bg-slate-50 rounded-lg px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none border-0 text-center"
                      />
                    </div>
                  </div>

                  {/* Secure Toggle */}
                  <div className="flex items-center gap-2.5 py-1">
                    <input 
                      type="checkbox" 
                      id="smtpSecureCheckbox"
                      name="smtpSecure"
                      checked={smtpSecure}
                      onChange={(e) => setSmtpSecure(e.target.checked)}
                      className="w-4 h-4 rounded text-brand-teal border-slate-300 focus:ring-brand-teal cursor-pointer"
                    />
                    <label htmlFor="smtpSecureCheckbox" className="text-xs text-slate-600 font-bold cursor-pointer select-none">
                      Gunakan SSL/TLS Pengaman (Secure Connection Port 465)
                    </label>
                  </div>

                  {/* Username */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="smtp-user" className="text-[9px] text-slate-400 font-black font-mono uppercase">SMTP Username (Email Sender)</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 w-3.5 h-3.5 text-slate-400" />
                      <input 
                        id="smtp-user"
                        name="smtpUser"
                        autoComplete="username"
                        type="email" 
                        required
                        value={smtpUser}
                        onChange={(e) => setSmtpUser(e.target.value)}
                        placeholder="sender@yourcompany.com"
                        className="w-full nm-input bg-slate-50 rounded-lg pl-9 pr-4 py-2.5 text-xs font-mono font-bold text-slate-800 focus:outline-none border-0"
                      />
                    </div>
                  </div>

                  {/* Password / App Password */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="smtp-password" className="text-[9px] text-slate-400 font-black font-mono uppercase">SMTP Password / App Password</label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3.5 w-3.5 h-3.5 text-slate-400" />
                      <input 
                        id="smtp-password"
                        name="smtpPassword"
                        autoComplete="current-password"
                        type={showSmtpPass ? "text" : "password"} 
                        required
                        value={smtpPass}
                        onChange={(e) => setSmtpPass(e.target.value)}
                        placeholder="Masukkan password smtp"
                        className="w-full nm-input bg-slate-50 rounded-lg pl-9 pr-10 py-2.5 text-xs font-mono font-bold text-slate-800 focus:outline-none border-0"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSmtpPass(!showSmtpPass)}
                        className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 border-0 bg-transparent cursor-pointer"
                      >
                        {showSmtpPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Sender From Header Name */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="smtp-from" className="text-[9px] text-slate-400 font-black font-mono uppercase">Header FROM Name (Nama Pengirim)</label>
                    <input 
                      id="smtp-from"
                      name="smtpFrom"
                      type="text" 
                      required
                      value={smtpFrom}
                      onChange={(e) => setSmtpFrom(e.target.value)}
                      placeholder='CargoGrid OS <service@cargogrid.net>'
                      className="w-full nm-input bg-slate-50 rounded-lg px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none border-0"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-3 nm-btn bg-white text-slate-700 font-extrabold text-xs rounded-xl cursor-pointer border-0 shadow-sm"
                    >
                      Simpan Kredensial
                    </button>
                    <button
                      type="button"
                      disabled={isTestingSmtp}
                      onClick={handleTestSmtpConnection}
                      className="flex-1 py-3 nm-btn-accent text-white font-extrabold text-xs rounded-xl cursor-pointer border-0 shadow-md flex items-center justify-center gap-1.5"
                    >
                      <Terminal className="w-3.5 h-3.5 text-white" />
                      <span>{isTestingSmtp ? "Menguji..." : "Preview Handshake SMTP"}</span>
                    </button>
                  </div>

                  {smtpSaveSuccess && (
                    <p className="text-center text-[11px] font-bold font-mono text-emerald-600 animate-pulse">
                      ✅ Template konfigurasi SMTP siap disalin ke environment backend.
                    </p>
                  )}
                </form>
              </div>

              {/* Handshake Terminal Simulation */}
              <div className="nm-emboss bg-slate-950 rounded-3xl p-5 border border-slate-900 text-white min-h-[220px] flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-900 pb-2.5 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest">SMTP Connection Handshake Live Log</span>
                  </div>
                  <span className="text-[9px] text-slate-600 font-mono">localhost:smtp</span>
                </div>

                <div className="font-mono text-[10px] text-slate-400 space-y-1 overflow-y-auto max-h-[220px] flex-1 pr-1 custom-scrollbar">
                  {smtpStatusLog.length === 0 ? (
                    <div className="text-slate-600 italic py-8 text-center">
                      Belum ada aktivitas. Klik tombol test untuk melihat contoh handshake SMTP tanpa menyimpan kredensial di browser.
                    </div>
                  ) : (
                    smtpStatusLog.map((log, idx) => (
                      <p 
                        key={idx} 
                        className={
                          log.startsWith("✅") 
                            ? "text-emerald-400 font-black mt-1.5 bg-emerald-950/30 p-2 rounded" 
                            : log.includes("C:") 
                              ? "text-blue-400" 
                              : log.includes("S:") 
                                ? "text-amber-400" 
                                : "text-slate-300"
                        }
                      >
                        {log}
                      </p>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Integration reference block */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Environment Variable Setup Card */}
              <div className="nm-emboss bg-white rounded-3xl p-6 border-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-brand-orange" />
                    <h3 className="font-display font-black text-base text-slate-900 tracking-tight">
                      Langkah 1: Setup File .env Anda
                    </h3>
                  </div>
                  <span className="text-[9px] font-mono font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded">CONFIG FILE</span>
                </div>

                <p className="text-xs text-slate-500 font-semibold leading-relaxed mb-4">
                  Definisikan variabel rahasia SMTP Anda di server backend Anda (misal `.env` pada VPS atau konfigurasi environment di dashboard cloud panel seperti Cloud Run). Jangan mengekspos kredensial ini di file front-end browser demi keamanan.
                </p>

                <div className="relative">
                  <pre className="bg-slate-900 text-slate-300 font-mono text-[11px] p-4 rounded-xl overflow-x-auto select-all leading-relaxed">
{`# File: .env.example
SMTP_HOST=${smtpHost}
SMTP_PORT=${smtpPort}
SMTP_SECURE=${smtpSecure ? "true" : "false"}
SMTP_USER=${smtpUser}
SMTP_PASS=${smtpPass === "••••••••••••••••" ? "MASUKKAN_APP_PASSWORD_ATAU_PASS_SMTP_ANDA" : smtpPass}
SMTP_FROM="${smtpFrom}"`}
                  </pre>
                  <span className="absolute top-2.5 right-2.5 text-[8px] font-mono font-black text-slate-500 bg-slate-800 px-2 py-1 rounded select-none">COPY CODE</span>
                </div>
              </div>

              {/* Node.js integration script template card */}
              <div className="nm-emboss bg-white rounded-3xl p-6 border-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-display font-black text-base text-slate-900 tracking-tight">
                      Langkah 2: Boilerplate Code Pengiriman Otomatis
                    </h3>
                  </div>
                  <span className="text-[9px] font-mono font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded">NODE.JS CODE</span>
                </div>

                <p className="text-xs text-slate-500 font-semibold leading-relaxed mb-4">
                  Gunakan template kode standar di bawah pada modul server Node.js / Express Anda untuk mengaitkan event pendaftaran kuesioner dengan transmisi email otomatis:
                </p>

                <div className="relative">
                  <pre className="bg-slate-900 text-slate-300 font-mono text-[10px] p-4 rounded-xl overflow-x-auto max-h-[280px] overflow-y-auto leading-relaxed select-all">
{`import nodemailer from "nodemailer";

// Inisialisasi transporter SMTP yang aman
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "${smtpHost}",
  port: parseInt(process.env.SMTP_PORT || "${smtpPort}"),
  secure: process.env.SMTP_SECURE === "true", // true untuk port 465, false untuk port lainnya
  auth: {
    user: process.env.SMTP_USER || "${smtpUser}",
    pass: process.env.SMTP_PASS || "AppPasswordAnda"
  }
});

// Fungsi pengiriman email Welcome HTML otomatis ke Customer
export async function sendWelcomeEmail(customerEmail, customerName, tokenLink) {
  const mailOptions = {
    from: process.env.SMTP_FROM || '"CargoGrid OS" <service@cargogrid.net>',
    to: customerEmail,
    subject: "📋 Selamat Datang! Langkah Berikutnya: Melengkapi Profil Logistik CargoGrid Anda",
    html: \`
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #0f172a; margin-bottom: 8px;">Halo \${customerName},</h2>
        <p style="color: #475569; font-size: 14px; line-height: 1.5;">Pendaftaran awal Anda di CargoGrid OS berhasil. Untuk membantu kami mengonfigurasi modul operasional dan rute logistik Anda, silakan isi kuesioner di bawah ini:</p>
        <div style="margin: 24px 0; text-align: center;">
          <a href="\${tokenLink}" style="background: linear-gradient(to right, #f97316, #0d9488); color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; font-size: 14px; border-radius: 8px; display: inline-block;">Lengkapi Kuesioner Detail & Jadwal Meeting</a>
        </div>
        <p style="color: #64748b; font-size: 12px;">Hubungi tim konsultan kami jika Anda butuh bantuan lebih lanjut.</p>
      </div>
    \`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Welcome Email Sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Gagal mengirim email SMTP:", error);
    return { success: false, error: error.message };
  }
}`}
                  </pre>
                  <span className="absolute top-2.5 right-2.5 text-[8px] font-mono font-black text-slate-500 bg-slate-800 px-2 py-1 rounded select-none">COPY CODE</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

// Helpers duplicated for robust component isolated compile
function getSektorLabel(key: string): string {
  const map: Record<string, string> = {
    forwarder: "Freight Forwarding",
    '3pl': "3PL Warehouse",
    trucking: "Trucking Company",
    inhouse: "In-house Logistics (Shipper)",
    other: "Lainnya"
  };
  return map[key] || key;
}

function getPainLabel(key: string): string {
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

function getModuleLabel(key: string): string {
  const map: Record<string, string> = {
    commercial: "Commercial (RFQ, CRM)",
    ops: "Operations (TMS, Dispatch)",
    tracking: "Tracking (Visibility, Real-time)",
    finance: "Finance (Invoicing, Profitability)",
    warehouse: "Warehouse (WMS, Inventory)"
  };
  return map[key] || key;
}
