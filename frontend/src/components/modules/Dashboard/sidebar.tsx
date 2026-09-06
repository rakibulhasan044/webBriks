"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  KanbanSquare, 
  CheckSquare,
  LogOut,

  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImageUrl } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Boards", href: "/dashboard/boards", icon: KanbanSquare },
  { name: "My Tasks", href: "/dashboard/tasks", icon: CheckSquare },
  { name: "Profile", href: "/dashboard/profile", icon: User },
];

export function Sidebar({ user }: { user?: any }) {
  const pathname = usePathname();

return (
    <div className="flex h-screen w-64 flex-col border-r border-slate-200/80 bg-slate-50">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-5 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-200/50 group-hover:shadow-lg group-hover:shadow-indigo-200/60 transition-all duration-300">
            <div className="w-3 h-3 rounded-[3px] bg-slate-50/90"></div>
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">ZenBoard</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 px-3 py-5 overflow-y-auto">
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-3">
            Overview
          </div>
          <div className="space-y-0.5">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-semibold transition-all duration-200 relative",
                    isActive
                      ? "bg-indigo-50/80 text-indigo-700"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-indigo-500" />
                  )}
                  <item.icon
                    className={cn(
                      "h-[18px] w-[18px] flex-shrink-0 transition-colors duration-200",
                      isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-500"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* User Profile / Logout Bottom Section */}
      <div className="border-t border-slate-100 p-4">
        <div className="flex items-center gap-3 mb-3 p-2 rounded-xl bg-slate-50/80 border border-slate-100">
          <Avatar className="h-9 w-9 border-2 border-white shadow-sm ring-1 ring-slate-100">
            {user?.photo && typeof user.photo === 'string' && user.photo !== "null" && (
              <AvatarImage src={getImageUrl(user.photo) as string} alt="Avatar" className="object-cover" />
            )}
            <AvatarFallback className="bg-gradient-to-br from-indigo-100 to-violet-100 text-indigo-600">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col overflow-hidden min-w-0">
            <span className="text-sm font-bold text-slate-900 truncate">{user?.name || "User"}</span>
            <span className="text-[11px] text-slate-400 font-medium truncate">{user?.email || "email@example.com"}</span>
          </div>
        </div>
        
        <button 
          onClick={() => {
            document.cookie = "accessToken=; path=/; max-age=0";
            document.cookie = "refreshToken=; path=/; max-age=0";
            document.cookie = "currentUser=; path=/; max-age=0";
            window.location.href = "/login";
          }}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50/60 transition-all duration-200"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Log out
        </button>
      </div>
    </div>
  );
}
