import React from "react";
import Link from "next/link";
import { Plus, Search, Users, Clock, MoreVertical, LayoutTemplate } from "lucide-react";
import { CreateBoardModal } from "@/components/modules/Board/CreateBoardModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { boardService } from "@/services/board.service";
import { getImageUrl } from "@/lib/utils";

export default async function BoardsListingPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  
  // Fetch boards from the backend API directly!
  const response = await boardService.getBoards({ search });
  const boards = response.data || [];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-6 md:p-8 bg-slate-50/50 -m-6 md:-m-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Boards</h1>
          <p className="text-sm text-slate-500 mt-1">Manage all your projects and workspaces</p>
        </div>
        <div className="flex items-center gap-3">
          <form className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              name="search"
              defaultValue={search || ""}
              placeholder="Search boards..." 
              className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-full md:w-64"
            />
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
          <p className="text-slate-500 max-w-sm mb-6">You haven't created any boards yet, or no boards match your search.</p>
          <CreateBoardModal>
            <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors">
              <Plus className="w-4 h-4" />
              Create Your First Board
            </button>
          </CreateBoardModal>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {boards.map((board) => (
            <Link href={`/dashboard/boards/${board.id}`} key={board.id} className="group flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all overflow-hidden h-[300px]">
              {/* Cover Image Header */}
              <div className="relative h-32 w-full bg-slate-100 overflow-hidden flex-shrink-0">
                {board.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={getImageUrl(board.coverImage) as string} 
                    alt={board.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-500 opacity-90 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center text-white/30">
                    <span className="font-bold text-3xl">{board.title.charAt(0)}</span>
                  </div>
                )}
                <button className="absolute top-2 right-2 p-1.5 rounded-md bg-black/20 hover:bg-black/40 text-white transition-colors backdrop-blur-sm">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              
              {/* Body */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-semibold text-slate-900 truncate mb-1 group-hover:text-indigo-600 transition-colors">
                  {board.title}
                </h3>
                <p className="text-sm text-slate-500 truncate mb-4">
                  {board.description || "No description provided."}
                </p>
                
                {/* Footer (Owner & Stats) */}
                <div className="mt-auto flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6 border border-slate-200">
                      {board.owner?.photo && <AvatarImage src={getImageUrl(board.owner.photo) as string} />}
                      <AvatarFallback className="text-[10px] bg-indigo-50 text-indigo-700 font-medium">
                        {board.owner?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-slate-600 font-medium truncate">Created by {board.owner?.name || "Unknown"}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-slate-400 font-medium pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      {board.members ? board.members.length + 1 : 1}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(board.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
