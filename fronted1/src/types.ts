export interface FeatureItem {
  id: string;
  icon: string; // Lucide icon name
  title: string;
  description: string;
  highlighted?: boolean;
}

export interface FunnelStep {
  stepNumber: string;
  title: string;
  description: string;
  icon: string;
  highlighted?: boolean;
}

export interface BusinessNiche {
  id: string;
  title: string;
  description: string;
  icon: string;
  exampleInquiry: string;
  aiResponse: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "agent";
  text: string;
  time: string;
  isAdminAlert?: boolean;
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
  description?: string;
}
