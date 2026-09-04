"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { KanbanArt } from "./kanban-art";
import { motion } from "framer-motion";

interface AuthCardProps {
  title: string;
  type: "login" | "register";
  children: ReactNode;
}

export function AuthCard({ title, type, children }: AuthCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-[#F1F5F9] relative overflow-hidden">
      
      {/* Animated Soft background blobs */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-200/40 rounded-full blur-[120px] pointer-events-none"
      ></motion.div>
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200/40 rounded-full blur-[100px] pointer-events-none"
      ></motion.div>

      {/* The Main Card Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
        className="w-full max-w-[1000px] min-h-[600px] bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-900/5 flex overflow-hidden relative z-10 border border-white"
      >
        
        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 p-10 sm:p-14 lg:p-20 flex flex-col justify-center relative z-20 bg-white/80 backdrop-blur-xl">
          <div className="w-full max-w-[340px] mx-auto">
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex items-center gap-2 mb-12"
            >
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md group-hover:shadow-indigo-500/25 transition-all">
                  <div className="w-3.5 h-3.5 rounded-sm bg-white"></div>
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-800 group-hover:text-indigo-600 transition-colors">
                  ZenBoard
                </span>
              </Link>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="text-3xl font-bold text-slate-900 mb-8"
            >
              {title}
            </motion.h1>
            
            {children}

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 text-center"
            >
              {type === "login" ? (
                <p className="text-sm text-slate-500 font-medium">
                  Don't have an account?{" "}
                  <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                    Sign up
                  </Link>
                </p>
              ) : (
                <p className="text-sm text-slate-500 font-medium">
                  Already have an account?{" "}
                  <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                    Log in
                  </Link>
                </p>
              )}
            </motion.div>

          </div>
        </div>

        {/* Right Side: Artistic Paper-cut / Kanban Graphic */}
        <div className="hidden md:flex w-1/2 relative bg-[#F8F9FA] items-center justify-center overflow-hidden border-l border-slate-100">
          <KanbanArt />
        </div>
        
      </motion.div>
    </div>
  );
}
