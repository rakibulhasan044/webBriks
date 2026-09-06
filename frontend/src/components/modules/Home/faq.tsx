"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface FAQ {
  q: string;
  a: string;
}

export function FaqSection() {
  const faqs = [
    { q: "Is ZenBoard entirely free?", a: "We offer a generous free tier that covers most small teams. Advanced features require a premium subscription which you can upgrade to at any time." },
    { q: "How real-time is the sync?", a: "Near-instantaneous. We use persistent WebSocket connections so changes appear on your screen the millisecond they happen, without you ever having to refresh the page." },
    { q: "Can I self-host ZenBoard?", a: "Yes! ZenBoard is built with NestJS and Next.js. You can deploy it completely on your own infrastructure using Docker and our provided compose files." },
    { q: "What databases are supported?", a: "ZenBoard officially supports PostgreSQL via Prisma ORM for robust relational data integrity and highly optimized fractional indexing queries." },
  ];

return (
  <section className="py-28 bg-gradient-to-b from-slate-50 to-white">
    <div className="mx-auto max-w-3xl px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold tracking-wide mb-6">
          FAQ
        </span>
        <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-4">
          Questions? We got you.
        </h2>
        <p className="text-lg text-slate-500 max-w-lg mx-auto">
          Everything you need to know about the product and billing.
        </p>
      </motion.div>
      
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <FaqItem key={i} faq={faq} index={i} />
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-slate-500 text-sm">
          Still have questions?{' '}
          <a href="#" className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
            Chat with our team
          </a>
        </p>
      </div>
    </div>
  </section>
);

function FaqItem({ faq, index }: { faq: FAQ, index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ delay: index * 0.1 }}
      className="group rounded-2xl bg-slate-50 border border-slate-200/60 shadow-[0_1px_4px_-1px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.08)] hover:border-slate-300/80 transition-all duration-300 overflow-hidden"
    >
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full text-left p-6 flex justify-between items-center gap-4 focus:outline-none cursor-pointer"
      >
        <h3 className={`text-base font-semibold transition-colors duration-200 ${isOpen ? 'text-indigo-600' : 'text-slate-800 group-hover:text-indigo-600'}`}>
          {faq.q}
        </h3>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen ? 'bg-indigo-50 text-indigo-600 rotate-180' : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
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
        <div className="px-6 pb-6 pt-0 text-slate-600 leading-relaxed">
          <div className={`pt-4 border-t transition-colors duration-200 ${isOpen ? 'border-indigo-100' : 'border-slate-100'}`}>
            {faq.a}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
}
