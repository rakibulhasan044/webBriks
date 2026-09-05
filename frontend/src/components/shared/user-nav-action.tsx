"use client";

import Link from "next/link";
import { LayoutDashboard, LogOut, User } from "lucide-react";
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
      <DropdownMenuTrigger className="flex items-center gap-3 focus:outline-none rounded-lg p-1.5 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
        <Avatar className="h-9 w-9 border border-slate-200 shadow-sm transition-all">
          {user.photo && typeof user.photo === "string" && user.photo !== "null" && (
            <AvatarImage src={user.photo} alt="User Avatar" className="object-cover" />
          )}
          <AvatarFallback className="bg-indigo-50 text-indigo-500">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div className="hidden sm:flex flex-col items-start text-left">
          <span className="text-sm font-semibold text-slate-900 leading-tight">
            {user.name || "User"}
          </span>
          <span className="text-xs text-slate-500 leading-tight">
            {user.email || "No email"}
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 mt-1">
        <DropdownMenuGroup className="sm:hidden">
          <DropdownMenuLabel className="font-normal p-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 border border-slate-200 shadow-sm">
                {user.photo && typeof user.photo === "string" && user.photo !== "null" && (
                  <AvatarImage src={user.photo} alt="User Avatar" className="object-cover" />
                )}
                <AvatarFallback className="bg-indigo-50 text-indigo-500">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1 overflow-hidden">
                <p className="text-sm font-semibold text-slate-900 leading-none truncate">
                  {user.name || "User"}
                </p>
                <p className="text-xs text-slate-500 leading-none truncate">
                  {user.email || "No email"}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="sm:hidden" />
        <DropdownMenuItem
          render={<Link href="/dashboard" />}
          className="cursor-pointer text-slate-600 hover:text-slate-900 focus:bg-slate-50"
        >
          <LayoutDashboard className="mr-2 h-4 w-4" />
          <span>Dashboard</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
