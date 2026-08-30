import React, { useState, useEffect } from "react";
import { PortfolioProvider } from "./context/PortfolioContext";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { AboutSection } from "./components/AboutSection";
import { EducationSection } from "./components/EducationSection";
import { SkillsSection } from "./components/SkillsSection";
import { ProjectsSection } from "./components/ProjectsSection";
import { CertificationsSection } from "./components/CertificationsSection";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import { AICopilotModal } from "./components/AICopilotModal";
import { ResumeModal } from "./components/ResumeModal";
import { OwnerPortalModal } from "./components/OwnerPortalModal";
import { Sparkles } from "lucide-react";
import { usePortfolio } from "./context/PortfolioContext";

function PortfolioMain() {
  const { theme } = usePortfolio();
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isOwnerPortalOpen, setIsOwnerPortalOpen] = useState(false);
  const [ownerPortalInitialTab, setOwnerPortalInitialTab] = useState<"auth" | "profile" | "resume" | "skills" | "certifications" | "projects" | "education">("resume");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrollProgress(totalHeight > 0 ? (currentScroll / totalHeight) * 100 : 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isMidnight = theme === "midnight";

  const handleOpenOwnerPortalWithTab = (tab: "auth" | "profile" | "resume" | "skills" | "certifications" | "projects" | "education" = "profile") => {
    setOwnerPortalInitialTab(tab);
    setIsOwnerPortalOpen(true);
  };

  return (
    <div 
      data-theme={theme}
      className={`min-h-screen transition-colors duration-500 selection:bg-cyan-500 selection:text-black relative font-sans ${
        isMidnight 
          ? "theme-midnight bg-[#030712] text-[#f0f6fc]" 
          : "theme-charcoal bg-[#050505] text-[#e5e5e5]"
      }`}
    >
      
      {/* Top Scroll Reading Progress Bar */}
      <div 
        className={`fixed top-0 left-0 h-[2px] z-50 transition-all duration-100 opacity-90 pointer-events-none ${
          isMidnight
            ? "bg-gradient-to-r from-sky-400 via-cyan-400 to-indigo-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]"
            : "bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400"
        }`}
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Navigation Bar */}
      <Navbar
        onOpenResume={() => setIsResumeOpen(true)}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        onOpenOwnerPortal={() => handleOpenOwnerPortalWithTab("profile")}
      />

      {/* Main Content Layout */}
      <main className="space-y-0">
        <Hero
          onOpenResume={() => setIsResumeOpen(true)}
          onOpenCopilot={() => setIsCopilotOpen(true)}
        />
        <AboutSection
          onOpenResume={() => setIsResumeOpen(true)}
          onOpenCopilot={() => setIsCopilotOpen(true)}
        />
        <EducationSection />
        <SkillsSection />
        <ProjectsSection />
        <CertificationsSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating AI Copilot Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsCopilotOpen(true)}
          id="btn-floating-ai-copilot"
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#111115]/90 hover:bg-[#18181d] text-[#e5e5e5] hover:text-white font-semibold font-mono text-xs shadow-2xl shadow-black/80 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-white/[0.15] hover:border-cyan-500/50 backdrop-blur-md"
          title="Chat with Mani Kishore's AI Assistant"
        >
          <div className="w-5 h-5 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          </div>
          <span className="hidden sm:inline">Ask AI Copilot</span>
          <span className="sm:hidden">AI Assistant</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </button>
      </div>

      {/* Interactive Modals */}
      <AICopilotModal
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
      />

      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        onOpenOwnerPortal={() => {
          setIsResumeOpen(false);
          handleOpenOwnerPortalWithTab("resume");
        }}
      />

      <OwnerPortalModal
        isOpen={isOwnerPortalOpen}
        initialTab={ownerPortalInitialTab}
        onClose={() => setIsOwnerPortalOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioMain />
    </PortfolioProvider>
  );
}
