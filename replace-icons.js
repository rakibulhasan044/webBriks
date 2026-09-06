const fs = require('fs');

// 1. Update Hero section
let heroFile = 'frontend/src/components/modules/Home/hero.tsx';
let heroContent = fs.readFileSync(heroFile, 'utf8');
heroContent = heroContent.replace(
  '<div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-200/50">',
  '<div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200/50">'
);
fs.writeFileSync(heroFile, heroContent);
console.log('Hero updated');

// 2. Update Sidebar
let sidebarFile = 'frontend/src/components/modules/Dashboard/sidebar.tsx';
let sidebarContent = fs.readFileSync(sidebarFile, 'utf8');
sidebarContent = sidebarContent.replace(
  '<div className="bg-emerald-500 p-1.5 rounded-lg">\n            <Hexagon className="h-5 w-5 text-white fill-white" />\n          </div>',
  '<div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-sm">\n            <div className="w-3.5 h-3.5 rounded-sm bg-slate-50"></div>\n          </div>'
);
fs.writeFileSync(sidebarFile, sidebarContent);
console.log('Sidebar updated');
