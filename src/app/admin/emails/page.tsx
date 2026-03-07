import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { TEMPLATES } from "@/lib/email/templates";
import { getTestUsers } from "./actions";
import EmailTemplateCard from "./EmailTemplateCard";
import CollapsibleSection from "./CollapsibleSection";

export default async function AdminEmailsPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/admin/login");

  const testUsers = await getTestUsers();

  const customerTemplates = TEMPLATES.filter((t) => !t.audience);
  const adminTemplates = TEMPLATES.filter((t) => t.audience === "admin");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Email Templates</h1>

      <CollapsibleSection title="Customer Emails" count={customerTemplates.length}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customerTemplates.map((template) => (
            <EmailTemplateCard key={template.id} template={template} testUsers={testUsers} />
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Admin Notifications" count={adminTemplates.length}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminTemplates.map((template) => (
            <EmailTemplateCard key={template.id} template={template} testUsers={testUsers} />
          ))}
        </div>
      </CollapsibleSection>
    </div>
  );
}
