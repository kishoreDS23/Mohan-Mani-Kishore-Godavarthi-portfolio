import React from "react";
import { ArrowUp, Github, Linkedin, Mail } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

export const Footer: React.FC = () => {
  const { profile } = usePortfolio();
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="py-14 bg-[#050505] border-t border-white/[0.08] text-xs font-mono text-neutral-400">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Brand Monogram & Name */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center font-bold text-cyan-300 text-xs font-mono">
            {profile.symbol || "M²KG"}
          </div>
          <div className="flex flex-col">
            <span 
              className="font-extrabold text-white text-sm tracking-wider uppercase"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {profile.name || "KISHORE"}
            </span>
            <span className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider">
              DATA SCIENCE • AI/ML • TECHNOLOGY
            </span>
          </div>
        </div>

        {/* Center: Social Links */}
        <div className="flex items-center gap-4">
          <a
            href={profile.social.github}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-neutral-300 hover:text-white hover:border-cyan-500/40 transition-colors"
            title="GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href={profile.social.linkedin}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-neutral-300 hover:text-white hover:border-cyan-500/40 transition-colors"
            title="LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href={`mailto:${profile.social.email}`}
            className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-neutral-300 hover:text-white hover:border-cyan-500/40 transition-colors"
            title="Email"
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>

        {/* Right: Back to Top */}
        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.1] text-neutral-300 hover:text-white hover:bg-white/[0.1] transition-all cursor-pointer font-mono text-xs uppercase tracking-wider"
        >
          <span>BACK TO TOP</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>

      </div>
      
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 mt-8 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 gap-2">
        <div>
          &copy; {new Date().getFullYear()} {profile.name} ({profile.fullName}). All rights reserved.
        </div>
        <div className="font-mono text-neutral-400">
          Built with React, TypeScript & Tailwind CSS • Powered by Google Gemini
        </div>
      </div>
    </footer>
  );
};
