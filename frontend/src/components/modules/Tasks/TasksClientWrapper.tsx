"use client";

import { useState, useMemo } from "react";
import { ListTodo, Flag, LayoutDashboard, ArrowUpRight, Search, Filter } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { getImageUrl } from "@/lib/utils";

export function TasksClientWrapper({ initialTasks }: { initialTasks: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBoard, setSelectedBoard] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Extract unique boards and statuses
  const { boards, statuses } = useMemo(() => {
    const bMap = new Map();
    const sSet = new Set<string>();

    initialTasks.forEach(task => {
      if (task.column?.board) {
        bMap.set(task.column.board.id, task.column.board.title);
      }
      if (task.column?.title) {
        sSet.add(task.column.title);
      }
    });

    return {
      boards: Array.from(bMap.entries()).map(([id, title]) => ({ id, title })),
      statuses: Array.from(sSet)
    };
  }, [initialTasks]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return initialTasks.filter(task => {
      // 1. Filter by Board
      if (selectedBoard !== "all" && task.column?.board?.id !== selectedBoard) return false;
      
      // 2. Filter by Status (Column Title)
      if (selectedStatus !== "all" && task.column?.title !== selectedStatus) return false;
      
      // 3. Filter by Search Query (title or description)
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const titleMatch = task.title?.toLowerCase().includes(q);
        const descMatch = task.description?.toLowerCase().includes(q);
        if (!titleMatch && !descMatch) return false;
      }
      
      return true;
    });
  }, [initialTasks, searchQuery, selectedBoard, selectedStatus]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH": return "bg-red-50 text-red-600 border-red-200";
      case "MEDIUM": return "bg-amber-50 text-amber-600 border-amber-200";
      case "LOW": return "bg-green-50 text-green-600 border-green-200";
      default: return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Filters Bar */}
      <div className="flex-none px-6 py-4 md:px-8 bg-slate-50 border-b border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 shadow-sm shrink-0">
            <LayoutDashboard className="w-4 h-4 text-slate-400" />
            <select
              value={selectedBoard}
              onChange={(e) => setSelectedBoard(e.target.value)}
              className="bg-transparent text-sm text-slate-700 focus:outline-none cursor-pointer font-medium"
            >
              <option value="all">All Boards</option>
              {boards.map(b => (
                <option key={b.id} value={b.id}>{b.title}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 shadow-sm shrink-0">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-sm text-slate-700 focus:outline-none cursor-pointer font-medium"
            >
              <option value="all">All Statuses</option>
              {statuses.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Task List Content */}
      <div className="flex-1 overflow-auto p-6 md:p-8 bg-slate-50/50">
        <div className="max-w-5xl mx-auto space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-center bg-slate-50/70 backdrop-blur-sm rounded-3xl border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl flex items-center justify-center mb-5 shadow-sm">
                <ListTodo className="w-9 h-9 text-indigo-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {initialTasks.length === 0 ? "No tasks assigned" : "No tasks match your filters"}
              </h3>
              <p className="text-slate-500 max-w-sm text-[15px] leading-relaxed">
                {initialTasks.length === 0 
                  ? "You're all caught up! When you're assigned to tasks on a board, they will appear here."
                  : "Try clearing your search or adjusting your filters to see more tasks."}
              </p>
            </div>
          ) : (
            filteredTasks.map((task: any, index: number) => {
              const themes = [
                { border: "hover:border-amber-300", shadow: "hover:shadow-amber-100/50", badgeBg: "bg-amber-50", badgeText: "text-amber-700", badgeBorder: "border-amber-200", colBg: "bg-amber-100", colText: "text-amber-800", lineBg: "bg-amber-400" },
                { border: "hover:border-emerald-300", shadow: "hover:shadow-emerald-100/50", badgeBg: "bg-emerald-50", badgeText: "text-emerald-700", badgeBorder: "border-emerald-200", colBg: "bg-emerald-100", colText: "text-emerald-800", lineBg: "bg-emerald-400" },
                { border: "hover:border-sky-300", shadow: "hover:shadow-sky-100/50", badgeBg: "bg-sky-50", badgeText: "text-sky-700", badgeBorder: "border-sky-200", colBg: "bg-sky-100", colText: "text-sky-800", lineBg: "bg-sky-400" },
                { border: "hover:border-violet-300", shadow: "hover:shadow-violet-100/50", badgeBg: "bg-violet-50", badgeText: "text-violet-700", badgeBorder: "border-violet-200", colBg: "bg-violet-100", colText: "text-violet-800", lineBg: "bg-violet-400" },
                { border: "hover:border-rose-300", shadow: "hover:shadow-rose-100/50", badgeBg: "bg-rose-50", badgeText: "text-rose-700", badgeBorder: "border-rose-200", colBg: "bg-rose-100", colText: "text-rose-800", lineBg: "bg-rose-400" },
              ];
              const theme = themes[index % themes.length];
              
              return (
                <div 
                  key={task.id} 
                  className={`group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg ${theme.shadow} ${theme.border} hover:-translate-y-0.5 transition-all duration-300 overflow-hidden`}
                >
                  <div className={`absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full ${theme.lineBg} opacity-60`} />
                  
                  <div className="flex-1 min-w-0 pl-3">
                    <div className="flex items-center gap-2.5 mb-2.5 flex-wrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold ${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder} shadow-sm`}>
                        <LayoutDashboard className="w-3 h-3" />
                        {task.column.board.title}
                      </span>
                      <span className="text-slate-300 text-xs">•</span>
                      <span className={`text-[11px] font-bold uppercase tracking-wider ${theme.colBg} ${theme.colText} px-2.5 py-1 rounded-lg`}>
                        {task.column.title}
                      </span>
                    </div>
                    <h3 className="text-[15px] font-bold text-slate-800 truncate mb-1.5 group-hover:text-indigo-700 transition-colors">
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-[13px] text-slate-500 line-clamp-1 leading-relaxed">
                        {task.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 sm:gap-5 pl-3 sm:pl-0 mt-2 sm:mt-0">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-bold shadow-sm ${getPriorityColor(task.priority)}`}>
                      <Flag className="w-3.5 h-3.5" />
                      {task.priority}
                    </div>

                    <div className="flex -space-x-2">
                      {task.assignees.map((assignee: any, aIdx: number) => {
                        const avatarThemes = [
                          { bg: "bg-indigo-50", text: "text-indigo-700", ring: "ring-indigo-200" },
                          { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200" },
                          { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200" },
                          { bg: "bg-rose-50", text: "text-rose-700", ring: "ring-rose-200" },
                        ];
                        const at = avatarThemes[aIdx % avatarThemes.length];
                        return (
                          <Avatar key={assignee.id} className={`w-8 h-8 border-2 border-slate-50 shadow-sm ring-1 ${at.ring}`}>
                            <AvatarImage src={getImageUrl(assignee.photo) as string} />
                            <AvatarFallback className={`text-[10px] ${at.bg} ${at.text} font-bold`}>
                              {assignee.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        );
                      })}
                    </div>

                    <Link 
                      href={`/dashboard/boards/${task.column.board.id}`}
                      className="flex items-center justify-center gap-1.5 px-4 py-2 text-[12px] font-bold text-slate-600 bg-slate-50 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl transition-all border border-slate-200 hover:border-indigo-200 hover:shadow-sm"
                    >
                      View Board
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
