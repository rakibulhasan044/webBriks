import Link from "next/link";
import { cookies } from "next/headers";
import { UserNavAction } from "./user-nav-action";
import { NavLinks } from "./nav-links";

export async function Navbar() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("currentUser")?.value;
  let user = null;

  if (userCookie) {
    try {
      user = JSON.parse(userCookie);
    } catch (e) {
      console.error("Failed to parse user cookie", e);
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-sm">
                <div className="w-3.5 h-3.5 rounded-sm bg-slate-50"></div>
              </div>
              <span className="font-bold text-xl tracking-tight text-foreground">
                ZenBoard
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <NavLinks />

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <UserNavAction user={user} />
          </div>
        </div>
      </div>
    </header>
  );
}
