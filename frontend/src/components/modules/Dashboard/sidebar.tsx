"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  KanbanSquare, 
  CheckSquare, 
  Settings, 
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
    <div className="flex h-screen w-64 flex-col border-r border-slate-200 bg-slate-50">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-sm">
            <div className="w-3.5 h-3.5 rounded-sm bg-slate-50"></div>
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">ZenBoard</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-3">
          Overview
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 flex-shrink-0 transition-colors",
                  isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-600"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Profile / Logout Bottom Section */}
      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center gap-3 mb-4 px-2">
          <Avatar className="h-9 w-9 border border-slate-200 shadow-sm">
            {user?.photo && typeof user.photo === 'string' && user.photo !== "null" && (
              <AvatarImage src={getImageUrl(user.photo) as string} alt="Avatar" className="object-cover" />
            )}
            <AvatarFallback className="bg-indigo-50 text-indigo-500">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold text-slate-900 truncate">{user?.name || "User"}</span>
            <span className="text-xs text-slate-500 truncate">{user?.email || "email@example.com"}</span>
          </div>
        </div>
        
        <button 
          onClick={() => {
            document.cookie = "accessToken=; path=/; max-age=0";
            document.cookie = "refreshToken=; path=/; max-age=0";
            document.cookie = "currentUser=; path=/; max-age=0";
            window.location.href = "/login";
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Log out
        </button>
      </div>
    </div>
  );
}
