import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import BentoGrid from "./components/BentoGrid";
import FunnelFlow from "./components/FunnelFlow";
import InteractiveChatDemo from "./components/InteractiveChatDemo";
import NicheShowcase from "./components/NicheShowcase";
import ROICalculator from "./components/ROICalculator";
import ApiConsole from "./components/ApiConsole";
import FaqSection from "./components/FaqSection";
import Footer from "./components/Footer";
import { X, Sparkles, Bot, GraduationCap, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [nicheInquiry, setNicheInquiry] = useState<{ inquiry: string; response: string } | null>(null);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [signupForm, setSignupForm] = useState({ name: "", email: "", schoolName: "" });
  const [signupComplete, setSignupComplete] = useState(false);

  const handleNicheSelect = (config: { inquiry: string; response: string }) => {
    setNicheInquiry(config);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupComplete(true);
    setTimeout(() => {
      // Auto close and reset after 3 seconds
      setShowSignupModal(false);
      setSignupComplete(false);
      setSignupForm({ name: "", email: "", schoolName: "" });
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#E5E5E5] relative antialiased">
      <Navbar onGetStartedClick={() => setShowSignupModal(true)} />
      
      <main className="relative z-10">
        <Hero onGetStartedClick={() => setShowSignupModal(true)} />
        
        {/* Solutions section */}
        <NicheShowcase onNicheSelect={handleNicheSelect} />

        {/* Live chat demonstration section */}
        <InteractiveChatDemo nicheInquiry={nicheInquiry} />

        {/* Bento grid features section */}
        <BentoGrid />

        {/* Dynamic visual enrollment flow section */}
        <FunnelFlow />

        {/* ROI and statistic counters section */}
        <ROICalculator />

        {/* REST API & developer documentation repo explorer */}
        <ApiConsole />

        {/* Accordion list FAQ page */}
        <FaqSection />
      </main>

      {/* Footer layout */}
      <Footer />

      {/* Simulated Sign Up Form Modal */}
      <AnimatePresence>
        {showSignupModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSignupModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="w-full max-w-md glass-premium rounded-[2.5rem] border border-white/20 shadow-2xl relative z-10 p-8 sm:p-10 text-center"
            >
              <button 
                onClick={() => setShowSignupModal(false)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {!signupComplete ? (
                /* Main Form View */
                <form onSubmit={handleSignupSubmit} className="space-y-6">
                  {/* Icon header */}
                  <div className="mx-auto w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/15">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-white leading-tight">Scale Your Coaching Brand</h3>
                    <p className="text-xs text-white/55 font-sans">Deploy automated qualification funnels straight to your admissions office.</p>
                  </div>

                  {/* Input Fields */}
                  <div className="space-y-3.5 text-left font-sans">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-white/55 tracking-wider mb-1.5 pl-1">
                        Full Name
                      </label>
                      <input
                        required
                        type="text"
                        value={signupForm.name}
                        onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                        placeholder="e.g. Anand Kumar"
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/35 transition-all placeholder:text-white/30"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-white/55 tracking-wider mb-1.5 pl-1">
                        Business Email
                      </label>
                      <input
                        required
                        type="email"
                        value={signupForm.email}
                        onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                        placeholder="anand@super30.com"
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/35 transition-all placeholder:text-white/30"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-white/55 tracking-wider mb-1.5 pl-1">
                        Institute / Brand Name
                      </label>
                      <input
                        required
                        type="text"
                        value={signupForm.schoolName}
                        onChange={(e) => setSignupForm({ ...signupForm, schoolName: e.target.value })}
                        placeholder="e.g. Super 35 Academy"
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/35 transition-all placeholder:text-white/30"
                      />
                    </div>
                  </div>

                  {/* Submit buttons */}
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-white text-black font-heading font-black text-xs uppercase tracking-wider rounded-xl hover:scale-101 active:scale-99 hover:bg-neutral-150 transition-all cursor-pointer shadow-lg"
                  >
                    Initiate Free Trail
                  </button>

                  <p className="text-[10px] text-white/40 leading-none">
                    Requires no credit cards. Fully compliant with Meta guidelines.
                  </p>
                </form>
              ) : (
                /* Form Success Checked View */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6 py-6"
                >
                  <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
                    <CheckCircle2 className="w-10 h-10 text-green-400 animate-pulse" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-heading text-xl font-bold text-white">EduAgent Node Provisioned!</h4>
                    <p className="text-xs text-white/60 font-sans max-w-sm mx-auto leading-relaxed">
                      Thanks <b className="text-white">{signupForm.name}</b>. We have successfully registered <b className="text-white">{signupForm.schoolName}</b> into the evaluation tier!
                    </p>
                  </div>

                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl max-w-xs mx-auto text-[11px] text-white/55 font-mono leading-relaxed">
                    [INFO] A verification invite with sandbox steps is being dispatched to <b className="text-white">{signupForm.email}</b>. Live setup complete in 45s.
                  </div>

                  <div className="text-xs font-mono text-green-400">
                    Deploying Llama 3.1 agents...
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
