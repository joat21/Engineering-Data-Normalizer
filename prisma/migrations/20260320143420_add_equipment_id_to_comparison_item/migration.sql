/*
  Warnings:

  - A unique constraint covering the columns `[comparisonId,equipmentId]` on the table `ComparisonItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `equipmentId` to the `ComparisonItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ComparisonItem" ADD COLUMN     "equipmentId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ComparisonItem_comparisonId_equipmentId_key" ON "ComparisonItem"("comparisonId", "equipmentId");

-- AddForeignKey
ALTER TABLE "ComparisonItem" ADD CONSTRAINT "ComparisonItem_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
