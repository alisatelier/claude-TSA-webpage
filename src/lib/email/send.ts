import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 465),
  secure: true,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

const FROM = "The Spirit Atelier <hello@thespiritatelier.ca>";
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
    await transporter.sendMail({
      from: FROM,
      to: to ?? TEST_RECIPIENT,
      subject,
      html,
    });
    return { success: true };
  } catch (err) {
    console.error("[sendEmail] SMTP error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
