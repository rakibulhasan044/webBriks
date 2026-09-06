"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Camera, User, Lock, Save } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { userService } from "@/services/user.service";
import Cookies from "js-cookie";
import { updateProfileSchema, changePasswordSchema } from "@/zod/user.validation";
import { z } from "zod";
import { getImageUrl } from "@/lib/utils";

export function ProfileSettings({ user }: { user: any }) {
  const router = useRouter();
  
  // Tabs: "profile" | "password"
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

  // Profile Form State
  const [name, setName] = useState(user?.name || "");
  const [photoPreview, setPhotoPreview] = useState<string | null>(user?.photo && user.photo !== "null" ? (user.photo.startsWith("data:") ? user.photo : getImageUrl(user.photo)) : null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password Form State
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [profileErrors, setProfileErrors] = useState<{ name?: string[]; photo?: string[] }>({});
  const [passwordErrors, setPasswordErrors] = useState<{ oldPassword?: string[]; newPassword?: string[]; confirmPassword?: string[] }>({});


  // Profile Handlers
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileErrors(prev => ({ ...prev, photo: undefined }));
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
      
      if (res.success && res.data) {
        toast.success("Profile updated successfully");
        
        // Update user cookie
        const updatedUser = { ...user, ...res.data };
        Cookies.set("currentUser", JSON.stringify(updatedUser), { path: '/' });
        
        // Refresh to update layouts
        router.refresh();
      } else {
        toast.error(res.message || "Failed to update profile");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Password Handlers
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
    try {
      const res = await userService.changePassword({ oldPassword, newPassword });
      if (res.success) {
        toast.success("Password changed successfully");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(res.message || "Failed to change password");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[500px]">
      
      {/* Sidebar Tabs */}
      <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-4 space-y-2">
        <button
          onClick={() => setActiveTab("profile")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
            activeTab === "profile" 
              ? "bg-blue-400 text-white shadow-sm" 
              : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
          }`}
        >
          <User className="w-4 h-4" />
          My Profile
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
            activeTab === "password" 
              ? "bg-blue-400 text-white shadow-sm" 
              : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
          }`}
        >
          <Lock className="w-4 h-4" />
          Change Password
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 md:p-8">
        
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="max-w-xl animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Profile Information</h2>
            
            <form onSubmit={handleUpdateProfile} className="space-y-8">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-md ring-1 ring-slate-100">
                    {photoPreview ? (
                      <AvatarImage src={photoPreview} alt="User" className="object-cover" />
                    ) : (
                      <AvatarFallback className="bg-indigo-50 text-indigo-500 text-2xl font-bold">
                        {name ? name.charAt(0).toUpperCase() : <User className="w-8 h-8" />}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">Profile Picture</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Upload a high-res picture. Max size 2MB.
                  </p>
                  {profileErrors.photo && (
                    <p className="text-sm text-red-500 mt-1">{profileErrors.photo[0]}</p>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-slate-700">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${profileErrors.name ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"}`}
                    placeholder="Enter your full name"
                  />
                  {profileErrors.name && (
                    <p className="text-sm text-red-500 mt-1">{profileErrors.name[0]}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-700">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-slate-400">Your email address cannot be changed.</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-linear-to-br from-primary to-indigo-600 text-white font-medium rounded-lg shadow-md shadow-indigo-200/50 hover:bg-indigo-700 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isUpdatingProfile ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === "password" && (
          <div className="max-w-xl animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Change Password</h2>
            
            <form onSubmit={handleChangePassword} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="oldPassword" className="text-sm font-medium text-slate-700">Current Password</label>
                <input
                  id="oldPassword"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${passwordErrors.oldPassword ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"}`}
                  placeholder="Enter current password"
                />
                {passwordErrors.oldPassword && (
                  <p className="text-sm text-red-500 mt-1">{passwordErrors.oldPassword[0]}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-sm font-medium text-slate-700">New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${passwordErrors.newPassword ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"}`}
                  placeholder="At least 6 characters"
                />
                {passwordErrors.newPassword && (
                  <p className="text-sm text-red-500 mt-1">{passwordErrors.newPassword[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">Confirm New Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${passwordErrors.confirmPassword ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"}`}
                  placeholder="Re-type new password"
                />
                {passwordErrors.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">{passwordErrors.confirmPassword[0]}</p>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-linear-to-br from-primary to-indigo-600 text-white font-medium rounded-lg shadow-md shadow-indigo-200/50 hover:bg-indigo-700 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isChangingPassword ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                  Update Password
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
