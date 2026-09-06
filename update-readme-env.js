const fs = require('fs');

let file = 'README.md';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /1\. Create a `\.env` file in the root directory \(you can copy `\.env\.example`\)\./,
  `1. **Environment Variables:**
   - **Backend:** Create a \`.env\` file in the **root directory** (you can copy \`.env.example\`).
   - **Frontend:** Create a \`.env.local\` file inside the **\`frontend\` folder** (you can copy \`frontend/.env.example\`).`
);

content = content.replace(
  /### For Mac\/Linux Users \(Recommended\)\nSimply run the shell script:\n```bash\n\.\/start\.sh\n```/,
  `### For Mac/Linux Users (Recommended)\nSimply run the shell script from the root directory. This will automatically build everything and print out all the useful application links!\n\`\`\`bash\n./start.sh\n\`\`\``
);

fs.writeFileSync(file, content);
console.log('Updated README.md for env and start.sh');
