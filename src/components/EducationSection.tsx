import React from "react";
import { GraduationCap, Calendar, MapPin, BookOpen, Award, CheckCircle2, Building2 } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import { ScrollReveal } from "./ScrollReveal";

export const EducationSection: React.FC = () => {
  const { education, profile } = usePortfolio();

  return (
    <section id="education" className="py-28 bg-[#050505] relative border-t border-white/[0.08] text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        
        {/* Section Title */}
        <ScrollReveal direction="up" distance={30} duration={800} className="flex flex-col items-start mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] text-cyan-400 text-xs font-mono mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            <span className="tracking-widest uppercase">EDUCATION</span>
          </div>
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            ACADEMIC FOUNDATION
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mt-2 font-mono">
            Undergraduate training in Data Science, Artificial Intelligence, and Mathematical Computing.
          </p>
        </ScrollReveal>

        {/* Education Hero Card Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Degree & Institution Card */}
          <ScrollReveal direction="up" delay={150} duration={800} className="lg:col-span-8">
            <div className="p-8 sm:p-10 rounded-2xl bg-[#0a0a0d] border border-white/[0.08] space-y-6 relative overflow-hidden shadow-2xl h-full hover:border-cyan-500/30 transition-all">
              
              {/* Background watermarked graduation icon */}
              <GraduationCap className="absolute -right-8 -bottom-8 w-56 h-56 text-white/[0.02] pointer-events-none" />

              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
                <div>
                  <span className="px-3.5 py-1 rounded-full bg-white/[0.08] text-white border border-white/[0.15] text-xs font-mono font-semibold">
                    GRADUATION: 2027
                  </span>
                  <h3 
                    className="font-bold text-2xl sm:text-3xl text-white mt-3 uppercase tracking-tight"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {education.degree}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/40 px-3 py-1.5 rounded-full inline-block">
                    {education.status}
                  </span>
                </div>
              </div>

              {/* Institution & Location */}
              <div className="flex flex-wrap items-center gap-y-3 gap-x-8 text-sm text-neutral-300">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  <span className="font-semibold text-white font-mono">{education.institution}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-400">
                  <MapPin className="w-4 h-4 text-neutral-400" />
                  <span className="font-mono text-xs">{education.location}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-400">
                  <Calendar className="w-4 h-4 text-neutral-400" />
                  <span className="font-mono text-xs">{education.duration}</span>
                </div>
              </div>

              {/* Key Coursework Modules */}
              <div className="space-y-3 pt-3">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 uppercase tracking-wider font-semibold">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>Relevant Coursework & Academic Modules</span>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {education.keyCourses.map((course, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-neutral-200 font-mono hover:border-cyan-500/40 hover:text-white transition-colors"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </ScrollReveal>

          {/* Academic Highlights & Hackathon Box */}
          <ScrollReveal direction="up" delay={300} duration={800} className="lg:col-span-4">
            <div className="p-8 rounded-2xl bg-[#0a0a0d] border border-white/[0.08] space-y-6 flex flex-col justify-between h-full hover:border-cyan-500/30 transition-all">
              <div>
                <h4 
                  className="font-bold text-lg text-white flex items-center gap-2 uppercase tracking-wide mb-5"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  <Award className="w-5 h-5 text-cyan-400" />
                  <span>Academic Highlights</span>
                </h4>

                <div className="space-y-4">
                  {education.achievements.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-neutral-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed font-sans">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.08]">
                <div className="p-4 rounded-xl bg-[#0e161c] border border-cyan-500/30 text-xs font-mono text-cyan-300 leading-relaxed">
                  🎯 Applying machine learning algorithms & automated data pipelines directly to real-world datasets.
                </div>
              </div>
            </div>
          </ScrollReveal>

        </div>

      </div>
    </section>
  );
};
