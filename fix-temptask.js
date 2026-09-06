const fs = require('fs');
let file = 'frontend/src/components/modules/Board/BoardCanvas.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'id: "temp-" + Date.now(),',
  'id: "temp-" + Date.now(),\n        position: 999999,'
);

fs.writeFileSync(file, content);
console.log('Fixed temptask');
