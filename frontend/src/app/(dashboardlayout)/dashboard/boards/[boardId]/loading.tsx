import { UserPlus, Filter, Layout, Plus } from "lucide-react";

export default function BoardLoading() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50/50 -m-6 md:-m-8">
      {/* Board Header Skeleton */}
      <div className="flex-none px-6 py-5 md:px-8 md:py-6 bg-slate-50/80 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)] z-10 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          
          {/* Left: Title and Members Skeleton */}
          <div className="flex flex-col gap-3">
            <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-lg" />
            <div className="flex items-center gap-3.5">
              <div className="flex items-center -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-8 w-8 rounded-full bg-slate-200 border-2 border-white shadow-sm animate-pulse" />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="h-4 w-20 bg-slate-200 animate-pulse rounded" />
                <div className="w-px h-4 bg-slate-200" />
                <div className="h-7 w-20 bg-indigo-100 animate-pulse rounded-lg" />
              </div>
            </div>
          </div>
          
          {/* Right: Actions Skeleton */}
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-20 bg-slate-100 animate-pulse rounded-xl border border-slate-200 hidden sm:block" />
            <div className="h-9 w-32 bg-slate-100 animate-pulse rounded-xl border border-slate-200" />
            <div className="h-9 w-28 bg-indigo-200 animate-pulse rounded-xl" />
          </div>
        </div>
      </div>

      {/* Board Canvas Wrapper Skeleton */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 md:p-8 no-scrollbar">
        <div className="flex gap-6 h-full items-start w-max">
          {[...Array(4)].map((_, colIdx) => (
            <div key={colIdx} className="w-72 sm:w-80 h-full flex flex-col bg-slate-100/50 rounded-2xl border border-slate-200/60 overflow-hidden">
              
              {/* Column Header */}
              <div className="p-4 border-b border-slate-200/60 flex items-center justify-between bg-slate-50/50 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-24 bg-slate-200 animate-pulse rounded-md" />
                  <div className="h-5 w-6 bg-slate-200 animate-pulse rounded-full" />
                </div>
                <div className="h-6 w-6 bg-slate-200 animate-pulse rounded-md" />
              </div>
              
              {/* Column Tasks */}
              <div className="flex-1 p-3 space-y-3 overflow-hidden">
                {[...Array(colIdx === 1 ? 3 : colIdx === 2 ? 1 : 2)].map((_, taskIdx) => (
                  <div key={taskIdx} className="bg-slate-50 p-4 rounded-xl shadow-sm border border-slate-200">
                    <div className="h-5 w-3/4 bg-slate-200 animate-pulse rounded mb-2" />
                    <div className="h-4 w-full bg-slate-100 animate-pulse rounded mb-4" />
                    <div className="flex items-center justify-between">
                      <div className="h-6 w-16 bg-slate-100 animate-pulse rounded-lg" />
                      <div className="flex -space-x-1.5">
                        <div className="h-6 w-6 rounded-full bg-slate-200 border border-white animate-pulse" />
                        <div className="h-6 w-6 rounded-full bg-slate-200 border border-white animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
