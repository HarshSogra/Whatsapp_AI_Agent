import React, { useState, useEffect } from "react";
import { Sparkles, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NavbarProps {
  onGetStartedClick: () => void;
}

export default function Navbar({ onGetStartedClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-4 px-4 sm:px-6 md:px-8">
        <nav
          className={`flex justify-between items-center px-6 sm:px-8 py-3 mx-auto w-full max-w-7xl rounded-full border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)] transition-all duration-500 ${
            isScrolled
              ? "bg-black/85 backdrop-blur-xl scale-98 mt-1 border-white/20"
              : "bg-white/5 backdrop-blur-md mt-2"
          }`}
        >
          {/* Logo Brand */}
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => scrollToSection("hero")}
          >
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/20 transition-all group-hover:bg-white group-hover:text-black">
              <Sparkles className="w-4 h-4 text-white group-hover:text-black transition-colors" />
            </div>
            <span className="font-heading text-lg sm:text-xl font-bold tracking-tighter text-white">
              EduAgent <span className="gradient-text font-extrabold">AI</span>
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("features")}
              className="font-sans text-sm text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("niches")}
              className="font-sans text-sm text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              Solutions
            </button>
            <button
              onClick={() => scrollToSection("calculator")}
              className="font-sans text-sm text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              ROI Calculator
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="font-sans text-sm text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              FAQ
            </button>
          </div>

          {/* Nav Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={onGetStartedClick}
              className="font-sans text-sm text-white/70 hover:text-white transition-colors px-4 py-2 hover:bg-white/5 rounded-full transition-all active:scale-95 cursor-pointer"
            >
              Log In
            </button>
            <button
              onClick={onGetStartedClick}
              className="bg-white text-black font-sans text-sm font-semibold px-5 py-2 rounded-full hover:bg-white/90 shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-300 active:scale-95 cursor-pointer"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={onGetStartedClick}
              className="bg-white text-black font-sans text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-white/90 transition-all active:scale-95 cursor-pointer"
            >
              Get Started
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-white hover:bg-white/10 transition-all"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-[88px] mx-4 p-6 bg-black/95 backdrop-blur-2xl border border-white/10 rounded-2xl z-40 md:hidden flex flex-col gap-4 shadow-2xl"
          >
            <button
              onClick={() => scrollToSection("features")}
              className="text-left py-2 font-sans font-medium text-white/80 hover:text-white border-b border-white/5"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("niches")}
              className="text-left py-2 font-sans font-medium text-white/80 hover:text-white border-b border-white/5"
            >
              Solutions
            </button>
            <button
              onClick={() => scrollToSection("calculator")}
              className="text-left py-2 font-sans font-medium text-white/80 hover:text-white border-b border-white/5"
            >
              ROI Calculator
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-left py-2 font-sans font-medium text-white/80 hover:text-white border-b border-white/5"
            >
              FAQ
            </button>
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onGetStartedClick();
                }}
                className="w-full text-center py-2.5 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-all"
              >
                Log In
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onGetStartedClick();
                }}
                className="w-full text-center py-2.5 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition-all"
              >
                Sign Up Free
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
