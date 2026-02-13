import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import ChangePasswordForm from "./ChangePasswordForm";

export default async function AdminSettingsPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/admin/login");

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Settings</h1>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Change Password
        </h2>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
