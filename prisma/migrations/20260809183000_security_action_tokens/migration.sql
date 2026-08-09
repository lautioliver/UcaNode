-- CreateEnum
CREATE TYPE "SecurityActionType" AS ENUM ('PASSWORD_CHANGE', 'EMAIL_CHANGE');

-- AlterTable
ALTER TABLE "Perfil" ADD COLUMN "sessionVersion" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "SecurityActionToken" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "perfilId" TEXT NOT NULL,
    "type" "SecurityActionType" NOT NULL,
    "payload" JSONB,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SecurityActionToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SecurityActionToken_tokenHash_key" ON "SecurityActionToken"("tokenHash");

-- CreateIndex
CREATE INDEX "SecurityActionToken_perfilId_type_idx" ON "SecurityActionToken"("perfilId", "type");

-- AddForeignKey
ALTER TABLE "SecurityActionToken" ADD CONSTRAINT "SecurityActionToken_perfilId_fkey" FOREIGN KEY ("perfilId") REFERENCES "Perfil"("id") ON DELETE CASCADE ON UPDATE CASCADE;
