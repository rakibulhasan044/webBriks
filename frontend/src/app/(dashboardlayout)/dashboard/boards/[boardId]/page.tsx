import { Filter, Plus, UserPlus, Layout } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BoardCanvas from "@/components/modules/Board/BoardCanvas";
import { CreateTaskModal } from "@/components/modules/Board/CreateTaskModal";
import { AddMemberModal } from "@/components/modules/Board/AddMemberModal";
import { CreateColumnModal } from "@/components/modules/Board/CreateColumnModal";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getImageUrl } from "@/lib/utils";

// Make it a dynamic route
export const dynamic = "force-dynamic";

async function getBoard(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  
  if (!token) redirect("/login");

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:6001/api/v1";
  
  const res = await fetch(`${baseUrl}/boards/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store", // Keep it fresh for real-time Kanban changes
  });

  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

export default async function BoardsPage({ params }: { params: Promise<{ boardId: string }> }) {
  const resolvedParams = await params;
  const board = await getBoard(resolvedParams.boardId);

  if (!board) {
    redirect("/dashboard/boards");
  }

  // Map Backend Columns to BoardCanvas Format
  const mappedColumns = board.columns?.map((col: any) => {
    // Add default colors based on column name like the mock data did
    let color = "border-slate-300";
    if (col.title === "TO_DO") color = "border-pink-500";
    if (col.title === "IN_PROGRESS") color = "border-amber-500";
    if (col.title === "IN_REVIEW") color = "border-blue-500";
    if (col.title === "DONE") color = "border-emerald-500";
    
    // Convert column title enum (TO_DO -> To Do)
    const displayTitle = col.title.replace(/_/g, " ").replace(/\w\S*/g, (txt: string) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

    return {
      id: col.id,
      title: displayTitle,
      color,
      tasks: col.tasks?.map((task: any) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        priority: task.priority === "LOW" ? "Low" : task.priority === "MEDIUM" ? "Medium" : "High",
        comments: 0,
        attachments: task.attachments || [],
        assignees: task.assignees || []
      })) || []
    };
  }) || [];

  const priorityStyles = {
    Low: {
      cardBg: "bg-blue-50/80 border-blue-100",
      pill: "bg-blue-200/50 text-blue-700",
      text: "text-blue-950",
      icon: "text-blue-400"
    },
    Medium: {
      cardBg: "bg-emerald-50/80 border-emerald-100",
      pill: "bg-emerald-200/50 text-emerald-700",
      text: "text-emerald-950",
      icon: "text-emerald-400"
    },
    High: {
      cardBg: "bg-pink-50/80 border-pink-100",
      pill: "bg-pink-200/50 text-pink-700",
      text: "text-pink-950",
      icon: "text-pink-400"
    },
  };

  const totalMembers = 1 + (board.members?.length || 0);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50/50 -m-6 md:-m-8">
      {/* Board Header (Server Component area) */}
      <div className="flex-none px-6 py-4 md:px-8 md:py-6 border-b border-slate-200 bg-white shadow-sm z-10 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{board.title}</h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center -space-x-2">
                {/* Owner */}
                <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                  {board.owner?.photo && <AvatarImage src={getImageUrl(board.owner.photo) as string} />}
                  <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">
                    {board.owner?.name?.charAt(0) || "O"}
                  </AvatarFallback>
                </Avatar>
                
                {/* Members */}
                {board.members?.slice(0, 3).map((member: any) => (
                  <Avatar key={member.id} className="h-8 w-8 border-2 border-white shadow-sm">
                    {member.user?.photo && <AvatarImage src={getImageUrl(member.user.photo) as string} />}
                    <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs">
                      {member.user?.name?.charAt(0) || "M"}
                    </AvatarFallback>
                  </Avatar>
                ))}
                
                {/* Overflow count */}
                {board.members?.length > 3 && (
                  <button className="h-8 w-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors z-10 text-xs font-medium">
                    +{board.members.length - 3}
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-500">{totalMembers} members</span>
                <div className="w-px h-4 bg-slate-200"></div>
                <AddMemberModal boardId={board.id}>
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-2 py-1 rounded-md transition-colors">
                    <UserPlus className="w-3.5 h-3.5" />
                    Invite
                  </button>
                </AddMemberModal>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <CreateColumnModal boardId={board.id}>
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
                <Layout className="w-4 h-4" />
                Add Column
              </button>
            </CreateColumnModal>
            <CreateTaskModal 
              columns={board.columns.map((c: any) => ({ id: c.id, title: c.title }))} 
              members={[board.owner, ...board.members.map((m: any) => m.user)].map(u => ({ id: u.id, name: u.name, photo: u.photo }))}
            >
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors">
                <Plus className="w-4 h-4" />
                New Task
              </button>
            </CreateTaskModal>
          </div>
        </div>
      </div>

      {/* Board Canvas Wrapper */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 md:p-8 no-scrollbar">
        <BoardCanvas 
          boardId={board.id}
          initialColumns={mappedColumns} 
          priorityStyles={priorityStyles} 
          members={[board.owner, ...board.members.map((m: any) => m.user)].map(u => ({ id: u.id, name: u.name, photo: u.photo }))}
        />
      </div>
    </div>
  );
}
