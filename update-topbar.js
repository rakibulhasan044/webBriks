const fs = require('fs');

let file = 'frontend/src/components/modules/Dashboard/topbar.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add import
content = content.replace(
  'import { getImageUrl } from "@/lib/utils";',
  'import { getImageUrl } from "@/lib/utils";\nimport { MobileSidebar } from "./mobile-sidebar";'
);

// Replace static menu button
const oldMenu = `<button className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
          <Menu className="w-5 h-5" />
        </button>`;
        
const newMenu = `<MobileSidebar user={user} />`;

content = content.replace(oldMenu, newMenu);
fs.writeFileSync(file, content);
console.log('Topbar updated');
