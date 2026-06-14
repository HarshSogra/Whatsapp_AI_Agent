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
import Dashboard from "./components/Dashboard";
import { login, AuthUser } from "./api";
import { AlertCircle, GraduationCap, Lock, Mail, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [nicheInquiry, setNicheInquiry] = useState<{ inquiry: string; response: string } | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem("eduagent_token") || "");
  const [user, setUser] = useState<AuthUser | null>(() => {
    const savedUser = localStorage.getItem("eduagent_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleNicheSelect = (config: { inquiry: string; response: string }) => {
    setNicheInquiry(config);
  };

  const openLogin = () => {
    setLoginError("");
    setShowLoginModal(true);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");
    try {
      const response = await login(loginForm.email, loginForm.password);
      localStorage.setItem("eduagent_token", response.token);
      localStorage.setItem("eduagent_user", JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);
      setShowLoginModal(false);
      setLoginForm({ email: "", password: "" });
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("eduagent_token");
    localStorage.removeItem("eduagent_user");
    setToken("");
    setUser(null);
    setLoginForm({ email: "", password: "" });
  };

  if (token && user) {
    return <Dashboard token={token} user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-[#080808] text-[#E5E5E5] relative antialiased">
      <Navbar onGetStartedClick={openLogin} onLoginClick={openLogin} />
      
      <main className="relative z-10">
        <Hero onGetStartedClick={openLogin} />
        
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

      {/* Admin Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLoginModal(false)}
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
                onClick={() => setShowLoginModal(false)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div className="mx-auto w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/15">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-white leading-tight">Admin Login</h3>
                  <p className="text-xs text-white/55 font-sans">Use your backend admin account to open the live CRM dashboard.</p>
                </div>

                {loginError && (
                  <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-left text-xs text-red-200">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div className="space-y-3.5 text-left font-sans">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-white/55 tracking-wider mb-1.5 pl-1">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35" />
                      <input
                        required
                        type="email"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        placeholder="admin@institute.com"
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-white/35 transition-all placeholder:text-white/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-white/55 tracking-wider mb-1.5 pl-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35" />
                      <input
                        required
                        type="password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        placeholder="Enter password"
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-white/35 transition-all placeholder:text-white/30"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3.5 bg-white text-black font-heading font-black text-xs uppercase tracking-wider rounded-xl hover:scale-101 active:scale-99 hover:bg-neutral-150 transition-all cursor-pointer shadow-lg disabled:opacity-60 disabled:cursor-wait"
                >
                  {isLoggingIn ? "Connecting..." : "Open Dashboard"}
                </button>

                <p className="text-[10px] text-white/40 leading-relaxed">
                  Requires a user row in the backend database. New signup is not available until the backend adds a registration API.
                </p>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
