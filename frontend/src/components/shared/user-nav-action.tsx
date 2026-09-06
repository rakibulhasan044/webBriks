"use client";

import Link from "next/link";
import { ChevronDown, LayoutDashboard, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImageUrl } from "@/lib/utils";

export function UserNavAction({ user }: { user: any | null }) {
  const handleLogout = () => {
    document.cookie = "accessToken=; path=/; max-age=0";
    document.cookie = "refreshToken=; path=/; max-age=0";
    document.cookie = "currentUser=; path=/; max-age=0";
    window.location.href = "/login";
  };

  if (!user) {
    return (
      <Link
        href="/login"
        className="px-5 py-2 text-sm font-medium bg-slate-900 text-white rounded-lg shadow-sm hover:bg-slate-800 transition-colors"
      >
        Log in
      </Link>
    );
  }

return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 focus:outline-none rounded-xl p-1.5 pr-3 hover:bg-slate-50 hover:shadow-sm transition-all duration-200 border border-transparent hover:border-slate-200/80 group">
        <Avatar className="h-9 w-9 border-2 border-white shadow-sm ring-1 ring-slate-100 transition-transform group-hover:scale-105">
          {user.photo && typeof user.photo === "string" && user.photo !== "null" && (
            <AvatarImage src={getImageUrl(user.photo) as string} alt="User Avatar" className="object-cover" />
          )}
          <AvatarFallback className="bg-indigo-50 text-indigo-600">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div className="hidden sm:flex flex-col items-start text-left">
          <span className="text-[13px] font-bold text-slate-800 leading-tight">
            {user.name || "User"}
          </span>
          <span className="text-[11px] text-slate-400 font-medium leading-tight">
            {user.email || "No email"}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block transition-transform group-data-[state=open]:rotate-180" />
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-60 mt-2 bg-slate-50/85 backdrop-blur-2xl border border-slate-200/50 shadow-xl shadow-slate-200/20 rounded-2xl p-1.5">
        {/* Mobile user info */}
        <DropdownMenuGroup className="sm:hidden">
          <DropdownMenuLabel className="font-normal p-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-slate-100">
                {user.photo && typeof user.photo === "string" && user.photo !== "null" && (
                  <AvatarImage src={getImageUrl(user.photo) as string} alt="User Avatar" className="object-cover" />
                )}
                <AvatarFallback className="bg-indigo-50 text-indigo-600">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1 overflow-hidden">
                <p className="text-sm font-bold text-slate-800 leading-none truncate">
                  {user.name || "User"}
                </p>
                <p className="text-xs text-slate-400 font-medium leading-none truncate">
                  {user.email || "No email"}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="sm:hidden bg-slate-100" />
        
        {/* Menu Items */}
        <DropdownMenuItem
          render={<Link href="/dashboard/profile" />}
          className="rounded-xl cursor-pointer text-slate-600 hover:text-slate-900 focus:bg-indigo-50 focus:text-indigo-700 p-2.5"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center mr-3 shadow-sm">
            <User className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-sm font-semibold">My Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          render={<Link href="/dashboard" />}
          className="rounded-xl cursor-pointer text-slate-600 hover:text-slate-900 focus:bg-sky-50 focus:text-sky-700 p-2.5"
        >
          <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center mr-3 shadow-sm">
            <LayoutDashboard className="w-4 h-4 text-sky-600" />
          </div>
          <span className="text-sm font-semibold">Dashboard</span>
        </DropdownMenuItem>
        
        <div className="h-px bg-slate-100 my-1" />
        
        <DropdownMenuItem
          onClick={handleLogout}
          className="rounded-xl cursor-pointer focus:bg-rose-50 focus:text-rose-700 p-2.5"
        >
          <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center mr-3 shadow-sm">
            <LogOut className="w-4 h-4 text-rose-600" />
          </div>
          <span className="text-sm font-semibold text-rose-600">Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
