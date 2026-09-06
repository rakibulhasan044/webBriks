const fs = require('fs');

const fixLogout = (file) => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/window\.location\.href = "\/login";/g, 'window.location.replace("/");');
  fs.writeFileSync(file, content);
};

fixLogout('frontend/src/components/modules/Dashboard/topbar.tsx');
fixLogout('frontend/src/components/modules/Dashboard/sidebar.tsx');
console.log('Fixed logout');
fixLogout('frontend/src/components/shared/user-nav-action.tsx');
console.log('Fixed user-nav-action');
