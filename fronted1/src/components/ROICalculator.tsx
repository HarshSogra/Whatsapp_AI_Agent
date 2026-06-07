import React, { useState } from "react";
import { Calculator, Sparkles, TrendingUp, DollarSign, Award, ArrowUpRight } from "lucide-react";
import { statistics } from "../data";
import { motion } from "motion/react";

export default function ROICalculator() {
  const [monthlyLeads, setMonthlyLeads] = useState<number>(400);
  const [courseFee, setCourseFee] = useState<number>(15000);

  // Math equations
  const baseConversionRate = 0.05; // 5% typical baseline
  const eduAgentConversionRate = 0.07; // 7% with AI automation (40% rise)

  const currentStudentsYearly = Math.round(monthlyLeads * baseConversionRate * 12);
  const newStudentsYearly = Math.round(monthlyLeads * eduAgentConversionRate * 12);
  const studentGrowthYearly = newStudentsYearly - currentStudentsYearly;

  const currentRevenueYearly = currentStudentsYearly * courseFee;
  const newRevenueYearly = newStudentsYearly * courseFee;
  const netRevenueGrowth = newRevenueYearly - currentRevenueYearly;

  return (
    <section id="calculator" className="py-24 px-4 sm:px-6 md:px-8 bg-[#080808] border-t border-b border-white/5 relative">
      {/* Background Soft Lighting Glow */}
      <div className="absolute top-[40%] right-[-10%] w-[400px] h-[400px] bg-white/2 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-15%] w-[450px] h-[450px] bg-white/2 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        
        {/* Core Stats Overlay Row */}
        <div className="glass-premium rounded-[3rem] p-10 md:p-12 border border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center bg-gradient-to-tr from-white/[0.01] to-transparent shadow-2xl">
          {statistics.map((stat, idx) => (
            <div key={stat.id} className="space-y-3">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                className="font-heading text-4xl sm:text-5xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              >
                {stat.value}
              </motion.div>
              <div className="space-y-1">
                <p className="font-sans font-bold text-xs sm:text-sm text-white/90 uppercase tracking-widest leading-none">
                  {stat.label}
                </p>
                {stat.description && (
                  <p className="text-[11px] text-white/40 leading-tight">
                    {stat.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ROI Calculator dual-workspace panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch max-w-6xl mx-auto">
          
          {/* Controls side (5 cols) */}
          <div className="lg:col-span-5 glass-premium p-8 rounded-3xl border border-white/15 flex flex-col justify-between space-y-8 bg-white/[0.01]">
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-white">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-white/50 uppercase">CONVERSION TRACKER</span>
                  <h3 className="font-heading text-lg font-bold text-white">Admissions Growth Estimator</h3>
                </div>
              </div>

              {/* Slider 1: Inbound leads */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-white/85">Monthly Inbound Leads</span>
                  <span className="font-mono text-white px-2 py-0.5 bg-white/5 rounded pl-4 pr-4 border border-white/10">
                    {monthlyLeads.toLocaleString()} Leads
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="5000"
                  step="50"
                  value={monthlyLeads}
                  onChange={(e) => setMonthlyLeads(Number(e.target.value))}
                  className="w-full accent-white h-1.5 bg-white/10 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-white/45 font-mono">
                  <span>50</span>
                  <span>5,000</span>
                </div>
              </div>

              {/* Slider 2: Average Course Fee */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-white/85">Avg. Program Tuition Fee</span>
                  <span className="font-mono text-white px-2 py-0.5 bg-white/5 rounded pl-4 pr-4 border border-white/10">
                    ₹{courseFee.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="2500"
                  value={courseFee}
                  onChange={(e) => setCourseFee(Number(e.target.value))}
                  className="w-full accent-white h-1.5 bg-white/10 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-white/45 font-mono">
                  <span>₹5,000</span>
                  <span>₹100,000</span>
                </div>
              </div>
            </div>

            {/* Note indicator */}
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-xs text-white/50 leading-relaxed font-sans">
              *Calculated using conservative baseline estimates: Standard admission intake mapped at <b className="text-white">5%</b>. EduAgent AI integration maps conversions at <b className="text-white">7%</b> (representing a verified <b className="text-white">40%</b> average net conversion uplift).
            </div>
          </div>

          {/* Outputs side (7 cols) */}
          <div className="lg:col-span-7 glass-premium p-8 sm:p-10 rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.02] to-transparent flex flex-col justify-between">
            <div className="space-y-8">
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <h4 className="font-heading text-sm font-bold text-white/50 uppercase tracking-widest pl-1">
                  Expected Annual Increments
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-green-400 font-mono">
                  <TrendingUp className="w-4 h-4" />
                  <span>Growth Tracked</span>
                </div>
              </div>

              {/* Metrics side-by-side grids */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Metric 1 */}
                <div className="space-y-2 p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <div className="flex items-center gap-2 text-xs text-white/45">
                    <Award className="w-4 h-4 text-white/70" />
                    <span className="font-sans font-medium uppercase tracking-wider">Extra Enrollments</span>
                  </div>
                  <div className="font-heading text-3xl sm:text-4xl font-black text-white">
                    +{studentGrowthYearly} <span className="text-lg font-normal text-white/50">Students</span>
                  </div>
                  <p className="text-xs text-white/45">
                    Additional student intake secured every calendar year.
                  </p>
                </div>

                {/* Metric 2 */}
                <div className="space-y-2 p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <div className="flex items-center gap-2 text-xs text-white/45">
                    <DollarSign className="w-4 h-4 text-white/70" />
                    <span className="font-sans font-medium uppercase tracking-wider">Additional Income</span>
                  </div>
                  <div className="font-heading text-3xl sm:text-4xl font-black text-green-400">
                    ₹{netRevenueGrowth.toLocaleString()}
                  </div>
                  <p className="text-xs text-white/45">
                    Incremental brand tuition revenue gained yearly.
                  </p>
                </div>
              </div>

              {/* Projections block */}
              <div className="border border-white/10 rounded-2xl bg-black/50 p-6 space-y-4">
                <h5 className="font-heading text-xs font-bold text-white/80 uppercase">Inflow Projections:</h5>
                <div className="flex justify-between items-center text-xs sm:text-sm font-sans">
                  <span className="text-white/50">Standard Enrollment (5% Rate):</span>
                  <span className="font-medium text-white font-mono">{currentStudentsYearly} students / yr ({((currentRevenueYearly) / 100000).toFixed(1)}L INR)</span>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm font-sans border-t border-white/5 pt-3">
                  <span className="text-green-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    EduAgent Intake (7% Rate):
                  </span>
                  <span className="font-semibold text-green-400 font-mono">{newStudentsYearly} students / yr ({((newRevenueYearly) / 100000).toFixed(1)}L INR)</span>
                </div>
              </div>
            </div>

            {/* Bottom active block CTA */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-6 border-t border-white/5 mt-8">
              <span className="text-xs text-white/45">Convert inquiries automatically. Plug leaks 24/7.</span>
              <a 
                href="#demo"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-white/10 hover:border-white/30 text-white font-semibold text-xs text-center flex items-center justify-center gap-2 hover:bg-white/[0.02] transition-colors"
              >
                <span>Trigger Live Console Demo</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
