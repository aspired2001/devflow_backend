-- CreateTable
CREATE TABLE "AIReview" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "result" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AIReview_projectId_idx" ON "AIReview"("projectId");

-- CreateIndex
CREATE INDEX "AIReview_hash_idx" ON "AIReview"("hash");
