const fs = require('fs');
let file = '../frontend/src/components/modules/Dashboard/topbar.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'import { MobileSidebar } from "./mobile-sidebar";',
  'import { MobileSidebar } from "./mobile-sidebar";\nimport { ThemeToggle } from "@/components/shared/ThemeToggle";'
);

content = content.replace(
  '{/* Right: User Avatar & Dropdown (Using Shadcn) */}\n      <div className="flex items-center gap-4">',
  '{/* Right: User Avatar & Dropdown (Using Shadcn) */}\n      <div className="flex items-center gap-2 sm:gap-4">\n        <ThemeToggle />'
);

fs.writeFileSync(file, content);
console.log('Fixed topbar');
