import { Filter, Plus, UserPlus, Layout } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BoardCanvas from "@/components/modules/Board/BoardCanvas";
import { CreateTaskModal } from "@/components/modules/Board/CreateTaskModal";
import { AddMemberModal } from "@/components/modules/Board/AddMemberModal";
import { CreateColumnModal } from "@/components/modules/Board/CreateColumnModal";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getImageUrl } from "@/lib/utils";
import { Column } from "@/types/column.types";
import { Task } from "@/types/task.types";
import { User } from "@/types/user.type";

import { IColumn } from "@/types/column.types";
import { ITask } from "@/types/task.types";
import { IUser } from "@/types/user.type";


// Make it a dynamic route
export const dynamic = "force-dynamic";

async function getBoard(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) redirect("/login");

  const baseUrl =
    process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:6001/api/v1";

  const res = await fetch(`${baseUrl}/boards/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store", // Keep it fresh for real-time Kanban changes
  });

  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

export default async function BoardsPage({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  const resolvedParams = await params;
  const board = await getBoard(resolvedParams.boardId);

  if (!board) {
    redirect("/dashboard/boards");
  }

  // Map Backend Columns to BoardCanvas Format
  const mappedColumns =
    board.columns?.map((col: IColumn) => {
      // Add default colors based on column name like the mock data did
      let color = "border-slate-300";
      if (col.title === "TO_DO") color = "border-pink-500";
      if (col.title === "IN_PROGRESS") color = "border-amber-500";
      if (col.title === "IN_REVIEW") color = "border-blue-500";
      if (col.title === "DONE") color = "border-emerald-500";

      // Convert column title enum (TO_DO -> To Do)
      const displayTitle = col.title
        .replace(/_/g, " ")
        .replace(
          /\w\S*/g,
          (txt: string) =>
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
        );

      return {
        id: col.id,
        title: displayTitle,
        color,
        tasks:
          col.tasks?.map((task: ITask) => ({
            id: task.id,
            title: task.title,
            description: task.description,
            position: task.position,
            priority:
              task.priority === "LOW"
                ? "Low"
                : task.priority === "MEDIUM"
                  ? "Medium"
                  : "High",
            comments: 0,
            attachments: task.attachments || [],
            assignees: task.assignees || [],
          })) || [],
      };
    }) || [];

  const priorityStyles = {
    Low: {
      cardBg: "bg-blue-50/80 border-blue-100",
      pill: "bg-blue-200/50 text-blue-700",
      text: "text-blue-950",
      icon: "text-blue-400",
    },
    Medium: {
      cardBg: "bg-emerald-50/80 border-emerald-100",
      pill: "bg-emerald-200/50 text-emerald-700",
      text: "text-emerald-950",
      icon: "text-emerald-400",
    },
    High: {
      cardBg: "bg-pink-50/80 border-pink-100",
      pill: "bg-pink-200/50 text-pink-700",
      text: "text-pink-950",
      icon: "text-pink-400",
    },
  };

  const totalMembers = 1 + (board.members?.length || 0);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50/50 -m-6 md:-m-8">
      {/* Board Header */}
      <div className="flex-none px-6 py-5 md:px-8 md:py-6 bg-slate-50/80 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)] z-10 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {board.title}
            </h1>
            <div className="flex items-center gap-3.5">
              <div className="flex items-center -space-x-2">
                {/* Owner */}
                <Avatar className="h-8 w-8 border-2 border-white shadow-sm ring-1 ring-indigo-200">
                  {board.owner?.photo && (
                    <AvatarImage
                      src={getImageUrl(board.owner.photo) as string}
                    />
                  )}
                  <AvatarFallback className="bg-indigo-50 text-indigo-700 text-[11px] font-bold">
                    {board.owner?.name?.charAt(0) || "O"}
                  </AvatarFallback>
                </Avatar>

                {/* Members with cycling pastel colors */}
                {board.members?.slice(0, 3).map((member: any, mIdx: number) => {
                  const memberThemes = [
                    {
                      bg: "bg-emerald-50",
                      text: "text-emerald-700",
                      ring: "ring-emerald-200",
                    },
                    {
                      bg: "bg-amber-50",
                      text: "text-amber-700",
                      ring: "ring-amber-200",
                    },
                    {
                      bg: "bg-sky-50",
                      text: "text-sky-700",
                      ring: "ring-sky-200",
                    },
                    {
                      bg: "bg-rose-50",
                      text: "text-rose-700",
                      ring: "ring-rose-200",
                    },
                    {
                      bg: "bg-violet-50",
                      text: "text-violet-700",
                      ring: "ring-violet-200",
                    },
                  ];
                  const mt = memberThemes[mIdx % memberThemes.length];
                  return (
                    <Avatar
                      key={member.id}
                      className={`h-8 w-8 border-2 border-white shadow-sm ring-1 ${mt.ring}`}
                    >
                      {member.user?.photo && (
                        <AvatarImage
                          src={getImageUrl(member.user.photo) as string}
                        />
                      )}
                      <AvatarFallback
                        className={`${mt.bg} ${mt.text} text-[11px] font-bold`}
                      >
                        {member.user?.name?.charAt(0) || "M"}
                      </AvatarFallback>
                    </Avatar>
                  );
                })}

                {/* Overflow count */}
                {board.members?.length > 3 && (
                  <button className="h-8 w-8 rounded-full bg-slate-50 border-2 border-white flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all z-10 text-[11px] font-bold shadow-sm ring-1 ring-slate-100">
                    +{board.members.length - 3}
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[13px] font-semibold text-slate-500">
                  {totalMembers} members
                </span>
                <div className="w-px h-4 bg-slate-200" />
                <AddMemberModal boardId={board.id}>
                  <button className="flex items-center gap-1.5 text-[12px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50/60 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-all">
                    <UserPlus className="w-3.5 h-3.5" />
                    Invite
                  </button>
                </AddMemberModal>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <CreateColumnModal boardId={board.id}>
              <button className="flex items-center gap-2 px-3.5 py-2 text-[13px] font-semibold text-white bg-linear-to-br from-primary to-indigo-600 border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 hover:border-slate-300 hover:shadow-md transition-all">
                <Layout className="w-3.5 h-3.5" />
                Add Column
              </button>
            </CreateColumnModal>
            <CreateTaskModal
              columns={board.columns.map((c: IColumn) => ({
                id: c.id,
                title: c.title,
              }))}
              members={[
                board.owner,
                ...board.members.map((m: any) => m.user),
              ].map((u) => ({ id: u.id, name: u.name, photo: u.photo }))}
            >
              <button className="flex items-center gap-2 px-4 py-2 text-[13px] font-bold bg-linear-to-br from-primary to-indigo-600 text-white shadow-md rounded-xl shadow-indigo-200/50 hover:opacity-90 transition-all active:scale-[0.98] cursor-pointer">
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
          members={[board.owner, ...board.members.map((m: any) => m.user)].map(
            (u) => ({ id: u.id, name: u.name, photo: u.photo }),
          )}
        />
      </div>
    </div>
  );
}
