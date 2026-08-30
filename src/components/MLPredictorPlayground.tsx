import React, { useState } from "react";
import { Brain, Sparkles, TrendingUp, AlertCircle, CheckCircle2, Sliders } from "lucide-react";

export const MLPredictorPlayground: React.FC = () => {
  const [tenure, setTenure] = useState(14); // months
  const [monthlySpend, setMonthlySpend] = useState(85); // dollars
  const [contractType, setContractType] = useState<"Month-to-Month" | "One-Year" | "Two-Year">("Month-to-Month");
  const [supportCalls, setSupportCalls] = useState(4); // count
  const [hasTechSupport, setHasTechSupport] = useState(false);

  // Calibrated ML heuristic formula simulating XGBoost inference & SHAP values
  let score = 30; // base risk %

  // Tenure impact (longer tenure decreases churn)
  score -= Math.min(30, tenure * 0.7);

  // Monthly spend impact (higher spend increases sensitivity)
  score += (monthlySpend - 50) * 0.35;

  // Contract type impact
  if (contractType === "Month-to-Month") score += 28;
  else if (contractType === "One-Year") score -= 12;
  else if (contractType === "Two-Year") score -= 25;

  // Support calls impact (more tickets = frustration)
  score += supportCalls * 7;

  // Tech support mitigation
  if (hasTechSupport) score -= 14;

  const churnProbability = Math.max(4, Math.min(96, Math.round(score)));

  const riskTier = churnProbability > 65 ? "High Risk" : churnProbability > 35 ? "Moderate Risk" : "Low Risk";
  const riskColor = churnProbability > 65 ? "text-red-400 border-red-500/40 bg-red-950/30" : churnProbability > 35 ? "text-amber-400 border-amber-500/40 bg-amber-950/30" : "text-emerald-400 border-emerald-500/40 bg-emerald-950/30";

  return (
    <div id="playground-ml-predictor" className="mt-8 p-6 sm:p-8 rounded-3xl bg-[#0a0a0d] border border-white/[0.08] shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-xl text-white">
              ML Predictive Intelligence Simulator
            </h3>
            <p className="text-xs text-neutral-400">
              Interactive demonstration of Project 03: XGBoost Supervised Classification with SHAP Feature Importance.
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-[#111115] border border-purple-500/30 text-purple-300 text-xs font-mono">
          MODEL: XGBOOST_CLASSIFIER_V3
        </span>
      </div>

      {/* Grid: Inputs and Real-time Inference */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left: Interactive Feature Sliders */}
        <div className="lg:col-span-7 space-y-4 font-mono text-xs">
          <div className="text-xs font-mono text-purple-300 uppercase tracking-wider font-semibold">
            Input Feature Vector (Customer Profile)
          </div>

          {/* Tenure Slider */}
          <div className="p-3 rounded-xl bg-[#050505] border border-white/[0.06] flex flex-col gap-1.5">
            <div className="flex justify-between text-neutral-300">
              <span>Customer Tenure (Months)</span>
              <span className="text-purple-400 font-bold">{tenure} months</span>
            </div>
            <input
              type="range"
              min="1"
              max="72"
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="accent-purple-400 w-full h-1.5 bg-[#111115] rounded-lg cursor-pointer"
            />
          </div>

          {/* Monthly Bill Slider */}
          <div className="p-3 rounded-xl bg-[#050505] border border-white/[0.06] flex flex-col gap-1.5">
            <div className="flex justify-between text-neutral-300">
              <span>Monthly Recurring Spend ($)</span>
              <span className="text-purple-400 font-bold">${monthlySpend}/mo</span>
            </div>
            <input
              type="range"
              min="20"
              max="150"
              value={monthlySpend}
              onChange={(e) => setMonthlySpend(Number(e.target.value))}
              className="accent-purple-400 w-full h-1.5 bg-[#111115] rounded-lg cursor-pointer"
            />
          </div>

          {/* Support Tickets */}
          <div className="p-3 rounded-xl bg-[#050505] border border-white/[0.06] flex flex-col gap-1.5">
            <div className="flex justify-between text-neutral-300">
              <span>Support Complaints (Last 60 Days)</span>
              <span className="text-red-400 font-bold">{supportCalls} tickets</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={supportCalls}
              onChange={(e) => setSupportCalls(Number(e.target.value))}
              className="accent-red-400 w-full h-1.5 bg-[#111115] rounded-lg cursor-pointer"
            />
          </div>

          {/* Contract Type & Add-ons */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-[#050505] border border-white/[0.06] space-y-1.5">
              <label className="text-neutral-400 text-[11px]">Contract Structure</label>
              <select
                value={contractType}
                onChange={(e) => setContractType(e.target.value as any)}
                className="w-full bg-[#0e0e12] text-neutral-200 p-1.5 rounded-lg border border-white/[0.08] text-xs focus:outline-none"
              >
                <option value="Month-to-Month">Month-to-Month</option>
                <option value="One-Year">One-Year Contract</option>
                <option value="Two-Year">Two-Year Contract</option>
              </select>
            </div>

            <div className="p-3 rounded-xl bg-[#050505] border border-white/[0.06] flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Tech Support Add-on</div>
                <div className="text-[10px] text-neutral-500">Mitigates churn risk</div>
              </div>
              <input
                type="checkbox"
                checked={hasTechSupport}
                onChange={(e) => setHasTechSupport(e.target.checked)}
                className="w-4 h-4 accent-purple-400 rounded cursor-pointer"
              />
            </div>
          </div>

        </div>

        {/* Right: Live ML Inference Score & SHAP Drivers */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#050505] border border-white/[0.06] space-y-5">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-mono text-neutral-400">PREDICTED CHURN PROBABILITY</span>
            <div className="text-5xl font-extrabold font-mono text-white">
              {churnProbability}%
            </div>
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${riskColor}`}>
              {riskTier.toUpperCase()}
            </div>
          </div>

          {/* Simulated SHAP Value Drivers */}
          <div className="space-y-2.5 pt-2 border-t border-white/[0.06] font-mono text-xs">
            <div className="flex justify-between text-neutral-400 text-[11px]">
              <span>SHAP FEATURE ATTRIBUTION</span>
              <span>IMPACT DIRECTION</span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-neutral-300">Contract: {contractType}</span>
                <span className={contractType === "Month-to-Month" ? "text-red-400" : "text-emerald-400"}>
                  {contractType === "Month-to-Month" ? "+28% Churn Risk" : "-18% Retention"}
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-neutral-300">Support Complaints ({supportCalls})</span>
                <span className={supportCalls > 2 ? "text-red-400" : "text-emerald-400"}>
                  {supportCalls > 2 ? `+${supportCalls * 7}% Frustration` : "Neutral"}
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-neutral-300">Tenure ({tenure} months)</span>
                <span className="text-emerald-400">
                  -{Math.round(tenure * 0.7)}% Loyalty
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#0e0a14] border border-purple-500/20 text-[11px] font-mono text-purple-300">
            💡 Recommended Action: {churnProbability > 50 ? "Trigger automated retention discount offer & senior support callback." : "Customer is healthy. Upsell annual renewal loyalty tier."}
          </div>

        </div>

      </div>

    </div>
  );
};
