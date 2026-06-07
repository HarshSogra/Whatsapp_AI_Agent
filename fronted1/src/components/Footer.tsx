import React from "react";
import { Sparkles, MessageSquare, Terminal, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <footer className="bg-[#080808] border-t border-white/5 py-16 px-4 sm:px-6 md:px-8 relative overflow-hidden">
      {/* Soft Bottom Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-white/3 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 text-center md:text-left relative z-10 pb-8 border-b border-white/5">
        
        {/* Brand logo (4 cols) */}
        <div className="md:col-span-4 space-y-4">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading text-lg font-bold tracking-tight text-white">
              EduAgent <span className="gradient-text font-black">AI</span>
            </span>
          </div>
          <p className="font-sans text-xs sm:text-sm text-white/50 max-w-sm mx-auto md:mx-0 leading-relaxed">
            Leading artificial intelligence automation for coaching institutes, tuition brands, and test prep providers globally.
          </p>
        </div>

        {/* Categories (4 cols) */}
        <div className="md:col-span-4 space-y-4">
          <h5 className="font-heading text-xs font-bold uppercase tracking-wider text-white">
            Admissions Solutions
          </h5>
          <ul className="space-y-2 text-xs sm:text-sm">
            <li>
              <button onClick={() => scrollToSection("features")} className="text-white/45 hover:text-white transition-colors cursor-pointer">
                Dual-Layer Qualification
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection("niches")} className="text-white/45 hover:text-white transition-colors cursor-pointer">
                Competitive Exam Funnels
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection("niches")} className="text-white/45 hover:text-white transition-colors cursor-pointer">
                Language Batch Allocations
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection("calculator")} className="text-white/45 hover:text-white transition-colors cursor-pointer">
                Admissions Yield Calculator
              </button>
            </li>
          </ul>
        </div>

        {/* Support & Contact (4 cols) */}
        <div className="md:col-span-4 space-y-4">
          <h5 className="font-heading text-xs font-bold uppercase tracking-wider text-white">
            Core Network
          </h5>
          <ul className="space-y-2.5 text-xs sm:text-sm">
            <li className="text-white/45 font-mono">
              Support: <span className="text-white/80">team@eduagent.ai</span>
            </li>
            <li className="text-white/45 font-mono">
              Corporate API: <span className="text-white/80">v2.1-stable</span>
            </li>
            <li className="text-white/45 font-mono flex items-center gap-1.5 justify-center md:justify-start">
              <span>Status:</span>
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-400">All Systems Nominal</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Copy footer */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/35 relative z-10 text-center sm:text-left">
        <div>
          &copy; {currentYear} EduAgent AI Inc. All rights reserved. Built strictly in compliance with Meta Cloud Terms.
        </div>
        <div className="flex items-center gap-1.5">
          <span>Engineered with precision for growth</span>
          <Heart className="w-3.5 h-3.5 text-red-500/80" />
        </div>
      </div>

    </footer>
  );
}
