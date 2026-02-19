import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { TEMPLATES } from "@/lib/email/templates";
import { getTestUsers } from "./actions";
import EmailTemplateCard from "./EmailTemplateCard";

export default async function AdminEmailsPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/admin/login");

  const testUsers = await getTestUsers();

  const customerTemplates = TEMPLATES.filter((t) => !t.audience);
  const adminTemplates = TEMPLATES.filter((t) => t.audience === "admin");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Email Templates</h1>

      <h2 className="text-lg font-medium text-gray-700 mb-4">Customer Emails</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {customerTemplates.map((template) => (
          <EmailTemplateCard key={template.id} template={template} testUsers={testUsers} />
        ))}
      </div>

      <h2 className="text-lg font-medium text-gray-700 mb-4">Admin Notifications</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {adminTemplates.map((template) => (
          <EmailTemplateCard key={template.id} template={template} testUsers={testUsers} />
        ))}
      </div>
    </div>
  );
}
