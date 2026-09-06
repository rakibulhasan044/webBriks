const fs = require('fs');

let file = 'frontend/src/components/modules/Board/BoardCanvas.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add handleOptimisticEdit
const insertBefore = `  return (
    <DragDropContext onDragEnd={onDragEnd}>`;

const editMethod = `  const handleOptimisticEdit = (taskId: string, payload: any) => {
    setColumns(prev => prev.map((col: any) => {
      // If column changed, remove from old column and add to new column
      // But for simplicity, we just update it if it exists in the same column
      // For now, let's just update the title/description/priority locally
      return {
        ...col,
        tasks: col.tasks.map((t: any) => {
          if (t.id === taskId) {
            return {
              ...t,
              title: payload.title,
              description: payload.description,
              priority: payload.priority ? payload.priority.charAt(0).toUpperCase() + payload.priority.slice(1).toLowerCase() : "Medium",
            };
          }
          return t;
        })
      };
    }));
  };

`;

content = content.replace(insertBefore, editMethod + insertBefore);

// Update EditTaskModal props
content = content.replace(
  '<EditTaskModal \n          task={taskToEdit} \n          columns={columns} \n          members={members} \n          isOpen={true} \n          onClose={() => setTaskToEdit(null)} \n        />',
  '<EditTaskModal \n          task={taskToEdit} \n          columns={columns} \n          members={members} \n          isOpen={true} \n          onClose={() => setTaskToEdit(null)} \n          onOptimisticEdit={handleOptimisticEdit}\n        />'
);

fs.writeFileSync(file, content);
console.log('Added handleOptimisticEdit to BoardCanvas');
