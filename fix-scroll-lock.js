const fs = require('fs');

let file = 'frontend/src/components/modules/Dashboard/mobile-sidebar.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'document.body.style.overflow = "auto";\n    }',
  'document.body.style.overflow = "auto";\n    }\n    return () => {\n      document.body.style.overflow = "auto";\n    };\n'
);

fs.writeFileSync(file, content);
console.log('Fixed scroll lock cleanup');
