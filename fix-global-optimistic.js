const fs = require('fs');

// 1. Update CreateTaskModal to dispatch CustomEvent if no prop
let modalFile = 'frontend/src/components/modules/Board/CreateTaskModal.tsx';
let modalContent = fs.readFileSync(modalFile, 'utf8');

modalContent = modalContent.replace(
  'if (onOptimisticCreate) {\n      onOptimisticCreate(result.data.selectedColumnId, payload);\n    }',
  'if (onOptimisticCreate) {\n      onOptimisticCreate(result.data.selectedColumnId, payload);\n    } else if (typeof window !== "undefined") {\n      window.dispatchEvent(new CustomEvent("optimisticCreate", { detail: { columnId: result.data.selectedColumnId, payload } }));\n    }'
);

fs.writeFileSync(modalFile, modalContent);

// 2. Update BoardCanvas to listen to it
let boardFile = 'frontend/src/components/modules/Board/BoardCanvas.tsx';
let boardContent = fs.readFileSync(boardFile, 'utf8');

const effectCode = `  React.useEffect(() => {
    const handleEvent = (e: any) => {
      const { columnId, payload } = e.detail;
      
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
          return { ...col, tasks: [...col.tasks, tempTask] };
        }
        return col;
      }));
    };
    
    window.addEventListener('optimisticCreate', handleEvent);
    return () => window.removeEventListener('optimisticCreate', handleEvent);
  }, [members]);

  const handleOptimisticCreate = (columnId: string, payload: any) => {`;

boardContent = boardContent.replace('const handleOptimisticCreate = (columnId: string, payload: any) => {', effectCode);

fs.writeFileSync(boardFile, boardContent);
console.log('Fixed global optimistic UI');
