"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Sidebar } from "./sidebar";
import { usePathname } from "next/navigation";

export function MobileSidebar({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close the sidebar when navigation happens
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

    // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-50 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="absolute right-4 top-3 z-50">
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <Sidebar user={user} />
      </div>
    </>
  );
}
