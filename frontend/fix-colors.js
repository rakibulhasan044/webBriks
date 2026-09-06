const fs = require('fs');

let file = '../frontend/src/app/globals.css';
let content = fs.readFileSync(file, 'utf8');

const slateVarsRoot = `
  --slate-50: #f8fafc;
  --slate-100: #f1f5f9;
  --slate-200: #e2e8f0;
  --slate-300: #cbd5e1;
  --slate-400: #94a3b8;
  --slate-500: #64748b;
  --slate-600: #475569;
  --slate-700: #334155;
  --slate-800: #1e293b;
  --slate-900: #0f172a;
`;

const slateVarsDark = `
  --slate-50: #0f172a;
  --slate-100: #1e293b;
  --slate-200: #334155;
  --slate-300: #475569;
  --slate-400: #64748b;
  --slate-500: #94a3b8;
  --slate-600: #cbd5e1;
  --slate-700: #e2e8f0;
  --slate-800: #f1f5f9;
  --slate-900: #f8fafc;
`;

const slateTheme = `
  --color-slate-50: var(--slate-50);
  --color-slate-100: var(--slate-100);
  --color-slate-200: var(--slate-200);
  --color-slate-300: var(--slate-300);
  --color-slate-400: var(--slate-400);
  --color-slate-500: var(--slate-500);
  --color-slate-600: var(--slate-600);
  --color-slate-700: var(--slate-700);
  --color-slate-800: var(--slate-800);
  --color-slate-900: var(--slate-900);
`;

content = content.replace(':root {', ':root {' + slateVarsRoot);
content = content.replace('.dark {', '.dark {' + slateVarsDark);
content = content.replace('@theme inline {', '@theme inline {' + slateTheme);

// Also replace the hardcoded pure white oklch colors with something that respects dark mode
content = content.replace(/oklch\(0\.985 0 0\)/g, 'var(--slate-50)');
content = content.replace(/oklch\(0\.145 0 0\)/g, 'var(--slate-900)');
// Actually, let's just let shadcn keep its own foreground/background mapped to slate
content = content.replace('--background: var(--slate-50);', '--background: var(--slate-50);');

fs.writeFileSync(file, content);
console.log('Fixed globals.css');
