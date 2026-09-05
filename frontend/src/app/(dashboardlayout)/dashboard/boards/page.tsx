import { Filter, Plus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import BoardCanvas from "@/components/modules/Board/BoardCanvas";

// Mock Data for Visual Design - this will eventually come from the database
const mockColumns = [
  {
    id: "col-1",
    title: "To Do",
    color: "border-pink-500",
    tasks: [
      { id: "t-1", title: "Company website redesign", priority: "Low", comments: 1, attachments: 2, users: ["/avatar1.png"] },
      { id: "t-2", title: "Mobile app login process prototype", priority: "Medium", comments: 2, attachments: 3, users: ["/avatar2.png"] },
      { id: "t-3", title: "Onboarding designs", priority: "High", comments: 1, attachments: 1, users: ["/avatar3.png"] },
    ]
  },
  {
    id: "col-2",
    title: "In Progress",
    color: "border-amber-500",
    tasks: [
      { id: "t-4", title: "Research and strategy for upcoming projects", priority: "High", comments: 1, attachments: 3, users: ["/avatar1.png", "/avatar2.png"] },
      { id: "t-5", title: "Account profile flow diagrams", priority: "Medium", comments: 1, attachments: 2, users: ["/avatar3.png"] },
      { id: "t-6", title: "Review administrator console designs", priority: "Low", comments: 2, attachments: 3, users: ["/avatar4.png"] },
    ]
  },
  {
    id: "col-3",
    title: "Done",
    color: "border-emerald-500",
    tasks: [
      { id: "t-9", title: "Review client spec document and give feedback", priority: "Low", comments: 1, attachments: 3, users: ["/avatar4.png"] },
      { id: "t-10", title: "Navigation designs", priority: "Medium", comments: 2, attachments: 3, users: ["/avatar3.png"] },
    ]
  }
];

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

export default function BoardsPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50/50 -m-6 md:-m-8">
      {/* Board Header (Server Component area) */}
      <div className="flex-none px-6 py-4 md:px-8 md:py-6 border-b border-slate-200 bg-white shadow-sm z-10 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Studio Board</h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center -space-x-2">
                <Avatar className="h-8 w-8 border-2 border-white"><AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">JD</AvatarFallback></Avatar>
                <Avatar className="h-8 w-8 border-2 border-white"><AvatarFallback className="bg-pink-100 text-pink-700 text-xs">AM</AvatarFallback></Avatar>
                <Avatar className="h-8 w-8 border-2 border-white"><AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs">RS</AvatarFallback></Avatar>
                <button className="h-8 w-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors z-10 text-xs font-medium">
                  +2
                </button>
              </div>
              <span className="text-sm font-medium text-slate-500">5 members</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors">
              <Plus className="w-4 h-4" />
              New Task
            </button>
          </div>
        </div>
      </div>

      {/* Board Canvas Wrapper */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 md:p-8">
        <BoardCanvas initialColumns={mockColumns} priorityStyles={priorityStyles} />
      </div>
    </div>
  );
}
