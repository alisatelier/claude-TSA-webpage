import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { TEMPLATES } from "@/lib/email/templates";
import { getTestUsers } from "./actions";
import EmailTemplateCard from "./EmailTemplateCard";

export default async function AdminEmailsPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/admin/login");

  const testUsers = await getTestUsers();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Email Templates</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TEMPLATES.map((template) => (
          <EmailTemplateCard key={template.id} template={template} testUsers={testUsers} />
        ))}
      </div>
    </div>
  );
}
