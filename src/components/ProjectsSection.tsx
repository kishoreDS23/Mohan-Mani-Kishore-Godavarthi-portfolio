import React, { useState } from "react";
import { 
  FolderGit2, 
  ExternalLink, 
  Github, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Cpu, 
  Database, 
  BarChart3, 
  Layers, 
  X,
  Code2,
  Terminal,
  Activity,
  Maximize2
} from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import { Project } from "../types";
import { ScrollReveal } from "./ScrollReveal";
import { DataCleanerPlayground } from "./DataCleanerPlayground";
import { TrafficSignalPlayground } from "./TrafficSignalPlayground";
import { MLPredictorPlayground } from "./MLPredictorPlayground";

export const ProjectsSection: React.FC = () => {
  const { projects } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activePlayground, setActivePlayground] = useState<string | null>("data-cleaner");

  const categories = ["All", "Data Engineering", "Machine Learning", "Computer Vision", "Data Analytics", "AI & NLP"];

  const filteredProjects = projects.filter((p) => {
    if (activeCategory === "All") return true;
    return p.category === activeCategory;
  });

  return (
    <section id="projects" className="py-28 bg-[#050505] relative border-t border-white/[0.08] text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        
        {/* Section Header */}
        <ScrollReveal direction="up" distance={30} duration={800} className="flex flex-col items-start mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] text-cyan-400 text-xs font-mono mb-3">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span className="tracking-widest uppercase">SELECTED WORK</span>
          </div>
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            DATA SCIENCE & AI PROJECTS
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mt-2 font-mono">
            Practical systems built with end-to-end data pipelines, custom ML models, computer vision algorithms, and interactive dashboards.
          </p>
        </ScrollReveal>

        {/* Category Filters */}
        <ScrollReveal direction="up" delay={150} duration={750}>
          <div className="flex flex-wrap items-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-white text-black font-bold shadow-md"
                    : "bg-[#0a0a0d] border border-white/[0.08] text-neutral-400 hover:text-white hover:border-white/[0.2]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Project Cards Grid (6 Projects) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredProjects.map((project, pIdx) => (
            <ScrollReveal 
              key={project.id} 
              direction="up" 
              delay={100 + (pIdx % 6) * 70} 
              duration={750}
            >
              <div
                className="p-6 sm:p-7 rounded-2xl bg-[#0a0a0d] border border-white/[0.08] hover:border-cyan-500/40 hover:bg-[#0d0d12] transition-all duration-300 flex flex-col justify-between group shadow-2xl h-full"
              >
                <div className="space-y-4">
                  
                  {/* Top Row: Number & Category */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/50 border border-cyan-500/30 px-2.5 py-0.5 rounded">
                      {project.number}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400 bg-white/[0.04] px-2.5 py-0.5 rounded border border-white/[0.06] uppercase">
                      {project.category}
                    </span>
                  </div>

                  {/* Project Title & Summary */}
                  <div>
                    <h3 
                      className="font-bold text-lg text-white group-hover:text-cyan-300 transition-colors leading-snug"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      {project.title}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-2 leading-relaxed font-sans">
                      {project.shortDesc}
                    </p>
                  </div>

                  {/* Problem & Solution Callouts */}
                  <div className="space-y-2 pt-2 border-t border-white/[0.06] font-mono text-[11px]">
                    <div className="bg-black/50 p-2.5 rounded-lg border border-white/[0.06]">
                      <span className="text-red-400 font-semibold block mb-0.5">PROBLEM:</span>
                      <span className="text-neutral-300 line-clamp-2">{project.problem}</span>
                    </div>
                    <div className="bg-black/50 p-2.5 rounded-lg border border-white/[0.06]">
                      <span className="text-emerald-400 font-semibold block mb-0.5">SOLUTION:</span>
                      <span className="text-neutral-300 line-clamp-2">{project.solution}</span>
                    </div>
                  </div>

                  {/* Technologies Tag Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.technologies.slice(0, 4).map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded bg-white/[0.04] text-[10px] font-mono text-neutral-300 border border-white/[0.06]"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="px-1.5 py-0.5 rounded bg-white/[0.04] text-[10px] font-mono text-neutral-500">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>

                </div>

                {/* Card Footer Actions */}
                <div className="pt-5 mt-4 border-t border-white/[0.06] flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="text-xs font-mono text-cyan-400 hover:text-white flex items-center gap-1 cursor-pointer font-semibold uppercase tracking-wider"
                  >
                    <span>DEEP DIVE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2">
                    {project.hasInteractivePlayground && (
                      <button
                        onClick={() => {
                          setActivePlayground(project.hasInteractivePlayground || null);
                          const el = document.getElementById("playground");
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="px-2.5 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono hover:bg-cyan-900/50 cursor-pointer transition-colors"
                      >
                        Live Demo ⚡
                      </button>
                    )}
                    {project.githubUrl ? (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-neutral-300 hover:text-cyan-300 hover:border-cyan-500/50 hover:bg-white/[0.08] transition-all duration-200 cursor-pointer flex items-center justify-center"
                        title={`View GitHub Repository: ${project.title}`}
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    ) : (
                      <span 
                        className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] text-neutral-600 cursor-not-allowed"
                        title="Repository link not specified"
                      >
                        <Github className="w-4 h-4 opacity-40" />
                      </span>
                    )}
                  </div>
                </div>

              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Live Interactive Playgrounds Showcase */}
        <ScrollReveal direction="up" delay={200} duration={850}>
          <div id="playground" className="pt-10 border-t border-white/[0.08]">
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] text-cyan-400 text-xs font-mono mb-2">
                  <Activity className="w-3.5 h-3.5" />
                  <span className="tracking-widest uppercase">IN-BROWSER INTERACTIVE ENGINES</span>
                </div>
                <h3 
                  className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  LIVE ML & DATA SIMULATORS
                </h3>
                <p className="text-neutral-400 text-xs sm:text-sm mt-1 font-mono">
                  Interact with the algorithms behind Kishore's top data science projects directly in your browser.
                </p>
              </div>

              {/* Simulator Switcher Tabs */}
              <div className="flex p-1 bg-[#0a0a0d] border border-white/[0.08] rounded-xl text-xs font-mono">
                <button
                  onClick={() => setActivePlayground("data-cleaner")}
                  className={`px-3.5 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                    activePlayground === "data-cleaner"
                      ? "bg-white text-black font-bold"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  01. Data Cleaner Studio
                </button>
                <button
                  onClick={() => setActivePlayground("traffic-signal")}
                  className={`px-3.5 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                    activePlayground === "traffic-signal"
                      ? "bg-emerald-400 text-black font-bold"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  02. AI Traffic Control
                </button>
                <button
                  onClick={() => setActivePlayground("ml-predictor")}
                  className={`px-3.5 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                    activePlayground === "ml-predictor"
                      ? "bg-purple-400 text-black font-bold"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  03. ML Churn Predictor
                </button>
              </div>
            </div>

            {/* Active Playground Component */}
            {activePlayground === "data-cleaner" && <DataCleanerPlayground />}
            {activePlayground === "traffic-signal" && <TrafficSignalPlayground />}
            {activePlayground === "ml-predictor" && <MLPredictorPlayground />}

          </div>
        </ScrollReveal>

      </div>

      {/* Project Deep-Dive Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0a0a0d] border border-white/[0.1] w-full max-w-3xl rounded-3xl p-6 sm:p-8 overflow-y-auto max-h-[90vh] space-y-6 shadow-2xl relative text-white">
            
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/[0.05] border border-white/[0.1] text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold">
                  PROJECT {selectedProject.number}
                </span>
                <span className="text-xs font-mono text-neutral-400">
                  {selectedProject.category}
                </span>
              </div>
              <h3 
                className="text-2xl font-bold text-white tracking-tight"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {selectedProject.title}
              </h3>
              <p className="text-neutral-300 text-sm leading-relaxed">
                {selectedProject.shortDesc}
              </p>
            </div>

            {/* Problem & Solution Deep Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 space-y-1">
                <div className="text-red-400 font-bold uppercase tracking-wider">The Problem</div>
                <div className="text-neutral-300 leading-relaxed font-sans">{selectedProject.problem}</div>
              </div>
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                <div className="text-emerald-400 font-bold uppercase tracking-wider">The Solution</div>
                <div className="text-neutral-300 leading-relaxed font-sans">{selectedProject.solution}</div>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
                Key Technical Features & Architecture
              </h4>
              <div className="space-y-2">
                {selectedProject.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-neutral-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
                Impact & Verification Metrics
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {selectedProject.metrics.map((m, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-black/60 border border-white/[0.08] text-center font-mono">
                    <div className="text-cyan-400 font-bold text-base">{m.value}</div>
                    <div className="text-neutral-400 text-[10px] uppercase mt-0.5">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
              <a
                href={selectedProject.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-white text-black font-mono font-bold text-xs flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                <span>View GitHub Repository</span>
              </a>

              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 rounded-xl bg-white/[0.08] text-white font-mono text-xs hover:bg-white/[0.15]"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
