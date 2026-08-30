import React, { useState } from "react";
import { 
  Code2, 
  Database, 
  BrainCircuit, 
  BarChart3, 
  Table, 
  LineChart, 
  PieChart, 
  Eye, 
  GitBranch, 
  Layout, 
  Search, 
  Terminal, 
  Cpu,
  Layers,
  Sparkles,
  Github,
  Webhook,
  Workflow,
  Cloud,
  Box,
  TrendingUp,
  CheckCircle2,
  Network,
  Gauge,
  FileSpreadsheet
} from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import { ScrollReveal } from "./ScrollReveal";

export const SkillsSection: React.FC = () => {
  const { skills } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = [
    "All", 
    "Programming", 
    "Data Analytics", 
    "Data Science", 
    "Machine Learning", 
    "Development", 
    "Data Engineering / Cloud"
  ];

  const filteredSkills = skills.filter((skill) => {
    const matchesCategory = activeCategory === "All" || skill.category === activeCategory;
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Code2": return <Code2 className="w-4 h-4" />;
      case "Database": return <Database className="w-4 h-4" />;
      case "Table": return <Table className="w-4 h-4" />;
      case "BarChart3": return <BarChart3 className="w-4 h-4" />;
      case "PieChart": return <PieChart className="w-4 h-4" />;
      case "Cpu": return <Cpu className="w-4 h-4" />;
      case "FileSpreadsheet": return <FileSpreadsheet className="w-4 h-4" />;
      case "LineChart": return <LineChart className="w-4 h-4" />;
      case "BrainCircuit": return <BrainCircuit className="w-4 h-4" />;
      case "TrendingUp": return <TrendingUp className="w-4 h-4" />;
      case "CheckCircle2": return <CheckCircle2 className="w-4 h-4" />;
      case "Network": return <Network className="w-4 h-4" />;
      case "Gauge": return <Gauge className="w-4 h-4" />;
      case "GitBranch": return <GitBranch className="w-4 h-4" />;
      case "Github": return <Github className="w-4 h-4" />;
      case "Webhook": return <Webhook className="w-4 h-4" />;
      case "Workflow": return <Workflow className="w-4 h-4" />;
      case "Layers": return <Layers className="w-4 h-4" />;
      case "Cloud": return <Cloud className="w-4 h-4" />;
      case "Box": return <Box className="w-4 h-4" />;
      default: return <Cpu className="w-4 h-4" />;
    }
  };

  return (
    <section id="skills" className="py-28 bg-[#050505] relative border-t border-white/[0.08] text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        
        {/* Header */}
        <ScrollReveal direction="up" distance={30} duration={800} className="flex flex-col items-start mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] text-cyan-400 text-xs font-mono mb-3">
            <Terminal className="w-3.5 h-3.5" />
            <span className="tracking-widest uppercase">TECHNOLOGY STACK</span>
          </div>
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            CORE TECHNICAL SKILLS
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mt-2 font-mono">
            Languages, analytical suites, machine learning models, cloud systems, and data pipelines.
          </p>
        </ScrollReveal>

        {/* ASCII Terminal Spotlight */}
        <ScrollReveal direction="up" delay={150} duration={800}>
          <div className="mb-12 p-6 sm:p-8 rounded-2xl bg-[#0a0a0d] border border-white/[0.08] font-mono shadow-2xl relative overflow-hidden hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-6 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <span className="text-cyan-400 ml-2 font-semibold font-mono">SKILL_ASCII_TELEMETRY.SYS</span>
              </div>
              <span className="text-neutral-500 text-[11px] uppercase tracking-wider">KISHORE (M²KG) • PROFICIENCY</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3.5 gap-x-10 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-white/[0.04]">
                <span className="text-neutral-200 font-semibold w-28">Python</span>
                <span className="text-cyan-400 tracking-wider font-bold">██████████</span>
                <span className="text-neutral-400 text-xs w-10 text-right">95%</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-white/[0.04]">
                <span className="text-neutral-200 font-semibold w-28">Pandas & NumPy</span>
                <span className="text-cyan-400 tracking-wider font-bold">██████████</span>
                <span className="text-neutral-400 text-xs w-10 text-right">95%</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-white/[0.04]">
                <span className="text-neutral-200 font-semibold w-28">SQL & Databases</span>
                <span className="text-cyan-400 tracking-wider font-bold">█████████</span>
                <span className="text-neutral-400 text-xs w-10 text-right">90%</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-white/[0.04]">
                <span className="text-neutral-200 font-semibold w-28">Scikit-Learn</span>
                <span className="text-emerald-400 tracking-wider font-bold">█████████</span>
                <span className="text-neutral-400 text-xs w-10 text-right">92%</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-white/[0.04]">
                <span className="text-neutral-200 font-semibold w-28">Power BI & DAX</span>
                <span className="text-blue-400 tracking-wider font-bold">█████████</span>
                <span className="text-neutral-400 text-xs w-10 text-right">88%</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-white/[0.04]">
                <span className="text-neutral-200 font-semibold w-28">Excel & ETL</span>
                <span className="text-emerald-400 tracking-wider font-bold">█████████</span>
                <span className="text-neutral-400 text-xs w-10 text-right">90%</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Filter Bar & Search */}
        <ScrollReveal direction="up" delay={200} duration={800}>
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10">
            
            {/* Category Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#0a0a0d] border border-white/[0.08] rounded-xl overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all uppercase tracking-wider ${
                    activeCategory === category
                      ? "bg-white text-black font-bold shadow-md"
                      : "text-neutral-400 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search skill (e.g. Python, SQL, AWS)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0a0a0d] border border-white/[0.08] rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
              />
            </div>

          </div>
        </ScrollReveal>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSkills.map((skill, index) => (
            <ScrollReveal 
              key={index} 
              direction="up" 
              delay={100 + (index % 6) * 60} 
              duration={700}
            >
              <div
                className="p-5 rounded-2xl bg-[#0a0a0d] border border-white/[0.06] hover:border-cyan-500/30 hover:bg-[#0e0e12] transition-all duration-200 space-y-3.5 group h-full"
              >
                {/* Top Row: Icon, Name & Score */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-cyan-400 group-hover:text-white group-hover:border-cyan-400/40 transition-colors">
                      {getIcon(skill.iconName)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white group-hover:text-cyan-400 transition-colors font-mono">
                        {skill.name}
                      </h4>
                      <span className="text-[10px] font-mono text-neutral-400 uppercase">
                        {skill.category}
                      </span>
                    </div>
                  </div>

                  <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded">
                    {skill.proficiency}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="w-full bg-[#050505] h-1.5 rounded-full overflow-hidden border border-white/[0.06]">
                    <div 
                      className="bg-gradient-to-r from-cyan-400 to-teal-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${skill.proficiency}%` }}
                    />
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  {skill.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
};
