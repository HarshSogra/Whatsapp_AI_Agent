const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface Course {
  id: string;
  instituteId: string;
  name: string;
  description?: string | null;
  fees: number;
  duration?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  id: string;
  studentId: string;
  whatsappMessageId?: string | null;
  phoneNumber: string;
  role: "user" | "assistant" | string;
  content: string;
  intent?: "HIGH" | "LOW" | string | null;
  timestamp: string;
}

export interface DemoBooking {
  id: string;
  studentId: string;
  courseId: string;
  scheduledAt: string;
  status: string;
  createdAt: string;
}

export interface Student {
  id: string;
  instituteId: string;
  phone: string;
  name?: string | null;
  status: string;
  leadStatus: string;
  lastHighIntentAt?: string | null;
  lastFollowUpSentAt?: string | null;
  followUpCount: number;
  lastFollowUpType?: string | null;
  createdAt: string;
  updatedAt: string;
  bookings: DemoBooking[];
  messages: Message[];
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof payload === "object" && payload && "error" in payload
      ? String(payload.error)
      : `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return payload as T;
}

export function login(email: string, password: string) {
  return request<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function getStudents(token: string) {
  return request<Student[]>("/api/students", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getCourses(token: string) {
  return request<Course[]>("/api/courses", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getHealth() {
  return request<{ status: string; database: string }>("/health");
}

