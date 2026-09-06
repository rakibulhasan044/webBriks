const fs = require('fs');

// Fix CreateTaskModal
let file = 'frontend/src/components/modules/Board/CreateTaskModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// The error says: ReferenceError: onOptimisticCreate is not defined
content = content.replace(
  'export function CreateTaskModal({ children, columnId, columns = [], members = [] }: CreateTaskModalProps) {',
  'export function CreateTaskModal({ children, columnId, columns = [], members = [], onOptimisticCreate }: any) {'
);

// We should also update the interface if it exists
content = content.replace(
  'interface CreateTaskModalProps {\n  children: React.ReactNode;\n  columnId?: string;\n  columns?: any[];\n  members?: any[];\n}',
  'interface CreateTaskModalProps {\n  children: React.ReactNode;\n  columnId?: string;\n  columns?: any[];\n  members?: any[];\n  onOptimisticCreate?: (columnId: string, payload: any) => void;\n}'
);

content = content.replace(
  'export function CreateTaskModal({ children, columnId, columns = [], members = [] }: CreateTaskModalProps) {',
  'export function CreateTaskModal({ children, columnId, columns = [], members = [], onOptimisticCreate }: CreateTaskModalProps) {'
);

fs.writeFileSync(file, content);


// Fix EditTaskModal just in case
let file2 = 'frontend/src/components/modules/Board/EditTaskModal.tsx';
let content2 = fs.readFileSync(file2, 'utf8');

content2 = content2.replace(
  'export function EditTaskModal({ task, columns, members = [], isOpen, onClose }: EditTaskModalProps) {',
  'export function EditTaskModal({ task, columns, members = [], isOpen, onClose, onOptimisticEdit }: any) {'
);

content2 = content2.replace(
  'export function EditTaskModal({ task, columns = [], members = [], isOpen, onClose }: EditTaskModalProps) {',
  'export function EditTaskModal({ task, columns = [], members = [], isOpen, onClose, onOptimisticEdit }: any) {'
);

fs.writeFileSync(file2, content2);

console.log('Fixed props');
