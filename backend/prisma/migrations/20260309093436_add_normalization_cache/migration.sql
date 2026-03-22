-- CreateTable
CREATE TABLE "NormalizationCache" (
    "id" UUID NOT NULL,
    "attributeId" UUID NOT NULL,
    "cleanedValue" TEXT NOT NULL,
    "rawValue" TEXT NOT NULL,
    "normalized" JSONB NOT NULL,

    CONSTRAINT "NormalizationCache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NormalizationCache_cleanedValue_idx" ON "NormalizationCache"("cleanedValue");

-- CreateIndex
CREATE UNIQUE INDEX "NormalizationCache_attributeId_cleanedValue_key" ON "NormalizationCache"("attributeId", "cleanedValue");
