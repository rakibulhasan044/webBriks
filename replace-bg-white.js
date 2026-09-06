const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./frontend/src');

let count = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  // Match bg-white with optional opacity /XX
  // regex explanation: \bbg-white\b optionally followed by \/\d+
  const regex = /\bbg-white\b(?!\/)/g;
  
  if (content.match(regex) || content.match(/\bbg-white\//g)) {
    // replace bg-white/XX with bg-slate-50/XX
    content = content.replace(/\bbg-white(\/\d+)?/g, (match, opacity) => {
      return opacity ? `bg-slate-50${opacity}` : 'bg-slate-50';
    });
    fs.writeFileSync(file, content);
    count++;
  }
}

console.log(`Updated ${count} files.`);
