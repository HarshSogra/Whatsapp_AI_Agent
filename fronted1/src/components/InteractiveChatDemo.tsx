import React, { useState, useEffect, useRef } from "react";
import { CheckCircle2, ChevronRight, Send, ArrowRight, CornerDownLeft, Sparkles, AlertTriangle } from "lucide-react";
import { ChatMessage } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface InteractiveChatDemoProps {
  nicheInquiry?: { inquiry: string; response: string } | null;
}

export default function InteractiveChatDemo({ nicheInquiry }: InteractiveChatDemoProps) {
  // Initial starting dialogue
  const initialMessages: ChatMessage[] = [
    {
      id: "m1",
      sender: "user",
      text: "Hi, I want to know about the JEE 2025 Crash Course.",
      time: "02:15 PM",
    },
    {
      id: "m2",
      sender: "agent",
      text: "Hello! Our JEE 2025 Crash Course starts on April 1st. It's a 90-day intensive program with daily mock tests. Would you like to see the fee structure?",
      time: "02:15 PM",
    },
    {
      id: "m3",
      sender: "user",
      text: "Yes, and can I book a demo class for tomorrow?",
      time: "02:16 PM",
    },
    {
      id: "m4",
      sender: "agent",
      text: "The fee is ₹25,000 (all inclusive). I've scheduled your Demo Class for tomorrow at 11:00 AM. Our counselor will call you shortly to confirm!",
      time: "02:16 PM",
      isAdminAlert: true,
    }
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sync scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Handle external niche trigger from NicheShowcase
  useEffect(() => {
    if (nicheInquiry) {
      triggerDialogue(nicheInquiry.inquiry, nicheInquiry.response);
    }
  }, [nicheInquiry]);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const triggerDialogue = (userText: string, agentReply: string) => {
    // Append user message
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: userText,
      time: getCurrentTime(),
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Timeout response simulation
    setTimeout(() => {
      setIsTyping(false);
      const agentMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: "agent",
        text: agentReply,
        time: getCurrentTime(),
        isAdminAlert: agentReply.toLowerCase().includes("hot") || agentReply.toLowerCase().includes("book") || agentReply.toLowerCase().includes("scheduled"),
      };
      setMessages((prev) => [...prev, agentMsg]);
    }, 1200);
  };

  // Rule-based NLP responder for arbitrary user inputs
  const handleCustomSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userQuery = inputText.trim();
    setInputText("");

    // Generate response matching values
    let responseText = "";
    const lowerQuery = userQuery.toLowerCase();

    if (lowerQuery.includes("fee") || lowerQuery.includes("much") || lowerQuery.includes("price") || lowerQuery.includes("cost") || lowerQuery.includes("payment")) {
      responseText = "Our core modules range from ₹15,000 to ₹35,000 depending on batch intensity. We offer interest-free quarterly installments. Shall I forward the structural fee PDF breakdown to you?";
    } else if (lowerQuery.includes("demo") || lowerQuery.includes("trial") || lowerQuery.includes("book") || lowerQuery.includes("join")) {
      responseText = "Of course! Let's schedule that. I have available demo classes tomorrow at 11:00 AM and 5:00 PM. Which time slot suits your student best?";
    } else if (lowerQuery.includes("jee") || lowerQuery.includes("neet") || lowerQuery.includes("upsc") || lowerQuery.includes("exam")) {
      responseText = "We have specific expert-led crash and intensive programs for JEE, NEET, and UPSC starting this Monday. All courses feature premium mental assessment trackers. Should I call you on this number to detail them?";
    } else if (lowerQuery.includes("ielts") || lowerQuery.includes("english") || lowerQuery.includes("language")) {
      responseText = "Our English & IELTS courses are conducted by certified British Council tutors. We feature virtual simulation mock tests to target a Band 7.5+. Can we schedule a free 15-minute diagnostic test for you?";
    } else if (lowerQuery.includes("human") || lowerQuery.includes("counselor") || lowerQuery.includes("call") || lowerQuery.includes("talk")) {
      responseText = "[Handoff Triggered] Sure, I am transferring you directly to our Principal Advisor for a real-time call back. They will ring you within 5 minutes. Hang tight!";
    } else {
      responseText = "Absolutely! I've logged this in our admissions channel. Since this is rated as HOT interest, our counselor will ring you back immediately to answer any custom specifics!";
    }

    triggerDialogue(userQuery, responseText);
  };

  // Preset button handlers
  const handlePresetTrigger = (presetType: "fees" | "demo" | "curriculum") => {
    let q = "";
    let r = "";

    if (presetType === "fees") {
      q = "What is your typical fee brackets & schedule?";
      r = "EduAgent standard packages are ₹25,000 all-inclusive for UPSC/JEE crash courses. We host morning cohorts (7:00 AM) and evening batches (6:00 PM). Would you like to reserve a seat in the next demo batch?";
    } else if (presetType === "demo") {
      q = "How do I book a trial demo class?";
      r = "Simplistic! Just nominate your target subject. We have reserved an open seat for a Physics free trial session tomorrow at 11:00 AM. I have marked this as scheduled! Highly qualified tutors guaranteed.";
    } else if (presetType === "curriculum") {
      q = "Can you describe the teachers & syllabus framework?";
      r = "Certainly! All lecturers have IIT/IIM or 10+ years academic experience. Our curriculum covers full mock series built strictly on the latest national exam guidelines. Shall I send the booklet brochure?";
    }

    triggerDialogue(q, r);
  };

  return (
    <section id="demo" className="py-24 px-4 sm:px-6 md:px-8 relative bg-[#080808] border-t border-b border-white/5">
      {/* Background Halos */}
      <div className="absolute top-[30%] left-[-15%] w-[450px] h-[450px] bg-white/2 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-white/2 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Side: Pitch and Interactive Presets */}
        <div className="lg:col-span-7 space-y-8 pr-0 lg:pr-8">
          <div className="space-y-4">
            <span className="text-[10px] sm:text-xs font-mono font-semibold tracking-[0.25em] text-[#E5E5E5]/50 uppercase">
              INTERACTIVE DEMO SANDBOX
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#E5E5E5] leading-[1.1]">
              Engage <span className="italic font-normal font-serif text-white">Prospects</span> Instantly
            </h2>
            <p className="text-[#E5E5E5]/70 font-sans text-base sm:text-lg max-w-2xl">
              Stop losing potential students to slow response times. EduAgent handles common admission queries before your counselor even picks up the phone.
            </p>
          </div>

          {/* Interactive Presets (represented as checkmark list but fully interactive!) */}
          <div className="space-y-4">
            <p className="text-xs font-mono text-white/40 uppercase tracking-widest">
              Click a trigger to simulate a student conversation:
            </p>
            <div className="flex flex-col gap-3.5 max-w-xl">
              <button
                onClick={() => handlePresetTrigger("fees")}
                className="w-full text-left p-4 rounded-xl border border-white/10 hover:border-white/30 bg-white/[0.01] hover:bg-white/[0.04] transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white border border-white/10 group-hover:bg-white group-hover:text-black transition-colors">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="font-sans font-medium text-sm sm:text-base text-white/95">
                    Fees and Batch Timings
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-white/40 group-hover:text-white transition-colors">
                  <span>Trigger Inbound</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>

              <button
                onClick={() => handlePresetTrigger("demo")}
                className="w-full text-left p-4 rounded-xl border border-white/10 hover:border-white/30 bg-white/[0.01] hover:bg-white/[0.04] transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white border border-white/10 group-hover:bg-white group-hover:text-black transition-colors">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="font-sans font-medium text-sm sm:text-base text-white/95">
                    Booking Demo Classes
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-white/40 group-hover:text-white transition-colors">
                  <span>Trigger Inbound</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>

              <button
                onClick={() => handlePresetTrigger("curriculum")}
                className="w-full text-left p-4 rounded-xl border border-white/10 hover:border-white/30 bg-white/[0.01] hover:bg-white/[0.04] transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white border border-white/10 group-hover:bg-white group-hover:text-black transition-colors">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="font-sans font-medium text-sm sm:text-base text-white/95">
                    Curriculum & Faculty Details
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-white/40 group-hover:text-white transition-colors">
                  <span>Trigger Inbound</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>
            </div>
            
            <p className="text-xs text-white/45 flex items-center gap-1.5 pt-2">
              <Sparkles className="w-3.5 h-3.5 text-yellow-500/80" />
              <span>Or type a completely custom message inside the phone mockup to test!</span>
            </p>
          </div>
        </div>

        {/* Right Side: High-impact Phone Frame Mockup container */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-[350px] aspect-[9/18.5] bg-black rounded-[48px] border-[10px] border-white/10 shadow-[0_0_80px_rgba(255,255,255,0.06)] overflow-hidden flex flex-col">
            
            {/* Phone Speaker & Camera Notch Bar */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-30 flex items-center justify-center">
              <div className="w-12 h-1 bg-zinc-800 rounded-full" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 ml-4 border border-zinc-800" />
            </div>

            {/* WhatsApp App Header */}
            <div className="bg-neutral-900 border-b border-white/10 pt-10 pb-4 px-5 flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white border border-white/15">
                <span className="font-heading text-xs font-bold text-white uppercase">EA</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading text-sm font-bold text-white truncate">EduAgent AI</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] text-white/40 tracking-wider uppercase font-mono">active online</span>
                </div>
              </div>
            </div>

            {/* App Message Thread Container */}
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar flex flex-col gap-4 bg-zinc-950/70">
              {messages.map((msg) => {
                const isUser = msg.sender === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[85%] ${
                      isUser ? "self-end items-end" : "self-start items-start"
                    }`}
                  >
                    <div
                      className={`p-3.5 text-xs sm:text-sm ${
                        isUser 
                          ? "whatsapp-bubble-user text-white" 
                          : "whatsapp-bubble-agent text-white/95"
                      }`}
                    >
                      <span>{msg.text}</span>
                      
                      {/* Check if Admin notification tag is enabled */}
                      {msg.isAdminAlert && (
                        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center gap-2 text-[10px] font-mono text-red-400 font-bold uppercase tracking-wider">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                          <span>[Admin Alert: HOT Lead Registered]</span>
                        </div>
                      )}

                      {/* Msg Timestamp */}
                      <div className="text-[9px] text-white/40 text-right mt-1.5">
                        {msg.time}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="self-start whatsapp-bubble-agent p-3 flex items-center gap-1.5">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-[10px] text-white/40 font-mono tracking-widest uppercase ml-1">AI Thinking...</span>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* WhatsApp Mock Input Bar */}
            <form onSubmit={handleCustomSend} className="bg-neutral-900/90 border-t border-white/15 p-3 flex items-center gap-2 shrink-0">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your student query..."
                className="flex-1 bg-black/60 text-white rounded-full border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-white/30 transition-all font-sans"
              />
              <button
                type="submit"
                className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-neutral-100 active:scale-95 transition-all shrink-0 cursor-pointer"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        </div>

      </div>
    </section>
  );
}
