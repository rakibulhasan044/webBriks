const fs = require('fs');

let file = 'frontend/src/app/(commonLayout)/about/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'src="/webBriks/frontend/public/about-us.jpg"',
  'src="/about-us.jpg"'
);

fs.writeFileSync(file, content);
console.log('Fixed image src');
