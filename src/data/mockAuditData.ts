export interface AuditIssue {
  id: string;
  category: 'Performance' | 'Accessibility' | 'Heuristics' | 'Copy';
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'optimized' | 'info';
  law: string;
  impact: string;
  recommendation: string;
  codeBefore: string;
  codeAfter: string;
  location: string;
}

export interface AuditReport {
  targetUrl: string;
  overallScore: number;
  date: string;
  summary: string;
  categoryScores: {
    Performance: number;
    Accessibility: number;
    Heuristics: number;
    Copy: number;
  };
  issues: AuditIssue[];
}

export const initialAuditReport: AuditReport = {
  targetUrl: "unboringsurveys.app",
  overallScore: 78,
  date: "May 6, 2026",
  summary: "The survey experience is highly visual and engaging, but suffers from accessibility barriers (low text-contrast) and minor performance bottlenecks due to unoptimized assets. Aligning interactive tap targets to mobile guidelines will significantly erase friction.",
  categoryScores: {
    Performance: 82,
    Accessibility: 64,
    Heuristics: 88,
    Copy: 78
  },
  issues: [
    {
      id: "issue-1",
      category: "Accessibility",
      title: "Insufficient contrast ratio on interactive primary buttons",
      description: "The contrast between the white text and the neon-cyan button background (#00F0FF) is 2.1:1, failing the WCAG 2.1 AA requirement of at least 4.5:1 for normal text.",
      severity: "critical",
      law: "WCAG 2.1 AA Contrast Minimum",
      impact: "Users with low vision or viewing the portal under bright sunlight cannot distinguish or read the text inside primary interactive elements.",
      recommendation: "Darken the text to a high-contrast deep slate (#0B0F19) or deepen the button color to deep sapphire to preserve readability while maintaining branding.",
      codeBefore: `<button className="bg-[#00F0FF] text-white py-3 px-6 rounded-full font-bold">
  Complete Survey
</button>`,
      codeAfter: `<button className="bg-[#00F0FF] text-[#0b0f19] py-3 px-6 rounded-full font-bold transition-all hover:brightness-110 active:scale-98">
  Complete Survey
</button>`,
      location: "components/games/DartThrow.tsx:L42"
    },
    {
      id: "issue-2",
      category: "Heuristics",
      title: "Interactive targets (buttons/cards) are too small for touch inputs",
      description: "Several click targets on mobile viewports measure 28px by 28px. The recommended minimum target size is 44px by 44px (Apple HIG) or 48px by 48px (Android Material Design).",
      severity: "critical",
      law: "Fitts's Law & Target Sizes",
      impact: "Users on mobile devices suffer from high frustration rates and accidental misclicks ('fat-finger' friction) when interacting with dashboard sliders.",
      recommendation: "Expand the padding of the clickable area using a larger tap target container or increase padding inside utility class specifications.",
      codeBefore: `<button className="w-7 h-7 flex items-center justify-center rounded-md border border-zinc-700">
  <ChevronRight size={14} />
</button>`,
      codeAfter: `<button className="w-11 h-11 flex items-center justify-center rounded-md border border-zinc-700 transition-colors hover:bg-zinc-800 md:w-9 md:h-9">
  <ChevronRight size={16} />
</button>`,
      location: "components/adventures/PizzaBuilder.tsx:L122"
    },
    {
      id: "issue-3",
      category: "Performance",
      title: "Unoptimized custom SVG illustration in Dartboard rendering",
      description: "The custom dartboard visual triggers heavy layout re-paint operations during radial hit calculations because vectors contain inline XML and redundant path coordinates.",
      severity: "warning",
      law: "Core Web Vitals - Interaction to Next Paint (INP)",
      impact: "Triggers a micro-stutter (~80ms layout delay) during fast user interactions, diminishing the perceived premium fluidity.",
      recommendation: "Simplify SVG structures, use hardware-accelerated transforms (`transform-gpu`), and apply the `will-change` CSS selector to isolate drawing operations.",
      codeBefore: `<svg className="w-full h-full" style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.5))" }}>
  <path d="..." />
  {/* Redundant inline elements recalculating per frame */}
</svg>`,
      codeAfter: `<svg className="w-full h-full transform-gpu will-change-transform filter drop-shadow-xl">
  <path d="..." />
</svg>`,
      location: "components/games/DartThrow.tsx:L14"
    },
    {
      id: "issue-4",
      category: "Copy",
      title: "Ambiguous microcopy on final submission modal",
      description: "The cancel button reads 'Cancel' while the submit button reads 'Submit'. However, the modal title is 'Are you sure you want to exit?'. This creates cognitive dissonance.",
      severity: "warning",
      law: "Heuristic #10: Help and Documentation",
      impact: "Users are unsure if 'Submit' exits without saving or saves and exits. Creates high friction and accidental data abandonment.",
      recommendation: "Change labels to match the explicit user actions: 'Exit & Abandon' (destructive rose) and 'Keep Surveying' (neutral/safe).",
      codeBefore: `<div className="flex gap-4">
  <button>Cancel</button>
  <button>Submit</button>
</div>`,
      codeAfter: `<div className="flex gap-4">
  <button className="text-zinc-400 hover:text-white px-4 py-2 font-medium">Keep Surveying</button>
  <button className="bg-neon-rose text-white font-bold px-6 py-2 rounded-lg hover:brightness-110">Exit & Abandon</button>
</div>`,
      location: "components/adventures/PizzaBuilder.tsx:L280"
    },
    {
      id: "issue-5",
      category: "Accessibility",
      title: "Missing descriptive alt tags on interactive visual avatars",
      description: "The mascot avatars inside the dashboard are designated with generic string labels ('avatar-bird') instead of meaningful description or alternative labels.",
      severity: "warning",
      law: "WCAG 2.1 AA Non-Text Content",
      impact: "Screen reader users miss out on branding cues and emotional design details, leading to an unequal user experience.",
      recommendation: "Provide a detailed `alt` description for the decorative avatar image explaining its expression, or use `aria-hidden=\"true\"` if purely structural.",
      codeBefore: `<img src="/mascots/peek-bird.svg" alt="avatar" />`,
      codeAfter: `<img src="/mascots/peek-bird.svg" alt="Joyful mascot bird peeking and cheering you on" aria-label="Mascot bird" />`,
      location: "components/adventures/PizzaBuilder.tsx:L82"
    },
    {
      id: "issue-6",
      category: "Performance",
      title: "Layout Shift (CLS) on dynamic game result scores",
      description: "When score results render asynchronously after high-score computations, they push adjacent feedback text down by 48px, causing a visual jump.",
      severity: "optimized",
      law: "Core Web Vitals - Cumulative Layout Shift (CLS)",
      impact: "A low layout shift is recorded, but it occasionally triggers jerky animations on low-spec mobile browsers.",
      recommendation: "Add a skeleton loader or designate a fixed min-height to the score container to reserve layout dimensions.",
      codeBefore: `<div className="mt-4">
  {score && <p className="text-3xl font-bold">{score} pts</p>}
</div>`,
      codeAfter: `<div className="mt-4 min-h-[48px] flex items-center">
  {score ? (
    <p className="text-3xl font-bold text-neon-purple tabular-nums">{score} pts</p>
  ) : (
    <div className="h-8 w-24 bg-zinc-800 animate-pulse rounded" />
  )}
</div>`,
      location: "components/games/DartThrow.tsx:L190"
    }
  ]
};
