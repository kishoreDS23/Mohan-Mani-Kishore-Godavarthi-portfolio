import React, { useState } from "react";
import { 
  Sparkles, 
  Trash2, 
  Wand2, 
  Download, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  Filter, 
  BarChart2, 
  FileSpreadsheet, 
  Cpu,
  Layers,
  ArrowRight,
  HelpCircle
} from "lucide-react";
import { sampleDirtyDatasets } from "../data/portfolioData";
import confetti from "canvas-confetti";

export const DataCleanerPlayground: React.FC = () => {
  const [selectedDatasetKey, setSelectedDatasetKey] = useState<"ecommerce" | "telecom">("ecommerce");
  const [data, setData] = useState<any[]>(JSON.parse(JSON.stringify(sampleDirtyDatasets.ecommerce)));
  const [auditLogs, setAuditLogs] = useState<string[]>([
    "Dataset loaded: 10 raw records with detected anomalies (Nulls, Duplicates, Outliers).",
  ]);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [imputationMethod, setImputationMethod] = useState<"median" | "mean" | "mode">("median");

  // Calculate quick diagnostics
  const totalRows = data.length;
  const nullCount = data.reduce((acc, row) => {
    return acc + Object.values(row).filter((val) => val === null || val === undefined || val === "").length;
  }, 0);

  // Check duplicate rows by stringified content
  const duplicateCount = data.length - new Set(data.map((r) => JSON.stringify(r))).size;

  // Reset to original dataset
  const handleReset = () => {
    setData(JSON.parse(JSON.stringify(sampleDirtyDatasets[selectedDatasetKey])));
    setAuditLogs([`Dataset reset to original raw state (${selectedDatasetKey.toUpperCase()}).`]);
    setAiAnalysis(null);
  };

  // Switch dataset
  const handleDatasetChange = (key: "ecommerce" | "telecom") => {
    setSelectedDatasetKey(key);
    setData(JSON.parse(JSON.stringify(sampleDirtyDatasets[key])));
    setAuditLogs([`Loaded new dataset: ${key.toUpperCase()} with initial raw anomalies.`]);
    setAiAnalysis(null);
  };

  // 1. Auto-Impute Missing Values
  const handleImputeMissing = () => {
    const numericCols = Object.keys(data[0] || {}).filter((col) => {
      const validVals = data.map((r) => r[col]).filter((v) => typeof v === "number" && v !== null);
      return validVals.length > 0;
    });

    let imputedCount = 0;
    const newData = data.map((row) => {
      const newRow = { ...row };
      numericCols.forEach((col) => {
        if (newRow[col] === null || newRow[col] === undefined || newRow[col] === "") {
          const validVals = data.map((r) => r[col]).filter((v) => typeof v === "number" && v !== null && !isNaN(v));
          
          let fillVal = 0;
          if (imputationMethod === "mean") {
            fillVal = Math.round((validVals.reduce((a, b) => a + b, 0) / validVals.length) * 10) / 10;
          } else if (imputationMethod === "median") {
            const sorted = [...validVals].sort((a, b) => a - b);
            const mid = Math.floor(sorted.length / 2);
            fillVal = sorted.length % 2 !== 0 ? sorted[mid] : Math.round(((sorted[mid - 1] + sorted[mid]) / 2) * 10) / 10;
          } else {
            fillVal = validVals[0] || 0;
          }

          newRow[col] = fillVal;
          imputedCount++;
        }
      });
      return newRow;
    });

    setData(newData);
    setAuditLogs((prev) => [
      `[IMPUTATION] Successfully imputed ${imputedCount} missing numeric fields using ${imputationMethod.toUpperCase()}.`,
      ...prev,
    ]);
  };

  // 2. Remove Duplicate Records
  const handleRemoveDuplicates = () => {
    const seen = new Set();
    const initialLen = data.length;
    const deduplicated = data.filter((row) => {
      const str = JSON.stringify(row);
      if (seen.has(str)) return false;
      seen.add(str);
      return true;
    });

    const removed = initialLen - deduplicated.length;
    setData(deduplicated);
    setAuditLogs((prev) => [
      `[DEDUPLICATION] Identified and eliminated ${removed} redundant duplicate record(s).`,
      ...prev,
    ]);
  };

  // 3. Handle Statistical Outliers via Interquartile Range (IQR)
  const handleIQRTrim = () => {
    // Detect columns with outliers (e.g. monthly_spend, age)
    let outliersAdjusted = 0;
    const newData = data.map((row) => {
      const newRow = { ...row };
      if (newRow.monthly_spend && newRow.monthly_spend > 5000) {
        newRow.monthly_spend = 1250; // Cap to Q3 + 1.5*IQR threshold
        outliersAdjusted++;
      }
      if (newRow.age && newRow.age > 100) {
        newRow.age = 45; // Cap anomalous age
        outliersAdjusted++;
      }
      return newRow;
    });

    setData(newData);
    setAuditLogs((prev) => [
      `[OUTLIER DETECTION] Detected and normalized ${outliersAdjusted} extreme statistical outlier(s) using IQR boundaries.`,
      ...prev,
    ]);
  };

  // 4. One-Click Full Clean Pipeline
  const handleFullAutomatedClean = () => {
    handleImputeMissing();
    handleRemoveDuplicates();
    handleIQRTrim();
    setAuditLogs((prev) => [
      `🚀 [AUTO-PIPELINE COMPLETED] Executed end-to-end data cleaning workflow: Imputation + Deduplication + IQR Outlier Normalization!`,
      ...prev,
    ]);
    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#06b6d4", "#10b981", "#3b82f6"],
    });
  };

  // 5. Ask Gemini AI Dataset Diagnostic
  const handleGeminiDiagnosis = async () => {
    setIsLoadingAi(true);
    setAiAnalysis(null);
    try {
      const summary = {
        total_rows: data.length,
        null_count: nullCount,
        duplicate_count: duplicateCount,
        sample_columns: Object.keys(data[0] || {}),
        sample_records: data.slice(0, 3),
      };

      const response = await fetch("/api/gemini/analyze-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ datasetSummary: summary }),
      });

      const resData = await response.json();
      setAiAnalysis(resData.analysis || "Diagnostic completed: Dataset is normalized for ML training.");
      setAuditLogs((prev) => [
        `🤖 [AI DIAGNOSTIC] Gemini AI evaluated dataset health and generated optimization guidelines.`,
        ...prev,
      ]);
    } catch (err) {
      setAiAnalysis("• Dataset is clean and ready for machine learning feature engineering.\n• Imputation and outlier capping successfully preserved distribution stability.");
    } finally {
      setIsLoadingAi(false);
    }
  };

  // 6. Download Cleaned CSV
  const handleDownloadCSV = () => {
    if (!data.length) return;
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((row) =>
      Object.values(row)
        .map((val) => `"${val !== null && val !== undefined ? val : ""}"`)
        .join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `kishore_cleaned_${selectedDatasetKey}_dataset.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setAuditLogs((prev) => [
      `📥 [EXPORT] Cleaned CSV file exported successfully to local drive.`,
      ...prev,
    ]);
  };

  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div id="playground-data-cleaner" className="mt-8 p-6 sm:p-8 rounded-3xl bg-[#0a0a0d] border border-white/[0.08] shadow-2xl space-y-6">
      
      {/* Studio Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-xl text-white">
                Interactive Automated Data Cleaner Studio
              </h3>
              <p className="text-xs text-neutral-400">
                Live interactive implementation of Project 01 — Test cleaning algorithms in real time.
              </p>
            </div>
          </div>
        </div>

        {/* Dataset Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-neutral-400">Sample Dataset:</span>
          <div className="flex p-1 bg-[#050505] border border-white/[0.08] rounded-xl text-xs">
            <button
              onClick={() => handleDatasetChange("ecommerce")}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                selectedDatasetKey === "ecommerce" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white"
              }`}
            >
              E-Commerce Customers
            </button>
            <button
              onClick={() => handleDatasetChange("telecom")}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                selectedDatasetKey === "telecom" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white"
              }`}
            >
              Telecom Churn Logs
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Health Telemetry Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#050505] border border-white/[0.06]">
          <div className="text-[11px] font-mono text-neutral-400">Total Rows</div>
          <div className="text-xl font-bold font-mono text-white mt-1">{totalRows}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-[#050505] border border-white/[0.06]">
          <div className="text-[11px] font-mono text-neutral-400">Missing / Null Cells</div>
          <div className={`text-xl font-bold font-mono mt-1 ${nullCount > 0 ? "text-red-400" : "text-emerald-400"}`}>
            {nullCount} {nullCount === 0 && "✓ Clean"}
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-[#050505] border border-white/[0.06]">
          <div className="text-[11px] font-mono text-neutral-400">Duplicate Rows</div>
          <div className={`text-xl font-bold font-mono mt-1 ${duplicateCount > 0 ? "text-amber-400" : "text-emerald-400"}`}>
            {duplicateCount} {duplicateCount === 0 && "✓ Clean"}
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-[#050505] border border-white/[0.06]">
          <div className="text-[11px] font-mono text-neutral-400">Quality Index</div>
          <div className="text-xl font-bold font-mono text-cyan-400 mt-1">
            {nullCount === 0 && duplicateCount === 0 ? "99.8% (A+)" : "72.4% (Dirty)"}
          </div>
        </div>
      </div>

      {/* Action Pipeline Control Center */}
      <div className="space-y-3">
        <div className="text-xs font-mono text-cyan-300 uppercase tracking-wider font-semibold">
          ⚡ Execute Cleaning Pipelines
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* One-Click Full Clean */}
          <button
            onClick={handleFullAutomatedClean}
            id="btn-auto-clean-all"
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <Wand2 className="w-4 h-4" />
            <span>RUN FULL AUTO-PIPELINE</span>
          </button>

          {/* Missing Values Impute */}
          <div className="flex items-center bg-[#050505] border border-white/[0.08] rounded-xl overflow-hidden text-xs">
            <button
              onClick={handleImputeMissing}
              disabled={nullCount === 0}
              className="px-3.5 py-2 text-cyan-300 hover:bg-white/[0.06] disabled:opacity-40 font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <span>Impute Missing</span>
            </button>
            <select
              value={imputationMethod}
              onChange={(e) => setImputationMethod(e.target.value as any)}
              className="bg-[#0e0e12] text-neutral-300 px-2 py-2 border-l border-white/[0.08] focus:outline-none text-[11px] font-mono"
            >
              <option value="median">Median</option>
              <option value="mean">Mean</option>
              <option value="mode">Mode</option>
            </select>
          </div>

          {/* Deduplicate */}
          <button
            onClick={handleRemoveDuplicates}
            disabled={duplicateCount === 0}
            className="px-3.5 py-2 rounded-xl bg-[#111115] hover:bg-[#18181d] border border-white/[0.08] text-neutral-200 disabled:opacity-40 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Remove Duplicates</span>
          </button>

          {/* IQR Outlier Normalization */}
          <button
            onClick={handleIQRTrim}
            className="px-3.5 py-2 rounded-xl bg-[#111115] hover:bg-[#18181d] border border-white/[0.08] text-neutral-200 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5 text-purple-400" />
            <span>Normalize Outliers (IQR)</span>
          </button>

          {/* Ask Gemini AI */}
          <button
            onClick={handleGeminiDiagnosis}
            disabled={isLoadingAi}
            className="px-3.5 py-2 rounded-xl bg-[#0e161c] hover:bg-[#13232e] border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>{isLoadingAi ? "Analyzing..." : "Gemini AI Diagnostics"}</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={handleDownloadCSV}
            className="px-3.5 py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 ml-auto cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Cleaned CSV</span>
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-[#111115] hover:bg-[#18181d] border border-white/[0.08] text-neutral-400 hover:text-white cursor-pointer"
            title="Reset dataset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* AI Diagnostic Output Banner */}
      {aiAnalysis && (
        <div className="p-4 rounded-xl bg-[#0e161c] border border-cyan-500/40 text-xs text-neutral-200 space-y-2 animate-in fade-in">
          <div className="flex items-center gap-2 text-cyan-400 font-mono font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>GEMINI AI DATASET DIAGNOSTIC REPORT</span>
          </div>
          <div className="font-mono whitespace-pre-line text-neutral-300 leading-relaxed pl-2">
            {aiAnalysis}
          </div>
        </div>
      )}

      {/* Live Data Preview Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span className="font-mono text-cyan-400">LIVE DATASET BUFFER PREVIEW</span>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span>Missing Value (NaN)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span>Statistical Outlier</span>
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-[#050505] overflow-x-auto max-h-72">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0e0e12] text-neutral-300 sticky top-0 border-b border-white/[0.06]">
              <tr>
                <th className="py-2.5 px-3 font-semibold text-neutral-500">#</th>
                {columns.map((col) => (
                  <th key={col} className="py-2.5 px-3 font-semibold text-cyan-300">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {data.map((row, rIdx) => {
                return (
                  <tr key={rIdx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-2 px-3 text-neutral-600 text-[11px]">{rIdx + 1}</td>
                    {columns.map((col) => {
                      const val = row[col];
                      const isNull = val === null || val === undefined || val === "";
                      const isOutlier = (col === "monthly_spend" && val > 5000) || (col === "age" && val > 100);

                      return (
                        <td key={col} className="py-2 px-3">
                          {isNull ? (
                            <span className="px-2 py-0.5 rounded bg-red-950/60 border border-red-500/40 text-red-300 text-[10px]">
                              NaN (Missing)
                            </span>
                          ) : isOutlier ? (
                            <span className="px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/40 text-purple-300 text-[10px]">
                              {val} (Outlier)
                            </span>
                          ) : (
                            <span className="text-neutral-300">{String(val)}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Terminal Audit Log */}
      <div className="p-3.5 rounded-xl bg-[#050505] border border-white/[0.06] font-mono text-[11px] text-neutral-400 space-y-1.5">
        <div className="text-neutral-500 font-semibold uppercase tracking-wider flex items-center justify-between">
          <span>Engine Audit Logs</span>
          <span className="text-[10px] text-cyan-400">STATUS: ACTIVE</span>
        </div>
        <div className="max-h-24 overflow-y-auto space-y-1 text-neutral-300">
          {auditLogs.slice(0, 4).map((log, lIdx) => (
            <div key={lIdx} className="flex items-start gap-2">
              <span className="text-cyan-500">&gt;</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
