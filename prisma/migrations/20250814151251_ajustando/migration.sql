/*
  Warnings:

  - You are about to drop the column `isPrioriry` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Task" DROP COLUMN "isPrioriry",
ADD COLUMN     "isPriority" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "status" SET DEFAULT true;
