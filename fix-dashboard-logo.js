const fs = require('fs');

const fixLogo = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');

  // Regex to find the logo container in the dashboard
  // It usually looks like <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 ...">
  // and the <span>ZenBoard</span>
  
  const searchPattern = /<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-200\/50 group-hover:shadow-lg group-hover:shadow-indigo-200\/60 transition-all duration-300">\s*<div className="w-3 h-3 rounded-\[3px\] bg-slate-50\/90"><\/div>\s*<\/div>\s*<span className="text-lg font-bold text-slate-900 tracking-tight">ZenBoard<\/span>/g;
  
  const replacePattern = `<div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-sm">
            <div className="w-3.5 h-3.5 rounded-sm bg-slate-50"></div>
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">
            ZenBoard
          </span>`;

  if (content.match(searchPattern)) {
    content = content.replace(searchPattern, replacePattern);
    fs.writeFileSync(filePath, content);
    console.log('Fixed logo in', filePath);
  }
};

fixLogo('frontend/src/components/modules/Dashboard/sidebar.tsx');
fixLogo('frontend/src/components/modules/Dashboard/mobile-sidebar.tsx');
