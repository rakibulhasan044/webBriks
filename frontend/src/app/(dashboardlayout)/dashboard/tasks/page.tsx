import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ListTodo,
  CheckCircle2,
  CircleDashed,
  Clock,
  Activity,
} from "lucide-react";
import { TasksClientWrapper } from "@/components/modules/Tasks/TasksClientWrapper";

export const dynamic = "force-dynamic";

async function getMyTasks() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) redirect("/login");

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:6001/api/v1";

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

  // Aggregate tasks by status
  const statusCounts = tasks.reduce((acc: any, task: any) => {
    const status = task.column?.title || "Unknown";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Get top 4 statuses by count
  const topStatuses = Object.entries(statusCounts)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 4);

  // Define 4 color themes
  const statThemes = [
    {
      bg: "bg-sky-50",
      text: "text-sky-700",
      ring: "ring-sky-200",
      iconText: "text-sky-500",
      Icon: CircleDashed,
    },
    {
      bg: "bg-amber-50",
      text: "text-amber-700",
      ring: "ring-amber-200",
      iconText: "text-amber-500",
      Icon: Clock,
    },
    {
      bg: "bg-violet-50",
      text: "text-violet-700",
      ring: "ring-violet-200",
      iconText: "text-violet-500",
      Icon: Activity,
    },
    {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      ring: "ring-emerald-200",
      iconText: "text-emerald-500",
      Icon: CheckCircle2,
    },
  ];

  const totalTasks = tasks.length;

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* ─── Improved Page Header ─── */}
      <div className="flex-none bg-slate-50 border-b border-slate-200/80">
        <div className="px-6 py-6 md:px-8 md:py-7">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            {/* Left: Title & Desc */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-indigo-400 to-violet-700 rounded-xl shadow-lg shadow-indigo-200 shrink-0 mt-0.5">
                <ListTodo className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    My Tasks
                  </h1>
                  {totalTasks > 0 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                      {totalTasks}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-md">
                  View and manage all tasks assigned to you across all projects.
                </p>
              </div>
            </div>

            {/* Right: Stats */}
            {topStatuses.length > 0 && (
              <div className="flex items-center gap-2.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
                {topStatuses.map(([statusName, count], idx) => {
                  const theme = statThemes[idx % statThemes.length];
                  const Icon = theme.Icon;

                  const sLower = (statusName as string).toLowerCase();
                  let FinalIcon = Icon;
                  if (sLower.includes("done") || sLower.includes("complete"))
                    FinalIcon = CheckCircle2;
                  else if (
                    sLower.includes("progress") ||
                    sLower.includes("doing")
                  )
                    FinalIcon = Activity;
                  else if (sLower.includes("review")) FinalIcon = Clock;
                  else if (sLower.includes("todo") || sLower.includes("to do"))
                    FinalIcon = CircleDashed;

                  return (
                    <div
                      key={statusName as string}
                      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl ${theme.bg} ring-1 ${theme.ring} shadow-sm shrink-0`}
                    >
                      <div
                        className={`p-1.5 rounded-lg bg-slate-50/80 ${theme.iconText} shadow-sm`}
                      >
                        <FinalIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider leading-none truncate">
                          {statusName as string}
                        </span>
                        <span className={`text-sm font-extrabold leading-none mt-1 ${theme.text}`}>
                          {count as number}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <TasksClientWrapper initialTasks={tasks} />
      </div>
    </div>
  );
}