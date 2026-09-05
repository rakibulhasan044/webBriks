const fs = require('fs');
const file = 'frontend/src/components/modules/Dashboard/topbar.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add ChevronDown to imports
content = content.replace(
  'import { Search, Home, LogOut, User, Menu } from "lucide-react";',
  'import { Search, Home, LogOut, User, Menu, ChevronDown } from "lucide-react";'
);

// Replace DropdownMenu block
const triggerReplacement = `
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 focus:outline-none rounded-xl p-1.5 pr-3 hover:bg-slate-50 hover:shadow-sm transition-all duration-200 border border-transparent hover:border-slate-200/80 group">
            <Avatar className="h-9 w-9 border-2 border-white shadow-sm ring-1 ring-slate-100 transition-transform group-hover:scale-105">
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
              <AvatarFallback className="bg-indigo-50 text-indigo-600">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:flex flex-col items-start text-left">
              <span className="text-[13px] font-bold text-slate-800 leading-tight">
                {user?.name || "User"}
              </span>
              <span className="text-[11px] text-slate-400 font-medium leading-tight">
                {user?.email || "No email"}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block transition-transform group-data-[state=open]:rotate-180" />
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-60 mt-2 bg-white/85 backdrop-blur-2xl border border-slate-200/50 shadow-xl shadow-slate-200/20 rounded-2xl p-1.5">
            <DropdownMenuGroup className="sm:hidden">
              <DropdownMenuLabel className="font-normal p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-slate-100">
                    {user?.photo &&
                      typeof user.photo === "string" &&
                      user.photo !== "null" && (
                        <AvatarImage
                          src={user.photo}
                          alt="User Avatar"
                          className="object-cover"
                        />
                      )}
                    <AvatarFallback className="bg-indigo-50 text-indigo-600">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1 overflow-hidden">
                    <p className="text-sm font-bold text-slate-800 leading-none truncate">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-slate-400 font-medium leading-none truncate">
                      {user?.email || "No email"}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="sm:hidden bg-slate-100" />
            
            <DropdownMenuItem
              render={<Link href="/" />}
              className="rounded-xl cursor-pointer text-slate-600 hover:text-slate-900 focus:bg-sky-50 focus:text-sky-700 p-2.5"
            >
              <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center mr-3 shadow-sm">
                <Home className="w-4 h-4 text-sky-600" />
              </div>
              <span className="text-sm font-semibold">Home</span>
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
`;

const match = content.match(/<DropdownMenu>[\s\S]*?<\/DropdownMenu>/);
if (match) {
  content = content.replace(match[0], triggerReplacement.trim());
  fs.writeFileSync(file, content);
  console.log("Successfully updated topbar.tsx!");
} else {
  console.error("Could not find DropdownMenu block in topbar.tsx");
}
