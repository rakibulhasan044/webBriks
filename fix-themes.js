const fs = require('fs');

const file = 'frontend/src/app/(dashboardlayout)/dashboard/tasks/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldThemes = `const themes = [
                { border: "hover:border-amber-300", shadow: "hover:shadow-amber-100/50", badgeBg: "bg-amber-50", badgeText: "text-amber-700", badgeBorder: "border-amber-200", colBg: "bg-amber-100", colText: "text-amber-800" },
                { border: "hover:border-emerald-300", shadow: "hover:shadow-emerald-100/50", badgeBg: "bg-emerald-50", badgeText: "text-emerald-700", badgeBorder: "border-emerald-200", colBg: "bg-emerald-100", colText: "text-emerald-800" },
                { border: "hover:border-sky-300", shadow: "hover:shadow-sky-100/50", badgeBg: "bg-sky-50", badgeText: "text-sky-700", badgeBorder: "border-sky-200", colBg: "bg-sky-100", colText: "text-sky-800" },
                { border: "hover:border-violet-300", shadow: "hover:shadow-violet-100/50", badgeBg: "bg-violet-50", badgeText: "text-violet-700", badgeBorder: "border-violet-200", colBg: "bg-violet-100", colText: "text-violet-800" },
                { border: "hover:border-rose-300", shadow: "hover:shadow-rose-100/50", badgeBg: "bg-rose-50", badgeText: "text-rose-700", badgeBorder: "border-rose-200", colBg: "bg-rose-100", colText: "text-rose-800" },
              ];`;

const newThemes = `const themes = [
                { border: "hover:border-amber-300", shadow: "hover:shadow-amber-100/50", badgeBg: "bg-amber-50", badgeText: "text-amber-700", badgeBorder: "border-amber-200", colBg: "bg-amber-100", colText: "text-amber-800", lineBg: "bg-amber-400" },
                { border: "hover:border-emerald-300", shadow: "hover:shadow-emerald-100/50", badgeBg: "bg-emerald-50", badgeText: "text-emerald-700", badgeBorder: "border-emerald-200", colBg: "bg-emerald-100", colText: "text-emerald-800", lineBg: "bg-emerald-400" },
                { border: "hover:border-sky-300", shadow: "hover:shadow-sky-100/50", badgeBg: "bg-sky-50", badgeText: "text-sky-700", badgeBorder: "border-sky-200", colBg: "bg-sky-100", colText: "text-sky-800", lineBg: "bg-sky-400" },
                { border: "hover:border-violet-300", shadow: "hover:shadow-violet-100/50", badgeBg: "bg-violet-50", badgeText: "text-violet-700", badgeBorder: "border-violet-200", colBg: "bg-violet-100", colText: "text-violet-800", lineBg: "bg-violet-400" },
                { border: "hover:border-rose-300", shadow: "hover:shadow-rose-100/50", badgeBg: "bg-rose-50", badgeText: "text-rose-700", badgeBorder: "border-rose-200", colBg: "bg-rose-100", colText: "text-rose-800", lineBg: "bg-rose-400" },
              ];`;

content = content.replace(oldThemes, newThemes);

const oldLine = `<div className={\`absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full \${theme.colBg.replace('bg-', 'bg-').replace('100', '400')} opacity-60\`} />`;
const newLine = `<div className={\`absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full \${theme.lineBg} opacity-60\`} />`;

content = content.replace(oldLine, newLine);

fs.writeFileSync(file, content);
console.log('Fixed themes');
