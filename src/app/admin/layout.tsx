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
  const isAuthenticated = !!session?.user;

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {isAuthenticated && <AdminSidebar />}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
