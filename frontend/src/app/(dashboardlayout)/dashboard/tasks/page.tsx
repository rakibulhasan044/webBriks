import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ListTodo, Flag, LayoutDashboard } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { getImageUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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
      <div className="flex-none p-6 md:p-8 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <ListTodo className="w-6 h-6 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Tasks</h1>
        </div>
        <p className="text-slate-500">View and manage all tasks assigned to you across all projects.</p>
      </div>

      {/* Task List Content */}
      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div className="max-w-5xl mx-auto space-y-4">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-slate-200 border-dashed">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <ListTodo className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-1">No tasks assigned</h3>
              <p className="text-slate-500 max-w-sm">You're all caught up! When you're assigned to tasks on a board, they will appear here.</p>
            </div>
          ) : (
            tasks.map((task: any) => (
              <div 
                key={task.id} 
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all"
              >
                {/* Left side: Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className="bg-slate-50 text-slate-600 flex items-center gap-1.5 px-2 py-0.5">
                      <LayoutDashboard className="w-3 h-3" />
                      {task.column.board.title}
                    </Badge>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md">
                      {task.column.title}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 truncate mb-1">
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-sm text-slate-500 line-clamp-1">
                      {task.description}
                    </p>
                  )}
                </div>

                {/* Right side: Meta & Actions */}
                <div className="flex items-center gap-4 sm:gap-6">
                  {/* Priority */}
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    <Flag className="w-3.5 h-3.5" />
                    {task.priority}
                  </div>

                  {/* Assignees */}
                  <div className="flex -space-x-2">
                    {task.assignees.map((assignee: any) => (
                      <Avatar key={assignee.id} className="w-8 h-8 border-2 border-white">
                        <AvatarImage src={getImageUrl(assignee.photo) as string} />
                        <AvatarFallback className="text-[10px] bg-indigo-100 text-indigo-700">
                          {assignee.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>

                  {/* Jump Link */}
                  <Link 
                    href={`/dashboard/boards/${task.column.board.id}`}
                    className="flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-600 bg-slate-50 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-slate-200 hover:border-indigo-200"
                  >
                    View Board
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
