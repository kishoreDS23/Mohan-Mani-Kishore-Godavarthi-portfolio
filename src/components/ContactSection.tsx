import React, { useState } from "react";
import { 
  Mail, 
  Send, 
  Github, 
  Linkedin, 
  Copy, 
  Check, 
  Sparkles, 
  MessageSquare, 
  MapPin, 
  Phone,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import { ScrollReveal } from "./ScrollReveal";
import confetti from "canvas-confetti";

export const ContactSection: React.FC = () => {
  const { profile } = usePortfolio();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Opportunity for Data Science / AI Role");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    // Generate mailto link
    const mailtoUrl = `mailto:${profile.social.email}?subject=${encodeURIComponent(
      `[Portfolio Inquiry] ${subject}`
    )}&body=${encodeURIComponent(
      `Hi Mani Kishore,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    )}`;

    window.open(mailtoUrl, "_blank");

    setSubmitted(true);
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#06b6d4", "#3b82f6", "#10b981"],
    });

    setTimeout(() => {
      setName("");
      setEmail("");
      setMessage("");
      setSubmitted(false);
    }, 4000);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.social.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <section id="contact" className="py-24 bg-[#050505] relative border-t border-white/[0.08]">
      
      {/* Subtle Ambient Light */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Banner Heading Matching Wireframe */}
        <ScrollReveal direction="up" distance={30} duration={800} className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111115] border border-white/[0.1] text-cyan-400 text-xs font-mono mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>GET IN TOUCH</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white font-heading tracking-tight">
            LET'S BUILD SOMETHING INTELLIGENT.
          </h2>
          <p className="text-neutral-400 text-base max-w-xl mx-auto">
            Available for Summer 2025 – 2027 Data Science internships, research collaborations, and full-time opportunities.
          </p>
        </ScrollReveal>

        {/* 2-Column Contact Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Direct Connect & Channels */}
          <ScrollReveal direction="up" delay={150} duration={800} className="lg:col-span-5 space-y-6">
            
            {/* Quick Contact Card */}
            <div className="p-7 rounded-3xl bg-[#0a0a0d] border border-white/[0.08] space-y-6">
              <h3 className="font-heading font-bold text-xl text-white">
                Direct Channels
              </h3>

              <div className="space-y-4 font-mono text-xs">
                
                {/* Email Box */}
                <div className="p-4 rounded-2xl bg-[#050505] border border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-neutral-500 text-[10px]">EMAIL ADDRESS</div>
                      <div className="text-white font-medium text-xs sm:text-sm">{profile.social.email}</div>
                    </div>
                  </div>

                  <button
                    onClick={handleCopyEmail}
                    className="p-2 rounded-lg bg-[#111115] border border-white/[0.08] text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    title="Copy Email"
                  >
                    {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Location Box */}
                <div className="p-4 rounded-2xl bg-[#050505] border border-white/[0.06] flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#111115] text-neutral-300">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-neutral-500 text-[10px]">LOCATION</div>
                    <div className="text-white font-medium">{profile.location}</div>
                  </div>
                </div>

              </div>

              {/* Social Channels */}
              <div className="pt-2 space-y-3">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider block">
                  Connect on Social & Open Source:
                </span>
                
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={profile.social.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-xl bg-[#050505] border border-white/[0.06] hover:border-white/[0.2] text-neutral-200 flex items-center gap-2.5 text-xs font-mono transition-colors"
                  >
                    <Github className="w-4 h-4 text-neutral-300" />
                    <span>GitHub</span>
                    <ExternalLink className="w-3 h-3 ml-auto text-neutral-500" />
                  </a>

                  <a
                    href={profile.social.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-xl bg-[#050505] border border-white/[0.06] hover:border-white/[0.2] text-neutral-200 flex items-center gap-2.5 text-xs font-mono transition-colors"
                  >
                    <Linkedin className="w-4 h-4 text-blue-400" />
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3 h-3 ml-auto text-neutral-500" />
                  </a>
                </div>
              </div>

            </div>

            {/* Quick Status Pill */}
            <div className="p-5 rounded-2xl bg-[#0a0a0d] border border-emerald-500/30 text-xs font-mono text-emerald-300 flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Currently reviewing Summer 2025 / 2026 technical internships. Fast email turnaround within 24 hours.</span>
            </div>

          </ScrollReveal>

          {/* Right Column: Interactive Contact Form */}
          <ScrollReveal direction="up" delay={250} duration={800} className="lg:col-span-7">
            <div className="p-7 sm:p-9 rounded-3xl bg-[#0a0a0d] border border-white/[0.08] backdrop-blur-sm">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 font-mono text-xs">
                    <label className="text-neutral-300">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Satya Nadella"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#050505] border border-white/[0.08] rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white font-sans"
                    />
                  </div>

                  <div className="space-y-1.5 font-mono text-xs">
                    <label className="text-neutral-300">Your Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. recruiter@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#050505] border border-white/[0.08] rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 font-mono text-xs">
                  <label className="text-neutral-300">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-[#050505] border border-white/[0.08] rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white font-sans"
                  />
                </div>

                <div className="space-y-1.5 font-mono text-xs">
                  <label className="text-neutral-300">Message / Opportunity Details *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell Mani Kishore about your project, team, role, or technical collaboration..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-[#050505] border border-white/[0.08] rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white font-sans resize-none"
                  />
                </div>

                <button
                  type="submit"
                  id="btn-send-contact"
                  className="w-full py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs font-mono tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.01] cursor-pointer"
                >
                  <span>SEND MESSAGE TO MANI KISHORE</span>
                  <Send className="w-4 h-4" />
                </button>

                {submitted && (
                  <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono text-center animate-in fade-in">
                    ✓ Your email client has been launched with the prefilled message. Mani Kishore looks forward to speaking with you!
                  </div>
                )}

              </form>
            </div>
          </ScrollReveal>

        </div>

      </div>
    </section>
  );
};
