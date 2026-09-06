const fs = require('fs');
const file = 'frontend/src/components/shared/user-nav-action.tsx';
let content = fs.readFileSync(file, 'utf8');

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

if (content.includes('<LayoutDashboard className="w-4 h-4 text-sky-600" />')) {
  // Insert before the Dashboard item
  content = content.replace(
    /<DropdownMenuItem\s+render={<Link href="\/dashboard" \/>}/,
    profileItem.trim() + '\n        <DropdownMenuItem\n          render={<Link href="/dashboard" />}'
  );
  fs.writeFileSync(file, content);
  console.log("Successfully added Profile link to user-nav-action.tsx!");
} else {
  console.error("Could not find Dashboard menu item in user-nav-action.tsx");
}
