import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  const { data, error } = await resend.emails.send({
    from: "Spirit Atelier <onboarding@resend.dev>",
    to: "ali.buchwald@proton.me",
    subject: "Test Email from The Spirit Atelier",
    html: `
      <div style="font-family: Georgia, serif; max-width: 500px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #535B73; font-size: 24px; margin-bottom: 16px;">The Spirit Atelier</h1>
        <p style="color: #535B73; line-height: 1.6;">
          This is a test email confirming that Resend is configured correctly.
        </p>
        <hr style="border: none; border-top: 1px solid #FEDDE8; margin: 24px 0;" />
        <p style="color: #A69FA5; font-size: 13px; font-style: italic;">
          Sent with intention.
        </p>
      </div>
    `,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, id: data?.id });
}
