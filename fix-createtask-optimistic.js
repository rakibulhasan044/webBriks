const fs = require('fs');

let file = 'frontend/src/components/modules/Board/CreateTaskModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add prop type
content = content.replace(
  'export function CreateTaskModal({ children, columnId, columns, members = [] }: any) {',
  'export function CreateTaskModal({ children, columnId, columns, members = [], onOptimisticCreate }: any) {'
);

// 2. Call it before API call
const oldTry = `    setIsLoading(true);
    try {
      const payload: any = {
        title: result.data.title,
        description: result.data.description,
        priority: result.data.priority,
      };
      if (result.data.assigneeIds && result.data.assigneeIds.length > 0) {
        payload.assigneeIds = result.data.assigneeIds;
      }

      // 1. Create the task`;

const newTry = `    const payload: any = {
      title: result.data.title,
      description: result.data.description,
      priority: result.data.priority,
    };
    if (result.data.assigneeIds && result.data.assigneeIds.length > 0) {
      payload.assigneeIds = result.data.assigneeIds;
    }

    // Trigger Optimistic UI Update instantly
    if (onOptimisticCreate) {
      onOptimisticCreate(result.data.selectedColumnId, payload);
    }
    
    // Close modal instantly for a snappy feel!
    setIsOpen(false);
    
    try {
      // 1. Create the task`;

content = content.replace(oldTry, newTry);

// 3. Remove setIsOpen(false) from success block since we closed it instantly
content = content.replace(
  'toast.success("Task created successfully!");\n        setIsOpen(false);\n        setAttachment(null);',
  'toast.success("Task created successfully!");\n        setAttachment(null);'
);

// 4. Handle errors (we don't rollback directly here because BoardCanvas will refresh, but router.refresh will fix it)
content = content.replace(
  'toast.error(res.message || "Failed to create task");',
  'toast.error(res.message || "Failed to create task");\n        router.refresh();'
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
console.log('Fixed CreateTaskModal optimistic update');
