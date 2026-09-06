const fs = require('fs');
let file = 'frontend/src/components/modules/Profile/ProfileSettings.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors/g,
  'bg-indigo-600 text-white font-medium rounded-lg shadow-md shadow-indigo-200/50 hover:bg-indigo-700 transition-all active:scale-[0.98] cursor-pointer'
);

fs.writeFileSync(file, content);
console.log('Fixed ProfileSettings');
