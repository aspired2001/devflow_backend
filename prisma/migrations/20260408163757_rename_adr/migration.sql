/*
  Warnings:

  - You are about to drop the `ADR` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ADR";

-- CreateTable
CREATE TABLE "Adr" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "consequences" TEXT,
    "status" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Adr_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Adr" ADD CONSTRAINT "Adr_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
