const fs = require('fs');

let authFile = 'frontend/src/components/modules/auth/auth-card.tsx';
let authContent = fs.readFileSync(authFile, 'utf8');
authContent = authContent.replace(
  '<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md group-hover:shadow-indigo-500/25 transition-all">',
  '<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-md group-hover:shadow-indigo-500/25 transition-all">'
);
fs.writeFileSync(authFile, authContent);
console.log('Auth-card updated');
