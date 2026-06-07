import React, { useState } from "react";
import { Sparkles, Play, ChevronRight, X, Smartphone, MessageCircle, Bot, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HeroProps {
  onGetStartedClick: () => void;
}

export default function Hero({ onGetStartedClick }: HeroProps) {
  const [showVideoModal, setShowVideoModal] = useState(false);

  return (
    <section id="hero" className="relative pt-[160px] pb-20 md:pb-28 px-4 sm:px-6 md:px-8 overflow-hidden">
      {/* Absolute Ambient Background Lights */}
      <div className="absolute top-[10%] left-[-10%] w-[400px] h-[400px] bg-white/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-white/3 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto text-center space-y-8 relative z-10">
        {/* Badge Indicator */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-white/5 border border-white/15 rounded-full px-4 py-1.5 backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span className="font-mono text-xs text-white/90 tracking-widest uppercase">
            Education Focused v2.1
          </span>
        </motion.div>

        {/* Master Heading */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl max-w-5xl mx-auto leading-[1.1] text-[#E5E5E5] font-light tracking-tight"
        >
          Transform Student Inquiries into <span className="italic font-normal font-serif text-white">Enrollments</span> with <span className="gradient-text font-medium italic">EduAgent AI</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-sans text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed"
        >
          The AI-powered WhatsApp automation platform for coaching institutes. Capture, qualify, and convert leads 24/7 with the intelligence of Llama 3.1.
        </motion.p>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <button 
            onClick={onGetStartedClick}
            className="w-full sm:w-auto px-8 py-4 bg-white text-black font-heading font-bold text-base rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.25)] hover:scale-103 active:scale-97 hover:bg-neutral-100 transition-all cursor-pointer"
          >
            Get Started Free
          </button>
          
          <button 
            onClick={() => setShowVideoModal(true)}
            className="w-full sm:w-auto px-8 py-4 glass-premium rounded-2xl font-heading font-semibold text-base text-white hover:bg-white/10 flex items-center justify-center gap-2 active:scale-97 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white text-white" />
            Watch Showcase
          </button>
        </motion.div>

        {/* Dashboard Image Display Frame */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-16 sm:mt-24 relative mx-auto max-w-5xl px-4"
        >
          {/* Back glows behind the card */}
          <div className="absolute -top-10 left-12 w-72 h-72 bg-white/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-10 right-12 w-80 h-80 bg-white/5 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="glass-premium p-1 sm:p-2 rounded-[2rem] sm:rounded-[2.5rem] border-white/15 shadow-[0_0_80px_rgba(255,255,255,0.08)] relative z-10 overflow-hidden">
            <img 
              alt="EduAgent AI Lead Flow Dashboard" 
              className="w-full h-auto rounded-[1.8rem] sm:rounded-[2.2rem] grayscale contrast-125 hover:grayscale-0 transition-all duration-700 pointer-events-none" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBW6ujycSxj4C_0nDfwf9xjj8HPlTNxYq6PlGqquU1pOvtgByMpu-J_UYTaiLeG1DxRHDv2UQEmnb2Uk_0dyMW-BM9SuPx1cu9b5uq6_0Y0bxERKX5X1T_qZln9OkrnrzwrZfv_sTec18mKzEO5FsoF4a5VzHaHkfTTpJ_wHOyCRXgaBXkGlDeJU5ZPNrE1S23ZPF-L0DRangHDmyFuRvdyjdXzYiDuVEUHmR4OMyIFVxiQpowPAMpGGLmpYn1ZKqJ_wlS59Xb6fI" 
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>
      </div>

      {/* Interactive Showcase Walkthrough Modal */}
      <AnimatePresence>
        {showVideoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowVideoModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="w-full max-w-3xl glass-premium rounded-3xl border border-white/20 shadow-2xl relative z-10 overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-[#070708]">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-white" />
                  <span className="font-heading font-medium text-white text-base">EduAgent AI — Live Product Drive</span>
                </div>
                <button 
                  onClick={() => setShowVideoModal(false)}
                  className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* simulated walkthrough console */}
              <div className="p-6 bg-black text-white/95 space-y-6">
                <div className="space-y-2">
                  <h3 className="font-heading text-xl font-bold text-white">How EduAgent AI Secures Admissions</h3>
                  <p className="text-sm text-white/70">Observe the automated intelligence routing real-time inquiries, grading intent, and bridging handoffs seamlessly.</p>
                </div>

                {/* Animated Simulation Block */}
                <div className="border border-white/10 rounded-2xl bg-gradient-to-b from-neutral-900 to-neutral-950 p-5 space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono text-white/50 border-b border-white/10 pb-2">
                    <span>VIRTUAL SIMULATOR v2.1</span>
                    <span className="text-white flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      ACTIVE NODE
                    </span>
                  </div>

                  <div className="space-y-3 font-mono text-xs sm:text-sm">
                    <div className="flex gap-2">
                      <span className="text-white/40">[00:01]</span>
                      <span className="text-blue-400">Incoming Lead:</span>
                      <span className="text-white">Student triggers "Send Message" from Facebook Ad.</span>
                    </div>
                    <div className="flex gap-2 pl-4 border-l border-white/10">
                      <span className="text-white/40">[00:02]</span>
                      <span className="text-amber-400">Assessment:</span>
                      <span className="text-white">Llama 3.1 classifies inquiry: "JEE crash course fees & registration".</span>
                    </div>
                    <div className="flex gap-2 pl-4 border-l border-white/10">
                      <span className="text-white/40">[00:03]</span>
                      <span className="text-green-400">Action:</span>
                      <span className="text-white">Responds instantly with structured module fees (₹25,000) & schedules demo.</span>
                    </div>
                    <div className="flex gap-2 pl-4 border-l border-white/10">
                      <span className="text-white/40">[00:04]</span>
                      <span className="text-purple-400">CRM Webhook:</span>
                      <span className="text-white">Dispatches student details to CRM. Tags lead as <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded text-[11px] font-bold">HOT lead</span>.</span>
                    </div>
                    <div className="flex gap-2 pl-4 border-l border-white/10">
                      <span className="text-white/40">[00:05]</span>
                      <span className="text-red-400">Counselor Alert:</span>
                      <span className="text-white">Sends SMS/WhatsApp alert to supervisor for instant voice callback.</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-xs text-white/45 font-mono">Platform speed: sub-100ms Groq Inference API</span>
                  <button 
                    onClick={() => {
                      setShowVideoModal(false);
                      onGetStartedClick();
                    }}
                    className="w-full sm:w-auto px-6 py-2.5 bg-white text-black font-semibold rounded-xl text-sm hover:bg-zinc-200 transition-all"
                  >
                    Experience It Firsthand
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
