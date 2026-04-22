/*
  Warnings:

  - You are about to drop the column `search_vector` on the `Equipment` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "equipment_search_idx";

-- AlterTable
ALTER TABLE "Equipment" DROP COLUMN "search_vector",
ADD COLUMN     "currencyId" UUID;

-- CreateTable
CREATE TABLE "Currency" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "rate" DECIMAL(14,4) NOT NULL,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Currency_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Currency_code_key" ON "Currency"("code");

-- AddForeignKey
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currency"("id") ON DELETE SET NULL ON UPDATE CASCADE;
