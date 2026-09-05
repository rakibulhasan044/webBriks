export function KanbanArt() {
  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center">
      {/* Background Layer: Soft Grid & Gradient */}
      <div className="absolute inset-0 bg-[#E8EEF2] bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:20px_20px]"></div>

      {/* The Kanban Board inside the "cutout" */}
      <div className="absolute top-[20%] left-[30%] w-[300px] transform rotate-3 flex gap-4">
        {/* Column 1 */}
        <div className="flex-1 bg-white/60 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-white/50">
          <div className="w-16 h-2 bg-indigo-200 rounded-full mb-4"></div>
          <div className="space-y-3">
            <div className="bg-white p-3 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-slate-100">
              <div className="w-8 h-1.5 bg-orange-300 rounded-full mb-2"></div>
              <div className="w-full h-2 bg-slate-100 rounded-full"></div>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-slate-100">
              <div className="w-10 h-1.5 bg-emerald-300 rounded-full mb-2"></div>
              <div className="w-full h-2 bg-slate-100 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="flex-1 bg-white/60 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-white/50 mt-8">
          <div className="w-12 h-2 bg-pink-200 rounded-full mb-4"></div>
          <div className="space-y-3">
            <div className="bg-white p-3 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-slate-100 transform -rotate-2 scale-105">
              <div className="w-8 h-1.5 bg-purple-300 rounded-full mb-2"></div>
              <div className="w-[80%] h-2 bg-slate-100 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Wavy Paper-Cut Layers (SVGs overlapping from the left to create the deep cutout effect) */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 1000 1000"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="shadow-1" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="15"
                dy="0"
                stdDeviation="25"
                floodColor="#000000"
                floodOpacity="0.08"
              />
            </filter>
            <filter id="shadow-2" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="10"
                dy="0"
                stdDeviation="15"
                floodColor="#000000"
                floodOpacity="0.06"
              />
            </filter>
            <filter id="shadow-3" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="5"
                dy="0"
                stdDeviation="8"
                floodColor="#000000"
                floodOpacity="0.04"
              />
            </filter>
          </defs>

          {/* Layer 3 (Deepest) */}
          <path
            d="M 0,0 L 250,0 C 350,150 150,350 300,500 C 450,650 200,850 350,1000 L 0,1000 Z"
            fill="#F1F5F9"
            filter="url(#shadow-1)"
          />

          {/* Layer 2 */}
          <path
            d="M 0,0 L 200,0 C 280,180 120,380 250,500 C 380,620 150,820 280,1000 L 0,1000 Z"
            fill="#F8FAFC"
            filter="url(#shadow-2)"
          />

          {/* Layer 1 (Top / Pure White matching the form side) */}
          <path
            d="M 0,0 L 150,0 C 200,200 80,400 180,500 C 280,600 100,800 200,1000 L 0,1000 Z"
            fill="#FFFFFF"
            filter="url(#shadow-3)"
          />
        </svg>
      </div>
    </div>
  );
}
