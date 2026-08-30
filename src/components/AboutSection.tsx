import React from "react";
import { 
  User, 
  Target, 
  Sparkles, 
  MapPin, 
  Mail, 
  Calendar, 
  Cpu, 
  Database,
  LineChart,
  ArrowUpRight,
  BrainCircuit,
  Award,
  CheckCircle2,
  Workflow
} from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import { ScrollReveal } from "./ScrollReveal";
import defaultPortrait from "../assets/images/regenerated_image_1788073386402.png";

interface AboutSectionProps {
  onOpenResume: () => void;
  onOpenCopilot: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenResume, onOpenCopilot }) => {
  const { profile } = usePortfolio();

  const coreFocusAreas = [
    {
      icon: Database,
      title: "Data Engineering & Pipelines",
      desc: "Developing automated data ingestion, cleaning, deduplication and validation pipelines with Python and Pandas.",
    },
    {
      icon: BrainCircuit,
      title: "Machine Learning & AI",
      desc: "Building predictive models, classification algorithms, and feature analysis with Scikit-learn and XGBoost.",
    },
    {
      icon: Cpu,
      title: "Computer Vision & Edge AI",
      desc: "Real-time object detection and queue density estimation using YOLOv8 and OpenCV for smart urban systems.",
    },
    {
      icon: LineChart,
      title: "Data Analytics & BI",
      desc: "Synthesizing executive dashboards, exploratory data analysis, and time-series metrics via Power BI and SQL.",
    },
  ];

  return (
    <section id="about" className="py-28 bg-[#050505] relative border-t border-white/[0.08] text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        
        {/* Section Header */}
        <ScrollReveal direction="up" distance={30} duration={800} className="flex flex-col items-start mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] text-cyan-400 text-xs font-mono mb-3">
            <User className="w-3.5 h-3.5" />
            <span className="tracking-widest uppercase">ABOUT ME</span>
          </div>
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            DATA SCIENCE & INTELLIGENT SYSTEMS
          </h2>
          <p className="text-neutral-400 text-base max-w-2xl mt-2 font-mono text-sm">
            Bridging rigorous statistical modeling with scalable, real-world software engineering.
          </p>
        </ScrollReveal>

        {/* Split Layout: Left Visual Portrait & Stats, Right Text Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Visual Identity & Key Statistics */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Visual Portrait Frame with Cinematic Glow */}
            <ScrollReveal direction="up" delay={100} duration={850}>
              <div className="relative rounded-2xl overflow-hidden bg-[#0c0c10] border border-white/[0.1] p-1 shadow-2xl group">
                <div className="relative w-full aspect-[4/5] rounded-[14px] overflow-hidden bg-gradient-to-b from-[#111116] to-[#08080a]">
                  
                  {/* Tech background graphic / poster with high-tech holographic overlay */}
                  <img
                    id="about-portrait-img"
                    src={
                      profile.profileImage && !profile.profileImage.includes("unsplash.com")
                        ? profile.profileImage
                        : defaultPortrait
                    }
                    alt={profile.fullName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-700 brightness-105 contrast-105"
                  />

                  {/* Cyberpunk Holographic HUD Floating Code Screens */}
                  <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between">
                    {/* Top Left Floating Code Badge */}
                    <div className="self-start p-2 rounded-lg bg-black/75 border border-cyan-500/40 backdrop-blur-md shadow-lg max-w-[200px] text-[9px] font-mono text-cyan-300 space-y-0.5 animate-in fade-in duration-500">
                      <div className="text-[8px] text-cyan-400 font-bold flex items-center gap-1 border-b border-cyan-500/20 pb-0.5 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        <span>MODEL_PIPELINE.PY</span>
                      </div>
                      <div className="text-neutral-300">import pandas as pd</div>
                      <div className="text-cyan-400 font-semibold">from sklearn import LinearRegression</div>
                      <div className="text-emerald-400">model.fit(X_train, y_train)</div>
                    </div>

                    {/* Top Right Floating SQL Analytics Badge */}
                    <div className="self-end p-2 rounded-lg bg-black/75 border border-cyan-500/40 backdrop-blur-md shadow-lg max-w-[180px] text-[9px] font-mono text-cyan-300 space-y-0.5">
                      <div className="text-[8px] text-cyan-400 font-bold flex items-center gap-1 border-b border-cyan-500/20 pb-0.5 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>ANALYTICS_QUERY.SQL</span>
                      </div>
                      <div className="text-neutral-300">SELECT DATE_TRUNC('month')</div>
                      <div className="text-cyan-300">SUM(amount) AS total_sales</div>
                      <div className="text-emerald-400 font-bold">4,829 Orders • $982K</div>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />

                  {/* Overlaid Monogram & Name Tag */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/70 border border-white/[0.15] backdrop-blur-xl flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase">
                        {profile.symbol} • PROFILE
                      </div>
                      <div className="font-extrabold text-white text-base font-mono">
                        {profile.fullName}
                      </div>
                      <div className="text-xs text-neutral-300 font-mono">
                        {profile.education.institution}
                      </div>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center font-mono font-bold text-cyan-300 text-xs">
                      {profile.symbol}
                    </div>
                  </div>

                </div>
              </div>
            </ScrollReveal>

            {/* 4 Core Statistics Grid */}
            <ScrollReveal direction="up" delay={200} duration={800}>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-[#0a0a0d] border border-white/[0.08] text-center hover:border-cyan-500/30 transition-all">
                  <div className="text-2xl font-extrabold text-white font-mono tracking-tight">3+</div>
                  <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider mt-0.5">PROJECTS</div>
                </div>
                <div className="p-4 rounded-xl bg-[#0a0a0d] border border-white/[0.08] text-center hover:border-cyan-500/30 transition-all">
                  <div className="text-2xl font-extrabold text-cyan-400 font-mono tracking-tight">AI / ML</div>
                  <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider mt-0.5">DATA SCIENCE</div>
                </div>
                <div className="p-4 rounded-xl bg-[#0a0a0d] border border-white/[0.08] text-center hover:border-cyan-500/30 transition-all">
                  <div className="text-2xl font-extrabold text-emerald-400 font-mono tracking-tight">B.Tech DS</div>
                  <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider mt-0.5">ACADEMIC</div>
                </div>
                <div className="p-4 rounded-xl bg-[#0a0a0d] border border-white/[0.08] text-center hover:border-cyan-500/30 transition-all">
                  <div className="text-2xl font-extrabold text-white font-mono tracking-tight">2027</div>
                  <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider mt-0.5">GRADUATE</div>
                </div>
              </div>
            </ScrollReveal>

          </div>

          {/* Right Column: Introduction Narrative & Core Focus */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Primary Bio Paragraph */}
            <ScrollReveal direction="up" delay={150} duration={850}>
              <div className="p-6 sm:p-8 rounded-2xl bg-[#0a0a0d] border border-white/[0.08] space-y-5">
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                  Passion for Practical Data Solutions
                </h3>
                
                <p className="text-neutral-300 text-base leading-relaxed">
                  {profile.bio}
                </p>

                <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
                  {profile.aboutStory}
                </p>

                <div className="pt-4 border-t border-white/[0.08]">
                  <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" />
                    <span>CAREER OBJECTIVE</span>
                  </div>
                  <p className="text-neutral-300 text-sm italic bg-black/50 p-4 rounded-xl border border-white/[0.06] leading-relaxed">
                    "{profile.careerObjective}"
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Core Capability Cards (2x2 Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {coreFocusAreas.map((area, idx) => {
                const IconComp = area.icon;
                return (
                  <ScrollReveal 
                    key={idx} 
                    direction="up" 
                    delay={200 + idx * 80} 
                    duration={750}
                  >
                    <div 
                      className="p-5 rounded-xl bg-[#0a0a0d] border border-white/[0.06] hover:border-cyan-500/30 transition-all group h-full"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-110 transition-transform">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-sm text-white font-mono uppercase tracking-wide group-hover:text-cyan-300 transition-colors">
                        {area.title}
                      </h4>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                        {area.desc}
                      </p>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>

            {/* Resume & Copilot Quick Actions */}
            <ScrollReveal direction="up" delay={400} duration={800}>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  id="about-btn-resume"
                  onClick={onOpenResume}
                  className="px-6 py-3 rounded-full bg-white hover:bg-neutral-200 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>DOWNLOAD RESUME</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                
                <button
                  id="about-btn-copilot"
                  onClick={onOpenCopilot}
                  className="px-6 py-3 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.15] text-neutral-200 font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>ASK AI CAREER COPILOT</span>
                </button>
              </div>
            </ScrollReveal>

          </div>

        </div>

      </div>
    </section>
  );
};
