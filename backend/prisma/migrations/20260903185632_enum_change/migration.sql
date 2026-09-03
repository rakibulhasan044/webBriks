/*
  Warnings:

  - The values [EDITOR,VIEWER] on the enum `BoardRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BoardRole_new" AS ENUM ('OWNER', 'MEMBER');
ALTER TABLE "public"."board_members" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "board_members" ALTER COLUMN "role" TYPE "BoardRole_new" USING ("role"::text::"BoardRole_new");
ALTER TYPE "BoardRole" RENAME TO "BoardRole_old";
ALTER TYPE "BoardRole_new" RENAME TO "BoardRole";
DROP TYPE "public"."BoardRole_old";
ALTER TABLE "board_members" ALTER COLUMN "role" SET DEFAULT 'MEMBER';
COMMIT;

-- AlterTable
ALTER TABLE "board_members" ALTER COLUMN "role" SET DEFAULT 'MEMBER';
