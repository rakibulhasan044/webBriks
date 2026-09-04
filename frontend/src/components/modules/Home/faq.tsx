"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export function FaqSection() {
  const faqs = [
    { q: "Is ZenBoard entirely free?", a: "We offer a generous free tier that covers most small teams. Advanced features require a premium subscription which you can upgrade to at any time." },
    { q: "How real-time is the sync?", a: "Near-instantaneous. We use persistent WebSocket connections so changes appear on your screen the millisecond they happen, without you ever having to refresh the page." },
    { q: "Can I self-host ZenBoard?", a: "Yes! ZenBoard is built with NestJS and Next.js. You can deploy it completely on your own infrastructure using Docker and our provided compose files." },
    { q: "What databases are supported?", a: "ZenBoard officially supports PostgreSQL via Prisma ORM for robust relational data integrity and highly optimized fractional indexing queries." },
  ];

  return (
    <section className="py-28 bg-white relative">
      <div className="mx-auto max-w-3xl px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-4">Questions? We got you.</h2>
          <p className="text-lg text-slate-500">Everything you need to know about the product and billing.</p>
        </motion.div>
        
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <FaqItem key={i} faq={faq} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqItem({ faq, index }: { faq: any, index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1 }}
      className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50"
    >
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full text-left p-6 flex justify-between items-center focus:outline-none"
      >
        <h3 className="text-lg font-bold text-slate-800">{faq.q}</h3>
        <div className={`w-8 h-8 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </div>
      </button>
      <motion.div 
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t border-slate-100 mt-2">
          {faq.a}
        </div>
      </motion.div>
    </motion.div>
  );
}
