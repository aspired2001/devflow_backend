/*
  Warnings:

  - You are about to drop the column `data` on the `Diagram` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[projectId]` on the table `Diagram` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Diagram" DROP COLUMN "data";

-- CreateTable
CREATE TABLE "Version" (
    "id" TEXT NOT NULL,
    "diagramId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Version_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Diagram_projectId_key" ON "Diagram"("projectId");

-- AddForeignKey
ALTER TABLE "Version" ADD CONSTRAINT "Version_diagramId_fkey" FOREIGN KEY ("diagramId") REFERENCES "Diagram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
