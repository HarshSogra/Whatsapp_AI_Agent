import React, { useState } from "react";
import { Terminal, Code, Database, ChevronRight, X, Play, Copy, Check, FileCode, Folder, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ApiTab {
  path: string;
  method: "POST" | "GET" | "PUT";
  desc: string;
  requestBody: object;
  responseBody: object;
}

export default function ApiConsole() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [showRepoModal, setShowRepoModal] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string>("webhook.ts");

  const apiEndpoints: ApiTab[] = [
    {
      path: "/api/v1/enrollment/lead",
      method: "POST",
      desc: "Registers incoming WhatsApp inquiries and evaluates core intents.",
      requestBody: {
        wa_id: "919876543210",
        student_name: "Aarav Sharma",
        raw_speech: "Hello! I am preparing for NEET 2026. What is the fee of your weekend offline batch?",
        ad_campaign: "NEET_INBOUND_FB_AD"
      },
      responseBody: {
        lead_id: "lead_89a3f2d1",
        meta: {
          whatsapp_verified: true,
          scoring_model: "llama-3.1-edu"
        },
        evaluation: {
          intent_category: "fee_inquiry",
          sentiment: "highly_positive",
          suggested_response: "The offline NEET 2026 weekend batch is ₹35,000. Classes run Saturdays & Sundays from 9:00 AM...",
          intent_score: "0.94 (HOT Lead)"
        }
      }
    },
    {
      path: "/api/v1/leads/sync",
      method: "POST",
      desc: "Forwards qualified student parameters straight to your designated CRM webhook.",
      requestBody: {
        dispatch_token: "tok_edu_a983b67",
        crm_target: "leadsquared_v2",
        lead_data: {
          id: "lead_89a3f2d1",
          name: "Aarav Sharma",
          phone: "+919876543210",
          classified_tag: "HOT",
          course_interest: "NEET_2026_OFFLINE"
        }
      },
      responseBody: {
        sync_status: "dispatched",
        dispatch_latency_ms: 18,
        external_id: "LS-902319-A",
        connection: "secure_ssl_web"
      }
    },
    {
      path: "/api/v1/handoff",
      method: "PUT",
      desc: "Instantly flags a lead for manual counselor takeover.",
      requestBody: {
        lead_id: "lead_89a3f2d1",
        takeover_reason: "student_requested_mentor_call",
        alert_priority: "critical"
      },
      responseBody: {
        handoff_status: "assigned",
        designated_agent: "Counselor Priya Verma",
        slack_dispatched: true,
        sms_routing_timestamp: "2026-06-07T15:29:10Z"
      }
    }
  ];

  const repoFiles = {
    "webhook.ts": `// @license Apache-2.0
import { ExpressRouter } from "fastapi";
import { evaluateLeadIntent } from "../services/llama";
import { dispatchCrmSync } from "../services/crm";

export async function handleWhatsAppInbound(req: Request, res: Response) {
  const { wa_id, student_name, raw_speech, ad_campaign } = req.body;
  
  // 1. Process via LLama 3.1 Dual-layer evaluation engine
  const evaluationResult = await evaluateLeadIntent({
    rawSpeech: raw_speech,
    name: student_name
  });

  // 2. Dispatch human alarms if rating is flagged as "HOT Lead"
  if (evaluationResult.intentScore >= 0.85) {
    await triggerAdminAlert({
      phone: wa_id,
      name: student_name,
      alert: "HOT Lead Registered from Add to Chat"
    });
  }

  // 3. Keep CRM synced in real time
  await dispatchCrmSync(evaluationResult);

  return res.json({
    status: "ok",
    lead_id: evaluationResult.id,
    grade: evaluationResult.scoreTag
  });
}`,
    "llama.ts": `// @license Apache-2.0
import { GroqClient } from "groq-node";

const groq = new GroqClient({ apiKey: process.env.GROQ_API_KEY });

export async function evaluateLeadIntent({ rawSpeech, name }) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.1-70b-versatile",
    messages: [
      { role: "system", content: "You are a lead qualifying assistant for modern premium coaching institutes. Categorize intent to: [fee, batch, demo, general]." },
      { role: "user", content: rawSpeech }
    ],
    temperature: 0.1
  });

  const rawText = completion.choices[0].message.content;
  return parseIntentEvaluation(rawText);
}`,
    "package.json": `{
  "name": "eduagent-core",
  "version": "2.1.0",
  "description": "Enterprise lead routing microservice",
  "dependencies": {
    "express": "^4.21.2",
    "groq-sdk": "^0.3.0",
    "dotenv": "^17.2.3"
  }
}`
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section id="dev-source" className="py-24 px-4 sm:px-6 md:px-8 bg-[#080808] relative border-t border-white/5">
      
      {/* Background Soft Gradients */}
      <div className="absolute top-[30%] left-[20%] w-[500px] h-[500px] bg-white/2 rounded-full blur-[140px] pointer-events-none" />

      {/* Main card box matching mockup */}
      <div className="max-w-4xl mx-auto glass-premium rounded-[3.5rem] p-8 sm:p-12 md:p-14 flex flex-col md:flex-row items-center gap-12 border border-white/15 bg-gradient-to-br from-white/[0.02] to-transparent relative overflow-hidden shadow-2xl">
        
        {/* Glow halo behind logo corner */}
        <div className="absolute -top-[10%] left-[10%] w-72 h-72 bg-white/2 rounded-full blur-[90px] pointer-events-none" />

        {/* Left column info */}
        <div className="flex-1 space-y-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Terminal className="w-5 h-5 text-white/55" />
            <span className="font-mono text-white/55 text-xs uppercase tracking-[0.25em]">
              eduagent-core / v2.1-stable
            </span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl tracking-tight leading-none text-white font-bold">
            EduAgent AI Core
          </h2>

          <p className="text-white/60 font-sans text-sm sm:text-base leading-relaxed max-w-xl">
            Enterprise-ready lead management infrastructure for modern education brands. Fully extensible via secure Webhooks and a latency-tested REST API.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center md:justify-start pt-2">
            <button
              onClick={() => setShowRepoModal(true)}
              className="w-full sm:w-auto bg-white text-black font-sans font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl hover:scale-103 active:scale-97 hover:bg-neutral-100 transition-all cursor-pointer shadow-lg"
            >
              View Demo Repo
            </button>
            <button
              onClick={() => setShowApiModal(true)}
              className="w-full sm:w-auto glass-premium text-white font-sans font-semibold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl hover:bg-white/10 active:scale-97 transition-all cursor-pointer"
            >
              API Documentation
            </button>
          </div>
        </div>

        {/* Right side simple tech elements */}
        <div className="w-full md:w-auto flex flex-col items-center gap-4 shrink-0 bg-white/[0.02] border border-white/15 p-6 rounded-3xl backdrop-blur-xl relative z-10 select-none">
          <Database className="w-8 h-8 text-white/80" />
          <div className="text-center font-mono space-y-1">
            <div className="text-white font-bold text-sm">PostgreSQL Sync</div>
            <div className="text-[10px] text-white/40 tracking-wider">LATENCY: 18ms</div>
          </div>
        </div>

      </div>

      {/* Interactive GitHub Repo Modal */}
      <AnimatePresence>
        {showRepoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRepoModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-4xl h-[80vh] flex flex-col glass-premium rounded-3xl border border-white/20 shadow-2xl relative z-10 overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-[#070708]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="font-heading font-bold text-white text-sm">eduagent-core Repository Explorer</span>
                </div>
                <button 
                  onClick={() => setShowRepoModal(false)}
                  className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Code Panel Body split layout */}
              <div className="flex-1 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/10 min-h-0 bg-[#070708]">
                {/* File Tree Left sidebar */}
                <div className="w-full md:w-64 p-4 space-y-4 overflow-y-auto shrink-0 bg-black/40">
                  <span className="text-[9px] font-mono tracking-widest text-white/40 uppercase">WORKSPACE STACK</span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-mono text-white/45">
                      <Folder className="w-4 h-4 shrink-0" />
                      <span>src</span>
                    </div>
                    {/* Files */}
                    {[
                      { name: "webhook.ts", path: "webhook.ts" },
                      { name: "llama.ts", path: "llama.ts" },
                      { name: "package.json", path: "package.json" }
                    ].map((file) => {
                      const isSelected = selectedFile === file.path;
                      return (
                        <button
                          key={file.path}
                          onClick={() => setSelectedFile(file.path)}
                          className={`w-full flex items-center gap-2 px-6 py-2.5 text-xs font-mono rounded-lg text-left transition-colors cursor-pointer ${
                            isSelected 
                              ? "bg-white/10 text-white font-semibold border border-white/10" 
                              : "text-white/60 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <FileCode className={`w-4 h-4 shrink-0 ${isSelected ? "text-white" : "text-white/40"}`} />
                          <span>{file.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Code Terminal Display Right side */}
                <div className="flex-1 flex flex-col overflow-hidden bg-black/25">
                  {/* Code Bar Header */}
                  <div className="px-6 py-3 border-b border-white/5 flex justify-between items-center bg-zinc-950/40">
                    <span className="font-mono text-xs text-white/60">{selectedFile}</span>
                    <button
                      onClick={() => copyToClipboard((repoFiles as any)[selectedFile])}
                      className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1.5 font-mono text-[10px] text-white transition-all active:scale-95 cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? "Copied" : "Copy Code"}</span>
                    </button>
                  </div>

                  {/* Highlighted Code Area */}
                  <div className="flex-1 p-6 overflow-auto font-mono text-xs text-white/90 leading-relaxed bg-[#0a0a0c]">
                    <pre className="whitespace-pre">{ (repoFiles as any)[selectedFile] }</pre>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interactive REST API Documentation Explorer Modal */}
      <AnimatePresence>
        {showApiModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowApiModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-4xl h-[85vh] flex flex-col glass-premium rounded-3xl border border-white/20 shadow-2xl relative z-10 overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-[#070708]">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-white/80" />
                  <span className="font-heading font-bold text-white text-xs uppercase tracking-wider">REST API Request-Response Console</span>
                </div>
                <button 
                  onClick={() => setShowApiModal(false)}
                  className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* API Workspace containing active parameters */}
              <div className="flex-1 flex flex-col overflow-hidden bg-black/40 p-6 space-y-6">
                <div>
                  <h3 className="font-heading text-lg font-bold text-white">Interactive Sandbox Sandbox</h3>
                  <p className="text-xs text-white/50">Simulate request executions to capture lead payloads. Click any endpoint below to view schemas:</p>
                </div>

                {/* Endpoint selection tabs */}
                <div className="flex flex-wrap gap-2.5 border-b border-white/10 pb-4">
                  {apiEndpoints.map((endpoint, i) => (
                    <button
                      key={endpoint.path}
                      onClick={() => setActiveTab(i)}
                      className={`px-4 py-2 text-xs font-mono rounded-lg border flex items-center gap-2 transition-all cursor-pointer ${
                        activeTab === i
                          ? "bg-white text-black font-semibold border-white"
                          : "bg-white/5 text-white/70 hover:text-white border-white/15"
                      }`}
                    >
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        endpoint.method === "POST" ? "bg-green-500/10 text-green-400" : "bg-blue-500/10 text-blue-400"
                      }`}>{endpoint.method}</span>
                      <span>{endpoint.path}</span>
                    </button>
                  ))}
                </div>

                {/* API Details Panel */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0 overflow-y-auto">
                  {/* Request view */}
                  <div className="flex flex-col border border-white/10 rounded-2xl bg-[#09090b] overflow-hidden">
                    <div className="px-4 py-2 border-b border-white/5 bg-zinc-950 text-[10px] font-mono text-white/45 uppercase tracking-wider">
                      HTTP REQUEST BODY (JSON)
                    </div>
                    <div className="flex-1 p-4 font-mono text-xs text-white/95 overflow-auto">
                      <pre>{JSON.stringify(apiEndpoints[activeTab].requestBody, null, 2)}</pre>
                    </div>
                  </div>

                  {/* Response view */}
                  <div className="flex flex-col border border-white/10 rounded-2xl bg-[#09090b] overflow-hidden">
                    <div className="px-4 py-2 border-b border-white/5 bg-zinc-950 text-[10px] font-mono text-white/45 uppercase tracking-wider flex justify-between items-center">
                      <span>HTTP RESPONSE BODY STATUS 200 (OK)</span>
                    </div>
                    <div className="flex-1 p-4 font-mono text-xs text-emerald-400 overflow-auto">
                      <pre>{JSON.stringify(apiEndpoints[activeTab].responseBody, null, 2)}</pre>
                    </div>
                  </div>
                </div>

                {/* Footer notes */}
                <div className="text-right">
                  <button
                    onClick={() => setShowApiModal(false)}
                    className="px-6 py-2 bg-white text-black font-semibold text-xs rounded-xl hover:bg-neutral-150 transition-all cursor-pointer"
                  >
                    Done Testing
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
