import React, { useState } from "react";
import { Award, ExternalLink, CheckCircle2, ShieldCheck, FileCheck } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import { CertificationItem } from "../types";
import { ScrollReveal } from "./ScrollReveal";

export const CertificationsSection: React.FC = () => {
  const { certifications } = usePortfolio();

  return (
    <section id="certifications" className="py-28 bg-[#050505] relative border-t border-white/[0.08] text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        
        {/* Section Header */}
        <ScrollReveal direction="up" distance={30} duration={800} className="flex flex-col items-start mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] text-cyan-400 text-xs font-mono mb-3">
            <Award className="w-3.5 h-3.5" />
            <span className="tracking-widest uppercase">CERTIFICATIONS</span>
          </div>
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            CREDENTIALS & SPECIALIZATIONS
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mt-2 font-mono">
            Verified industry specializations in Machine Learning, Statistical Analysis, Data Engineering, and Advanced SQL.
          </p>
        </ScrollReveal>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certifications.map((cert, cIdx) => (
            <ScrollReveal 
              key={cert.id} 
              direction="up" 
              delay={120 + (cIdx % 4) * 80} 
              duration={800}
            >
              <div
                className="p-7 rounded-2xl bg-[#0a0a0d] border border-white/[0.08] hover:border-cyan-500/40 hover:bg-[#0d0d12] transition-all duration-300 flex flex-col justify-between space-y-5 group shadow-2xl h-full"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-mono border ${cert.badgeColor}`}>
                      {cert.issuer}
                    </span>
                    <span className="text-xs font-mono text-neutral-400">
                      Issued: {cert.issueDate}
                    </span>
                  </div>

                  <h3 
                    className="font-bold text-xl text-white group-hover:text-cyan-300 transition-colors"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {cert.title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Credential ID: <strong className="text-neutral-200">{cert.credentialId}</strong></span>
                  </div>

                  {/* Skills acquired */}
                  <div className="pt-2">
                    <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block mb-2">
                      Covered Competencies:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cert.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2.5 py-1 rounded bg-white/[0.04] text-[11px] font-mono text-neutral-300 border border-white/[0.06]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verified Credential</span>
                  </span>

                  <a
                    href={cert.verifyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono text-cyan-400 hover:text-white flex items-center gap-1.5 font-semibold uppercase tracking-wider"
                  >
                    <span>Verify Issuer</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
};
