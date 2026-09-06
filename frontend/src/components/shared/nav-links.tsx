"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLinks() {
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Blog", href: "/blog" },
  ];

  return (
    <nav className="hidden md:flex items-center gap-8">
      {links.map((link) => {
        // For Home "/", we want an exact match. For others, we can do exact match or startsWith.
        const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

        return (
          <Link
            key={link.name}
            href={link.href}
            className={`text-sm transition-colors ${
              isActive
                ? "font-bold text-indigo-600"
                : "font-medium text-muted-foreground hover:text-foreground"
            }`}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}
