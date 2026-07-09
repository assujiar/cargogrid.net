import React, { useState, useEffect } from "react";
import Logo from "./Logo";
import { Menu, X, ShieldCheck, Globe } from "lucide-react";

interface NavbarProps {
  lang: 'id' | 'en';
  setLang: (l: 'id' | 'en') => void;
}

export default function Navbar({ lang, setLang }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        isScrolled || setIsScrolled(true);
      } else {
        !isScrolled || setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolled]);

  const isEn = lang === 'en';

  const navLinks = isEn ? [
    { name: "Home", href: "#" },
    { name: "Challenges", href: "#challenges" },
    { name: "System & Modules", href: "#system" },
    { name: "Simulator & ROI", href: "#simulator" },
    { name: "Plans & FAQ", href: "#plans" },
    { name: "Contact", href: "#contact" },
  ] : [
    { name: "Home", href: "#" },
    { name: "Tantangan", href: "#challenges" },
    { name: "Sistem & Modul", href: "#system" },
    { name: "Simulator & ROI", href: "#simulator" },
    { name: "Paket & FAQ", href: "#plans" },
    { name: "Kontak", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-3"
          : "py-5"
      }`}
      id="site-header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`transition-all duration-300 px-6 py-3 rounded-2xl flex items-center justify-between ${
          isScrolled
            ? "nm-emboss bg-[#eaf0f6]/90 backdrop-blur-md"
            : "bg-transparent"
        }`}>
          {/* Logo */}
          <a href="#" className="flex-shrink-0 transition-transform duration-200 hover:scale-[1.02]">
            <Logo size="md" />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-xs lg:text-sm text-slate-600 font-semibold hover:text-brand-teal transition-all duration-150 rounded-lg hover:bg-white/40"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action Button & Language Switcher Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Elegant Language Switcher Toggle */}
            <div className="flex items-center bg-slate-200/50 p-1 rounded-full border border-slate-300/30 gap-0.5" title="Ganti bahasa / Switch language">
              <Globe className="w-3.5 h-3.5 text-slate-400 mx-1.5" />
              <button
                onClick={() => setLang('id')}
                className={`px-2.5 py-1 text-[10px] font-mono font-black rounded-full transition-all cursor-pointer ${
                  lang === 'id' 
                    ? "bg-brand-teal text-white shadow-sm" 
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                ID
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 text-[10px] font-mono font-black rounded-full transition-all cursor-pointer ${
                  lang === 'en' 
                    ? "bg-brand-teal text-white shadow-sm" 
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                EN
              </button>
            </div>

            <a
              href="#contact"
              className="px-5 py-2.5 nm-btn-accent rounded-full font-extrabold text-xs shadow-md flex items-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>{isEn ? "Book System Audit" : "Audit Sistem Gratis"}</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-3">
            {/* Mobile quick language picker */}
            <div className="flex items-center bg-slate-200/50 p-0.5 rounded-full border border-slate-300/30">
              <button
                onClick={() => setLang('id')}
                className={`px-2 py-0.5 text-[9px] font-mono font-black rounded-full transition-all ${
                  lang === 'id' 
                    ? "bg-brand-teal text-white" 
                    : "text-slate-500"
                }`}
              >
                ID
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-0.5 text-[9px] font-mono font-black rounded-full transition-all ${
                  lang === 'en' 
                    ? "bg-brand-teal text-white" 
                    : "text-slate-500"
                }`}
              >
                EN
              </button>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-brand-teal nm-btn flex items-center justify-center focus:outline-none transition-colors duration-150"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Sidebar/Dropdown */}
      {isOpen && (
        <div className="lg:hidden mx-4 mt-2 p-4 rounded-2xl nm-emboss bg-[#eaf0f6]/95 backdrop-blur-lg transition-transform duration-200">
          <div className="space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:text-brand-teal hover:bg-white/50 transition-all"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 border-t border-slate-200/60 space-y-3">
              <div className="flex justify-between items-center px-4">
                <span className="text-xs text-slate-500 font-bold flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> Language / Bahasa
                </span>
                <div className="flex bg-slate-200 p-0.5 rounded-full">
                  <button
                    onClick={() => { setLang('id'); setIsOpen(false); }}
                    className={`px-3 py-1 text-xs font-mono font-black rounded-full ${lang === 'id' ? 'bg-brand-teal text-white' : 'text-slate-600'}`}
                  >
                    Indonesian
                  </button>
                  <button
                    onClick={() => { setLang('en'); setIsOpen(false); }}
                    className={`px-3 py-1 text-xs font-mono font-black rounded-full ${lang === 'en' ? 'bg-brand-teal text-white' : 'text-slate-600'}`}
                  >
                    English
                  </button>
                </div>
              </div>
              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-full text-sm font-extrabold nm-btn-accent"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>{isEn ? "Book System Audit" : "Audit Sistem Gratis"}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
