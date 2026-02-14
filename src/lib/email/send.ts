import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "The Spirit Atelier <onboarding@resend.dev>";
const TEST_RECIPIENT = process.env.ADMIN_EMAIL ?? "ali.buchwald@proton.me";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to?: string;
  subject: string;
  html: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: to ?? TEST_RECIPIENT,
      subject,
      html,
    });

    if (error) {
      console.error("[sendEmail] Resend error:", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    console.error("[sendEmail] Unexpected error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
