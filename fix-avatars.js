const fs = require('fs');

const getImageUrlImport = 'import { getImageUrl } from "@/lib/utils";';

function processFile(file, isProfileSettings = false) {
  let content = fs.readFileSync(file, 'utf8');

  // Add getImageUrl import if missing
  if (!content.includes('getImageUrl')) {
    // Insert after the last import
    const lastImportIndex = content.lastIndexOf('import ');
    const endOfLastImport = content.indexOf('\n', lastImportIndex);
    content = content.substring(0, endOfLastImport) + '\n' + getImageUrlImport + content.substring(endOfLastImport);
  }

  if (isProfileSettings) {
    // Replace user.photo in useState initialization for preview
    content = content.replace(
      'user?.photo && user.photo !== "null" ? user.photo : null',
      'user?.photo && user.photo !== "null" ? (user.photo.startsWith("data:") ? user.photo : getImageUrl(user.photo)) : null'
    );
  } else {
    // Replace src={user.photo}
    content = content.replaceAll(
      'src={user.photo}',
      'src={getImageUrl(user.photo) as string}'
    );
  }

  fs.writeFileSync(file, content);
  console.log('Fixed', file);
}

processFile('frontend/src/components/shared/user-nav-action.tsx');
processFile('frontend/src/components/modules/Dashboard/topbar.tsx');
processFile('frontend/src/components/modules/Dashboard/sidebar.tsx');
processFile('frontend/src/components/modules/Profile/ProfileSettings.tsx', true);

