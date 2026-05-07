"use client";

import React, { useEffect } from "react";
import { X, Copy, Check, Terminal, ExternalLink } from "lucide-react";
import { AuditIssue } from "../data/mockAuditData";

interface IssueDrawerProps {
  issue: AuditIssue | null;
  isOpen: boolean;
  onClose: () => void;
}

const severityStyle = (sev: string): { bg: string; color: string; border: string } => {
  switch (sev) {
    case "critical": return { bg: "#ffd7f0", color: "#111111", border: "#ffd7f0" };
    case "warning":  return { bg: "#fbc76830", color: "#111111", border: "#fbc768" };
    case "optimized": return { bg: "#b7efb230", color: "#111111", border: "#47d096" };
    default:         return { bg: "#e2ddfd", color: "#111111", border: "#e2ddfd" };
  }
};

export default function IssueDrawer({ issue, isOpen, onClose }: IssueDrawerProps) {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen || !issue) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(issue.codeAfter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sev = severityStyle(issue.severity);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{ background: "rgba(17,17,17,0.25)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-2xl h-full flex flex-col z-10 overflow-y-auto"
        style={{
          background: "#ffffff",
          borderLeft: "1px solid rgba(17,17,17,0.08)",
          boxShadow: "rgba(17,17,17,0.12) 0px 26px 60px -6px",
        }}
      >
        {/* Severity accent bar */}
        <div className="absolute top-0 left-0 w-1 h-full" style={{ background: sev.border }} />

        {/* Header */}
        <div
          className="px-8 py-6 flex items-start justify-between"
          style={{ borderBottom: "1px solid rgba(17,17,17,0.06)" }}
        >
          <div className="flex flex-col gap-2 pl-2">
            <div className="flex items-center gap-2">
              <span
                className="px-2.5 py-1 rounded-xl text-xs font-semibold"
                style={{ background: sev.bg, color: sev.color, letterSpacing: "0.3px" }}
              >
                {issue.severity.toUpperCase()}
              </span>
              <span style={{ fontSize: "12px", fontWeight: 500, color: "#6d6c6b", letterSpacing: "0.3px" }}>
                {issue.category}
              </span>
            </div>
            <h2
              className="font-bold"
              style={{ fontSize: "20px", color: "#111111", lineHeight: 1.2, letterSpacing: "-0.2px" }}
            >
              {issue.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl transition-colors hover:bg-[#f4f3ef] cursor-pointer"
            style={{ border: "1px solid rgba(17,17,17,0.08)", color: "#6d6c6b" }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-6 flex-1 flex flex-col gap-6 pl-10">
          {/* Metadata */}
          <div
            className="grid grid-cols-2 gap-4 p-4 rounded-xl"
            style={{ background: "#f4f3ef", border: "1px solid rgba(17,17,17,0.06)" }}
          >
            <div>
              <p style={{ fontSize: "10px", fontWeight: 700, color: "#6d6c6b", letterSpacing: "0.3px", marginBottom: "4px" }}>
                FILE LOCATION
              </p>
              <p className="flex items-center gap-1.5 break-all" style={{ fontSize: "12px", fontFamily: "monospace", color: "#111111" }}>
                <Terminal size={12} style={{ color: "#328efa", flexShrink: 0 }} />
                {issue.location}
              </p>
            </div>
            <div>
              <p style={{ fontSize: "10px", fontWeight: 700, color: "#6d6c6b", letterSpacing: "0.3px", marginBottom: "4px" }}>
                GUIDING LAW / SPEC
              </p>
              <p className="flex items-center gap-1.5" style={{ fontSize: "12px", fontWeight: 500, color: "#111111" }}>
                <ExternalLink size={12} style={{ color: "#6d6c6b", flexShrink: 0 }} />
                {issue.law}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 style={{ fontSize: "10px", fontWeight: 700, color: "#6d6c6b", letterSpacing: "0.3px", marginBottom: "8px" }}>
              ISSUE SUMMARY
            </h3>
            <p style={{ fontSize: "14px", color: "#111111", lineHeight: 1.6, letterSpacing: "0.25px" }}>
              {issue.description}
            </p>
          </div>

          {/* UX Impact */}
          <div>
            <h3 style={{ fontSize: "10px", fontWeight: 700, color: "#6d6c6b", letterSpacing: "0.3px", marginBottom: "8px" }}>
              USER EXPERIENCE IMPACT
            </h3>
            <div
              className="p-4 rounded-xl"
              style={{
                background: "#ffd7f0",
                borderLeft: "3px solid #e16540",
              }}
            >
              <p style={{ fontSize: "13px", color: "#111111", lineHeight: 1.6 }}>{issue.impact}</p>
            </div>
          </div>

          {/* Recommendation */}
          <div>
            <h3 style={{ fontSize: "10px", fontWeight: 700, color: "#6d6c6b", letterSpacing: "0.3px", marginBottom: "8px" }}>
              ACTIONABLE RECOMMENDATION
            </h3>
            <p style={{ fontSize: "14px", color: "#111111", lineHeight: 1.6, letterSpacing: "0.25px", marginBottom: "16px" }}>
              {issue.recommendation}
            </p>

            {/* Code Diff */}
            <div
              className="rounded-xl overflow-hidden"
              style={{ border: "1px solid rgba(17,17,17,0.08)" }}
            >
              <div
                className="px-4 py-3 flex items-center justify-between"
                style={{ background: "#f4f3ef", borderBottom: "1px solid rgba(17,17,17,0.06)" }}
              >
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#6d6c6b", letterSpacing: "0.3px" }}>
                  PROPOSED SOLUTION
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 cursor-pointer transition-colors hover:opacity-70"
                  style={{ fontSize: "12px", color: "#111111", background: "none", border: "none" }}
                >
                  {copied ? <Check size={13} style={{ color: "#47d096" }} /> : <Copy size={13} />}
                  {copied ? "Copied!" : "Copy Fix"}
                </button>
              </div>

              <div className="flex flex-col" style={{ fontFamily: "monospace", fontSize: "12px", lineHeight: 1.6 }}>
                <div className="p-4" style={{ background: "#fff5f5", borderBottom: "1px solid rgba(17,17,17,0.05)" }}>
                  <div
                    className="inline-block mb-2 px-2 py-0.5 rounded text-xs font-bold"
                    style={{ background: "#ffd7f0", color: "#111111" }}
                  >
                    Original Code
                  </div>
                  <pre className="whitespace-pre-wrap overflow-x-auto" style={{ color: "#6d6c6b" }}>
                    <code>{issue.codeBefore}</code>
                  </pre>
                </div>

                <div className="p-4" style={{ background: "#f5fff8" }}>
                  <div
                    className="inline-block mb-2 px-2 py-0.5 rounded text-xs font-bold"
                    style={{ background: "#b7efb2", color: "#111111" }}
                  >
                    Optimized Code
                  </div>
                  <pre className="whitespace-pre-wrap overflow-x-auto" style={{ color: "#111111" }}>
                    <code>{issue.codeAfter}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
