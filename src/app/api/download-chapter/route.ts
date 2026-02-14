import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

const MAX_DOWNLOADS = 3;
const FILE_NAME = "First Chapter - My Intuition Made Me Do It - TSA.epub";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = (body.email as string)?.toLowerCase().trim();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email is required." },
        { status: 400 }
      );
    }

    const downloadCount = await prisma.downloadLog.count({
      where: { email },
    });

    if (downloadCount >= MAX_DOWNLOADS) {
      return NextResponse.json(
        { error: "Download limit reached. You have used all 3 downloads for this email." },
        { status: 429 }
      );
    }

    await prisma.downloadLog.create({
      data: { email, fileName: FILE_NAME },
    });

    const filePath = path.join(process.cwd(), "content", "downloads", FILE_NAME);
    const fileBuffer = await readFile(filePath);

    const remaining = MAX_DOWNLOADS - downloadCount - 1;

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/epub+zip",
        "Content-Disposition": `attachment; filename="${FILE_NAME}"`,
        "X-Downloads-Remaining": String(remaining),
      },
    });
  } catch (error) {
    console.error("Download chapter error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
