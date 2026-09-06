const fs = require('fs');

let file = 'frontend/src/components/modules/Board/BoardCanvas.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add Search Icon import
if (!content.includes('Search')) {
  content = content.replace(
    'import { Plus, MoreVertical, Pencil, Trash2 } from "lucide-react";',
    'import { Plus, MoreVertical, Pencil, Trash2, Search } from "lucide-react";'
  );
}

// 2. Add searchQuery state
if (!content.includes('searchQuery')) {
  content = content.replace(
    'const [isSocketConnected, setIsSocketConnected] = useState(false);',
    'const [isSocketConnected, setIsSocketConnected] = useState(false);\n  const [searchQuery, setSearchQuery] = useState("");'
  );
}

// 3. Replace the return statement to wrap DragDropContext and add the Search Bar
const searchBarUI = `  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="mb-6 w-full max-w-sm shrink-0">
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            type="text"
            placeholder="Search tasks by title or description..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 text-[13px] font-medium bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 text-slate-700"
          />
        </div>
      </div>
      
      <DragDropContext onDragEnd={onDragEnd}>`;

content = content.replace('  return (\n    <DragDropContext onDragEnd={onDragEnd}>', searchBarUI);

// Wrap the end of DragDropContext with a closing div
content = content.replace(
  '    </DragDropContext>\n  );\n}',
  '    </DragDropContext>\n    </div>\n  );\n}'
);

// 4. Update the task map
const tasksMapReplace = `{col.tasks.filter((task: any) => {
                      if (!searchQuery) return true;
                      const q = searchQuery.toLowerCase();
                      return task.title.toLowerCase().includes(q) || (task.description && task.description.toLowerCase().includes(q));
                    }).map((task: any, index: number) => {`;

content = content.replace(/\{col\.tasks\.map\(\(task: any, index: number\) => \{/g, tasksMapReplace);

// 5. Disable dragging if searching
content = content.replace(
  /<Draggable\s*key=\{task\.id\}\s*draggableId=\{task\.id\}\s*index=\{index\}\s*>/g,
  '<Draggable\n                          key={task.id}\n                          draggableId={task.id}\n                          index={index}\n                          isDragDisabled={!!searchQuery}\n                        >'
);

fs.writeFileSync(file, content);
console.log('Fixed search feature');
