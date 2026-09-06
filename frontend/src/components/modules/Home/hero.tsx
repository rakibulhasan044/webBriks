import { GetStartedButton } from "./get-started-button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-8 pb-4 text-center z-0 flex flex-col justify-center min-h-[calc(100vh-4rem)]">
      {/* Enhanced Background — Animated mesh gradient + refined grid */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_60%,transparent_100%)] opacity-40"></div>
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-background bg-[radial-gradient(ellipse_60%_40%_at_50%_-10%,rgba(99,102,241,0.18),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_60%_40%_at_50%_-10%,rgba(99,102,241,0.12),rgba(255,255,255,0))]"></div>

      {/* Floating ambient orbs */}
      <div
        className="absolute top-20 left-[10%] w-72 h-72 bg-indigo-400/10 rounded-full blur-[100px] animate-pulse"
        style={{ animationDuration: "8s" }}
      ></div>
      <div
        className="absolute top-40 right-[15%] w-96 h-96 bg-violet-400/10 rounded-full blur-[120px] animate-pulse"
        style={{ animationDuration: "10s", animationDelay: "2s" }}
      ></div>

      {/* Embedded CSS Animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fade-up {
          0% { opacity: 0; transform: translateY(40px) scale(0.96); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        .animate-fade-up {
          opacity: 0;
          animation: fade-up 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .delay-100 { animation-delay: 120ms; }
        .delay-200 { animation-delay: 240ms; }
        .delay-300 { animation-delay: 380ms; }
        .delay-400 { animation-delay: 500ms; }
        
        @keyframes drag-card {
          0%, 12% { transform: translate(0, 0) scale(1) rotate(0deg); box-shadow: 0 1px 3px rgba(0,0,0,0.06); z-index: 10; opacity: 1; }
          22% { transform: translate(0, -12px) scale(1.04) rotate(3deg); box-shadow: 0 25px 50px -12px rgba(99,102,241,0.25); z-index: 50; opacity: 1; }
          48% { transform: translate(calc(100% + 24px), -12px) scale(1.04) rotate(3deg); box-shadow: 0 25px 50px -12px rgba(99,102,241,0.25); z-index: 50; opacity: 1; }
          58%, 82% { transform: translate(calc(100% + 24px), 0) scale(1) rotate(0deg); box-shadow: 0 1px 3px rgba(0,0,0,0.06); z-index: 10; opacity: 1; }
          88% { opacity: 0; transform: translate(calc(100% + 24px), 8px) scale(0.95); }
          95%, 100% { opacity: 0; transform: translate(0, 0) scale(1); }
        }
        .animate-drag {
          animation: drag-card 5s cubic-bezier(0.25, 1, 0.5, 1) infinite;
          position: relative;
        }

        @keyframes pointer-move {
          0%, 12% { transform: translate(40px, 70px) scale(1); opacity: 0; }
          18% { transform: translate(80px, 90px) scale(0.9); opacity: 1; }
          48% { transform: translate(calc(100% + 90px), 90px) scale(0.9); opacity: 1; }
          58%, 100% { opacity: 0; }
        }
        .cursor-animated {
          animation: pointer-move 5s cubic-bezier(0.25, 1, 0.5, 1) infinite;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 60;
          pointer-events: none;
          filter: drop-shadow(0 4px 6px rgba(139,92,246,0.3));
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-12px) rotate(0.5deg); }
          66% { transform: translateY(-6px) rotate(-0.5deg); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.15); }
          50% { box-shadow: 0 0 20px 4px rgba(99,102,241,0.08); }
        }
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        
        @keyframes progress-fill {
          0% { width: 0%; }
          100% { width: 40%; }
        }
        .animate-progress {
          animation: progress-fill 2s ease-out forwards;
        }
      `,
        }}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Headings */}
        <h1 className="animate-fade-up delay-100 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-[1.08]">
          Run every project from one{" "}
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500">
              connected workspace
            </span>
            <svg
              className="absolute -bottom-2 left-0 w-full h-3 text-indigo-200/60"
              viewBox="0 0 200 12"
              preserveAspectRatio="none"
            >
              <path
                d="M0,8 Q50,0 100,8 T200,8"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        <p className="animate-fade-up delay-200 mt-5 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
          ZenBoard brings tasks, docs, and timelines into a single view, so your
          team spends less time switching tools and more time shipping.
        </p>

        {/* WebSocket Highlight */}
        <div className="animate-fade-up delay-200 mt-5 flex justify-center">
          <div className="animate-pulse-glow flex items-center gap-2.5 px-4 py-2 bg-indigo-50/80 backdrop-blur-sm border border-indigo-100/80 rounded-full text-indigo-700 text-[13px] font-bold shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
            </span>
            Powered by WebSockets for instant real-time sync
          </div>
        </div>

        {/* CTAs */}
        <div className="animate-fade-up delay-300 mt-7 flex items-center justify-center gap-4">
          <GetStartedButton />
        </div>
      </div>

      {/* The Dashboard Mockup */}
      <div className="animate-fade-up delay-400 mt-12 max-w-6xl mx-auto px-4 sm:px-6 relative z-10 w-full">
        {/* Ambient Glow Behind Mockup */}
        <div
          className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-b from-indigo-500/15 via-violet-500/10 to-transparent opacity-60 blur-3xl -z-10 animate-pulse"
          style={{ animationDuration: "6s" }}
        ></div>
        <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-tr from-indigo-500/5 via-transparent to-violet-500/5 opacity-80 -z-10"></div>

        <div className="animate-float rounded-2xl border border-border/60 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.25)] overflow-hidden bg-background text-left flex flex-col relative ring-1 ring-black/5">
          {/* Shimmer overlay */}
          <div className="absolute inset-0 animate-shimmer pointer-events-none z-20 opacity-30"></div>

          {/* Mac window header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/20 backdrop-blur-sm">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-400/90 shadow-sm ring-1 ring-red-400/20"></span>
              <span className="w-3 h-3 rounded-full bg-amber-400/90 shadow-sm ring-1 ring-amber-400/20"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-400/90 shadow-sm ring-1 ring-emerald-400/20"></span>
            </div>
            <div className="flex-1 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100/80 text-[11px] font-medium text-slate-500 border border-slate-200/50">
                <div className="w-3 h-3 rounded-sm bg-indigo-500/80"></div>
                zenboard.app/dashboard
              </div>
            </div>
          </div>

          {/* App Body */}
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] min-h-[480px]">
            {/* Sidebar */}
            <div className="hidden md:block border-r border-border/40 bg-[#F8F9FA]/80 backdrop-blur-sm p-5">
              <div className="font-bold flex items-center gap-2.5 mb-10 mt-1">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200/50">
                  <div className="w-3 h-3 rounded-[3px] bg-slate-50"></div>
                </div>
                <span className="text-[15px] tracking-tight text-slate-800">
                  ZenBoard
                </span>
              </div>

              <div className="space-y-8">
                <nav className="space-y-1">
                  <div className="flex justify-between items-center px-3 py-2.5 rounded-xl bg-slate-50 shadow-sm text-sm font-bold text-slate-800 border border-slate-100/80 ring-1 ring-slate-100/50">
                    <span className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full border-2 border-indigo-400 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                      </div>
                      My Tasks
                    </span>
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                      16
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50/60 hover:shadow-sm transition-all cursor-pointer">
                    <span className="text-base">⚡</span> Live Activity
                  </div>
                </nav>

                <div>
                  <p className="text-[10px] font-bold text-slate-400 mb-3 px-3 tracking-widest uppercase">
                    Workspace
                  </p>
                  <nav className="space-y-0.5">
                    {["Dashboard", "My Boards", "Team Members", "Settings"].map(
                      (item, i) => (
                        <div
                          key={item}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50/60 hover:text-slate-700 transition-all cursor-pointer group"
                        >
                          <div
                            className={`w-4 h-4 rounded-[4px] ${["bg-slate-200", "bg-indigo-200", "bg-emerald-200", "bg-amber-200"][i]} group-hover:scale-110 transition-transform`}
                          ></div>
                          {item}
                        </div>
                      ),
                    )}
                  </nav>
                </div>
              </div>
            </div>

            {/* Main Content: Pastel Kanban Board */}
            <div className="p-6 md:p-8 bg-slate-50 flex flex-col h-full overflow-hidden relative">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Welcome back,
                  </p>
                  <h4 className="font-extrabold text-xl text-slate-800 tracking-tight">
                    Brooklyn Simmons
                  </h4>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2.5">
                    <div className="w-9 h-9 rounded-full border-[2.5px] border-white bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-[11px] text-white font-bold shadow-sm">
                      JD
                    </div>
                    <div className="w-9 h-9 rounded-full border-[2.5px] border-white bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-[11px] text-white font-bold shadow-sm">
                      SA
                    </div>
                    <div className="w-9 h-9 rounded-full border-[2.5px] border-white bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center text-[11px] text-white font-bold shadow-sm">
                      MK
                    </div>
                  </div>
                  <button className="bg-linear-to-br from-primary to-indigo-600 hover:bg-slate-800 text-white text-[13px] font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5">
                    + Create task
                  </button>
                </div>
              </div>

              {/* Kanban Columns Grid */}
              <div className="grid grid-cols-3 gap-5 flex-1 relative">
                {/* Simulated Multiplayer Cursor */}
                <div className="cursor-animated drop-shadow-lg z-50">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="#8b5cf6"
                    xmlns="http://www.w3.org/2000/svg"
                    className="rotate-[-15deg]"
                  >
                    <path
                      d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.42c.45 0 .67-.54.35-.85L6.35 2.85a.5.5 0 0 0-.85.35Z"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="absolute top-5 left-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full rounded-tl-none shadow-lg whitespace-nowrap">
                    Sarah
                  </div>
                </div>

                {/* Column 1: To Do */}
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center px-1 mb-1">
                    <span className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
                      <div className="w-2 h-2 bg-slate-400 rounded-full"></div>{" "}
                      To Do
                    </span>
                    <span className="text-slate-300 hover:text-slate-500 cursor-pointer transition-colors text-lg leading-none">
                      +
                    </span>
                  </div>

                  {/* The Animated Card (Indigo Pastel) */}
                  <div className="animate-drag bg-gradient-to-br from-[#EFF4FF] to-[#EEF2FF] rounded-2xl p-4 shadow-sm border border-indigo-100/50 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing">
                    <div className="flex gap-2 mb-3 flex-wrap">
                      <span className="text-[10px] font-bold bg-slate-50/80 text-indigo-600 px-2 py-1 rounded-lg border border-indigo-100/50 shadow-sm">
                        #website
                      </span>
                      <span className="text-[10px] font-bold bg-slate-50/80 text-indigo-600 px-2 py-1 rounded-lg border border-indigo-100/50 shadow-sm">
                        #client
                      </span>
                    </div>
                    <p className="text-[14px] font-bold text-indigo-950 leading-snug mb-4">
                      Search inspirations for upcoming project
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-1.5">
                        <div className="w-5 h-5 rounded-full bg-indigo-300 border-2 border-white"></div>
                        <div className="w-5 h-5 rounded-full bg-violet-300 border-2 border-white"></div>
                      </div>
                      <div className="w-20 bg-indigo-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-400 to-indigo-500 w-[40%] h-full rounded-full animate-progress"></div>
                      </div>
                    </div>
                  </div>

                  {/* Static Card (Purple Pastel) */}
                  <div className="bg-gradient-to-br from-[#F5F0FF] to-[#FAF5FF] rounded-2xl p-4 shadow-sm border border-violet-100/50 hover:shadow-md transition-all hover:-translate-y-0.5">
                    <div className="flex gap-2 mb-3">
                      <span className="text-[10px] font-bold bg-slate-50/80 text-violet-600 px-2 py-1 rounded-lg border border-violet-100/50 shadow-sm">
                        #mobile app
                      </span>
                    </div>
                    <p className="text-[14px] font-bold text-violet-950 leading-snug mb-3">
                      Ginko mobile app design
                    </p>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2.5 text-[11px] font-semibold text-violet-800">
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-violet-400 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-violet-500 rounded-full"></div>
                        </div>
                        Create user flow
                      </div>
                      <div className="flex items-center gap-2.5 text-[11px] font-semibold text-violet-800/60">
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-violet-200 flex items-center justify-center"></div>
                        Make wireframe
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-violet-600/70 bg-violet-50 px-2 py-1 rounded-lg w-fit">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      3 comments
                    </div>
                  </div>
                </div>

                {/* Column 2: In Progress */}
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center px-1 mb-1">
                    <span className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>{" "}
                      In Progress
                    </span>
                    <span className="text-slate-300 hover:text-slate-500 cursor-pointer transition-colors text-lg leading-none">
                      +
                    </span>
                  </div>

                  {/* Drop zone placeholder */}
                  <div className="h-[150px] border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 flex items-center justify-center">
                    <span className="text-[11px] font-semibold text-slate-300">
                      Drop tasks here
                    </span>
                  </div>

                  {/* Static Card (Orange Pastel) */}
                  <div className="bg-gradient-to-br from-[#FFF7ED] to-[#FFFBF5] rounded-2xl p-4 shadow-sm border border-orange-100/50 hover:shadow-md transition-all hover:-translate-y-0.5">
                    <div className="flex gap-2 mb-3">
                      <span className="text-[10px] font-bold bg-slate-50/80 text-orange-600 px-2 py-1 rounded-lg border border-orange-100/50 shadow-sm">
                        #dribbble shot
                      </span>
                      <span className="text-[10px] font-bold bg-red-50 text-red-600 px-2 py-1 rounded-lg border border-red-100/50 shadow-sm">
                        High
                      </span>
                    </div>
                    <p className="text-[14px] font-bold text-orange-950 leading-snug mb-4">
                      Wehiu product task and the task process pages
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-1.5">
                        <div className="w-5 h-5 rounded-full bg-orange-300 border-2 border-white"></div>
                      </div>
                      <div className="w-full max-w-[100px] bg-orange-100 h-1.5 rounded-full overflow-hidden ml-3">
                        <div className="bg-gradient-to-r from-orange-400 to-amber-400 w-[90%] h-full rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 3: Done */}
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center px-1 mb-1">
                    <span className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>{" "}
                      Done
                    </span>
                    <span className="text-slate-300 hover:text-slate-500 cursor-pointer transition-colors text-lg leading-none">
                      +
                    </span>
                  </div>

                  {/* Static Card (Pink Pastel) */}
                  <div className="bg-gradient-to-br from-[#FDF2F8] to-[#FDF7FA] rounded-2xl p-4 shadow-sm border border-pink-100/50 hover:shadow-md transition-all hover:-translate-y-0.5 relative overflow-hidden">
                    <div className="absolute top-3 right-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-emerald-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <span className="text-[10px] font-bold bg-slate-50/80 text-pink-600 px-2 py-1 rounded-lg border border-pink-100/50 shadow-sm">
                        #development
                      </span>
                    </div>
                    <p className="text-[14px] font-bold text-pink-950 leading-snug mb-4 pr-6">
                      Orypto product landing page create in webflow
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-pink-600/70 bg-pink-50 px-2 py-1 rounded-lg w-fit">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                        />
                      </svg>
                      2 attachments
                    </div>
                  </div>

                  {/* Static Card (Cyan Pastel) */}
                  <div className="bg-gradient-to-br from-[#ECFEFF] to-[#F0FDFF] rounded-2xl p-4 shadow-sm border border-cyan-100/50 hover:shadow-md transition-all hover:-translate-y-0.5">
                    <div className="flex gap-2 mb-3">
                      <span className="text-[10px] font-bold bg-slate-50/80 text-cyan-600 px-2 py-1 rounded-lg border border-cyan-100/50 shadow-sm">
                        #mobile app
                      </span>
                    </div>
                    <p className="text-[14px] font-bold text-cyan-950 leading-snug mb-3">
                      Affitto product full service
                    </p>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2.5 text-[11px] font-semibold text-cyan-800">
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-cyan-400 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                        </div>
                        Branding
                      </div>
                      <div className="flex items-center gap-2.5 text-[11px] font-semibold text-cyan-800">
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-cyan-400 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                        </div>
                        Mobile app design
                      </div>
                      <div className="flex items-center gap-2.5 text-[11px] font-semibold text-cyan-800/60">
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-cyan-200 flex items-center justify-center"></div>
                        Development
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
