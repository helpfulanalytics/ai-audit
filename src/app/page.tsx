"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

/* ── Design tokens ── */
const T = {
  ink:       "#061b31",
  slate:     "#50617a",
  ghost:     "#64748d",
  white:     "#ffffff",
  porcelain: "#f8fafd",
  powder:    "#e5edf5",
  stone:     "#d8d6df",
  violet:    "#533afd",
  washed:    "#b9b9f9",
  soft:      "#8087ff",
  orange:    "#ff6118",
  green:     "#81b81a",
};

/* ── Scroll reveal hook ── */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ── Global keyframes injected once ── */
const KEYFRAMES = `
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes toastIn {
    from { opacity: 0; transform: translateX(120px) scale(0.95); }
    to   { opacity: 1; transform: translateX(0) scale(1); }
  }
  @keyframes toastOut {
    from { opacity: 1; transform: translateX(0) scale(1); }
    to   { opacity: 0; transform: translateX(120px) scale(0.95); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0)    scale(1); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes floatGlow {
    0%, 100% { transform: translateY(0px) scale(1);   opacity: 0.55; }
    50%       { transform: translateY(-14px) scale(1.06); opacity: 0.85; }
  }
  @keyframes floatGlow2 {
    0%, 100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.4; }
    33%       { transform: translateY(-10px) translateX(8px) scale(1.04); opacity: 0.7; }
    66%       { transform: translateY(6px) translateX(-6px) scale(0.97); opacity: 0.5; }
  }
  @keyframes floatGlow3 {
    0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
    50%       { transform: translateY(12px) translateX(-10px); opacity: 0.6; }
  }
  @keyframes meshRotate {
    0%   { transform: rotate(0deg) scale(1.1); }
    100% { transform: rotate(360deg) scale(1.1); }
  }
  @keyframes gradientShift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes gridDrift {
    0%   { transform: translateY(0px); }
    100% { transform: translateY(40px); }
  }
  @keyframes particleDrift {
    0%   { transform: translateY(0px) translateX(0px); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 1; }
    100% { transform: translateY(-120px) translateX(20px); opacity: 0; }
  }
  @keyframes spinSlow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes counterPop {
    0%   { transform: scale(0.85); opacity: 0; }
    60%  { transform: scale(1.06); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes badgePulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(83, 58, 253, 0.3); }
    50%       { box-shadow: 0 0 0 8px rgba(83, 58, 253, 0); }
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

function StyleTag() {
  return <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />;
}

/* ── Animated section wrapper ── */
function Reveal({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.98)",
        transition: `opacity 0.55s cubic-bezier(0.23, 1, 0.32, 1) ${delay}ms, transform 0.55s cubic-bezier(0.23, 1, 0.32, 1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── CTA Button with shimmer ── */
function PrimaryButton({ children, onClick, style }: { children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        background: hovered
          ? "linear-gradient(90deg, #533afd 0%, #8087ff 40%, #533afd 80%, #533afd 100%)"
          : T.violet,
        backgroundSize: hovered ? "200% auto" : "100% auto",
        animation: hovered ? "shimmer 1.4s linear infinite" : "none",
        color: T.white,
        borderRadius: "4px",
        padding: "15px 28px",
        fontSize: "15px",
        fontWeight: 500,
        border: "none",
        cursor: "pointer",
        lineHeight: 1.4,
        letterSpacing: "0.003px",
        transform: pressed ? "scale(0.97)" : hovered ? "scale(1.02)" : "scale(1)",
        transition: "transform 160ms cubic-bezier(0.23, 1, 0.32, 1), box-shadow 200ms ease",
        boxShadow: hovered
          ? `0 6px 24px rgba(83, 58, 253, 0.38), 0 2px 8px rgba(83, 58, 253, 0.2)`
          : `0 2px 8px rgba(83, 58, 253, 0.18)`,
        display: "inline-block",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function OutlineButton({ children, onClick, style }: { children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        background: hovered ? T.powder : "transparent",
        color: T.violet,
        border: `1.5px solid ${hovered ? T.soft : T.washed}`,
        borderRadius: "4px",
        padding: "13.5px 24px",
        fontSize: "14px",
        fontWeight: 400,
        cursor: "pointer",
        lineHeight: 1.4,
        transform: pressed ? "scale(0.97)" : "scale(1)",
        transition: "transform 160ms cubic-bezier(0.23, 1, 0.32, 1), background 180ms ease, border-color 180ms ease",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

/* ── Value card ── */
function ValueCard({ icon, title, body, delay }: { icon: string; title: string; body: string; delay: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Reveal delay={delay}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: T.white,
          borderRadius: "8px",
          padding: "28px 24px",
          border: `1px solid ${hovered ? T.washed : T.powder}`,
          boxShadow: hovered
            ? "rgba(83, 58, 253, 0.08) 0px 12px 36px 0px, rgba(0,0,0,0.06) 0px 2px 8px 0px"
            : "rgba(23, 23, 23, 0.06) 0px 3px 6px 0px",
          transform: hovered ? "translateY(-4px) scale(1.01)" : "translateY(0) scale(1)",
          transition: "transform 260ms cubic-bezier(0.23, 1, 0.32, 1), box-shadow 260ms ease, border-color 200ms ease",
          cursor: "default",
        }}
      >
        <div style={{ fontSize: "26px", marginBottom: "14px", lineHeight: 1 }}>{icon}</div>
        <h3 style={{ fontSize: "16px", fontWeight: 600, color: T.ink, marginBottom: "10px", letterSpacing: "-0.01em" }}>
          {title}
        </h3>
        <p style={{ fontSize: "14px", color: T.slate, lineHeight: 1.65, margin: 0 }}>{body}</p>
      </div>
    </Reveal>
  );
}

/* ── Process step ── */
function ProcessStep({ num, title, body, delay }: { num: string; title: string; body: string; delay: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Reveal delay={delay}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: T.porcelain,
          borderRadius: "8px",
          padding: "28px 24px",
          border: `1px solid ${hovered ? T.stone : "transparent"}`,
          boxShadow: hovered
            ? "rgba(0, 0, 0, 0.12) 0px 12px 40px 0px"
            : "rgba(0, 0, 0, 0.07) 0px 4px 16px 0px",
          transform: hovered ? "translateY(-3px)" : "translateY(0)",
          transition: "transform 240ms cubic-bezier(0.23, 1, 0.32, 1), box-shadow 240ms ease, border-color 200ms ease",
        }}
      >
        <div style={{
          width: "36px", height: "36px", borderRadius: "50%",
          background: hovered ? T.violet : T.powder,
          color: hovered ? T.white : T.violet,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "14px", fontWeight: 700, marginBottom: "16px",
          transition: "background 220ms ease, color 220ms ease",
          flexShrink: 0,
        }}>
          {num}
        </div>
        <h3 style={{ fontSize: "15px", fontWeight: 600, color: T.ink, marginBottom: "8px", letterSpacing: "-0.01em" }}>
          {title}
        </h3>
        <p style={{ fontSize: "14px", color: T.slate, lineHeight: 1.65, margin: 0 }}>{body}</p>
      </div>
    </Reveal>
  );
}

/* ── FAQ item ── */
function FAQItem({ q, a, delay }: { q: string; a: string; delay: number }) {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (bodyRef.current) setHeight(open ? bodyRef.current.scrollHeight : 0);
  }, [open]);

  return (
    <Reveal delay={delay}>
      <div
        style={{
          borderBottom: `1px solid ${T.powder}`,
          padding: "0",
        }}
      >
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            width: "100%", textAlign: "left", background: "none", border: "none",
            cursor: "pointer", padding: "20px 0",
            display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px",
          }}
        >
          <span style={{ fontSize: "15px", fontWeight: 500, color: T.ink, letterSpacing: "-0.01em" }}>{q}</span>
          <span style={{
            width: "20px", height: "20px", borderRadius: "50%",
            background: open ? T.violet : T.powder,
            color: open ? T.white : T.slate,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "14px", fontWeight: 700, flexShrink: 0,
            transition: "background 220ms ease, color 220ms ease, transform 220ms ease",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
          }}>
            +
          </span>
        </button>
        <div style={{
          overflow: "hidden",
          height: `${height}px`,
          transition: "height 320ms cubic-bezier(0.23, 1, 0.32, 1)",
        }}>
          <div ref={bodyRef} style={{ paddingBottom: "20px" }}>
            <p style={{ fontSize: "14px", color: T.slate, lineHeight: 1.7, margin: 0 }}>{a}</p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ── Metric badge ── */
