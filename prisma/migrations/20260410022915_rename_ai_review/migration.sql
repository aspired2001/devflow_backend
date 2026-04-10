/*
  Warnings:

  - You are about to drop the `AIReview` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "AIReview";

-- CreateTable
CREATE TABLE "AiReview" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "result" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AiReview_projectId_idx" ON "AiReview"("projectId");

-- CreateIndex
CREATE INDEX "AiReview_hash_idx" ON "AiReview"("hash");
