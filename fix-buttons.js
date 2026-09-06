const fs = require('fs');

let file = 'frontend/src/components/ui/button.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'default: "bg-primary text-primary-foreground hover:bg-primary/80",',
  'default: "bg-indigo-600 text-white shadow-md shadow-indigo-200/50 hover:bg-indigo-700 transition-all active:scale-[0.98] cursor-pointer",'
);

fs.writeFileSync(file, content);
console.log('Fixed button.tsx');
const removeClasses = (filePath, regex, replacement = '') => {
  let text = fs.readFileSync(filePath, 'utf8');
  text = text.replace(regex, replacement);
  fs.writeFileSync(filePath, text);
};

// 1. LoginForm.tsx
removeClasses(
  'frontend/src/components/modules/auth/LoginForm.tsx',
  /bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 hover:from-indigo-600 hover:via-violet-600 hover:to-fuchsia-600/g,
  ''
);

// 2. RegisterForm.tsx
removeClasses(
  'frontend/src/components/modules/auth/RegisterForm.tsx',
  /bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 hover:from-indigo-600 hover:via-violet-600 hover:to-fuchsia-600/g,
  ''
);

// 3. CreateTaskModal.tsx
removeClasses(
  'frontend/src/components/modules/Board/CreateTaskModal.tsx',
  /bg-indigo-600 hover:bg-indigo-700 text-white/g,
  ''
);

// 4. EditTaskModal.tsx
removeClasses(
  'frontend/src/components/modules/Board/EditTaskModal.tsx',
  /bg-indigo-600 hover:bg-indigo-700 text-white/g,
  ''
);

// 5. page.tsx
removeClasses(
  'frontend/src/app/(dashboardlayout)/dashboard/boards/[boardId]/page.tsx',
  /bg-indigo-600 .*? hover:bg-indigo-700 .*? hover:-translate-y-0\.5 transition-all duration-200/g,
  'bg-indigo-600 text-white shadow-md shadow-indigo-200/50 hover:bg-indigo-700 transition-all active:scale-[0.98] cursor-pointer'
);

console.log('Removed explicit classes');
