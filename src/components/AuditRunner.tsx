"use client";

import React, { useState, useEffect } from "react";
import { Search, Loader2, Cpu, Globe, Laptop, Smartphone, User, FileImage } from "lucide-react";

interface AuditRunnerProps {
  onAuditComplete: (url: string) => void;
}

export default function AuditRunner({ onAuditComplete }: AuditRunnerProps) {
  const [url, setUrl] = useState("unboringsurveys.app");
  const [persona, setPersona] = useState("accessibility");
  const [viewport, setViewport] = useState("mobile");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [progressVal, setProgressVal] = useState(0);

  const analysisSteps = [
    { text: "Connecting to server and caching assets...", duration: 1000 },
    { text: "Scanning DOM elements & CSS layout trees...", duration: 1200 },
    { text: "Computing text & background contrast ratios (WCAG 2.1)...", duration: 1400 },
    { text: "Mapping click targets & mobile touch buffers...", duration: 1200 },
    { text: "Analyzing UX copywriting with NLP readability formulas...", duration: 1100 },
    { text: "Generating custom code-diff patches...", duration: 800 },
  ];

  const handleStartAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setIsAnalyzing(true);
    setProgressVal(0);
  };

  useEffect(() => {
    if (!isAnalyzing) return;
    let stepIndex = 0;
    let timer: NodeJS.Timeout;
    const runStep = () => {
      if (stepIndex < analysisSteps.length) {
        setProgressText(analysisSteps[stepIndex].text);
        setProgressVal(((stepIndex + 1) / analysisSteps.length) * 100);
        timer = setTimeout(() => { stepIndex++; runStep(); }, analysisSteps[stepIndex].duration);
      } else {
        setIsAnalyzing(false);
        onAuditComplete(url);
      }
    };
    runStep();
    return () => clearTimeout(timer);
  }, [isAnalyzing]);

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "#ffffff",
    border: "1px solid rgba(17,17,17,0.08)",
    borderRadius: "12px",
    padding: "10px 14px",
    fontSize: "14px",
    color: "#111111",
    outline: "none",
    fontFamily: "inherit",
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    padding: "8px 12px",
    fontSize: "13px",
    cursor: "pointer",
    appearance: "none" as const,
  };

  return (
    <div className="card-elevated p-6 h-full flex flex-col">
      {isAnalyzing ? (
        <div className="flex flex-col items-center justify-center py-10 h-full text-center gap-4">
          <div className="relative">
            <Loader2 size={44} className="animate-spin" style={{ color: "#328efa" }} />
            <Cpu size={18} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ color: "#111111" }} />
          </div>

          <div>
            <p className="font-bold" style={{ fontSize: "16px", color: "#111111", letterSpacing: "-0.2px" }}>
              Auditing Interface
            </p>
            <p className="font-mono mt-1" style={{ fontSize: "12px", color: "#6d6c6b", letterSpacing: "0.3px" }}>
              {url}
            </p>
          </div>

          <div className="w-full max-w-xs">
            <div className="w-full h-1.5 rounded-full overflow-hidden mb-3" style={{ background: "rgba(17,17,17,0.06)" }}>
              <div
                className="h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressVal}%`, background: "#328efa" }}
              />
            </div>
            <p style={{ fontSize: "12px", color: "#6d6c6b", letterSpacing: "0.25px" }}>
              {progressText}
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleStartAudit} className="flex flex-col justify-between h-full gap-5">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Search size={14} style={{ color: "#6d6c6b" }} />
              <h2 style={{ fontSize: "12px", fontWeight: 600, color: "#6d6c6b", letterSpacing: "0.3px" }}>
                CONFIGURE NEW AUDIT
              </h2>
            </div>

            <div className="relative">
              <Globe size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#6d6c6b" }} />
              <input
                type="text"
                placeholder="Enter target URL (e.g., example.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                style={{ ...inputStyle, paddingLeft: "36px" }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label style={{ fontSize: "10px", fontWeight: 700, color: "#6d6c6b", letterSpacing: "0.3px" }}>
                  AUDITOR PERSONA
                </label>
                <select value={persona} onChange={(e) => setPersona(e.target.value)} style={selectStyle}>
                  <option value="accessibility">Elderly (Accessibility-First)</option>
                  <option value="techy">Developer (W3C/WCAG Standards)</option>
                  <option value="impatient">Distracted User (Impatient/Mobile)</option>
                  <option value="seo">SEO Crawler (Search Indexing)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label style={{ fontSize: "10px", fontWeight: 700, color: "#6d6c6b", letterSpacing: "0.3px" }}>
                  VIEWPORT TARGET
                </label>
                <select value={viewport} onChange={(e) => setViewport(e.target.value)} style={selectStyle}>
                  <option value="mobile">Mobile (iPhone 14/15)</option>
                  <option value="desktop">Desktop (1440px)</option>
                  <option value="tablet">Tablet (iPad Pro)</option>
                </select>
              </div>
            </div>

            <div
              className="flex flex-col items-center justify-center text-center p-4 rounded-xl"
              style={{ border: "1px dashed rgba(17,17,17,0.12)", background: "#f4f3ef" }}
            >
              <FileImage size={20} style={{ color: "#6d6c6b", marginBottom: "6px" }} />
              <span style={{ fontSize: "12px", fontWeight: 500, color: "#111111" }}>
                Drag & drop visual mockup
              </span>
              <span style={{ fontSize: "10px", color: "#6d6c6b", marginTop: "2px" }}>
                Supports PNG, JPG, WebP up to 10MB
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 cursor-pointer transition-all hover:opacity-90 active:scale-[0.98]"
            style={{
              background: "#111111",
              color: "#ffffff",
              fontWeight: 500,
              fontSize: "14px",
              padding: "12px 16px",
              borderRadius: "8px",
              border: "none",
              letterSpacing: "0.25px",
            }}
          >
            <Cpu size={15} />
            Analyze & Build Report
          </button>
        </form>
      )}
    </div>
  );
}
