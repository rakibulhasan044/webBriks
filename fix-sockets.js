const fs = require('fs');

let file = 'frontend/src/components/modules/Board/BoardCanvas.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldSocketCode = `    const handleUpdate = () => {
      router.refresh();
    };

    socket.on('task_created', handleUpdate);
    socket.on('task_updated', handleUpdate);
    socket.on('task_deleted', handleUpdate);
    socket.on('column_created', handleUpdate);
    socket.on('column_updated', handleUpdate);
    socket.on('column_deleted', handleUpdate);`;

const newSocketCode = `    socket.on('task_created', (task: any) => {
      // Background sync
      router.refresh();
    });
    
    socket.on('task_updated', (updatedTask: any) => {
      setColumns(prev => prev.map((col: any) => {
        // If the task changed columns, we need to remove it from the old one and add to new
        if (col.tasks.some((t: any) => t.id === updatedTask.id) && col.id !== updatedTask.columnId) {
          return { ...col, tasks: col.tasks.filter((t: any) => t.id !== updatedTask.id) };
        }
        
        // If this is the new column, add it (and sort)
        if (col.id === updatedTask.columnId) {
          const hasTask = col.tasks.some((t: any) => t.id === updatedTask.id);
          let newTasks = col.tasks;
          
          if (!hasTask) {
            // It moved to this column
            // Convert priority for UI if needed
            const formattedTask = {
              ...updatedTask,
              priority: updatedTask.priority ? updatedTask.priority.charAt(0).toUpperCase() + updatedTask.priority.slice(1).toLowerCase() : "Medium",
            };
            newTasks = [...col.tasks, formattedTask];
          } else {
            // It was already in this column, just update position/data
            newTasks = col.tasks.map((t: any) => t.id === updatedTask.id ? {
              ...t,
              title: updatedTask.title,
              description: updatedTask.description,
              position: updatedTask.position,
              priority: updatedTask.priority ? updatedTask.priority.charAt(0).toUpperCase() + updatedTask.priority.slice(1).toLowerCase() : "Medium",
            } : t);
          }
          
          // Sort by position
          return { ...col, tasks: newTasks.sort((a: any, b: any) => Number(a.position) - Number(b.position)) };
        }
        
        return col;
      }));
    });
    
    socket.on('task_deleted', (data: { id: string }) => {
      setColumns(prev => prev.map((col: any) => ({
        ...col,
        tasks: col.tasks.filter((t: any) => t.id !== data.id)
      })));
    });
    
    socket.on('column_created', () => router.refresh());
    socket.on('column_updated', () => router.refresh());
    socket.on('column_deleted', () => router.refresh());`;

content = content.replace(oldSocketCode, newSocketCode);
fs.writeFileSync(file, content);
console.log('Fixed WebSockets');
