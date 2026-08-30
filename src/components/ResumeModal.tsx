import React, { useState } from "react";
import { 
  X, 
  Printer, 
  Download, 
  Copy, 
  Check, 
  Mail, 
  Phone,
  Github, 
  Linkedin, 
  ExternalLink, 
  FileText,
  MapPin,
  Edit3,
  Award,
  Briefcase,
  GraduationCap,
  Code2,
  Trophy,
  Globe,
  Layers,
  Sparkles
} from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import confetti from "canvas-confetti";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOwnerPortal?: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ 
  isOpen, 
  onClose,
  onOpenOwnerPortal 
}) => {
  const { profile, projects, skills, education, certifications, isOwner } = usePortfolio();
  const [copied, setCopied] = useState(false);
  const [resumeTemplate, setResumeTemplate] = useState<"modern" | "ats" | "executive">("modern");

  if (!isOpen) return null;

  const resumeSettings = profile.resumeSettings || {};
  const experiences = resumeSettings.experiences || [];
  const achievements = resumeSettings.achievements || [
    "Secured Top 5 Rank in State-Level AI/ML Hackathon for Smart Traffic Automation System",
    "Solved 250+ Algorithmic & Data Structure problems across LeetCode & HackerRank",
    "Awarded IBM Data Science Professional Certification with 95%+ assessment score",
    "Delivered hands-on workshop on 'Exploratory Data Analysis using Python & Pandas' for 80+ engineering students"
  ];
  const codingProfiles = resumeSettings.codingProfiles || [
    { platform: "GitHub", handle: "kishoreDS23", url: profile.social.github || "https://github.com/kishoreDS23", ratingOrRank: "15+ Repositories" },
    { platform: "LinkedIn", handle: "Mohan Mani Kishore", url: profile.social.linkedin || "https://linkedin.com", ratingOrRank: "500+ Connections" },
    { platform: "LeetCode", handle: "kishore_ai", url: "https://leetcode.com", ratingOrRank: "Top 15% in Python / SQL" },
    { platform: "HackerRank", handle: "kishore_ds", url: "https://hackerrank.com", ratingOrRank: "5★ SQL & Python Gold" },
    { platform: "Kaggle", handle: "manikishore", url: "https://kaggle.com", ratingOrRank: "Notebooks Expert" }
  ];

  // Projects filter
  const resumeProjects = projects.filter(p => p.includeInResume !== false).slice(0, 4);

  const handlePrint = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ["#06b6d4", "#3b82f6", "#10b981"],
    });
    window.print();
  };

  const handleCopyText = () => {
    const skillList = skills.map(s => `${s.name} (${s.category}, ${s.proficiency}%)`).join(", ");
    const expList = experiences.length > 0 
      ? experiences.map(e => `${e.role.toUpperCase()} — ${e.company} (${e.duration})\n  • ${e.description}\n  ${e.highlights.map(h => `• ${h}`).join("\n  ")}`).join("\n\n")
      : "";
    const certList = certifications.map(c => `• ${c.title} — ${c.issuer} (${c.issueDate}) [ID: ${c.credentialId}]`).join("\n");
    const projList = resumeProjects.map((p, idx) => `${idx + 1}. ${p.title} (${p.technologies.slice(0, 4).join(", ")})\n   • Problem: ${p.problem || p.shortDesc}\n   • Solution: ${p.solution || p.shortDesc}\n   • GitHub: ${p.githubUrl}`).join("\n\n");
    const achieveList = achievements.map(a => `• ${a}`).join("\n");

    const resumeText = `
===================================================================
${(profile.fullName || "MOHAN MANI KISHORE GODAVARTHI").toUpperCase()}
${profile.title || "Data Science Student & AI Engineer"}
Email: ${profile.social.email} | Phone: ${profile.phone || profile.social.phone || "+91 98765 43210"}
Location: ${profile.location} | Portfolio: ${profile.social.portfolio}
GitHub: ${profile.social.github} | LinkedIn: ${profile.social.linkedin}
===================================================================

CAREER OBJECTIVE:
${profile.careerObjective}

EDUCATION:
${education.institution} (${education.duration})
Degree: ${education.degree}
Specialization: ${education.specialization}
CGPA / Score: ${education.cgpa || "8.52 / 10 CGPA"} | Status: ${education.status}
${education.secondarySchool ? `Intermediate / Higher Secondary: ${education.secondarySchool.institution} (${education.secondarySchool.board}) — ${education.secondarySchool.score} (${education.secondarySchool.year})` : ""}
Relevant Coursework: ${education.keyCourses?.join(", ")}

${experiences.length > 0 ? `EXPERIENCE & INTERNSHIPS:\n${expList}\n` : ""}
TECHNICAL SKILLS & COMPETENCIES:
${skillList}

SELECTED TECHNICAL PROJECTS:
${projList}

CERTIFICATIONS & CREDENTIALS:
${certList}

HONORS & ACHIEVEMENTS:
${achieveList}

CODING & TECHNICAL PROFILES:
${codingProfiles.map(c => `• ${c.platform}: ${c.url} (${c.ratingOrRank || c.handle})`).join("\n")}
    `.trim();

    navigator.clipboard.writeText(resumeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Check if owner provided an uploaded file or external resume link
  const hasCustomResumeFile = Boolean(profile.resumeUrl && profile.resumeUrl !== "#resume-modal");
  const isUploadedDataUrl = profile.resumeUrl?.startsWith("data:");
  const isExternalUrl = profile.resumeUrl?.startsWith("http");

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      
      {/* Dynamic Print Styles for A4 Paper Export */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-resume-container, #printable-resume-container * {
            visibility: visible;
          }
          #printable-resume-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            background: #ffffff !important;
            color: #111827 !important;
            font-size: 11pt !important;
            line-height: 1.4 !important;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
          .print-text-dark {
            color: #0f172a !important;
          }
          .print-text-muted {
            color: #475569 !important;
          }
          .print-border {
            border-color: #cbd5e1 !important;
          }
          .print-bg-card {
            background: #f8fafc !important;
            border-color: #e2e8f0 !important;
            color: #0f172a !important;
          }
          .print-accent {
            color: #0284c7 !important;
          }
        }
      `}</style>

      <div className="bg-[#050505] border border-white/[0.1] w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[94vh]">
        
        {/* Header Toolbar */}
        <div className="p-4 bg-[#0a0a0d] border-b border-white/[0.08] flex items-center justify-between flex-wrap gap-2.5 no-print">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <FileText className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-white text-sm sm:text-base leading-tight">
                {profile.fullName || "Mohan Mani Kishore Godavarthi"} — Professional Resume
              </h3>
              <p className="text-[11px] font-mono text-neutral-400">
                Live Interactive ATS-Optimized Document • Fully Customizable
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            
            {/* Direct Option to Edit Everything in Owner Studio */}
            {onOpenOwnerPortal && (
              <button
                onClick={onOpenOwnerPortal}
                id="btn-edit-resume-owner-studio"
                className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                title="Edit every detail (Education, Experience, Projects, Skills, Contact info) in Owner Management Studio"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit in Owner Studio</span>
              </button>
            )}

            {/* Template switch */}
            <div className="hidden sm:flex items-center bg-[#111115] border border-white/[0.08] rounded-xl p-0.5 text-xs font-mono">
              <button
                onClick={() => setResumeTemplate("modern")}
                className={`px-2.5 py-1 rounded-lg transition-colors ${resumeTemplate === "modern" ? "bg-white/[0.12] text-white font-semibold" : "text-neutral-400 hover:text-neutral-200"}`}
              >
                Modern
              </button>
              <button
                onClick={() => setResumeTemplate("ats")}
                className={`px-2.5 py-1 rounded-lg transition-colors ${resumeTemplate === "ats" ? "bg-white/[0.12] text-white font-semibold" : "text-neutral-400 hover:text-neutral-200"}`}
              >
                ATS Clean
              </button>
              <button
                onClick={() => setResumeTemplate("executive")}
                className={`px-2.5 py-1 rounded-lg transition-colors ${resumeTemplate === "executive" ? "bg-white/[0.12] text-white font-semibold" : "text-neutral-400 hover:text-neutral-200"}`}
              >
                Executive
              </button>
            </div>

            {/* Custom Resume File Download */}
            {hasCustomResumeFile && (
              <a
                href={profile.resumeUrl}
                download={isUploadedDataUrl ? `${(profile.fullName || "Mani_Kishore").replace(/\s+/g, "_")}_Resume.pdf` : undefined}
                target={isExternalUrl ? "_blank" : undefined}
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-xs font-mono text-cyan-300 hover:bg-cyan-500/30 flex items-center gap-1.5 cursor-pointer shadow"
                title="Download uploaded custom resume file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isUploadedDataUrl ? "Uploaded PDF" : "Cloud Link"}</span>
              </a>
            )}

            <button
              onClick={handleCopyText}
              id="btn-copy-resume-text"
              className="px-3 py-1.5 rounded-xl bg-[#111115] border border-white/[0.08] text-xs font-mono text-neutral-300 hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Copy complete ATS plain-text resume to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied Text" : "Copy Plain Text"}</span>
            </button>

            <button
              onClick={handlePrint}
              id="btn-print-save-pdf"
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs font-mono flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
              title="Print document or Save as high-quality PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-[#111115] border border-white/[0.08] text-neutral-400 hover:text-white cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable & Scrollable Resume Sheet */}
        <div 
          id="printable-resume-container"
          className={`flex-1 overflow-y-auto p-6 sm:p-10 font-sans space-y-6 ${
            resumeTemplate === "ats" 
              ? "bg-[#090a0f] text-neutral-100 font-mono text-xs"
              : resumeTemplate === "executive"
              ? "bg-[#0c0d12] text-neutral-200"
              : "bg-[#0a0a0d] text-neutral-200"
          }`}
        >
          
          {/* Header Contact Block */}
          <div className="border-b border-white/[0.1] pb-5 space-y-2.5 print-border">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
              <div>
                <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight uppercase print-text-dark">
                  {profile.fullName || "MOHAN MANI KISHORE GODAVARTHI"}
                </h1>
                <p className="text-sm font-mono text-cyan-400 font-semibold print-accent mt-0.5">
                  {profile.title || "Data Science Student & AI Engineer"}
                  {profile.subtitle ? ` • ${profile.subtitle}` : ""}
                </p>
              </div>

              <div className="text-right font-mono text-xs text-neutral-400 print-text-muted">
                <div>{education.institution}</div>
                <div className="text-emerald-400 font-semibold print-accent">{education.duration} • {education.cgpa || "8.52 CGPA"}</div>
              </div>
            </div>

            {/* Contact Channels Bar */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-mono text-neutral-400 pt-2 border-t border-white/[0.04] print-border print-text-muted">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400 print-accent" />
                <a href={`mailto:${profile.social.email}`} className="hover:underline text-neutral-200 print-text-dark">{profile.social.email}</a>
              </span>

              {(profile.phone || profile.social.phone) && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-cyan-400 print-accent" />
                  <a href={`tel:${profile.phone || profile.social.phone}`} className="hover:underline text-neutral-200 print-text-dark">
                    {profile.phone || profile.social.phone}
                  </a>
                </span>
              )}

              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 print-accent" />
                <span className="text-neutral-200 print-text-dark">{profile.location}</span>
              </span>

              {profile.social.linkedin && (
                <span className="flex items-center gap-1.5">
                  <Linkedin className="w-3.5 h-3.5 text-cyan-400 print-accent" />
                  <a href={profile.social.linkedin} target="_blank" rel="noreferrer" className="hover:underline text-cyan-300 print-accent">LinkedIn Profile</a>
                </span>
              )}

              {profile.social.github && (
                <span className="flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5 text-cyan-400 print-accent" />
                  <a href={profile.social.github} target="_blank" rel="noreferrer" className="hover:underline text-cyan-300 print-accent">GitHub: {profile.social.github.split("/").pop()}</a>
                </span>
              )}

              {profile.social.portfolio && (
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-cyan-400 print-accent" />
                  <a href={profile.social.portfolio} target="_blank" rel="noreferrer" className="hover:underline text-neutral-200 print-text-dark">Live Portfolio</a>
                </span>
              )}
            </div>
          </div>

          {/* Section: Career Objective & Professional Statement */}
          <div className="space-y-1.5">
            <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-white/[0.08] pb-1 flex items-center gap-2 print-text-dark print-border">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 print-accent" />
              <span>Career Objective & Professional Summary</span>
            </h2>
            <p className="text-xs text-neutral-300 leading-relaxed print-text-dark">
              {profile.careerObjective}
            </p>
          </div>

          {/* Section: Education & Academics */}
          <div className="space-y-2.5">
            <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-white/[0.08] pb-1 flex items-center gap-2 print-text-dark print-border">
              <GraduationCap className="w-3.5 h-3.5 text-cyan-400 print-accent" />
              <span>Education & Academic Background</span>
            </h2>
            
            {/* Primary Degree */}
            <div className="p-3 rounded-xl bg-[#050505] border border-white/[0.06] space-y-1.5 print-bg-card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <strong className="text-white text-sm print-text-dark">{education.institution}</strong>
                  <div className="text-cyan-300 font-mono text-xs print-accent">{education.degree}</div>
                  <div className="text-[11px] text-neutral-400 print-text-muted">Specialization: {education.specialization}</div>
                </div>
                <div className="sm:text-right font-mono text-xs">
                  <div className="text-neutral-300 print-text-dark">{education.duration}</div>
                  <div className="text-emerald-400 font-bold print-accent">{education.cgpa || "8.52 / 10 CGPA"}</div>
                  <div className="text-[10px] text-neutral-400 print-text-muted">{education.status}</div>
                </div>
              </div>

              {/* Key coursework */}
              {education.keyCourses && education.keyCourses.length > 0 && (
                <div className="pt-2 border-t border-white/[0.04] text-[11px] print-border">
                  <span className="text-neutral-400 font-mono print-text-muted">Relevant Coursework: </span>
                  <span className="text-neutral-300 print-text-dark">{education.keyCourses.slice(0, 6).join(" • ")}</span>
                </div>
              )}
            </div>

            {/* Secondary Education if configured */}
            {education.secondarySchool && (
              <div className="p-3 rounded-xl bg-[#050505] border border-white/[0.06] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 text-xs print-bg-card">
                <div>
                  <strong className="text-neutral-200 print-text-dark">{education.secondarySchool.institution}</strong>
                  <div className="text-[11px] text-neutral-400 print-text-muted">Board: {education.secondarySchool.board}</div>
                </div>
                <div className="sm:text-right font-mono text-[11px]">
                  <span className="text-emerald-400 font-semibold print-accent">Score: {education.secondarySchool.score}</span>
                  <span className="text-neutral-400 ml-2 print-text-muted">({education.secondarySchool.year})</span>
                </div>
              </div>
            )}
          </div>

          {/* Section: Work Experience & Internships (if any) */}
          {experiences.length > 0 && (
            <div className="space-y-2.5">
              <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-white/[0.08] pb-1 flex items-center gap-2 print-text-dark print-border">
                <Briefcase className="w-3.5 h-3.5 text-cyan-400 print-accent" />
                <span>Experience & Technical Internships</span>
              </h2>
              {experiences.map((exp) => (
                <div key={exp.id} className="p-3 rounded-xl bg-[#050505] border border-white/[0.06] space-y-1.5 print-bg-card">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                    <div>
                      <strong className="text-white text-sm print-text-dark">{exp.role}</strong>
                      <span className="text-cyan-400 font-mono text-xs ml-2 print-accent">@ {exp.company}</span>
                      {exp.type && <span className="ml-2 px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 text-[10px] font-mono border border-cyan-500/20">{exp.type}</span>}
                    </div>
                    <div className="font-mono text-xs text-neutral-400 print-text-muted">
                      {exp.duration} {exp.location ? `• ${exp.location}` : ""}
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-xs text-neutral-300 leading-relaxed print-text-dark">
                      {exp.description}
                    </p>
                  )}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc list-inside text-xs text-neutral-300 space-y-0.5 pt-1 print-text-dark">
                      {exp.highlights.map((hl, hIdx) => (
                        <li key={hIdx}>{hl}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Section: Technical Competencies */}
          <div className="space-y-2.5">
            <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-white/[0.08] pb-1 flex items-center gap-2 print-text-dark print-border">
              <Code2 className="w-3.5 h-3.5 text-cyan-400 print-accent" />
              <span>Technical Skills & Competencies</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              {skills.map((s, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-[#050505] border border-white/[0.06] flex items-center justify-between print-bg-card">
                  <div>
                    <strong className="text-cyan-300 print-text-dark">{s.name}</strong>
                    <span className="text-[10px] text-neutral-400 block print-text-muted">{s.category}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 font-bold print-accent">{s.proficiency}%</span>
                    <div className="text-[9px] text-neutral-500 font-mono tracking-tighter hidden sm:block print-text-muted">
                      {s.asciiBar || "████████░░"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Selected Technical Projects */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-white/[0.08] pb-1 flex items-center gap-2 print-text-dark print-border">
              <Layers className="w-3.5 h-3.5 text-cyan-400 print-accent" />
              <span>Selected Technical Projects</span>
            </h2>
            <div className="space-y-2.5">
              {resumeProjects.map((p) => (
                <div key={p.id} className="p-3.5 rounded-xl bg-[#050505] border border-white/[0.06] space-y-1.5 print-bg-card">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white text-sm print-text-dark">{p.title}</span>
                      <span className="px-1.5 py-0.5 rounded bg-white/[0.04] text-[10px] font-mono text-cyan-400 border border-white/[0.08] print-accent">
                        {p.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-400 print-accent">
                      {p.githubUrl && (
                        <a 
                          href={p.githubUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="hover:underline flex items-center gap-1 text-cyan-300"
                        >
                          <Github className="w-3 h-3" />
                          <span>Source Code</span>
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="text-[11px] font-mono text-neutral-400 print-text-muted">
                    <strong className="text-neutral-300 print-text-dark">Tech Stack:</strong> {p.technologies.join(", ")}
                  </div>

                  <p className="text-neutral-300 text-xs leading-relaxed print-text-dark">
                    • <strong>Solution & Impact:</strong> {p.solution || p.shortDesc}
                  </p>

                  {p.metrics && p.metrics.length > 0 && (
                    <div className="flex flex-wrap gap-3 pt-1 text-[11px] font-mono text-emerald-400 print-accent">
                      {p.metrics.map((m, mIdx) => (
                        <span key={mIdx} className="bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          {m.label}: <strong>{m.value}</strong>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section: Certifications & Verified Credentials */}
          <div className="space-y-2.5">
            <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-white/[0.08] pb-1 flex items-center gap-2 print-text-dark print-border">
              <Award className="w-3.5 h-3.5 text-cyan-400 print-accent" />
              <span>Certifications & Verified Credentials</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {certifications.map((c) => (
                <div key={c.id} className="p-3 rounded-xl bg-[#050505] border border-white/[0.06] flex justify-between items-start print-bg-card">
                  <div>
                    <div className="font-semibold text-neutral-100 print-text-dark">{c.title}</div>
                    <div className="text-[10px] text-neutral-400 print-text-muted">
                      {c.issuer} {c.credentialId ? `• ID: ${c.credentialId}` : ""}
                    </div>
                    {c.verifyUrl && (
                      <a 
                        href={c.verifyUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[10px] font-mono text-cyan-400 hover:underline flex items-center gap-1 mt-1 print-accent"
                      >
                        <ExternalLink className="w-2.5 h-2.5" />
                        <span>Verify Credential</span>
                      </a>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 shrink-0 ml-2 print-accent">{c.issueDate}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Honors & Achievements */}
          {achievements.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-white/[0.08] pb-1 flex items-center gap-2 print-text-dark print-border">
                <Trophy className="w-3.5 h-3.5 text-cyan-400 print-accent" />
                <span>Honors, Hackathons & Key Achievements</span>
              </h2>
              <div className="p-3.5 rounded-xl bg-[#050505] border border-white/[0.06] space-y-1.5 print-bg-card">
                <ul className="list-disc list-inside text-xs text-neutral-300 space-y-1 print-text-dark">
                  {achievements.map((ach, idx) => (
                    <li key={idx} className="leading-relaxed">{ach}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Section: Coding & Technical Profiles */}
          {codingProfiles.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-white/[0.08] pb-1 flex items-center gap-2 print-text-dark print-border">
                <Globe className="w-3.5 h-3.5 text-cyan-400 print-accent" />
                <span>Coding & Professional Profiles</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                {codingProfiles.map((cp, idx) => (
                  <a
                    key={idx}
                    href={cp.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-[#050505] border border-white/[0.06] hover:border-cyan-500/40 hover:bg-[#0c0d12] transition-colors flex flex-col justify-between print-bg-card"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-300 font-bold print-text-dark">{cp.platform}</span>
                      <ExternalLink className="w-3 h-3 text-neutral-500 print-accent" />
                    </div>
                    <div className="text-[10px] text-neutral-400 mt-1 print-text-muted">{cp.ratingOrRank || cp.handle}</div>
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
