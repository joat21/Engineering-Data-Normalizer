/*
  Warnings:

  - Added the required column `name` to the `Currency` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Currency" ADD COLUMN     "name" TEXT NOT NULL;
