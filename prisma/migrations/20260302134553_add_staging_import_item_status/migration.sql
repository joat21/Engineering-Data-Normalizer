/*
  Warnings:

  - The `status` column on the `StagingImportItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ImportItemStatus" AS ENUM ('PENDING', 'TRANSFORMED', 'EDITED_MANUALLY');

-- AlterTable
ALTER TABLE "StagingImportItem" ALTER COLUMN "transformedRow" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "ImportItemStatus" NOT NULL DEFAULT 'PENDING';
