import React, { useState } from "react";
import * as Icons from "lucide-react";
import { bentoFeatures } from "../data";
import { FeatureItem } from "../types";
import { motion, AnimatePresence } from "motion/react";

// Dynamic Icon rendering helper based on name string from data
const IconRenderer = ({ name, className }: { name: string; className: string }) => {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) return <Icons.HelpCircle className={className} />;
  return <IconComponent className={className} />;
};

export default function BentoGrid() {
  const [selectedFeature, setSelectedFeature] = useState<FeatureItem | null>(null);

  return (
    <section id="features" className="py-24 px-4 sm:px-6 md:px-8 relative bg-[#080808]">
      {/* Background radial soft gradient ambient halos */}
      <div className="absolute top-[20%] right-[10%] w-[450px] h-[450px] bg-white/3 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[5%] w-[400px] h-[400px] bg-white/2 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* Title Block */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#E5E5E5]"
          >
            Purpose-Built for <span className="italic font-normal font-serif text-white">Growth</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#E5E5E5]/60 font-sans text-base sm:text-lg"
          >
            Engineered to solve the admission leakage problem in modern coaching centers.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {bentoFeatures.map((feature, idx) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              onClick={() => setSelectedFeature(feature)}
              className={`glass-premium p-8 rounded-3xl flex flex-col gap-6 cursor-pointer select-none group relative ${
                feature.highlighted 
                  ? "border-white/25 bg-white/[0.04] shadow-[0_0_30px_rgba(255,255,255,0.04)]" 
                  : "border-white/10"
              }`}
            >
              {/* Corner Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.01] to-white/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-black transition-all duration-300">
                <IconRenderer 
                  name={feature.icon} 
                  className="w-7 h-7 text-white/90 group-hover:text-black transition-colors" 
                />
              </div>

              {/* Text */}
              <div className="space-y-2 relative z-10">
                <h3 className="font-heading text-xl font-bold text-white group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-2">
                  {feature.title}
                  {feature.highlighted && (
                    <span className="text-[10px] uppercase tracking-widest px-1.5 py-0.5 bg-white/10 rounded font-semibold text-white/90">
                      Top Choice
                    </span>
                  )}
                </h3>
                <p className="font-sans text-sm text-white/60 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Bottom detail action tag */}
              <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/45 group-hover:text-white/80 transition-colors">
                <span>Simulator Sandbox</span>
                <Icons.ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Interactive Feature Deep Dive Sandbox Drawer */}
      <AnimatePresence>
        {selectedFeature && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFeature(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Content modal */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-lg glass-premium rounded-3xl border border-white/20 shadow-2xl relative z-10 p-6 sm:p-8 space-y-6"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/15">
                    <IconRenderer name={selectedFeature.icon} className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-white/50 uppercase">FEATURE INSIGHT</span>
                    <h3 className="font-heading text-xl font-bold text-white">{selectedFeature.title}</h3>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedFeature(null)}
                  className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all"
                >
                  <Icons.X className="w-4 h-4" />
                </button>
              </div>

              {/* Body explanation */}
              <div className="space-y-4">
                <p className="text-sm sm:text-base text-white/80 font-sans leading-relaxed">
                  {selectedFeature.description}
                </p>

                {/* Sub features specific list related to id */}
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3 font-sans text-xs sm:text-sm">
                  <h4 className="font-heading text-xs font-bold text-white/90 uppercase tracking-wider">How to verify this action:</h4>
                  <ul className="space-y-2 text-white/70">
                    <li className="flex items-start gap-2">
                      <Icons.Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                      <span>Instantly deployable on verified corporate Meta accounts.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icons.Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                      <span>Requires zero technical expertise or server set-up.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icons.Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                      <span>Automatic feedback logs routed safely in human counselor console.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-4 pt-2">
                <button 
                  onClick={() => setSelectedFeature(null)}
                  className="flex-1 py-3 bg-white text-black font-semibold rounded-xl text-sm hover:bg-neutral-100 transition-all cursor-pointer"
                >
                  Close Insight
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
