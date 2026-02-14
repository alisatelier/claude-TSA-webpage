"use server";

import { auth } from "@/lib/auth";
import { renderTemplate } from "@/lib/email/templates";
import { sampleData } from "@/lib/email/sample-data";
import { sendEmail } from "@/lib/email/send";

export async function getPreviewHtml(
  templateId: string
): Promise<{ html?: string; error?: string }> {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Unauthorized" };

  const data = sampleData[templateId];
  if (!data) return { error: "Unknown template" };

  const { html } = renderTemplate(templateId, data);
  return { html };
}

export async function sendTestEmail(
  templateId: string
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

  const data = sampleData[templateId];
  if (!data) return { success: false, error: "Unknown template" };

  const { subject, html } = renderTemplate(templateId, data);
  return sendEmail({ subject: `[TEST] ${subject}`, html });
}
