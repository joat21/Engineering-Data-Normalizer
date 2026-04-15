-- AlterTable
ALTER TABLE "Equipment" ADD COLUMN     "searchText" TEXT;

ALTER TABLE "Equipment" 
ADD COLUMN "search_vector" tsvector 
GENERATED ALWAYS AS (
  to_tsvector('russian', coalesce("searchText", ''))
) STORED;

CREATE INDEX "equipment_search_idx" ON "Equipment" USING GIN ("search_vector");