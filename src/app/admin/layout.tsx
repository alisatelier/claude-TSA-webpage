import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import AdminSidebar from "./components/AdminSidebar";

export const metadata: Metadata = {
  title: "Admin | Spirit Atelier",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <AdminSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
