import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "Spirit Atelier <onboarding@resend.dev>";
const TEST_RECIPIENT = "ali.buchwald@proton.me";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to?: string;
  subject: string;
  html: string;
}): Promise<{ success: boolean; error?: string }> {
  const { error } = await resend.emails.send({
    from: FROM,
    to: to ?? TEST_RECIPIENT,
    subject,
    html,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}
