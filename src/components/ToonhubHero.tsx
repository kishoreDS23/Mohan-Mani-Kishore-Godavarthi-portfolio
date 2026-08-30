import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, Sparkles, Box, Play, Eye, Rotate3d, Maximize2, X, Volume2, VolumeX, ShieldCheck } from "lucide-react";

export interface FigurineItem {
  id: number;
  src: string;
  bg: string;
  panel: string;
  name: string;
  edition: string;
  rarity: string;
  height: string;
  materials: string;
}

const IMAGES: FigurineItem[] = [
  {
    id: 1,
    src: "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png",
    bg: "#F4845F",
    panel: "#F79B7F",
    name: "Chrono Nova - Solar Cyber",
    edition: "Series 01 // Alpha",
    rarity: "Legendary 3D Sculpture",
    height: "28.5 cm (1:6 Scale)",
    materials: "Resin Cast & UV Matte Pigment",
  },
  {
    id: 2,
    src: "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png",
    bg: "#6BBF7A",
    panel: "#85CC92",
    name: "Mecha Sprout - Bio Android",
    edition: "Series 01 // Beta",
    rarity: "Mythic Hologram Finish",
    height: "26.0 cm (1:6 Scale)",
    materials: "Solid Polyurethane & Metallic Green",
  },
  {
    id: 3,
    src: "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png",
    bg: "#E882B4",
    panel: "#ED9DC4",
    name: "Sakura Drone - Neo Blossom",
    edition: "Series 01 // Gamma",
    rarity: "Limited Artist Proof",
    height: "27.2 cm (1:6 Scale)",
    materials: "Acrylic Glass & Translucent Enamel",
  },
  {
    id: 4,
    src: "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png",
    bg: "#6EB5FF",
    panel: "#8DC4FF",
    name: "Glacier Core - Azure Specimen",
    edition: "Series 01 // Delta",
    rarity: "Rare Studio Edition",
    height: "29.0 cm (1:6 Scale)",
    materials: "Frosted Quartz Resin & Chrome Plating",
  },
];

