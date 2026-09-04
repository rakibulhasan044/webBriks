"use client";

import { motion } from "framer-motion";
import { Layers, Zap, Users, LayoutDashboard, Shield, Smartphone } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      title: "Real-time Synchronization",
      description: "Every move instantly appears on your team's screens. No refresh required.",
      icon: <Zap className="w-6 h-6 text-indigo-600" />,
      bg: "bg-indigo-50",
      border: "border-indigo-100",
    },
    {
      title: "Kanban Workflows",
      description: "Organize tasks into customizable columns. Drag, drop, and manage your pipeline easily.",
      icon: <LayoutDashboard className="w-6 h-6 text-emerald-600" />,
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
    {
      title: "Live Multiplayer",
      description: "See exactly who is working on what with live presence indicators and cursors.",
      icon: <Users className="w-6 h-6 text-purple-600" />,
      bg: "bg-purple-50",
      border: "border-purple-100",
    },
    {
      title: "Nested Subtasks",
      description: "Break down mammoth projects into actionable items. Track progress instantly.",
      icon: <Layers className="w-6 h-6 text-pink-600" />,
      bg: "bg-pink-50",
      border: "border-pink-100",
    },
    {
      title: "Bank-grade Security",
      description: "Your data is encrypted at rest and in transit with role-based access control.",
      icon: <Shield className="w-6 h-6 text-amber-600" />,
      bg: "bg-amber-50",
      border: "border-amber-100",
    },
    {
      title: "Access Anywhere",
      description: "Responsive design ensures you can manage your team from desktop, tablet, or mobile.",
      icon: <Smartphone className="w-6 h-6 text-cyan-600" />,
      bg: "bg-cyan-50",
      border: "border-cyan-100",
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-50/50 rounded-full blur-3xl -z-10"></div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-sm font-medium text-emerald-600 mb-6 shadow-sm">
            Everything you need
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Ship faster, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-indigo-500">stress less.</span></h2>
          <p className="mt-6 text-lg text-slate-600 leading-relaxed">
            ZenBoard is packed with features designed specifically to remove friction from your daily workflows and boost team alignment.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="p-8 rounded-[2rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/40 relative overflow-hidden group"
            >
              <div className={`w-14 h-14 rounded-2xl ${feature.bg} ${feature.border} border flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
