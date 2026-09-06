const fs = require('fs');

let file = '../frontend/src/components/shared/ThemeToggle.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors focus:outline-none"',
  'className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors focus:outline-none flex items-center justify-center"'
);

fs.writeFileSync(file, content);
console.log('Fixed ThemeToggle');
