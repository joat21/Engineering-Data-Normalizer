/*
  Warnings:

  - You are about to drop the column `target` on the `AiExtractionResult` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sessionId,sourceItemId,targetKey]` on the table `AiExtractionResult` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `targetKey` to the `AiExtractionResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AiExtractionResult" DROP COLUMN "target",
ADD COLUMN     "targetKey" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AiExtractionResult_sessionId_sourceItemId_targetKey_key" ON "AiExtractionResult"("sessionId", "sourceItemId", "targetKey");
