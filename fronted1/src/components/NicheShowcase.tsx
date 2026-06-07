import React, { useState } from "react";
import * as Icons from "lucide-react";
import { businessNiches } from "../data";
import { BusinessNiche } from "../types";
import { motion } from "motion/react";

const IconRenderer = ({ name, className }: { name: string; className: string }) => {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) return <Icons.BookOpen className={className} />;
  return <IconComponent className={className} />;
};

interface NicheShowcaseProps {
  onNicheSelect: (nicheConfig: { inquiry: string; response: string }) => void;
}

export default function NicheShowcase({ onNicheSelect }: NicheShowcaseProps) {
  const [selectedId, setSelectedId] = useState<string>("competitive-exams");

  const handleCardClick = (niche: BusinessNiche) => {
    setSelectedId(niche.id);
    onNicheSelect({
      inquiry: niche.exampleInquiry,
      response: niche.aiResponse,
    });

    // Automatically scroll down slightly to focus on Chat Demo if mobile
    const chatDemo = document.getElementById("demo");
    if (chatDemo && window.innerWidth < 1024) {
      chatDemo.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="niches" className="py-24 px-4 sm:px-6 md:px-8 relative bg-[#080808]">
      {/* Background Soft Gradients */}
      <div className="absolute top-[10%] left-[20%] w-[450px] h-[450px] bg-white/3 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-white/2 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* Title block */}
        <div className="text-center space-y-4 max-w-3xl mx-auto animate-fade-in">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#E5E5E5] leading-tight">
            Tailored for <span className="italic font-normal font-serif text-white">Edu-Business</span>
          </h2>
          <p className="text-white/60 font-sans text-base sm:text-lg">
            Scalable solutions for every educational niche. Click any vertical below to preview its specific conversation flow.
          </p>
        </div>

        {/* 6-grid Card display */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {businessNiches.map((niche) => {
            const isSelected = selectedId === niche.id;
            return (
              <motion.div
                key={niche.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                onClick={() => handleCardClick(niche)}
                className={`p-8 rounded-3xl glass-premium cursor-pointer border select-none transition-all duration-300 relative ${
                  isSelected
                    ? "border-white/30 bg-white/[0.05] shadow-[0_0_35px_rgba(255,255,255,0.05)]"
                    : "border-white/10"
                }`}
              >
                
                {/* Active indicators */}
                {isSelected && (
                  <span className="absolute top-4 right-4 bg-white text-black font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full font-bold">
                    Active Demo
                  </span>
                )}

                {/* Card Icon */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-300 mb-6 ${
                  isSelected
                    ? "bg-white text-black border-transparent"
                    : "bg-white/5 text-white border-white/10"
                }`}>
                  <IconRenderer name={niche.icon} className="w-6 h-6" />
                </div>

                {/* Info Text */}
                <div className="space-y-3">
                  <h4 className="font-heading text-xl font-bold text-white transition-colors">
                    {niche.title}
                  </h4>
                  <p className="font-sans text-sm text-white/60 leading-relaxed">
                    {niche.description}
                  </p>
                </div>

                {/* Action CTA link */}
                <div className={`mt-8 pt-4 border-t border-white/5 flex items-center gap-2 text-xs transition-colors font-mono uppercase tracking-wider ${
                  isSelected ? "text-white" : "text-white/40"
                }`}>
                  <span>Preview Conversation</span>
                  <Icons.ArrowRight className={`w-4 h-4 transition-transform duration-300 ${isSelected ? "translate-x-1" : ""}`} />
                </div>

              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
