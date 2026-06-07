import { FeatureItem, FunnelStep, BusinessNiche, FAQItem, StatItem } from "./types";

export const bentoFeatures: FeatureItem[] = [
  {
    id: "dual-layer-ai",
    icon: "Cpu",
    title: "Dual-Layer AI",
    description: "Hybrid intent detection combining Keywords + Llama 3.1 intelligence for human-like understanding.",
  },
  {
    id: "intelligent-scoring",
    icon: "Sparkles",
    title: "Intelligent Scoring",
    description: "Auto-tag leads as HOT, WARM, or COLD based on conversation sentiment and inquiry depth.",
  },
  {
    id: "human-connect",
    icon: "Headset",
    title: "Human Connect",
    description: "Instant handoff to human counselors when high-intent questions or complex scenarios arise.",
    highlighted: true,
  },
  {
    id: "admin-alerts",
    icon: "BellRing",
    title: "Admin Alerts",
    description: "Real-time WhatsApp notifications for HOT leads to ensure immediate counselor response.",
  },
  {
    id: "drip-followupdates",
    icon: "GitCommit",
    title: "Drip Follow-ups",
    description: "Automated re-engagement sequences to nurture leads through the enrollment funnel.",
  },
  {
    id: "enterprise-crm",
    icon: "LayoutDashboard",
    title: "Enterprise CRM",
    description: "High-performance dashboard for comprehensive multi-agent lead management.",
  },
  {
    id: "official-cloud-api",
    icon: "ShieldCheck",
    title: "Official Cloud API",
    description: "Meta-compliant official integration. Zero risk of business number banning.",
  },
  {
    id: "groq-performance",
    icon: "Zap",
    title: "Groq Performance",
    description: "Ultra-fast sub-100ms inference for a truly natural and instant chat experience.",
  },
];

export const funnelSteps: FunnelStep[] = [
  {
    stepNumber: "1",
    title: "1. Ad to Chat",
    description: "Student clicks your FB/IG ad to go directly into WhatsApp web or mobile chat.",
    icon: "MousePointerClick",
  },
  {
    stepNumber: "2",
    title: "2. AI Qualification",
    description: "EduAgent captures key student details, program intent, and scores lead quality.",
    icon: "Sparkles",
    highlighted: true,
  },
  {
    stepNumber: "3",
    title: "3. Close Lead",
    description: "Counselor gets a high-intent HOT lead synced straight to CRM, ready to collect fees.",
    icon: "Award",
  },
];

export const businessNiches: BusinessNiche[] = [
  {
    id: "competitive-exams",
    title: "Competitive Exams",
    description: "Scale JEE, NEET, and UPSC coaching inquiries without adding more staff overhead.",
    icon: "Rocket",
    exampleInquiry: "Hi, I am looking for JEE 2025 Crash course batches & schedule.",
    aiResponse: "Our comprehensive JEE 2025 Crash Course starts on April 1st. It features a 90-day intensive program with daily mock tests. Would you like to check the fee structure or sign up for a demo class?",
  },
  {
    id: "language-coaching",
    title: "Language Coaching",
    description: "Automate level-testing and slot booking for IELTS, TOEFL, and Spoken English.",
    icon: "Languages",
    exampleInquiry: "Hello, I need to get a Band 7.5 in IELTS. Do you have mock tests?",
    aiResponse: "Yes! We run weekly complete mock tests evaluated by certified Cambridge assessors. We can also schedule a free band estimation test for you tomorrow. Should we book a spot?",
  },
  {
    id: "professional-certs",
    title: "Professional Certs",
    description: "Handle queries for CA, CS, and CFA batches with precise curriculum and fee details.",
    icon: "Award",
    exampleInquiry: "What is the fee for CFA Level 1, and can I pay in installments?",
    aiResponse: "The CFA Level 1 prep is priced at ₹35,000 all-inclusive. You can split this into 3 easy monthly installments. I can send the detailed syllabus and module breakdown. Shall I WhatsApp it to you?",
  },
  {
    id: "school-tuitions",
    title: "School Tuitions",
    description: "Simplify parent communications for K-12 tuition centers and hobby classes effortlessly.",
    icon: "BookOpen",
    exampleInquiry: "Hi! Do you have science home tuitions for standard 10 GSEB board?",
    aiResponse: "Yes, we specialize in 10th standard GSEB science classes, offering highly qualified local tutors. We also provide weekly customized test reports for parents. Would you like to register a demo session?",
  },
  {
    id: "upskilling-bootcamps",
    title: "Upskilling Bootcamps",
    description: "Convert high-intent tech learners for Coding, Data Science, and AI design bootcamps.",
    icon: "Terminal",
    exampleInquiry: "Can you guarantee a placement for the Data Science cohort starting next month?",
    aiResponse: "Our Data Science specialization features 1-on-1 resume reviews and direct placement interviews at 180+ tech partners. 92% of our graduates get placed within 6 months. Shall I share our prospectus & placement report?",
  },
  {
    id: "distance-learning",
    title: "Distance Learning",
    description: "Manage global inquiries for online degree programs and executive MBA courses seamlessly.",
    icon: "Map",
    exampleInquiry: "I am interested in your Executive Online MBA program. How long is it?",
    aiResponse: "Our UGC-DEB approved Executive MBA is designed for working professionals and spanning 15 months with convenient weekend live classes. We are currently accepting registrations. Can I schedule a call with our career advisory expert?",
  },
];

export const statistics: StatItem[] = [
  {
    id: "enrollment-growth",
    value: "40%",
    label: "Enrollment Growth",
    description: "Average increase in student inquiries converted",
  },
  {
    id: "response-time",
    value: "<1s",
    label: "Response Time",
    description: "Instant sub-second AI dialogue replies",
  },
  {
    id: "staff-automation",
    value: "70%",
    label: "Staff Automation",
    description: "Repetitive Q&A handled by EduAgent automatically",
  },
  {
    id: "daily-qualifications",
    value: "10k+",
    label: "Daily Qualifications",
    description: "Leads successfully evaluated worldwide",
  },
];

export const faqItems: FAQItem[] = [
  {
    id: "whatsapp-ban",
    question: "Will it ban my WhatsApp number?",
    answer: "Absolutely not. EduAgent AI works strictly on Meta's official WhatsApp Cloud API, using Meta's registered business numbers. This complies fully with WhatsApp's Terms of Service, maintaining your professional business verification checkmark and eliminating any risk of number blocking.",
  },
  {
    id: "scoring-logic",
    question: "How does intelligent lead scoring work?",
    answer: "Our advanced NLP engine assesses the depth of intent, the specificity of questions (e.g. asking for specific schedules, fee brackets, syllabus details), and urgency. Leads show high readiness are auto-tagged as 'HOT' and prioritized with instant admin triggers, while casual greetings or general queries are classified as 'WARM/COLD' for steady drip feeds.",
  },
  {
    id: "crm-integration",
    question: "Can I connect it to my existing CRM system?",
    answer: "Yes, fully! EduAgent AI includes turn-key webhook support and a robust Rest API. It natively syncs data with top education sales tools and general CRM systems, including HubSpot, LeadSquared, Zoho CRM, Salesforce, or custom internal tracking databases in real-time.",
  },
  {
    id: "custom-knowledge",
    question: "How does the AI know specific parameters like my institute's fees?",
    answer: "You can load all your course details, pricing tiers, batch timings, discount options, and FAQs into the EduAgent content hub. It uses retrieval-augmented generation to only reply with valid information, completely avoiding generic hallucinations.",
  },
];
