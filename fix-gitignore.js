const fs = require('fs');

let file = 'frontend/.gitignore';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '.env*',
  '.env*\n!.env.example'
);

fs.writeFileSync(file, content);
console.log('Fixed gitignore');
