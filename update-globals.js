const fs = require('fs');
const file = 'frontend/src/app/globals.css';
let content = fs.readFileSync(file, 'utf8');

// Replace pure white variables with faded white (slate-50 equivalent: oklch(0.985 0 0))
content = content.replace(/--background: oklch\(1 0 0\);/g, '--background: oklch(0.985 0 0);');
content = content.replace(/--card: oklch\(1 0 0\);/g, '--card: oklch(0.985 0 0);');
content = content.replace(/--popover: oklch\(1 0 0\);/g, '--popover: oklch(0.985 0 0);');

fs.writeFileSync(file, content);
console.log('Updated globals.css');
