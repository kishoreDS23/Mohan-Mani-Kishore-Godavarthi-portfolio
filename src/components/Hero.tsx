import React, { useEffect, useRef, useState } from "react";
import { 
  ArrowRight, 
  FileDown, 
  Sparkles, 
  Terminal, 
  Database, 
  Cpu, 
  Code2, 
  BrainCircuit, 
  Layers, 
  ChevronDown,
  TrendingUp,
  Workflow
} from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

interface HeroProps {
  onOpenResume: () => void;
  onOpenCopilot: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenResume, onOpenCopilot }) => {
  const { profile } = usePortfolio();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scrollY, setScrollY] = useState(0);

  // Parallax on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Neural network connections & subtle floating data particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const numPoints = Math.min(width < 768 ? 28 : 55, 65);
    const points: { x: number; y: number; vx: number; vy: number; radius: number; color: string }[] = [];
    const colors = ["rgba(6, 182, 212, 0.6)", "rgba(59, 130, 246, 0.5)", "rgba(16, 185, 129, 0.4)", "rgba(255, 255, 255, 0.4)"];

    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.6 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle connecting lines
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Draw particle nodes
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const scrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("projects");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToAbout = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("about");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section 
      id="hero" 
      className="relative w-full min-h-screen lg:h-screen lg:min-h-[700px] overflow-hidden bg-black flex items-center justify-between select-none"
    >
      {/* 1. Full-Screen Cinematic Video & Visual Identity Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        {/* Cinematic Video Layer */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            transform: `translateY(${scrollY * 0.15}px) scale(1.03)`,
            transition: "transform 0.1s cubic-bezier(0,0,0.2,1)",
          }}
        >
          {/* High-Resolution Personal Visual Identity Video / Poster */}
          <div className="relative w-full h-full">
            {/* Synthetic Cinematic Video Element */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover object-center md:object-[60%_center] opacity-45 sm:opacity-55"
              poster="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80"
            >
              <source src="/assets/hero_cinematic.mp4" type="video/mp4" />
            </video>

            {/* Glowing Holographic Visual Portrait Overlay (User Focal Point in dark suit with futuristic UI) */}
            <div className="absolute inset-0 flex items-center justify-end pr-0 lg:pr-12 pointer-events-none opacity-40 md:opacity-65">
              <div className="relative w-full md:w-3/5 h-full max-h-[85vh] flex items-center justify-center">
                {/* Tech Glow aura behind subject */}
                <div className="absolute w-[360px] md:w-[540px] h-[360px] md:h-[540px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
                <div className="absolute w-[280px] md:w-[420px] h-[280px] md:h-[420px] rounded-full bg-blue-600/10 blur-[90px] pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Cinematic Gradient Overlays to guarantee high text contrast and visual focus */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 md:via-black/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/70 z-10" />
        <div className="absolute inset-0 bg-radial-gradient opacity-40 z-10" />
      </div>

      {/* 2. Interactive Neural Particle Canvas Layer */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-10" 
      />

      {/* 3. Subtle Technology Fragments & Code Floating in Background (Low Opacity, never covering face) */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden hidden md:block">
        {/* Code Fragment 1: Top Right */}
        <div className="absolute top-28 right-8 lg:right-24 p-3 rounded-xl bg-black/40 border border-white/[0.08] backdrop-blur-md text-[11px] font-mono text-cyan-300/60 shadow-2xl animate-pulse" style={{ animationDuration: "8s" }}>
          <div className="flex items-center gap-2 mb-1 text-white/40 text-[9px] uppercase tracking-wider">
            <Cpu className="w-3 h-3 text-cyan-400" />
            <span>NEURAL PIPELINE // ACTIVE</span>
          </div>
          <code>import torch.nn as nn<br/>model = ResNet50(weights='IMAGENET')</code>
        </div>

        {/* Code Fragment 2: Middle Right - SQL Query */}
        <div className="absolute top-[48%] right-6 lg:right-16 p-3 rounded-xl bg-black/40 border border-white/[0.08] backdrop-blur-md text-[11px] font-mono text-blue-300/60 shadow-2xl">
          <div className="flex items-center gap-2 mb-1 text-white/40 text-[9px] uppercase tracking-wider">
            <Database className="w-3 h-3 text-blue-400" />
            <span>SQL ANALYTICS</span>
          </div>
          <code>SELECT cohort, AVG(retention_rate)<br/>FROM user_metrics GROUP BY 1;</code>
        </div>

        {/* Code Fragment 3: Bottom Right - Model Metrics */}
        <div className="absolute bottom-28 right-10 lg:right-28 p-3 rounded-xl bg-black/40 border border-white/[0.08] backdrop-blur-md text-[11px] font-mono text-emerald-300/60 shadow-2xl">
          <div className="flex items-center gap-2 mb-1 text-white/40 text-[9px] uppercase tracking-wider">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span>MODEL TELEMETRY</span>
          </div>
          <code>ROC-AUC: 0.948 | Latency: 24ms<br/>Precision: 88.4% | Recall: 86.2%</code>
        </div>
      </div>

      {/* 4. Main Hero Content (Bottom-Left Alignment, 45-55% Desktop Width) */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-28 sm:pt-32 lg:pt-24 pb-16 flex flex-col justify-center h-full">
        <div className="w-full lg:max-w-[58%] flex flex-col justify-center space-y-4 sm:space-y-5 lg:space-y-6 my-auto">
          
          {/* Small Status Badge & Name */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/50 border border-cyan-500/40 backdrop-blur-xl text-[11px] sm:text-xs font-mono font-medium tracking-wide text-cyan-300 shadow-lg shadow-cyan-950/50">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="uppercase tracking-widest">{profile.status || "OPEN TO INTERNSHIPS & JOB OPPORTUNITIES"}</span>
            </div>

            {/* Brand Monogram Symbol Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 border border-white/15 text-[11px] font-mono font-bold text-white/90">
              <span className="text-cyan-400 font-extrabold">{profile.symbol}</span>
            </div>
          </div>

          {/* Full Name Above Headline */}
          <div className="flex items-center gap-2.5 pt-0.5">
            <div className="h-4 w-1 bg-cyan-400 rounded-full" />
            <span className="text-sm sm:text-base md:text-lg font-mono font-bold text-white tracking-wider uppercase">
              {profile.fullName || "Mohan Mani Kishore Godavarthi"}
            </span>
          </div>

          {/* Main Headline with bold modern display typography - refined compact sizing */}
          <div className="space-y-1">
            <h1 
              className="text-white font-extrabold uppercase tracking-tight leading-[1.05] select-text"
              style={{
                fontFamily: "'Syne', 'Anton', sans-serif",
                fontSize: "clamp(1.85rem, 3.8vw, 3.4rem)",
                letterSpacing: "-0.025em",
                textShadow: "0 8px 30px rgba(0,0,0,0.8)",
              }}
            >
              TURNING DATA
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-cyan-300">
                INTO INTELLIGENT
              </span>
              <br />
              SOLUTIONS
            </h1>
          </div>

          {/* Identity Sub-heading */}
          <div className="flex items-center gap-2 text-xs sm:text-sm md:text-base font-mono font-semibold tracking-widest text-cyan-400 uppercase">
            <span>DATA SCIENCE</span>
            <span className="text-white/40">•</span>
            <span>AI/ML</span>
            <span className="text-white/40">•</span>
            <span>PYTHON</span>
            <span className="text-white/40">•</span>
            <span>SQL</span>
            <span className="hidden sm:inline text-white/40">•</span>
            <span className="hidden sm:inline">DATA ANALYTICS</span>
          </div>

          {/* Supporting Text */}
          <p className="text-neutral-300 text-sm sm:text-base md:text-lg font-normal leading-relaxed max-w-xl text-balance">
            {profile.supportingText}
          </p>

          {/* Hero Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            {/* Primary CTA: VIEW MY WORK */}
            <a
              href="#projects"
              id="btn-hero-view-work"
              onClick={scrollToProjects}
              className="group relative inline-flex items-center gap-3 px-7 py-4 rounded-full font-semibold font-mono text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-2xl hover:scale-105 active:scale-95"
              style={{
                border: "1px solid rgba(255,255,255,0.25)",
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
                color: "#ffffff",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#ffffff";
                e.currentTarget.style.color = "#000000";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                e.currentTarget.style.color = "#ffffff";
              }}
            >
              <span>VIEW MY WORK</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.25} />
            </a>

            {/* Secondary CTA: DOWNLOAD RESUME */}
            <button
              id="btn-hero-download-resume"
              onClick={onOpenResume}
              className="group relative inline-flex items-center gap-2.5 px-6 py-4 rounded-full font-semibold font-mono text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-xl hover:scale-105 active:scale-95"
              style={{
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(0,0,0,0.4)",
                backdropFilter: "blur(20px)",
                color: "#e5e5e5",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(0,0,0,0.4)";
                e.currentTarget.style.color = "#e5e5e5";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
              }}
            >
              <FileDown className="w-4 h-4 text-cyan-400 group-hover:text-white transition-colors" />
              <span>DOWNLOAD RESUME</span>
            </button>
          </div>

        </div>
      </div>

      {/* 5. Scroll Down Indicator with animated vertical line */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-auto">
        <a
          href="#about"
          onClick={scrollToAbout}
          id="link-scroll-explore"
          className="group flex flex-col items-center gap-2 text-white/50 hover:text-white transition-colors duration-200 no-underline cursor-pointer"
        >
          <span className="text-[10px] font-mono font-medium tracking-[0.25em] uppercase">
            SCROLL TO EXPLORE
          </span>
          <div className="w-4 h-8 rounded-full border border-white/20 flex items-start justify-center p-1">
            <span className="w-1 h-2 rounded-full bg-cyan-400 animate-bounce" />
          </div>
        </a>
      </div>

    </section>
  );
};