function MetricBadge({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "36px", fontWeight: 300, color: T.violet, letterSpacing: "-0.03em", lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: "13px", color: T.slate, marginTop: "6px", letterSpacing: "0.01em" }}>{label}</div>
    </div>
  );
}

/* ── Payment Modal ── */
function PaymentModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep("success"); }, 1800);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(6, 27, 49, 0.55)",
        backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px 16px",
        animation: "fadeUp 0.28s cubic-bezier(0.23, 1, 0.32, 1)",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: T.white,
          borderRadius: "10px",
          width: "100%", maxWidth: "480px",
          overflowY: "auto",
          boxShadow: "rgba(0, 0, 0, 0.25) 0px 24px 64px -12px",
          animation: "fadeUp 0.32s cubic-bezier(0.23, 1, 0.32, 1)",
          margin: "auto",
        }}
      >
        {/* Modal header */}
        <div style={{
          padding: "24px 28px 20px",
          borderBottom: `1px solid ${T.powder}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ fontSize: "13px", color: T.ghost, marginBottom: "2px", letterSpacing: "0.3px" }}>
              AI BUSINESS ASSESSMENT
            </div>
            <div style={{ fontSize: "22px", fontWeight: 300, color: T.ink, letterSpacing: "-0.02em" }}>
              Complete your order
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: T.powder, border: "none", borderRadius: "50%",
              width: "32px", height: "32px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "16px", color: T.slate,
              transition: "background 160ms ease",
            }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: "24px 28px 28px" }}>
          {step === "success" ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>✓</div>
              <div style={{ fontSize: "20px", fontWeight: 500, color: T.ink, marginBottom: "8px" }}>
                Order confirmed
              </div>
              <p style={{ color: T.slate, fontSize: "14px", lineHeight: 1.6, marginBottom: "24px" }}>
                Check your inbox — your assessment kickoff details are on the way.
              </p>
              <PrimaryButton onClick={onClose}>Close</PrimaryButton>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <div style={{
                  background: T.porcelain, borderRadius: "6px", padding: "14px 16px",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  marginBottom: "16px",
                }}>
                  <span style={{ fontSize: "14px", color: T.ink, fontWeight: 500 }}>AI Business Assessment</span>
                  <span style={{ fontSize: "18px", fontWeight: 300, color: T.violet, letterSpacing: "-0.02em" }}>$997</span>
                </div>
              </div>
              {[
                { label: "Full name", placeholder: "Alex Johnson", type: "text" },
                { label: "Work email", placeholder: "alex@company.com", type: "email" },
                { label: "Company name", placeholder: "Acme Corp", type: "text" },
              ].map(field => (
                <div key={field.label} style={{ marginBottom: "14px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: T.ghost, marginBottom: "6px", letterSpacing: "0.3px" }}>
                    {field.label.toUpperCase()}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    required
                    style={{
                      width: "100%", padding: "10px 12px",
                      border: `1.5px solid ${T.stone}`, borderRadius: "4px",
                      fontSize: "14px", color: T.ink, background: T.white,
                      outline: "none", boxSizing: "border-box",
                      transition: "border-color 180ms ease",
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = T.violet)}
                    onBlur={e => (e.currentTarget.style.borderColor = T.stone)}
                  />
                </div>
              ))}
              <div style={{ marginTop: "22px" }}>
                <PrimaryButton style={{ width: "100%", textAlign: "center" as const }}>
                  {loading ? (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" style={{ animation: "spinSlow 0.8s linear infinite" }}>
                        <circle cx="8" cy="8" r="6" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                        <path d="M8 2 A6 6 0 0 1 14 8" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      Processing…
                    </span>
                  ) : "Get my assessment — $997"}
                </PrimaryButton>
              </div>
              <p style={{ fontSize: "12px", color: T.ghost, textAlign: "center", marginTop: "12px", lineHeight: 1.5 }}>
                Secured by Stripe · 30-day money-back guarantee
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Animated counter ── */
function AnimatedCounter({ target, prefix = "", suffix = "", duration = 1400 }: { target: number; prefix?: string; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  const elRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const step = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(ease * target));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);

  return <span ref={elRef}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

/* ── Floating particle ── */
function Particle({ x, y, size, delay, dur, opacity }: { x: string; y: string; size: number; delay: number; dur: number; opacity: number }) {
  return (
    <div style={{
      position: "absolute", left: x, top: y, pointerEvents: "none",
      width: size, height: size, borderRadius: "50%",
      background: `rgba(83, 58, 253, ${opacity})`,
      animation: `particleDrift ${dur}s ease-in-out ${delay}s infinite`,
      zIndex: 0,
    }} />
  );
}

/* ── Hero Section ── */
function HeroSection({ heroVisible, onCTA }: { heroVisible: boolean; onCTA: () => void }) {
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    };
    window.addEventListener("mousemove", handleMove, { passive: true });

    const animate = () => {
      if (orb1Ref.current) {
        const dx = (mouseRef.current.x - 0.5) * 40;
        const dy = (mouseRef.current.y - 0.5) * 30;
        orb1Ref.current.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
      }
      if (orb2Ref.current) {
        const dx = (mouseRef.current.x - 0.5) * -24;
        const dy = (mouseRef.current.y - 0.5) * -18;
        orb2Ref.current.style.transform = `translate(${dx}px, ${dy}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const particles = [
    { x: "12%", y: "20%", size: 5, delay: 0,   dur: 7,  opacity: 0.22 },
    { x: "88%", y: "15%", size: 3, delay: 1.2, dur: 9,  opacity: 0.18 },
    { x: "75%", y: "70%", size: 4, delay: 2.5, dur: 8,  opacity: 0.28 },
    { x: "20%", y: "75%", size: 6, delay: 0.8, dur: 11, opacity: 0.16 },
    { x: "55%", y: "85%", size: 3, delay: 3,   dur: 7,  opacity: 0.24 },
    { x: "35%", y: "12%", size: 4, delay: 1.8, dur: 10, opacity: 0.20 },
    { x: "92%", y: "55%", size: 5, delay: 0.4, dur: 8,  opacity: 0.15 },
    { x: "8%",  y: "50%", size: 3, delay: 2.2, dur: 9,  opacity: 0.26 },
  ];

  return (
    <section style={{
      minHeight: "100vh",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      textAlign: "center",
      padding: "80px 24px 60px",
      position: "relative",
      overflow: "hidden",
      background: "#ffffff",
    }}>
      {/* Animated grid backdrop */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(83, 58, 253, 0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(83, 58, 253, 0.04) 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
        animation: "gridDrift 12s ease-in-out infinite alternate",
        maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
      }} />

      {/* Primary orb — mouse-tracked */}
      <div ref={orb1Ref} style={{
        position: "absolute",
        top: "50%", left: "50%",
        width: "780px", height: "780px",
        background: "radial-gradient(circle at 40% 40%, rgba(127, 125, 252, 0.32) 0%, rgba(244, 75, 204, 0.16) 38%, rgba(229, 237, 245, 0.3) 65%, transparent 85%)",
        borderRadius: "50%",
        animation: "floatGlow 9s ease-in-out infinite",
        pointerEvents: "none",
        zIndex: 0,
        transition: "transform 1.2s cubic-bezier(0.23, 1, 0.32, 1)",
        willChange: "transform",
      }} />

      {/* Secondary orb — opposite mouse direction */}
      <div ref={orb2Ref} style={{
        position: "absolute",
        top: "22%", right: "10%",
        width: "460px", height: "460px",
        background: "radial-gradient(circle, rgba(128, 135, 255, 0.22) 0%, rgba(83, 58, 253, 0.08) 50%, transparent 75%)",
        borderRadius: "50%",
        animation: "floatGlow2 11s ease-in-out infinite",
        pointerEvents: "none",
        zIndex: 0,
        transition: "transform 1.6s cubic-bezier(0.23, 1, 0.32, 1)",
        willChange: "transform",
      }} />

      {/* Tertiary warm orb */}
      <div style={{
        position: "absolute",
        bottom: "10%", left: "8%",
        width: "320px", height: "320px",
        background: "radial-gradient(circle, rgba(255, 97, 24, 0.08) 0%, transparent 70%)",
        borderRadius: "50%",
        animation: "floatGlow3 13s ease-in-out infinite",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* Particles */}
      {particles.map((p, i) => <Particle key={i} {...p} />)}

      {/* Spinning ring accent */}
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        width: "680px", height: "680px",
        transform: "translate(-50%, -50%)",
        border: "1px solid rgba(83, 58, 253, 0.06)",
        borderRadius: "50%",
        animation: "meshRotate 40s linear infinite",
        pointerEvents: "none",
        zIndex: 0,
      }} />
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        width: "500px", height: "500px",
        transform: "translate(-50%, -50%)",
        border: "1px solid rgba(83, 58, 253, 0.04)",
        borderRadius: "50%",
        animation: "meshRotate 28s linear infinite reverse",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: "780px", width: "100%" }}>
        {/* Eyebrow badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "rgba(83, 58, 253, 0.07)",
          border: "1px solid rgba(83, 58, 253, 0.16)",
          borderRadius: "100px", padding: "7px 16px",
          marginBottom: "36px",
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? "translateY(0) scale(1)" : "translateY(14px) scale(0.95)",
          transition: "opacity 0.55s cubic-bezier(0.23, 1, 0.32, 1) 0ms, transform 0.55s cubic-bezier(0.23, 1, 0.32, 1) 0ms",
          animation: heroVisible ? "badgePulse 3s ease-in-out 1.2s infinite" : "none",
        }}>
          <span style={{
            width: "6px", height: "6px", borderRadius: "50%",
            background: T.violet, display: "inline-block", flexShrink: 0,
            boxShadow: `0 0 6px ${T.violet}`,
          }} />
          <span style={{ fontSize: "12px", fontWeight: 600, color: T.violet, letterSpacing: "0.4px" }}>
            AI-POWERED BUSINESS ASSESSMENT
          </span>
        </div>

        {/* Headline — line by line stagger */}
        {[
          { text: "Discover", delay: 80, plain: true },
        ].map(() => null)}
        <h1 style={{
          fontSize: "clamp(44px, 6.5vw, 78px)",
          fontWeight: 300,
          lineHeight: 1.06,
          letterSpacing: "-0.038em",
          color: T.ink,
          margin: "0 0 28px",
        }}>
          <span style={{
            display: "block",
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(22px)",
            transition: "opacity 0.65s cubic-bezier(0.23, 1, 0.32, 1) 80ms, transform 0.65s cubic-bezier(0.23, 1, 0.32, 1) 80ms",
          }}>
            Discover
          </span>
          <span style={{
            display: "block",
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(22px)",
            transition: "opacity 0.65s cubic-bezier(0.23, 1, 0.32, 1) 160ms, transform 0.65s cubic-bezier(0.23, 1, 0.32, 1) 160ms",
          }}>
            <span style={{
              background: `linear-gradient(120deg, ${T.violet} 20%, #a78bfa 60%, ${T.soft} 100%)`,
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: heroVisible ? "shimmer 4s linear infinite" : "none",
            }}>
              $10,000+
            </span>{" "}in hidden
          </span>
          <span style={{
            display: "block",
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(22px)",
            transition: "opacity 0.65s cubic-bezier(0.23, 1, 0.32, 1) 240ms, transform 0.65s cubic-bezier(0.23, 1, 0.32, 1) 240ms",
          }}>
            savings
          </span>
        </h1>

        {/* Sub */}
        <p style={{
          fontSize: "19px", fontWeight: 400, color: T.slate, lineHeight: 1.65,
          maxWidth: "520px", margin: "0 auto 44px",
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.65s cubic-bezier(0.23, 1, 0.32, 1) 320ms, transform 0.65s cubic-bezier(0.23, 1, 0.32, 1) 320ms",
        }}>
          A senior consultant reviews your entire business — tools, pricing, processes, and teams — and delivers a clear roadmap in 5 days.
        </p>

        {/* CTAs */}
        <div style={{
          display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center",
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? "translateY(0)" : "translateY(14px)",
          transition: "opacity 0.65s cubic-bezier(0.23, 1, 0.32, 1) 400ms, transform 0.65s cubic-bezier(0.23, 1, 0.32, 1) 400ms",
        }}>
          <PrimaryButton onClick={onCTA}>
            Get my assessment — $997
          </PrimaryButton>
          <OutlineButton onClick={() => document.getElementById("process")?.scrollIntoView({ behavior: "smooth" })}>
            See how it works
          </OutlineButton>
        </div>

        {/* Animated metrics row */}
        <div style={{
          marginTop: "60px",
          display: "flex", gap: "0", justifyContent: "center", flexWrap: "wrap",
          opacity: heroVisible ? 1 : 0,
          transition: "opacity 0.7s cubic-bezier(0.23, 1, 0.32, 1) 520ms",
        }}>
          {[
            { value: 214, prefix: "", suffix: "+", label: "Assessments completed", delay: 600 },
            { value: 10400, prefix: "$", suffix: "", label: "Average savings found", delay: 750 },
            { value: 5, prefix: "", suffix: " days", label: "Delivery guarantee", delay: 900 },
          ].map((m, i, arr) => (
            <div key={m.label} style={{
              textAlign: "center",
              padding: "0 32px",
              borderRight: i < arr.length - 1 ? `1px solid ${T.powder}` : "none",
            }}>
              <div style={{
                fontSize: "38px", fontWeight: 300, color: T.violet,
                letterSpacing: "-0.04em", lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
                animation: heroVisible ? `counterPop 0.5s cubic-bezier(0.23, 1, 0.32, 1) ${m.delay}ms both` : "none",
              }}>
                <AnimatedCounter target={m.value} prefix={m.prefix} suffix={m.suffix} duration={1200} />
              </div>
              <div style={{ fontSize: "13px", color: T.ghost, marginTop: "6px", letterSpacing: "0.01em" }}>
                {m.label}
              </div>
            </div>
          ))}
        </div>

        {/* Trust line */}
        <div style={{
          marginTop: "36px",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "18px",
          opacity: heroVisible ? 1 : 0,
          transition: "opacity 0.7s cubic-bezier(0.23, 1, 0.32, 1) 680ms",
          flexWrap: "wrap",
        }}>
          {["30-day guarantee", "No long-term contracts", "Secured by Stripe"].map((t, i) => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6.5L4.5 9L10 3.5" stroke={T.green} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ fontSize: "12px", color: T.ghost }}>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)",
        opacity: heroVisible ? 0.5 : 0,
        transition: "opacity 0.7s cubic-bezier(0.23, 1, 0.32, 1) 800ms",
        animation: heroVisible ? "floatGlow 2.5s ease-in-out infinite" : "none",
        zIndex: 1,
      }}>
        <svg width="20" height="30" viewBox="0 0 20 30" fill="none">
          <rect x="1" y="1" width="18" height="28" rx="9" stroke={T.stone} strokeWidth="1.5" />
          <rect x="8.5" y="6" width="3" height="6" rx="1.5" fill={T.stone} />
        </svg>
      </div>
    </section>
  );
}

