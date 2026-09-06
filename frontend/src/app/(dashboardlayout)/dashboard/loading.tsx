import { KanbanSquare, Clock } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* Header section Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2 w-full max-w-md">
          <div className="h-9 w-3/4 bg-slate-200 animate-pulse rounded-lg" />
          <div className="h-5 w-full bg-slate-100 animate-pulse rounded-md" />
        </div>
        <div className="h-11 w-full md:w-40 bg-slate-200 animate-pulse rounded-xl" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between">
            <div className="flex flex-col gap-3 w-1/2">
              <div className="h-4 w-full bg-slate-100 animate-pulse rounded" />
              <div className="h-8 w-1/2 bg-slate-200 animate-pulse rounded-lg" />
            </div>
            <div className="h-12 w-12 bg-slate-100 animate-pulse rounded-xl" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8 pt-4">
        
        {/* Main Content: Recent Tasks Skeleton */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" />
              Recent Pending Tasks
            </h2>
            <div className="h-5 w-20 bg-slate-200 animate-pulse rounded-md" />
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4">
                  <div className="flex-1 space-y-2.5">
                    <div className="h-4 w-24 bg-slate-100 animate-pulse rounded" />
                    <div className="h-5 w-3/4 bg-slate-200 animate-pulse rounded" />
                    <div className="h-3 w-1/2 bg-slate-100 animate-pulse rounded" />
                  </div>
                  <div className="flex items-center gap-3 shrink-0 mt-2 sm:mt-0">
                    <div className="h-6 w-16 bg-slate-100 animate-pulse rounded-md" />
                    <div className="flex -space-x-1.5">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="w-7 h-7 bg-slate-200 animate-pulse rounded-full border-2 border-white" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Recent Boards Skeleton */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <KanbanSquare className="w-5 h-5 text-slate-400" />
              Recent Boards
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="h-24 bg-slate-200 animate-pulse" />
                <div className="p-4 flex items-center justify-between">
                  <div className="h-4 w-24 bg-slate-100 animate-pulse rounded" />
                  <div className="h-4 w-4 bg-slate-200 animate-pulse rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
