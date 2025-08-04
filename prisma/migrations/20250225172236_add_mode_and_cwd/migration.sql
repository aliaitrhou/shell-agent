-- CreateEnum
CREATE TYPE "Mode" AS ENUM ('Prompt', 'Command');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "cwd" TEXT NOT NULL DEFAULT '~',
ADD COLUMN     "mode" "Mode" NOT NULL DEFAULT 'Prompt';
