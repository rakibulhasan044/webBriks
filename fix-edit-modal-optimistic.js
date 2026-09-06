const fs = require('fs');

let file = 'frontend/src/components/modules/Board/EditTaskModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add prop type
content = content.replace(
  'export function EditTaskModal({ task, columns, members = [], isOpen, onClose }: any) {',
  'export function EditTaskModal({ task, columns, members = [], isOpen, onClose, onOptimisticEdit }: any) {'
);

// 2. Add Optimistic update before API call
const oldTry = `    setIsLoading(true);
    try {
      const payload: any = {
        title: result.data.title,
        description: result.data.description,
        priority: result.data.priority,
      };`;

const newTry = `    const payload: any = {
      title: result.data.title,
      description: result.data.description,
      priority: result.data.priority,
    };
    
    // Trigger Optimistic UI Update instantly
    if (onOptimisticEdit) {
      onOptimisticEdit(task.id, payload);
    }
    
    // Close modal instantly for a snappy feel!
    onClose();
    
    try {`;

content = content.replace(oldTry, newTry);

// 3. Remove onClose() from success block since we closed it instantly
content = content.replace(
  'toast.success("Task updated successfully!");\n        onClose();\n        router.refresh();',
  'toast.success("Task updated successfully!");\n        router.refresh();'
);

// 4. Handle errors
content = content.replace(
  'toast.error(res.message || "Failed to update task");',
  'toast.error(res.message || "Failed to update task");\n        router.refresh();'
);
content = content.replace(
  'toast.error(error.message || "An unexpected error occurred");',
  'toast.error(error.message || "An unexpected error occurred");\n      router.refresh();'
);
content = content.replace(
  'setIsLoading(false);',
  ''
);

fs.writeFileSync(file, content);
console.log('Fixed EditTaskModal optimistic update');
