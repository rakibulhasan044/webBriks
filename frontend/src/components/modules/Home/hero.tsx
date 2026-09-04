import { GetStartedButton } from "./get-started-button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-8 pb-4 text-center z-0 flex flex-col justify-center min-h-[calc(100vh-4rem)]">
      
      {/* Stunning Background Patterns & Glows */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-50"></div>
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-background bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.2),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]"></div>

      {/* Embedded CSS Animations for Server Component */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-up {
          0% { opacity: 0; transform: translateY(30px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-up {
          opacity: 0;
          animation: fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        
        @keyframes drag-card {
          0%, 15% { transform: translate(0, 0) scale(1) rotate(0deg); box-shadow: 0 1px 2px rgba(0,0,0,0.05); z-index: 10; opacity: 1; }
          25% { transform: translate(0, -10px) scale(1.05) rotate(4deg); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); z-index: 50; opacity: 1; cursor: grabbing; }
          50% { transform: translate(calc(100% + 16px), -10px) scale(1.05) rotate(4deg); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); z-index: 50; opacity: 1; }
          60%, 85% { transform: translate(calc(100% + 16px), 0) scale(1) rotate(0deg); box-shadow: 0 1px 2px rgba(0,0,0,0.05); z-index: 10; opacity: 1; }
          90% { opacity: 0; transform: translate(calc(100% + 16px), 0); }
          95%, 100% { opacity: 0; transform: translate(0, 0); }
        }
        .animate-drag {
          animation: drag-card 4s cubic-bezier(0.25, 1, 0.5, 1) infinite;
          position: relative;
        }

        @keyframes pointer-move {
          0%, 15% { transform: translate(30px, 60px) scale(1); opacity: 0; }
          20% { transform: translate(70px, 80px) scale(0.9); opacity: 1; }
          50% { transform: translate(calc(100% + 80px), 80px) scale(0.9); opacity: 1; }
          60%, 100% { opacity: 0; }
        }
        .cursor-animated {
          animation: pointer-move 4s cubic-bezier(0.25, 1, 0.5, 1) infinite;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 60;
          pointer-events: none;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}} />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Headings */}
        <h1 className="animate-fade-up delay-100 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground max-w-4xl mx-auto leading-[1.1]">
          Run every project from one <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-500 to-purple-500">connected workspace.</span>
        </h1>
        
        <p className="animate-fade-up delay-200 mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          ZenBoard brings tasks, docs, and timelines into a single view, so your team spends less time switching tools and more time shipping.
        </p>

        {/* WebSocket Highlight */}
        <div className="animate-fade-up delay-200 mt-4 flex justify-center">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50/50 border border-indigo-100 rounded-full text-indigo-700 text-xs font-medium shadow-sm">
            <span>⚡</span> Powered by WebSockets for instant real-time sync across devices
          </div>
        </div>

        {/* CTAs */}
        <div className="animate-fade-up delay-300 mt-6 flex items-center justify-center gap-4">
          <GetStartedButton />
        </div>

      </div>

      {/* The Dashboard Mockup - Increased max-width to 7xl (1280px) */}
      <div className="animate-fade-up delay-300 mt-10 max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full">
        
        {/* Ambient Glow Behind Mockup */}
        <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-b from-primary/20 via-indigo-500/10 to-transparent opacity-50 blur-3xl -z-10"></div>

        <div className="animate-float rounded-2xl border border-border shadow-[0_20px_80px_-20px_rgba(0,0,0,0.3)] overflow-hidden bg-background text-left flex flex-col relative">
          
          {/* Mac window header */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/30 backdrop-blur-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          </div>

          {/* App Body */}
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] min-h-[450px]">
            
            {/* Sidebar (Light/White theme) */}
            <div className="hidden md:block border-r border-border/50 bg-[#F8F9FA] p-4">
              <div className="font-bold flex items-center gap-2 mb-8 mt-2">
                <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center shadow-sm">
                  <div className="w-2.5 h-2.5 rounded-sm bg-white"></div>
                </div>
                ZenBoard
              </div>
              
              <div className="space-y-6">
                <nav className="space-y-1">
                  <div className="flex justify-between items-center px-3 py-2.5 rounded-xl bg-white shadow-sm text-sm font-semibold text-slate-800 border border-slate-100">
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center"><div className="w-1.5 h-1.5 bg-slate-800 rounded-full"></div></div>
                      My Tasks
                    </span>
                    <span className="text-slate-400">16</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 cursor-pointer">
                    <span className="text-lg">⚡</span> Live Activity
                  </div>
                </nav>

                <div>
                  <p className="text-[10px] font-bold text-slate-400 mb-2 px-3 tracking-wider">WORKSPACE</p>
                  <nav className="space-y-1">
                    {/* Updated Sidebar items to match actual implementation */}
                    {['Dashboard', 'My Boards', 'Team Members', 'Settings'].map((item) => (
                      <div key={item} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 cursor-pointer">
                        <div className="w-4 h-4 bg-slate-200 rounded-[3px]"></div>
                        {item}
                      </div>
                    ))}
                  </nav>
                </div>
              </div>
            </div>

            {/* Main Content: Pastel Kanban Board */}
            <div className="p-6 md:p-8 bg-white flex flex-col h-full overflow-hidden relative">
              
              <div className="flex justify-between items-center mb-8">
                <div>
                  <p className="text-xs text-slate-500">Welcome,</p>
                  <h4 className="font-bold text-lg text-slate-800">Brooklyn Simmons</h4>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-500 flex items-center justify-center text-[10px] text-white">JD</div>
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-emerald-500 flex items-center justify-center text-[10px] text-white">SA</div>
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-purple-500 flex items-center justify-center text-[10px] text-white">MK</div>
                  </div>
                  <button className="bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm">
                    + Create task
                  </button>
                </div>
              </div>

              {/* Kanban Columns Grid - Reduced to 3 columns to match backend implementation */}
              <div className="grid grid-cols-3 gap-6 flex-1 relative">
                
                {/* Simulated Multiplayer Cursor */}
                <div className="cursor-animated drop-shadow-md z-50">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#8b5cf6" xmlns="http://www.w3.org/2000/svg" className="rotate-[-20deg]">
                    <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.42c.45 0 .67-.54.35-.85L6.35 2.85a.5.5 0 0 0-.85.35Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                  <div className="absolute top-5 left-3 bg-[#8b5cf6] text-white text-[10px] font-bold px-2 py-0.5 rounded-full rounded-tl-none shadow-sm whitespace-nowrap">
                    Sarah
                  </div>
                </div>

                {/* Column 1: To Do */}
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center px-1 mb-2">
                    <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-slate-800 rounded-full"></div> To Do
                    </span>
                    <span className="text-slate-400 text-lg">+</span>
                  </div>
                  
                  {/* The Animated Card (Indigo Pastel) */}
                  <div className="animate-drag bg-[#EFF4FF] rounded-2xl p-4 shadow-sm">
                    <div className="flex gap-2 mb-3">
                      <span className="text-[10px] font-semibold bg-white text-indigo-500 px-2 py-1 rounded-md">#website</span>
                      <span className="text-[10px] font-semibold bg-white text-indigo-500 px-2 py-1 rounded-md">#client</span>
                    </div>
                    <p className="text-[15px] font-bold text-indigo-900 leading-snug mb-4">Search inspirations for upcoming project</p>
                    <div className="w-full bg-white/50 h-1.5 rounded-full overflow-hidden mb-1"><div className="bg-indigo-500 w-[40%] h-full"></div></div>
                  </div>

                  {/* Static Card (Purple Pastel) */}
                  <div className="bg-[#F3EEFF] rounded-2xl p-4 shadow-sm">
                    <div className="flex gap-2 mb-3">
                      <span className="text-[10px] font-semibold bg-white text-purple-500 px-2 py-1 rounded-md">#mobile app</span>
                    </div>
                    <p className="text-[15px] font-bold text-purple-900 leading-snug mb-4">Ginko mobile app design</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-[11px] font-semibold text-purple-800"><div className="w-3 h-3 rounded-full bg-purple-500"></div> Create user flow</div>
                      <div className="flex items-center gap-2 text-[11px] font-semibold text-purple-800"><div className="w-3 h-3 rounded-full bg-purple-500"></div> Make wireframe</div>
                    </div>
                  </div>
                </div>

                {/* Column 2: In Progress */}
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center px-1 mb-2">
                    <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-slate-800 rounded-full"></div> In Progress
                    </span>
                    <span className="text-slate-400 text-lg">+</span>
                  </div>
                  
                  {/* Space where animated card lands */}
                  <div className="h-[140px] border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50"></div>
                  
                  {/* Static Card (Orange Pastel) */}
                  <div className="bg-[#FFF4E5] rounded-2xl p-4 shadow-sm">
                    <div className="flex gap-2 mb-3">
                      <span className="text-[10px] font-semibold bg-white text-orange-500 px-2 py-1 rounded-md">#dribbble shot</span>
                    </div>
                    <p className="text-[15px] font-bold text-orange-900 leading-snug mb-4">Wehiu product task and the task process pages</p>
                    <div className="w-full bg-white/50 h-1.5 rounded-full overflow-hidden mb-1"><div className="bg-orange-500 w-[90%] h-full"></div></div>
                  </div>
                </div>

                {/* Column 3: Done */}
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center px-1 mb-2">
                    <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-slate-800 rounded-full"></div> Done
                    </span>
                    <span className="text-slate-400 text-lg">+</span>
                  </div>
                  
                  {/* Static Card (Pink Pastel) */}
                  <div className="bg-[#FEF0F8] rounded-2xl p-4 shadow-sm">
                    <div className="flex gap-2 mb-3">
                      <span className="text-[10px] font-semibold bg-white text-pink-500 px-2 py-1 rounded-md">#development</span>
                    </div>
                    <p className="text-[15px] font-bold text-pink-900 leading-snug mb-4">Orypto product landing page create in webflow</p>
                  </div>

                  {/* Static Card (Cyan Pastel) */}
                  <div className="bg-[#ECFEFF] rounded-2xl p-4 shadow-sm">
                    <div className="flex gap-2 mb-3">
                      <span className="text-[10px] font-semibold bg-white text-cyan-500 px-2 py-1 rounded-md">#mobile app</span>
                    </div>
                    <p className="text-[15px] font-bold text-cyan-900 leading-snug mb-4">Affitto product full service</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-[11px] font-semibold text-cyan-800"><div className="w-3 h-3 rounded-full bg-cyan-500"></div> Branding</div>
                      <div className="flex items-center gap-2 text-[11px] font-semibold text-cyan-800"><div className="w-3 h-3 rounded-full bg-cyan-500"></div> Mobile app design</div>
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
