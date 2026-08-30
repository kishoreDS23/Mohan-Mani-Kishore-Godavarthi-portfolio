import React, { useState, useEffect } from "react";
import { Cpu, AlertTriangle, ShieldCheck, Play, Pause, RefreshCw, Car, Flame } from "lucide-react";

export const TrafficSignalPlayground: React.FC = () => {
  const [northDensity, setNorthDensity] = useState(24);
  const [southDensity, setSouthDensity] = useState(12);
  const [eastDensity, setEastDensity] = useState(38);
  const [westDensity, setWestDensity] = useState(8);
  const [emergencyOverride, setEmergencyOverride] = useState(false);
  const [activeLane, setActiveLane] = useState<"North" | "South" | "East" | "West" | "Emergency">("East");
  const [secondsRemaining, setSecondsRemaining] = useState(18);

  // Dynamic green time calculation based on vehicle density
  const totalVehicles = northDensity + southDensity + eastDensity + westDensity;
  
  // Traditional fixed timer vs Kishore's AI Dynamic system
  const fixedCycleTime = 120; // seconds
  const aiOptimizedDelay = Math.max(12, Math.round((totalVehicles * 1.2) - (emergencyOverride ? 20 : 0)));
  const waitTimeReduction = Math.round(((fixedCycleTime - aiOptimizedDelay) / fixedCycleTime) * 100);

  useEffect(() => {
    if (emergencyOverride) {
      setActiveLane("Emergency");
      setSecondsRemaining(25);
      return;
    }

    // Allocate active lane based on highest queue density
    const densities = [
      { lane: "North" as const, count: northDensity },
      { lane: "South" as const, count: southDensity },
      { lane: "East" as const, count: eastDensity },
      { lane: "West" as const, count: westDensity },
    ];
    const highest = densities.reduce((prev, current) => (prev.count > current.count ? prev : current));
    setActiveLane(highest.lane);
    setSecondsRemaining(Math.min(45, Math.max(10, Math.round(highest.count * 1.1))));
  }, [northDensity, southDensity, eastDensity, westDensity, emergencyOverride]);

  return (
    <div id="playground-traffic-signal" className="mt-8 p-6 sm:p-8 rounded-3xl bg-[#0a0a0d] border border-white/[0.08] shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-xl text-white">
              AI Traffic Signal Optimization Simulator
            </h3>
            <p className="text-xs text-neutral-400">
              Interactive demonstration of Project 02: Dynamic Green Light Allocation with YOLOv8 queue estimation.
            </p>
          </div>
        </div>

        {/* Emergency Override Toggle */}
        <button
          onClick={() => setEmergencyOverride(!emergencyOverride)}
          className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            emergencyOverride
              ? "bg-red-500 text-white shadow-lg animate-pulse"
              : "bg-[#050505] border border-red-500/40 text-red-400 hover:bg-red-950/40"
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>{emergencyOverride ? "EMERGENCY CORRIDOR ACTIVE" : "TRIGGER AMBULANCE OVERRIDE"}</span>
        </button>
      </div>

      {/* Simulator Layout: Intersection visual + Lane Density Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left: Interactive 4-Lane Density Controller */}
        <div className="lg:col-span-6 space-y-4">
          <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
            Adjust Real-Time Vehicle Counts (YOLO Camera Feeds)
          </div>

          <div className="space-y-3 font-mono text-xs">
            {/* North */}
            <div className="p-3 rounded-xl bg-[#050505] border border-white/[0.06] flex flex-col gap-1.5">
              <div className="flex justify-between text-neutral-300">
                <span className="font-semibold text-white">North Bound (Camera 01)</span>
                <span className="text-cyan-400 font-bold">{northDensity} vehicles</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={northDensity}
                onChange={(e) => setNorthDensity(Number(e.target.value))}
                className="accent-cyan-400 w-full h-1.5 bg-[#111115] rounded-lg cursor-pointer"
              />
            </div>

            {/* South */}
            <div className="p-3 rounded-xl bg-[#050505] border border-white/[0.06] flex flex-col gap-1.5">
              <div className="flex justify-between text-neutral-300">
                <span className="font-semibold text-white">South Bound (Camera 02)</span>
                <span className="text-cyan-400 font-bold">{southDensity} vehicles</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={southDensity}
                onChange={(e) => setSouthDensity(Number(e.target.value))}
                className="accent-cyan-400 w-full h-1.5 bg-[#111115] rounded-lg cursor-pointer"
              />
            </div>

            {/* East */}
            <div className="p-3 rounded-xl bg-[#050505] border border-white/[0.06] flex flex-col gap-1.5">
              <div className="flex justify-between text-neutral-300">
                <span className="font-semibold text-white">East Bound (Camera 03 - Arterial)</span>
                <span className="text-emerald-400 font-bold">{eastDensity} vehicles</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={eastDensity}
                onChange={(e) => setEastDensity(Number(e.target.value))}
                className="accent-emerald-400 w-full h-1.5 bg-[#111115] rounded-lg cursor-pointer"
              />
            </div>

            {/* West */}
            <div className="p-3 rounded-xl bg-[#050505] border border-white/[0.06] flex flex-col gap-1.5">
              <div className="flex justify-between text-neutral-300">
                <span className="font-semibold text-white">West Bound (Camera 04)</span>
                <span className="text-cyan-400 font-bold">{westDensity} vehicles</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={westDensity}
                onChange={(e) => setWestDensity(Number(e.target.value))}
                className="accent-cyan-400 w-full h-1.5 bg-[#111115] rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right: Signal HUD & Junction Telemetry */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#050505] border border-white/[0.06] space-y-5">
          
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <span className="text-xs font-mono text-neutral-400">SIGNAL CONTROLLER STATUS</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold">
              ALGORITHM: DYNAMIC_QUEUE_V2
            </span>
          </div>

          {/* Active Lane Spotlight */}
          <div className="p-5 rounded-xl bg-[#0a0a0d] border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-neutral-400">CURRENT GREEN LIGHT ALLOCATION</span>
              <div className="text-2xl font-bold font-heading text-white mt-1 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                <span>{emergencyOverride ? "EMERGENCY CORRIDOR (PRIORITY 1)" : `${activeLane.toUpperCase()} LANE ACTIVE`}</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-mono font-extrabold text-emerald-400">
                {secondsRemaining}s
              </div>
              <div className="text-[10px] font-mono text-neutral-400">GREEN DURATION</div>
            </div>
          </div>

          {/* Efficiency Comparison Matrix */}
          <div className="grid grid-cols-3 gap-3 text-center font-mono">
            <div className="p-3 rounded-xl bg-[#0a0a0d] border border-white/[0.06]">
              <div className="text-[10px] text-neutral-400">Total Density</div>
              <div className="text-lg font-bold text-white mt-1">{totalVehicles}</div>
            </div>
            <div className="p-3 rounded-xl bg-[#0a0a0d] border border-white/[0.06]">
              <div className="text-[10px] text-neutral-400">Wait Time Saved</div>
              <div className="text-lg font-bold text-emerald-400 mt-1">{waitTimeReduction}%</div>
            </div>
            <div className="p-3 rounded-xl bg-[#0a0a0d] border border-white/[0.06]">
              <div className="text-[10px] text-neutral-400">Fixed vs AI</div>
              <div className="text-lg font-bold text-cyan-400 mt-1">-38 sec</div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
