-- AlterTable
ALTER TABLE "Perfil" ADD COLUMN "emailVerifiedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "EmailVerificationToken" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "perfilId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailVerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailVerificationToken_tokenHash_key" ON "EmailVerificationToken"("tokenHash");

-- CreateIndex
CREATE INDEX "EmailVerificationToken_perfilId_idx" ON "EmailVerificationToken"("perfilId");

-- AddForeignKey
ALTER TABLE "EmailVerificationToken" ADD CONSTRAINT "EmailVerificationToken_perfilId_fkey" FOREIGN KEY ("perfilId") REFERENCES "Perfil"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill: existing registered accounts are considered verified
UPDATE "Perfil"
SET "emailVerifiedAt" = NOW()
WHERE "emailUcasal" IS NOT NULL AND "password" IS NOT NULL;
