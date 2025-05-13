/*
  Warnings:

  - You are about to drop the `Client` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IntakeAnswer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IntakeQuestion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_userId_fkey";

-- DropForeignKey
ALTER TABLE "IntakeAnswer" DROP CONSTRAINT "IntakeAnswer_clientId_fkey";

-- DropForeignKey
ALTER TABLE "IntakeAnswer" DROP CONSTRAINT "IntakeAnswer_questionId_fkey";

-- DropTable
DROP TABLE "Client";

-- DropTable
DROP TABLE "IntakeAnswer";

-- DropTable
DROP TABLE "IntakeQuestion";

-- DropTable
DROP TABLE "User";
