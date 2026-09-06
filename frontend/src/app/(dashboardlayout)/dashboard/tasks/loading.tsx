import { ListTodo } from "lucide-react";

export default function TasksLoading() {
  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Page Header Skeleton */}
      <div className="flex-none px-6 py-5 md:px-8 md:py-6 bg-slate-50/80 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left: Title & Desc */}
          <div className="flex items-center gap-3.5 mb-2 md:mb-0">
            <div className="p-2.5 bg-slate-100 rounded-xl shadow-sm animate-pulse">
              <ListTodo className="w-6 h-6 text-slate-300" />
            </div>
            <div className="space-y-2">
              <div className="h-7 w-32 bg-slate-200 rounded-lg animate-pulse" />
              <div className="h-4 w-64 bg-slate-200 rounded-lg animate-pulse hidden sm:block" />
            </div>
          </div>

          {/* Right: Stats */}
          <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 shadow-sm shrink-0">
                <div className="h-8 w-8 bg-slate-100 rounded-lg animate-pulse" />
                <div className="flex flex-col gap-1.5">
                  <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
                  <div className="h-4 w-8 bg-slate-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="flex flex-col h-full">
          
          {/* Filters Bar Skeleton */}
          <div className="flex-none px-6 py-4 md:px-8 bg-slate-50 border-b border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-96 h-10 bg-slate-50 border border-slate-200 rounded-xl animate-pulse shadow-sm" />
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="h-10 w-32 bg-slate-50 border border-slate-200 rounded-xl animate-pulse shadow-sm" />
              <div className="h-10 w-32 bg-slate-50 border border-slate-200 rounded-xl animate-pulse shadow-sm" />
            </div>
          </div>

          {/* ITask List Content Skeleton */}
          <div className="flex-1 overflow-auto p-6 md:p-8 bg-slate-50/50">
            <div className="max-w-5xl mx-auto space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i} 
                  className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] overflow-hidden"
                >
                  <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full bg-slate-200 animate-pulse" />
                  
                  <div className="flex-1 min-w-0 pl-3">
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <div className="h-5 w-24 bg-slate-100 rounded-lg animate-pulse" />
                      <div className="h-5 w-20 bg-slate-100 rounded-lg animate-pulse" />
                    </div>
                    <div className="h-5 w-48 bg-slate-200 rounded-lg animate-pulse mb-2" />
                    <div className="h-4 w-72 bg-slate-100 rounded-lg animate-pulse hidden sm:block" />
                  </div>

                  <div className="flex flex-wrap items-center gap-4 sm:gap-5 pl-3 sm:pl-0 mt-2 sm:mt-0">
                    <div className="h-7 w-16 bg-slate-100 rounded-lg animate-pulse" />
                    <div className="flex -space-x-2">
                      <div className="h-8 w-8 rounded-full bg-slate-200 border-2 border-white animate-pulse" />
                      <div className="h-8 w-8 rounded-full bg-slate-200 border-2 border-white animate-pulse" />
                    </div>
                    <div className="h-9 w-28 bg-slate-100 rounded-xl animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
