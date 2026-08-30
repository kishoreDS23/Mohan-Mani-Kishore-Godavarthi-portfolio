import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Menu, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Edit3
} from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

interface NavbarProps {
  onOpenResume: () => void;
  onOpenCopilot: () => void;
  onOpenOwnerPortal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenResume, onOpenCopilot, onOpenOwnerPortal }) => {
  const { profile, isOwner } = usePortfolio();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ["hero", "about", "education", "skills", "projects", "certifications", "contact"];
      const scrollPosition = window.scrollY + 220;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "HOME", href: "#hero", id: "hero" },
    { label: "ABOUT", href: "#about", id: "about" },
    { label: "EDUCATION", href: "#education", id: "education" },
    { label: "SKILLS", href: "#skills", id: "skills" },
    { label: "PROJECTS", href: "#projects", id: "projects" },
    { label: "CERTIFICATIONS", href: "#certifications", id: "certifications" },
    { label: "CONTACT", href: "#contact", id: "contact" },
  ];

  return (
    <header 
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "border-b border-white/[0.08] shadow-2xl shadow-black/90 py-2.5 sm:py-3 bg-black/85" 
          : "py-3 sm:py-4 bg-black/40"
      }`}
      style={{
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex items-center justify-between">
        
        {/* Left: Brand Monogram Symbol & Name */}
        <a 
          href="#hero" 
          id="nav-brand-logo"
          className="flex items-center gap-3 group no-underline"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 via-teal-400 to-emerald-400 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-[11px] bg-[#0c0c10] flex items-center justify-center text-white font-mono font-bold text-xs tracking-wider">
              {profile.symbol || "M²KG"}
            </div>
          </div>
          <div className="flex flex-col">
            <span 
              className="font-extrabold text-sm sm:text-base text-white tracking-widest group-hover:text-cyan-300 transition-colors uppercase"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {profile.name || "KISHORE"}
            </span>
            <span className="text-[9px] font-mono text-cyan-400/80 tracking-widest -mt-0.5 uppercase">
              DATA SCIENCE & AI
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/[0.04] border border-white/[0.08] rounded-full px-4 py-1.5 backdrop-blur-xl">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              id={`nav-link-${link.id}`}
              className={`px-3 py-1 text-[11px] font-mono tracking-wider transition-all duration-200 rounded-full ${
                activeSection === link.id
                  ? "bg-white text-black font-bold shadow-sm"
                  : "text-neutral-300 hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Owner Mode Button */}
          <button
            id="nav-btn-owner"
            onClick={onOpenOwnerPortal}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-full transition-all duration-200 cursor-pointer ${
              isOwner
                ? "bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60 shadow-sm"
                : "bg-white/[0.05] border border-white/[0.1] text-neutral-300 hover:text-white hover:border-cyan-500/40"
            }`}
            title="Owner Portal"
          >
            {isOwner ? (
              <>
                <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Owner Mode</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Owner Access</span>
              </>
            )}
          </button>

          {/* AI Copilot Button */}
          <button
            id="nav-btn-copilot"
            onClick={onOpenCopilot}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono bg-white/[0.05] border border-white/[0.1] text-neutral-200 rounded-full hover:border-cyan-500/40 hover:text-white transition-all duration-200 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>AI Copilot</span>
          </button>

          {/* Resume Button */}
          <button
            id="nav-btn-resume"
            onClick={onOpenResume}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-mono font-bold bg-white hover:bg-neutral-200 text-black rounded-full transition-all duration-200 cursor-pointer shadow-lg hover:scale-105 active:scale-95"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>RESUME</span>
          </button>
        </div>

        {/* Mobile Hamburger Trigger */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            id="nav-mobile-resume-btn"
            onClick={onOpenResume}
            className="px-3 py-1 text-[11px] font-mono font-bold bg-white text-black rounded-full"
          >
            RESUME
          </button>
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-300 hover:text-white bg-white/[0.06] border border-white/[0.1] rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-black/95 border-b border-white/[0.1] px-6 py-4 backdrop-blur-2xl mt-2 space-y-2 animate-in fade-in slide-in-from-top-3">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 text-xs font-mono tracking-wider rounded-lg ${
                activeSection === link.id
                  ? "bg-white text-black font-bold"
                  : "text-neutral-300 hover:bg-white/[0.08]"
              }`}
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-white/[0.08] flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCopilot();
              }}
              className="w-full py-2.5 text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded-lg flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI Career Copilot</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOwnerPortal();
              }}
              className="w-full py-2 text-xs font-mono bg-white/[0.05] text-neutral-300 border border-white/[0.1] rounded-lg flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Owner Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
