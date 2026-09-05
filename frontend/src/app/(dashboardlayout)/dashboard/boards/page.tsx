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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Boards</h1>
          <p className="text-sm text-slate-500 mt-1">Manage all your projects and workspaces</p>
        </div>
        <div className="flex items-center gap-3">
          <form className="relative" method="GET" action="/dashboard/boards">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              name="search"
              defaultValue={search}
              placeholder="Search boards..." 
              className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-full md:w-64"
            />
            {/* hidden submit button to trigger standard form GET request */}
            <button type="submit" className="hidden"></button>
          </form>
          <CreateBoardModal>
            <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors whitespace-nowrap">
              <Plus className="w-4 h-4" />
              Create Board
            </button>
          </CreateBoardModal>
        </div>
      </div>

      {/* Grid section */}
      {boards.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-white p-8 text-center">
          <div className="bg-indigo-50 text-indigo-600 p-3 rounded-full mb-4">
            <LayoutTemplate className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">No boards found</h3>
          <p className="text-slate-500 max-w-sm mb-6">You haven&apos;t created any boards yet, or no boards match your search.</p>
          <CreateBoardModal>
            <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors">
              <Plus className="w-4 h-4" />
              Create Your First Board
            </button>
          </CreateBoardModal>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {boards.map((board: any) => (
            <div key={board.id} className="relative group flex flex-col bg-white rounded-[24px] border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.12)] transition-all duration-300 min-h-[300px]">
              {/* Dropdown Menu - Frosted glass button over the image */}
              <div className="absolute top-4 right-4 z-10">
                <BoardCardMenu board={board} />
              </div>
              
              <Link href={`/dashboard/boards/${board.id}`} className="flex flex-col h-full w-full">
                
                {/* Cover Image at the VERY TOP */}
                {board.coverImage ? (
                  <div className="h-32 w-full rounded-t-[24px] overflow-hidden relative flex-shrink-0 bg-slate-50 border-b border-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={getImageUrl(board.coverImage) as string} 
                      alt={board.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" 
                    />
                  </div>
                ) : (
                  <div className="h-32 w-full rounded-t-[24px] bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white/30 flex-shrink-0 border-b border-slate-100">
                    <span className="font-bold text-4xl">{board.title.charAt(0)}</span>
                  </div>
                )}
                
                <div className="p-5 flex-1 flex flex-col">
                  {/* Title */}
                  <div className="pr-10">
                    <h3 className="text-[17px] font-semibold text-[#1e1b4b] group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {board.title}
                    </h3>
                  </div>
                  
                  {/* Description */}
                  <p className="text-[13px] text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {board.description || "No description provided."}
                  </p>

                  {/* Avatars */}
                  <div className="mt-auto flex items-center justify-end pt-4">
                    <div className="flex items-center -space-x-2">
                      <Avatar className="h-7 w-7 border-2 border-white shadow-sm ring-1 ring-slate-100">
                        {board.owner?.photo && <AvatarImage src={getImageUrl(board.owner.photo) as string} />}
                        <AvatarFallback className="text-[10px] bg-amber-100 text-amber-700 font-medium">
                          {board.owner?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      
                      {board.members?.slice(0, 2).map((member: any) => (
                        <Avatar key={member.id} className="h-7 w-7 border-2 border-white shadow-sm ring-1 ring-slate-100">
                          {member.user?.photo && <AvatarImage src={getImageUrl(member.user.photo) as string} />}
                          <AvatarFallback className="text-[10px] bg-emerald-100 text-emerald-700 font-medium">
                            {member.user?.name?.charAt(0) || "M"}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      
                      {board.members?.length > 2 && (
                        <div className="h-7 w-7 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center text-[9px] font-medium text-slate-600 shadow-sm ring-1 ring-slate-100 z-10">
                          +{board.members.length - 2}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer details */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[12px] text-slate-400 font-medium">
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
          ))}
        </div>
      )}
    </div>
  );
}
