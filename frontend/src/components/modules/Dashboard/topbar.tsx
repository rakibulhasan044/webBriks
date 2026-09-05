"use client";

import { Search, Home, LogOut, User, Menu } from "lucide-react";
import Link from "next/link";
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
import { IUser } from "@/types/user.type";

export function Topbar({ user }: { user?: IUser }) {
  
  const handleLogout = () => {
    document.cookie = "accessToken=; path=/; max-age=0";
    document.cookie = "refreshToken=; path=/; max-age=0";
    document.cookie = "currentUser=; path=/; max-age=0";
    window.location.href = "/login";
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-200 z-10">
      {/* Left: Mobile Menu Toggle & Search Bar */}
      <div className="flex items-center gap-4 flex-1">
        <button className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search boards, tasks..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Right: User Avatar & Dropdown (Using Shadcn) */}
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 focus:outline-none rounded-lg p-1.5 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
            <Avatar className="h-9 w-9 border border-indigo-100 shadow-sm transition-all">
              {/* Only attempt to load if it's a valid string. If it fails, AvatarFallback takes over! */}
              {user?.photo &&
                typeof user.photo === "string" &&
                user.photo !== "null" && (
                  <AvatarImage
                    src={user.photo}
                    alt="User Avatar"
                    className="object-cover"
                  />
                )}
              <AvatarFallback className="bg-indigo-50 text-indigo-500">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:flex flex-col items-start text-left pr-2">
              <span className="text-sm font-semibold text-slate-900 leading-tight">
                {user?.name || "User"}
              </span>
              <span className="text-xs text-slate-500 leading-tight">
                {user?.email || "No email"}
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-1">
            <DropdownMenuGroup className="sm:hidden">
              <DropdownMenuLabel className="font-normal p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 border border-indigo-100 shadow-sm">
                    {user?.photo &&
                      typeof user.photo === "string" &&
                      user.photo !== "null" && (
                        <AvatarImage
                          src={user.photo}
                          alt="User Avatar"
                          className="object-cover"
                        />
                      )}
                    <AvatarFallback className="bg-indigo-50 text-indigo-500">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1 overflow-hidden">
                    <p className="text-sm font-semibold text-slate-900 leading-none truncate">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-slate-500 leading-none truncate">
                      {user?.email || "No email"}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="sm:hidden" />
            <DropdownMenuItem
              render={<Link href="/" />}
              className="cursor-pointer text-slate-600 hover:text-slate-900 focus:bg-slate-50"
            >
              <Home className="mr-2 h-4 w-4" />
              <span>Home</span>
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
      </div>
    </header>
  );
}
