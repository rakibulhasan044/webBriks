import { cookies } from "next/headers";
import { ProfileSettings } from "@/components/modules/Profile/ProfileSettings";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | WebBriks",
  description: "Manage your profile and account settings",
};

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("currentUser")?.value;
  let user = null;

  if (userCookie) {
    try {
      user = JSON.parse(userCookie);
    } catch (e) {
      console.error("Failed to parse user cookie", e);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Profile Settings
        </h1>
        <p className="text-slate-500">
          Manage your account details and password.
        </p>
      </div>

      <ProfileSettings user={user} />
    </div>
  );
}