/* ── Logo ticker ── */
const TICKER_ITEMS = [
  { name: "Acme Inc",         saving: "$14,200" },
  { name: "Tech Startup Co",  saving: "$9,800" },
  { name: "FinTech Labs",      saving: "$22,100" },
  { name: "GrowthHQ",          saving: "$7,650" },
  { name: "Design Studios",   saving: "$11,400" },
  { name: "Marketing Agency", saving: "$8,900" },
  { name: "Consulting Group", saving: "$13,300" },
  { name: "Scale Commerce",   saving: "$18,700" },
];

function LogoTicker() {
  // Duplicate for seamless loop
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <section style={{ background: T.porcelain, borderTop: `1px solid ${T.powder}`, borderBottom: `1px solid ${T.powder}`, padding: "20px 0", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
        <div style={{
          display: "flex", gap: "0",
          animation: "marquee 28s linear infinite",
          willChange: "transform",
          flexShrink: 0,
        }}>
          {items.map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "0 40px",
              borderRight: `1px solid ${T.powder}`,
              flexShrink: 0,
            }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: T.green, flexShrink: 0 }} />
              <span style={{ fontSize: "13px", fontWeight: 500, color: T.slate, whiteSpace: "nowrap" }}>{item.name}</span>
              <span style={{
                fontSize: "12px", fontWeight: 600, color: T.violet,
                background: "rgba(83,58,253,0.07)", borderRadius: "4px", padding: "1px 7px",
                whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums",
              }}>{item.saving} found</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── ROI Calculator ── */
function ROICalculator({ onCTA }: { onCTA: () => void }) {
  const [spend, setSpend] = useState(8000);
  const [headcount, setHeadcount] = useState(12);
  const [animating, setAnimating] = useState(false);
  const prevResult = useRef(0);

  const toolWaste    = Math.round(spend * 0.22);
  const processWaste = Math.round(headcount * 180);
  const revenueLeaks = Math.round(spend * 0.08);
  const total        = toolWaste + processWaste + revenueLeaks;

  useEffect(() => {
    if (total !== prevResult.current) {
      setAnimating(true);
      const t = setTimeout(() => setAnimating(false), 300);
      prevResult.current = total;
      return () => clearTimeout(t);
    }
  }, [total]);

  const roi = ((total - 997) / 997 * 100).toFixed(0);

  return (
    <section style={{ background: T.ink, padding: "96px 40px", position: "relative", overflow: "hidden" }}>
      {/* Background glow */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "600px", height: "600px",
        background: "radial-gradient(circle, rgba(83,58,253,0.2) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p style={{ fontSize: "12px", fontWeight: 700, color: T.washed, letterSpacing: "0.8px", marginBottom: "12px" }}>
              ROI CALCULATOR
            </p>
            <h2 style={{ fontSize: "clamp(30px, 4vw, 44px)", fontWeight: 300, color: T.white, letterSpacing: "-0.025em", margin: "0 auto 16px" }}>
              See what you're leaving on the table
            </h2>
            <p style={{ fontSize: "16px", color: T.washed, lineHeight: 1.65, maxWidth: "440px", margin: "0 auto" }}>
              Adjust the sliders to your business. We'll show you what we typically find.
            </p>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", alignItems: "start" }}>
          {/* Sliders */}
          <Reveal delay={0}>
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              {/* Monthly software spend */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                  <label style={{ fontSize: "13px", color: T.washed, fontWeight: 500 }}>Monthly software spend</label>
                  <span style={{ fontSize: "16px", fontWeight: 300, color: T.white, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>
                    ${spend.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range" min={1000} max={50000} step={500}
                  value={spend} onChange={e => setSpend(Number(e.target.value))}
                  style={{ width: "100%", accentColor: T.violet, cursor: "pointer", height: "4px" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
                  <span style={{ fontSize: "11px", color: T.ghost }}>$1k</span>
                  <span style={{ fontSize: "11px", color: T.ghost }}>$50k</span>
                </div>
              </div>

              {/* Team size */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                  <label style={{ fontSize: "13px", color: T.washed, fontWeight: 500 }}>Team size</label>
                  <span style={{ fontSize: "16px", fontWeight: 300, color: T.white, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>
                    {headcount} people
                  </span>
                </div>
                <input
                  type="range" min={2} max={100} step={1}
                  value={headcount} onChange={e => setHeadcount(Number(e.target.value))}
                  style={{ width: "100%", accentColor: T.violet, cursor: "pointer", height: "4px" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
                  <span style={{ fontSize: "11px", color: T.ghost }}>2</span>
                  <span style={{ fontSize: "11px", color: T.ghost }}>100</span>
                </div>
              </div>

              {/* Breakdown */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { label: "Tool redundancy (est. 22%)", value: toolWaste, color: T.washed },
                  { label: "Process inefficiency savings", value: processWaste, color: T.washed },
                  { label: "Revenue leak recovery (est. 8%)", value: revenueLeaks, color: T.washed },
                ].map(row => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "10px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <span style={{ fontSize: "13px", color: T.ghost }}>{row.label}</span>
                    <span style={{ fontSize: "14px", fontWeight: 500, color: row.color, fontVariantNumeric: "tabular-nums" }}>
                      ${row.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Result card */}
          <Reveal delay={80}>
            <div style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: "12px", padding: "36px",
              textAlign: "center",
              backdropFilter: "blur(8px)",
              position: "sticky", top: "80px",
            }}>
              <p style={{ fontSize: "12px", fontWeight: 600, color: T.washed, letterSpacing: "0.6px", marginBottom: "12px" }}>
                ESTIMATED ANNUAL SAVINGS
              </p>
              <div style={{
                fontSize: "clamp(48px, 6vw, 72px)", fontWeight: 300,
                color: T.white, letterSpacing: "-0.04em", lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
                opacity: animating ? 0.5 : 1,
                transform: animating ? "scale(0.96)" : "scale(1)",
                transition: "opacity 200ms ease, transform 200ms cubic-bezier(0.23,1,0.32,1)",
                marginBottom: "8px",
              }}>
                ${total.toLocaleString()}
              </div>
              <p style={{ fontSize: "14px", color: T.ghost, marginBottom: "28px" }}>
                per year, on average
              </p>

              <div style={{
                display: "flex", justifyContent: "center", gap: "24px",
                marginBottom: "28px", paddingBottom: "24px",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
              }}>
                <div>
                  <div style={{ fontSize: "22px", fontWeight: 300, color: T.soft, letterSpacing: "-0.02em" }}>{roi}×</div>
                  <div style={{ fontSize: "11px", color: T.ghost, marginTop: "3px" }}>ROI on $997</div>
                </div>
                <div>
                  <div style={{ fontSize: "22px", fontWeight: 300, color: T.soft, letterSpacing: "-0.02em" }}>5 days</div>
                  <div style={{ fontSize: "11px", color: T.ghost, marginTop: "3px" }}>to delivery</div>
                </div>
              </div>

              <PrimaryButton onClick={onCTA} style={{ width: "100%", textAlign: "center" as const }}>
                Claim my assessment — $997
              </PrimaryButton>
              <p style={{ fontSize: "12px", color: T.ghost, marginTop: "12px" }}>
                30-day money-back guarantee
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── Sample Report Preview ── */
const REPORT_ITEMS = [
  { severity: "critical", category: "Software audit", title: "Redundant project management tools", saving: "$4,800/yr", revealed: true },
  { severity: "critical", category: "Revenue",        title: "Pricing gap vs. market benchmark",   saving: "$6,200/yr", revealed: true },
  { severity: "warning",  category: "Process",        title: "Manual invoice reconciliation",       saving: "$3,100/yr", revealed: false },
  { severity: "warning",  category: "AI readiness",   title: "Customer support automation gap",     saving: "$2,400/yr", revealed: false },
  { severity: "info",     category: "Team",           title: "Role duplication in operations",      saving: "$1,700/yr", revealed: false },
];

const SEV_STYLE: Record<string, { bg: string; color: string; dot: string }> = {
  critical: { bg: "#ffd7f0", color: "#111", dot: "#e16540" },
  warning:  { bg: "#fef3c7", color: "#111", dot: "#d97706" },
  info:     { bg: "#e5edf5", color: "#111", dot: "#50617a" },
};

function SampleReport({ onCTA }: { onCTA: () => void }) {
  const [unlocked, setUnlocked] = useState(false);
  const { ref, visible } = useReveal(0.1);

  return (
    <section style={{ background: T.porcelain, padding: "96px 40px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p style={{ fontSize: "12px", fontWeight: 700, color: T.violet, letterSpacing: "0.8px", marginBottom: "12px" }}>
              SAMPLE DELIVERABLE
            </p>
            <h2 style={{ fontSize: "clamp(30px, 4vw, 44px)", fontWeight: 300, color: T.ink, letterSpacing: "-0.025em", margin: "0 auto 16px" }}>
              This is what you receive
            </h2>
            <p style={{ fontSize: "16px", color: T.slate, lineHeight: 1.65, maxWidth: "440px", margin: "0 auto" }}>
              Every finding is ranked by dollar impact, with before/after code or process examples.
            </p>
          </div>
        </Reveal>

        <div
          ref={ref}
          style={{
            background: T.white, borderRadius: "12px",
            border: `1px solid ${T.powder}`,
            boxShadow: "rgba(0,0,0,0.1) 0px 20px 60px -12px",
            overflow: "hidden",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.98)",
            transition: "opacity 0.6s cubic-bezier(0.23,1,0.32,1), transform 0.6s cubic-bezier(0.23,1,0.32,1)",
          }}
        >
          {/* Report header */}
          <div style={{ background: T.ink, padding: "20px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "7px", background: T.violet, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2L12 11H2L7 2Z" fill="white" fillOpacity="0.9" /></svg>
              </div>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: T.white }}>AI Business Assessment Report</div>
                <div style={{ fontSize: "11px", color: T.ghost }}>Acme Inc · April 15, 2024 · Confidential</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "16px" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "18px", fontWeight: 300, color: T.white, fontVariantNumeric: "tabular-nums" }}>$14,200</div>
                <div style={{ fontSize: "10px", color: T.ghost }}>Total savings</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "18px", fontWeight: 300, color: T.white }}>6</div>
                <div style={{ fontSize: "10px", color: T.ghost }}>Findings</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "18px", fontWeight: 300, color: T.white }}>90</div>
                <div style={{ fontSize: "10px", color: T.ghost }}>Day roadmap</div>
              </div>
            </div>
          </div>

          {/* Findings list */}
          <div style={{ padding: "8px 0" }}>
            {REPORT_ITEMS.map((item, i) => {
              const sev = SEV_STYLE[item.severity];
              const blur = !item.revealed && !unlocked;
              return (
                <div key={i} style={{
                  padding: "16px 28px",
                  borderBottom: i < REPORT_ITEMS.length - 1 ? `1px solid ${T.powder}` : "none",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  gap: "16px", flexWrap: "wrap",
                  filter: blur ? "blur(5px)" : "none",
                  userSelect: blur ? "none" : "auto",
                  transition: "filter 400ms ease",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                    <span style={{
                      padding: "3px 10px", borderRadius: "100px",
                      background: sev.bg, color: sev.color,
                      fontSize: "11px", fontWeight: 600, letterSpacing: "0.2px",
                      display: "flex", alignItems: "center", gap: "5px",
                      whiteSpace: "nowrap", flexShrink: 0,
                    }}>
                      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: sev.dot }} />
                      {item.severity.toUpperCase()}
                    </span>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 500, color: T.ink }}>{item.title}</div>
                      <div style={{ fontSize: "12px", color: T.ghost, marginTop: "2px" }}>{item.category}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: "16px", fontWeight: 500, color: "#3a6b05", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                    {item.saving}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Unlock overlay */}
          {!unlocked && (
            <div style={{
              padding: "28px", textAlign: "center",
              background: "linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.96) 60%, rgba(255,255,255,0) 100%)",
              marginTop: "-60px", position: "relative",
            }}>
              <p style={{ fontSize: "14px", color: T.slate, marginBottom: "14px" }}>
                3 findings blurred — get your own report to see every detail
              </p>
              <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
                <PrimaryButton onClick={onCTA}>Get my assessment — $997</PrimaryButton>
                <OutlineButton onClick={() => setUnlocked(true)}>Preview full sample</OutlineButton>
              </div>
            </div>
          )}

          {unlocked && (
            <div style={{ padding: "20px 28px", borderTop: `1px solid ${T.powder}`, display: "flex", justifyContent: "center" }}>
              <p style={{ fontSize: "13px", color: T.ghost, margin: 0 }}>
                This is a sample — your actual report will reflect your specific business.{" "}
                <button onClick={onCTA} style={{ background: "none", border: "none", cursor: "pointer", color: T.violet, fontSize: "13px", fontWeight: 500, padding: 0 }}>
                  Get started →
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════ */
export default function LandingPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 80);
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modalOpen]);

  return (
    <>
      <StyleTag />

      {/* ── Nav ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        padding: "0 40px",
        height: "60px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(255,255,255,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? `1px solid ${T.powder}` : "1px solid transparent",
        transition: "background 280ms ease, border-color 280ms ease, backdrop-filter 280ms ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: "28px", height: "28px", borderRadius: "6px",
            background: T.violet,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2L12 11H2L7 2Z" fill="white" fillOpacity="0.9" />
            </svg>
          </div>
          <span style={{ fontSize: "15px", fontWeight: 600, color: T.ink, letterSpacing: "-0.01em" }}>
            AuditAI
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <OutlineButton onClick={() => setModalOpen(true)}>
            Get started
          </OutlineButton>
        </div>
      </nav>

      {/* ── Hero ── */}
      <HeroSection heroVisible={heroVisible} onCTA={() => setModalOpen(true)} />

      {/* ── Logo ticker ── */}
      <LogoTicker />

      {/* ── Value ── */}
      <section style={{ background: T.white, padding: "96px 40px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "64px" }}>
              <p style={{ fontSize: "12px", fontWeight: 700, color: T.violet, letterSpacing: "0.8px", marginBottom: "12px" }}>
                WHAT YOU GET
              </p>
              <h2 style={{ fontSize: "clamp(30px, 4vw, 44px)", fontWeight: 300, color: T.ink, letterSpacing: "-0.025em", margin: "0 auto 16px", maxWidth: "560px" }}>
                Every corner of your business, examined
              </h2>
              <p style={{ fontSize: "16px", color: T.slate, lineHeight: 1.65, maxWidth: "480px", margin: "0 auto" }}>
                We go beyond surface-level advice — you get a forensic review with ranked, actionable steps.
              </p>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            {[
              { icon: "⚙️", title: "Software & tool audit", body: "We map every SaaS subscription and identify $3,000–$15,000 in annual tool redundancy most companies don't even know they have.", delay: 0 },
              { icon: "📊", title: "Revenue leak detection", body: "Pricing gaps, churn patterns, and missed upsells — quantified with dollar amounts, not vague suggestions.", delay: 60 },
              { icon: "🔄", title: "Process efficiency review", body: "Manual workflows that take hours get flagged with automation ROI estimates. You'll see exactly what to fix first.", delay: 120 },
              { icon: "👥", title: "Team & hiring analysis", body: "Whether you're understaffed, overstaffed, or misaligned — we show you the org chart changes that unlock growth.", delay: 180 },
              { icon: "🤖", title: "AI readiness score", body: "A scored assessment of where AI can realistically save you 10–20 hours per week across your current stack.", delay: 240 },
              { icon: "🗺️", title: "90-day action roadmap", body: "Every finding becomes a prioritized task with owner, effort estimate, and expected ROI. Plug it straight into your PM tool.", delay: 300 },
            ].map(c => (
              <ValueCard key={c.title} {...c} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Sample Report ── */}
      <SampleReport onCTA={() => setModalOpen(true)} />

      {/* ── Process ── */}
      <section id="process" style={{ background: T.porcelain, padding: "96px 40px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "64px" }}>
              <p style={{ fontSize: "12px", fontWeight: 700, color: T.violet, letterSpacing: "0.8px", marginBottom: "12px" }}>
                THE PROCESS
              </p>
              <h2 style={{ fontSize: "clamp(30px, 4vw, 44px)", fontWeight: 300, color: T.ink, letterSpacing: "-0.025em", margin: "0 auto 16px" }}>
                Five days to total clarity
              </h2>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
            {[
              { num: "1", title: "Intake & onboarding", body: "You complete a 20-minute intake form and grant read-only access to your key tools. No calls required.", delay: 0 },
              { num: "2", title: "Deep-dive analysis", body: "A senior consultant spends 8–10 hours inside your business data, not templates.", delay: 80 },
              { num: "3", title: "Findings session", body: "60-minute live walkthrough of everything we found, with open Q&A.", delay: 160 },
              { num: "4", title: "Report delivery", body: "Full written report with prioritized recommendations, ROI estimates, and supporting data.", delay: 240 },
            ].map(s => (
              <ProcessStep key={s.num} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* ── ROI Calculator ── */}
      <ROICalculator onCTA={() => setModalOpen(true)} />

      {/* ── Pricing ── */}
      <section style={{ background: T.white, padding: "96px 40px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "64px" }}>
              <p style={{ fontSize: "12px", fontWeight: 700, color: T.violet, letterSpacing: "0.8px", marginBottom: "12px" }}>
                PRICING
              </p>
              <h2 style={{ fontSize: "clamp(30px, 4vw, 44px)", fontWeight: 300, color: T.ink, letterSpacing: "-0.025em", margin: "0 auto" }}>
                One clear price. No surprises.
              </h2>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px", alignItems: "start" }}>
            {/* Main plan */}
            <Reveal delay={0}>
              <div style={{
                background: T.ink,
                borderRadius: "10px",
                padding: "36px",
                position: "relative",
                overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", top: 0, right: 0,
                  width: "200px", height: "200px",
                  background: "radial-gradient(circle, rgba(83,58,253,0.35) 0%, transparent 70%)",
                  borderRadius: "50%",
                  transform: "translate(30%, -30%)",
                  pointerEvents: "none",
                }} />
                <div style={{ position: "relative" }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: T.washed, letterSpacing: "0.5px", marginBottom: "20px" }}>
                    AI BUSINESS ASSESSMENT
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "8px" }}>
                    <span style={{ fontSize: "52px", fontWeight: 300, color: T.white, letterSpacing: "-0.04em", lineHeight: 1 }}>$997</span>
                    <span style={{ fontSize: "14px", color: T.washed }}>one time</span>
                  </div>
                  <p style={{ fontSize: "14px", color: T.washed, lineHeight: 1.65, marginBottom: "28px" }}>
                    Delivered in 5 business days. 30-day money-back guarantee if you don't find actionable savings.
                  </p>
                  <PrimaryButton onClick={() => setModalOpen(true)} style={{ width: "100%", textAlign: "center" as const }}>
                    Get started now
                  </PrimaryButton>
                  <div style={{ marginTop: "28px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    {[
                      "Full business audit report",
                      "60-min findings call",
                      "90-day prioritized roadmap",
                      "AI readiness score",
                      "30-day money-back guarantee",
                    ].map(f => (
                      <div key={f} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M2.5 7L5.5 10L11.5 4" stroke={T.soft} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span style={{ fontSize: "13px", color: T.washed }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* What's included */}
            <Reveal delay={80}>
              <div style={{ padding: "36px 0" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 500, color: T.ink, marginBottom: "8px", letterSpacing: "-0.015em" }}>
                  Built for businesses doing $500k–$10M
                </h3>
                <p style={{ fontSize: "14px", color: T.slate, lineHeight: 1.65, marginBottom: "28px" }}>
                  You've grown past the early hustle but things feel fragmented. We help you find what's bleeding profit before your next hire or investment.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {[
                    { label: "Average ROI", value: "10×" },
                    { label: "Savings identified on average", value: "$10,400" },
                    { label: "Businesses assessed", value: "214+" },
                    { label: "Satisfaction rate", value: "97%" },
                  ].map(s => (
                    <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "14px", borderBottom: `1px solid ${T.powder}` }}>
                      <span style={{ fontSize: "14px", color: T.slate }}>{s.label}</span>
                      <span style={{ fontSize: "16px", fontWeight: 600, color: T.ink, letterSpacing: "-0.015em", fontVariantNumeric: "tabular-nums" }}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ background: T.porcelain, padding: "96px 40px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <p style={{ fontSize: "12px", fontWeight: 700, color: T.violet, letterSpacing: "0.8px", marginBottom: "12px" }}>
                CLIENT RESULTS
              </p>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 300, color: T.ink, letterSpacing: "-0.025em" }}>
                What founders are saying
              </h2>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            {[
              {
                quote: "Found $14,200/year in software we forgot we were paying for. Paid for itself 14× in the first month.",
                name: "Sarah K.",
                role: "CEO, e-commerce brand",
                delay: 0,
              },
              {
                quote: "The 90-day roadmap alone was worth it. We executed the top 3 items and cut our support workload by 40%.",
                name: "Marcus D.",
                role: "Founder, B2B SaaS",
                delay: 80,
              },
              {
                quote: "I was skeptical but the findings call changed how I think about the whole business. Incredibly thorough.",
                name: "Priya M.",
                role: "COO, professional services",
                delay: 160,
              },
            ].map(t => (
              <Reveal key={t.name} delay={t.delay}>
                <div style={{
                  background: T.white,
                  borderRadius: "8px",
                  padding: "28px",
                  border: `1px solid ${T.powder}`,
                  height: "100%",
                  boxSizing: "border-box",
                }}>
                  <svg width="24" height="18" viewBox="0 0 24 18" fill="none" style={{ marginBottom: "16px", opacity: 0.3 }}>
                    <path d="M0 18V10.5C0 7.5 1.5 4.5 4.5 1.5L6 3C4.5 4.5 3.75 6 3.75 7.5H7.5V18H0ZM13.5 18V10.5C13.5 7.5 15 4.5 18 1.5L19.5 3C18 4.5 17.25 6 17.25 7.5H21V18H13.5Z" fill={T.violet} />
                  </svg>
                  <p style={{ fontSize: "15px", color: T.ink, lineHeight: 1.7, marginBottom: "20px", fontStyle: "italic" }}>
                    "{t.quote}"
                  </p>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: T.ink }}>{t.name}</div>
                    <div style={{ fontSize: "12px", color: T.ghost, marginTop: "2px" }}>{t.role}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ background: T.white, padding: "96px 40px" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <p style={{ fontSize: "12px", fontWeight: 700, color: T.violet, letterSpacing: "0.8px", marginBottom: "12px" }}>FAQ</p>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 300, color: T.ink, letterSpacing: "-0.025em" }}>
                Common questions
              </h2>
            </div>
          </Reveal>

          {[
            { q: "How long does the assessment take?", a: "We deliver your full report within 5 business days of receiving your intake form and tool access. The process requires about 30 minutes of your time upfront and one 60-minute call.", delay: 0 },
            { q: "What if I don't find $10,000 in savings?", a: "We offer a full refund if you don't identify at least $997 in actionable savings within 30 days of delivery. This has happened fewer than 3% of the time.", delay: 40 },
            { q: "What access do you need?", a: "Read-only access to your accounting software, project management tool, and a list of active SaaS subscriptions. We never need write access or passwords.", delay: 80 },
            { q: "Do I need to prepare anything?", a: "Just complete the intake form (20 minutes) and have a list of your current tools and monthly costs ready. We handle everything else.", delay: 120 },
            { q: "Is this right for my company size?", a: "We work best with businesses doing $500k–$10M in annual revenue with 5–50 employees. Below that threshold, the ROI is lower. Above it, we offer a custom enterprise package.", delay: 160 },
            { q: "Who actually does the assessment?", a: "A senior consultant with 8+ years of operational experience, not a junior analyst or AI alone. AI tools assist with data processing; a human makes every recommendation.", delay: 200 },
          ].map(f => (
            <FAQItem key={f.q} {...f} />
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{ padding: "80px 40px", background: T.porcelain }}>
        <Reveal>
          <div style={{
            maxWidth: "760px", margin: "0 auto",
            background: T.ink,
            borderRadius: "12px",
            padding: "56px 48px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(circle at 30% 50%, rgba(83,58,253,0.28) 0%, transparent 60%)",
              pointerEvents: "none",
            }} />
            <div style={{ position: "relative" }}>
              <h2 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 300, color: T.white, letterSpacing: "-0.025em", margin: "0 0 16px" }}>
                Ready to stop leaving money on the table?
              </h2>
              <p style={{ fontSize: "16px", color: T.washed, lineHeight: 1.65, marginBottom: "32px", maxWidth: "480px", margin: "0 auto 32px" }}>
                Join 214+ founders who found an average of $10,400 in savings. Delivered in 5 days.
              </p>
              <PrimaryButton onClick={() => setModalOpen(true)}>
                Get my assessment — $997
              </PrimaryButton>
              <p style={{ fontSize: "13px", color: T.ghost, marginTop: "14px" }}>
                30-day money-back guarantee · Delivered in 5 business days
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        background: T.white,
        padding: "32px 40px",
        borderTop: `1px solid ${T.powder}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: "16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "22px", height: "22px", borderRadius: "5px", background: T.violet, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
              <path d="M7 2L12 11H2L7 2Z" fill="white" fillOpacity="0.9" />
            </svg>
          </div>
          <span style={{ fontSize: "13px", fontWeight: 600, color: T.ink }}>AuditAI</span>
        </div>
        <div style={{ display: "flex", gap: "24px" }}>
          {["Privacy", "Terms", "Contact"].map(l => (
            <a key={l} href="#" style={{ fontSize: "13px", color: T.ghost, textDecoration: "none", transition: "color 160ms ease" }}
              onMouseEnter={e => (e.currentTarget.style.color = T.ink)}
              onMouseLeave={e => (e.currentTarget.style.color = T.ghost)}
            >
              {l}
            </a>
          ))}
        </div>
        <p style={{ fontSize: "12px", color: T.ghost, margin: 0 }}>
          © 2025 AuditAI. All rights reserved.
        </p>
      </footer>

      {/* ── Payment Modal ── */}
      {modalOpen && <PaymentModal onClose={() => setModalOpen(false)} />}
    </>
  );
}
