const fs = require('fs');
const file = 'frontend/src/components/shared/navbar.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'import { UserNavAction } from "./user-nav-action";',
  'import { UserNavAction } from "./user-nav-action";\nimport { NavLinks } from "./nav-links";'
);

const oldNav = `<nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Blog
            </Link>
          </nav>`;

content = content.replace(oldNav, '<NavLinks />');

fs.writeFileSync(file, content);
console.log("Successfully updated navbar.tsx");
