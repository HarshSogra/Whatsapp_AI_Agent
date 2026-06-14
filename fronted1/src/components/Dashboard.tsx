import React, { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Bot,
  Clock,
  LogOut,
  MessageSquare,
  RefreshCw,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { Course, getCourses, getStudents, Student, AuthUser } from "../api";

interface DashboardProps {
  token: string;
  user: AuthUser;
  onLogout: () => void;
}

const statusStyle: Record<string, string> = {
  HOT: "bg-red-500/15 text-red-300 border-red-500/25",
  WARM: "bg-amber-500/15 text-amber-200 border-amber-500/25",
  COLD: "bg-slate-500/15 text-slate-300 border-slate-500/25",
};

function formatDate(value?: string | null) {
  if (!value) return "No activity";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function Dashboard({ token, user, onLogout }: DashboardProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const loadDashboard = async () => {
    setIsLoading(true);
    setError("");
    try {
      const [studentData, courseData] = await Promise.all([
        getStudents(token),
        getCourses(token),
      ]);
      setStudents(studentData);
      setCourses(courseData);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to load dashboard";
      setError(message);
      if (message.toLowerCase().includes("token") || message.toLowerCase().includes("unauthorized")) {
        onLogout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [token]);

  const stats = useMemo(() => {
    const hotLeads = students.filter((student) => student.leadStatus === "HOT").length;
    const warmLeads = students.filter((student) => student.leadStatus === "WARM").length;
    const bookings = students.reduce((total, student) => total + student.bookings.length, 0);
    const messages = students.reduce((total, student) => total + student.messages.length, 0);

    return [
      { label: "Total Leads", value: students.length, icon: Users },
      { label: "Hot Leads", value: hotLeads, icon: TrendingUp },
      { label: "Warm Leads", value: warmLeads, icon: Bot },
      { label: "Demo Bookings", value: bookings, icon: Clock },
      { label: "Messages", value: messages, icon: MessageSquare },
      { label: "Courses", value: courses.length, icon: BookOpen },
    ];
  }, [courses.length, students]);

  const recentStudents = [...students].sort((a, b) => {
    const aDate = new Date(a.updatedAt || a.createdAt).getTime();
    const bDate = new Date(b.updatedAt || b.createdAt).getTime();
    return bDate - aDate;
  });

  const sortedMessages = selectedStudent
    ? [...selectedStudent.messages].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      )
    : [];

  return (
    <div className="min-h-screen bg-[#080808] text-white px-4 sm:px-6 md:px-8 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-white/55 font-mono text-xs uppercase tracking-[0.22em]">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Backend connected
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold mt-3">EduAgent CRM</h1>
            <p className="text-white/55 text-sm mt-2">Signed in as {user.email}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={loadDashboard}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10 disabled:opacity-50 flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-neutral-200 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </header>

        {error && (
          <div className="border border-red-500/25 bg-red-500/10 text-red-200 rounded-2xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="glass-premium rounded-2xl p-5 border border-white/10">
                <Icon className="w-5 h-5 text-white/60" />
                <div className="text-3xl font-black mt-4">{isLoading ? "..." : stat.value}</div>
                <div className="text-xs uppercase tracking-wider text-white/45 mt-1">{stat.label}</div>
              </div>
            );
          })}
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-6">
          <div className="glass-premium rounded-3xl border border-white/10 overflow-hidden">
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold">Student Leads</h2>
              <span className="text-xs text-white/45 font-mono">{students.length} records</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-white/[0.03] text-white/45 uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="px-5 py-3 text-left font-semibold">Student</th>
                    <th className="px-5 py-3 text-left font-semibold">Phone</th>
                    <th className="px-5 py-3 text-left font-semibold">Lead</th>
                    <th className="px-5 py-3 text-left font-semibold">Messages</th>
                    <th className="px-5 py-3 text-left font-semibold">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-10 text-center text-white/45">Loading leads...</td>
                    </tr>
                  ) : recentStudents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-10 text-center text-white/45">No student leads found yet.</td>
                    </tr>
                  ) : (
                    recentStudents.map((student) => (
                      <tr
                        key={student.id}
                        onClick={() => setSelectedStudent(student)}
                        className="hover:bg-white/[0.025] transition-colors cursor-pointer"
                      >
                        <td className="px-5 py-4 font-semibold text-white">{student.name || "Unnamed lead"}</td>
                        <td className="px-5 py-4 text-white/65">{student.phone}</td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full border text-xs font-bold ${statusStyle[student.leadStatus] || statusStyle.COLD}`}>
                            {student.leadStatus || student.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-white/65">{student.messages.length}</td>
                        <td className="px-5 py-4 text-white/45">{formatDate(student.updatedAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-premium rounded-3xl border border-white/10 p-5">
              <h2 className="font-heading text-xl font-bold">Course Catalog</h2>
              <div className="mt-4 space-y-3">
                {isLoading ? (
                  <div className="text-sm text-white/45 py-6">Loading courses...</div>
                ) : courses.length === 0 ? (
                  <div className="text-sm text-white/45 py-6">No courses found.</div>
                ) : (
                  courses.map((course) => (
                    <div key={course.id} className="rounded-2xl bg-white/[0.03] border border-white/10 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-white">{course.name}</h3>
                          <p className="text-xs text-white/45 mt-1">{course.duration || "Duration not set"}</p>
                        </div>
                        <span className="text-sm font-bold text-emerald-300">
                          ₹{Number(course.fees || 0).toLocaleString("en-IN")}
                        </span>
                      </div>
                      {course.description && (
                        <p className="text-sm text-white/55 mt-3 leading-relaxed">{course.description}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="glass-premium rounded-3xl border border-white/10 p-5">
              <h2 className="font-heading text-xl font-bold">Recent Conversations</h2>
              <div className="mt-4 space-y-3 max-h-[360px] overflow-auto custom-scrollbar pr-1">
                {recentStudents.flatMap((student) =>
                  student.messages.slice(-1).map((message) => ({ student, message }))
                ).slice(0, 8).map(({ student, message }) => (
                  <div key={message.id} className="rounded-2xl bg-white/[0.03] border border-white/10 p-4">
                    <div className="flex justify-between gap-3 text-xs text-white/40">
                      <span>{student.name || student.phone}</span>
                      <span>{formatDate(message.timestamp)}</span>
                    </div>
                    <p className="text-sm text-white/75 mt-2 line-clamp-3">{message.content}</p>
                  </div>
                ))}
                {!isLoading && students.every((student) => student.messages.length === 0) && (
                  <div className="text-sm text-white/45 py-6">No conversation messages found.</div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── Student Conversation Drawer ── */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            onClick={() => setSelectedStudent(null)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer panel */}
          <div className="absolute top-0 right-0 h-full w-full max-w-md glass-premium border-l border-white/10 shadow-2xl flex flex-col animate-slide-in-right">
            {/* Header */}
            <div className="px-6 py-5 border-b border-white/10 flex items-start justify-between shrink-0">
              <div>
                <h3 className="font-heading text-lg font-bold text-white">
                  {selectedStudent.name || "Unnamed lead"}
                </h3>
                <p className="text-xs text-white/50 mt-1 font-mono">{selectedStudent.phone}</p>
                <span
                  className={`inline-block mt-2 px-2.5 py-1 rounded-full border text-xs font-bold ${
                    statusStyle[selectedStudent.leadStatus] || statusStyle.COLD
                  }`}
                >
                  {selectedStudent.leadStatus || selectedStudent.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3 custom-scrollbar">
              {sortedMessages.length === 0 ? (
                <div className="text-sm text-white/40 text-center py-12">
                  No messages in this conversation yet.
                </div>
              ) : (
                sortedMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-emerald-600/20 border border-emerald-500/20 text-white rounded-br-md"
                          : "bg-white/[0.06] border border-white/10 text-white/85 rounded-bl-md"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                      <p
                        className={`text-[10px] mt-1.5 ${
                          msg.role === "user" ? "text-emerald-300/50 text-right" : "text-white/30"
                        }`}
                      >
                        {formatDate(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Inline keyframes for drawer slide-in animation */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.25s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
