const fs = require('fs');
let file = 'frontend/src/components/modules/Board/BoardCanvas.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add isConnected state
content = content.replace(
  'const [taskToEdit, setTaskToEdit] = useState<any>(null);',
  'const [taskToEdit, setTaskToEdit] = useState<any>(null);\n  const [isSocketConnected, setIsSocketConnected] = useState(false);'
);

// Update socket connection listeners
const oldSocketOn = `    socket.on('connect', () => {
      socket.emit('join_board', boardId);
    });`;
    
const newSocketOn = `    socket.on('connect', () => {
      setIsSocketConnected(true);
      socket.emit('join_board', boardId);
    });
    
    socket.on('disconnect', () => {
      setIsSocketConnected(false);
    });
    
    socket.on('connect_error', (err) => {
      console.error("Socket connect_error:", err);
      setIsSocketConnected(false);
    });`;

content = content.replace(oldSocketOn, newSocketOn);

// Render the Live indicator next to the filter button in page.tsx? 
// No, BoardCanvas doesn't render the header. 
// But BoardCanvas renders the columns wrapper. We can put it floating at the bottom right.
const renderPoint = `      <div className="flex gap-6 h-full pb-4">`;
const indicator = `      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur shadow-sm border text-xs font-medium border-slate-200">
        <div className={\`w-2 h-2 rounded-full \${isSocketConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}\`} />
        {isSocketConnected ? 'Live' : 'Disconnected'}
      </div>\n      <div className="flex gap-6 h-full pb-4">`;

content = content.replace(renderPoint, indicator);

fs.writeFileSync(file, content);
console.log('Added socket indicator');
