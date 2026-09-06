const fs = require('fs');

let file = 'frontend/src/components/ui/sonner.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('import { useTheme } from "next-themes"\n', '');
content = content.replace('const { theme = "system" } = useTheme()', 'const theme = "light"');

fs.writeFileSync(file, content);
console.log('Fixed sonner');
