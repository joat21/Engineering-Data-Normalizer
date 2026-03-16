/*
  Warnings:

  - You are about to drop the `AiExtractionResult` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AiExtractionResult" DROP CONSTRAINT "AiExtractionResult_sourceItemId_fkey";

-- DropTable
DROP TABLE "AiExtractionResult";

-- CreateTable
CREATE TABLE "AiParseResult" (
    "id" UUID NOT NULL,
    "sourceItemId" UUID NOT NULL,
    "sessionId" UUID NOT NULL,
    "targetType" "MappingTargetType" NOT NULL,
    "targetKey" TEXT NOT NULL,
    "rawValue" TEXT NOT NULL,

    CONSTRAINT "AiParseResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AiParseResult_sessionId_sourceItemId_targetKey_key" ON "AiParseResult"("sessionId", "sourceItemId", "targetKey");

-- AddForeignKey
ALTER TABLE "AiParseResult" ADD CONSTRAINT "AiParseResult_sourceItemId_fkey" FOREIGN KEY ("sourceItemId") REFERENCES "StagingImportItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
