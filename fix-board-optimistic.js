const fs = require('fs');

let file = 'frontend/src/components/modules/Board/BoardCanvas.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Make Delete Task optimistic
const oldDelete = `  const handleDeleteTask = async (taskId: string) => {
    try {
      const res = await taskService.deleteTask(taskId);
      if (res.success) {
        toast.success("Task deleted successfully");
        router.refresh();
      } else {
        toast.error(res.message || "Failed to delete task");
      }
    } catch (error: any) {
      toast.error(error.message || "You don't have permission to delete this task");
    }
  };`;

const newDelete = `  const handleDeleteTask = async (taskId: string) => {
    // Optimistic UI update: instantly remove task from screen
    setColumns(prev => prev.map((col: any) => ({
      ...col,
      tasks: col.tasks.filter((t: any) => t.id !== taskId)
    })));

    try {
      const res = await taskService.deleteTask(taskId);
      if (res.success) {
        toast.success("Task deleted successfully");
        router.refresh(); // Background sync
      } else {
        toast.error(res.message || "Failed to delete task");
        setColumns(initialColumns); // Rollback on failure
      }
    } catch (error: any) {
      toast.error(error.message || "You don't have permission to delete this task");
      setColumns(initialColumns); // Rollback on failure
    }
  };

  const handleOptimisticCreate = (columnId: string, payload: any) => {
    // Generate a temporary fake task to instantly place on the board
    const tempTask = {
      id: "temp-" + Date.now(),
      title: payload.title,
      description: payload.description,
      priority: payload.priority ? payload.priority.charAt(0).toUpperCase() + payload.priority.slice(1).toLowerCase() : "Medium",
      comments: 0,
      attachments: [],
      assignees: payload.assigneeIds ? payload.assigneeIds.map((id: string) => members.find((m: any) => m.id === id)).filter(Boolean) : []
    };

    setColumns(prev => prev.map((col: any) => {
      if (col.id === columnId) {
        return { ...col, tasks: [...col.tasks, tempTask] }; // Append to bottom as new tasks usually go to bottom, or prepend
      }
      return col;
    }));
  };`;

content = content.replace(oldDelete, newDelete);

// 2. Pass handleOptimisticCreate to CreateTaskModal
content = content.replace(
  /<CreateTaskModal columnId=\{col\.id\} members=\{members\}>/g,
  '<CreateTaskModal columnId={col.id} members={members} onOptimisticCreate={handleOptimisticCreate}>'
);

// 3. What about the global new task button in the header?
// In page.tsx, we have a global New Task button. But let's check BoardCanvas if it renders one.
// No, the global one is in page.tsx. It won't have handleOptimisticCreate, which is fine, it will just be pessimistic.

fs.writeFileSync(file, content);
console.log('Fixed BoardCanvas optimistic updates');
