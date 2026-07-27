-- CreateTable
CREATE TABLE "public"."SharedDocument" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "uploaderId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SharedDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SharedDocument_category_idx" ON "public"."SharedDocument"("category");

-- CreateIndex
CREATE INDEX "SharedDocument_title_idx" ON "public"."SharedDocument"("title");

-- AddForeignKey
ALTER TABLE "public"."SharedDocument" ADD CONSTRAINT "SharedDocument_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
