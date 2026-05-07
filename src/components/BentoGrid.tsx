"use client";

import React from "react";
import { Zap, Eye, Compass, FileText } from "lucide-react";

interface BentoGridProps {
  scores: {
    Performance: number;
    Accessibility: number;
    Heuristics: number;
    Copy: number;
  };
}

const cards = [
  {
    id: "performance",
    title: "Performance",
    key: "Performance" as const,
    icon: Zap,
    desc: "Resource loads & paint execution",
    accent: "#fbc768",
    accentBg: "#fbc76820",
  },
  {
    id: "accessibility",
    title: "Accessibility",
    key: "Accessibility" as const,
    icon: Eye,
    desc: "Contrast, ARIA, visual legibility",
    accent: "#e16540",
    accentBg: "#e1654018",
  },
  {
    id: "heuristics",
    title: "UX Heuristics",
    key: "Heuristics" as const,
    icon: Compass,
    desc: "Usability laws & touch sizing",
    accent: "#328efa",
    accentBg: "#328efa18",
  },
  {
    id: "copy",
    title: "UX Copy",
    key: "Copy" as const,
    icon: FileText,
    desc: "Clarity, alignment, microcopy",
    accent: "#47d096",
    accentBg: "#47d09618",
  },
];

export default function BentoGrid({ scores }: BentoGridProps) {
  const getScoreLabel = (val: number) => {
    if (val >= 90) return "Excellent";
    if (val >= 70) return "Good";
    return "Needs Work";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
      {cards.map((card) => {
        const Icon = card.icon;
        const score = scores[card.key];
        return (
          <div
            key={card.id}
            className="card-elevated p-5 flex flex-col justify-between"
            style={{ borderLeft: `3px solid ${card.accent}` }}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span style={{ fontSize: "12px", letterSpacing: "0.3px", color: "#6d6c6b", fontWeight: 500 }}>
                  {card.title}
                </span>
                <div
                  className="p-1.5 rounded-xl"
                  style={{ background: card.accentBg }}
                >
                  <Icon size={16} style={{ color: card.accent }} />
                </div>
              </div>

              <div className="flex items-baseline gap-1 mb-3">
                <span
                  className="font-black tabular-nums"
                  style={{ fontSize: "36px", lineHeight: 1.1, letterSpacing: "-1.32px", color: "#111111" }}
                >
                  {score}
                </span>
                <span style={{ fontSize: "12px", color: "#6d6c6b" }}>/100</span>
              </div>
            </div>

            <div>
              <div
                className="w-full h-1.5 rounded-full overflow-hidden mb-3"
                style={{ background: "rgba(17,17,17,0.06)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${score}%`, background: card.accent }}
                />
              </div>

              <div>
                <span style={{ fontSize: "12px", fontWeight: 500, color: "#111111" }}>
                  {getScoreLabel(score)}
                </span>
                <span style={{ fontSize: "11px", color: "#6d6c6b", marginLeft: "6px" }}>
                  · {card.desc}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
