const fs = require('fs');
let file = 'frontend/src/components/modules/Board/BoardCanvas.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:6001/api/v1';",
  "const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:6001/api/v1';"
);

fs.writeFileSync(file, content);
console.log('Fixed localhost to 127.0.0.1');
