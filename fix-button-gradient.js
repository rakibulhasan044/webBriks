const fs = require('fs');

const updateGradient = (file, isShadcn = false) => {
  let content = fs.readFileSync(file, 'utf8');
  
  if (isShadcn) {
    content = content.replace(
      'default: "bg-indigo-600 text-white shadow-md shadow-indigo-200/50 hover:bg-indigo-700 transition-all active:scale-[0.98] cursor-pointer",',
      'default: "bg-gradient-to-br from-primary to-indigo-600 text-white shadow-md shadow-indigo-200/50 hover:from-primary/90 hover:to-indigo-600/90 transition-all active:scale-[0.98] cursor-pointer",'
    );
  } else {
    content = content.replace(
      /bg-indigo-600 text-white shadow-md shadow-indigo-200\/50 hover:bg-indigo-700 transition-all active:scale-\[0\.98\] cursor-pointer/g,
      'bg-gradient-to-br from-primary to-indigo-600 text-white shadow-md shadow-indigo-200/50 hover:from-primary/90 hover:to-indigo-600/90 transition-all active:scale-[0.98] cursor-pointer'
    );
  }
  
  fs.writeFileSync(file, content);
};

updateGradient('frontend/src/components/ui/button.tsx', true);
updateGradient('frontend/src/app/(dashboardlayout)/dashboard/boards/[boardId]/page.tsx');
updateGradient('frontend/src/components/modules/Profile/ProfileSettings.tsx');

console.log('Fixed button gradient');
