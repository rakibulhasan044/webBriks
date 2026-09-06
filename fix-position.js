const fs = require('fs');

let file = 'frontend/src/app/(dashboardlayout)/dashboard/boards/[boardId]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'description: task.description,',
  'description: task.description,\n        position: task.position,'
);

fs.writeFileSync(file, content);
console.log('Fixed position bug');
