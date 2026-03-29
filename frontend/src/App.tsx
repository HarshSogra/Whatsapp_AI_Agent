import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { MessageSquare, Users, BookOpen, Settings, LayoutDashboard, LogOut } from 'lucide-react';

const DashboardHome = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Overview</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[ { label: 'Total Leads', val: '1,240' }, { label: 'Demo Bookings', val: '48' }, { label: 'Messages Sent', val: '8,432' }].map((stat) => (
        <div key={stat.label} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center hover:shadow-md transition-shadow">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</p>
          <p className="text-5xl font-black text-indigo-600 mt-3">{stat.val}</p>
        </div>
      ))}
    </div>
    
    <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Recent AI Activity</h2>
      <div className="space-y-4">
        {[
          { student: "Rahul S.", intent: "Fee Inquiry", time: "10 mins ago" },
          { student: "Priya M.", intent: "Course Schedule", time: "1 hour ago" },
          { student: "Amit K.", intent: "Demo Booking", time: "2 hours ago" },
        ].map((act, i) => (
          <div key={i} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
            <div>
              <p className="font-semibold text-gray-800">{act.student}</p>
              <p className="text-sm text-gray-500">Intent: {act.intent}</p>
            </div>
            <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600 font-medium">{act.time}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const CRM = () => (
    <div>
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">Student CRM</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900">Rahul Sharma</td>
              <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">+91 9876543210</td>
              <td className="px-6 py-5 whitespace-nowrap"><span className="px-3 py-1 font-semibold text-xs rounded-full bg-yellow-100 text-yellow-800">WARM</span></td>
            </tr>
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900">Priya Singh</td>
              <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">+91 9123456780</td>
              <td className="px-6 py-5 whitespace-nowrap"><span className="px-3 py-1 font-semibold text-xs rounded-full bg-green-100 text-green-800">BOOKED</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
);

const Sidebar = () => (
  <div className="w-72 bg-indigo-950 text-indigo-100 min-h-screen p-6 flex flex-col font-medium">
    <div className="flex items-center gap-3 mb-12 px-2 mt-2">
      <MessageSquare className="w-10 h-10 text-indigo-400" />
      <span className="text-2xl font-black tracking-tight text-white">EduAgent AI</span>
    </div>
    <nav className="flex-1 space-y-3">
      <Link to="/" className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-indigo-900 hover:text-white transition-all">
        <LayoutDashboard className="w-5 h-5" /> Overview
      </Link>
      <Link to="/crm" className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-indigo-900 hover:text-white transition-all">
        <Users className="w-5 h-5" /> Manage CRM
      </Link>
      <div className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-indigo-900 transition-all opacity-40 cursor-not-allowed">
        <BookOpen className="w-5 h-5" /> Course Catalog
      </div>
      <div className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-indigo-900 transition-all opacity-40 cursor-not-allowed">
        <Settings className="w-5 h-5" /> Institute Settings
      </div>
    </nav>
    <button className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-indigo-900 hover:text-white transition-all text-indigo-300 mt-auto">
      <LogOut className="w-5 h-5" /> Sign Out
    </button>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-50/50 font-sans selection:bg-indigo-100">
        <Sidebar />
        <main className="flex-1 p-12 max-w-7xl">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/crm" element={<CRM />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
