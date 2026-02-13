import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminLoginForm from "./AdminLoginForm";

export default async function AdminLoginPage() {
  const session = await auth();
  if (session?.user?.role === "ADMIN") {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-gray-900 text-center mb-8">
          Admin Login
        </h1>
        <AdminLoginForm />
      </div>
    </div>
  );
}
