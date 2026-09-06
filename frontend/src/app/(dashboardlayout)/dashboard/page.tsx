import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { httpClient } from "@/lib/axios/httpClient";
import {
  LayoutDashboard,
  CheckSquare,
  Clock,
  ArrowRight,
  KanbanSquare,
  Activity,
  Flame,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImageUrl } from "@/lib/utils";
import Image from "next/image";

export const dynamic = "force-dynamic";

async function fetchDashboardData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const userStr = cookieStore.get("currentUser")?.value;

  if (!token) redirect("/login");

  let user = null;
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch (e) {}
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:6001/api/v1";

  // Fetch boards and tasks in parallel
  const [boardsRes, tasksRes] = await Promise.all([
    fetch(`${baseUrl}/boards`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }),
    fetch(`${baseUrl}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }),
  ]);

  if (boardsRes.status === 401 || tasksRes.status === 401) {
    redirect("/login");
  }

  const boardsJson = await boardsRes.json();
  const tasksJson = await tasksRes.json();

  return {
    user,
    boards: boardsJson.data || [],
    tasks: tasksJson.data || [],
  };
}

export default async function DashboardPage() {
  const { user, boards, tasks } = await fetchDashboardData();

  // Calculate some stats
  const totalBoards = boards.length;
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter((t: any) => {
    const colLower = t.column?.title?.toLowerCase() || "";
    return colLower.includes("done") || colLower.includes("complete");
  }).length;

  const highPriorityTasks = tasks.filter(
    (t: any) => t.priority === "HIGH",
  ).length;
  const inProgressTasks = totalTasks - completedTasks;

  // Get recent 3 boards
  const recentBoards = [...boards]
    .sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 3);

  // Get recent 5 pending tasks
  const pendingTasks = tasks
    .filter((t: any) => {
      const colLower = t.column?.title?.toLowerCase() || "";
      return !colLower.includes("done") && !colLower.includes("complete");
    })
    .sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
            Dashboard
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Welcome back, {user?.name?.split(" ")[0] || "User"}
          </h1>
          <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-md">
            Here&apos;s what&lsquo;s happening in your workspaces today.
          </p>
        </div>
        <Link
          href="/dashboard/boards"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-linear-to-br from-primary to-indigo-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-slate-900/20 hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/25 hover:-translate-y-0.5 transition-all duration-300 w-full md:w-auto"
        >
          <KanbanSquare className="w-4 h-4" />
          View All Boards
        </Link>
      </div>

      {/* ─── Stats Grid ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            label: "Total Boards",
            value: totalBoards,
            icon: LayoutDashboard,
            color: "indigo",
            border: "border-indigo-200",
            bg: "bg-indigo-50",
            text: "text-indigo-600",
          },
          {
            label: "Active Tasks",
            value: inProgressTasks,
            icon: Activity,
            color: "sky",
            border: "border-sky-200",
            bg: "bg-sky-50",
            text: "text-sky-600",
          },
          {
            label: "Completed",
            value: completedTasks,
            icon: CheckSquare,
            color: "emerald",
            border: "border-emerald-200",
            bg: "bg-emerald-50",
            text: "text-emerald-600",
          },
          {
            label: "High Priority",
            value: highPriorityTasks,
            icon: Flame,
            color: "rose",
            border: "border-rose-200",
            bg: "bg-rose-50",
            text: "text-rose-600",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="relative bg-slate-50 p-6 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] flex items-start justify-between group hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.08)] hover:border-slate-300/80 hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="relative z-10">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                {stat.label}
              </p>
              <p className="text-3xl font-black text-slate-900 tracking-tight">
                {stat.value}
              </p>
            </div>
            <div
              className={`relative z-10 p-3 ${stat.bg} ${stat.text} rounded-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
            >
              <stat.icon className="w-5 h-5" />
            </div>
            {/* Subtle gradient overlay on hover */}
            <div
              className={`absolute inset-0 rounded-2xl bg-linear-to-br from-${stat.color}-50/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pt-2">
        {/* ─── Recent Pending Tasks ─── */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-slate-100 rounded-lg">
                <Clock className="w-4 h-4 text-slate-500" />
              </div>
              <h2 className="text-base font-extrabold text-slate-900">
                Recent Pending Tasks
              </h2>
            </div>
            <Link
              href="/dashboard/tasks"
              className="text-[13px] font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1 group transition-colors"
            >
              View all{" "}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] overflow-hidden">
            {pendingTasks.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-14 h-14 bg-linear-to-br from-emerald-50 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <CheckSquare className="w-7 h-7 text-emerald-500" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">
                  No pending tasks!
                </h3>
                <p className="text-sm text-slate-400 mt-1.5 font-medium">
                  You&apos;re all caught up on your assigned work.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100/80">
                {pendingTasks.map((task: any, idx: number) => (
                  <Link
                    key={task.id}
                    href={`/dashboard/boards/${task.column.board.id}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-slate-50/80 transition-colors group relative"
                  >
                    {/* Left accent bar on hover */}
                    <div className="absolute left-0 top-4 bottom-4 w-0.75 rounded-r-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                    <div className="flex-1 min-w-0 pl-0 group-hover:pl-1 transition-all duration-200">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100/80 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <LayoutDashboard className="w-3 h-3" />
                          {task.column.board.title}
                        </span>
                      </div>
                      <h4 className="text-[15px] font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-xs text-slate-400 truncate mt-1 font-medium">
                          {task.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`text-[10px] font-bold px-2 py-1 rounded-md border ${
                          task.priority === "HIGH"
                            ? "bg-rose-50 text-rose-700 border-rose-200/60"
                            : task.priority === "MEDIUM"
                              ? "bg-amber-50 text-amber-700 border-amber-200/60"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                        }`}
                      >
                        {task.priority}
                      </span>
                      <div className="flex -space-x-2">
                        {task.assignees.slice(0, 3).map((a: any) => (
                          <Avatar
                            key={a.id}
                            className="w-7 h-7 border-[2.5px] border-white shadow-sm"
                          >
                            <AvatarImage src={getImageUrl(a.photo) as string} />
                            <AvatarFallback className="text-[9px] bg-slate-100 text-slate-600 font-bold">
                              {a.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ─── Recent Boards ─── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-slate-100 rounded-lg">
              <KanbanSquare className="w-4 h-4 text-slate-500" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900">
              Recent Boards
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {recentBoards.length === 0 ? (
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] text-center">
                <p className="text-sm text-slate-400 font-medium mb-4">
                  You haven&apos;t joined any boards yet.
                </p>
                <Link
                  href="/dashboard/boards"
                  className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Create your first board &rarr;
                </Link>
              </div>
            ) : (
              recentBoards.map((board: any) => (
                <Link
                  key={board.id}
                  href={`/dashboard/boards/${board.id}`}
                  className="group block bg-slate-50 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] overflow-hidden hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.1)] hover:border-indigo-200/80 hover:-translate-y-0.5 transition-all duration-300"
                >
                  {/* <div className="h-28 relative overflow-hidden">
                    {board.coverImage ? (
                      <img
                        src={getImageUrl(board.coverImage) as string}
                        alt={board.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />
                    <div className="absolute bottom-3.5 left-4 right-4">
                      <h3 className="text-white font-bold text-[15px] truncate drop-shadow-md">
                        {board.title}
                      </h3>
                    </div>
                  </div> */}

                  <div className="h-28 relative overflow-hidden">
                    {board.coverImage ? (
                      <Image
                        src={getImageUrl(board.coverImage) as string}
                        alt={board.title}
                        fill
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-slate-100 to-slate-200" />
                    )}

                    <div className="absolute inset-0 bg-linear-to-t from-slate-900/70 via-slate-900/20 to-transparent" />

                    <div className="absolute bottom-3.5 left-4 right-4">
                      <h3 className="text-white font-bold text-[15px] truncate drop-shadow-md">
                        {board.title}
                      </h3>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                      <Users className="w-3.5 h-3.5" />
                      {board.members.length} Members
                    </div>
                    <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 transition-all duration-300 group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
