const fs = require('fs');

let file = 'frontend/src/components/modules/Dashboard/mobile-sidebar.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '<div className="absolute right-4 top-4">',
  '<div className="absolute right-4 top-3 z-50">'
);

fs.writeFileSync(file, content);
console.log('Fixed close button');
