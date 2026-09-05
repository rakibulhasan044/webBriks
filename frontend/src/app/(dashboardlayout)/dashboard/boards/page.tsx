import React from "react";
import Link from "next/link";
import { Plus, Search, Users, Clock, MoreVertical, LayoutTemplate, MessageSquare, Paperclip, Calendar } from "lucide-react";
import { CreateBoardModal } from "@/components/modules/Board/CreateBoardModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImageUrl } from "@/lib/utils";
import { BoardCardMenu } from "@/components/modules/Board/BoardCardMenu";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Next.js native fetch wrapper for caching!
async function getCachedBoards(search: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  
  if (!token) {
    redirect("/login");
  }

  const queryParam = search ? `?search=${encodeURIComponent(search)}` : "";
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:6001/api/v1";
  
  const res = await fetch(`${baseUrl}/boards${queryParam}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    // Force Next.js to cache this server request in memory!
    cache: "force-cache", 
  });

  if (!res.ok) {
    return [];
  }

  const json = await res.json();
  return json.data || [];
}

export default async function BoardsListingPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const resolvedParams = await searchParams;
  const search = resolvedParams.search || "";
  
  // Instant fetch from Next.js memory cache!
  const boards = await getCachedBoards(search);

return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-6 md:p-8 bg-slate-50/50 -m-6 md:-m-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Boards</h1>
          <p className="text-sm text-slate-500 mt-1.5 font-medium">Manage all your projects and workspaces</p>
        </div>
        <div className="flex items-center gap-3">
          <form className="relative group" method="GET" action="/dashboard/boards">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              name="search"
              defaultValue={search}
              placeholder="Search boards..." 
              className="pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all w-full md:w-72 shadow-sm hover:border-slate-300 placeholder:text-slate-400"
            />
            <button type="submit" className="hidden"></button>
          </form>
          <CreateBoardModal>
            <button className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200/50 hover:bg-indigo-700 hover:shadow-indigo-300/50 hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap">
              <Plus className="w-4 h-4" />
              Create Board
            </button>
          </CreateBoardModal>
        </div>
      </div>

      {/* Grid section */}
      {boards.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl bg-white/60 backdrop-blur-sm p-12 text-center">
          <div className="bg-gradient-to-br from-indigo-100 to-violet-100 text-indigo-600 p-4 rounded-2xl mb-5 shadow-sm">
            <LayoutTemplate className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No boards found</h3>
          <p className="text-slate-500 max-w-sm mb-8 text-[15px] leading-relaxed">You haven&apos;t created any boards yet, or no boards match your search.</p>
          <CreateBoardModal>
            <button className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200/50 hover:bg-indigo-700 hover:shadow-indigo-300/50 hover:-translate-y-0.5 transition-all duration-200">
              <Plus className="w-4 h-4" />
              Create Your First Board
            </button>
          </CreateBoardModal>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {boards.map((board: any, index: number) => {
            // Pastel accent themes cycling through the grid
            const themes = [
              { gradient: "from-amber-400/90 to-orange-500/90", accent: "bg-amber-500", light: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200", hoverBorder: "group-hover:border-amber-200/60" },
              { gradient: "from-emerald-400/90 to-teal-500/90", accent: "bg-emerald-500", light: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200", hoverBorder: "group-hover:border-emerald-200/60" },
              { gradient: "from-sky-400/90 to-blue-500/90", accent: "bg-sky-500", light: "bg-sky-50", text: "text-sky-700", ring: "ring-sky-200", hoverBorder: "group-hover:border-sky-200/60" },
              { gradient: "from-violet-400/90 to-purple-500/90", accent: "bg-violet-500", light: "bg-violet-50", text: "text-violet-700", ring: "ring-violet-200", hoverBorder: "group-hover:border-violet-200/60" },
              { gradient: "from-rose-400/90 to-pink-500/90", accent: "bg-rose-500", light: "bg-rose-50", text: "text-rose-700", ring: "ring-rose-200", hoverBorder: "group-hover:border-rose-200/60" },
              { gradient: "from-cyan-400/90 to-indigo-500/90", accent: "bg-cyan-500", light: "bg-cyan-50", text: "text-cyan-700", ring: "ring-cyan-200", hoverBorder: "group-hover:border-cyan-200/60" },
            ];
            const theme = themes[index % themes.length];
            
            return (
              <div key={board.id} className={`relative group flex flex-col bg-white rounded-3xl border border-slate-100 shadow-[0_2px_16px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300 min-h-[300px] overflow-hidden ${theme.hoverBorder}`}>
                {/* Top accent line */}
                <div className={`h-1 w-full ${theme.accent} opacity-80`} />
                
                {/* Dropdown Menu */}
                <div className="absolute top-5 right-5 z-10">
                  <BoardCardMenu board={board} />
                </div>
                
                <Link href={`/dashboard/boards/${board.id}`} className="flex flex-col h-full w-full">
                  
                  {/* Cover Image */}
                  {board.coverImage ? (
                    <div className="h-36 w-full overflow-hidden relative flex-shrink-0 bg-slate-50">
                      <img 
                        src={getImageUrl(board.coverImage) as string} 
                        alt={board.title} 
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  ) : (
                    <div className={`h-36 w-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-white/40 flex-shrink-0 relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent)]" />
                      <span className="font-bold text-5xl relative z-10 drop-shadow-sm">{board.title.charAt(0)}</span>
                    </div>
                  )}
                  
                  <div className="p-5 flex-1 flex flex-col">
                    {/* Title */}
                    <div className="pr-10">
                      <h3 className="text-[17px] font-bold text-slate-800 group-hover:text-indigo-600 transition-colors duration-200 line-clamp-1">
                        {board.title}
                      </h3>
                    </div>
                    
                    {/* Description */}
                    <p className="text-[13px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {board.description || "No description provided."}
                    </p>

                    {/* Avatars */}
                    <div className="mt-auto flex items-center justify-end pt-5">
                      <div className="flex items-center -space-x-2">
                        <Avatar className={`h-7 w-7 border-2 border-white shadow-sm ring-1 ${theme.ring}`}>
                          {board.owner?.photo && <AvatarImage src={getImageUrl(board.owner.photo) as string} />}
                          <AvatarFallback className={`text-[10px] ${theme.light} ${theme.text} font-bold`}>
                            {board.owner?.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        
                        {board.members?.slice(0, 2).map((member: any, mIdx: number) => {
                          const memberThemes = [
                            { light: "bg-sky-50", text: "text-sky-700", ring: "ring-sky-200" },
                            { light: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200" },
                            { light: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200" },
                          ];
                          const mt = memberThemes[mIdx % memberThemes.length];
                          return (
                            <Avatar key={member.id} className={`h-7 w-7 border-2 border-white shadow-sm ring-1 ${mt.ring}`}>
                              {member.user?.photo && <AvatarImage src={getImageUrl(member.user.photo) as string} />}
                              <AvatarFallback className={`text-[10px] ${mt.light} ${mt.text} font-bold`}>
                                {member.user?.name?.charAt(0) || "M"}
                              </AvatarFallback>
                            </Avatar>
                          );
                        })}
                        
                        {board.members?.length > 2 && (
                          <div className="h-7 w-7 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center text-[9px] font-bold text-slate-600 shadow-sm ring-1 ring-slate-100 z-10">
                            +{board.members.length - 2}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer details */}
                    <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[12px] text-slate-400 font-semibold">
                      <div className="flex items-center gap-1.5 hover:text-slate-600 transition-colors">
                        <Users className="w-3.5 h-3.5" />
                        <span>{1 + (board.members?.length || 0)} Members</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(board.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
