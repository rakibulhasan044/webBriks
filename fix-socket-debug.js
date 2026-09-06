const fs = require('fs');
let file = 'frontend/src/components/modules/Board/BoardCanvas.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "socket.on('task_updated', (updatedTask: any) => {",
  "socket.on('task_updated', (updatedTask: any) => {\n      console.log('SOCKET RECEIVED task_updated:', updatedTask);\n      // Optional: uncomment to show toast on receive\n      // toast.success('Socket event received!');"
);

fs.writeFileSync(file, content);
console.log('Added socket debug');
