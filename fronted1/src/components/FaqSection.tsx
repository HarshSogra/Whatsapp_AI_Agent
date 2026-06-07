import React, { useState } from "react";
import { ChevronDown, ChevronUp, MessageSquare, ShieldAlert } from "lucide-react";
import { faqItems } from "../data";
import { motion, AnimatePresence } from "motion/react";

export default function FaqSection() {
  const [openId, setOpenId] = useState<string | null>("whatsapp-ban");

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 px-4 sm:px-6 md:px-8 bg-[#080808] relative border-t border-white/5">
      {/* Background Soft Ambient Blur */}
      <div className="absolute top-[30%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-white/2 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-16 relative z-10">
        
        {/* Title block */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-[#E5E5E5] leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-[#E5E5E5]/60 font-sans text-sm sm:text-base">
            Everything you need to know about setting up WhatsApp bots matching strict Meta compliance.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqItems.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="rounded-2xl border border-white/10 overflow-hidden bg-white/[0.01]"
              >
                {/* Clicking Trigger trigger */}
                <button
                  onClick={() => toggleFaq(item.id)}
                  className="w-full text-left p-6 sm:p-8 flex justify-between items-center gap-4 hover:bg-white/[0.02] transition-colors focus:outline-none cursor-pointer"
                >
                  <span className="font-heading text-sm sm:text-base font-bold text-white selection:bg-transparent">
                    {item.question}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* Animated content expansion */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 sm:p-8 pt-0 border-t border-white/5 font-sans text-xs sm:text-sm text-white/60 leading-relaxed space-y-4">
                        <p>{item.answer}</p>
                        
                        {/* Custom sub notifications inside specific rows */}
                        {item.id === "whatsapp-ban" && (
                          <div className="p-3.5 bg-green-500/5 rounded-xl border border-green-500/10 flex items-center gap-2.5 text-xs text-green-400">
                            <MessageSquare className="w-4 h-4 text-green-400 shrink-0" />
                            <span>Meta-verified numbers enjoy 10x higher message dispatch limits.</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
