const fs = require('fs');
const file = 'frontend/src/components/modules/Dashboard/topbar.tsx';
let content = fs.readFileSync(file, 'utf8');

// Find the Home menu item and insert Profile before it
const profileItem = `
            <DropdownMenuItem
              render={<Link href="/dashboard/profile" />}
              className="rounded-xl cursor-pointer text-slate-600 hover:text-slate-900 focus:bg-indigo-50 focus:text-indigo-700 p-2.5"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center mr-3 shadow-sm">
                <User className="w-4 h-4 text-indigo-600" />
              </div>
              <span className="text-sm font-semibold">My Profile</span>
            </DropdownMenuItem>
`;

if (content.includes('<Home className="w-4 h-4 text-sky-600" />')) {
  // Insert before the Home item
  content = content.replace(
    /<DropdownMenuItem\s+render={<Link href="\/" \/>}/,
    profileItem.trim() + '\n            <DropdownMenuItem\n              render={<Link href="/" />}'
  );
  fs.writeFileSync(file, content);
  console.log("Successfully added Profile link to topbar.tsx!");
} else {
  console.error("Could not find Home menu item in topbar.tsx");
}
