const fs = require('fs');
const file = 'frontend/src/components/modules/Profile/ProfileSettings.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add Zod imports
content = content.replace(
  'import Cookies from "js-cookie";',
  'import Cookies from "js-cookie";\nimport { updateProfileSchema, changePasswordSchema } from "@/zod/user.validation";\nimport { z } from "zod";'
);

// Add error states
const errorStates = `
  const [profileErrors, setProfileErrors] = useState<{ name?: string[]; photo?: string[] }>({});
  const [passwordErrors, setPasswordErrors] = useState<{ oldPassword?: string[]; newPassword?: string[]; confirmPassword?: string[] }>({});
`;

content = content.replace(
  'const [isChangingPassword, setIsChangingPassword] = useState(false);',
  'const [isChangingPassword, setIsChangingPassword] = useState(false);\n' + errorStates
);

// Update handleUpdateProfile
const oldHandleUpdateProfile = `
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    setIsUpdatingProfile(true);
    try {
      const res = await userService.updateProfile({ name, photo: photoFile });
`;

const newHandleUpdateProfile = `
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileErrors({});
    
    try {
      updateProfileSchema.parse({ name, photo: photoFile });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setProfileErrors(error.flatten().fieldErrors);
        return;
      }
    }

    setIsUpdatingProfile(true);
    try {
      const res = await userService.updateProfile({ name, photo: photoFile });
`;

content = content.replace(oldHandleUpdateProfile.trim(), newHandleUpdateProfile.trim());

// Update handleChangePassword
const oldHandleChangePassword = `
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword) {
      toast.error("Current password is required");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setIsChangingPassword(true);
`;

const newHandleChangePassword = `
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrors({});

    try {
      changePasswordSchema.parse({ oldPassword, newPassword, confirmPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setPasswordErrors(error.flatten().fieldErrors);
        return;
      }
    }

    setIsChangingPassword(true);
`;

content = content.replace(oldHandleChangePassword.trim(), newHandleChangePassword.trim());

// Render profile errors
content = content.replace(
  'className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"\n                    placeholder="Enter your full name"\n                  />\n                </div>',
  'className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${profileErrors.name ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"}`}\n                    placeholder="Enter your full name"\n                  />\n                  {profileErrors.name && (\n                    <p className="text-sm text-red-500 mt-1">{profileErrors.name[0]}</p>\n                  )}\n                </div>'
);

content = content.replace(
  'Upload a high-res picture. Max size 2MB.\n                  </p>\n                </div>\n              </div>',
  'Upload a high-res picture. Max size 2MB.\n                  </p>\n                  {profileErrors.photo && (\n                    <p className="text-sm text-red-500 mt-1">{profileErrors.photo[0]}</p>\n                  )}\n                </div>\n              </div>'
);

// Render password errors
content = content.replace(
  'className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"\n                  placeholder="Enter current password"\n                />\n              </div>',
  'className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${passwordErrors.oldPassword ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"}`}\n                  placeholder="Enter current password"\n                />\n                {passwordErrors.oldPassword && (\n                  <p className="text-sm text-red-500 mt-1">{passwordErrors.oldPassword[0]}</p>\n                )}\n              </div>'
);

content = content.replace(
  'className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"\n                  placeholder="At least 6 characters"\n                />\n              </div>',
  'className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${passwordErrors.newPassword ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"}`}\n                  placeholder="At least 6 characters"\n                />\n                {passwordErrors.newPassword && (\n                  <p className="text-sm text-red-500 mt-1">{passwordErrors.newPassword[0]}</p>\n                )}\n              </div>'
);

content = content.replace(
  'className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"\n                  placeholder="Re-type new password"\n                />\n              </div>',
  'className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${passwordErrors.confirmPassword ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"}`}\n                  placeholder="Re-type new password"\n                />\n                {passwordErrors.confirmPassword && (\n                  <p className="text-sm text-red-500 mt-1">{passwordErrors.confirmPassword[0]}</p>\n                )}\n              </div>'
);

// Let's rewrite photo error in handlePhotoChange to clear it or use Zod instead of toast directly
const oldHandlePhotoChange = `
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image must be smaller than 2MB");
        return;
      }
      setPhotoFile(file);
`;

const newHandlePhotoChange = `
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileErrors(prev => ({ ...prev, photo: undefined }));
      setPhotoFile(file);
`;

content = content.replace(oldHandlePhotoChange.trim(), newHandlePhotoChange.trim());

fs.writeFileSync(file, content);
console.log("Successfully updated ProfileSettings.tsx!");
