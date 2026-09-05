import React from "react";

export default function BoardsLoading() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-6 md:p-8 bg-slate-50/50 -m-6 md:-m-8 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="h-8 w-40 bg-slate-200 rounded-md mb-2"></div>
          <div className="h-4 w-64 bg-slate-200 rounded-md"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-full md:w-64 bg-slate-200 rounded-lg"></div>
          <div className="h-10 w-32 bg-slate-200 rounded-lg"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-[300px]">
            <div className="h-32 w-full bg-slate-200 flex-shrink-0"></div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="h-5 w-3/4 bg-slate-200 rounded-md mb-3"></div>
              <div className="h-4 w-full bg-slate-200 rounded-md mb-2"></div>
              <div className="h-4 w-5/6 bg-slate-200 rounded-md mb-4"></div>
              <div className="mt-auto flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-slate-200"></div>
                  <div className="h-3 w-24 bg-slate-200 rounded-md"></div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="h-3 w-16 bg-slate-200 rounded-md"></div>
                  <div className="h-3 w-20 bg-slate-200 rounded-md"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
