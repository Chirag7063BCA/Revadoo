import React from "react";
import { Link } from "react-router-dom";

const DashboardFooter = () => {
  const navLinks = [
    { label: "Privacy Policy", path: "/privacy" },
    { label: "Terms & Conditions", path: "/terms" },
    { label: "Cookies", path: "/cookies" },
    { label: "Support", path: "/contact" },
    { label: "FAQ", path: "/faq" },
  ];

  const socialIcons = [
    {
      label: "X / Twitter",
      path: "#",
      svg: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      label: "Instagram",
      path: "#",
      svg: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    {
      label: "YouTube",
      path: "#",
      svg: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="w-full flex-shrink-0 bg-[#0A0A0A] relative z-10 font-sans">

      {/* Top orange gradient line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-orange-500/60 to-transparent" />

      {/* ── Main body ── */}
      <div className="flex flex-wrap gap-8 justify-between items-start px-8 pt-8 pb-6">

        {/* Left — brand + tagline + socials */}
        <div className="flex flex-col gap-3 min-w-[170px]">

          {/* Logo */}
          <Link
            to="/dashboard"
            className="text-white no-underline leading-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.55rem", letterSpacing: "0.08em" }}
          >
            REVA<span className="text-orange-500">Doo</span>
          </Link>

          {/* Tagline */}
          <p className="text-xs text-white/25 leading-relaxed max-w-[200px] m-0">
            Earn rewards, play games, and redeem for real cash every day.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-2 mt-1">
            {socialIcons.map((s) => (
              <a
                key={s.label}
                href={s.path}
                aria-label={s.label}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10
                           text-white/35 no-underline
                           hover:bg-orange-500 hover:text-white hover:border-orange-500
                           hover:-translate-y-0.5 transition-all duration-200"
              >
                {s.svg}
              </a>
            ))}
          </div>
        </div>

        {/* Center — nav links */}
        <div className="flex flex-wrap gap-x-8 gap-y-3 items-start pt-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-sm text-white/35 no-underline tracking-wide
                         hover:text-orange-500 transition-colors duration-200
                         relative after:absolute after:bottom-[-2px] after:left-0
                         after:h-px after:w-0 after:bg-orange-500
                         hover:after:w-full after:transition-all after:duration-300"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right — status + contact */}
        <div className="flex flex-col gap-3 items-end pt-1">

          {/* Status badge */}
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_#4ade80] animate-pulse" />
            <span className="text-[0.68rem] font-semibold uppercase tracking-widest text-green-400/80">
              All systems operational
            </span>
          </div>

          {/* Support email */}
          <a
            href="mailto:support@revadoo.com"
            className="text-xs text-white/25 no-underline tracking-wide
                       hover:text-orange-500 transition-colors duration-200"
          >
            support@revadoo.com
          </a>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/5 px-8 py-3 flex flex-wrap items-center justify-between gap-2">
        <p className="m-0 text-xs text-white/20 tracking-wide">
          © 2026 <span className="text-orange-500 font-semibold">Revadoo</span>. All Rights Reserved.
        </p>
        <p className="m-0 text-[0.68rem] text-white/10 tracking-wide">
          Made with <span className="text-orange-500">♥</span> for earners worldwide
        </p>
      </div>

    </footer>
  );
};

export default DashboardFooter;