export const ToonhubHero: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [is3DVideoOpen, setIs3DVideoOpen] = useState<boolean>(false);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Preload all 4 images on mount
  useEffect(() => {
    IMAGES.forEach((img) => {
      const imageObj = new Image();
      imageObj.src = img.src;
    });
  }, []);

  // Resize listener for mobile responsive layout check
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Keyboard navigation & touch gestures
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (is3DVideoOpen || isDetailOpen) return;
      if (e.key === "ArrowLeft") {
        navigate("prev");
      } else if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        navigate("next");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAnimating, is3DVideoOpen, isDetailOpen]);

  // Navigate handler with 650ms animation lock
  const navigate = (direction: "next" | "prev") => {
    if (isAnimating) return;
    setIsAnimating(true);
    if (direction === "next") {
      setActiveIndex((prev) => (prev + 1) % 4);
    } else {
      setActiveIndex((prev) => (prev + 3) % 4);
    }
    setTimeout(() => {
      setIsAnimating(false);
    }, 650);
  };

  // Roles derived from activeIndex
  const getRole = (index: number): "center" | "left" | "right" | "back" => {
    if (index === activeIndex) return "center";
    if (index === (activeIndex + 3) % 4) return "left";
    if (index === (activeIndex + 1) % 4) return "right";
    return "back";
  };

  // Subtle interactive 3D parallax on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 16;
    const y = (clientY / innerHeight - 0.5) * 16;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // SVG fractalNoise grain data URI
  const grainSvg = `data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)" opacity="0.08"/></svg>`;

  const currentItem = IMAGES[activeIndex];

  return (
    <div
      id="toonhub-hero"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full overflow-hidden select-none"
      style={{
        backgroundColor: currentItem.bg,
        transition: "background-color 650ms cubic-bezier(0.4, 0, 0.2, 1)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* 100vh full-viewport container */}
      <div className="relative w-full h-screen overflow-hidden">

        {/* 1. Grain overlay */}
        <div
          id="grain-overlay"
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 50,
            opacity: 0.4,
            backgroundImage: `url('${grainSvg}')`,
            backgroundSize: "200px 200px",
            backgroundRepeat: "repeat",
          }}
        />

        {/* 2. Giant ghost text "3D SHAPE" */}
        <div
          id="ghost-text-3d"
          className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none"
          style={{
            zIndex: 2,
            top: "18%",
            transform: `translate3d(${-tilt.x * 0.4}px, ${-tilt.y * 0.4}px, 0)`,
            transition: "transform 250ms ease-out",
          }}
        >
          <span
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "clamp(90px, 28vw, 380px)",
              fontWeight: 900,
              color: "white",
              opacity: 1,
              lineHeight: 1,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
              textShadow: "0 20px 80px rgba(0,0,0,0.12)",
            }}
          >
            3D SHAPE
          </span>
        </div>

        {/* 3. Top-left brand label "TOONHUB" */}
        <div
          id="brand-header"
          className="absolute top-6 left-4 sm:left-8 flex items-center gap-3"
          style={{ zIndex: 60 }}
        >
          <span
            className="text-xs font-semibold uppercase text-white"
            style={{ opacity: 0.9, letterSpacing: "0.18em" }}
          >
            TOONHUB
          </span>

          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-white/40" />

          {/* Interactive 3D Animation Studio Pill */}
          <button
            id="btn-open-3d-studio"
            onClick={() => setIs3DVideoOpen(true)}
            className="group flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-[11px] text-white backdrop-blur-md transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
            title="Launch 3D Video & Animation Studio"
          >
            <Rotate3d className="w-3.5 h-3.5 text-white animate-spin" style={{ animationDuration: "10s" }} />
            <span className="font-medium tracking-wide">3D Animation</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
          </button>
        </div>

        {/* Top-Right Quick Switch / Creator Info */}
        <div
          id="top-right-meta"
          className="absolute top-6 right-4 sm:right-8 flex items-center gap-3"
          style={{ zIndex: 60 }}
        >
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-black/10 backdrop-blur-sm border border-white/15 text-[11px] text-white/90 font-mono">
            <Box className="w-3.5 h-3.5 text-white/80" />
            <span>FIGURINE 0{activeIndex + 1} / 04</span>
          </div>

          <button
            id="btn-inspect-details"
            onClick={() => setIsDetailOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-black font-semibold text-xs tracking-wider uppercase shadow-lg hover:bg-white/90 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Specs</span>
          </button>
        </div>

        {/* 4. Carousel Items */}
        <div id="carousel-viewport" className="absolute inset-0" style={{ zIndex: 3 }}>
          {IMAGES.map((item, index) => {
            const role = getRole(index);

            // Compute precise role-based CSS positioning & styling
            let roleStyle: React.CSSProperties = {};

            if (role === "center") {
              roleStyle = {
                transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68}) translate3d(${tilt.x * 0.8}px, ${tilt.y * 0.8}px, 0)`,
                filter: "none",
                opacity: 1,
                zIndex: 20,
                left: "50%",
                height: isMobile ? "60%" : "92%",
                bottom: isMobile ? "22%" : 0,
              };
            } else if (role === "left") {
              roleStyle = {
                transform: `translateX(-50%) scale(1) translate3d(${tilt.x * 0.3}px, ${tilt.y * 0.3}px, 0)`,
                filter: "blur(2px)",
                opacity: 0.85,
                zIndex: 10,
                left: isMobile ? "20%" : "30%",
                height: isMobile ? "16%" : "28%",
                bottom: isMobile ? "32%" : "12%",
              };
            } else if (role === "right") {
              roleStyle = {
                transform: `translateX(-50%) scale(1) translate3d(${tilt.x * 0.3}px, ${tilt.y * 0.3}px, 0)`,
                filter: "blur(2px)",
                opacity: 0.85,
                zIndex: 10,
                left: isMobile ? "80%" : "70%",
                height: isMobile ? "16%" : "28%",
                bottom: isMobile ? "32%" : "12%",
              };
            } else {
              // "back"
              roleStyle = {
                transform: `translateX(-50%) scale(1) translate3d(${tilt.x * 0.1}px, ${tilt.y * 0.1}px, 0)`,
                filter: "blur(4px)",
                opacity: 1,
                zIndex: 5,
                left: "50%",
                height: isMobile ? "13%" : "22%",
                bottom: isMobile ? "32%" : "12%",
              };
            }

            return (
              <div
                key={item.id}
                id={`carousel-item-${item.id}`}
                onClick={() => {
                  if (role === "left") navigate("prev");
                  if (role === "right") navigate("next");
                  if (role === "center") setIsDetailOpen(true);
                }}
                className={`absolute cursor-pointer select-none ${
                  role === "center" ? "cursor-zoom-in" : "cursor-pointer"
                }`}
                style={{
                  aspectRatio: "0.6 / 1",
                  transition:
                    "transform 650ms cubic-bezier(0.4,0,0.2,1), filter 650ms cubic-bezier(0.4,0,0.2,1), opacity 650ms cubic-bezier(0.4,0,0.2,1), left 650ms cubic-bezier(0.4,0,0.2,1), bottom 650ms cubic-bezier(0.4,0,0.2,1), height 650ms cubic-bezier(0.4,0,0.2,1)",
                  willChange: "transform, filter, opacity",
                  ...roleStyle,
                }}
              >
                <img
                  src={item.src}
                  alt={item.name}
                  draggable={false}
                  className="w-full h-full object-contain object-bottom pointer-events-none drop-shadow-2xl"
                />
              </div>
            );
          })}
        </div>

        {/* 5. Bottom-left text + nav buttons */}
        <div
          id="bottom-left-controls"
          className="absolute bottom-6 left-4 sm:bottom-20 sm:left-24"
          style={{ zIndex: 60, maxWidth: "320px" }}
        >
          <p
            className="font-bold uppercase tracking-widest text-white mb-2 sm:mb-3 text-base sm:text-[22px]"
            style={{ opacity: 0.95, letterSpacing: "0.02em" }}
          >
            TOONHUB FIGURINES
          </p>

          <p
            className="hidden sm:block text-xs sm:text-sm text-white mb-4 sm:mb-5"
            style={{ opacity: 0.85, lineHeight: 1.6 }}
          >
            The artwork is stunning, shipped fully prepared. The finish is a
            vision, the 3D craft is flawless. Many thanks! Wishing you the win.
            Order now.
          </p>

          {/* Nav Buttons */}
          <div className="flex items-center gap-3">
            <button
              id="btn-carousel-prev"
              onClick={() => navigate("prev")}
              disabled={isAnimating}
              aria-label="Previous figurine"
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer disabled:opacity-50"
              style={{
                backgroundColor: "transparent",
                border: "2px solid white",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.08)";
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <ArrowLeft className="text-white" size={26} strokeWidth={2.25} />
            </button>

            <button
              id="btn-carousel-next"
              onClick={() => navigate("next")}
              disabled={isAnimating}
              aria-label="Next figurine"
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer disabled:opacity-50"
              style={{
                backgroundColor: "transparent",
                border: "2px solid white",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.08)";
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <ArrowRight className="text-white" size={26} strokeWidth={2.25} />
            </button>
          </div>
        </div>

        {/* 6. Bottom-right link "DISCOVER IT" */}
        <div
          id="bottom-right-link"
          className="absolute bottom-6 right-4 sm:bottom-20 sm:right-10"
          style={{ zIndex: 60 }}
        >
          <a
            href="#discover"
            id="link-discover-it"
            onClick={(e) => {
              e.preventDefault();
              setIsDetailOpen(true);
            }}
            className="flex items-center gap-2 text-white uppercase no-underline transition-opacity duration-200 cursor-pointer"
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "clamp(20px, 4vw, 56px)",
              fontWeight: 400,
              opacity: 0.95,
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.95")}
          >
            <span>DISCOVER IT</span>
            <ArrowRight
              className="w-5 h-5 sm:w-8 sm:h-8"
              strokeWidth={2.25}
            />
          </a>
        </div>

        {/* Subtle Bottom Credit Pill */}
        <div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center pointer-events-auto"
          style={{ zIndex: 40 }}
        >
          <button
            onClick={() => setIs3DVideoOpen(true)}
            className="text-[10px] text-white/60 hover:text-white transition-colors duration-200 tracking-wider font-mono uppercase bg-black/10 hover:bg-black/30 px-3 py-0.5 rounded-full backdrop-blur-xs border border-white/10"
          >
            3D Craft by Mohan Mani Kishore Godavarthi
          </button>
        </div>

      </div>

      {/* 3D Figurine Specification / Discovery Modal */}
      {isDetailOpen && (
        <div
          id="modal-figurine-specs"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            className="relative w-full max-w-xl rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-white/20 overflow-hidden"
            style={{ backgroundColor: currentItem.bg }}
          >
            <button
              onClick={() => setIsDetailOpen(false)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-full bg-white/20 text-xs font-mono font-bold tracking-wider uppercase">
                {currentItem.edition}
              </span>
              <span className="text-xs text-white/80 font-mono">
                {currentItem.rarity}
              </span>
            </div>

            <h3
              className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white mb-4"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              {currentItem.name}
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3.5 rounded-2xl bg-black/15 border border-white/10">
                <span className="text-[10px] font-mono uppercase text-white/70 block mb-1">
                  Sculpt Height
                </span>
                <span className="text-sm font-bold text-white">
                  {currentItem.height}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/15 border border-white/10">
                <span className="text-[10px] font-mono uppercase text-white/70 block mb-1">
                  Cast Material
                </span>
                <span className="text-sm font-bold text-white">
                  {currentItem.materials}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/20">
              <button
                onClick={() => {
                  setIsDetailOpen(false);
                  setIs3DVideoOpen(true);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-white/20 hover:bg-white/30 text-white font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Rotate3d className="w-4 h-4" />
                <span>Launch 3D Animation View</span>
              </button>

              <button
                onClick={() => setIsDetailOpen(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <span>Order Figurine</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3D Animation & Video Studio Modal (with Mohan Mani Kishore Godavarthi Video) */}
      {is3DVideoOpen && (
        <div
          id="modal-3d-video-studio"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-3xl rounded-3xl bg-[#09090d] border border-white/15 p-6 sm:p-8 text-white shadow-2xl overflow-hidden flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center">
                  <Rotate3d className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3
                    className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white"
                    style={{ fontFamily: "'Anton', sans-serif" }}
                  >
                    3D Animation Studio
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono">
                    Featuring Mohan Mani Kishore Godavarthi
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIs3DVideoOpen(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video / 3D Animation Stage */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl flex items-center justify-center group">
              {/* Fallback image / video preview with futuristic 3D HUD */}
              <div className="absolute inset-0 bg-radial-gradient opacity-60 pointer-events-none" />

              {/* Hologram & 3D HUD Overlays */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 flex items-center gap-1.5 z-10 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>3D NEURAL RIG ACTIVE</span>
              </div>

              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 border border-white/15 text-[10px] font-mono text-neutral-300 flex items-center gap-2 z-10 backdrop-blur-md">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>60 FPS // 4K 3D SPACE</span>
              </div>

              {/* Video container */}
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80"
                  alt="3D Holographic Space"
                  className="absolute inset-0 w-full h-full object-cover opacity-20"
                />
                
                {/* 3D Character Figurine Preview overlay */}
                <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center max-w-md">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-pink-500 p-[2px] shadow-2xl shadow-cyan-500/20 mb-4 animate-pulse-subtle">
                    <div className="w-full h-full rounded-[14px] bg-[#0c0c10] flex items-center justify-center overflow-hidden">
                      <img
                        src={currentItem.src}
                        alt="3D Active"
                        className="w-full h-full object-contain object-bottom scale-125"
                      />
                    </div>
                  </div>

                  <h4 className="font-bold text-white text-base sm:text-lg mb-1 font-heading">
                    {currentItem.name}
                  </h4>
                  <p className="text-xs text-neutral-400 font-sans mb-3">
                    Sculpted with real-time subsurface scattering, occlusion mapping, and particle dynamics.
                  </p>

                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Realtime 3D Viewport Synchronized</span>
                  </div>
                </div>
              </div>

              {/* Bottom Video Controls Bar */}
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      navigate("prev");
                    }}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                    title="Previous Figurine"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      navigate("next");
                    }}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                    title="Next Figurine"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono text-neutral-300">
                    Preset: {currentItem.edition}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom info */}
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-2">
              <span className="font-mono">
                Creator: <strong className="text-white font-sans">Mohan Mani Kishore Godavarthi</strong>
              </span>
              <button
                onClick={() => setIs3DVideoOpen(false)}
                className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-all cursor-pointer"
              >
                Back to Carousel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
