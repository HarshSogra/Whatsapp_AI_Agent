import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy, Database, Terminal, X } from "lucide-react";

interface ApiTab {
  path: string;
  method: "POST" | "GET";
  desc: string;
  requestBody: object;
  responseBody: object;
}

const apiEndpoints: ApiTab[] = [
  {
    path: "/api/auth/login",
    method: "POST",
    desc: "Authenticates an institute admin and returns the JWT used by the CRM dashboard.",
    requestBody: {
      email: "admin@institute.com",
      password: "your-secure-password",
    },
    responseBody: {
      token: "eyJhbGciOiJIUzI1NiIs...",
      user: {
        id: "usr_123",
        email: "admin@institute.com",
        role: "ADMIN",
      },
    },
  },
  {
    path: "/api/students",
    method: "GET",
    desc: "Returns student leads, bookings, and conversation history for the logged-in institute.",
    requestBody: {
      authorization: "Bearer <token>",
    },
    responseBody: {
      data: [
        {
          id: "student_123",
          phone: "919876543210",
          name: "User 3210",
          leadStatus: "HOT",
          bookings: [],
          messages: [
            {
              role: "user",
              content: "What is the NEET batch fee?",
              intent: "HIGH",
              timestamp: "2026-06-07T15:29:10.000Z",
            },
          ],
        },
      ],
    },
  },
  {
    path: "/api/courses",
    method: "GET",
    desc: "Returns the course catalog for the logged-in institute.",
    requestBody: {
      authorization: "Bearer <token>",
    },
    responseBody: {
      data: [
        {
          id: "course_123",
          name: "NEET 2026 Weekend Batch",
          fees: 35000,
          duration: "6 months",
        },
      ],
    },
  },
];

export default function ApiConsole() {
  const [activeTab, setActiveTab] = useState(0);
  const [showApiModal, setShowApiModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const activeEndpoint = apiEndpoints[activeTab];

  const copyEndpoint = async () => {
    await navigator.clipboard.writeText(`${activeEndpoint.method} ${activeEndpoint.path}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section id="dev-source" className="py-24 px-4 sm:px-6 md:px-8 bg-[#080808] relative border-t border-white/5">
      <div className="max-w-4xl mx-auto glass-premium rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 border border-white/15 bg-gradient-to-br from-white/[0.02] to-transparent relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Terminal className="w-5 h-5 text-white/55" />
              <span className="font-mono text-white/55 text-xs uppercase tracking-[0.25em]">
                backend / express api
              </span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl tracking-tight leading-none text-white font-bold">
              Live Backend Endpoints
            </h2>

            <p className="text-white/60 font-sans text-sm sm:text-base leading-relaxed max-w-xl">
              The frontend is wired to the real Express APIs: admin login, student CRM records, and institute courses.
            </p>

            <button
              onClick={() => setShowApiModal(true)}
              className="w-full sm:w-auto bg-white text-black font-sans font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl hover:bg-neutral-100 transition-all cursor-pointer shadow-lg"
            >
              API Documentation
            </button>
          </div>

          <div className="w-full md:w-auto flex flex-col items-center gap-4 shrink-0 bg-white/[0.02] border border-white/15 p-6 rounded-3xl backdrop-blur-xl relative z-10 select-none">
            <Database className="w-8 h-8 text-white/80" />
            <div className="text-center font-mono space-y-1">
              <div className="text-white font-bold text-sm">JWT Protected CRM</div>
              <div className="text-[10px] text-white/40 tracking-wider">BASE: VITE_API_BASE_URL</div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showApiModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowApiModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-4xl h-[85vh] flex flex-col glass-premium rounded-3xl border border-white/20 shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-[#070708]">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-white/80" />
                  <span className="font-heading font-bold text-white text-xs uppercase tracking-wider">
                    REST API Request-Response Console
                  </span>
                </div>
                <button
                  onClick={() => setShowApiModal(false)}
                  className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 flex flex-col overflow-hidden bg-black/40 p-6 space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-white">Backend API Map</h3>
                    <p className="text-xs text-white/50">Use these routes from the React frontend. Protected routes need the login token.</p>
                  </div>
                  <button
                    onClick={copyEndpoint}
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2 font-mono text-[10px] text-white transition-all active:scale-95"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied" : "Copy Endpoint"}
                  </button>
                </div>

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
                      }`}>
                        {endpoint.method}
                      </span>
                      <span>{endpoint.path}</span>
                    </button>
                  ))}
                </div>

                <p className="text-sm text-white/65">{activeEndpoint.desc}</p>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0 overflow-y-auto">
                  <div className="flex flex-col border border-white/10 rounded-2xl bg-[#09090b] overflow-hidden">
                    <div className="px-4 py-2 border-b border-white/5 bg-zinc-950 text-[10px] font-mono text-white/45 uppercase tracking-wider">
                      Request
                    </div>
                    <pre className="flex-1 p-4 font-mono text-xs text-white/95 overflow-auto whitespace-pre-wrap">
                      {JSON.stringify(activeEndpoint.requestBody, null, 2)}
                    </pre>
                  </div>

                  <div className="flex flex-col border border-white/10 rounded-2xl bg-[#09090b] overflow-hidden">
                    <div className="px-4 py-2 border-b border-white/5 bg-zinc-950 text-[10px] font-mono text-white/45 uppercase tracking-wider">
                      Response
                    </div>
                    <pre className="flex-1 p-4 font-mono text-xs text-emerald-400 overflow-auto whitespace-pre-wrap">
                      {JSON.stringify(activeEndpoint.responseBody, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

