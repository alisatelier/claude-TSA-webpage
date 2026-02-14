-- CreateTable
CREATE TABLE "DownloadLog" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DownloadLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DownloadLog_email_idx" ON "DownloadLog"("email");
