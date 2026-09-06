import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ListTodo, Flag, LayoutDashboard, ArrowUpRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { getImageUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getMyTasks() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  
  if (!token) redirect("/login");

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:6001/api/v1";
  
  const res = await fetch(`${baseUrl}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 401) redirect("/login");
    throw new Error("Failed to fetch tasks");
  }

  const json = await res.json();
  return json.data || [];
}

export default async function MyTasksPage() {
  const tasks = await getMyTasks();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH": return "bg-red-50 text-red-600 border-red-200";
      case "MEDIUM": return "bg-amber-50 text-amber-600 border-amber-200";
      case "LOW": return "bg-green-50 text-green-600 border-green-200";
      default: return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Page Header */}
      <div className="flex-none px-6 py-5 md:px-8 md:py-6 bg-slate-50/80 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3.5 mb-2">
          <div className="p-2.5 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-xl shadow-sm">
            <ListTodo className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Tasks</h1>
            <p className="text-[13px] text-slate-500 font-medium mt-0.5">View and manage all tasks assigned to you across all projects.</p>
          </div>
        </div>
      </div>

      {/* Task List Content */}
      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div className="max-w-5xl mx-auto space-y-3">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-center bg-slate-50/70 backdrop-blur-sm rounded-3xl border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl flex items-center justify-center mb-5 shadow-sm">
                <ListTodo className="w-9 h-9 text-indigo-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No tasks assigned</h3>
              <p className="text-slate-500 max-w-sm text-[15px] leading-relaxed">You're all caught up! When you're assigned to tasks on a board, they will appear here.</p>
            </div>
          ) : (
            tasks.map((task: any, index: number) => {
              // Cycle through pastel accent themes per task card
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
                  {/* Subtle left accent line */}
                  <div className={`absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full ${theme.lineBg} opacity-60`} />
                  
                  {/* Left side: Info */}
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

                  {/* Right side: Meta & Actions */}
                  <div className="flex items-center gap-4 sm:gap-5 pl-3 sm:pl-0">
                    {/* Priority */}
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-bold shadow-sm ${getPriorityColor(task.priority)}`}>
                      <Flag className="w-3.5 h-3.5" />
                      {task.priority}
                    </div>

                    {/* Assignees */}
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
                          <Avatar key={assignee.id} className={`w-8 h-8 border-2 border-white shadow-sm ring-1 ${at.ring}`}>
                            <AvatarImage src={getImageUrl(assignee.photo) as string} />
                            <AvatarFallback className={`text-[10px] ${at.bg} ${at.text} font-bold`}>
                              {assignee.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        );
                      })}
                    </div>

                    {/* Jump Link */}
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
