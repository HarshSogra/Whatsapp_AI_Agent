import React, { useState } from "react";
import * as Icons from "lucide-react";
import { funnelSteps } from "../data";
import { motion } from "motion/react";

const IconRenderer = ({ name, className }: { name: string; className: string }) => {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) return <Icons.ArrowRight className={className} />;
  return <IconComponent className={className} />;
};

export default function FunnelFlow() {
  const [activeStep, setActiveStep] = useState<string>("2");

  return (
    <section id="funnel" className="py-24 px-4 sm:px-6 md:px-8 overflow-hidden bg-[#080808] relative border-t border-white/5">
      {/* Background soft lighting */}
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-white/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto text-center space-y-16">
        {/* Title block */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#E5E5E5] animate-fade-in"
          >
            The Enrollment <span className="italic font-normal font-serif text-white">Funnel</span>
          </motion.h2>
          <p className="text-[#E5E5E5]/60 font-sans text-sm sm:text-base">
            Watch how a casual ad click materializes into a paid tuition fee seamlessly.
          </p>
        </div>

        {/* Funnel flex row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-8 relative py-8 max-w-5xl mx-auto">
          
          {funnelSteps.map((step, idx) => {
            const isSelected = activeStep === step.stepNumber;
            return (
              <React.Fragment key={step.stepNumber}>
                {/* Step Wrapper */}
                <motion.div 
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  onMouseEnter={() => setActiveStep(step.stepNumber)}
                  className="flex-1 flex flex-col items-center gap-6 relative z-10 cursor-pointer select-none group"
                >
                  {/* Outer circle layout */}
                  <div className={`relative transition-all duration-500 rounded-full flex items-center justify-center ${
                    isSelected
                      ? "w-28 h-28 sm:w-32 sm:h-32 bg-white/5 border border-white/40 shadow-[0_0_40px_rgba(255,255,255,0.12)]"
                      : "w-24 h-24 sm:w-24 sm:h-24 bg-white/[0.01] border border-white/10 group-hover:border-white/25"
                  }`}>
                    {/* Pulsing rotative dashed helper on selected step */}
                    {isSelected && (
                      <div className="absolute inset-0 rounded-full border border-white/20 border-dashed animate-spin" style={{ animationDuration: "12s" }} />
                    )}

                    {/* Glowing highlight indicator */}
                    <div className={`absolute inset-2 rounded-full blur bg-neutral-900 transition-opacity ${isSelected ? "opacity-30" : "opacity-0"}`} />

                    {/* Icon container */}
                    <div className="relative z-10">
                      <IconRenderer 
                        name={step.icon} 
                        className={`transition-all duration-300 ${
                          isSelected ? "w-10 h-10 sm:w-12 sm:h-12 text-white" : "w-8 h-8 text-white/50 group-hover:text-white/80"
                        }`} 
                      />
                    </div>
                  </div>

                  {/* Header/Text Info */}
                  <div className="text-center space-y-2 max-w-[240px]">
                    <h4 className={`font-heading text-lg sm:text-xl font-bold transition-colors ${
                      isSelected ? "text-white" : "text-white/60 group-hover:text-white"
                    }`}>
                      {step.title}
                    </h4>
                    <p className={`font-sans text-xs sm:text-sm leading-relaxed transition-colors duration-300 ${
                      isSelected ? "text-white/70" : "text-white/45"
                    }`}>
                      {step.description}
                    </p>
                  </div>
                </motion.div>

                {/* Connection divider vectors (desktop-only inline lines) */}
                {idx < funnelSteps.length - 1 && (
                  <div className="hidden md:block absolute top-[28%] w-[12%] h-[1px]" style={{ left: idx === 0 ? "28%" : "60%" }}>
                    <div className="w-full h-full bg-gradient-to-r from-white/30 via-white/10 to-transparent" />
                    <div className="absolute top-1/2 -translate-y-1/2 right-0 w-1.5 h-1.5 rounded-full bg-white/40" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}
