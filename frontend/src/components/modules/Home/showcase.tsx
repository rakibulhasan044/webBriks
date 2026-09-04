"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export function ShowcaseSection() {
  return (
    <section className="py-28 bg-[#F8F9FA] overflow-hidden relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-sm font-medium text-purple-600 mb-6 shadow-sm">
              Designed for Flow
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-6 leading-tight">
              Drag, drop, and <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">conquer your day</span>
            </h2>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-lg">
              Experience the smoothest Kanban board ever built. Moving tasks feels intuitive, snappy, and deeply satisfying. Focus on the work, not the tool.
            </p>
            
            <ul className="space-y-5">
              {['Fractional indexing for exact positioning', 'Instant optimistic UI updates', 'Keyboard accessible drag operations'].map((item, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + (i * 0.1) }}
                  className="flex items-center gap-4 text-slate-700 font-semibold"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Mini Interactive-looking Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-400 to-pink-400 rounded-[3rem] transform rotate-3 opacity-20 blur-2xl"></div>
            
            <div className="relative bg-white border border-slate-100 shadow-2xl shadow-purple-900/10 rounded-[2.5rem] p-6 transform transition-transform hover:-translate-y-2 duration-500">
              <div className="flex gap-4">
                
                {/* Column */}
                <div className="flex-1 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                    <h4 className="text-sm font-bold text-slate-800">In Progress</h4>
                  </div>
                  <div className="space-y-4">
                    {/* Animated moving card */}
                    <motion.div 
                      animate={{ y: [0, -15, 0], rotate: [0, 2, 0], scale: [1, 1.02, 1] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="bg-white p-5 rounded-xl shadow-lg shadow-orange-900/5 border border-orange-100 z-10 relative cursor-grabbing"
                    >
                      <div className="w-12 h-1.5 bg-orange-400 rounded-full mb-3"></div>
                      <p className="text-[15px] font-bold text-slate-800">Update landing page copy</p>
                    </motion.div>
                    
                    <div className="h-[100px] border-2 border-dashed border-purple-200 bg-purple-50/50 rounded-xl"></div>
                  </div>
                </div>

                {/* Column */}
                <div className="flex-1 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-2 h-2 rounded-full bg-pink-400"></div>
                    <h4 className="text-sm font-bold text-slate-800">Review</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 opacity-70">
                      <div className="w-12 h-1.5 bg-pink-400 rounded-full mb-3"></div>
                      <p className="text-[15px] font-bold text-slate-800">User testing phase 1</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
