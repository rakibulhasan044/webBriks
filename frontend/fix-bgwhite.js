const fs = require('fs');
const glob = require('glob');

const files = glob.sync('../frontend/src/components/modules/**/*.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('bg-white')) {
    // only replace whole word bg-white
    content = content.replace(/\bbg-white\b(?!(\/[0-9]+))/g, 'bg-slate-50');
    fs.writeFileSync(file, content);
    console.log('Fixed bg-white in', file);
  }
});
